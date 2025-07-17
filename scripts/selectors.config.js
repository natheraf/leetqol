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

const dPathSelectors = {
  description:
    "path[d='M64 48c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H64zM0 64C0 28.7 28.7 0 64 0H320c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm120 64H264c13.3 0 24 10.7 24 24s-10.7 24-24 24H120c-13.3 0-24-10.7-24-24s10.7-24 24-24zm0 96H264c13.3 0 24 10.7 24 24s-10.7 24-24 24H120c-13.3 0-24-10.7-24-24s10.7-24 24-24zm0 96h48c13.3 0 24 10.7 24 24s-10.7 24-24 24H120c-13.3 0-24-10.7-24-24s10.7-24 24-24z']",
};

const submissionTabSelectors = {
  submissionsListDiv:
    "html > body > div:nth-of-type(1) > div:nth-of-type(2) > div > div > div:nth-of-type(4) > div > div > div:nth-of-type(7) > div > div:nth-of-type(2)",
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
