console.log("Content script loaded");

const wordsToReplace = {
  Coursera: "ASU",
  Okay: "poop",
  // Add more words as needed
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
  const firstButton = document.querySelector("button"); // Select the first <button> in the DOM
  if (firstButton) {
    firstButton.style.backgroundColor = "#9a1c01"; // Set to your desired color
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

// Run on page load
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
      if (node.tagName === "A") {
        node.style.color = "#9a1c01";
      } else if (node.querySelectorAll) {
        node.querySelectorAll("a").forEach((link) => {
          link.style.color = "#9a1c01";
        });
        node.querySelectorAll("button").forEach((button) => {
          makeButtonsRed(button);
        });
      }
      traverseDOM(node);
    });
  });
});

// Start observing the document for changes
observer.observe(document.body, { childList: true, subtree: true });
