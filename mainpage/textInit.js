let cursorModeText = false;

const enableTextMode = () => {
    document.body.style.cursor = "url('../icons/texticon.png'), auto";
    cursorModeText = true;
}

const disableTextMode = () => {
    document.body.style.cursor = "auto";
    cursorModeText = false;
}

function getCoords(elem) {
    let box = elem.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}

const addResizer = (div) => {
    div.addEventListener("click", function init(ev) {
        div.removeEventListener("click", init);
        this.className = "text_div selected_text";
        let resizer = document.createElement("div");
        resizer.className = "resizer";
        div.appendChild(resizer);
        resizer.addEventListener('mousedown', initDrag);
    })
    let startX, startY, startWidth, startHeight;
    function initDrag(ev) {
        startX = ev.clientX;
        startY = ev.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(div).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(div).height, 10);
        document.documentElement.addEventListener('mousemove', doDrag, false);
        document.documentElement.addEventListener('mouseup', stopDrag, false);
     }
     function doDrag(ev) {
        let w = startWidth + ev.clientX - startX;
        let h = startHeight + ev.clientY - startY;
        if (w >= 30) {
            div.style.width = w + 'px';
        }
        if (h >= 30) {
            div.style.height = h + 'px';
        }
     }
     function stopDrag(ev) {
         document.documentElement.removeEventListener('mousemove', doDrag, false);
         document.documentElement.removeEventListener('mouseup', stopDrag, false);
     }
}

const addDragAndDrop = (div, width, height) => {
    div.onmousedown = function(e) {
        if (e.target.className == "resizer") {
            return;
        }
        let coords = getCoords(div);
        let shiftX = e.pageX - coords.left;
        let shiftY = e.pageY - coords.top;
        div.style.position = 'absolute';
        moveAt(e);
        div.style.zIndex = 1000;
        function moveAt(e) {
            let wrapper = document.querySelector('.wrapper');
            let w = e.pageX - shiftX - width;
            let h = e.pageY - shiftY - height;
            let maxW = wrapper.clientWidth - div.clientWidth;
            let maxH = wrapper.clientHeight - div.clientHeight;
            if (w < maxW)
                div.style.left = (w > 0 ? w : 0) + 'px';
            else
                div.style.left = maxW;
            if (h < maxH)
                div.style.top = (h > 0 ? h : 0) + 'px';
            else
                div.style.top = maxH;
        }
        document.onmousemove = function(e) {
            moveAt(e);
        };
        div.onmouseup = function() {
            document.onmousemove = null;
            div.onmouseup = null;
        };
    }
    div.ondragstart = function() {
        return false;
    };
}

const startTextAdding = (e) => {
    if (e.target.className == "text_inp" || e.target.className == "text_div") {
        return;
    }
    if (e.target.className == "resizer") {
        return;
    }
    let div = document.createElement("div");
    let inp = document.createElement("textarea");
    div.className = "text_div";
    inp.className = "text_inp";
    inp.readOnly = "true";
    inp.addEventListener("mouseout", function() {this.readOnly = "true"});
    inp.ondblclick = function() {this.readOnly = ""};
    let settings = document.querySelector('#settings');
    let width = 0;
    let height = 80;
    if (settings.style.transform == "translate(0px, 0px)") {
        width = 300;
    }
    div.addEventListener("mouseout", function (e) {
        this.className = "text_div";
    })
    let x = e.pageX - width;
    let y = e.pageY - height;
    div.style.left = (x > 0 ? x : 0) + 'px';
    div.style.top = (y > 0 ? y : 0) + 'px';
    div.style.position = "fixed";
    div.appendChild(inp);
    document.querySelector(".wrapper").appendChild(div);
    addResizer(div);
    addDragAndDrop(div, width, height);
}

const initText = () => {
    document.getElementById("textbut").addEventListener("click", () => {
        if (!cursorModeText) {
            enableTextMode();
            document.querySelector('.wrapper').addEventListener("click", startTextAdding);
        }
        else {
            disableTextMode();
            document.querySelector('.wrapper').removeEventListener("click", startTextAdding);
        }
    })
}