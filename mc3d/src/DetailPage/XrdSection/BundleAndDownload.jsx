import { useState } from "react";
import Button from "react-bootstrap/Button";
import { Spinner } from "react-bootstrap";

import { useQueryClient } from "@tanstack/react-query";

import { loadXrdWavelength } from "../../common/fetchingUtils.js";

const WAVELENGTHS = ["CuKa", "MoKa", "CrKa", "FeKa", "CoKa", "AgKa"];

export default function BundleAndDownload({ method, id }) {
  const queryClient = useQueryClient();
  const [pending, setPending] = useState(false);

  // Fetch the remaining wavelengths on demand; the currently selected one
  // is served from the react-query cache shared with the plot.
  const handleDownload = async () => {
    setPending(true);
    try {
      const entries = await Promise.all(
        WAVELENGTHS.map((wavelength) =>
          queryClient.fetchQuery({
            queryKey: ["xrd", method, id, wavelength],
            queryFn: () => loadXrdWavelength({ method, id, wavelength }),
          }),
        ),
      );

      const full = Object.fromEntries(
        WAVELENGTHS.map((wavelength, i) => [wavelength, entries[i]]),
      );

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
    } finally {
      setPending(false);
    }
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
