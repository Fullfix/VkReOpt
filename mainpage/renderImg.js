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
        document.body.appendChild(canvas)
    });
    document.body.removeChild(clone);
}