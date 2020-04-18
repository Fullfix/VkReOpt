const renderMainPage = () => {
    chrome.tabs.create({url: chrome.extension.getURL("mainpage/main.html")})
}

window.onload = () => {
    document.getElementById("redirectbtn").addEventListener("click", renderMainPage)
}