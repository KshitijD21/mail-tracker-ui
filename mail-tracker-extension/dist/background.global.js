"use strict";
(() => {
  // src/background.ts
  chrome.runtime.onInstalled.addListener(() => {
    console.log("Mail Tracker extension installed");
  });
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Background received message:", message);
    if (message.action === "getAuthState") {
      sendResponse({ success: true });
    }
    return true;
  });
})();
//# sourceMappingURL=background.global.js.map