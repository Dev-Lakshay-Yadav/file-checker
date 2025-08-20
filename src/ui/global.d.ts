// global.d.ts
import type { FolderResult, PDFResult } from "../shared/types";

export {};

declare global {
  interface Window {
    api: {
      helloWorld: () => Promise<string>;
      openFolder: () => Promise<FolderResult>;
    };
  }
}