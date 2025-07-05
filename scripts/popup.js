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
      console.log(power);
      chrome.storage.local
        .set({
          power,
        })
        .then(resolve);
    })
  );

const loadAllLocalData = () =>
  new Promise((resolve, reject) => {
    Promise.all([getPower()]).then(resolve);
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
  loadAllLocalData().then(() => {
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
  });
};

document.addEventListener("DOMContentLoaded", documentOnLoad, false);
