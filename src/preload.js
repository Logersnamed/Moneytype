const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    log: (message) => ipcRenderer.invoke("console-log", message),
    error: (message) => ipcRenderer.invoke("console-error", message),
    onLoadTestData: (callback) => ipcRenderer.on('load-test-data', (event, data) => callback(data)),
    getTestData: async () => await ipcRenderer.invoke("get-test-data"),
    getConfig: async () => await ipcRenderer.invoke("get-config"),
    writeConfig: async (type, value) => ipcRenderer.invoke("write-config", type, value)
});