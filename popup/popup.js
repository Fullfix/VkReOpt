const renderMainPage = () => {
    chrome.tabs.create({url: chrome.extension.getURL("mainpage/main.html")});
    chrome.extension.sendMessage({mainpagecreated: true});
}

window.onload = () => {
    document.getElementById("redirectbtn").addEventListener("click", renderMainPage)
    chrome.storage.sync.get("allowSameMessages", (obj) => {
        document.getElementById("allow-same-messages").checked = obj.allowSameMessages;
    })
    document.getElementById("allow-same-messages").addEventListener("change", function() {
        chrome.storage.sync.set({allowSameMessages: this.checked});
    })
    chrome.storage.sync.get("unselectAfterSave", (obj) => {
        document.getElementById("unselect-after-save").checked = obj.unselectAfterSave;
    })
    document.getElementById("unselect-after-save").addEventListener("change", function() {
        chrome.storage.sync.set({unselectAfterSave: this.checked});
    })
}