// preload.ts
import { contextBridge, ipcRenderer } from "electron";

// Define the return type of extractPdfText
export type PDFResult =
  | {
      file_Prefix: string;
      service_Type: "Crown and Bridge" | "Implant" | "Smile Design";
      tooth_Numbers: number[];
      additional_Notes: string;
    }
  | { error: string };

// Expose selected APIs to renderer
contextBridge.exposeInMainWorld("electronAPI", {
  openFolder: () => ipcRenderer.invoke("open-folder"),
  extractPdfText: (fileData: Uint8Array): Promise<PDFResult> =>
    ipcRenderer.invoke("extract-pdf-text", fileData),
  parsePDF: (fileBuffer: ArrayBuffer) =>
    ipcRenderer.invoke("parse-pdf", fileBuffer),
});

// TypeScript typings for the renderer process
declare global {
  interface Window {
    electronAPI: {
      helloWorld: () => Promise<string>;
      openFolder: () => Promise<string[]>;
      extractPdfText: (fileData: Uint8Array) => Promise<PDFResult>;
      parsePDF: (
        fileBuffer: ArrayBuffer
      ) => Promise<{ success: boolean; data?: any; error?: string }>;
    };
  }
}
