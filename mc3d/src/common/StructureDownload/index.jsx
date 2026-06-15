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

export function StructureDownload({
  structure,
  OptimadeStructure,
  download_formats,
  namePrefix = "structure",
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
