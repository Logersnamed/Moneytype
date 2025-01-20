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
};

function writeConfig(type, value) {
  const fs = require("fs");

  return new Promise((resolve, reject) => {
    fs.readFile(configPath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading config file:", err);
        reject(err);
        return;
      }

      try {
        config = JSON.parse(data);
        
        if (type !== null) {
          config.test.type = type;
        }

        if (type === "time" && value !== null) {
          config.test.time = value;
        } else if (type === "words" && value !== null) {
          config.test.words = value;
        }

        fs.writeFile(configPath, JSON.stringify(config, null, 2), "utf8", (writeErr) => {
          if (writeErr) {
            console.error("Error writing to config file:", writeErr);
            reject(writeErr);
            return;
          }
          resolve();
        });
      } catch (parseErr) {
        console.error("Error parsing JSON:", parseErr);
        reject(parseErr);
      }
    });
  });
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
  ipcMain.handle("write-config", (event, type, value) => writeConfig(type, value));
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