const getTabStartsWithURL = (url) =>
  new Promise((resolve, _reject) =>
    chrome.tabs.query({}).then((tabs) => {
      for (const tab of tabs) {
        if (tab.url.startsWith(url)) {
          return resolve(tab);
        }
      }
      resolve(null);
    })
  );

const whenTabDoneLoading = (tabId) =>
  new Promise((resolve, reject) => {
    let counter = 0;
    const isDoneLoading = () => {
      counter += 1;
      chrome.tabs.get(tabId).then((tab) => {
        if (counter === 100 || tab.status === "complete") {
          if (counter === 100) {
            return reject(new Error("uncompleted in 50 seconds"));
          }
          return resolve();
        }
        setTimeout(isDoneLoading, 500);
      });
    };
    setTimeout(isDoneLoading, 500);
  });
