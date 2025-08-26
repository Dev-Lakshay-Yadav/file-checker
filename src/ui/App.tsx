import React, { useState } from "react";
import PDFRead from "./components/PDFReader";
import FolderViewer from "./components/FolderViewer";
import Result from "./components/Result";

interface PDFResult {
  file_Prefix: string;
  service_Type: string;
  tooth_Numbers: number[];
  additional_Notes: string;
  error?: string;
}

declare global {
  interface Window {
    electronAPI: {
      helloWorld: () => Promise<string>;
      openFolder: () => Promise<{
        success: boolean;
        folder: string;
        folderName: string;
        files: string[];
      }>;
      extractPdfText: (
        fileData: Uint8Array
      ) => Promise<PDFResult | { error: string }>;
      parsePDF: (
        fileBuffer: ArrayBuffer
      ) => Promise<{ success: boolean; data?: any; error?: string }>;
    };
  }
}

const App: React.FC = () => {
  const [pdfData, setPdfData] = useState<PDFResult | null>(null);
  const [fileName, setFileName] = useState("");
  const [folderFiles, setFolderFiles] = useState<string[] | null>(null);
  const [folderName, setFolderName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setError(null);
      setPdfData(null);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        const result = await window.electronAPI.extractPdfText(uint8Array);

        if ("error" in result) {
          setError(result.error ?? "Unknown error");
        } else {
          setPdfData(result);
        }
      } catch (err: any) {
        setError(err.message || "Failed to read PDF");
      }
    }
  };

  const resetFolder = () => {
    setFolderFiles(null);
    setFolderName(null);
    setError(null);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="w-full h-full p-4 bg-gray-100">
        <PDFRead
          pdfData={pdfData}
          fileName={fileName}
          error={error}
          onUpload={handleUpload}
        />
      </div>
      <div className="w-full h-full">
        <FolderViewer
          folderFiles={folderFiles}
          setFolderFiles={setFolderFiles}
          folderName={folderName}
          setFolderName={setFolderName}
          error={error}
          setError={setError}
          onReset={resetFolder}
        />
      </div>
      <div className="w-full h-full">
        <Result folderFiles={folderFiles} pdfData={pdfData} folderName={folderName} />
      </div>
    </div>
  );
};

export default App;
