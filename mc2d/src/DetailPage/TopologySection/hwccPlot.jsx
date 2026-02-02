import { useEffect, useRef } from "react";
import Plotly from "plotly.js-basic-dist-min";
import { COMMON_LAYOUT_CONFIG } from "@mcxd/shared";

export function HWCCPlot({ hwcc }) {
  const plotRef = useRef(null);

  useEffect(() => {
    if (!hwcc || !plotRef.current) return;

    const { k, gaps, wcc } = hwcc;

    const traces = [];
    traces.push({
      type: "scatter",
      mode: "markers",
      x: k.flatMap((ki, i) => (wcc[i] ?? []).map(() => ki)),
      y: k.flatMap((_, i) => wcc[i] ?? []),
      marker: {
        size: 4,
        color: "#3e3e3e",
      },
      hoverinfo: "skip",
      name: "HWCC evolution",
    });

    // Gap points (red)
    traces.push({
      type: "scatter",
      mode: "markers",
      x: k,
      y: gaps,
      marker: {
        size: 8,
        color: "#de0000",
      },
      hoverinfo: "skip",
      name: "Largest gap",
    });

    const layout = {
      ...COMMON_LAYOUT_CONFIG,
      xaxis: {
        ...COMMON_LAYOUT_CONFIG.xaxis,
        zeroline: false,

        range: [-0.02, 1.02],
        tickvals: [0, 1],
        ticktext: ["0", "π/a"],
        tickfont: { size: 14, color: "#333" },

        title: { text: "k", font: { size: 16 }, standoff: 0 },
      },
      yaxis: {
        range: [-0.02, 1.02],
        zeroline: false,

        title: { text: "WCC x̄", font: { size: 16 }, standoff: 0 },
        tickfont: { size: 14, color: "#333" },
      },
    };

    Plotly.react(plotRef.current, traces, layout);

    return () => {
      Plotly.purge(plotRef.current);
    };
  }, [hwcc]);

  return <div ref={plotRef} style={{ width: "100%", height: "450px" }} />;
}
