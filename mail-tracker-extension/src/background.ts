chrome.runtime.onInstalled.addListener(() => {
  console.log('Mail Tracker extension installed');
});

// Handle messages from popup and content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);

  if (message.action === 'getAuthState') {
    // Relay auth state requests if needed
    sendResponse({ success: true });
  }

  return true; // Keep message channel open for async responses
});
