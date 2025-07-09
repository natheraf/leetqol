self.importScripts("./tabs.js");

chrome?.tabs?.onUpdated?.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url?.startsWith("https://leetcode.com/problems/")) {
    chrome.tabs.sendMessage(tabId, {
      message: "problem on screen",
      url: changeInfo.url,
    });
  }
});

chrome?.runtime?.onMessage?.addListener((request, sender) => {
  if (request.message === "close me") {
    console.log(request);
    chrome.tabs.remove(request.tabId);
  }
});
