// shared/types.ts
export interface FolderResult {
  success: boolean;
  folder?: string;
  files?: string[];
  error?: string;
}

export interface PDFResult {
  file_Prefix: string | null;
  service_Type: "Crown And Bridge" | "Implant" | "Smile Design" | null;
  tooth_Numbers: number[];
  additional_Notes: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
