import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { openFolder as folderService } from "./services/fileService.js";
import { extractPdfText, processPdfText } from "./services/pdfService.js";

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

  // for development
  // mainWindow.loadURL("http://localhost:3000");

  // for production
  mainWindow.loadFile(path.join(__dirname, "../dist-react/index.html"));


  
  ipcMain.handle("extract-pdf-text", async (_event, fileData: Uint8Array) => {
    try {
      // Convert Uint8Array to Node.js Buffer
      const buffer = Buffer.from(fileData);

      // Pass buffer to your PDF library
      const result = await extractPdfText(buffer);
      if (result.error) return { error: result.error };

      const processed = result.text ? processPdfText(result.text) : null;
      return processed ?? { error: "No text extracted" };
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "Failed to read PDF",
      };
    }
  });

  ipcMain.handle("open-folder", async () => {
    try {
      const result = await folderService();
      if (!result)
        return { success: false, error: "Folder selection canceled" };
      return { success: true, folder: result.path, files: result.files };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  });
});
