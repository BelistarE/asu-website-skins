document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("extensionToggle");

  // Load the stored state when the popup opens
  chrome.storage.sync.get("isActive", (data) => {
    toggle.checked = data.isActive || false; // Default to false if no value is stored
  });

  // Update storage when the toggle changes
  toggle.addEventListener("change", () => {
    const isActive = toggle.checked;
    chrome.storage.sync.set({ isActive });
    // Optionally, send a message to the content script to notify of the state change
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { isActive });
    });
  });
});
