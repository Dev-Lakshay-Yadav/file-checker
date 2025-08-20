import React, { useState } from "react";

declare global {
  interface Window {
    electronAPI: {
      parsePDF: (
        fileBuffer: ArrayBuffer
      ) => Promise<{ success: boolean; data?: any; error?: string }>;
    };
  }
}

const PDFReader: React.FC = () => {
  const [pdfData, setPdfData] = useState<any>(null);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState<File | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError("");
    setPdfData(null);

    const file = event.target.files?.[0];
    if (!file) {
      setError("No file selected.");
      return;
    }

    if (!file.name.endsWith(".pdf")) {
      setError("Only PDF files are allowed.");
      return;
    }

    setFileName(file);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await window.electronAPI.parsePDF(arrayBuffer);

      if (result.success && result.data) {
        setPdfData(result.data);
      } else {
        setError(result.error || "Failed to parse PDF");
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleReset = () => {
    setPdfData(null);
    setError("");
    setFileName(null);
  };

  return (
    <div className="w-full h-full flex flex-col items-center relative p-4">
      {/* Reset button in top-right */}
      <button
        onClick={handleReset}
        className="absolute top-4 right-4 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
      >
        Reset
      </button>

      <h3 className="text-xl font-semibold mb-6">PDF Reader</h3>

      {/* Select PDF button */}
      {!pdfData && (
        <>
          <input
            type="file"
            accept=".pdf"
            id="fileInput"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="fileInput"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition text-lg"
          >
            Select PDF
          </label>
          {fileName && (
            <p className="text-sm mt-2">
              File: <strong>{fileName.name}</strong>
            </p>
          )}
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </>
      )}

      {/* Display parsed PDF data */}
      {/* Display parsed PDF data */}
      {pdfData && (
        <div className="w-full max-w-lg mt-4 space-y-2">
          <div className="flex justify-between border-b pb-1">
            <span className="font-semibold">File Prefix:</span>
            <span>{pdfData.file_Prefix || "N/A"}</span>
          </div>
          <div className="flex justify-between border-b pb-1">
            <span className="font-semibold">Service Type:</span>
            <span>{pdfData.service_Type || "N/A"}</span>
          </div>
          <div className="flex justify-between border-b pb-1">
            <span className="font-semibold">Tooth Numbers:</span>
            <span>{pdfData.tooth_Numbers?.join(", ") || "N/A"}</span>
          </div>
          <div className="flex justify-between border-b pb-1">
            <span className="font-semibold">Additional Notes:</span>
            <span>{pdfData.additional_Notes || "N/A"}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFReader;
