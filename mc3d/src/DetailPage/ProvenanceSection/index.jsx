import "./index.css";

import { ExploreButton } from "mc-react-library";

import { EXPLORE_URLS } from "../../common/fetchingUtils";

import { Container, Row } from "react-bootstrap";

export default function ProvenanceSection({ loadedData, params }) {
  let details = loadedData.details;

  return (
    <div>
      <div className="section-heading">Provenance links</div>
      <Container fluid className="section-container">
        <Row>
          <div className="provenance-section">
            <div>Relevant nodes in the provenance browser:</div>
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
            </ul>
          </div>
        </Row>
      </Container>
    </div>
  );
}
