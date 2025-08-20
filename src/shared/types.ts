// shared/types.ts
export interface FolderResult {
  success: boolean;
  folder?: string;
  files?: string[];
  error?: string;
}