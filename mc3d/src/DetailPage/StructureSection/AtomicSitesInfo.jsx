import React, { useState, useMemo } from "react";

import { matrix, ToggleSwitch } from "mc-react-library";

import { McTable } from "@mcxd/shared";

import { cartesianToFractional } from "matsci-parse";

export const AtomicSitesInfoBox = ({ structureInfo }) => {
  const [atomsModeState, setAtomsModeState] = useState(false);

  const cell = structureInfo.aiidaAttributes.cell;
  const sites = structureInfo.aiidaAttributes.sites;

  const handleToggle = (checked) => {
    setAtomsModeState(checked);
  };

  // Compute table data only when needed
  const tableData = useMemo(() => {
    return sites.map((s) => {
      const coords = atomsModeState
        ? cartesianToFractional(s.position, cell)
        : s.position;

      return [
        s.kind_name,
        coords[0].toFixed(4),
        coords[1].toFixed(4),
        coords[2].toFixed(4),
      ];
    });
  }, [sites, cell, atomsModeState]);

  const header = atomsModeState
    ? ["Kind label", "x", "y", "z"]
    : ["Kind label", "x [Å]", "y [Å]", "z [Å]"];

  return (
    <div>
      <div
        className="subsection-title"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Atomic positions</span>

        <div
          style={{
            display: "flex",
            gap: "40px",
            marginRight: "5px",
            alignItems: "center",
          }}
        >
          <ToggleSwitch
            labelLeft="Cartesian"
            labelRight="Fractional"
            switchLength="30px"
            fontSize="17px"
            onToggle={handleToggle}
          />
        </div>
      </div>

      <McTable
        headerRow={header}
        contents={tableData}
        style={{ maxHeight: "332px" }}
      />
    </div>
  );
};
