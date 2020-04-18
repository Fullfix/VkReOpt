window.onload = () => {
    document.addEventListener("keydown", (e) => {
        if (e.code == "AltLeft") {
            let ListOfMessages = [];
            let ListOfDivs = document.getElementsByClassName("im-mess_selected")
            for (let div of ListOfDivs) {
                let parent = div.parentNode.parentNode.parentNode
                let photoURL = parent.getElementsByTagName("img")[0].src;
                let name = parent.getElementsByClassName("im-mess-stack--lnk")[0].innerHTML;
                let text = div.getElementsByClassName("im-mess--text wall_module _im_log_body")[0]
                .innerHTML;
                ListOfMessages.push([text, photoURL, name]);
            }
            chrome.storage.local.get("messages", (obj) => {
                newMessages = obj.messages.concat(ListOfMessages);
                chrome.storage.local.set({messages: newMessages});
            })
        }
    })
}