import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useRef,
} from "react";
import "mc-periodic-table";
import { symbols } from "mc-periodic-table";
import Popover from "react-bootstrap/Popover";
import { HelpButton } from "mc-react-library";
import MaterialDataGrid from "./MaterialDataGrid";
import "./index.css";

function calcElementArray(formula) {
  return [...new Set(formula.match(/[A-Z][a-z]?/g))];
}

function modifyRows(rows, columns) {
  let booleanFields = columns
    .filter((col) => col.colType === "boolean")
    .map((col) => col.field);

  const modifiedRows = rows.map((row) => {
    const newRow = { ...row, elem_array: calcElementArray(row["formula"]) };
    booleanFields.forEach((field) => {
      if (field in newRow) {
        newRow[field] = newRow[field] ? "yes" : "no";
      }
    });
    return newRow;
  });
  return modifiedRows;
}

// Replicates the old PTable's enabledElements + fitsFilter logic:
// given the current element selection, only elements that co-occur
// in rows that pass the filter should remain interactive.
function enabledAtomicNumbers(rows, elements) {
  const include = new Set();
  const exclude = new Set();
  for (const [el, sel] of Object.entries(elements)) {
    if (sel === 1) include.add(el);
    if (sel === 2) exclude.add(el);
  }

  const enabled = new Set();
  rows.forEach((row) => {
    const elemSet = new Set(row.elem_array);
    const incl =
      include.size === 0 || [...include].every((e) => elemSet.has(e));
    const excl = [...elemSet].every((e) => !exclude.has(e));
    if (incl && excl) {
      row.elem_array.forEach((s) => enabled.add(s));
    }
  });

  const result = [];
  symbols.forEach((sym, z) => {
    if (z > 0 && enabled.has(sym)) result.push(z);
  });
  return result;
}

const CELL_FIELDS = {
  topCenter: (z) => z,
  center: (z) => symbols[z],
};

const helpPopover = (
  <Popover id="popover-basic">
    <Popover.Header as="h3">Filtering mode help</Popover.Header>
    <Popover.Body style={{ textAlign: "justify" }}>
      <b>Include/exclude elements</b>
      <br />
      The green selected elements must be included, while the red elements must
      not be included in the formula. For example selecting Si (green) and O
      (red) filters for materials that contain Si and any other elements except
      O.
      <br />
      <b>Only selected elements</b>
      <br />
      Only the selected elements are allowed in the resulting chemical formula.
      For example selecting Si (green) and O (green) only allows for formulas in
      the form of Si<sub>x</sub>O<sub>y</sub>.
    </Popover.Body>
  </Popover>
);

const MaterialSelector = forwardRef((props, ref) => {
  MaterialSelector.displayName = "MaterialSelector";

  const ptableRef = useRef(null);
  const [ptableFilter, setPtableFilter] = useState({
    mode: "include",
    elements: {},
  });
  const [modifiedRows, setModifiedRows] = useState([]);

  useEffect(() => {
    setModifiedRows(modifyRows(props.rows, props.columns));
  }, [props.rows, props.columns]);

  useEffect(() => {
    const el = ptableRef.current;
    if (!el) return;
    el.fields = CELL_FIELDS;
  }, []);

  // Dynamic enabled elements: updates as the user selects elements,
  // mirroring the old PTable's enabledElements logic.
  // Elements with a non-zero state remain clickable so users can
  // cycle through states and aren't locked in.
  useEffect(() => {
    const el = ptableRef.current;
    if (!el || !modifiedRows.length) return;

    const enabled = enabledAtomicNumbers(modifiedRows, ptableFilter.elements);
    const selected = new Set();
    for (const [sym, stateVal] of Object.entries(ptableFilter.elements)) {
      if (stateVal > 0) {
        const z = symbols.indexOf(sym);
        if (z > 0) selected.add(z);
      }
    }
    const interactive = new Set([...enabled, ...selected]);
    const all = Array.from({ length: 118 }, (_, i) => i + 1);
    el.setCellInteraction([...interactive], "normal");
    el.setCellInteraction(
      all.filter((z) => !interactive.has(z)),
      "noInteractive",
    );
  }, [modifiedRows, ptableFilter.elements]);

  useEffect(() => {
    const el = ptableRef.current;
    if (!el) return;

    const handler = (e) => {
      const elements = {};
      for (const [atomicStr, stateVal] of Object.entries(e.detail)) {
        const num = Number(atomicStr);
        if (num > 0 && stateVal > 0) {
          elements[symbols[num]] = stateVal;
        }
      }
      setPtableFilter((prev) => ({ ...prev, elements }));
    };

    el.addEventListener("change", handler);
    return () => el.removeEventListener("change", handler);
  }, []);

  const handleModeChange = useCallback((e) => {
    const newMode = e.target.value;
    setPtableFilter((prev) => {
      if (newMode === "exact") {
        const elements = { ...prev.elements };
        for (const [el, sel] of Object.entries(elements)) {
          if (sel > 1) delete elements[el];
        }
        return { mode: newMode, elements };
      }
      return { ...prev, mode: newMode };
    });
  }, []);

  const isLoaded = props.columns.length > 0;

  return (
    <div className="material_selector_container">
      <div className="ptable-mode-row" style={{ paddingBottom: "40px" }}>
        <periodic-table ref={ptableRef}></periodic-table>
        <div className="selection_mode_outer">
          <div className="selection_mode_inner">
            <div style={{ marginBottom: "2px" }}>Elements filtering mode:</div>
            <label className="selection_mode_control">
              <input
                type="radio"
                name="sel_mode"
                value="include"
                defaultChecked
                onChange={handleModeChange}
              />
              Include/exclude
            </label>
            <label className="selection_mode_control">
              <input
                type="radio"
                name="sel_mode"
                value="exact"
                onChange={handleModeChange}
              />
              Only selected
            </label>
          </div>
          <HelpButton popover={helpPopover} placement="bottom" />
        </div>
      </div>
      <div style={{ marginTop: "5px" }}></div>
      {isLoaded ? (
        <MaterialDataGrid
          ref={ref}
          columns={props.columns}
          rows={modifiedRows}
          ptable_filter={ptableFilter}
          columnFilters={props.columnFilters}
        />
      ) : (
        <div
          style={{
            marginTop: "50px",
            border: "solid 2px rgb(220, 220, 220)",
            height: "600px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Loading...
        </div>
      )}
    </div>
  );
});

export default MaterialSelector;
