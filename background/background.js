chrome.runtime.onInstalled.addListener((details) => {
    chrome.storage.local.set({messages: []});
})