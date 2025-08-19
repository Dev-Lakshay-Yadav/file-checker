import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { helloWorld, isDev } from "./utils.js";

let mainWindow: BrowserWindow | null = null;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(app.getAppPath(), "preload.js"),
    },
  });
  if (isDev()) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath() + "/dist-react/index.html"));
  }

  // Handle IPC request
  ipcMain.handle("helloWorld", () => {
    return helloWorld();
  });
});
