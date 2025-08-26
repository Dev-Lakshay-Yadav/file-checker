import React from "react";

interface FolderViewerProps {
  folderFiles: string[] | null;
  setFolderFiles: (files: string[] | null) => void;
  folderName: string | null;
  setFolderName: (name: string | null) => void;
  error: string | null;
  setError: (err: string | null) => void;
  onReset: () => void;
}

const FolderViewer: React.FC<FolderViewerProps> = ({
  folderFiles,
  setFolderFiles,
  folderName,
  setFolderName,
  error,
  setError,
  onReset,
}) => {
  const getFile = (entry: FileSystemFileEntry): Promise<File> =>
    new Promise((resolve, reject) => entry.file(resolve, reject));

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
            files.push(file.name);
          } else if (entry.isDirectory) {
            setFolderName(entry.name); // 👈 capture folder name
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

  return (
    <div className="p-2 border rounded bg-gray-50">
      {!folderFiles ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className={`h-20 flex items-center justify-center border-2 border-dashed rounded cursor-pointer`}
        >
          <p className="text-gray-600">Drag & Drop a folder here</p>
          {error && <div className="mt-3 text-red-600">{error}</div>}
        </div>
      ) : (
        <div className="relative max-h-[20vh] overflow-y-auto">
          <button
            onClick={onReset}
            className="absolute top-2 right-2 px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            Reset
          </button>
          <h3 className="font-semibold mb-2">
            Folder: {folderName ?? "Unknown"}
          </h3>
          <ul className="list-disc list-inside text-sm">
            {folderFiles.map((file, idx) => (
              <li key={idx}>{file}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FolderViewer;
