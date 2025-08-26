import { dialog } from "electron";
import fs from "fs/promises";
import path from "path";

export async function openFolder() {
  // Open folder selection dialog
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });

  if (canceled || filePaths.length === 0) return null;

  const folderPath = filePaths[0];
  const folderName = path.basename(folderPath); // 👈 Get folder name

  // Read all entries in folder
  const entries = await fs.readdir(folderPath, { withFileTypes: true });

  // Filter only files
  const files = entries
    .filter((entry) => entry.isFile())
    .map((file) => file.name);

  return { path: folderPath, name: folderName, files };
}




// preload
// openFolder: () => ipcRenderer.invoke("open-folder"),



// // main
// import { openFolder as folderService } from "./services/fileService.js";
// ipcMain.handle("open-folder", async () => {
//   try {
//     const result = await folderService();
//     if (!result) {
//       return { success: false, error: "Folder selection canceled" };
//     }
//     return { success: true, folder: result.path, files: result.files };
//   } catch (error) {
//     console.error("Folder open error:", error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Unknown error",
//     };
//   }
// });