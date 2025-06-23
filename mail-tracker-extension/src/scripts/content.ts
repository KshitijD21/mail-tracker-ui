import { generateRandomKey, generateTrackingId } from "./keyGenerate";

// API service for calling AI response
async function callAIResponse(emailBody: string): Promise<string> {
  const token = await getAuthToken();

  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const response = await fetch("http://localhost:8080/ai/getResponse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ emailBody }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server returned ${response.status}: ${errorText}`);
    }

    const result = await response.text();
    return result;
  } catch (error) {
    console.error('❌ AI Response API error:', error);
    throw error;
  }
}

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

  fetch("http://localhost:8080/tracking/ids", {
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

// Observer for AI Reply buttons in email views
const aiReplyObserver = new MutationObserver(() => {
  if (isAuthenticated) {
    addAIReplyButton();
  }
});

aiReplyObserver.observe(document.body, {
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

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'AUTH_STATE_CHANGED') {
    currentAuthState = message.payload.user;
    isAuthenticated = message.payload.isAuthenticated;

    console.log('Auth state updated:', { isAuthenticated, user: currentAuthState?.email });

    updateTrackingUI();
    sendResponse({ success: true });
  }

  if (message.action === 'authStateChanged') {
    currentAuthState = message.authData;
    isAuthenticated = !!message.authData;

    console.log('Auth state updated (legacy):', { isAuthenticated, user: currentAuthState?.email });

    updateTrackingUI();
    sendResponse({ success: true });
  }

  if (message.action === 'cleanup') {
    // Handle cleanup when extension is turned off
    cleanupTracking();
    sendResponse({ success: true });
  }
});

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

  // Also update AI reply buttons
  if (isAuthenticated) {
    addAIReplyButton();
  }
}

function removeTrackingFromCompose(el: HTMLElement) {
  const existingToggle = el.querySelector('.tracking-toggle');
  if (existingToggle) {
    existingToggle.remove();
  }
}

function cleanupTracking() {
  document.querySelectorAll('.tracking-toggle').forEach(el => el.remove());
  document.querySelectorAll('.ai-reply-button').forEach(el => el.remove());
  composeRegistry.clear();
}

// AI Reply functionality
function addAIReplyButton() {
  if (!isAuthenticated) return;

  const replyForwardContainer = document.querySelector('[aria-label="Reply"] [role="button"]')?.closest('div')?.parentElement;

  if (replyForwardContainer && !replyForwardContainer.querySelector('.ai-reply-button')) {
    // Create AI Reply button with modern styling
    const aiButton = document.createElement('span');
    aiButton.className = 'ai-reply-button';
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

    const button = aiButton.querySelector('button') as HTMLElement;
    button.addEventListener('click', () => handleAIReplyClick(button));

    replyForwardContainer.appendChild(aiButton);
    console.log('✅ AI Reply button added to email view');
  }
}

function insertAIContentIntoReply(aiContent: string) {
  const composeBody = document.querySelector('[aria-label="Message Body"][contenteditable="true"]') as HTMLElement;

  if (composeBody) {
    // Clear existing content and insert AI response
    composeBody.innerHTML = '';
    composeBody.focus();

    const aiDiv = document.createElement('div');
    aiDiv.innerHTML = aiContent.replace(/\n/g, '<br>');
    composeBody.appendChild(aiDiv);

    const signature = document.createElement('div');
    signature.innerHTML = '<br><hr style="border: 1px solid #e0e0e0; margin: 10px 0;"><small style="color: #666; font-style: italic;">✨ Generated with AI assistance</small>';
    composeBody.appendChild(signature);

    composeBody.focus();
    const range = document.createRange();
    range.setStart(aiDiv, 0);
    range.collapse(true);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    console.log('✅ AI content inserted into reply');
  } else {
    console.warn('⚠️ Could not find compose body element');
    showAIResponseModal(aiContent);
  }
}

