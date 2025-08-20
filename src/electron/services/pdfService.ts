import pdfParse from "pdf-parse";

interface PDFResult {
  file_Prefix: string | null;
  service_Type: "Crown And Bridge" | "Implant" | "Smile Design" | null;
  tooth_Numbers: number[];
  additional_Notes: string | null;
}
/**
 * Read PDF and return full text from Buffer
 */
export async function readPDF(fileBuffer: Buffer): Promise<string> {
  try {
    const pdfData = await pdfParse(fileBuffer);
    return pdfData.text;
  } catch (error) {
    console.error("Error reading PDF:", error);
    throw new Error(`Failed to read PDF: ${(error as Error).message}`);
  }
}

/**
 * Extract file prefix (between TS- and Case Priority)
 */
function extractFilePrefix(text: string): string | null {
  const regex = /TS-([\s\S]*?)Case Priority/i; // [\s\S] matches any char including newlines
  const match = text.match(regex);
  if (!match) return null;

  // Replace all line breaks and multiple spaces with a single space
  return match[1].replace(/\s+/g, " ").trim();
}
/**
 * Extract service type (3 possible types)
 */
function extractServiceType(text: string): PDFResult["service_Type"] {
  if (/Crown And Bridge/i.test(text)) return "Crown And Bridge";
  if (/Implant/i.test(text)) return "Implant";
  if (/Smile Design/i.test(text)) return "Smile Design";
  return null;
}

/**
 * Extract tooth numbers (comma or space separated digits)
 */
function extractToothNumbers(text: string): number[] {
  const regex = /Tooth Numbers:([\d,\s]+)/i;
  const match = text.match(regex);
  if (!match) return [];
  return match[1]
    .split(/[\s,]+/)
    .map((num) => parseInt(num, 10))
    .filter((n) => !isNaN(n));
}

/**
 * Extract additional notes
 */
function extractAdditionalNotes(text: string): string | null {
  const regex = /Additional Notes:\s*([\s\S]*?)(?=Splinted Crowns:|$)/i;
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * Master extractor
 */
export async function extractPDFData(fileBuffer: Buffer): Promise<PDFResult> {
  const text = await readPDF(fileBuffer);

  return {
    file_Prefix: extractFilePrefix(text),
    service_Type: extractServiceType(text),
    tooth_Numbers: extractToothNumbers(text),
    additional_Notes: extractAdditionalNotes(text),
  };
}
