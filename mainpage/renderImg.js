const calculateHeight = () => {
    let heights = Array.from(document.querySelectorAll(".item")).map(elem => {
        let s = elem.style.transform;
        return parseInt(s.split("translateY")[1].slice(1, -3)) + elem.offsetHeight;
    })
    return Math.max.apply(null, heights);
}

const renderImg = () => {
    let maxHeight = calculateHeight();
    let clone = document.querySelector(".wrapper").cloneNode(true);
    clone.className = "wrapper-clone";
    clone.style.height = maxHeight + 20 + "px";
    document.body.appendChild(clone);
    html2canvas(clone, {allowTaint: true}).then(canvas => {
        document.querySelector(".render_result").appendChild(canvas)
        canvas.style.width = "100%"
        canvas.style.maxHeight ="calc(100% - 61px)"
        canvas.id = "imgc"
        //let img = canvas.toDataURL("image/png");
        //document.getElementById("downloadIMG").href = img;
        
    });
    document.querySelector(".render_result").style.display = "block";
    document.getElementById("closeRender").addEventListener('click', ()=>{
        let imgc = document.getElementById('imgc');
        document.querySelector(".render_result").removeChild(imgc);
        document.querySelector(".render_result").style.display = "none";
    })
    document.getElementById("downloadIMG").addEventListener('click', ()=>{

    })
    document.body.removeChild(clone);
}