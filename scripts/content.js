let currentProblem = null;

function waitForElm(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((_mutations, observer) => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

const fixClockDivWidth = () => {
  const clockElement = document.querySelector(clockDivSelector);
  clockElement.style.width = "122px";
};

const handleClickBottomButton = () => {
  waitForElm(clockPopupSelectors.bottomButton).then((el) => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.target.textContent === "Start Stopwatch" ||
          mutation.target.textContent === "Start Timer"
        ) {
          const startButton = document.querySelector(
            clockPopupSelectors.bottomButton
          );
          startButton.click();
          setTimeout(fixClockDivWidth, 300);
        }
      });
    });
    observer.observe(document.querySelector(clockPopupSelectors.divContainer), {
      childList: true,
      subtree: true,
    });
    el.click();
  });
};

const handleSelectStopWatch = () => {
  waitForElm(clockPopupSelectors.stopWatch).then((el) => {
    el.click();
    handleClickBottomButton();
  });
};

function changeValue(input, value) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  ).set;
  nativeInputValueSetter.call(input, value);

  const inputEvent = new Event("input", { bubbles: true });
  input.dispatchEvent(inputEvent);
}

const handleSelectTimer = () => {
  waitForElm(clockPopupSelectors.timer).then((el) => {
    el.click();
    chrome.storage.local.get("timer").then((res) => {
      res = res.timer;
      if (!res || Object.keys(res).length === 0) {
        chrome.storage.local.set({
          timer: { easy: 10, medium: 15, hard: 20 },
        });
        res = { easy: 10, medium: 15, hard: 20 };
      }
      const difficultyValue = document
        .querySelector(difficultyChip)
        .textContent.toLowerCase();
      const timerValue = res[difficultyValue];
      const hrValue = Math.floor(parseInt(timerValue) / 60);
      const minValue = parseInt(timerValue) % 60;
      changeValue(
        document.querySelector(clockPopupSelectors.timerHourInput),
        hrValue.toString()
      );
      changeValue(
        document.querySelector(clockPopupSelectors.timerMinuteInput),
        minValue.toString()
      );
      handleClickBottomButton();
    });
  });
};

let clockOption = "stopwatch";
const handleClickClockReset = () => {
  waitForElm(clockResetSelector).then((el) => {
    el.click();
    if (clockOption === "stopwatch") {
      handleSelectStopWatch();
    } else if (clockOption === "timer") {
      handleSelectTimer();
    }
  });
};

