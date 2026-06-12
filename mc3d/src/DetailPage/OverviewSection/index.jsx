import { useMemo } from "react";

import "./index.css";

import StructureVisualizer from "mc-react-structure-visualizer";

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

import { toCIF } from "matsci-parse";

import { volume } from "matsci-parse";

function GeneralInfoBox({
  details,
  metadata,
  methodLabel,
  crystals,
  cellMode,
}) {
  const crystalStructure = cellMode.usePrimitive
    ? crystals.primitive
    : crystals.conventional;

  return (
    <McInfoBox style={{ height: "450px" }}>
      <div>
        <b>Info</b>
        <ul className="no-bullets">
          <li>
            Formula (IUPAC): {formatChemicalFormula(details.general.formula)}
          </li>
          <li>
            Hill formula (full):{" "}
            {formatChemicalFormula(details.general.formula_hill)}
          </li>
          <li>Bravais lattice: {details.general.bravais_lattice}</li>
          <li>
            Space group symbol:{" "}
            {formatSpaceGroupSymbol(details.general.spacegroup_international)}
          </li>
          <li>Space group number: {details.general.spacegroup_number}</li>
        </ul>
      </div>
      <div>
        <b>Source</b>
        <SourceInfo sources={details.source} metadata={metadata} />
      </div>
      <div>
        <b>Properties</b>
        <ul className="no-bullets">
          <li>
            Total energy:{" "}
            {format_aiida_prop(
              details.properties.total_energy,
              metadata.info.properties.total_energy,
              methodLabel,
              2,
            )}
          </li>
          <li>
            Density:{" "}
            {formula.calculateDensity(
              details.general.formula_hill,
              details.properties.cell_volume,
            )}{" "}
            kg/m<sup>3</sup>
          </li>
          <li>
            Volume:{" "}
            {crystalStructure?.lattice
              ? `${volume(crystalStructure.lattice).toFixed(2)} Å³`
              : "—"}
          </li>
          {/* <li>
            Cell volume:{" "}
            {format_aiida_prop(
              details.properties.cell_volume,
              metadata.info.properties.cell_volume,
              methodLabel,
              2,
            )}
          </li> */}
          <li>
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
          </li>
        </ul>
      </div>
    </McInfoBox>
  );
}

const StructureViewerBox = ({
  uuid,
  structureInfo,
  methodLabel,
  crystals,
  cellMode,
}) => {
  const handleToggle = () => {
    cellMode.setUsePrimitive((v) => !v);
  };

  const crystalStructure = cellMode.usePrimitive
    ? crystals.primitive
    : crystals.conventional;

  const primitiveCif = useMemo(() => {
    return crystals.primitive ? toCIF(crystals.primitive) : null;
  }, [crystals.primitive]);

  const conventionalCif = useMemo(() => {
    return crystals.conventional ? toCIF(crystals.conventional) : null;
  }, [crystals.conventional]);

  const cifText = cellMode.usePrimitive ? primitiveCif : conventionalCif;

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
          <ToggleSwitch
            labelLeft="Primitive"
            labelRight="Conventional"
            switchLength="30px"
            fontSize="17px"
            toggled={!cellMode.usePrimitive}
            onToggle={(value) => {
              cellMode.setUsePrimitive(!value);
            }}
          />
        </div>

        {cifText && (
          <StructureVisualizer cifText={cifText} initSupercell={[2, 2, 2]} />
        )}

        <div className="download-button-container">
          <StructDownloadButton
            aiida_rest_url={AIIDA_API_URLS[methodLabel]}
            uuid={uuid}
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
