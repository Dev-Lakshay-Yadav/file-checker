import { useState } from "react";
import FolderViewer from "./components/FolderViewer";
import PDFReader from "./components/PDFReader";
import Result from "./components/Result";

const App = () => {
  // Centralized state
  const [pdfData, setPdfData] = useState<any>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [folderFiles, setFolderFiles] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset handlers
  const resetPDF = () => {
    setPdfData(null);
    setPdfFile(null);
    setError(null);
  };
  const resetFolder = () => {
    setFolderFiles(null);
    setError(null);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <FolderViewer
        folderFiles={folderFiles}
        setFolderFiles={setFolderFiles}
        error={error}
        setError={setError}
        onReset={resetFolder}
      />
      <PDFReader
        pdfData={pdfData}
        setPdfData={setPdfData}
        pdfFile={pdfFile}
        setPdfFile={setPdfFile}
        error={error}
        setError={setError}
        onReset={resetPDF}
      />
      <Result folderFiles={folderFiles} pdfData={pdfData} />
    </div>
  );
};

export default App;
