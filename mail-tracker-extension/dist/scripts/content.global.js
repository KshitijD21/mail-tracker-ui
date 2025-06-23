"use strict";
(() => {
  // src/scripts/keyGenerate.ts
  function generateRandomKey(length = 16) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array).map((byte) => charset[byte % charset.length]).join("");
  }
  async function generateTrackingId(userId, timestamp, key) {
    const encoder = new TextEncoder();
    const message = encoder.encode(`${userId}:${timestamp}`);
    const keyData = encoder.encode(key);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, message);
    return Array.from(new Uint8Array(signature)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  // src/scripts/content.ts
  async function callAIResponse(emailBody) {
    const token = await getAuthToken();
    if (!token) {
      throw new Error("Authentication required");
    }
    try {
      const response = await fetch("http://localhost:8080/ai/getResponse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ emailBody })
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }
      const result = await response.text();
      return result;
    } catch (error) {
      console.error("\u274C AI Response API error:", error);
      throw error;
    }
  }
  async function getAuthToken() {
    try {
      const result = await chrome.storage.local.get(["authState", "tempToken"]);
      const token = result.tempToken || result.authState?.token;
      return token || null;
    } catch (error) {
      console.error("Failed to get auth token:", error);
      return null;
    }
  }
  var composeRegistry = /* @__PURE__ */ new Map();
  function createComposeBox(el, trackingId, k, u, t) {
    const id = el.getAttribute("data-compose-id");
    if (!id) return null;
    const subject = el.querySelector(
      'input[name="subjectbox"]'
    );
    const to = el.querySelector('[aria-label="To"]');
    const body = el.querySelector(
      '[aria-label="Message Body"][contenteditable="true"]'
    );
    if (!subject || !to || !body) return null;
    return {
      id,
      subjectInput: subject.value,
      toInput: extractRecipients(to),
      bodyElement: body,
      trackingObject: {
        trackingId,
        k,
        u,
        t
      }
    };
  }
  function extractRecipients(el) {
    const chips = el.querySelectorAll('[role="option"][data-hovercard-id]');
    return Array.from(chips).map((chip) => chip.getAttribute("data-hovercard-id") || "").filter((email) => email !== "");
  }
  function finaliseDataFromComposeBox(composeEl, trackingId, k, u, t) {
    if (!composeEl) {
      console.warn("\u26A0\uFE0F No compose element found.");
      return;
    }
    const box = createComposeBox(composeEl, trackingId, k, u, t);
    console.log("whole box data \u{1F680} ", box);
    if (!box) {
      console.warn("\u26A0\uFE0F Could not construct ComposeBox.");
      return;
    }
    insertImageIntoEmail(trackingId, box.bodyElement);
    console.log(
      "\u2705 Pixel inserted into compose box:",
      box.id,
      box.subjectInput,
      box.toInput
    );
    return box;
  }
  function attachTrackerOnSendButton() {
    const sendButton = document.querySelectorAll(
      "div.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3"
    );
    console.log("Number of send buttons:", sendButton.length);
    sendButton.forEach((send) => {
      if (!send || send.dataset.trackerInjected === "true") return;
      send.dataset.trackerInjected = "true";
      const clonedButton = send.cloneNode(true);
      send.replaceWith(clonedButton);
      clonedButton.addEventListener("click", async function handler(e) {
        e.preventDefault();
        e.stopPropagation();
        clonedButton.removeEventListener("click", handler);
        const k = generateRandomKey();
        const u = "kshitij@gmail.com";
        const t = Date.now();
        const trackingId = await generateTrackingId(u, t, k);
        const composeBoxEl = clonedButton.closest("[data-compose-id]");
        const box = finaliseDataFromComposeBox(
          composeBoxEl,
          trackingId,
          k,
          u,
          t
        );
        if (box != void 0) {
          await registerTrackingId(box);
        } else {
          console.warn("\u274C ComposeBox creation failed");
        }
        send.click();
      });
    });
  }
  async function registerTrackingId(box) {
    const token = await getAuthToken();
    if (!token) {
      console.warn("\u274C No auth token available. Cannot register tracking ID.");
      return;
    }
    const payload = {
      trackingObject: box.trackingObject,
      to: box.toInput,
      subject: box.subjectInput
    };
    composeRegistry.set(box.trackingObject.trackingId, box);
    fetch("http://localhost:8080/tracking/ids", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    }).then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }
      return response.json();
    }).then((data) => {
      if (!data) return;
      console.log(data);
      if (data.status === true) {
        composeRegistry.delete(data.trackingId);
        console.log("\u2705 Tracking ID uploaded successfully:", data.trackingId);
      } else {
        const reDeclare = composeRegistry.get(data?.trackingId);
        if (reDeclare) registerTrackingId(reDeclare);
        console.warn("\u26A0\uFE0F Server responded with failure. ID:", data.trackingId);
      }
    }).catch((error) => {
      console.error("\u274C Network or unexpected error:", error);
    });
  }
  function insertImageIntoEmail(trackingId, element) {
    const trackingUrl = `https://mail-tracker-xy4c.onrender.com/track/${trackingId}`;
    const img = document.createElement("img");
    img.src = trackingUrl;
    img.width = 10;
    img.height = 10;
    img.style.backgroundColor = "red";
    img.style.border = "1px solid black";
    img.style.display = "inline-block";
    img.alt = "debug pixel";
    element.appendChild(img);
  }
  function highlightGmailHeader() {
    const headerBar = document.querySelector("header");
    if (headerBar && !headerBar.dataset.extModified) {
      headerBar.style.backgroundColor = "#FFBE98";
      headerBar.dataset.extModified = "true";
      console.log("\u{1F7E7} Mail Tracker extension active \u2013 header modified");
    }
  }
  var sendButtonObserver = new MutationObserver(() => {
    if (isAuthenticated) {
      attachTrackerOnSendButton();
    }
  });
  sendButtonObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
  var aiReplyObserver = new MutationObserver(() => {
    if (isAuthenticated) {
      addAIReplyButton();
    }
  });
  aiReplyObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
  var headerObserver = new MutationObserver(() => {
    highlightGmailHeader();
  });
  async function initExtension() {
    await initAuthState();
    highlightGmailHeader();
    updateTrackingUI();
  }
  initExtension();
  headerObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
  var currentAuthState = null;
  var isAuthenticated = false;
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === "AUTH_STATE_CHANGED") {
      currentAuthState = message.payload.user;
      isAuthenticated = message.payload.isAuthenticated;
      console.log("Auth state updated:", { isAuthenticated, user: currentAuthState?.email });
      updateTrackingUI();
      sendResponse({ success: true });
    }
    if (message.action === "authStateChanged") {
      currentAuthState = message.authData;
      isAuthenticated = !!message.authData;
      console.log("Auth state updated (legacy):", { isAuthenticated, user: currentAuthState?.email });
      updateTrackingUI();
      sendResponse({ success: true });
    }
    if (message.action === "cleanup") {
      cleanupTracking();
      sendResponse({ success: true });
    }
  });
  async function initAuthState() {
    try {
      const result = await chrome.storage.local.get(["authState", "isAuthenticated"]);
      if (result.isAuthenticated && result.authState) {
        currentAuthState = result.authState;
        isAuthenticated = true;
        console.log("Loaded auth state:", currentAuthState?.email);
      }
    } catch (error) {
      console.error("Failed to load auth state:", error);
    }
  }
  function addTrackingToCompose(el) {
    if (!isAuthenticated || el.querySelector(".tracking-toggle")) {
      return;
    }
    const toolbar = el.querySelector('[aria-label="more send options"]')?.parentElement;
    if (!toolbar) return;
    const trackingToggle = document.createElement("div");
    trackingToggle.className = "tracking-toggle";
    trackingToggle.innerHTML = `
    <button style="
      background: #1a73e8;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 6px 12px;
      font-size: 12px;
      cursor: pointer;
      margin-left: 8px;
      display: flex;
      align-items: center;
      gap: 4px;
    ">
      \u{1F4E7} Tracking ON
    </button>
  `;
    toolbar.appendChild(trackingToggle);
  }
  function updateTrackingUI() {
    const composeElements = document.querySelectorAll('[role="dialog"][aria-label*="compose"]');
    composeElements.forEach((el) => {
      const htmlEl = el;
      if (isAuthenticated) {
        addTrackingToCompose(htmlEl);
      } else {
        removeTrackingFromCompose(htmlEl);
      }
    });
    if (isAuthenticated) {
      addAIReplyButton();
    }
  }
  function removeTrackingFromCompose(el) {
    const existingToggle = el.querySelector(".tracking-toggle");
    if (existingToggle) {
      existingToggle.remove();
    }
  }
  function cleanupTracking() {
    document.querySelectorAll(".tracking-toggle").forEach((el) => el.remove());
    document.querySelectorAll(".ai-reply-button").forEach((el) => el.remove());
    composeRegistry.clear();
  }
  function addAIReplyButton() {
    if (!isAuthenticated) return;
    const replyForwardContainer = document.querySelector('[aria-label="Reply"] [role="button"]')?.closest("div")?.parentElement;
    if (replyForwardContainer && !replyForwardContainer.querySelector(".ai-reply-button")) {
      const aiButton = document.createElement("span");
      aiButton.className = "ai-reply-button";
      aiButton.innerHTML = `
      <button style="
        background: linear-gradient(45deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
        color: white;
        border: none;
        border-radius: 24px;
        padding: 8px 20px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        margin-left: 12px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        user-select: none;
        position: relative;
        overflow: hidden;
        letter-spacing: 0.025em;
      "
      onmouseover="
        this.style.transform='translateY(-2px) scale(1.02)'; 
        this.style.boxShadow='0 4px 20px rgba(99, 102, 241, 0.4)';
        this.style.background='linear-gradient(45deg, #5b5fd9 0%, #7c3aed 50%, #c026d3 100%)';
      "
      onmouseout="
        this.style.transform='translateY(0) scale(1)'; 
        this.style.boxShadow='0 2px 8px rgba(99, 102, 241, 0.3)';
        this.style.background='linear-gradient(45deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)';
      "
      onmousedown="this.style.transform='translateY(0) scale(0.98)'"
      onmouseup="this.style.transform='translateY(-2px) scale(1.02)'"
      tabindex="0"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
          <path d="M12 2C13.1046 2 14 2.89543 14 4V8C14 9.10457 13.1046 10 12 10C10.8954 10 10 9.10457 10 8V4C10 2.89543 10.8954 2 12 2Z" fill="currentColor"/>
          <path d="M4 12C4 10.8954 4.89543 10 6 10H8C9.10457 10 10 10.8954 10 12C10 13.1046 9.10457 14 8 14H6C4.89543 14 4 13.1046 4 12Z" fill="currentColor"/>
          <path d="M14 12C14 10.8954 14.8954 10 16 10H18C19.1046 10 20 10.8954 20 12C20 13.1046 19.1046 14 18 14H16C14.8954 14 14 13.1046 14 12Z" fill="currentColor"/>
          <path d="M10 16C10 14.8954 10.8954 14 12 14C13.1046 14 14 14.8954 14 16V20C14 21.1046 13.1046 22 12 22C10.8954 22 10 21.1046 10 20V16Z" fill="currentColor"/>
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
        </svg>
        Reply with AI
      </button>
    `;
      const button = aiButton.querySelector("button");
      button.addEventListener("click", () => handleAIReplyClick(button));
      replyForwardContainer.appendChild(aiButton);
      console.log("\u2705 AI Reply button added to email view");
    }
  }
  function insertAIContentIntoReply(aiContent) {
    const composeBody = document.querySelector('[aria-label="Message Body"][contenteditable="true"]');
    if (composeBody) {
      composeBody.innerHTML = "";
      composeBody.focus();
      const aiDiv = document.createElement("div");
      aiDiv.innerHTML = aiContent.replace(/\n/g, "<br>");
      composeBody.appendChild(aiDiv);
      const signature = document.createElement("div");
      signature.innerHTML = '<br><hr style="border: 1px solid #e0e0e0; margin: 10px 0;"><small style="color: #666; font-style: italic;">\u2728 Generated with AI assistance</small>';
      composeBody.appendChild(signature);
      composeBody.focus();
      const range = document.createRange();
      range.setStart(aiDiv, 0);
      range.collapse(true);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      console.log("\u2705 AI content inserted into reply");
    } else {
      console.warn("\u26A0\uFE0F Could not find compose body element");
      showAIResponseModal(aiContent);
    }
  }
  function extractCurrentEmailContent() {
    const contentSelectors = [
      // Gmail email body in conversation view
      '.ii.gt div[dir="ltr"]',
      ".ii.gt .a3s.aiL",
      ".ii.gt",
      // Gmail standalone email view
      '[role="main"] .a3s.aiL',
      '[role="main"] .ii.gt',
      // Fallback selectors
      ".a3s.aiL",
      ".gmail_default"
    ];
    for (const selector of contentSelectors) {
      const content = document.querySelector(selector);
      if (content && content.textContent?.trim()) {
        let text = content.textContent;
        text = text.replace(/^On .* wrote:[\s\S]*/gm, "");
        text = text.replace(/^From:.*?Subject:.*?\n/gms, "");
        text = text.replace(/_{10,}/g, "");
        text = text.replace(/^\s*>.*$/gm, "");
        text = text.replace(/^\s*\|.*$/gm, "");
        text = text.replace(/^-- \s*$/gm, "");
        text = text.replace(/^--\s*$/gm, "");
        text = text.replace(/\n{3,}/g, "\n\n");
        text = text.trim();
        if (text.length > 20) {
          console.log("\u{1F4E7} Extracted email content:", text.substring(0, 100) + "...");
          return text;
        }
      }
    }
    const mainContent = document.querySelector('[role="main"]');
    if (mainContent) {
      const allText = mainContent.textContent || "";
      const filteredText = allText.split("\n").filter((line) => {
        const trimmed = line.trim();
        return trimmed.length > 0 && !trimmed.match(/^(Reply|Forward|Archive|Delete|Mark as read|Show details)$/i) && !trimmed.match(/^(to|cc|bcc):?\s*$/i) && !trimmed.match(/^\d{1,2}:\d{2}\s*(AM|PM)?$/i) && trimmed.length > 5;
      }).join("\n").trim();
      console.log("\u{1F4E7} Fallback email content extracted:", filteredText.substring(0, 100) + "...");
      return filteredText;
    }
    return "";
  }
  async function handleAIReplyClick(button) {
    try {
      const emailBody = extractCurrentEmailContent();
      if (!emailBody.trim()) {
        alert("Could not extract email content. Please try again.");
        return;
      }
      console.log("\u{1F4E7} Extracted email content for AI:", emailBody.substring(0, 100) + "...");
      const originalText = button.innerHTML;
      button.innerHTML = `
      <span style="
        display: inline-flex;
        align-items: center;
        gap: 8px;
      ">
        <span style="
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        "></span>
        Generating response...
      </span>
    `;
      button.style.pointerEvents = "none";
      if (!document.getElementById("spinner-styles")) {
        const style = document.createElement("style");
        style.id = "spinner-styles";
        style.textContent = `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `;
        document.head.appendChild(style);
      }
      const aiResponse = await callAIResponse(emailBody);
      console.log("\u{1F916} AI response received:", aiResponse.substring(0, 100) + "...");
      const replyButton = document.querySelector('[aria-label="Reply"] [role="button"]');
      if (replyButton) {
        replyButton.click();
        setTimeout(() => {
          insertAIContentIntoReply(aiResponse);
        }, 800);
      } else {
        showAIResponseModal(aiResponse);
      }
      button.innerHTML = originalText;
      button.style.pointerEvents = "auto";
    } catch (error) {
      console.error("\u274C AI Reply error:", error);
      let errorMessage = "Failed to generate AI reply. ";
      if (error instanceof Error) {
        if (error.message.includes("Authentication required")) {
          errorMessage += "Please make sure you are logged in to the extension.";
        } else if (error.message.includes("Server returned")) {
          errorMessage += "Server error. Please try again later.";
        } else {
          errorMessage += "Please check your connection and try again.";
        }
      }
      alert(errorMessage);
      button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
        <path d="M12 2C13.1046 2 14 2.89543 14 4V8C14 9.10457 13.1046 10 12 10C10.8954 10 10 9.10457 10 8V4C10 2.89543 10.8954 2 12 2Z" fill="currentColor"/>
        <path d="M4 12C4 10.8954 4.89543 10 6 10H8C9.10457 10 10 10.8954 10 12C10 13.1046 9.10457 14 8 14H6C4.89543 14 4 13.1046 4 12Z" fill="currentColor"/>
        <path d="M14 12C14 10.8954 14.8954 10 16 10H18C19.1046 10 20 10.8954 20 12C20 13.1046 19.1046 14 18 14H16C14.8954 14 14 13.1046 14 12Z" fill="currentColor"/>
        <path d="M10 16C10 14.8954 10.8954 14 12 14C13.1046 14 14 14.8954 14 16V20C14 21.1046 13.1046 22 12 22C10.8954 22 10 21.1046 10 20V16Z" fill="currentColor"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
      </svg>
      Reply with AI
    `;
      button.style.pointerEvents = "auto";
    }
  }
  function showAIResponseModal(aiContent) {
    const modal = document.createElement("div");
    modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;
    modal.innerHTML = `
    <div style="
      background: white;
      border-radius: 8px;
      padding: 24px;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    ">
      <h3 style="margin: 0 0 16px 0; color: #333;">\u{1F916} AI Generated Reply</h3>
      <div style="
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        padding: 16px;
        background: #f8f9fa;
        margin-bottom: 16px;
        white-space: pre-wrap;
        line-height: 1.5;
      ">${aiContent}</div>
      <div style="display: flex; gap: 8px; justify-content: flex-end;">
        <button onclick="this.closest('[style*="position: fixed"]').remove()" style="
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          cursor: pointer;
        ">Close</button>
        <button onclick="
          navigator.clipboard.writeText(\`${aiContent.replace(/`/g, "\\`")}\`);
          alert('AI response copied to clipboard!');
        " style="
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          cursor: pointer;
        ">Copy to Clipboard</button>
      </div>
    </div>
  `;
    document.body.appendChild(modal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }
})();
//# sourceMappingURL=content.global.js.map