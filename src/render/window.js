const MINUS = document.getElementById("minimize")
const CLOSE_APP = document.getElementById("close-app")

MINUS.addEventListener("click", minimize);
CLOSE_APP.addEventListener("click", close_app);

function close_app () {
    window.electronAPI.closeWindow();
}

function minimize () {
    window.electronAPI.minimizeWindow();
}