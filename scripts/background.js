self.importScripts("./tabs.js");
self.importScripts("./indexeddb.js");

chrome?.tabs?.onUpdated?.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url?.startsWith("https://leetcode.com/problems/")) {
    chrome.tabs
      .sendMessage(tabId, {
        message: "problem on screen",
        url: changeInfo.url,
      })
      .catch(console.error);
  }
});

chrome?.runtime?.onMessage?.addListener((request, sender) => {
  if (request.message === "close me") {
    chrome.tabs.remove(request.tabId);
  }
  if (request.message === "clear all local code") {
    chrome.tabs
      .create({ url: "https://leetcode.com/problems/two-sum", active: false })
      .then((tab) => {
        whenTabDoneLoading(tab.id)
          .then(() => {
            chrome.tabs.sendMessage(tab.id, {
              message: "clear all local code",
              tabId: tab.id,
            });
          })
          .catch(console.error);
      })
      .catch(console.error);
  }
});
