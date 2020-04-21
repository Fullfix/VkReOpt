const createIds = (ListOfMessages, oldMessages) => {
    let maxId;
    if (oldMessages.length > 0) {
        let Idlist = oldMessages.map((msg => msg[3]));
        maxId = Math.max(...Idlist);
    }
    else {
        maxId = 0
    }
    let newList = ListOfMessages.map((msg, i) => {
        msg.push(maxId + i + 1);
        return msg;
    })
    return newList;
}

const sendMessages = (ListOfMessages) => {
    chrome.storage.local.get("messages", (obj) => {
        newMessages = obj.messages.concat(createIds(ListOfMessages, obj.messages));
        chrome.storage.local.set({messages: newMessages});
    })
}

const parseTextDiv = (textDiv) => {
    let text = Array.from(textDiv.childNodes).find(node => node.nodeName == "#text");
    return text;
}

window.onload = () => {
    document.addEventListener("keydown", (e) => {
        if (e.code == "AltRight") {
            let ListOfMessages = [];
            let ListOfDivs = document.getElementsByClassName("im-mess_selected")
            for (let div of ListOfDivs) {
                let parent = div.parentNode.parentNode.parentNode
                let photoURL = parent.getElementsByTagName("img")[0].src;
                let name = parent.getElementsByClassName("im-mess-stack--lnk")[0].innerHTML;
                let textDiv = div.getElementsByClassName("im-mess--text wall_module _im_log_body")[0];
                let text = parseTextDiv(textDiv);
                if (text) {
                    ListOfMessages.push([text.nodeValue, photoURL, name]);
                }
            }
            if (ListOfMessages) {
                sendMessages(ListOfMessages);
            }
        }
    })
}