function extractCurrentEmailContent(): string {
  // Look for email content in the current Gmail email view
  const contentSelectors = [
    // Gmail email body in conversation view
    '.ii.gt div[dir="ltr"]',
    '.ii.gt .a3s.aiL',
    '.ii.gt',
    // Gmail standalone email view
    '[role="main"] .a3s.aiL',
    '[role="main"] .ii.gt',
    // Fallback selectors
    '.a3s.aiL',
    '.gmail_default'
  ];

  for (const selector of contentSelectors) {
    const content = document.querySelector(selector) as HTMLElement;
    if (content && content.textContent?.trim()) {
      let text = content.textContent;

      text = text.replace(/^On .* wrote:[\s\S]*/gm, '');
      text = text.replace(/^From:.*?Subject:.*?\n/gms, '');
      text = text.replace(/_{10,}/g, '');
      text = text.replace(/^\s*>.*$/gm, '');
      text = text.replace(/^\s*\|.*$/gm, '');
      text = text.replace(/^-- \s*$/gm, '');
      text = text.replace(/^--\s*$/gm, '');

      text = text.replace(/\n{3,}/g, '\n\n');
      text = text.trim();

      if (text.length > 20) {
        console.log('📧 Extracted email content:', text.substring(0, 100) + '...');
        return text;
      }
    }
  }

  const mainContent = document.querySelector('[role="main"]');
  if (mainContent) {
    const allText = mainContent.textContent || '';
    const filteredText = allText
      .split('\n')
      .filter(line => {
        const trimmed = line.trim();
        return trimmed.length > 0 &&
               !trimmed.match(/^(Reply|Forward|Archive|Delete|Mark as read|Show details)$/i) &&
               !trimmed.match(/^(to|cc|bcc):?\s*$/i) &&
               !trimmed.match(/^\d{1,2}:\d{2}\s*(AM|PM)?$/i) &&
               trimmed.length > 5; // Ignore very short lines
      })
      .join('\n')
      .trim();

    console.log('📧 Fallback email content extracted:', filteredText.substring(0, 100) + '...');
    return filteredText;
  }

  return '';
}

async function handleAIReplyClick(button: HTMLElement) {
  try {
    // Find the email content from the current email view
    const emailBody = extractCurrentEmailContent();
    if (!emailBody.trim()) {
      alert('Could not extract email content. Please try again.');
      return;
    }

    console.log('📧 Extracted email content for AI:', emailBody.substring(0, 100) + '...');

    // Show loading state
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
    button.style.pointerEvents = 'none';

    // Add spinner animation if not exists
    if (!document.getElementById('spinner-styles')) {
      const style = document.createElement('style');
      style.id = 'spinner-styles';
      style.textContent = `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    const aiResponse = await callAIResponse(emailBody);
    console.log('🤖 AI response received:', aiResponse.substring(0, 100) + '...');

    const replyButton = document.querySelector('[aria-label="Reply"] [role="button"]') as HTMLElement;
    if (replyButton) {
      replyButton.click();

      // Wait for compose window to open and insert AI content
      setTimeout(() => {
        insertAIContentIntoReply(aiResponse);
      }, 800); // Increased timeout for Gmail to load
    } else {
      showAIResponseModal(aiResponse);
    }

    button.innerHTML = originalText;
    button.style.pointerEvents = 'auto';

  } catch (error) {
    console.error('❌ AI Reply error:', error);

    let errorMessage = 'Failed to generate AI reply. ';
    if (error instanceof Error) {
      if (error.message.includes('Authentication required')) {
        errorMessage += 'Please make sure you are logged in to the extension.';
      } else if (error.message.includes('Server returned')) {
        errorMessage += 'Server error. Please try again later.';
      } else {
        errorMessage += 'Please check your connection and try again.';
      }
    }    alert(errorMessage);

    // Reset button
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
    button.style.pointerEvents = 'auto';
  }
}

function showAIResponseModal(aiContent: string) {
  const modal = document.createElement('div');
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
      <h3 style="margin: 0 0 16px 0; color: #333;">🤖 AI Generated Reply</h3>
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
        <button onclick="this.closest('[style*=\"position: fixed\"]').remove()" style="
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          cursor: pointer;
        ">Close</button>
        <button onclick="
          navigator.clipboard.writeText(\`${aiContent.replace(/`/g, '\\`')}\`);
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

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}
