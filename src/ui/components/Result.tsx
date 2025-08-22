import React from "react";

interface ResultProps {
  folderFiles: string[] | null;
  pdfData: any;
}

const Result: React.FC<ResultProps> = ({ folderFiles, pdfData }) => {
  // ========== Basic Guards ==========
  if (!pdfData || Object.keys(pdfData).length === 0) {
    return (
      <div>
        <p>No PDF found</p>
      </div>
    );
  }

  const hasInvalidData =
    pdfData.file_Prefix === "N/A" ||
    pdfData.service_Type === "N/A" ||
    (pdfData.tooth_Numbers &&
      (Array.isArray(pdfData.tooth_Numbers)
        ? pdfData.tooth_Numbers.includes("N/A")
        : pdfData.tooth_Numbers === "N/A"));

  if (hasInvalidData) {
    const invalidFields = [
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
      .join(", ");

    return (
      <div>
        <h2>PDF Data</h2>
        <p>PDF is invalid: Critical fields contain "N/A" values.</p>
        <p>Invalid fields: {invalidFields}</p>
      </div>
    );
  }

  // ========== Helpers ==========
  const hasFileContaining = (keyword: string, exts: string[]) =>
    folderFiles?.some((file) => {
      const f = file.toLowerCase();
      return (
        f.includes(keyword.toLowerCase()) &&
        exts.some((ext) => f.endsWith(ext.toLowerCase()))
      );
    }) ?? false;

  const countFilesContaining = (keyword: string, exts: string[]) =>
    folderFiles?.filter((file) => {
      const f = file.toLowerCase();
      return (
        f.includes(keyword.toLowerCase()) &&
        exts.some((ext) => f.endsWith(ext.toLowerCase()))
      );
    }).length ?? 0;

  const countFilesExt = (exts: string[]) =>
    folderFiles?.filter((f) =>
      exts.some((ext) => f.toLowerCase().endsWith(ext.toLowerCase()))
    ).length ?? 0;

  // ========== Rule Type ==========
  type CheckRule = {
    label: string;
    validate: () => boolean;
    message: string;
  };

  // ========== Centralized Config ==========
  const checkConfigs: Record<string, { title: string; rules: CheckRule[] }> = {
    "crown and bridge": {
      title: "Crown Bridge",
      rules: [
        {
          label: "tooth numbers",
          validate: () => !!pdfData.tooth_Numbers?.length,
          message: "No tooth numbers selected",
        },
        {
          label: "folder files",
          validate: () => !!folderFiles?.length,
          message: "No folder files found",
        },
        {
          label: "prefix",
          validate: () => !!pdfData.file_Prefix,
          message: "File prefix missing in PDF data",
        },
        {
          label: "html",
          validate: () => countFilesExt([".html"]) > 0,
          message: ".html file missing",
        },
        {
          label: "zip",
          validate: () => countFilesExt([".zip"]) > 0,
          message: ".zip file missing",
        },
        {
          label: "occlusal contact",
          validate: () =>
            hasFileContaining("occlusal contact", [".jpg", ".jpeg", ".png"]),
          message: "Missing image: occlusal contact",
        },
        {
          label: "proximal contact",
          validate: () =>
            hasFileContaining("proximal contact", [".jpg", ".jpeg", ".png"]),
          message: "Missing image: proximal contact",
        },
        {
          label: "cement gap",
          validate: () =>
            hasFileContaining("cement gap", [".jpg", ".jpeg", ".png"]),
          message: "Missing image: cement gap",
        },
        {
          label: "pics",
          validate: () =>
            countFilesContaining("pic", [".jpg", ".jpeg", ".png"]) >= 3,
          message: "At least 3 additional pics required",
        },
        {
          label: "stl per tooth",
          validate: () => {
            const expected = pdfData.tooth_Numbers?.length || 0;
            const found =
              folderFiles?.filter(
                (f) =>
                  f.toLowerCase().endsWith(".stl") &&
                  !f.toLowerCase().includes("preop") &&
                  !f.toLowerCase().includes("pre op")
              ).length ?? 0;
            return found >= expected;
          },
          message: `Missing .stl files for teeth`,
        },
        {
          label: "preop if 3+ teeth",
          validate: () => {
            if ((pdfData.tooth_Numbers?.length || 0) < 3) return true;
            const preOps =
              folderFiles?.filter((f) => {
                const n = f.toLowerCase();
                return (
                  (n.includes("preop") || n.includes("pre op")) &&
                  (n.endsWith(".stl") ||
                    [".jpg", ".jpeg", ".png"].some((ext) => n.endsWith(ext)))
                );
              }) ?? [];
            return (
              preOps.some((f) => f.endsWith(".stl")) &&
              preOps.some((f) =>
                [".jpg", ".jpeg", ".png"].some((ext) => f.endsWith(ext))
              )
            );
          },
          message:
            "Pre-op files missing: need at least one .stl and one image (.jpg/.jpeg/.png)",
        },
      ],
    },
    implant: {
      title: "Implant",
      rules: [
        {
          label: "folder files",
          validate: () => !!folderFiles?.length,
          message: "No folder files found",
        },
        {
          label: "prefix",
          validate: () => !!pdfData.file_Prefix,
          message: "File prefix missing in PDF data",
        },
        {
          label: "html",
          validate: () => countFilesExt([".html"]) > 0,
          message: ".html file missing",
        },
        {
          label: "zip",
          validate: () => countFilesExt([".zip"]) > 0,
          message: ".zip file missing",
        },
        {
          label: "implant imgs",
          validate: () =>
            [
              "implant selection",
              "hole angulation",
              "hole diameter",
              "tie base height",
            ].every((img) => hasFileContaining(img, [".jpg", ".jpeg", ".png"])),
          message: "Missing one or more implant images",
        },
        {
          label: "pics",
          validate: () =>
            countFilesContaining("pic", [".jpg", ".jpeg", ".png"]) >= 4,
          message: "At least 4 additional pics required",
        },
        {
          label: "stl",
          validate: () => {
            const expected = pdfData.tooth_Numbers?.length || 0;
            return countFilesExt([".stl"]) >= expected;
          },
          message: "Missing .stl files",
        },
      ],
    },
    "smile design": {
      title: "Smile Design",
      rules: [
        {
          label: "smileType",
          validate: () => !!pdfData.smileType,
          message: "Smile type not selected",
        },
        {
          label: "folder files",
          validate: () => !!folderFiles?.length,
          message: "No folder files found",
        },
        {
          label: "prefix",
          validate: () => !!pdfData.file_Prefix,
          message: "File prefix missing in PDF data",
        },
        {
          label: "html",
          validate: () => countFilesExt([".html"]) > 0,
          message: ".html file missing",
        },
        {
          label: "zip",
          validate: () => countFilesExt([".zip"]) > 0,
          message: ".zip file missing",
        },
        {
          label: "visual contact img",
          validate: () =>
            hasFileContaining("visual contact", [".jpg", ".jpeg", ".png"]),
          message: "Missing image: Visual Contact",
        },
        {
          label: "pics",
          validate: () =>
            countFilesContaining("pic", [".jpg", ".jpeg", ".png"]) >= 6,
          message: "At least 6 additional pics required",
        },
        {
          label: "stl",
          validate: () => countFilesExt([".stl"]) >= 2,
          message: "At least 2 .stl files required",
        },
      ],
    },
  };

  // ========== Runner ==========
  function runCheck(serviceType: string) {
    const config = checkConfigs[serviceType.toLowerCase()];
    if (!config) {
      return <div>Unknown service type: {pdfData.service_Type}</div>;
    }

    const problems = config.rules
      .filter((rule) => !rule.validate())
      .map((rule) => rule.message);

    return (
      <div>
        <h3>{config.title} Analysis</h3>
        {problems.length === 0 ? (
          <p className="text-green-500">All Files Present</p>
        ) : (
          <>
            <p>Problems found:</p>
            <ul>
              {problems.map((p, i) => (
                <li key={i} className="text-red-500">
                  {p}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  }

  // ========== Render ==========
  return <div className="text-sm">{runCheck(pdfData.service_Type)}</div>;
};

export default Result;
