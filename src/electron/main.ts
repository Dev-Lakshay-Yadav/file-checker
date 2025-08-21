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

  mainWindow.loadURL("http://localhost:3000"); // or loadFile in prod

  ipcMain.handle("extract-pdf-text", async (_event, fileData: Uint8Array) => {
    try {
      const result = await extractPdfText(fileData);
      if (result.error) return { error: result.error };
  
      const processed = result.text ? processPdfText(result.text) : null;
      return processed ?? { error: "No text extracted" };
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Failed to read PDF" };
    }
  });

  ipcMain.handle("open-folder", async () => {
    try {
      const result = await folderService();
      if (!result) return { success: false, error: "Folder selection canceled" };
      return { success: true, folder: result.path, files: result.files };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  });
});


























// import { extractPDFData } from "./services/pdfService.js";
// ipcMain.handle("parse-pdf", async (_event, fileBuffer: ArrayBuffer) => {
//   try {
//     const buffer = Buffer.from(fileBuffer);
//     const data = await extractPDFData(buffer);
//     return { success: true, data };
//   } catch (err) {
//     console.error("PDF parse error:", err);
//     return { success: false, error: (err as Error).message };
//   }
// });

// import { app, BrowserWindow, ipcMain } from "electron";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";
// import pdf from "pdf-parse";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// let mainWindow: BrowserWindow | null = null;

// const createWindow = () => {
//   mainWindow = new BrowserWindow({
//     webPreferences: {
//       preload: path.join(__dirname, "preload.js"),
//       contextIsolation: true,
//       nodeIntegration: false,
//       sandbox: false,
//     },
//   });

//   if (process.env.NODE_ENV === "development") {
//     mainWindow.loadURL("http://localhost:3000");
//   } else {
//     mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
//   }
// };

// // PDF extraction handler
// ipcMain.handle("extract-pdf-text", async (_event, fileData: Uint8Array) => {
//   try {
//     const buffer = Buffer.from(fileData); // convert here inside Node (safe)
//     const data = await pdf(buffer);
//     return { text: data.text, numpages: data.numpages };
//   } catch (err: any) {
//     return { error: err.message };
//   }
// });

// app.whenReady().then(createWindow);

// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") app.quit();
// });
