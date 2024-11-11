console.log("Content script loaded");

const wordsToReplace = {
  Coursera: "ASU",
  Okay: "poop",
};

function replaceWords(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    let originalText = node.textContent;
    Object.keys(wordsToReplace).forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "g");
      originalText = originalText.replace(regex, wordsToReplace[word]);
    });
    node.textContent = originalText;
  }
}

function changeFirstButtonColor() {
  const firstButton = document.querySelector(".css-136aa4o"); // Select the first <button> in the DOM
  if (firstButton) {
    console.log("First button found:", firstButton);
    firstButton.style.backgroundColor = "#9a1c01";
    firstButton.style.border = "2px solid black";
    firstButton.style.boxShadow = "none";
  } else {
    console.error("First button not found");
  }
}

function changeTextColor() {
  const text = document.querySelector(".css-yy9yht"); // Select the text element
  const arrows = document.querySelectorAll(".css-15talrd");
  const selectedElement = document.querySelector(".css-zgpty.cds-tab-selected");
  const borderClr = document.querySelector(".cds-105");
  const rand1 = document.querySelector(".css-15talrd");
  const bottom = document.querySelectorAll(".css-1s96oj");
  const help = document.querySelector(".css-18vnh69");
  const indicator = document.querySelector(".cds-tab-list-indicator");
  const saveNote = document.querySelector(".css-l0otf2");

  if (text) {
    console.log("Text found:", text);
    text.style.color = "#9a1c01"; // Change the text color
    selectedElement.style.color = "#9a1c01";
    borderClr.style.borderColor = "#9a1c01";
    rand1.style.color = "#9a1c01";
    help.style.display = "none";
    indicator.style.backgroundColor = "#9a1c01";
    saveNote.style.color = "#9a1c01";
  } else {
    console.error("Text element not found");
  }
  if (arrows.length > 0) {
    arrows.forEach((arrow) => {
      arrow.style.color = "#9a1c01";
    });
  }
  if (bottom.length > 0) {
    bottom.forEach((link) => {
      link.style.color = "#9a1c01";
    });
  }
}

// CSS Color Replacement
function replaceCssColor() {
  const targetColor = "rgb(0, 86, 210)";
  const newColor = "#9a1c01";

  for (const sheet of document.styleSheets) {
    try {
      const rules = sheet.cssRules;
      for (const rule of rules) {
        if (rule instanceof CSSStyleRule) {
          for (const property of rule.style) {
            if (rule.style[property] === targetColor) {
              rule.style[property] = newColor;
            }
          }
        }
      }
    } catch (e) {
      if (e.name === "SecurityError") {
        console.warn("Could not access stylesheet:", sheet.href);
      }
      continue;
    }
  }
}

// Link Color Change
function changeLinkColor() {
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    link.style.color = "#9a1c01";
  });
}

function addTextSibling() {
  const logo = document.querySelector(".rc-CourseraLogo"); // Select the logo element
  if (logo && !logo.nextSibling) {
    // Only add text if the logo exists and no sibling text yet
    console.log("Logo found:", logo);
    const textNode = document.createElement("span"); // Create a new <span> element
    textNode.textContent = "Webwork"; // Set the text content
    textNode.style.fontWeight = "bold";
    textNode.style.marginRight = "50px"; // Optional: add some space between the logo and the text
    logo.insertAdjacentElement("afterend", textNode); // Insert the text node after the logo
  }
}

function changeLogoSrc() {
  const logo = document.querySelector(".rc-CourseraLogo");
  const imgContainer = document.querySelector(
    ".rc-PageHeader .c-ph-nav .c-container .c-ph-logo"
  );
  if (logo && logo.tagName === "IMG") {
    logo.onload = function () {
      console.log("Logo image loaded successfully");
      logo.style.width = "auto"; // Set the desired width
      logo.style.height = "60px";
      imgContainer.style.padding = "0px";
    };
    logo.onerror = function () {
      console.error("Error loading logo image");
    };
    logo.src =
      "chrome-extension://bdghacdcldjmikminbailgibeegeglfj/Images/ASU-logo.png";
    console.log("Logo src set to:", logo.src);
  } else {
    console.error("Logo element not found or not an IMG tag");
  }
}
// Run this function to apply the color change on page load
changeLogoSrc();
changeLinkColor();
replaceCssColor();
changeFirstButtonColor();

// Traverse the DOM and apply the changes
function traverseDOM(node) {
  replaceWords(node); // Apply word replacement if needed
}

// Initial DOM traversal on page load
traverseDOM(document.body);

// MutationObserver to handle dynamically loaded content
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      // Handle dynamically loaded links and buttons
      if (node.tagName === "A") {
        node.style.color = "#9a1c01";
      } else if (node.querySelectorAll) {
        node.querySelectorAll("a").forEach((link) => {
          link.style.color = "#9a1c01";
        });
      }

      // Handle dynamically loaded logo
      if (
        node.classList &&
        node.classList.contains("rc-CourseraLogo") &&
        node.tagName === "IMG"
      ) {
        // Change the logo src
        console.log("Logo detected in mutation observer");
        changeLogoSrc(); // Call the logo change function
        addTextSibling(); // Add the sibling text "Webwork" if needed
      } else if (node.querySelectorAll) {
        // Also look for logo inside added nodes with nested content
        const logo = node.querySelector(".rc-CourseraLogo");
        if (logo && logo.tagName === "IMG") {
          console.log("Logo detected in added nodes");
          changeLogoSrc(); // Call the logo change function
          addTextSibling(); // Add the sibling text "Webwork" if needed
        }
      } else if (mutation.type === "childList") {
        changeFirstButtonColor();
        changeTextColor();
      }

      // Traverse the DOM for other changes
      traverseDOM(node);
    });
  });

  // Check and ensure "Webwork" text is added if logo is present initially
  addTextSibling();
});

// Start observing the document for changes
observer.observe(document.body, { childList: true, subtree: true });

//tabs
// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.isActive !== undefined) {
    // Perform actions based on the active state
    if (request.isActive) {
      activateExtensionFeatures();
    } else {
      deactivateExtensionFeatures();
    }
  }
});

// Check the stored state when the content script loads
chrome.storage.sync.get("isActive", (data) => {
  if (data.isActive) {
    activateExtensionFeatures();
  }
});

function activateExtensionFeatures() {
  // Your code to apply the extension's functionality
  console.log("Extension is active");
}

function deactivateExtensionFeatures() {
  // Your code to remove or disable the functionality
  console.log("Extension is inactive");
}
