import "./index.css";

import { ExploreButton } from "mc-react-library";

import { EXPLORE_URLS } from "../../common/fetchingUtils";

import { Container, Row, Col } from "react-bootstrap";
import { McInfoBox } from "@mcxd/shared";

import { format_aiida_prop } from "../../common/utils";

import { StructDownloadButton } from "mc-react-library";

import { AIIDA_API_URLS } from "../../common/fetchingUtils";

export default function ProvenanceSection({ loadedData, params }) {
  let details = loadedData.details;

  let metadata = loadedData.metadata;
  let methodLabel = params.method;
  console.log("d", { loadedData, params });
  return (
    <div>
      <div className="section-heading">Calculation information</div>
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
                      explore_url={EXPLORE_URLS[params.method]}
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
              <b>Calculated properties</b>
              <ul className="no-bullets">
                <li>
                  Cell volume (after relaxation):{" "}
                  {format_aiida_prop(
                    details.properties.cell_volume,
                    metadata.info.properties.cell_volume,
                    methodLabel,
                    2,
                  )}
                </li>
                <li>
                  Atoms per cell:{" "}
                  {loadedData?.structureInfo?.aiidaAttributes?.sites?.length
                    ? `${loadedData?.structureInfo?.aiidaAttributes?.sites.length}`
                    : "—"}
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
