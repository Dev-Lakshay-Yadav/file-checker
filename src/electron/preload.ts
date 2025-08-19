import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  helloWorld: () => ipcRenderer.invoke("helloWorld"),
});
