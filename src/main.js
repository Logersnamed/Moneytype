const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("node:path");
const { getFileData } = require("./utils.js");

let currTestPath = "./src/tests/english.json";

var testData;

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

  // Send test data to the renderer process
  win.webContents.once("did-finish-load", () => {
    testData = getFileData(currTestPath);
    // console.log(testData);
    win.webContents.send("load-test-data", testData);
  });
};

app.whenReady().then(() => {
  ipcMain.handle('console-log', (event, message) => console.log(message));
  ipcMain.handle('console-error', (event, message) => console.error(message));
  ipcMain.handle("get-test-data", async () => { return testData });

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
