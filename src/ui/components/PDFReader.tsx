import React from "react";

declare global {
  interface Window {
    electronAPI: {
      parsePDF: (
        fileBuffer: ArrayBuffer
      ) => Promise<{ success: boolean; data?: any; error?: string }>;
    };
  }
}

interface PDFReaderProps {
  pdfData: any;
  setPdfData: (data: any) => void;
  pdfFile: File | null;
  setPdfFile: (file: File | null) => void;
  error: string | null;
  setError: (err: string | null) => void;
  onReset: () => void;
}

const PDFReader: React.FC<PDFReaderProps> = ({
  pdfData,
  setPdfData,
  pdfFile,
  setPdfFile,
  error,
  setError,
  onReset,
}) => {
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError(null);
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

    setPdfFile(file);

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

  return (
    <div className="w-full h-full flex flex-col items-center relative p-4">
      <button
        onClick={onReset}
        className="absolute top-4 right-4 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
      >
        Reset
      </button>

      <h3 className="text-xl font-semibold mb-6">PDF Reader</h3>

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
          {pdfFile && (
            <p className="text-sm mt-2">
              File: <strong>{pdfFile.name}</strong>
            </p>
          )}
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </>
      )}

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
