import React, { useState, useMemo } from "react";

import { ToggleSwitch } from "mc-react-library";
import { McTable } from "@mcxd/shared";
import { latticeToCellParams } from "matsci-parse";

export const CellInfoBox = ({ crystals, cellMode }) => {
  const [showMatrix, setShowMatrix] = useState(false);

  const activeLattice = cellMode.usePrimitive
    ? crystals?.primitive?.lattice
    : crystals?.conventional?.lattice;

  const safeParams = useMemo(() => {
    if (!activeLattice || !Array.isArray(activeLattice)) return null;

    try {
      return latticeToCellParams(activeLattice);
    } catch (e) {
      console.warn("latticeToCellParams failed:", e);
      return null;
    }
  }, [activeLattice]);

  const safeMatrix = Array.isArray(activeLattice) ? activeLattice : [];

  return (
    <div>
      {/* Header */}
      <div className="subsection-title">
        <span>Cell info</span>

        <div style={{ float: "right" }}>
          <ToggleSwitch
            labelLeft="Parameters"
            labelRight="Matrix"
            switchLength="30px"
            fontSize="17px"
            toggled={showMatrix}
            onToggle={setShowMatrix}
          />
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          minHeight: "181px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {!safeParams ? (
          <div>Structure data missing</div>
        ) : showMatrix ? (
          <McTable
            headerRow={["", "x [Å]", "y [Å]", "z [Å]"]}
            contents={safeMatrix.map((v, i) => [
              <span key={i}>
                v<sub>{i + 1}</sub>
              </span>,
              v[0],
              v[1],
              v[2],
            ])}
          />
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <McTable
              headerRow={["", "a", "b", "c"]}
              contents={[
                ["Lengths [Å]", safeParams.a, safeParams.b, safeParams.c],
              ]}
            />
            <McTable
              headerRow={["", "α", "β", "γ"]}
              contents={[
                [
                  "Angles [°]",
                  safeParams.alpha,
                  safeParams.beta,
                  safeParams.gamma,
                ],
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
};
