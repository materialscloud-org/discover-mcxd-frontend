import React, { useState, useEffect } from "react";

import { McloudSpinner } from "mc-react-library";

import { MCInfoBox } from "../components/MCInfoBox";

import { Container, Row, Col } from "react-bootstrap";

import BandsVisualizer from "mc-react-bands";

import { ExploreButton } from "mc-react-library";

import { loadAiidaBands, loadPhononVis } from "../../common/restApiUtils";

import { AIIDA_REST_API_URL, EXPLORE_URL } from "../../common/restApiUtils";

import PhononVisualizer from "mc-react-phonon-visualizer";

const VibrationalSection = (props) => {
  const [bandsData, setBandsData] = useState(null);
  const [loadingBands, setLoadingBands] = useState(true);
  const [phononVisData, setPhononVisData] = useState(null);

  let vibrationalData = props.loadedData.details.vibrational;
  console.log("vibrationalData", vibrationalData);

  let bandsUuid = vibrationalData.phonon_bands_uuid;

  useEffect(() => {
    setBandsData(null);
    if (bandsUuid) {
      loadAiidaBands(bandsUuid).then((bands) => {
        setBandsData(bands);
        setLoadingBands(false);
      });
    } else {
      setLoadingBands(false);
    }

    loadPhononVis(props.params.id).then((data) => {
      setPhononVisData(data);
      console.log("Phonon visualizer data", data);
    });
  }, []);

  let bandsAvailable = bandsData != null;
  let bandsJsx = "";
  if (bandsAvailable) {
    bandsJsx = (
      <Row>
        <Col className="flex-column">
          <div className="subsection-title">
            Phonon band structure{" "}
            <ExploreButton explore_url={EXPLORE_URL} uuid={bandsUuid} />
          </div>
          <BandsVisualizer
            bandsDataList={[bandsData]}
            // energyRange={[-5.0, 5.0]}
            bandsColorInfo={["#3560A0"]}
            formatSettings={{
              bandsYlabel: "Phonon bands (THz)",
            }}
          />
        </Col>
        <Col className="flex-column"></Col>
      </Row>
    );
  }

  let phononVisAvailable = phononVisData != null;
  let phononVisJsx = "";
  if (phononVisAvailable) {
    // NOTE: The PhononVisualizer plotly clicking doesn't seem to work
    // inside bootstrap <Container>! Keep it outside.
    phononVisJsx = (
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
  }

  return (
    <div>
      <div className="section-heading">Vibrational properties</div>
      <Container fluid className="section-container">
        {loadingBands ? (
          <div style={{ width: "150px", padding: "40px", margin: "0 auto" }}>
            <McloudSpinner />
          </div>
        ) : !bandsAvailable ? (
          <span>Vibrational properties not available for this structure.</span>
        ) : (
          <>{bandsJsx}</>
        )}
      </Container>
      {phononVisJsx}
    </div>
  );
};

export default VibrationalSection;
