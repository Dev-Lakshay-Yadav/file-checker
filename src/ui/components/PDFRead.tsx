import React from "react";

interface PDFReadProps {
  pdfText: string;
  fileName: string;
}

const PDFRead: React.FC<PDFReadProps> = ({ pdfText, fileName }) => {
  return (
    <div className="mt-6 p-4 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
      <h3 className="text-lg font-semibold text-gray-800">
        File:{" "}
        <span className="font-normal">{fileName || "No file selected"}</span>
      </h3>
      <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200 overflow-auto max-h-96">
        <pre className="whitespace-pre-wrap text-gray-700 text-sm">
          {pdfText || "No PDF content yet."}
        </pre>
      </div>
    </div>
  );
};

export default PDFRead;
