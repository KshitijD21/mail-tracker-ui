"use strict";
(() => {
  // mail-tracker-extension/src/scripts/keyGenerate.ts
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

  // mail-tracker-extension/src/scripts/content.ts
  var token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2N2Y5OTAzZWZmZTE5MTNiYjNhNTMwYzciLCJzdWIiOiJrc2hpdGlqQGdtYWlsLmNvbSIsImlhdCI6MTc0NzcwMjE0MiwiZXhwIjoxNzQ5NTAyMTQyfQ.VFHdqwKLseOge5A20zP_6YKwkZYrEkDrc70U_6mqM9k";
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
          registerTrackingId(box);
        } else {
          console.warn("\u274C ComposeBox creation failed");
        }
        send.click();
      });
    });
  }
  function registerTrackingId(box) {
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
    attachTrackerOnSendButton();
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
})();
//# sourceMappingURL=content.global.js.map