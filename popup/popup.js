const renderMainPage = () => {
    chrome.extension.sendMessage({mainpagecreated: true});
}

window.onload = () => {
    document.getElementById("redirectbtn").addEventListener("click", renderMainPage)
    document.getElementById("deletebtn").addEventListener('click', ()=>{
        chrome.storage.local.set({messages: []});
        document.getElementById("nummessages").innerHTML = "0";
    })
    document.getElementById("allow-same-messages").addEventListener("change", function() {
        chrome.storage.sync.set({allowSameMessages: this.checked});
    })
    document.querySelector('.hotkey').addEventListener('keydown', function(e) {
        e.preventDefault();
        this.value = e.code;
        chrome.storage.sync.set({ addMessageHotkey: e.code });
    })

    chrome.storage.sync.get(["unselectAfterSave", "allowSameMessages", 
    "enabled", "addMessageHotkey"], (obj) => {
        document.getElementById("unselect-after-save").checked = obj.unselectAfterSave;
        document.getElementById("allow-same-messages").checked = obj.allowSameMessages;
        document.getElementById("on_off").checked = obj.enabled;
        document.querySelector('.hotkey').value = obj.addMessageHotkey;
    })
    document.getElementById("unselect-after-save").addEventListener("change", function() {
        chrome.storage.sync.set({unselectAfterSave: this.checked});
    })
    document.getElementById("on_off").addEventListener("change", function() {
        chrome.storage.sync.set({enabled: this.checked});
    })
    chrome.storage.local.get("messages", (obj) => {
        document.getElementById("nummessages").innerHTML += obj.messages.length;
    })
}