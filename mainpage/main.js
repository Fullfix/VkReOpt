const deleteMessage = function() {
    let id = this.parentNode.id.split("message")[1];
    this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
    chrome.storage.local.get("messages", (obj) => {
        let newMessages = obj.messages.filter(msg => msg[3] != id);
        chrome.storage.local.set({messages: newMessages});
    })
}

const setDragDrop = function() {
    let sortable = new Sortable(document.getElementById("content"), {
        animation: 150
    })
}

const loadScreen = function() {
    document.getElementById("content").innerHTML = ""
    chrome.storage.local.get("messages", (obj) => {
        for (let message of obj.messages) {
            let messageDiv = document.createElement("div");
            messageDiv.id = "message" + message[3];
            messageDiv.className = "message_main";
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
            messageCont.className = "message_cont"
            messageCont.appendChild(messageDiv);
            document.getElementById("content").appendChild(messageCont);
        }
        setDragDrop();
    })
}

window.onload = () => {
    loadScreen();
    chrome.runtime.onMessage.addListener((message) => {
        if (message.activated) {
            loadScreen();
        }
    })

}
let flag = false;
let con = document.getElementById("content");
document.getElementById("but").addEventListener("click", ChangeType);
function ChangeType() {
    if (!flag){
        con.style.gridTemplateColumns = "repeat(auto-fit, minmax(200px, 1fr))";
        flag = true;
    }
    else {
        con.style.gridTemplateColumns = "repeat(auto-fill, minmax(200px, 1fr))"
        flag = false
    }
}