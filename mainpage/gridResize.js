const minWidth = 300;
const minHeight = 300;

const addResizerGrid = (div) => {
    document.querySelector('.wrapper-wrapper').style.alignItems = "flex-start";
    document.querySelector('.wrapper-wrapper').style.justifyContent = "flex-start";
    div.classList.add('resizable');
    let resizer = document.createElement("div");
    resizer.className = "resizer-grid";
    div.appendChild(resizer);
    resizer.addEventListener('mousedown', initDrag);
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
        if (w >= minWidth && w <= window.innerWidth - 300) {
            div.style.width = w + 'px';
            grid.getElement().style.width = w + 'px';
            grid.refreshItems().layout();
        }
        if (h >= minHeight && h <= window.innerHeight - 80) {
            div.style.height = h + 'px';
        }
    }
    function stopDrag(ev) {
        document.documentElement.removeEventListener('mousemove', doDrag, false);
        document.documentElement.removeEventListener('mouseup', stopDrag, false);
    }
}

const removeResizerGrid = (div) => {
    div.removeChild(div.querySelector('.resizer-grid'));
    div.classList.remove('resizable');
    document.querySelector('.wrapper-wrapper').style.alignItems = "center";
    document.querySelector('.wrapper-wrapper').style.justifyContent = "center";
}

const initGridResizing = () => {
    const wrapper = document.querySelector('.wrapper');
    return {
        enableResizeMode: () => {
            addResizerGrid(wrapper);
            wrapper.classList.add('wrapper-resizable');
        },
        disableResizeMode: () => {
            removeResizerGrid(wrapper);
            wrapper.classList.remove('wrapper-resizable');
        }
    }
}