import React, { useState, useMemo } from "react";

import { ToggleSwitch } from "mc-react-library";
import { McTable } from "@mcxd/shared";

import { fractional, cartesian } from "matsci-parse";

export const AtomicSitesInfoBox = ({ crystals, cellMode }) => {
  const [showFractional, setShowFractional] = useState(false);

  const crystalStructure = cellMode.usePrimitive
    ? crystals?.primitive
    : crystals?.conventional;

  const cell = crystalStructure?.lattice;
  const sites = crystalStructure?.sites || [];
  const species = crystalStructure?.species || [];

  const tableData = useMemo(() => {
    if (!cell || !Array.isArray(sites)) return [];

    return sites.map((site) => {
      const coords = showFractional ? site.frac : cartesian(cell, site);

      return [
        site.species.symbol,
        coords[0].toFixed(4),
        coords[1].toFixed(4),
        coords[2].toFixed(4),
      ];
    });
  }, [sites, species, cell, showFractional]);

  const header = showFractional
    ? ["Species", "x", "y", "z"]
    : ["Species", "x [Å]", "y [Å]", "z [Å]"];

  return (
    <div>
      <div className="subsection-title">
        <span>Atomic positions</span>

        <div style={{ float: "right" }}>
          <ToggleSwitch
            labelLeft="Cartesian"
            labelRight="Fractional"
            switchLength="30px"
            fontSize="17px"
            toggled={showFractional}
            onToggle={setShowFractional}
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
