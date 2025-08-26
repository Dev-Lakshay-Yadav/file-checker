import pdf from "pdf-parse";

let lastExtractedText: string | null = null;

export async function extractPdfText(fileData: Uint8Array) {
  try {
    const buffer = Buffer.from(fileData);
    const data = await pdf(buffer);
    lastExtractedText = data.text;
    return { text: data.text };
  } catch (err: any) {
    return { error: err.message };
  }
}

function extractFilePrefix(text: string): string | null {
  // Allow MERYL and KING across line breaks
  const regex =
    /Case Details for\s+TS-([A-Z0-9]+ -- [\s\S]+?)(?:\nCase Priority|$)/i;
  const match = text.match(regex);
  if (match && match[1]) {
    return match[1].replace(/\s+/g, " ").trim();
  }
  return null;
}

function extractServiceType(
  text: string
): "Crown And Bridge" | "Implant" | "Smile Design" | null {
  // Only consider text before "Tooth Numbers:"
  const cutoffIndex = text.indexOf("Tooth Numbers:");
  const searchText =
    cutoffIndex !== -1 ? text.substring(0, cutoffIndex) : text;

  const services = ["Crown And Bridge", "Implant", "Smile Design"];

  for (const service of services) {
    const regex = new RegExp(`\\b${service}\\b`, "i"); // case-insensitive
    if (regex.test(searchText)) {
      if (service.toLowerCase() === "crown and bridge") return "Crown And Bridge";
      if (service.toLowerCase() === "implant") return "Implant";
      if (service.toLowerCase() === "smile design") return "Smile Design";
    }
  }

  return null;
}


function extractToothNumbers(text: string): number[] {
  const regex = /Tooth Numbers:\s*([0-9,\s]+)/i;
  const match = text.match(regex);

  if (match && match[1]) {
    return match[1]
      .split(",") // split by commas
      .map((num) => parseInt(num.trim(), 10)) // convert to integers
      .filter((num) => !isNaN(num)); // remove any invalid numbers
  }

  return [];
}

export function extractAdditionalNotes(text: string): string | null {
  const match = text.match(
    /Additional Notes:\s*([\s\S]*?)(?:\n[A-Z][^\n]*:|\n?$)/i
  );
  return match ? match[1].trim() : null;
}

export function getLastExtractedText() {
  return lastExtractedText;
}

// For now return hardcoded JSON
export async function processPdfText(_text: string) {
  const prefixData: string | null = lastExtractedText
    ? extractFilePrefix(lastExtractedText)
    : null;

  const serviceData: string | null = lastExtractedText
    ? extractServiceType(lastExtractedText)
    : null;

  const additionalData: string | null = lastExtractedText
    ? extractAdditionalNotes(lastExtractedText)
    : null;

  const toothNumbers: number[] | null = lastExtractedText
    ? extractToothNumbers(lastExtractedText)
    : null;

  return {
    file_Prefix: prefixData,
    service_Type: serviceData as
      | "Crown And Bridge"
      | "Implant"
      | "Smile Design"
      | null,
    tooth_Numbers: toothNumbers,
    additional_Notes: additionalData,
  };
}
