import { contextBridge, ipcRenderer } from "electron";

export type PDFResult = {
  file_Prefix: string | null;
  service_Type: "Crown And Bridge" | "Implant" | "Smile Design" | null;
  tooth_Numbers: number[];
  additional_Notes: string | null;
};

contextBridge.exposeInMainWorld("electronAPI", {
  helloWorld: () => ipcRenderer.invoke("helloWorld"),
  parsePDF: (filePath: string) => ipcRenderer.invoke("parse-pdf", filePath), // fixed
  getFilePath: (file: File) => {
    // Electron File object has a `path` property
    return (file as any).path || "";
  },
});
