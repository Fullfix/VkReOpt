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

const convertSource = (src) => {
    if (src.startsWith("/")) {
        return "https://vk.com" + src;
    }
    return src;
}

const unselectMessages = () => {
    let btn = document.getElementsByClassName("im-page--selected-messages-remove")
    if (btn) btn[0].click();
}

const sendMessages = (ListOfMessages) => {
    chrome.storage.local.get("messages", (obj) => {
        newMessages = obj.messages.concat(createIds(ListOfMessages, obj.messages));
        chrome.storage.local.set({messages: newMessages});
    })
}

const parseTextDiv = (textDiv) => {
    let textList = Array.from(textDiv.childNodes).filter(node => {
        return node.nodeName == "#text" || node.className == "emoji";
    });
    let textString = "";
    for (let node of textList) {
        if (node.nodeType == 1) {
            if (node.className == "emoji") {
                node.src = convertSource(node.src);
            }
            textString += node.outerHTML;
        }
        else if (node.nodeType == 3) {
            textString += node.nodeValue;
        }
    }
    return textString;
}

window.onload = () => {
    document.addEventListener("keydown", (e) => {
        if (e.code == "AltRight") {
            let ListOfMessages = [];
            let ListOfDivs = document.getElementsByClassName("im-mess_selected")
            if (ListOfDivs) {
                for (let div of ListOfDivs) {
                    let parent = div.parentNode.parentNode.parentNode
                    let photoURL = parent.getElementsByTagName("img")[0].src;
                    let name = parent.getElementsByClassName("im-mess-stack--lnk")[0].innerHTML;
                    let textDiv = div.getElementsByClassName("im-mess--text wall_module _im_log_body")[0];
                    let text = parseTextDiv(textDiv);
                    if (text) {
                        ListOfMessages.push([text, photoURL, name]);
                    }
                }
                if (ListOfMessages) {
                    sendMessages(ListOfMessages);
                    unselectMessages();
                }
            }
        }
    })
}
