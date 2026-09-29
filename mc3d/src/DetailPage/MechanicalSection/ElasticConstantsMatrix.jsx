import { McTable } from "@mcxd/shared";

export default function ElasticConstantsMatrix({ value }) {
  // we style the edge in this case since we like it this way.
  const EdgeStyle = { backgroundColor: "#eff6ff", fontWeight: "bold" };
  return (
    <McTable
      headerRow={[
        "",
        ...value[0].map((_, index) => (
          <span key={`header-${index}`}>
            ε<sub>{index + 1}</sub>
          </span>
        )),
      ]}
      contents={value.map((row, rowIndex) => [
        <span key={`row-${rowIndex}`}>
          σ<sub>{rowIndex + 1}</sub>
        </span>,
        ...row.map((cell) =>
          cell == null
            ? "—"
            : typeof cell === "number"
              ? cell.toFixed(2)
              : String(cell),
        ),
      ])}
      firstRowStyle={EdgeStyle}
      firstColumnStyle={EdgeStyle}
      topCornerStyle={EdgeStyle}
    />
  );
}
