// components/FolderViewer.tsx
import { useState } from "react";

const FolderViewer = () => {
  const [folderFiles, setFolderFiles] = useState<string[] | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFile = (entry: FileSystemFileEntry): Promise<File> => {
    return new Promise((resolve, reject) => {
      entry.file(resolve, reject);
    });
  };

  const readEntries = async (
    dirEntry: FileSystemDirectoryEntry,
    collected: string[],
    pathPrefix = ""
  ) => {
    const reader = dirEntry.createReader();
    const entries: FileSystemEntry[] = await new Promise((resolve, reject) =>
      reader.readEntries(resolve, reject)
    );

    for (const entry of entries) {
      if (entry.isFile) {
        const file = await getFile(entry as FileSystemFileEntry);
        collected.push(pathPrefix + file.name);
      } else if (entry.isDirectory) {
        // pass subfolder name as prefix (but no root folder)
        await readEntries(
          entry as FileSystemDirectoryEntry,
          collected,
          pathPrefix + entry.name + "/"
        );
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    try {
      const items = e.dataTransfer.items;
      if (!items) {
        setError("No items dropped");
        return;
      }

      const files: string[] = [];

      for (let i = 0; i < items.length; i++) {
        const entry = items[i].webkitGetAsEntry?.();
        if (entry) {
          if (entry.isFile) {
            const file = await getFile(entry as FileSystemFileEntry);
            files.push(file.name); // only filename
          } else if (entry.isDirectory) {
            // 🚀 FIX: start recursion without root folder name
            await readEntries(entry as FileSystemDirectoryEntry, files, "");
          }
        }
      }

      setFolderFiles(files);
    } catch (err) {
      console.error(err);
      setError("Failed to read dropped folder");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleReset = () => {
    setFolderFiles(null);
    setError(null);
  };

  return (
    <div className="p-4 border rounded bg-gray-50">
      {!folderFiles ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`h-40 flex items-center justify-center border-2 border-dashed rounded cursor-pointer ${
            dragActive ? "border-green-500 bg-green-50" : "border-gray-300"
          }`}
        >
          <p className="text-gray-600">Drag & Drop a folder here</p>
        </div>
      ) : (
        <div className="relative max-h-[40vh] overflow-y-auto">
          <button
            onClick={handleReset}
            className="absolute top-2 right-2 px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            Reset
          </button>

          <h3 className="font-semibold mb-2">Files in Folder:</h3>
          <ul className="list-disc list-inside text-sm">
            {folderFiles.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="mt-3 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}
    </div>
  );
};

export default FolderViewer;
