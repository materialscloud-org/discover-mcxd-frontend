import React, { useState, useEffect } from "react";
import { McloudSpinner, ExploreButton } from "mc-react-library";
import { Container, Row, Col } from "react-bootstrap";
import PhononVisualizer from "mc-react-phonon-visualizer";

import {
  BandStructure,
  COMMON_LAYOUT_CONFIG,
  SUPERCON_BANDS_LAYOUT_CONFIG,
} from "@mcxd/shared";
import {
  loadAiidaBands,
  loadPhononVis,
  EXPLORE_URL,
} from "../../common/restApiUtils";

const VibrationalSection = (props) => {
  const [bandsData, setBandsData] = useState(null);
  const [loadingBands, setLoadingBands] = useState(true);
  const [phononVisData, setPhononVisData] = useState(null);

  const vibrationalData = props.loadedData.details.vibrational;
  const bandsUuid = vibrationalData.phonon_bands_uuid;

  useEffect(() => {
    if (bandsUuid) {
      setLoadingBands(true);
      loadAiidaBands(bandsUuid).then((bands) => {
        setBandsData(bands);
        setLoadingBands(false);
      });
    } else {
      setLoadingBands(false);
    }

    loadPhononVis(props.params.id).then((data) => {
      setPhononVisData(data);
    });
  }, [bandsUuid, props.params.id]);

  // Handle Phonon Visualizer JSX
  const phononVisJsx = phononVisData && (
    <div>
      <div style={{ margin: "30px 0px 5px 12px" }}>
        <div className="subsection-title">
          Interactive phonon visualizer{" "}
          <ExploreButton explore_url={EXPLORE_URL} uuid={bandsUuid} />
        </div>
      </div>
      <PhononVisualizer
        props={{ title: "Phonon visualizer", ...phononVisData }}
      />
    </div>
  );

  return (
    <div>
      <div className="section-heading">Vibrational properties</div>
      <Container fluid className="section-container">
        {loadingBands ? (
          <div style={{ width: "150px", padding: "40px", margin: "0 auto" }}>
            <McloudSpinner />
          </div>
        ) : !bandsData ? (
          <span>Vibrational properties not available for this structure.</span>
        ) : (
          <Row>
            <Col className="flex-column" sm={6}>
              <div className="subsection-title">
                Phonon band structure{" "}
                <ExploreButton explore_url={EXPLORE_URL} uuid={bandsUuid} />
              </div>
              <BandStructure
                bandsDataArray={[
                  {
                    bandsData: bandsData,
                    traceFormat: {
                      hovertemplate: "Energy: %{y:.4f} Thz<extra></extra>",
                    },
                  },
                ]}
                loading={loadingBands}
                minYval={0}
                layoutOverrides={{
                  ...COMMON_LAYOUT_CONFIG,
                  yaxis: {
                    ...COMMON_LAYOUT_CONFIG?.yaxis,
                    title: {
                      ...COMMON_LAYOUT_CONFIG?.yaxis?.title,
                      text: "Energy [THz]",
                    },
                  },
                  showlegend: false,
                }}
              />
            </Col>
          </Row>
        )}
      </Container>
      {phononVisJsx}
    </div>
  );
};

export default VibrationalSection;
