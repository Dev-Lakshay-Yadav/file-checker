// components/FolderViewer.tsx
import { useState } from "react";

const FolderViewer = () => {
  const [folderFiles, setFolderFiles] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenFolder = async () => {
    setLoading(true);
    setError(null);
    setFolderFiles(null);

    try {
      const result = await window.api.openFolder();

      if (result.success) {
        setFolderFiles(result.files ?? []);
      } else {
        setError(result.error ?? "Failed to read folder");
      }
    } catch (err) {
      setError("An unexpected error occurred while reading folder");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFolderFiles(null);
    setError(null);
  };

  if (!folderFiles) {
    return (
      <div className="p-4 border rounded bg-gray-50">
        <button
          onClick={handleOpenFolder}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Loading..." : "Open Folder"}
        </button>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded border border-red-200 mt-3">
            <div className="flex items-center justify-between">
              <span>Error: {error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-4 px-3 py-1 bg-red-200 hover:bg-red-300 rounded text-sm"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 border rounded bg-gray-50 max-h-[40vh] overflow-y-auto relative">
      <button
        onClick={handleReset}
        className="absolute top-2 right-2 px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
      >
        Reset
      </button>

      <h3 className="font-semibold mb-2">Files in Folder:</h3>
      <ul className="list-disc list-inside">
        {folderFiles.map((file, index) => (
          <li key={index}>{file}</li>
        ))}
      </ul>
    </div>
  );
};

export default FolderViewer;
