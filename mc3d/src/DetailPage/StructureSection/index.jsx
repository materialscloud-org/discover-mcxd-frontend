import { ExploreButton, StructDownloadButton } from "mc-react-library";

import { CellInfoBox } from "./CellInfo";
import { AtomicSitesInfoBox } from "./AtomicSitesInfo";

import { Container, Row, Col } from "react-bootstrap";

import { McInfoBox } from "@mcxd/shared";

import { AIIDA_API_URLS, EXPLORE_URLS } from "../../common/fetchingUtils";
import { format_aiida_prop } from "../../common/utils";

import { ToggleSwitch } from "mc-react-library";
import CellSelector from "../../common/CellSelector";

const StructureSection = ({ params, loadedData, cellMode, crystals }) => {
  let details = loadedData.details;
  let structureInfo = loadedData.structureInfo;

  const metadata = loadedData.metadata;
  const methodLabel = params.method;

  return (
    <div>
      <div className="section-heading">Structural details</div>
      <Container fluid className="section-container">
        <Row>
          <div style={{ marginBottom: "10px" }}>
            {/* Switch Align right */}
            <CellSelector
              value={cellMode.selectedCell}
              onChange={cellMode.setSelectedCell}
            />
          </div>
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
};

export default StructureSection;
