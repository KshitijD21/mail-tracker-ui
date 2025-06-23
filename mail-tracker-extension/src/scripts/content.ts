import { generateRandomKey, generateTrackingId } from "./keyGenerate";

// Function to get auth token from Chrome storage
async function getAuthToken(): Promise<string | null> {
  try {
    const result = await chrome.storage.local.get(['authState', 'tempToken']);
    const token = result.tempToken || result.authState?.token;
    return token || null;
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
}

interface TrackingId {
  trackingId: string;
  k: string;
  u: string;
  t: number;
}

interface TrackingResponse {
  status: boolean;
  trackingId: string;
}

interface ComposeBox {
  id: string;
  subjectInput: string;
  toInput: string[];
  bodyElement: HTMLElement;
  trackingObject: TrackingId;
}

const composeRegistry = new Map<string, ComposeBox>();

function createComposeBox(
  el: HTMLElement,
  trackingId: string,
  k: string,
  u: string,
  t: number
): ComposeBox | null {
  const id = el.getAttribute("data-compose-id");
  if (!id) return null;
  const subject = el.querySelector(
    'input[name="subjectbox"]'
  ) as HTMLInputElement;
  const to = el.querySelector('[aria-label="To"]') as HTMLElement;
  const body = el.querySelector(
    '[aria-label="Message Body"][contenteditable="true"]'
  ) as HTMLElement;
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
      t,
    },
  };
}

function extractRecipients(el: HTMLElement): string[] {
  const chips = el.querySelectorAll('[role="option"][data-hovercard-id]');
  return Array.from(chips)
    .map((chip) => chip.getAttribute("data-hovercard-id") || "")
    .filter((email) => email !== "");
}

function finaliseDataFromComposeBox(
  composeEl: Element | null,
  trackingId: string,
  k: string,
  u: string,
  t: number
) {
  if (!composeEl) {
    console.warn("⚠️ No compose element found.");
    return;
  }
  const box = createComposeBox(composeEl as HTMLElement, trackingId, k, u, t);

  console.log("whole box data 🚀 ", box);

  if (!box) {
    console.warn("⚠️ Could not construct ComposeBox.");
    return;
  }

  insertImageIntoEmail(trackingId, box.bodyElement);
  console.log(
    "✅ Pixel inserted into compose box:",
    box.id,
    box.subjectInput,
    box.toInput
  );

  return box;
}

function attachTrackerOnSendButton() {
  const sendButton = document.querySelectorAll(
    "div.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3"
  ) as NodeListOf<HTMLElement>;

  console.log("Number of send buttons:", sendButton.length);

  sendButton.forEach((send: HTMLElement) => {
    if (!send || send.dataset.trackerInjected === "true") return;
    send.dataset.trackerInjected = "true";

    const clonedButton = send.cloneNode(true) as HTMLElement;
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

      const box: ComposeBox | undefined = finaliseDataFromComposeBox(
        composeBoxEl,
        trackingId,
        k,
        u,
        t
      );

      if (box != undefined) {
        await registerTrackingId(box);
      } else {
        console.warn("❌ ComposeBox creation failed");
      }

      send.click();
    });
  });
}

async function registerTrackingId(box: ComposeBox) {
  const token = await getAuthToken();

  if (!token) {
    console.warn('❌ No auth token available. Cannot register tracking ID.');
    return;
  }

  const payload = {
    trackingObject: box.trackingObject,
    to: box.toInput,
    subject: box.subjectInput,
  };

  composeRegistry.set(box.trackingObject.trackingId, box);

  fetch("https://mail-tracker-xy4c.onrender.com/tracking/ids", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }
      return response.json() as Promise<TrackingResponse>;
    })
    .then((data) => {
      if (!data) return;
      console.log(data);
      if (data.status === true) {
        composeRegistry.delete(data.trackingId!);
        console.log("✅ Tracking ID uploaded successfully:", data.trackingId);
      } else {
        const reDeclare = composeRegistry.get(data?.trackingId);
        if (reDeclare) registerTrackingId(reDeclare);
        console.warn("⚠️ Server responded with failure. ID:", data.trackingId);
      }
    })
    .catch((error) => {
      console.error("❌ Network or unexpected error:", error);
    });
}

