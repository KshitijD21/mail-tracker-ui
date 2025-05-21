import { error } from "console";

// const token = localStorage.getItem("authToken");
const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2N2Y5OTAzZWZmZTE5MTNiYjNhNTMwYzciLCJzdWIiOiJrc2hpdGlqQGdtYWlsLmNvbSIsImlhdCI6MTc0Nzc3MzAwNiwiZXhwIjoxNzQ5NTczMDA2fQ.V_qOXf2YtasJx6Ne6zLLwOJD22kzI6hpy0CCH5QZciI";

function attachTrackerOnSendButton() {
  const sendButton = document.querySelector(
    "div.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3"
  ) as HTMLElement | null;

  if (!sendButton || sendButton.dataset.trackerInjected === "true") return;
  sendButton.dataset.trackerInjected = "true";

  const clonedButton = sendButton.cloneNode(true) as HTMLElement;
  sendButton.replaceWith(clonedButton);

  clonedButton.addEventListener("click", async function handler(e) {
    e.preventDefault();
    e.stopPropagation();

    clonedButton.removeEventListener("click", handler);

    // generate key

    sendButton.click();
  });
}

async function registerTrackingId(trackingId: string) {
  try {
    await fetch("http://localhost:8080/tracking/ids", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: trackingId,
    });
    console.log("✅ Tracking ID uploaded to server ");
  } catch (error) {
    console.error("❌ Failed to upload tracking ID", error);
  }
}

function insertImageIntoEmail(trackingId: string, element: HTMLElement) {
  const trackingUrl = `http://localhost:8080/track/${trackingId}`;

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

function getEmailBodyContainers() {
  const emailBodies = document.querySelectorAll(
    '[aria-label="Message Body"][contenteditable="true"]'
  );
}

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
  attachTrackerOnSendButton();
});

sendButtonObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

const headerObserver = new MutationObserver(() => {
  highlightGmailHeader();
});

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
