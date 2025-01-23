const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("node:path");
const { getFileData } = require("./utils.js");

let configPath = "./config.json";
let testData;
let config;

let win;

const createWindow = () => {
  config = getFileData(configPath);
  win = new BrowserWindow({
    width: config.window.width,
    height: config.window.height,
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "/preload.js"),
    },
  });

  win.loadFile("src/index.html");

  // For inspect
  win.webContents.openDevTools();

  win.once('ready-to-show', () => {
    win.show();
  })

  win.webContents.once("did-finish-load", () => {
    testData = getFileData(config.test.path);
    win.webContents.send("load-test-data", testData);
    win.webContents.send("load-test", config);
    win.webContents.send("load-configuration", config);
  });

  win.on('will-resize', () => {
    // Works incorrect
    // win.webContents.send("update-visibility");
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
  ipcMain.handle("get-test-data", async () => { return testData });
  ipcMain.handle("get-config", async () => { return config });
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

ipcMain.on("app/close", () => {
  app.quit();
});

ipcMain.on("app/minimize", () => {
  win.minimize();
});