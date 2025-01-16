const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("node:path");
const { loadTest } = require("./test.js");
const { getFileData } = require("./utils.js");


let currTestPath = "./src/tests/english.json";

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "src/preload.js"),
    },
  });

  win.loadFile("src/index.html");
};

app.whenReady().then(() => {
  createWindow();

  loadTest(getFileData(currTestPath));

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});