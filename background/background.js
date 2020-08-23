let mainTabId = null;

chrome.runtime.onInstalled.addListener((details) => {
    chrome.storage.local.set({messages: []});
    chrome.storage.sync.set({
        unselectAfterSave: true, 
        allowSameMessages: false, 
        enabled: true,
        addMessageHotkey: 'AltLeft',
    });
})

chrome.extension.onMessage.addListener((message) => {
    if (message.mainpagecreated == true) {
        if (!mainTabId) {
            chrome.tabs.create({url: chrome.extension.getURL("mainpage/main.html")}, () => {
                chrome.tabs.getSelected(null, (tab) => {
                    mainTabId = tab.id;
                })
            });
        }
        else {
            chrome.tabs.update(mainTabId, {highlighted: true});
        }
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