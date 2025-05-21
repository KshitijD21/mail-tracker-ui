"use strict";
(() => {
  // mail-tracker-extension/src/scripts/keyGenerate.ts
  function generateK(length = 16) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array).map((byte) => charset[byte % charset.length]).join("");
  }
  async function generateP(userId, timestamp, key) {
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
  async function generateKey() {
    const u = "user123";
    const t = Math.floor(Date.now() / 1e3);
    const k = generateK();
    const p = await generateP(u, t, k);
    return p;
  }

  // mail-tracker-extension/src/scripts/content.ts
  var currentTrackingId = "";
  function interceptGmailSend() {
    const sendButton = document.querySelector(
      "div.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3"
    );
    if (!sendButton || sendButton.dataset.trackerInjected === "true") return;
    sendButton.dataset.trackerInjected = "true";
    const clonedButton = sendButton.cloneNode(true);
    sendButton.replaceWith(clonedButton);
    clonedButton.addEventListener("click", async function handler(e) {
      e.preventDefault();
      e.stopPropagation();
      clonedButton.removeEventListener("click", handler);
      if (currentTrackingId) {
        try {
          const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2N2Y5OTAzZWZmZTE5MTNiYjNhNTMwYzciLCJzdWIiOiJrc2hpdGlqQGdtYWlsLmNvbSIsImlhdCI6MTc0Nzc3MzAwNiwiZXhwIjoxNzQ5NTczMDA2fQ.V_qOXf2YtasJx6Ne6zLLwOJD22kzI6hpy0CCH5QZciI";
          await fetch("http://localhost:8080/tracking/ids", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: currentTrackingId
          });
          console.log("\u2705 Tracking ID uploaded to server");
        } catch (error) {
          console.error("\u274C Failed to upload tracking ID", error);
        }
      }
      sendButton.click();
    });
  }
  function insertImageIntoEmail() {
    const composeButton = document.querySelector(
      ".T-I.T-I-KE.L3"
    );
    if (composeButton && !composeButton.dataset.trackerRenamed) {
      composeButton.dataset.trackerRenamed = "true";
    }
    if (!composeButton || composeButton.dataset.trackerInjected === "true")
      return;
    composeButton.dataset.trackerInjected = "true";
    console.log("get inside insertImageIntoEmail \u{1F60E} ", composeButton);
    const redPixelBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAIElEQVQoU2NkYGBgYGBg+M+ABCEGBgYGJRYwGoaYBgB2hAFZkIo12gAAAABJRU5ErkJggg==";
    composeButton.addEventListener("click", async function handler(e) {
      currentTrackingId = await generateKey();
      console.log("\u{1F4E6} Tracked value:", currentTrackingId);
      const trackingUrl = `http://localhost:8080/track/${currentTrackingId}`;
      setTimeout(() => {
        const emailBodies = document.querySelectorAll(
          '[aria-label="Message Body"]'
        );
        emailBodies.forEach((body) => {
          const htmlBody = body;
          if (htmlBody.dataset.pixelInjected === "true") return;
          htmlBody.dataset.pixelInjected = "true";
          const img = document.createElement("img");
          img.src = trackingUrl;
          img.width = 10;
          img.height = 10;
          img.style.backgroundColor = "red";
          img.style.border = "1px solid black";
          img.style.display = "inline-block";
          img.alt = "debug pixel";
          htmlBody.appendChild(img);
          console.log("\u{1F5BC}\uFE0F Tracking pixel injected");
        });
      }, 300);
    });
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
    interceptGmailSend();
  });
  sendButtonObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
  var headerObserver = new MutationObserver(() => {
    highlightGmailHeader();
  });
  headerObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
  var insertImageIntoEmailObserver = new MutationObserver(() => {
    insertImageIntoEmail();
  });
  insertImageIntoEmailObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
  window.addEventListener("load", () => {
    interceptGmailSend();
    highlightGmailHeader();
    insertImageIntoEmail();
  });
})();
//# sourceMappingURL=content.global.js.map