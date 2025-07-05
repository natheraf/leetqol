console.log("This is LeetQOL!");

let timerValue = null;
const timerInputOnBlur = (event) => {
  const diff = event.target.id.split("-")[0];
  const hrInput = document.getElementById(`${diff}-hr-textfield`);
  const minInput = document.getElementById(`${diff}-min-textfield`);
  const hrTextValue = hrInput.value;
  const minTextValue = minInput.value;
  const hrValue = isNaN(parseInt(hrTextValue))
    ? 0
    : Math.max(0, parseInt(hrTextValue));
  let minValue = isNaN(parseInt(minTextValue))
    ? 20
    : Math.max(0, Math.min(59, parseInt(minTextValue)));
  let totalValue = hrValue * 60 + minValue;
  if (totalValue === 0) {
    totalValue = 20;
    minValue = 20;
  }
  hrInput.value = hrValue;
  minInput.value = minValue;
  timerValue = {
    ...timerValue,
    [diff]: totalValue,
  };
  chrome.storage.local.set({
    timer: timerValue,
  });
};

let power = true;
const getPower = () =>
  new Promise((resolve, _reject) =>
    chrome.storage.local.get("power").then((res) => {
      res = res.power;
      if (res === undefined) {
        res = true;
      }
      power = res;
      chrome.storage.local
        .set({
          power,
        })
        .then(resolve);
    })
  );

let showSolvedInPrompt = false;
const getShowSolvedInPrompt = () =>
  new Promise((resolve, _reject) =>
    chrome.storage.local.get("showSolvedInPrompt").then((res) => {
      res = res.showSolvedInPrompt;
      if (res === undefined) {
        res = false;
      }
      showSolvedInPrompt = res;
      chrome.storage.local.set({ showSolvedInPrompt }).then(resolve);
    })
  );

const showSolvedInPromptOnChange = (event) =>
  new Promise((resolve, _reject) => {
    const checked = event.target.checked;
    showSolvedInPrompt = checked;
    chrome.storage.local.set({ showSolvedInPrompt }).then(resolve);
  });

let hideProblemIsSolved = false;
const getHideProblemIsSolved = () =>
  new Promise((resolve, _reject) =>
    chrome.storage.local.get("hideProblemIsSolved").then((res) => {
      res = res.hideProblemIsSolved;
      if (res === undefined) {
        res = false;
      }
      hideProblemIsSolved = res;
      chrome.storage.local.set({ hideProblemIsSolved }).then(resolve);
    })
  );

const hideProblemIsSolvedOnChange = (event) =>
  new Promise((resolve, _reject) => {
    const checked = event.target.checked;
    hideProblemIsSolved = checked;
    const showSolvedInPromptCheckbox = document.getElementById(
      "show-solved-in-prompt-checkbox"
    );
    showSolvedInPromptCheckbox.disabled = hideProblemIsSolved;
    chrome.storage.local.set({ hideProblemIsSolved }).then(resolve);
  });

let autoResetType = "prompt";
const getAutoResetType = () =>
  new Promise((resolve, _reject) =>
    chrome.storage.local.get("autoResetType").then((res) => {
      res = res.autoResetType;
      if (res === undefined) {
        res = "prompt";
      }
      autoResetType = res;
      chrome.storage.local
        .set({
          autoResetType,
        })
        .then(resolve);
    })
  );

const autoResetTypeRadioOnChange = (event) =>
  new Promise((resolve, _reject) => {
    const type = event.target.id.split("-")[1];
    autoResetType = type;
    chrome.storage.local.set({ autoResetType }).then(resolve);
  });

const loadAllLocalData = () =>
  new Promise((resolve, reject) => {
    Promise.all([
      getPower(),
      getAutoResetType(),
      getShowSolvedInPrompt(),
      getHideProblemIsSolved(),
    ]).then(resolve);
  });

const togglePower = () => {
  power = !power;
  chrome.storage.local.set({
    power,
  });
  document.getElementById("main-div").style.display = power ? "unset" : "none";
  document.getElementById("power-off").style.display = power ? "none" : "unset";
};

const documentOnLoad = () => {
  chrome.storage.local.get("timer").then((res) => {
    res = res.timer;
    if (!res || Object.keys(res).length === 0) {
      chrome.storage.local.set({
        timer: { easy: 10, medium: 15, hard: 20 },
      });
      res = { easy: 10, medium: 15, hard: 20 };
    }
    timerValue = res;
    ["easy", "medium", "hard"].forEach((diff) => {
      const values = [Math.floor(res[diff] / 60), Math.floor(res[diff] % 60)];
      const valueIndex = ["hr", "min"];
      ["hr", "min"].forEach((time) => {
        const inputElement = document.getElementById(
          `${diff}-${time}-textfield`
        );
        inputElement.value = values[valueIndex.indexOf(time)];
        inputElement.addEventListener("blur", timerInputOnBlur);
      });
    });
  });

  document
    .getElementById("power-toggle-btn")
    .addEventListener("click", togglePower);
  if (power === false) {
    document.getElementById("main-div").style.display = "none";
    document.getElementById("power-off").style.display = "unset";
  }
  ["prompt", "code", "stopwatch", "timer"].forEach((type) => {
    const radioElement = document.getElementById(`reset-${type}-radio`);
    if (autoResetType === type) {
      radioElement.checked = true;
    }
    radioElement.addEventListener("change", autoResetTypeRadioOnChange);
  });

  const showSolvedInPromptCheckbox = document.getElementById(
    "show-solved-in-prompt-checkbox"
  );
  showSolvedInPromptCheckbox.checked = showSolvedInPrompt;
  showSolvedInPromptCheckbox.disabled = hideProblemIsSolved;
  showSolvedInPromptCheckbox.addEventListener(
    "change",
    showSolvedInPromptOnChange
  );

  const hideProblemIsSolvedCheckbox = document.getElementById(
    "hide-solved-status-checkbox"
  );
  hideProblemIsSolvedCheckbox.checked = hideProblemIsSolved;
  hideProblemIsSolvedCheckbox.addEventListener(
    "change",
    hideProblemIsSolvedOnChange
  );
};

document.addEventListener(
  "DOMContentLoaded",
  () => loadAllLocalData().then(documentOnLoad),
  false
);
