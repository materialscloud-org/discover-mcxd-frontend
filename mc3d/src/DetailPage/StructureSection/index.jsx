import { CellInfoBox } from "./CellInfo";
import { AtomicSitesInfoBox } from "./AtomicSitesInfo";

import { Container, Row, Col } from "react-bootstrap";

import { StructureIcon } from "../../assets/sectionIcons";

import CellSelector from "../../common/CellSelector";

export default function StructureSection({
  params,
  loadedData,
  cellMode,
  crystals,
}) {
  let details = loadedData.details;
  let structureInfo = loadedData.structureInfo;

  return (
    <div id="structure" data-toc-section="structure">
      <div
        className="section-heading"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span>
          <StructureIcon size={22} className="section-heading-icon" />
          Structural details
        </span>

        <CellSelector
          value={cellMode.selectedCell}
          onChange={cellMode.setSelectedCell}
        />
      </div>
      <Container fluid className="section-container">
        <Row>
          <Col className="flex-column">
            <CellInfoBox
              structureInfo={structureInfo}
              spacegroup_symbol={details.general.spacegroup_international}
              crystals={crystals}
              cellMode={cellMode}
            />
          </Col>
          <Col className="flex-column">
            <AtomicSitesInfoBox
              structureInfo={structureInfo}
              crystals={crystals}
              cellMode={cellMode}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
