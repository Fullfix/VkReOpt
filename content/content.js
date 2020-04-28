const createIds = (ListOfMessages, oldMessages) => {
    let maxId;
    if (oldMessages.length > 0) {
        let Idlist = oldMessages.map((msg => msg[4]));
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

const showNotification = () => {
    let text = document.createElement("div");
    text.innerHTML = "Добавлены сообщения";
    text.style.position = "fixed";
    text.style.top = "200px";
    text.style.width = "100%";
    text.style.fontSize = "25px";
    text.style.zIndex = "999";
    text.style.textAlign = "center";
    text.style.opacity = "1";
    document.documentElement.appendChild(text);
    let op = 1;
    let h = 0;
    let changeOpacity = setInterval(() => {
        if (op <= 0) {
            clearInterval(changeOpacity);
            document.documentElement.removeChild(text);
        }
        else {
            op -= 0.03;
            h += 1;
        }
        text.style.top = (200 - h) + "px";
        text.style.opacity = op;
    }, 25);
}

const sendMessages = (ListOfMessages) => {
    chrome.storage.local.get("messages", (obj) => {
        chrome.storage.sync.get("allowSameMessages", (data) => {
            if (!data.allowSameMessages) {
                ListOfMessages = ListOfMessages.filter(msg => {
                    for (let oldmsg of obj.messages) {
                        if (msg[0] == oldmsg[0] && msg[1] == oldmsg[1] && msg[2] == oldmsg[2] 
                            && msg[3] == oldmsg[3]) {
                            return false;
                        }
                    }
                    return true;
                })
            }
            if (ListOfMessages.length > 0) {
                showNotification();
                newMessages = obj.messages.concat(createIds(ListOfMessages, obj.messages));
                chrome.storage.local.set({messages: newMessages});
            }
        })
    })
}

const parseTextDiv = (textDiv) => {
    let children = Array.from(textDiv.childNodes);
    let textList = children.filter(node => {
        return node.nodeName == "#text" || node.className == "emoji";
    });
    let imagesDiv = textDiv.querySelector('.page_post_sized_thumbs');
    let images = [];
    if (imagesDiv) {
        images = Array.from(imagesDiv.getElementsByTagName("a"))
        .map(elem => elem.style.backgroundImage.slice(5, -2));
    }
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
    return [textString, images];
}

window.onload = () => {
    document.addEventListener("keyup", (e) => {
        chrome.storage.sync.get("enabled", (endata) => {
            if (e.code == "AltRight" && endata.enabled) {
                let ListOfMessages = [];
                let ListOfDivs = document.getElementsByClassName("im-mess_selected")
                if (ListOfDivs.length >= 0) {
                    for (let div of ListOfDivs) {
                        let parent = div.parentNode.parentNode.parentNode
                        let photoURL = parent.getElementsByTagName("img")[0].src;
                        let name = parent.getElementsByClassName("im-mess-stack--lnk")[0].innerHTML;
                        let textDiv = div.getElementsByClassName("im-mess--text wall_module _im_log_body")[0];
                        let [text, images] = parseTextDiv(textDiv);
                        if (text) {
                            ListOfMessages.push([text, photoURL, name, "text"]);
                        }
                        if (images.length) {
                            for (let image of images) {
                                ListOfMessages.push([image, photoURL, name, "image"]);
                            }
                        }
                    }
                    if (ListOfMessages.length >= 0) {
                        sendMessages(ListOfMessages);
                        chrome.storage.sync.get("unselectAfterSave", (obj) => {
                            if (obj.unselectAfterSave) {
                                unselectMessages();
                            }
                        })
                    }
                }
            }
        })
    })
}
