chrome?.tabs?.onUpdated?.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url?.startsWith("https://leetcode.com/problems/")) {
    chrome.tabs.sendMessage(tabId, {
      message: "problem on screen",
      url: changeInfo.url,
    });
  }
});
