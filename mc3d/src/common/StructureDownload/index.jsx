import { useEffect, useRef, useState } from "react";
import { toCIF, toPOSCAR, toXSF, toXYZ, toJSON } from "matsci-parse";

import "./index.css";

export function DownloadIcon({ size = 14, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 15V3" />
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

const defaultFormats = [
  //   { format: "jsonOM", label: "JSON" },
  { format: "cif", label: "CIF" },
  { format: "xyz", label: "XYZ" },
  { format: "xsf", label: "XSF" },
  { format: "poscar", label: "VASP" },
];

function downloadFile(content, filename) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

// TODO: maybe move this to the matsci-parse lib to allow overriding the header
function addMetadataToHeader(content, format, mc3dId, method, cellType) {
  const metadata = `mc3d-id=${mc3dId} method=${method} cell="${cellType}"`;

  switch (format) {
    case "xyz": {
      const lines = content.split("\n");

      if (lines.length >= 2) {
        lines[1] = `${lines[1]} ${metadata}`;
      }

      return lines.join("\n");
    }

    case "cif": {
      const lines = content.split("\n");

      const lastHeaderIndex = lines.findIndex(
        (line) => line.trim() && !line.trim().startsWith("_"),
      );

      if (lastHeaderIndex === -1) {
        return `${metadata}\n${content}`;
      }

      lines.splice(lastHeaderIndex, 0, `# ${metadata}`);
      return lines.join("\n");
    }

    case "xsf": {
      const lines = content.split("\n");
      return [`# ${metadata}`, ...lines].join("\n");
    }

    case "poscar": {
      const lines = content.split("\n");

      if (lines.length > 0) {
        lines[0] = `${lines[0]} ${metadata}`;
      }

      return lines.join("\n");
    }

    default:
      return content;
  }
}

export function StructureDownload({
  structure,
  OptimadeStructure,
  download_formats,
  namePrefix = "structure",
  id,
  method,
  cellType,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const downloadFormats = download_formats || defaultFormats;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDownload = (format) => {
    let content = "";
    let filename = namePrefix;

    switch (format) {
      case "cif":
        content = toCIF(structure);
        filename += ".cif";
        break;
      case "xyz":
        content = toXYZ(structure);
        filename += ".xyz";
        break;
      case "poscar":
        content = toPOSCAR(structure);
        filename += ".vasp";
        break;
      case "xsf":
        content = toXSF(structure);
        filename += ".xsf";
        break;
      case "jsonOM":
        content = JSON.stringify(OptimadeStructure, null, 2);
        filename += "_OPTIMADE.json";
        break;
      case "jsonMSP":
        content = JSON.stringify(toJSON(structure), null, 2);
        filename += "_matsciparse.json";
        break;
      default:
        return;
    }

    content = addMetadataToHeader(content, format, id, method, cellType);

    downloadFile(content, filename);
    setOpen(false);
  };

  return (
    <div ref={ref} className="structure-download">
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn btn-primary btn-sm structure-download__button"
        title="Download"
      >
        <DownloadIcon size={16} />
      </button>

      {open && (
        <div className="structure-download__menu">
          {downloadFormats.map(({ format, label }) => (
            <button
              key={format}
              onClick={() => handleDownload(format)}
              className="structure-download__item"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
