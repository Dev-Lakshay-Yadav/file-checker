import { app, BrowserWindow, dialog, ipcMain } from "electron";
import path from "path";
import { helloWorld, isDev } from "./utils.js";
import { fileURLToPath } from "url";
import { extractPDFData } from "./services/pdfService.js";

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

  ipcMain.handle("parse-pdf", async (_event, fileBuffer: ArrayBuffer) => {
    try {
      // Convert ArrayBuffer to Node Buffer
      const buffer = Buffer.from(fileBuffer);

      // Pass the buffer directly to pdf parsing
      const data = await extractPDFData(buffer);

      return { success: true, data };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });
});
