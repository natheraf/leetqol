const defaultValues = {
  power: true,
  autoResetType: "prompt",
  showSolvedInPrompt: false,
  hideProblemIsSolved: false,
  timer: { easy: 10, medium: 15, hard: 20 },
  hideClock: false,
};

const getDataFromLocal = (key) =>
  new Promise((resolve, reject) =>
    chrome.storage.local.get(key).then((res) => {
      if (res[key] === undefined) {
        res = { [key]: defaultValues[key] };
        chrome.storage.local.set(res);
      }
      resolve(res);
    })
  );

const setDataFromLocal = (key, value) =>
  chrome.storage.local.set({ [key]: value });

const getPower = () => getDataFromLocal("power");
const getAutoResetType = () => getDataFromLocal("autoResetType");
const getShowSolvedInPrompt = () => getDataFromLocal("showSolvedInPrompt");
const getHideProblemIsSolved = () => getDataFromLocal("hideProblemIsSolved");
const getTimer = () => getDataFromLocal("timer");
const getHideClock = () => getDataFromLocal("hideClock");

const assignAllLocalData = () =>
  new Promise((resolve, reject) => {
    Promise.all([
      getPower(),
      getAutoResetType(),
      getShowSolvedInPrompt(),
      getHideProblemIsSolved(),
      getTimer(),
      getHideClock(),
    ]).then((values) =>
      resolve(values.forEach((obj) => Object.assign(this, obj)))
    );
  });
