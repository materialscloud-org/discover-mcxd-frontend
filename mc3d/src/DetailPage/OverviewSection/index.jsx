import { useMemo } from "react";

import "./index.css";

import StructureVisualizer from "mc-react-structure-visualizer";

import { StructureDownload } from "../../common/StructureDownload";

import { Container, Row, Col } from "react-bootstrap";

import { formula } from "mc-react-library";

import {
  ExploreButton,
  StructDownloadButton,
  formatChemicalFormula,
  formatSpaceGroupSymbol,
} from "mc-react-library";

import { format_aiida_prop } from "../../common/utils";
import { McInfoBox } from "@mcxd/shared";

import SourceInfo from "./SourceInfo";

import { AIIDA_API_URLS, EXPLORE_URLS } from "../../common/fetchingUtils";

import { ToggleSwitch } from "mc-react-library";

import { toCIF, volume, density } from "matsci-parse";
import CellSelector from "../../common/CellSelector";

function GeneralInfoBox({
  details,
  metadata,
  methodLabel,
  crystals,
  cellMode,
}) {
  const crystalStructure = crystals[cellMode.selectedCell];

  console.log(crystals);

  console.log(crystals?.calculationResults?.hm_symbol);

  const symbol = crystals?.calculationResults?.hm_symbol ?? "";

  const cleanSymbol =
    typeof symbol === "string" ? symbol.replace(/\s+/g, "") : "";

  return (
    <McInfoBox style={{ height: "260px" }}>
      <div>
        <b>Info</b>
        <ul className="no-bullets">
          <li>
            Formula: {formatChemicalFormula(details.general.formula)}
            <i> (IUPAC) </i>{" "}
            {formatChemicalFormula(details.general.formula_hill)}{" "}
            <i>Hill (full):</i>
          </li>
          {/* <li>
            Formula (IUPAC): {formatChemicalFormula(details.general.formula)}
          </li>
          <li>
            Hill formula (full):{" "}
            {formatChemicalFormula(details.general.formula_hill)}
          </li> */}
          <li>Bravais lattice: {details.general.bravais_lattice}</li>
          {/* <li>
            Space group symbol:{" "}
            {formatSpaceGroupSymbol(details.general.spacegroup_international)}
          </li> */}
          <li>
            Space group Info:{" "}
            {crystalStructure?.lattice ? (
              <>
                {formatSpaceGroupSymbol(
                  (crystals?.calculationResults?.hm_symbol ?? "").replace(
                    /\s+/g,
                    "",
                  ),
                )}{" "}
                ({crystals?.calculationResults?.number})
              </>
            ) : (
              "—"
            )}
          </li>
          {/* <li>Space group number: {details.general.spacegroup_number}</li> */}
          <li>
            <li>
              Volume:{" "}
              {crystalStructure?.lattice
                ? `${volume(crystalStructure).toFixed(2)} Å³`
                : "—"}
            </li>
            Density:{" "}
            {crystalStructure?.lattice
              ? `${(density(crystalStructure) * 1660.5390666).toFixed(0)} kg/m³`
              : "—"}
          </li>
        </ul>
      </div>
      <div>
        <b>Source</b>
        <SourceInfo sources={details.source} metadata={metadata} />
      </div>
      <div>
        <ul className="no-bullets">
          {/* <li>
            Density:{" "}
            {formula.calculateDensity(
              details.general.formula_hill,
              details.properties.cell_volume,
            )}{" "}
            kg/m<sup>3</sup>
          </li> */}
          {/* <li>
            Cell volume:{" "}
            {format_aiida_prop(
              details.properties.cell_volume,
              metadata.info.properties.cell_volume,
              methodLabel,
              2,
            )}
          </li> */}
          {/* <li>
            Total magnetization:{" "}
            {format_aiida_prop(
              details.properties.total_magnetization,
              metadata.info.properties.total_magnetization,
              methodLabel,
              2,
            )}
          </li>
          <li>
            Absolute magnetization:{" "}
            {format_aiida_prop(
              details.properties.absolute_magnetization,
              metadata.info.properties.absolute_magnetization,
              methodLabel,
              2,
            )}
          </li> */}
        </ul>
      </div>
    </McInfoBox>
  );
}

const StructureViewerBox = ({
  uuid,
  id,
  structureInfo,
  methodLabel,
  crystals,
  cellMode,
}) => {
  const handleToggle = () => {
    cellMode.setUsePrimitive((v) => !v);
  };

  const crystalStructure = crystals[cellMode.selectedCell];

  const primitiveCif = useMemo(
    () => (crystals.primitive ? toCIF(crystals.primitive) : null),
    [crystals.primitive],
  );

  const conventionalCif = useMemo(
    () => (crystals.conventional ? toCIF(crystals.conventional) : null),
    [crystals.conventional],
  );

  const aiidaCif = useMemo(
    () => (crystals.aiida ? toCIF(crystals.aiida) : null),
    [crystals.aiida],
  );

  const cifMap = {
    primitive: primitiveCif,
    conventional: conventionalCif,
    aiida: aiidaCif,
  };

  const cifText = cifMap[cellMode.selectedCell];
  const filenamePrefix = `${id}_${cellMode.selectedCell}`;

  return (
    <>
      <div className="subsection-title">
        Structure{" "}
        <ExploreButton explore_url={EXPLORE_URLS[methodLabel]} uuid={uuid} />
      </div>

      <div
        className="structure-view-box subsection-shadow"
        style={{ position: "relative" }}
      >
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            zIndex: 10,
          }}
        >
          <CellSelector
            value={cellMode.selectedCell}
            onChange={cellMode.setSelectedCell}
          />
        </div>

        {cifText && (
          <StructureVisualizer cifText={cifText} initSupercell={[2, 2, 2]} />
        )}

        <div className="download-button-container px-1">
          <StructureDownload
            structure={crystalStructure}
            namePrefix={filenamePrefix}
          />
        </div>
      </div>
    </>
  );
};

function OverviewSection({
  params,
  loadedData,
  headerStyle = {},
  crystals,
  cellMode,
}) {
  return (
    <div>
      <div className="section-heading" style={headerStyle}>
        General overview
      </div>
      <Container fluid className="section-container">
        <Row>
          <Col className="flex-column">
            <StructureViewerBox
              uuid={loadedData.details.general.structure_uuid}
              id={params.id}
              structureInfo={loadedData.structureInfo}
              methodLabel={params.method}
              crystals={crystals}
              cellMode={cellMode}
            />
          </Col>
          <Col className="flex-column">
            <div style={{ marginTop: "35px" }}>
              <GeneralInfoBox
                details={loadedData.details}
                metadata={loadedData.metadata}
                methodLabel={params.method}
                crystals={crystals}
                cellMode={cellMode}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default OverviewSection;
