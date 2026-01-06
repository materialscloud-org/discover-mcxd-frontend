import { useEffect, useMemo, useRef, useState } from "react";
import Plotly from "plotly.js-basic-dist-min";

/* ---------------- utils ---------------- */

function getMfPathEdgeLabels(path) {
  const parts = path.split("_");
  return parts.length === 2 ? parts : [path, path];
}

// builds unique X from the many-to-one array
function buildDiscreteX(phi = [], theta = []) {
  let step = -1;
  let lastKey = null;

  return phi.map((p, i) => {
    const key = `${p}|${theta?.[i] ?? ""}`;
    if (key !== lastKey) {
      step += 1;
      lastKey = key;
    }
    return step;
  });
}

function getMaxY(data) {
  let max = 0;
  for (const wc of data?.skeaf_workchains ?? []) {
    for (const band of wc.bands ?? []) {
      for (const v of band.xyData?.freq ?? []) {
        if (typeof v === "number" && v > max) max = v;
      }
    }
  }
  return max;
}

function buildBandTraces(wc, bandColorMap) {
  return wc.bands
    .filter((b) => b.xyData?.freq && (b.xyData?.phi || b.xyData?.theta))
    .map((b) => ({
      x: buildDiscreteX(b.xyData.phi, b.xyData.theta),
      y: b.xyData.freq,
      mode: "markers",
      name: `Band ${b.band_number}`,
      hoverinfo: "skip",
      marker: {
        color: bandColorMap[b.band_number],
        size: 4,
      },
    }));
}

/* ---------------- layout ---------------- */

const COMMON_LAYOUT_CONFIG = {
  yaxis: {
    zeroline: false,
    showgrid: false,
    showline: false,
    ticks: "inside",
    tickfont: { size: 14, color: "#333" },
    title: {
      text: "frequency [kT]",
      font: { size: 16, color: "#333" },
      standoff: 10,
    },
  },
  xaxis: {
    zeroline: false,
    showgrid: true,
    ticks: "inside",
    tickfont: { size: 14, color: "#333" },
    title: {
      text: "Rotation",
      font: { size: 16, color: "#333" },
      standoff: 10,
    },
  },
  legend: {
    orientation: "v",
    x: 0.985,
    y: 0.985,
    xanchor: "right",
    font: { size: 14, color: "#333" },
    bgcolor: "rgba(250,250,250,1)",
    bordercolor: "#ccc",
    borderwidth: 1,
  },
  margin: { l: 65, r: 10, t: 10, b: 50 },
  shapes: [
    {
      type: "rect",
      xref: "paper",
      yref: "paper",
      x0: 0,
      y0: 0,
      x1: 1,
      y1: 1,
      line: { color: "black", width: 1.25 },
      layer: "above",
    },
  ],
};

/* ---------------- component ---------------- */

export default function DhvaPlot({ datasets, bandColorMap }) {
  const containerRef = useRef(null);

  const [selectedFermiShift, setSelectedFermiShift] = useState(null);
  const [selectedMfPath, setSelectedMfPath] = useState(null);

  const currentData = useMemo(() => {
    if (!datasets?.length) return null;
    const match = datasets.find((d) => d.fermiShift === selectedFermiShift);
    return (match ?? datasets[0]).data;
  }, [datasets, selectedFermiShift]);

  const mfPaths = useMemo(
    () => currentData?.skeaf_workchains?.map((wc) => wc.mf_path) ?? [],
    [currentData],
  );

  const effectiveMfPath = mfPaths.includes(selectedMfPath)
    ? selectedMfPath
    : mfPaths[0];

  // Update plot
  useEffect(() => {
    if (!containerRef.current) return;
    return () => Plotly.purge(containerRef.current);
  }, []);

  useEffect(() => {
    if (!currentData || !effectiveMfPath || !containerRef.current) return;

    const wc = currentData.skeaf_workchains.find(
      (w) => w.mf_path === effectiveMfPath,
    );
    if (!wc) return;

    const traces = buildBandTraces(wc, bandColorMap);
    if (!traces.length) return;

    const maxY = getMaxY(currentData);
    const [firstLabel, lastLabel] = getMfPathEdgeLabels(effectiveMfPath);
    const lastIndex = Math.max(...traces.map((t) => t.x.at(-1)));

    Plotly.react(
      containerRef.current,
      traces,
      {
        ...COMMON_LAYOUT_CONFIG,
        xaxis: {
          ...COMMON_LAYOUT_CONFIG.xaxis,
          tickvals: [0, lastIndex],
          ticktext: [firstLabel, lastLabel],
          range: [-2, lastIndex + 2],
        },
        yaxis: {
          ...COMMON_LAYOUT_CONFIG.yaxis,
          range: [-2, maxY * 1.25],
        },
      },
      { responsive: true, displayModeBar: false },
    );
  }, [currentData, effectiveMfPath, bandColorMap]);

  // return nothing if no datasets loaded.
  if (!datasets?.length) return null;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Chart title */}
        <div className="subsection-title">De Haas-Van Alphen effect</div>

        {/* Dropdowns container */}
        <div style={{ display: "flex", gap: "25px" }}>
          {/* Fermi shift dropdown */}
          <div>
            <label htmlFor="fermiShiftSelect">Fermi energy shift:</label>{" "}
            <select
              id="fermiShiftSelect"
              value={selectedFermiShift ?? datasets[0].fermiShift}
              onChange={(e) => {
                setSelectedFermiShift(Number(e.target.value));
                setSelectedMfPath(null);
              }}
            >
              {datasets.map((d) => (
                <option key={d.fermiShift} value={d.fermiShift}>
                  {d.fermiShift} meV
                </option>
              ))}
            </select>
          </div>

          {/* MF path dropdown */}
          {mfPaths.length > 0 && (
            <div>
              <label htmlFor="mfPathSelect">MF path:</label>{" "}
              <select
                id="mfPathSelect"
                value={effectiveMfPath}
                onChange={(e) => setSelectedMfPath(e.target.value)}
              >
                {mfPaths.map((path) => {
                  const [firstLabel, lastLabel] = getMfPathEdgeLabels(path);
                  return (
                    <option key={path} value={path}>
                      {firstLabel} ⟶ {lastLabel}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Plot container */}
      <div style={{ width: "100%", height: "500px" }} ref={containerRef} />
    </>
  );
}
