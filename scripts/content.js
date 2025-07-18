let currentProblem = null;

const waitForElm = (selector) =>
  new Promise((resolve) => {
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

const fixClockDivWidth = () => {
  const clockElement = document.querySelector(clockDivSelector);
  clockElement.style.width = "122px";
};

const getNthParent = (element, n) => {
  let it = element;
  while (it && n > 0) {
    it = it.parentElement;
    n -= 1;
  }
  return it;
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

const changeValue = (input, value) => {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  ).set;
  nativeInputValueSetter.call(input, value);

  const inputEvent = new Event("input", { bubbles: true });
  input.dispatchEvent(inputEvent);
};

const simulateMouseClick = (element) => {
  const mouseClickEvents = ["mousedown", "click", "mouseup"];
  mouseClickEvents.forEach((mouseEventType) =>
    element.dispatchEvent(
      new MouseEvent(mouseEventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 1,
      })
    )
  );
};

const getDifficultyChip = () => {
  const easyChip = difficultyChipClasses.easy;
  const mediumChip = difficultyChipClasses.medium;
  const hardChip = difficultyChipClasses.hard;
  return [easyChip, mediumChip, hardChip]
    .map((chip) => document.getElementsByClassName(chip)[0])
    .find((e) => e);
};

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
      const difficultyElement = getDifficultyChip();
      const difficultyValue = difficultyElement.textContent.toLowerCase();
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

let initFinished = false;
const toggleInit = () => {
  waitForElm("html > body > div:nth-of-type(1) > div:nth-of-type(2)").then(
    (mainDiv) => {
      mainDiv.style.visibility = initFinished ? "visible" : "hidden";
      initFinished = !initFinished;
    }
  );
};

const main = () => {
  if (!power) {
    return;
  }
  let descriptionButton = null,
    cancelButton = null,
    confirmButton = null,
    stopwatchButton = null,
    timerButton = null,
    resetCodeOnlyButton = null;

  const clearClickListeners = () => {
    simulateMouseClick(descriptionButton);
    cancelButton.removeEventListener("click", onClickCanceled);
    stopwatchButton.removeEventListener("click", () => onClickRestartStopwatch);
    timerButton?.removeEventListener("click", () => onClickStartTimer);
    resetCodeOnlyButton.addEventListener("click", onClickResetCodeOnly);
  };

  const clickConfirmButton = () => {
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

  const handleSolutionsTab = () =>
    new Promise((resolve, _reject) => {
      if (hideProblemIsSolved) {
        waitForElm(dPathSelectors.solutions).then((solutions) => {
          const solutionsTab = getNthParent(solutions, 5);
          simulateMouseClick(solutionsTab);
          waitForElm(dPathSelectors.shareMySolutions).then(
            (shareMySolutions) => {
              const shareMySolutionsButton = getNthParent(shareMySolutions, 3);
              let it = shareMySolutionsButton.previousSibling;
              while (it) {
                it.style.display = "none";
                it = it.previousSibling;
              }
              simulateMouseClick(descriptionButton);
              console.log("test");
              resolve();
            }
          );
        });
      } else {
        resolve();
      }
    });

  const handleSubmissionsTab = () =>
    new Promise((resolve, _reject) => {
      if (hideProblemIsSolved) {
        waitForElm(dPathSelectors.submission).then((submission) => {
          const submissionsTab = getNthParent(submission, 5);
          submissionsTab.style.display = "none";
          resolve();
        });
      } else {
        resolve();
      }
    });

  const handleSolvedStatus = () =>
    new Promise((resolve, _reject) => {
      if (hideProblemIsSolved) {
        const easyChip = `.${difficultyChipClasses.easy}`;
        const mediumChip = `.${difficultyChipClasses.medium}`;
        const hardChip = `.${difficultyChipClasses.hard}`;
        const promises = [easyChip, mediumChip, hardChip].map((difficulty) =>
          waitForElm(difficulty)
        );
        Promise.any(promises).then(() => {
          waitForElm(dPathSelectors.solved).then((solvedStatusPathElement) => {
            getNthParent(solvedStatusPathElement, 2).style.display = "none";
          });
          resolve();
        });
      } else {
        resolve();
      }
    });

  const editResetCodePopup = (backdrop) =>
    new Promise((resolve, reject) => {
      backdrop.style.backgroundColor = "black";
      const textDiv = backdrop.nextSibling.firstChild.firstChild.childNodes[1];
      const buttonDiv =
        backdrop.nextSibling.firstChild.childNodes[1].firstChild.firstChild;
      cancelButton = buttonDiv.firstChild.firstChild;
      confirmButton = buttonDiv.childNodes[1].firstChild;
      const headingElement = textDiv.firstChild;
      headingElement.innerHTML = "Reset code and clock?";

      if (hideProblemIsSolved === false && showSolvedInPrompt) {
        const solvedStatusElement = getNthParent(
          document.querySelector(dPathSelectors.solved),
          2
        )?.cloneNode(true);
        const isSolvedDiv = document.createElement("div");
        textDiv.prepend(isSolvedDiv);
        const isSolvedText = document.createElement("div");
        isSolvedDiv.append(isSolvedText);
        isSolvedDiv.style.display = "flex";
        isSolvedDiv.style.flexDirection = "row";
        isSolvedDiv.style.gap = ".5rem";
        isSolvedText.setAttribute(
          "class",
          "text-label-2 dark:text-dark-label-2 mt-2"
        );
        isSolvedText.innerHTML = `This problem is ${
          solvedStatusElement ? "" : "not solved ❌"
        }`;
        if (solvedStatusElement) {
          solvedStatusElement.id = null;
          solvedStatusElement.style.paddingTop = "9px";
          isSolvedDiv.append(solvedStatusElement);
        }
      }

      confirmButton.parentElement.style.display = "none";

      const stopwatchButtonDiv = document.createElement("div");
      stopwatchButtonDiv.style.margin = "8px";

      stopwatchButton = document.createElement("button");
      stopwatchButtonDiv.append(stopwatchButton);
      stopwatchButton.setAttribute(
        "class",
        "px-3 py-1.5 font-medium items-center whitespace-nowrap focus:outline-none inline-flex text-label-r bg-blue-1 dark:bg-blue-1 hover:bg-blue-10 dark:hover:bg-blue-10 rounded-lg"
      );
      stopwatchButton.innerHTML = "Reset Stopwatch Too";
      stopwatchButton.id = "confirm-and-stopwatch-button";
      buttonDiv.append(stopwatchButtonDiv);

      const resetCodeOnlyButtonDiv = document.createElement("div");
      resetCodeOnlyButtonDiv.style.margin = "8px";

      resetCodeOnlyButton = document.createElement("button");
      resetCodeOnlyButtonDiv.append(resetCodeOnlyButton);
      resetCodeOnlyButton.setAttribute(
        "class",
        "px-3 py-1.5 font-medium items-center whitespace-nowrap focus:outline-none inline-flex text-label-r bg-green-s dark:bg-dark-green-s hover:bg-green-3 dark:hover:bg-dark-green-3 rounded-lg"
      );
      resetCodeOnlyButton.innerHTML = "Reset Code Only";
      resetCodeOnlyButton.id = "confirm-and-reset-code-button";
      buttonDiv.append(resetCodeOnlyButtonDiv);

      const resetPopupContainer = backdrop.nextSibling.firstChild;

      const difficultyElement = getDifficultyChip();
      const difficultyValue = difficultyElement.textContent.toLowerCase();
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
        timerDescription.innerHTML += `${minValue} minutes set for ${difficultyElement.outerHTML}`;
        resetPopupContainer.append(timerDescription);

        const timerButtonDiv = document.createElement("div");
        timerButtonDiv.style.marginTop = "8px";
        timerButtonDiv.style.justifySelf = "end";

        timerButton = document.createElement("button");
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

  toggleInit();
  waitForElm(dPathSelectors.description).then((descriptionPath) => {
    descriptionButton = getNthParent(descriptionPath, 4);
    simulateMouseClick(descriptionButton);
    handleSolvedStatus().then(() => {
      waitForElm(dPathSelectors.codeReset).then((resetButtonSVG) => {
        getNthParent(resetButtonSVG, 3).click();
        waitForElm(dPathSelectors.resetInformationIcon).then((el) => {
          const backdrop = document.getElementsByClassName(
            "fixed inset-0 bg-black/70 opacity-100"
          )[0];
          editResetCodePopup(backdrop).then(() => {
            handleSolutionsTab().then(() =>
              handleSubmissionsTab().then(() => {
                toggleInit();
                if (autoResetType === "code") {
                  onClickResetCodeOnly();
                } else if (autoResetType === "stopwatch") {
                  onClickRestartStopwatch();
                } else if (autoResetType === "timer") {
                  onClickStartTimer();
                } else if (autoResetType === "prompt") {
                  const resetCodeOnlyButton = document.getElementById(
                    "confirm-and-reset-code-button"
                  );
                  clockOption = "stopwatch";
                  cancelButton.addEventListener("click", onClickCanceled);
                  stopwatchButton.addEventListener(
                    "click",
                    onClickRestartStopwatch
                  );
                  timerButton.addEventListener("click", onClickStartTimer);
                  resetCodeOnlyButton.addEventListener(
                    "click",
                    onClickResetCodeOnly
                  );
                }
              })
            );
          });
        });
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "problem on screen") {
    console.log("url changed, problem on screen");
    if (isNewProblem()) {
      assignAllLocalData().then(main);
    }
  } else if (request.message === "clear all local code") {
    indexedDB.databases().then((databases) =>
      clearObjectStore(
        "LeetCode-problems",
        databases.find((db) => db.name === "LeetCode-problems").version,
        "problem_code"
      ).then(() => {
        console.log("clear all local code");
        chrome.runtime.sendMessage({
          message: "close me",
          tabId: request.tabId,
        });
      })
    );
  }
});

if (location.href.startsWith("https://leetcode.com/problems/")) {
  if (isNewProblem()) {
    assignAllLocalData().then(main);
  }
}
