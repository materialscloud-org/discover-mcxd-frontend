import { useEffect, useRef, useMemo } from "react";
import Plotly from "plotly.js-basic-dist-min";
import { COMMON_LAYOUT_CONFIG } from "@mcxd/shared";

export function HWCCPlot({ hwcc }) {
  const plotRef = useRef(null);

  const traces = useMemo(() => {
    if (!hwcc) return [];

    const { k, gaps, wcc } = hwcc;

    const x = [];
    const y = [];

    // Deduplicate per k
    for (let i = 0; i < k.length; i++) {
      const ki = k[i];
      const wcci = wcc[i];
      if (!Array.isArray(wcci)) continue;

      const seenY = new Set();
      for (let j = 0; j < wcci.length; j++) {
        const v = wcci[j];
        if (seenY.has(v)) continue;
        seenY.add(v);
        x.push(ki);
        y.push(v);
      }
    }

    return [
      {
        type: "scatter",
        mode: "markers",
        x,
        y,
        marker: { size: 3, color: "#3e3e3e", opacity: 0.7 },
        hoverinfo: "skip",
        name: "HWCC evolution",
      },
      {
        type: "scatter",
        mode: "markers",
        x: k,
        y: gaps,
        marker: { size: 8, color: "#de0000" },
        hoverinfo: "skip",
        name: "Largest gap",
      },
    ];
  }, [hwcc]);

  const layout = useMemo(
    () => ({
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
    }),
    [],
  );

  useEffect(() => {
    if (!plotRef.current || !traces.length) return;

    const plotElement = plotRef.current;

    Plotly.react(plotElement, traces, layout, {});

    return () => Plotly.purge(plotElement);
  }, [traces, layout]);

  console.log(traces);

  return <div ref={plotRef} style={{ width: "100%", height: "365px" }} />;
}
