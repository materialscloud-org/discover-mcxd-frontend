import React, { useState, useMemo } from "react";

import { ToggleSwitch } from "mc-react-library";
import { McTable } from "@mcxd/shared";
import { parameters } from "matsci-parse";

export const CellInfoBox = ({ crystals, cellMode }) => {
  const [showMatrix, setShowMatrix] = useState(false);

  const cellData = useMemo(() => {
    const lattice = cellMode.usePrimitive
      ? crystals?.primitive?.lattice
      : crystals?.conventional?.lattice;

    if (!lattice) return null;

    try {
      const params = parameters(lattice);

      const data = lattice?.basis?.data;

      const matrix =
        data?.length === 9
          ? [
              [data[0], data[1], data[2]],
              [data[3], data[4], data[5]],
              [data[6], data[7], data[8]],
            ]
          : [];

      return {
        matrix,
        params,
        valid: Array.isArray(params) && params.length === 6,
      };
    } catch (e) {
      console.warn("cellData build failed:", e);
      return null;
    }
  }, [crystals, cellMode.usePrimitive]);

  const isValid = cellData?.valid ?? false;
  const matrix = cellData?.matrix ?? [];
  const params = cellData?.params ?? [];

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

      <div
        style={{
          minHeight: "181px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {!isValid ? (
          <div>Structure data missing</div>
        ) : showMatrix ? (
          <McTable
            headerRow={["", "x [Å]", "y [Å]", "z [Å]"]}
            contents={matrix.map((v, i) => [
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
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            <McTable
              headerRow={["", "a", "b", "c"]}
              contents={[["Lengths [Å]", params[0], params[1], params[2]]]}
            />

            <McTable
              headerRow={["", "α", "β", "γ"]}
              contents={[["Angles [°]", params[3], params[4], params[5]]]}
            />
          </div>
        )}
      </div>
    </div>
  );
};
