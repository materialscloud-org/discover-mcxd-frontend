import "./index.css";

import { ExploreButton } from "mc-react-library";

import { EXPLORE_URLS } from "../../common/fetchingUtils";

import { Container, Row, Col } from "react-bootstrap";
import { McInfoBox } from "@mcxd/shared";

import { format_aiida_prop } from "../../common/utils";

import { StructDownloadButton } from "mc-react-library";

import { AIIDA_API_URLS } from "../../common/fetchingUtils";

function ProvenanceSection(props) {
  let details = props.loadedData.details;

  let metadata = props.loadedData.metadata;
  let methodLabel = props.params.method;
  let params = props.params;
  console.log(props);
  return (
    <div>
      <div className="section-heading">Calculation Information</div>
      {/* <div className="provenance-section"> */}

      <Container fluid className="section-container">
        <Row>
          <Col>
            <div style={{ paddingTop: "10px" }}>
              Relevant nodes in the provenance browser:
            </div>
            <ul>
              {details.provenance_links.map((e) => {
                return (
                  <li key={e.uuid}>
                    {e.label}{" "}
                    <ExploreButton
                      explore_url={EXPLORE_URLS[props.params.method]}
                      uuid={e.uuid}
                    />
                  </li>
                );
              })}
              <li style={{ marginTop: "-5px", marginBottom: "-4px" }}>
                Download structure through AiiDA
                <StructDownloadButton
                  aiida_rest_url={AIIDA_API_URLS[params.method]}
                  uuid={details.general.structure_uuid}
                />
              </li>
            </ul>
          </Col>
          <Col>
            <McInfoBox>
              <b>Calculated Properties (AiiDA)</b>
              <ul className="no-bullets">
                <li>
                  Cell volume:{" "}
                  {format_aiida_prop(
                    details.properties.cell_volume,
                    metadata.info.properties.cell_volume,
                    methodLabel,
                    2,
                  )}
                </li>
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
                <li>
                  Total energy:{" "}
                  {format_aiida_prop(
                    details.properties.total_energy,
                    metadata.info.properties.total_energy,
                    methodLabel,
                    2,
                  )}
                </li>
              </ul>
            </McInfoBox>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ProvenanceSection;