const main = () => {
  const clearClickListeners = () => {
    const resetCodeOnlyButton = document.getElementById(
      "confirm-and-reset-code-button"
    );
    const timerButton = document.getElementById("confirm-and-timer-button");
    const cancelButton = document.querySelector(
      codeResetPopupSelectors.cancelButton
    );
    const stopwatchButton = document.getElementById(
      "confirm-and-stopwatch-button"
    );
    cancelButton.removeEventListener("click", onClickCanceled);
    stopwatchButton.removeEventListener("click", () => onClickRestartStopwatch);
    timerButton?.removeEventListener("click", () => onClickStartTimer);
    resetCodeOnlyButton.addEventListener("click", onClickResetCodeOnly);
  };

  const clickConfirmButton = () => {
    const confirmButton = document.querySelector(
      codeResetPopupSelectors.confirmButton
    );
    confirmButton.click();
  };

  const onClickCanceled = () => {
    console.log("pressed canceled");
    clearClickListeners();
  };

  const onClickRestartStopwatch = () => {
    console.log("pressed confirm");
    clickConfirmButton();
    clearClickListeners();
    handleClickClockReset();
  };

  const onClickStartTimer = () => {
    console.log("pressed timer");
    clockOption = "timer";
    clickConfirmButton();
    clearClickListeners();
    handleClickClockReset();
  };

  const onClickResetCodeOnly = () => {
    console.log("pressed reset code only");
    clickConfirmButton();
    clearClickListeners();
  };

  const editResetCodePopup = (backdrop) =>
    new Promise((resolve, reject) => {
      backdrop.style.backgroundColor = "black";
      document.querySelector(codeResetPopupSelectors.heading).innerHTML =
        "Reset code and clock?";
      const confirmButton = document.querySelector(
        codeResetPopupSelectors.confirmButton
      );
      confirmButton.parentElement.style.display = "none";
      const buttonContainer = confirmButton.parentElement.parentElement;

      const stopwatchButtonDiv = document.createElement("div");
      stopwatchButtonDiv.style.margin = "8px";

      const stopwatchButton = document.createElement("button");
      stopwatchButtonDiv.append(stopwatchButton);
      stopwatchButton.setAttribute(
        "class",
        "px-3 py-1.5 font-medium items-center whitespace-nowrap focus:outline-none inline-flex text-label-r bg-blue-1 dark:bg-blue-1 hover:bg-blue-10 dark:hover:bg-blue-10 rounded-lg"
      );
      stopwatchButton.innerHTML = "Reset Stopwatch Too";
      stopwatchButton.id = "confirm-and-stopwatch-button";
      buttonContainer.append(stopwatchButtonDiv);

      const resetCodeOnlyButtonDiv = document.createElement("div");
      resetCodeOnlyButtonDiv.style.margin = "8px";

      const resetCodeOnlyButton = document.createElement("button");
      resetCodeOnlyButtonDiv.append(resetCodeOnlyButton);
      resetCodeOnlyButton.setAttribute(
        "class",
        "px-3 py-1.5 font-medium items-center whitespace-nowrap focus:outline-none inline-flex text-label-r bg-green-s dark:bg-dark-green-s hover:bg-green-3 dark:hover:bg-dark-green-3 rounded-lg"
      );
      resetCodeOnlyButton.innerHTML = "Reset Code Only";
      resetCodeOnlyButton.id = "confirm-and-reset-code-button";
      buttonContainer.append(resetCodeOnlyButtonDiv);

      const resetPopupContainer =
        confirmButton.parentElement.parentElement.parentElement.parentElement
          .parentElement;

      const difficultyValue = document
        .querySelector(difficultyChip)
        .textContent.toLowerCase();
      const difficultyElement =
        document.querySelector(difficultyChip).outerHTML;
      const timerDescription = document.createElement("p");
      timerDescription.style.marginTop = "16px";
      timerDescription.style.justifySelf = "end";
      chrome.storage.local.get("timer").then((res) => {
        res = res.timer;
        if (!res || Object.keys(res).length === 0) {
          chrome.storage.local.set({
            timer: { easy: 10, medium: 15, hard: 20 },
          });
          res = { easy: 10, medium: 15, hard: 20 };
        }
        const timerValue = res[difficultyValue];
        const hrValue = Math.floor(parseInt(timerValue) / 60);
        const minValue = parseInt(timerValue) % 60;
        const hourWord = hrValue === 1 ? "hour" : "hours";
        timerDescription.innerHTML =
          hrValue === 0 ? "" : `${hrValue} ${hourWord} and `;
        timerDescription.innerHTML += `${minValue} minutes set for ${difficultyElement}`;
        resetPopupContainer.append(timerDescription);

        const timerButtonDiv = document.createElement("div");
        timerButtonDiv.style.marginTop = "8px";
        timerButtonDiv.style.justifySelf = "end";

        const timerButton = document.createElement("button");
        timerButtonDiv.append(timerButton);
        timerButton.setAttribute(
          "class",
          "px-3 py-1.5 font-medium items-center whitespace-nowrap focus:outline-none inline-flex text-label-r bg-yellow-1 dark:bg-yellow-1 hover:bg-yellow-10 dark:hover:bg-yellow-10 rounded-lg"
        );
        timerButton.innerHTML = "Start Timer Too";
        timerButton.id = "confirm-and-timer-button";
        resetPopupContainer.append(timerButtonDiv);
        resolve();
      });
    });

  waitForElm(codeResetSelector).then((resetButton) => {
    resetButton.click();
    waitForElm(codeResetPopupSelectors.backdrop).then((backdrop) => {
      editResetCodePopup(backdrop).then(() => {
        const cancelButton = document.querySelector(
          codeResetPopupSelectors.cancelButton
        );
        const stopwatchButton = document.getElementById(
          "confirm-and-stopwatch-button"
        );
        const timerButton = document.getElementById("confirm-and-timer-button");
        const resetCodeOnlyButton = document.getElementById(
          "confirm-and-reset-code-button"
        );
        clockOption = "stopwatch";
        cancelButton.addEventListener("click", onClickCanceled);
        stopwatchButton.addEventListener("click", onClickRestartStopwatch);
        timerButton.addEventListener("click", onClickStartTimer);
        resetCodeOnlyButton.addEventListener("click", onClickResetCodeOnly);
      });
    });
  });
};

const isNewProblem = () => {
  const problemOnScreen = location.href.split("/")[4] ?? null;
  const res = currentProblem !== problemOnScreen;
  currentProblem = problemOnScreen;
  return res;
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "problem on screen") {
    console.log("url changed, problem on screen");
    if (isNewProblem()) {
      main();
    }
  }
});

if (location.href.startsWith("https://leetcode.com/problems/")) {
  if (isNewProblem()) {
    main();
  }
}
