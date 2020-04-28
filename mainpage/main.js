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
function matrixToArray(str) {
    return str.match(/(-?[0-9\.]+)/g);
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
/*grid.on('dragReleaseEnd', (item) => {
    changeMessageOrder(grid.getItems().map(elem => {
        return elem.getElement().getElementsByClassName("item-content")[0];
    }));
})*/
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
            console.log(message[3])
            console.log(message[4])
            if (typeof message[3] != 'number')
            messageCont.id = message[4];
            else messageCont.id = message[3];
            messageCont.setAttribute('linked', false);
            if (maxid < messageCont.id) maxid = messageCont.id;
            for (let i = 1; i <= maxid+1; i++){
                if (document.getElementById(i) != null && maxh < document.getElementById(i).clientHeight) maxh = document.getElementById(i).clientHeight;
            }
            root.style.setProperty('--height', maxh-10 + "px");
            for (let i in message[3]){
                let imgImage = document.createElement('img');
                imgImage.src = message[3][i];
                console.log(message[3][i]);
                let mul = imgImage.naturalWidth / +GridElSize.value;
                console.log(imgImage.naturalWidth);
                console.log(+GridElSize.value);
                console.log(mul);
                imgImage.width = GridElSize.value;
                imgImage.height = imgImage.naturalHeight / mul;
                imgImage.height = imgImage.height - imgImage.height % (maxh + 6);
                let imgDiv = document.createElement('div');
                imgDiv.appendChild(imgImage);
                imgDiv.className = "item-content";
                let imgCont = document.createElement('div');
                imgCont.appendChild(imgDiv);
                imgCont.className = "item";
                imgCont.id = 'img' + message[4] + i;
                grid.add(imgCont);
                imgCont.style.width = imgImage.width + 'px';
                imgCont.style.height = imgImage.height + 'px';
                let sv = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                let rope = document.createElementNS("http://www.w3.org/2000/svg", "line");
                sv.setAttribute('class', "lineSV")
                let fe = messageCont;
                let se = imgCont;
                let coors1 = matrixToArray(fe.style.transform);
                let coors2 = matrixToArray(se.style.transform);
                sv.appendChild(rope);
                rope.id = "line" + message[4] + i;
                rope.setAttribute('x1', (+coors2[0] + +GridElSize.value / 2));
                rope.setAttribute('from', messageCont.id);
                rope.setAttribute('to', imgCont.id);
                rope.setAttribute('y1', (+coors2[1] + maxh / 2));
                rope.setAttribute('x2', (+coors1[0] + +GridElSize.value / 2));
                rope.setAttribute('y2', (+coors1[1] + maxh / 2));
                rope.setAttribute('stroke', "red");
                messageCont.setAttribute('linked', true);
                imgCont.setAttribute('linked', true);
                document.querySelector('.wrapper').appendChild(sv);

            }
            grid.refreshItems().layout();
        }
    })

}
grid.on('dragMove', function (item, event) {
    if (item._element.getAttribute('linked') == 'true'){
        let ropes = document.querySelectorAll('line');
        let el = item.getElement();
        for (let i in ropes){
            console.log(ropes[i])
            try {
                if (ropes[i].getAttribute('from') == el.id){
                    let coord = matrixToArray(el.style.transform);
                    ropes[i].setAttribute('x2', +coord[0] + +GridElSize.value / 2)
                    ropes[i].setAttribute('y2', +coord[1] + maxh / 2)
                }
                else if (ropes[i].getAttribute('to') == el.id){
                    let coord = matrixToArray(el.style.transform);
                    ropes[i].setAttribute('x1', +coord[0] + +GridElSize.value / 2)
                    ropes[i].setAttribute('y1', +coord[1] + maxh / 2)
                }
            } catch(e){
                console.log('Пофиг...')
            }

        }
    }
});
grid.on('dragEnd', function(item, event){
    if (item._element.getAttribute('linked') == 'true'){
        let interval = setInterval(()=>{
            let ropes = document.querySelectorAll('line');
            let el = item.getElement();
            for (let i in ropes){
                console.log(ropes[i])
                try {
                    if (ropes[i].getAttribute('from') == el.id){
                        let coord = matrixToArray(el.style.transform);
                        ropes[i].setAttribute('x2', +coord[0] + +GridElSize.value / 2)
                        ropes[i].setAttribute('y2', +coord[1] + maxh / 2)
                    }
                    else if (ropes[i].getAttribute('to') == el.id){
                        let coord = matrixToArray(el.style.transform);
                        ropes[i].setAttribute('x1', +coord[0] + +GridElSize.value / 2)
                        ropes[i].setAttribute('y1', +coord[1] + maxh / 2)
                    }
                    clearInterval(interval)
                } catch(e){
                    console.log('Пофиг...')
                }

            }}, 100);
    }
})
grid.on('move', function(item, event){
    console.log('dd')
    let interval2 = setInterval(()=>{
        let ropes = document.querySelectorAll('line');
        for (let j in ropes){
            try {
            let fs = document.getElementById(ropes[j].getAttribute('from'));
            } catch(e){
                console.log('СверхПофиг...')
                clearInterval(interval2)
            }
            let fs = document.getElementById(ropes[j].getAttribute('from'));
            let sc = document.getElementById(ropes[j].getAttribute('to'));
            let coord1 = matrixToArray(fs.style.transform);
            ropes[j].setAttribute('x2', +coord1[0] + +GridElSize.value / 2)
            ropes[j].setAttribute('y2', +coord1[1] + maxh / 2)
            let coord2 = matrixToArray(sc.style.transform);
            ropes[j].setAttribute('x1', +coord2[0] + +GridElSize.value / 2)
            ropes[j].setAttribute('y1', +coord2[1] + maxh / 2)
        }
        clearInterval(interval2)
    }, 100);
})
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
}
