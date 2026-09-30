import Button from "react-bootstrap/Button";
import { Spinner } from "react-bootstrap";

import { useXrdWavelengths } from "./index.jsx";

const WAVELENGTHS = ["CuKa", "MoKa", "CrKa", "FeKa", "CoKa", "AgKa"];

export default function BundleAndDownload({ method, id }) {
  const results = useXrdWavelengths({ method, id });

  const pending = results.some((r) => r.isPending);

  const handleDownload = () => {
    const full = {};

    results.forEach((r, i) => {
      if (r.data) full[WAVELENGTHS[i]] = r.data;
    });

    // download bundled dataset
    const blob = new Blob([JSON.stringify(full, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "xrdData.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Button
      size="sm"
      style={{ margin: "4px", padding: "2px 7px" }}
      onClick={handleDownload}
      disabled={pending}
      title="Download full dataset"
    >
      {pending ? (
        <>
          <Spinner animation="border" size="sm" />
          <span className="visually-hidden">Loading...</span>
        </>
      ) : (
        <span className="bi bi-download" />
      )}{" "}
    </Button>
  );
}
