const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("node:path");
const { getFileData } = require("./utils.js");

let configPath = "./config.json";

var testData;
var config;

const createWindow = () => {
  config = getFileData(configPath);
  const win = new BrowserWindow({
    width: config.window.width,
    height: config.window.height,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "/preload.js"),
    },
  });

  win.loadFile("src/index.html");

  win.webContents.once("did-finish-load", () => {
    testData = getFileData(config.test.path);
    win.webContents.send("load-test-data", testData);
    win.webContents.send("load-test", config);
    win.webContents.send("load-configuration", config);
  });

  win.on('will-resize', () => {
    win.webContents.send("update-visibility");
  });
  
};

function writeConfig(newConfig) {
  const fs = require("fs");

  fs.writeFile(configPath, JSON.stringify(newConfig, null, 2), "utf8", (writeErr) => {
    if (writeErr) {
      console.error("Error writing to config file:", writeErr);
      return;
    }
  });
  
  config = newConfig;
}

app.whenReady().then(() => {
  i = 0;
  ipcMain.handle("console-log", (event, message) => console.log(++i + ": " + message));
  ipcMain.handle("console-error", (event, message) => console.error("ERROR: " + message));
  ipcMain.handle("get-test-data", async () => {
    return testData;
  });
  ipcMain.handle("get-config", async () => {
    return config;
  });
  ipcMain.handle("write-config", (event, cfg) => writeConfig(cfg));
  ipcMain.handle("load-html", (event, path) => loadHTML(path));

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