import { McTable } from "@mcxd/shared";

export default function ElasticConstantsMatrix({ value }) {
  return (
    <McTable
      headerRow={["", ...value[0].map((_, index) => index + 1)]}
      contents={value.map((row, rowIndex) => [
        <span key={`row-${rowIndex}`}>
          C<sub>{rowIndex + 1}</sub>
        </span>,
        ...row.map((cell) =>
          cell == null
            ? "—"
            : typeof cell === "number"
              ? cell.toFixed(2)
              : String(cell),
        ),
      ])}
    />
  );
}
