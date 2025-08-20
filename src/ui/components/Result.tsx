import React from "react";

interface ResultProps {
  folderFiles: string[] | null;
  pdfData: any;
}

const Result: React.FC<ResultProps> = ({ folderFiles, pdfData }) => {
  // First, check if we have valid PDF data
  if (!pdfData || Object.keys(pdfData).length === 0) {
    return (
      <div>
        <p>No PDF found</p>
      </div>
    );
  }

  // Check if critical fields have "N/A" values
  const hasInvalidData =
    pdfData.file_Prefix === "N/A" ||
    pdfData.service_Type === "N/A" ||
    (pdfData.tooth_Numbers &&
      (Array.isArray(pdfData.tooth_Numbers)
        ? pdfData.tooth_Numbers.includes("N/A")
        : pdfData.tooth_Numbers === "N/A"));

  if (hasInvalidData) {
    return (
      <div>
        <h2>PDF Data</h2>
        <p>PDF is invalid: Critical fields contain "N/A" values.</p>
        <p>
          Invalid fields:{" "}
          {[
            pdfData.file_Prefix === "N/A" ? "file_Prefix" : null,
            pdfData.service_Type === "N/A" ? "service_Type" : null,
            pdfData.tooth_Numbers &&
            (Array.isArray(pdfData.tooth_Numbers)
              ? pdfData.tooth_Numbers.includes("N/A")
              : pdfData.tooth_Numbers === "N/A")
              ? "tooth_Numbers"
              : null,
          ]
            .filter(Boolean)
            .join(", ")}
        </p>
      </div>
    );
  }

  // Main category dispatcher
  function renderCategory() {
    if (!pdfData?.service_Type)
      return <div>No service type specified in PDF</div>;

    const serviceType = pdfData.service_Type.toLowerCase(); // convert to lowercase

    switch (serviceType) {
      case "crown bridge":
        return crownBridgeCheck();
      case "implant":
        return implantCheck();
      case "smile design":
        return smileDesignCheck();
      default:
        return <div>Unknown service type: {pdfData.service_Type}</div>;
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
          <h3>Crown Bridge Analysis</h3>
          <p>Problems found:</p>
          <ul>
            {problems.map((problem, i) => (
              <li key={i}>{problem}</li>
            ))}
          </ul>
        </div>
      );
    }

    const prefix = pdfData.file_Prefix ? pdfData.file_Prefix.toLowerCase() : "";

    // Check if we have a valid prefix
    if (!prefix) {
      problems.push("File prefix missing in PDF data");
      return (
        <div>
          <h3>Crown Bridge Analysis</h3>
          <p>Problems found:</p>
          <ul>
            {problems.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      );
    }

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
      return (
        <div>
          <h3>Crown Bridge Analysis</h3>
          <p>All good, let's go to new case!</p>
        </div>
      );
    } else {
      return (
        <div>
          <h3>Crown Bridge Analysis</h3>
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
          <h3>Implant Analysis</h3>
          <p>Problems found:</p>
          <ul>
            {problems.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      );
    }

    const prefix = pdfData.file_Prefix ? pdfData.file_Prefix.toLowerCase() : "";

    // Check if we have a valid prefix
    if (!prefix) {
      problems.push("File prefix missing in PDF data");
      return (
        <div>
          <h3>Implant Analysis</h3>
          <p>Problems found:</p>
          <ul>
            {problems.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      );
    }

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
      return (
        <div>
          <h3>Implant Analysis</h3>
          <p>All good, let's go to new case!</p>
        </div>
      );
    } else {
      return (
        <div>
          <h3>Implant Analysis</h3>
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
          <h3>Smile Design Analysis</h3>
          <p>Problems found:</p>
          <ul>
            {problems.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      );
    }

    const prefix = pdfData.file_Prefix ? pdfData.file_Prefix.toLowerCase() : "";

    // Check if we have a valid prefix
    if (!prefix) {
      problems.push("File prefix missing in PDF data");
      return (
        <div>
          <h3>Smile Design Analysis</h3>
          <p>Problems found:</p>
          <ul>
            {problems.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      );
    }

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
      return (
        <div>
          <h3>Smile Design Analysis</h3>
          <p>All good, let's go to new case!</p>
        </div>
      );
    } else {
      return (
        <div>
          <h3>Smile Design Analysis</h3>
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
      {folderFiles && folderFiles.length > 0 ? (
        <p>Folder Successfully uploaded</p>
      ) : (
        <p>No files found.</p>
      )}

      <h2>PDF Data Analysis</h2>
      {renderCategory()}
    </div>
  );
};

export default Result;
