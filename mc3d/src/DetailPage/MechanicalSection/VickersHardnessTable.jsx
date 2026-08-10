import { McTable } from "@mcxd/shared";

function formatHardnessLabel(key) {
  const match = key.match(/^H_(.+)$/);

  if (!match) {
    return key;
  }

  return (
    <>
      H<sub>{match[1]}</sub>
    </>
  );
}

export default function VickersHardnessTable({ value }) {
  const contents = value.flatMap((item) =>
    Object.entries(item).map(([key, hardness]) => [
      formatHardnessLabel(key),
      hardness == null
        ? "—"
        : typeof hardness === "number"
          ? hardness.toFixed(3)
          : String(hardness),
    ]),
  );

  return <McTable headerRow={["Hardness", "Hᵥ [GPa]"]} contents={contents} />;
}
