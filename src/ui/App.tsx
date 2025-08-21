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
//       <Result folderFiles={folderFiles} pdfData={pdfData} />
//     </div>
//   );
// };

// export default App;

import React, { useState } from "react";
import PDFRead from "./components/PDFRead";
import FolderViewer from "./components/FolderViewer";

const App: React.FC = () => {
  const [pdfText, setPdfText] = useState("");
  const [fileName, setFileName] = useState("");
  const [folderFiles, setFolderFiles] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);

      // Convert File → ArrayBuffer → Uint8Array
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const result = await window.electronAPI.extractPdfText(uint8Array);
      if (result.error) {
        setPdfText("Error: " + result.error);
      } else {
        setPdfText(result.text || "");
      }
    }
  };

  const resetFolder = () => {
    setFolderFiles(null);
    setError(null);
  };

  return (
    <div>
      <div style={{ padding: "20px" }}>
        <h2>PDF Text Extractor</h2>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        <PDFRead pdfText={pdfText} fileName={fileName} />
      </div>

      <FolderViewer
        folderFiles={folderFiles}
        setFolderFiles={setFolderFiles}
        error={error}
        setError={setError}
        onReset={resetFolder}
      />
    </div>
  );
};

export default App;
