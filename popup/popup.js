const renderMainPage = () => {
    chrome.tabs.create({url: chrome.extension.getURL("mainpage/main.html")});
    chrome.extension.sendMessage({mainpagecreated: true});
}

window.onload = () => {
    document.getElementById("redirectbtn").addEventListener("click", renderMainPage)
}