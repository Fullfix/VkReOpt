let GridElSize = document.getElementById("gridElSize");
const root = document.documentElement;
let maxid = -1;
root.style.setProperty('--typeGrid', "auto-fill");
root.style.setProperty('--gap_X', 10 + 'px');
root.style.setProperty('--gap_Y', 10 + 'px');
root.style.setProperty('--sizeX', 250 + 'px');
root.style.setProperty('--gridWidth', 100 + 'vw');
root.style.setProperty('--TXGrid', 0 + 'px');
const deleteMessage = function() {
    let id = this.parentNode.id.split("message")[1];
    grid.remove(this.parentElement.parentElement)
    this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
    chrome.storage.local.get("messages", (obj) => {
        let newMessages = obj.messages.filter(msg => msg[4] != id);
        chrome.storage.local.set({messages: newMessages});
    })
}

const changeMessageOrder = (messages) => {
    let ids = Array.from(messages).map(elem => elem.id.split("message")[1]);
    chrome.storage.local.get("messages", (obj) => {
        let newMessages = [];
        for (let id of ids) {
            let message = obj.messages.find(msg => msg[4] == id);
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

const findBestHeight = (H, h) => {
    let AllHeights = []
    for (let n=1;n<=5;n++) {
        AllHeights.push(n*h - 10 - H);
    }
    AllHeights.sort((a, b) => {
        if (Math.abs(a) > Math.abs(b)) return 1;
        else if (Math.abs(a) < Math.abs(b)) return -1;
        else return 0; 
    })
    return AllHeights[0] + H;
}


let maxh = -1;
const loadScreen = function() {
    document.getElementById("grid").innerHTML = ""
    chrome.storage.local.get("messages", (obj) => {
        for (let message of obj.messages) {
            maxh = -1;
            root.style.setProperty('--height', "auto");
            let messageDiv = document.createElement("div");
            messageDiv.id = "message" + message[4];
            messageDiv.className = "item-content";
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
            let messageCont = document.createElement("div");
            if (message[3] == "text") {
                let textDiv = document.createElement("div");
                textDiv.innerHTML = message[0];
                textDiv.className = "message_text";
                messageDiv.appendChild(textDiv);
                messageCont.id = message[4];
            }
            else {
                var imageDiv = document.createElement("img");
                imageDiv.src = message[0];
                imageDiv.className = "message_image";
                messageDiv.appendChild(imageDiv);
                messageCont.id = 'img' + message[4];
                messageCont.style.height = 'auto';
            }
            messageCont.className = "item " + message[3];
            messageCont.appendChild(messageDiv);
            grid.add(messageCont);
            
            if (messageCont.id != 'img' + message[4] && maxid < messageCont.id) maxid = messageCont.id;
            for (let i = 1; i <= maxid+1; i++){
                if (document.getElementById(i) != null && maxh < document.getElementById(i).clientHeight) 
                    maxh = document.getElementById(i).clientHeight;
            }
            root.style.setProperty('--height', maxh-10 + "px");
            if (message[3] != "text"){
                // imageDiv.style.height = imageDiv.clientHeight - imageDiv.clientHeight % (maxh) + "px";
                // imageDiv.style.height = findBestHeight(imageDiv.clientHeight, maxh) + "px";
            }
            grid.refreshItems().layout();
        }
    })

}

const openDonate = () => {
    document.querySelector(".donate-layout").style.opacity = 1;
    document.querySelector(".donate-layout").style.pointerEvents = "";
    document.querySelector(".donate-layout").addEventListener("click", function blclick(e) {
        if (e.target.className === 'donate-layout') {
            closeDonate();
            document.querySelector(".donate-layout").removeEventListener("click", blclick);
        }
    })
}

const closeDonate = () => {
    document.querySelector(".donate-layout").style.opacity = 0;
    document.querySelector(".donate-layout").style.pointerEvents = "none";
}

window.onload = () => {
    grid.remove();
    loadScreen();
    grid.refreshItems().layout();
    chrome.runtime.onMessage.addListener((message) => {
        if (message.activated) {
            grid.remove();
            loadScreen();
            grid.refreshItems().layout();
        }
    })
    initText();
    let scr = document.createElement("script");
    scr.src = "settings.js";
    document.body.appendChild(scr);
    let r = Math.floor(Math.random() * 10);
    if (r == 9){
        openDonate();
    }
    document.getElementById("bye").addEventListener('click', () => {
        closeDonate();
    })
}
