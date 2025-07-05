// https://cssify.appspot.com/
const clockPopupSelectors = {
  bottomButton:
    "html > body > div:nth-of-type(7) > div > div > div:nth-of-type(2) > div > button",
  stopWatch:
    "html > body > div:nth-of-type(7) > div > div > div:nth-of-type(1) > div:nth-of-type(1)",
  timer:
    "html > body > div:nth-of-type(7) > div > div > div:nth-of-type(1) > div:nth-of-type(2)",
  divContainer: "html > body > div:nth-of-type(7) > div > div",
  timerHourInput:
    "html > body > div:nth-of-type(7) > div > div > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(1) > input",
  timerMinuteInput:
    "html > body > div:nth-of-type(7) > div > div > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(2) > input",
};

const codeResetPopupSelectors = {
  cancelButton:
    "html > body > div:nth-of-type(1) > div:nth-of-type(2) > div > div > div:nth-of-type(4) > div > div > div:nth-of-type(8) > div > div:nth-of-type(1) > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div > div:nth-of-type(1) > button",
  confirmButton:
    "html > body > div:nth-of-type(1) > div:nth-of-type(2) > div > div > div:nth-of-type(4) > div > div > div:nth-of-type(8) > div > div:nth-of-type(1) > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div > div:nth-of-type(2) > button",
  backdrop:
    "html > body > div:nth-of-type(1) > div:nth-of-type(2) > div > div > div:nth-of-type(4) > div > div > div:nth-of-type(8) > div > div:nth-of-type(1) > div:nth-of-type(2) > div > div > div:nth-of-type(1)",
  heading:
    "html > body > div:nth-of-type(1) > div:nth-of-type(2) > div > div > div:nth-of-type(4) > div > div > div:nth-of-type(8) > div > div:nth-of-type(1) > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div > div:nth-of-type(1) > div > h3",
  paragraph:
    "html > body > div:nth-of-type(1) > div:nth-of-type(2) > div > div > div:nth-of-type(4) > div > div > div:nth-of-type(8) > div > div:nth-of-type(1) > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div > div:nth-of-type(1) > div > div",
};

const clockDivSelector =
  "html > body > div:nth-of-type(1) > div:nth-of-type(2) > div > div > div:nth-of-type(3) > nav > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(4) > div > div";
const clockResetSelector =
  "html > body > div:nth-of-type(1) > div:nth-of-type(2) > div > div > div:nth-of-type(3) > nav > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(4) > div > div > div:nth-of-type(1) > div > div:nth-of-type(3)";
const codeResetSelector =
  "html > body > div:nth-of-type(1) > div:nth-of-type(2) > div > div > div:nth-of-type(4) > div > div > div:nth-of-type(8) > div > div:nth-of-type(1) > div:nth-of-type(2) > button:nth-of-type(4)";
const difficultyChip =
  "html > body > div:nth-of-type(1) > div:nth-of-type(2) > div > div > div:nth-of-type(4) > div > div > div:nth-of-type(4) > div > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1)";
const solvedStatus =
  "html > body > div:nth-of-type(1) > div:nth-of-type(2) > div > div > div:nth-of-type(4) > div > div > div:nth-of-type(4) > div > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2)";