function insertImageIntoEmail(trackingId: string, element: HTMLElement) {
  // const trackingUrl = `http://localhost:8080/track/${trackingId}`;
  const trackingUrl = `https://mail-tracker-xy4c.onrender.com/track/${trackingId}`;
  // const trackingUrl = `https://cdn.pixabay.com/photo/2025/04/14/16/31/animals-9533774_1280.jpg`;

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

// Unused function - can be removed or used later
// function getEmailBodyContainers(): HTMLElement {
//   const emailBodies = document.querySelector(
//     '[aria-label="Message Body"][contenteditable="true"]'
//   ) as HTMLElement;
//   return emailBodies;
// }

// function insertImageIntoEmail() {
//   const composeButton = document.querySelector(
//     ".T-I.T-I-KE.L3"
//   ) as HTMLElement | null;

//   if (composeButton && !composeButton.dataset.trackerRenamed) {
//     composeButton.dataset.trackerRenamed = "true";
//   }

//   if (!composeButton || composeButton.dataset.trackerInjected === "true")
//     return;

//   composeButton.dataset.trackerInjected = "true";

//   composeButton.addEventListener("click", async function handler(e) {
//     currentTrackingId = await generateKey();
//     const trackingUrl = `http://localhost:8080/track/${currentTrackingId}`;

//     setTimeout(() => {
//       const emailBodies = document.querySelectorAll(
//         '[aria-label="Message Body"]'
//       );

//       emailBodies.forEach((body) => {
//         const htmlBody = body as HTMLElement;

//         if (htmlBody.dataset.pixelInjected === "true") return;
//         htmlBody.dataset.pixelInjected = "true";

//         const img = document.createElement("img");
//         img.src = trackingUrl;
//         img.width = 10;
//         img.height = 10;
//         img.style.backgroundColor = "red";
//         img.style.border = "1px solid black";
//         img.style.display = "inline-block";
//         img.alt = "debug pixel";

//         htmlBody.appendChild(img);
//         console.log("🖼️ Tracking pixel injected");
//       });
//     },300);
//   });
// }

function highlightGmailHeader() {
  const headerBar = document.querySelector("header");

  if (headerBar && !headerBar.dataset.extModified) {
    headerBar.style.backgroundColor = "#FFBE98";
    headerBar.dataset.extModified = "true";
    console.log("🟧 Mail Tracker extension active – header modified");
  }
}

const sendButtonObserver = new MutationObserver(() => {
  if (isAuthenticated) {
    attachTrackerOnSendButton();
  }
});

sendButtonObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

const headerObserver = new MutationObserver(() => {
  highlightGmailHeader();
});

// Initialize extension
async function initExtension() {
  await initAuthState();
  highlightGmailHeader();
  updateTrackingUI();
}

// Start the extension
initExtension();

headerObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

// const insertImageIntoEmailObserver = new MutationObserver(() => {
//   insertImageIntoEmail();
// });

// insertImageIntoEmailObserver.observe(document.body, {
//   childList: true,
//   subtree: true,
// });

// window.addEventListener("load", () => {
//   interceptGmailSend();
//   highlightGmailHeader();
//   insertImageIntoEmail();
// });

// http://localhost:8080/track/6dc553055dfb0d013fc0fb99bee829bc41674d122701469afadc59c02625cad0

// Auth state management
interface User {
  id: number;
  email: string;
  name: string;
  avatar: string;
  token: string;
}

let currentAuthState: User | null = null;
let isAuthenticated = false;

// Listen for auth state changes from popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'AUTH_STATE_CHANGED') {
    currentAuthState = message.payload.user;
    isAuthenticated = message.payload.isAuthenticated;

    console.log('Auth state updated:', { isAuthenticated, user: currentAuthState?.email });

    // Update UI based on auth state
    updateTrackingUI();
    sendResponse({ success: true });
  }

  // Legacy support for old message format
  if (message.action === 'authStateChanged') {
    currentAuthState = message.authData;
    isAuthenticated = !!message.authData;

    console.log('Auth state updated (legacy):', { isAuthenticated, user: currentAuthState?.email });

    // Update UI based on auth state
    updateTrackingUI();
    sendResponse({ success: true });
  }

  if (message.action === 'cleanup') {
    // Handle cleanup when extension is turned off
    cleanupTracking();
    sendResponse({ success: true });
  }
});

// Initialize auth state from storage
async function initAuthState() {
  try {
    const result = await chrome.storage.local.get(['authState', 'isAuthenticated']);
    if (result.isAuthenticated && result.authState) {
      currentAuthState = result.authState;
      isAuthenticated = true;
      console.log('Loaded auth state:', currentAuthState?.email);
    }
  } catch (error) {
    console.error('Failed to load auth state:', error);
  }
}

function addTrackingToCompose(el: HTMLElement) {
  // Only add tracking if user is authenticated and element doesn't already have tracking
  if (!isAuthenticated || el.querySelector('.tracking-toggle')) {
    return;
  }

  // Find the compose toolbar
  const toolbar = el.querySelector('[aria-label="more send options"]')?.parentElement;
  if (!toolbar) return;

  // Create tracking toggle button
  const trackingToggle = document.createElement('div');
  trackingToggle.className = 'tracking-toggle';
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
      📧 Tracking ON
    </button>
  `;

  toolbar.appendChild(trackingToggle);
}

// Update tracking UI based on auth state
function updateTrackingUI() {
  const composeElements = document.querySelectorAll('[role="dialog"][aria-label*="compose"]');
  composeElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    if (isAuthenticated) {
      addTrackingToCompose(htmlEl);
    } else {
      removeTrackingFromCompose(htmlEl);
    }
  });
}

function removeTrackingFromCompose(el: HTMLElement) {
  const existingToggle = el.querySelector('.tracking-toggle');
  if (existingToggle) {
    existingToggle.remove();
  }
}

function cleanupTracking() {
  document.querySelectorAll('.tracking-toggle').forEach(el => el.remove());
  composeRegistry.clear();
}
