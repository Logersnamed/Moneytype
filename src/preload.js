const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    log: (message) => ipcRenderer.invoke("console-log", message),
    error: (message) => ipcRenderer.invoke("console-error", message),
    loadTestData: (callback) => ipcRenderer.on('load-test-data', (event, data) => callback(data)),
    loadTesto: (callback) => ipcRenderer.on('load-test', (event, cfg) => callback(cfg)),
    loadConfiguration: (callback) => ipcRenderer.on('load-configuration', (event, cfg) => callback(cfg)),
    getTestData: async () => await ipcRenderer.invoke("get-test-data"),
    getConfig: async () => await ipcRenderer.invoke("get-config"),
    writeConfig: async (type, value) => ipcRenderer.invoke("write-config", type, value),
    loadHTML: async (path) => ipcRenderer.invoke("load-html", path)
});