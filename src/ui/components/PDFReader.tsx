import { useState } from "react";

interface PDFResult {
  case_Id: string;
  patient_Name: string;
  tooth_Numbers: string[];
  additional_Notes: string;
}

const PDFReader = () => {
  const [extractedData, setExtractedData] = useState<PDFResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Dummy data simulation after dropping a file
  const simulatePDFParsing = (fileName: string) => {
    const dummyData: PDFResult = {
      case_Id: "CASE-12345",
      patient_Name: "John Doe",
      tooth_Numbers: ["11", "12", "21", "22"],
      additional_Notes: `Extracted from ${fileName}`,
    };
    setExtractedData(dummyData);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      simulatePDFParsing(file.name);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  return (
    <div className="p-4">
      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`w-full h-40 flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition ${
          dragOver ? "bg-blue-100 border-blue-500" : "bg-gray-50 border-gray-300"
        }`}
      >
        <p className="text-gray-600">
          {dragOver ? "Drop PDF here..." : "Drag & Drop a PDF file here"}
        </p>
      </div>

      {/* Render Extracted Data */}
      {extractedData && (
        <div className="mt-6 p-4 border rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Extracted Data:</h3>
          <p>
            <strong>Case ID:</strong> {extractedData.case_Id}
          </p>
          <p>
            <strong>Patient Name:</strong> {extractedData.patient_Name}
          </p>
          <p>
            <strong>Tooth Numbers:</strong> {extractedData.tooth_Numbers.join(", ")}
          </p>
          <p>
            <strong>Additional Notes:</strong> {extractedData.additional_Notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default PDFReader;
