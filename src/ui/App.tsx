// import { useState } from "react";
// import FolderViewer from "./components/FolderViewer";
// import PDFReader from "./components/PDFReader";
// import Result from "./components/Result";

// const App = () => {
//   // Centralized state
//   const [pdfData, setPdfData] = useState<any>(null);
//   const [pdfFile, setPdfFile] = useState<File | null>(null);
//   const [folderFiles, setFolderFiles] = useState<string[] | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // Reset handlers
//   const resetPDF = () => {
//     setPdfData(null);
//     setPdfFile(null);
//     setError(null);
//   };
//   const resetFolder = () => {
//     setFolderFiles(null);
//     setError(null);
//   };

//   return (
//     <div className="p-4 max-w-4xl mx-auto space-y-6">
//       <FolderViewer
//         folderFiles={folderFiles}
//         setFolderFiles={setFolderFiles}
//         error={error}
//         setError={setError}
//         onReset={resetFolder}
//       />
//       <PDFReader
//         pdfData={pdfData}
//         setPdfData={setPdfData}
//         pdfFile={pdfFile}
//         setPdfFile={setPdfFile}
//         error={error}
//         setError={setError}
//         onReset={resetPDF}
//       />
// <Result folderFiles={folderFiles} pdfData={pdfData} />
//     </div>
//   );
// };

// export default App;
import React, { useState } from "react";
import PDFRead from "./components/PDFRead";
import FolderViewer from "./components/FolderViewer";
import Result from "./components/Result";

interface PDFResult {
  file_Prefix: string;
  service_Type: string;
  tooth_Numbers: number[];
  additional_Notes: string;
  error?: string;
}

const App: React.FC = () => {
  const [pdfData, setPdfData] = useState<PDFResult | null>(null);
  const [fileName, setFileName] = useState("");
  const [folderFiles, setFolderFiles] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);

      // Convert File → ArrayBuffer → Uint8Array
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const result = await window.electronAPI.extractPdfText(uint8Array);

      if ("error" in result) {
        setError(result.error);
        setPdfData(null);
      } else {
        setError(null);
        setPdfData(result);
      }
    }
  };

  const resetFolder = () => {
    setFolderFiles(null);
    setError(null);
  };

  const handleReset = () => {
    setPdfData(null);
    setFileName("");
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
          onReset={handleReset}
        />
      </div>
      <div className="w-full h-full">
        <FolderViewer
          folderFiles={folderFiles}
          setFolderFiles={setFolderFiles}
          error={error}
          setError={setError}
          onReset={resetFolder}
        />
      </div>
      <div className="w-full h-full">
        <Result folderFiles={folderFiles} pdfData={pdfData} />
      </div>
    </div>
  );
};

export default App;
