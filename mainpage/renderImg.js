const calculateHeight = (clone) => {
    let heights = Array.from(clone.querySelectorAll(".item")).map(elem => {
        let s = elem.style.transform;
        console.log(elem.offsetHeight);
        return parseInt(s.split("translateY")[1].slice(1, -3)) + elem.offsetHeight;
    })
    let textHeights = Array.from(clone.querySelectorAll(".text_div")).map(div => {
        let top = div.style.top.slice(0, -2);
        return parseInt(top) + parseInt(document.defaultView.getComputedStyle(div).height, 10);
    })
    if (textHeights.length == 0) textHeights = [0];
    return Math.max(Math.max.apply(null, heights), Math.max.apply(null, textHeights));
}

const prepareText = (clone) => {
    clone.querySelectorAll(".text_div").forEach(div => {
        div.className = "text_div";
        div.style.border = "0";
        if (div.querySelector(".text_inp").innerHTML == "") {
            clone.removeChild(div);
            return;
        }
    })
}

const renderImg = () => {
    let clone = document.querySelector(".wrapper").cloneNode(true);
    document.body.appendChild(clone);
    prepareText(clone);
    let maxHeight = calculateHeight(clone);
    clone.className = "wrapper-clone";
    clone.style.height = maxHeight + 50 + "px";
    clone.style.position = "relative";
    clone.style.left = 0 + "px";
    clone.style.top = 0 + "px";
    html2canvas(clone, {allowTaint: true}).then(canvas => {
        document.querySelector(".render_result").appendChild(canvas)
        canvas.style.width = "100%"
        canvas.style.maxHeight ="calc(100% - 61px)"
        canvas.id = "imgc"
        document.querySelector(".render_result").style.height = maxHeight + 150 + 'px';
        //let img = canvas.toDataURL("image/png");
        //document.getElementById("downloadIMG").href = img;
        
    });
    document.querySelector(".black_screen").style.opacity = 1;
    document.querySelector(".black_screen").style.pointerEvents = "";
    document.getElementById("closeRender").addEventListener('click', ()=>{
        let imgc = document.getElementById('imgc');
        if (imgc)
            document.querySelector(".render_result").removeChild(imgc);
        document.querySelector(".black_screen").style.opacity = 0;
        document.querySelector(".black_screen").style.pointerEvents = "none";
        
    })
    document.body.removeChild(clone);
}