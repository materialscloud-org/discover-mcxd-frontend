import { formatChemicalFormula } from "mc-react-library";

export function formatTitle(formulaStr, id) {
  return (
    <span>
      {formatChemicalFormula(formulaStr)} ({id})
    </span>
  );
}
