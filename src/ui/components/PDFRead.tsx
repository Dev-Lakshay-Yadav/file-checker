import React from "react";

interface PDFResult {
  file_Prefix: string;
  service_Type: string;
  tooth_Numbers: number[];
  additional_Notes: string;
}

interface PDFReadProps {
  pdfData: PDFResult | null;
  fileName: string;
  error: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

const PDFRead: React.FC<PDFReadProps> = ({
  pdfData,
  fileName,
  error,
  onUpload,
  onReset,
}) => {
  return (
    <div className="p-2 bg-white shadow-lg rounded-2xl max-w-3xl mx-auto">
      <div className="flex items-center justify-between ">
        <div className="w-full">
          <h3 className="text-sm font-semibold text-gray-800">PDF Extractor</h3>
        </div>

        <div className="flex w-full gap-4 justify-end">
          {/* Upload Button */}
          <label className="cursor-pointer h-full w-28 text-center py-1 text-sm bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
            Upload PDF
            <input
              type="file"
              accept="application/pdf"
              onChange={onUpload}
              className="hidden"
            />
          </label>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="h-full w-16 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* File Info */}
      <h4 className="text-sm text-gray-700">
        File:{" "}
        <span className="font-medium text-gray-900">
          {fileName || "No file selected"}
        </span>
      </h4>

      {/* Output Box */}
      <div className="bg-gray-50 p-2 text-xs rounded-md border border-gray-200 overflow-auto max-h-80">
        {error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : pdfData ? (
          <div className="space-y-2">
            <div className="flex">
              <div className="w-full">
                <span className="font-semibold text-gray-700">
                  Service Type:
                </span>{" "}
                <span className="text-gray-900">{pdfData.service_Type}</span>
              </div>

              <div className="w-full">
                <span className="font-semibold text-gray-700">
                  Tooth Numbers:
                </span>{" "}
                <span className="text-gray-900">
                  {pdfData.tooth_Numbers.join(", ")}
                </span>
              </div>
            </div>

            <div>
              <div className="font-semibold flex text-gray-700">
                <p className="w-36">Additional Notes:</p>
                <p>{pdfData.additional_Notes}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No PDF content yet.</p>
        )}
      </div>
    </div>
  );
};

export default PDFRead;
