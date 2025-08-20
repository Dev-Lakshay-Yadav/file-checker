import { app, BrowserWindow, dialog, ipcMain } from "electron";
import path from "path";
import { helloWorld, isDev } from "./utils.js";
import { fileURLToPath } from "url";
import { openFolder as folderService } from "./services/fileService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }

  // helloWorld
  ipcMain.handle("helloWorld", () => helloWorld());

  // open-folder
  ipcMain.handle("open-folder", async () => {
    try {
      const result = await folderService();
      if (!result) {
        return { success: false, error: "Folder selection canceled" };
      }
      return { success: true, folder: result.path, files: result.files };
    } catch (error) {
      console.error("Folder open error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  });
});
