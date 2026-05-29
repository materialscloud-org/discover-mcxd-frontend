import { useState } from "react";
import Button from "react-bootstrap/Button";
import { Spinner } from "react-bootstrap";

const WAVELENGTHS = ["CuKa", "MoKa", "CrKa", "FeKa", "CoKa", "AgKa"];

const S3_BASE_URL = "https://rgw.cscs.ch/matcloud:mc-discover-mcxd-public/mc3d";

export default function BundleAndDownload({ cache, setCache, method, id }) {
  const [loading, setLoading] = useState(false);

  const fetchWavelength = async (wl) => {
    const url = `${S3_BASE_URL}/${method}_xrd/prod/${id}/${wl}.json.br`;

    const res = await fetch(url);
    return res.json();
  };

  const handleDownload = async () => {
    setLoading(true);

    try {
      const missing = WAVELENGTHS.filter((wl) => !cache[wl]);

      const results = await Promise.all(
        missing.map(async (wl) => {
          const data = await fetchWavelength(wl);
          return [wl, data];
        }),
      );

      const full = { ...cache };

      for (const [wl, data] of results) {
        full[wl] = data;
      }

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

      // update cache so UI stays in sync
      setCache(full);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      style={{ margin: "4px", padding: "2px 7px" }}
      onClick={handleDownload}
      disabled={loading}
      title="Download full dataset"
    >
      {loading ? (
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
