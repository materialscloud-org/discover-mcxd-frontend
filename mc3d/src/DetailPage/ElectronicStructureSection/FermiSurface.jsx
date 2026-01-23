import { useEffect, useRef, useState } from "react";
import { FermiVisualiser } from "fermisurface-visualiser";
import { Form, Button } from "react-bootstrap";

export default function FermiVisualiserReact({ data, bandColorMap }) {
  const containerRef = useRef(null);
  const visRef = useRef(null);

  const baseEf = data?.fermiEnergy ?? 0;
  const [fermiLevel, setFermiLevel] = useState(baseEf);

  useEffect(() => {
    setFermiLevel(baseEf);
  }, [baseEf]);

  useEffect(() => {
    if (!containerRef.current || !data) return;

    visRef.current = new FermiVisualiser(containerRef.current, data, {
      colorPalette: Object.values(bandColorMap),
    });
    visRef.current.update(baseEf);

    return () => {
      visRef.current?.dispose?.();
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      visRef.current = null;
    };
  }, [data, baseEf, bandColorMap]);

  useEffect(() => {
    if (!visRef.current) return;
    visRef.current.update(fermiLevel);
  }, [fermiLevel]);

  return (
    <>
      <div className="subsection-title">Fermi surface</div>

      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          border: "1px solid #888",
          borderRadius: "4px",
        }}
      >
        <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            padding: "2px",
            zIndex: 10,
            width: "220px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "6px",
              fontSize: "0.85em",
            }}
          >
            <span>
              Fermi level shift: <b>{(fermiLevel - baseEf).toFixed(2)} eV</b>
            </span>
            <Button size="sm" onClick={() => setFermiLevel(baseEf)}>
              reset
            </Button>
          </div>

          <Form.Range
            min={baseEf - 2}
            max={baseEf + 2}
            step={0.05}
            value={fermiLevel}
            onChange={(e) => setFermiLevel(+e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
