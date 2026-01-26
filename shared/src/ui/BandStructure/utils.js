import { SuperConTraceConfigs } from "./configs";

export function prettifyLabels(label) {
  const greekMapping = {
    GAMMA: "Γ",
    DELTA: "Δ",
    SIGMA: "Σ",
    LAMBDA: "Λ",
  };
  Object.keys(greekMapping).forEach((symbol) => {
    const regex = new RegExp(symbol, "gi");
    label = label.replace(regex, greekMapping[symbol]);
  });

  label = label.replace(/\bG\b/g, "Γ");
  label = label.replace(/-/g, "—");
  const ssMapping = {
    0: "₀",
    1: "₁",
    2: "₂",
    3: "₃",
    4: "₄",
    5: "₅",
    6: "₆",
    7: "₇",
    8: "₈",
    9: "₉",
  };
  label = label.replace(/_(.)/g, (match, p1) => ssMapping[p1] || match);

  return label;
}

// Shifts all band values by a given amount
export function shiftBands(bandsData, shift) {
  bandsData.paths.forEach((path) => {
    path.values.forEach((subpath) => {
      subpath.forEach((val, idx, arr) => {
        arr[idx] += shift;
      });
    });
  });
}

// stretches bandData arrays so that they share a global xMin and global xMax.
export function normalizeBandsData(bandsObjects) {
  // Step 1: compute cumulative length of each bands entry
  const cumulativeLengths = bandsObjects.map((bandObj) => {
    const paths = bandObj.bandsData?.paths;
    if (!paths) return 0;

    return paths.reduce((sum, path) => {
      if (!path.x || path.x.length === 0) return sum;
      return sum + (path.x[path.x.length - 1] - path.x[0]);
    }, 0);
  });

  // Step 2: find the maximum cumulative length
  const globalMaxLength = Math.max(...cumulativeLengths);

  // Step 3: scale each dataset to match globalMaxLength
  const newBandsObjects = bandsObjects.map((bandObj, idx) => {
    const paths = bandObj.bandsData?.paths;
    if (!paths) return bandObj;

    const localLength = cumulativeLengths[idx];
    if (localLength === 0) return bandObj;

    const scale = globalMaxLength / localLength;

    const newPaths = paths.map((path) => {
      if (!path.x || path.x.length === 0) return path;
      return {
        ...path,
        x: path.x.map((x) => x * scale),
      };
    });

    return {
      ...bandObj,
      bandsData: {
        ...bandObj.bandsData,
        paths: newPaths,
      },
    };
  });

  return newBandsObjects;
}

// supercon data set is not spin polarised
// only use the first color in colors
// and dont try to spin split.
export function prepareSuperConBand(
  bandObject,
  shiftVal = 0,
  configKey = "unknown",
) {
  shiftBands(bandObject, shiftVal);

  const cfg = SuperConTraceConfigs[configKey] ?? SuperConTraceConfigs.unknown;

  return {
    bandsData: bandObject,
    traceFormat: {
      label: cfg.label,
      name: cfg.label,
      hovertemplate: `<b>${cfg.label}</b>: %{y:.3f} ${cfg.units}<br><extra></extra>`,
      ...cfg.trace,
    },
  };
}

export function buildTraceFormat(cfg) {
  return {
    label: cfg.label,
    name: cfg.label,
    hovertemplate: `<b>${cfg.label}</b>: %{y:.3f} ${cfg.units}<br><extra></extra>`,
    ...cfg.trace,
  };
}
