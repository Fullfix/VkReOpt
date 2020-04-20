const deleteMessage = function() {
    let id = this.parentNode.id.split("message")[1];
    grid.remove(this.parentElement.parentElement)
    this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
    chrome.storage.local.get("messages", (obj) => {
        let newMessages = obj.messages.filter(msg => msg[3] != id);
        chrome.storage.local.set({messages: newMessages});
    })
}

const changeMessageOrder = (messages) => {
    let ids = Array.from(messages).map(elem => elem.id.split("message")[1]);
    chrome.storage.local.get("messages", (obj) => {
        let newMessages = [];
        for (let id of ids) {
            let message = obj.messages.find(msg => msg[3] == id);
            newMessages.push(message);
        }
        chrome.storage.local.set({messages: newMessages});
    })
}

let grid = new Muuri('.grid', {dragEnabled: true, dragPlaceholder: {
        enabled: true
    }, layout: {

    }, dragSortPredicate:{
        threshold: 30
    }});
grid.on('dragReleaseEnd', (item) => {
    changeMessageOrder(grid.getItems().map(elem => {
        return elem.getElement().getElementsByClassName("item-content")[0];
    }));
})
let maxid = -1;
const loadScreen = function() {
    document.getElementById("grid").innerHTML = ""
    chrome.storage.local.get("messages", (obj) => {
        for (let message of obj.messages) {
            let maxh = -1;
            root.style.setProperty('--height', "auto");
            let messageDiv = document.createElement("div");
            messageDiv.id = "message" + message[3];
            messageDiv.className = "item-content";
            let textDiv = document.createElement("div");
            textDiv.innerHTML = message[0];
            textDiv.className = "message_text";
            let image = document.createElement("img");
            image.src = message[1];
            image.className = "message_img";
            let infoDiv = document.createElement("div");
            infoDiv.innerHTML = message[2];
            infoDiv.className = "message_info";
            let deleteBtn = document.createElement("button");
            deleteBtn.className = "message_delete";
            deleteBtn.addEventListener("click", deleteMessage);
            let deleteIcon = document.createElement("img");
            deleteIcon.src = "../icons/delete_icon.png";
            deleteIcon.className = "img_delete";
            deleteBtn.appendChild(deleteIcon);
            messageDiv.appendChild(image);
            messageDiv.appendChild(infoDiv);
            messageDiv.appendChild(deleteBtn);
            messageDiv.appendChild(textDiv);
            let messageCont = document.createElement("div");
            messageCont.className = "item"
            messageCont.appendChild(messageDiv);
            grid.add(messageCont);
            messageCont.id = message[3];
            if (maxid < messageCont.id) maxid = messageCont.id;
            for (let i = 1; i <= maxid+1; i++){
                if (document.getElementById(i) != null && maxh < document.getElementById(i).clientHeight) maxh = document.getElementById(i).clientHeight;
            }
            root.style.setProperty('--height', maxh-10 + "px");
            grid.refreshItems().layout();
        }
    })

}
function OpenSettings() {

    let settings = document.getElementById("settings");
    if (settings.style.transform == "translate(-300px, 0px)") {
        settings.style.transform = "translate(0px, 0px)";
        root.style.setProperty('--gridWidth', "calc(100vw - 300px)");
        root.style.setProperty('--TXGrid', 300 + 'px');
        grid.refreshItems().layout();
    }
    else {
        settings.style.transform = "translate(-300px, 0px)";
        root.style.setProperty('--gridWidth', 100 + 'vw');
        root.style.setProperty('--TXGrid', 0 + 'px');
        grid.refreshItems().layout();
    }
}
window.onload = () => {
    loadScreen();
    grid.refreshItems().layout();
    chrome.runtime.onMessage.addListener((message) => {
        if (message.activated) {
            loadScreen();
            grid.refreshItems().layout();
        }
    })

}
let flag = false;
let root = document.documentElement;
root.style.setProperty('--typeGrid', "auto-fill");
root.style.setProperty('--gap_X', 10 + 'px');
root.style.setProperty('--gap_Y', 10 + 'px');
root.style.setProperty('--sizeX', 250 + 'px');
root.style.setProperty('--gridWidth', 100 + 'vw');
root.style.setProperty('--TXGrid', 0 + 'px');
let con = document.getElementById("content");
let save = document.getElementById("saveSettings");
document.getElementById("but").addEventListener("click", OpenSettings);
save.addEventListener('click', ChangeType);
function ChangeType() {
    let GridGap_X = document.getElementById("gridGap_X");
    let GridGap_Y = document.getElementById("gridGap_Y");
    let GridElSize = document.getElementById("gridElSize");
    root.style.setProperty('--gap_X', (5 + +GridGap_X.value) + 'px');
    root.style.setProperty('--gap_Y', (5 + +GridGap_Y.value) + 'px');
    root.style.setProperty('--sizeX', + GridElSize.value + 'px');
    grid.refreshItems().layout();
}