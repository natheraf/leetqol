console.log("This is LeetQOL!");

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
  timer = {
    ...timer,
    [diff]: totalValue,
  };
  setDataFromLocal("timer", timer);
};

const showSolvedInPromptOnChange = (event) =>
  new Promise((resolve, _reject) => {
    const checked = event.target.checked;
    showSolvedInPrompt = checked;
    setDataFromLocal("showSolvedInPrompt", showSolvedInPrompt).then(resolve);
  });

const hideProblemIsSolvedOnChange = (event) =>
  new Promise((resolve, _reject) => {
    const checked = event.target.checked;
    hideProblemIsSolved = checked;
    const showSolvedInPromptCheckbox = document.getElementById(
      "show-solved-in-prompt-checkbox"
    );
    showSolvedInPromptCheckbox.disabled = hideProblemIsSolved;
    setDataFromLocal("hideProblemIsSolved", hideProblemIsSolved).then(resolve);
  });

const autoResetTypeRadioOnChange = (event) =>
  new Promise((resolve, _reject) => {
    const type = event.target.id.split("-")[1];
    autoResetType = type;
    setDataFromLocal("autoResetType", autoResetType).then(resolve);
  });

const togglePower = () => {
  power = !power;
  setDataFromLocal("power", power);
  document.getElementById("main-div").style.display = power ? "unset" : "none";
  document.getElementById("power-off").style.display = power ? "none" : "unset";
};

const documentOnLoad = () => {
  ["easy", "medium", "hard"].forEach((diff) => {
    const values = [Math.floor(timer[diff] / 60), Math.floor(timer[diff] % 60)];
    const valueIndex = ["hr", "min"];
    ["hr", "min"].forEach((time) => {
      const inputElement = document.getElementById(`${diff}-${time}-textfield`);
      inputElement.value = values[valueIndex.indexOf(time)];
      inputElement.addEventListener("blur", timerInputOnBlur);
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
  () => assignAllLocalData().then(documentOnLoad),
  false
);
