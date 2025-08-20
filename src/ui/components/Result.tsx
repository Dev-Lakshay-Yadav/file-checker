import React from "react";

interface ResultProps {
  folderFiles: string[] | null;
  pdfData: any;
}

const Result: React.FC<ResultProps> = ({ folderFiles, pdfData }) => {
  // Main category dispatcher
  function renderCategory() {
    if (!pdfData?.service_Type) return <div>No data</div>;

    const serviceType = pdfData.service_Type.toLowerCase(); // convert to lowercase

    switch (serviceType) {
      case "crown bridge":
        return crownBridgeCheck();
      case "implant":
        return implantCheck();
      case "smile design":
        return smileDesignCheck();
      default:
        return <div>No data</div>;
    }
  }

  // Example for Crown Bridge
  function crownBridgeCheck() {
    const problems: string[] = [];

    if (!pdfData.tooth_Numbers || pdfData.tooth_Numbers.length === 0) {
      problems.push("No tooth numbers selected");
    }

    if (!pdfData.material) {
      problems.push("Material not specified");
    }

    if (!folderFiles || folderFiles.length === 0) {
      problems.push("No folder files found");
      return (
        <div>
          <p>Problems found:</p>
          <ul>
            {problems.map((problem, i) => (
              <li key={i}>{problem}</li>
            ))}
          </ul>
        </div>
      );
    }

    const prefix = pdfData.file_Prefix.toLowerCase();

    // Helper to check if a file exists matching name & extensions (case-insensitive)
    const hasFile = (names: string[], exts: string[]) =>
      folderFiles.some((file) => {
        const f = file.toLowerCase();
        return names.some((name) =>
          exts.some(
            (ext) =>
              f.includes(name.toLowerCase()) && f.endsWith(ext.toLowerCase())
          )
        );
      });

    // Required HTML & ZIP
    if (!hasFile([prefix], [".html"])) problems.push(".html file missing");
    if (!hasFile([prefix], [".zip"])) problems.push(".zip file missing");

    // Required named images
    const requiredImgs = [
      "occlusal contact",
      "proximal contact",
      "cement gap",
      "pre-op",
    ];
    requiredImgs.forEach((img) => {
      if (!hasFile([`${prefix} ${img}`], [".jpg", ".jpeg", ".png"])) {
        problems.push(`Missing image: ${img}`);
      }
    });

    // At least 3 additional pics (pic1, pic2, pic3, ...)
    const picFiles = folderFiles.filter(
      (f) =>
        f.toLowerCase().startsWith(prefix + " pic") &&
        [".jpg", ".jpeg", ".png"].some((ext) => f.toLowerCase().endsWith(ext))
    );
    if (picFiles.length < 3)
      problems.push("At least 3 additional pics required");

    // .stl files for each tooth
    const stlFiles = folderFiles.filter((f) =>
      f.toLowerCase().endsWith(".stl")
    );
    const expectedStlCount = pdfData.tooth_Numbers?.length || 0;
    if (stlFiles.length < expectedStlCount)
      problems.push(
        `Missing .stl files: expected ${expectedStlCount}, found ${stlFiles.length}`
      );

    if (problems.length === 0) {
      return <p>All good, let's go to new case!</p>;
    } else {
      return (
        <div>
          <p>Problems found:</p>
          <ul>
            {problems.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      );
    }
  }

  // You can use the same pattern for other categories
  function implantCheck() {
    const problems: string[] = [];

    if (!pdfData.implantSize) {
      problems.push("Implant size missing");
    }

    if (!folderFiles || folderFiles.length === 0) {
      problems.push("No folder files found");
      return (
        <div>
          <p>Problems found:</p>
          <ul>
            {problems.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      );
    }

    const prefix = pdfData.file_Prefix.toLowerCase();

    // Helper to check if a file exists matching name & extensions (case-insensitive)
    const hasFile = (names: string[], exts: string[]) =>
      folderFiles.some((file) => {
        const f = file.toLowerCase();
        return names.some((name) =>
          exts.some(
            (ext) =>
              f.includes(name.toLowerCase()) && f.endsWith(ext.toLowerCase())
          )
        );
      });

    // Required HTML & ZIP
    if (!hasFile([prefix], [".html"])) problems.push(".html file missing");
    if (!hasFile([prefix], [".zip"])) problems.push(".zip file missing");

    // Required named images
    const requiredImgs = [
      "implant selection",
      "hole angulation",
      "hole diameter",
      "tie base height",
    ];
    requiredImgs.forEach((img) => {
      if (!hasFile([`${prefix} ${img}`], [".jpg", ".jpeg", ".png"])) {
        problems.push(`Missing image: ${img}`);
      }
    });

    // At least 4 additional pics (pic1, pic2, pic3, pic4, ...)
    const picFiles = folderFiles.filter(
      (f) =>
        f.toLowerCase().startsWith(prefix + " pic") &&
        [".jpg", ".jpeg", ".png"].some((ext) => f.toLowerCase().endsWith(ext))
    );
    if (picFiles.length < 4)
      problems.push("At least 4 additional pics required");

    // .stl files for each tooth
    const stlFiles = folderFiles.filter((f) =>
      f.toLowerCase().endsWith(".stl")
    );
    const expectedStlCount = pdfData.tooth_Numbers?.length || 0;
    if (stlFiles.length < expectedStlCount)
      problems.push(
        `Missing .stl files: expected ${expectedStlCount}, found ${stlFiles.length}`
      );

    if (problems.length === 0) {
      return <p>All good, let's go to new case!</p>;
    } else {
      return (
        <div>
          <p>Problems found:</p>
          <ul>
            {problems.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      );
    }
  }

  function smileDesignCheck() {
    const problems: string[] = [];

    if (!pdfData.smileType) {
      problems.push("Smile type not selected");
    }

    if (!folderFiles || folderFiles.length === 0) {
      problems.push("No folder files found");
      return (
        <div>
          <p>Problems found:</p>
          <ul>
            {problems.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      );
    }

    const prefix = pdfData.file_Prefix.toLowerCase();

    // Helper to check if a file exists matching name & extensions (case-insensitive)
    const hasFile = (names: string[], exts: string[]) =>
      folderFiles.some((file) => {
        const f = file.toLowerCase();
        return names.some((name) =>
          exts.some(
            (ext) =>
              f.includes(name.toLowerCase()) && f.endsWith(ext.toLowerCase())
          )
        );
      });

    // Required HTML & ZIP
    if (!hasFile([prefix], [".html"])) problems.push(".html file missing");
    if (!hasFile([prefix], [".zip"])) problems.push(".zip file missing");

    // Required Visual Contact image
    if (!hasFile([`${prefix} visual contact`], [".jpg", ".jpeg", ".png"])) {
      problems.push("Missing image: Visual Contact");
    }

    // At least 6 additional pics (pic1, pic2, pic3, ...)
    const picFiles = folderFiles.filter(
      (f) =>
        f.toLowerCase().startsWith(prefix + " pic") &&
        [".jpg", ".jpeg", ".png"].some((ext) => f.toLowerCase().endsWith(ext))
    );
    if (picFiles.length < 6)
      problems.push("At least 6 additional pics required");

    // At least 2 .stl files
    const stlFiles = folderFiles.filter((f) =>
      f.toLowerCase().endsWith(".stl")
    );
    if (stlFiles.length < 2)
      problems.push(`At least 2 .stl files required, found ${stlFiles.length}`);

    if (problems.length === 0) {
      return <p>All good, let's go to new case!</p>;
    } else {
      return (
        <div>
          <p>Problems found:</p>
          <ul>
            {problems.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      );
    }
  }

  return (
    <div>
      <h2>Folder Files</h2>
      {folderFiles ? (
        <ul>
          {folderFiles.map((file, index) => (
            <li key={index}>{file}</li>
          ))}
        </ul>
      ) : (
        <p>No files found.</p>
      )}

      <h2>PDF Data</h2>
      {renderCategory()}
    </div>
  );
};

export default Result;
