chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({ text: "OFF" });
});

const gmailUrl = "https://mail.google.com/";

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.url) return;

  if (tab.url.startsWith(gmailUrl)) {
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    const nextState = prevState === "ON" ? "OFF" : "ON";

    await chrome.action.setBadgeText({ tabId: tab.id, text: nextState });

    if (nextState === "ON") {
      await chrome.scripting.insertCSS({
        files: ["focus-mode.css"],
        target: { tabId: tab.id! },
      });

      await chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        files: ["scripts/content.js"],
      });
    } else {
      await chrome.scripting.removeCSS({
        files: ["focus-mode.css"],
        target: { tabId: tab.id! },
      });
      chrome.tabs.sendMessage(tab.id!, { action: "cleanup" });
    }
  }
});
