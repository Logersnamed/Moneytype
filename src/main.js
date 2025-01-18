const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("node:path");
const { getFileData } = require("./utils.js");

let lastTestPath = "";
let configPath = "./config.json";

var testData;
var config;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "/preload.js"),
    },
  });

  win.loadFile("src/index.html");

  win.webContents.once("did-finish-load", () => {
    config = getFileData(configPath);
    lastTestPath = config.test.path;
    testData = getFileData(config.test.path);
    win.webContents.send("load-test-data", testData);
  });
};

app.whenReady().then(() => {
  ipcMain.handle('console-log', (event, message) => console.log(message));
  ipcMain.handle('console-error', (event, message) => console.error(message));
  ipcMain.handle("get-test-data", async () => { return testData });
  ipcMain.handle("get-config", async () => { 
    config = getFileData(configPath);

    if (config.test.path != lastTestPath){
      lastTestPath = config.test.path;
      testData = getFileData(config.test.path);
    }

    return config;
  });

  createWindow();


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
