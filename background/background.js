let mainTabId = null;

chrome.runtime.onInstalled.addListener((details) => {
    chrome.storage.local.set({messages: []});
    chrome.storage.sync.set({unselectAfterSave: true, allowSameMessages: false});
})

chrome.extension.onMessage.addListener((message) => {
    if (message.mainpagecreated == true) {
        chrome.tabs.getSelected(null, (tab) => {
            mainTabId = tab.id;
        })
    }
})

chrome.tabs.onRemoved.addListener((tabId) => {
    if (tabId == mainTabId) {
        mainTabId = null;
    }
})

chrome.tabs.onActivated.addListener((info) => {
    if (info.tabId == mainTabId) {
        chrome.tabs.sendMessage(mainTabId, {activated: true})
    }
})