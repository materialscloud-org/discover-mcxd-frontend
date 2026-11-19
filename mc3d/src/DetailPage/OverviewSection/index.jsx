import "./index.css";

import StructureVisualizer from "mc-react-structure-visualizer";

import { StructureDownload } from "../../common/StructureDownload";

import { Container, Row, Col } from "react-bootstrap";

import {
  ExploreButton,
  formatChemicalFormula,
  formatSpaceGroupSymbol,
} from "mc-react-library";

import { McInfoBox } from "@mcxd/shared";

import { OverviewIcon } from "../../assets/sectionIcons";

import SourceInfo from "./SourceInfo";

import { EXPLORE_URLS } from "../../common/fetchingUtils";

import { volume, density } from "matsci-parse";
import CellSelector from "../../common/CellSelector";

function GeneralInfoBox({
  details,
  metadata,
  methodLabel,
  crystals,
  cellMode,
}) {
  const crystalStructure = crystals[cellMode.selectedCell];
  const symbol = crystals?.calculationResults?.hm_symbol ?? "";

  return (
    <McInfoBox style={{ maxHeight: "420px" }}>
      <div>
        <b>Info</b>
        <ul className="no-bullets">
          <li>
            IUPAC formula: {formatChemicalFormula(details.general.formula)}
          </li>
          <li>
            Hill formula (full):{" "}
            {formatChemicalFormula(details.general.formula_hill)}{" "}
          </li>
          <li>Bravais lattice: {details.general.bravais_lattice}</li>
          <li>
            Space group info:{" "}
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
          <li>
            Volume:{" "}
            {crystalStructure?.lattice
              ? `${volume(crystalStructure).toFixed(2)} Å³`
              : "—"}
          </li>
          <li>
            Atoms per cell:{" "}
            {crystalStructure?.sites?.length
              ? `${crystalStructure.sites.length}`
              : "—"}
          </li>
          <li>
            Density:{" "}
            {crystalStructure?.lattice // inlined kg/m3 conversion
              ? `${(density(crystalStructure) * 1660.5390666).toFixed(0)} kg/m³`
              : "—"}
          </li>
        </ul>
      </div>
      <div>
        <SourceInfo sources={details.source} metadata={metadata} />
      </div>
      <div>
        <ul className="no-bullets"></ul>
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

        {crystalStructure && (
          <StructureVisualizer
            structure={crystalStructure}
            initSupercell={[2, 2, 2]}
          />
        )}

        <div className="download-button-container px-1">
          <StructureDownload
            structure={crystalStructure}
            namePrefix={filenamePrefix}
            id={id}
            method={methodLabel}
            cellType={
              cellMode.selectedCell === "primitive"
                ? "primitive"
                : cellMode.selectedCell === "aiida"
                  ? "from AiiDA"
                  : "conventional"
            }
          />
        </div>
      </div>
    </>
  );
};

export default function OverviewSection({
  params,
  loadedData,
  headerStyle = {},
  crystals,
  cellMode,
}) {
  return (
    <div id="overview" data-toc-section="overview">
      <div className="section-heading" style={headerStyle}>
        <OverviewIcon size={22} className="section-heading-icon" />
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
