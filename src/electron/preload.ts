// import { contextBridge, ipcRenderer } from "electron";

// export type PDFResult = {
//   file_Prefix: string | null;
//   service_Type: "Crown And Bridge" | "Implant" | "Smile Design" | null;
//   tooth_Numbers: number[];
//   additional_Notes: string | null;
// };

// contextBridge.exposeInMainWorld("electronAPI", {
//   helloWorld: () => ipcRenderer.invoke("helloWorld"),
//   openFolder: () => ipcRenderer.invoke("open-folder"),
  // parsePDF: (filePath: string) => ipcRenderer.invoke("parse-pdf", filePath), // fixed
  // getFilePath: (file: File) => {
  //   // Electron File object has a `path` property
  //   return (file as any).path || "";
  // },
// });




import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  extractPdfText: (fileData: Uint8Array) =>
    ipcRenderer.invoke("extract-pdf-text", fileData),
});


declare global {
  interface Window {
    electronAPI: {
      extractPdfText: (filePath: string) => Promise<{ text?: string; numpages?: number; error?: string }>;
    };
  }
}
