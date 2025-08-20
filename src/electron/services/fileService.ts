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

  // Read all entries in folder
  const entries = await fs.readdir(folderPath, { withFileTypes: true });

  // Filter only files
  const files = entries
    .filter((entry) => entry.isFile())
    .map((file) => file.name);

  return { path: folderPath, files };
}
