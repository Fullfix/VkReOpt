
function OpenSettings() {
    let settings = document.getElementById("settings");
    if (settings.style.transform == "translate(-300px, 0px)") {
        settings.style.transform = "translate(0px, 0px)";
        root.style.setProperty('--gridWidth', "calc(100vw - 300px)");
        root.style.setProperty('--TXGrid', 300 + 'px');
        grid.refreshItems().layout();
    }
    else {
        settings.style.transform = "translate(-300px, 0px)";
        root.style.setProperty('--gridWidth', 100 + 'vw');
        root.style.setProperty('--TXGrid', 0 + 'px');
        grid.refreshItems().layout();
    }
}
let flag = false;
let BlurFlag = false;
let con = document.getElementById("content");
let save = document.getElementById("saveSettings");
document.getElementById("but").addEventListener("click", OpenSettings);
document.getElementById("blurbut").addEventListener("click", MakeBlur);

function MakeBlur() {
    if (!BlurFlag) {
        root.style.setProperty('--VarBlur', 'blur(5px)');
        root.style.setProperty('--BlurInvert', '1');
        BlurFlag = true;
    }
    else {
        root.style.setProperty('--VarBlur', 'none');
        root.style.setProperty('--BlurInvert', '0');
        BlurFlag = false;
    }
}

let TextGapX = document.getElementById('gridGap_X');
let TextGapY = document.getElementById("gridGap_Y");
let GridElSize = document.getElementById("gridElSize");
let sliderGapX = document.getElementById('slider_gapX');

noUiSlider.create(sliderGapX, {
    start: [5],
    connect: true,
    range: {
        'min': [0, 1],
        'max': 50
    }
});
let sliderGapY = document.getElementById('slider_gapY');

noUiSlider.create(sliderGapY, {
    start: [5],
    connect: true,
    range: {
        'min': [0, 1],
        'max': 50
    }
});
let sliderSize = document.getElementById('slider_size');

noUiSlider.create(sliderSize, {
    start: [250],
    connect: true,
    range: {
        'min': [100, 5],
        'max': 500
    }
});

sliderGapX.noUiSlider.on('update', function (values, handle) {
    root.style.setProperty('--gap_X', (5 + +values[handle]) + 'px');
    TextGapX.value = values[handle];
    grid.refreshItems().layout();
});
sliderGapY.noUiSlider.on('update', function (values, handle) {
    root.style.setProperty('--gap_Y', (5 + +values[handle]) + 'px');
    TextGapY.value = values[handle];
    grid.refreshItems().layout();
});

sliderSize.noUiSlider.on('update', function (values, handle) {
    root.style.setProperty('--sizeX', (+values[handle]) + 'px');
    GridElSize.value = values[handle];
    let maxh = -1;
    grid.refreshItems().layout();
    root.style.setProperty('--height', "auto");
    for (let i = 1; i <= maxid+1; i++){
        if (document.getElementById(i) != null && maxh < document.getElementById(i).clientHeight) maxh = document.getElementById(i).clientHeight;
    }
    root.style.setProperty('--height', maxh-10 + "px");
    grid.refreshItems().layout();
});