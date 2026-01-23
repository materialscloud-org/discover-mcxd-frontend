import { loadIndex, loadMetadata } from "../common/restApiUtils";

import { countNumberOfAtoms, countNumberOfElements } from "../common/utils";

import { getSymmetryInfo } from "mc-react-library";

// Order the columns and define which ones to show by default
// refer to the label/field of the column
// columns not listed, will be not shown by default and placed at the bottom
const COLUMN_ORDER_AND_SETTINGS = [
  { field: "id", hide: false, width: 120 },
  { field: "formula", hide: false, minWidth: 110 },
  { field: "formula_hill", hide: true },
  { field: "num_elements", hide: false, minWidth: 110 },
  { field: "num_atoms", hide: false, minWidth: 110 },
  { field: "prototype", hide: true },
  { field: "space_group_int", hide: false },
  { field: "space_group_number", hide: true },
  { field: "band_gap", hide: false, minWidth: 110 },
  { field: "abundance", hide: true },
  { field: "magnetic_state", hide: false, minWidth: 110 },
  { field: "total_magnetization", hide: true, minWidth: 130 },
  { field: "absolute_magnetization", hide: true, minWidth: 130 },
  { field: "phonons_unstable", hide: false },
  { field: "binding_energy_df2", hide: false, minWidth: 140 },
  { field: "binding_energy_rvv10", hide: false },
  { field: "parent_formula", hide: false },
  { field: "parent_space_group_number", hide: true },
  { field: "parent_source_db", hide: true },
  { field: "parent_source_db_id", hide: true },
];

const FRONTEND_COLUMNS = [
  {
    columnDef: {
      field: "num_elements",
      headerName: "Number of elements",
      colType: "integer",
    },
    calcFunc: (entry) => countNumberOfElements(entry["formula_h"]),
  },
  {
    columnDef: {
      field: "num_atoms",
      headerName: "Num. of atoms/cell",
      colType: "integer",
    },
    calcFunc: (entry) => countNumberOfAtoms(entry["formula_h"]),
  },
  // {
  //   columnDef: {
  //     field: "bravais_lat",
  //     headerName: "Bravais lattice",
  //     colType: "text",
  //     infoText: "Bravais lattice in Pearson notation.",
  //   },
  //   calcFunc: (entry) => getSymmetryInfo(entry["sg"]).bravais_lattice_pearson,
  // },
  {
    columnDef: {
      field: "space_group_int",
      headerName: "Space group international",
      colType: "spg_symbol",
      infoText: "International short symbol for the space group.",
    },
    calcFunc: (entry) => getSymmetryInfo(entry["sg"]).space_group_symbol,
  },
];

function formatColumns(metadata) {
  /*
  The column definitions of the MaterialsSelector need to follow the format of
  
  {
    field: str,        // Internal label for the column
    headerName: str,   // Column title displayed in header
    unit: str,         // unit displayed in header
    colType: str,      // type that determines formatting & filtering, see below
    infoText: str,     // info text in the header menu
    hide: bool,        // whether to hide the column by default
  },

  Possible colTypes:
    * "id" - always on the left; and href to the detail page;
    * "formula" - special formatting with subscripts
    * "spg_symbol" - special formatting
    * "text"
    * "integer"
    * "float"
    * ...
  */
  let columns = [
    {
      field: "id",
      headerName: "ID",
      colType: "id",
      infoText: "The unique MC3D identifier of each structure.",
    },
  ];

  // convert the columns from metadata
  metadata["index-columns"].forEach((col) => {
    columns.push({
      field: col.label,
      headerName: col.name,
      unit: col.unit || null,
      colType: col.type || "text",
      infoText: col.description || null,
    });
  });

  // Add frontend columns
  FRONTEND_COLUMNS.forEach((frontCol) => {
    columns.push(frontCol.columnDef);
  });

  // order and hide columns
  let orderedColumns = [];
  COLUMN_ORDER_AND_SETTINGS.forEach((set) => {
    let colIndex = columns.findIndex((col) => col.field === set.field);
    if (colIndex !== -1) {
      let col = columns[colIndex];
      col.hide = set.hide;
      ["width", "minWidth"].forEach((prop) => {
        if (prop in set) {
          col[prop] = set[prop];
        }
      });
      orderedColumns.push(col);
      // Remove the column from the array
      columns.splice(colIndex, 1);
    }
  });
  columns.forEach((col) => {
    col.hide = true;
    orderedColumns.push(col);
  });

  return orderedColumns;
}

function formatRows(indexData, metadata) {
  /*
  The row data for the MaterialsSelector needs to contain
    * key-value for each column definition (key = "field" of the column);
    * 'href' - this link is added to the id column;

  The raw index data from the API needs:
  * href
  * mapping the short data_label to label/field of columns
  * calculating the frontend columns
  */
  let rows = [];

  let labelMap = {};
  metadata["index-columns"].forEach((col) => {
    labelMap[col.data_label] = col.label;
  });

  // for testing a small subset:
  // indexData = indexData.slice(0, 10);

  indexData.forEach((entry) => {
    // console.log(entry);
    let href = `${import.meta.env.BASE_URL}#/details/${entry["id"]}`;

    let row = {};
    Object.entries(entry).map(([key, value]) => {
      if (key in labelMap) {
        row[labelMap[key]] = value;
      }
    });

    let modifiedKeys = {
      id: entry["id"],
      href: href,
    };

    FRONTEND_COLUMNS.forEach((frontCol) => {
      modifiedKeys[frontCol.columnDef.field] = frontCol.calcFunc(entry);
    });

    row = { ...row, ...modifiedKeys };

    rows.push(row);
  });
  return rows;
}

export async function loadIndexMc2d() {
  let start = performance.now();
  let indexData = await loadIndex();
  let end = performance.now();
  console.log(`loadIndex: ${end - start} ms`);

  start = performance.now();
  let metadata = await loadMetadata();
  end = performance.now();
  console.log(`loadMetadata: ${end - start} ms`);

  // console.log(indexData);
  // console.log(metadata);

  start = performance.now();
  let rows = formatRows(indexData, metadata);
  end = performance.now();
  console.log(`formatRows: ${end - start} ms`);

  let columns = formatColumns(metadata);

  // console.log("Rows", rows);
  // console.log("Rows keys", Object.keys(rows[0]));
  // console.log("Columns", columns);

  // return a Promise of the correctly formatted data
  return {
    columns: columns,
    rows: rows,
  };
}
