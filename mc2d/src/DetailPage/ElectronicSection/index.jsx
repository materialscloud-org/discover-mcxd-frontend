import React, { useState, useEffect } from "react";

import { McloudSpinner } from "mc-react-library";

import { MCInfoBox } from "../components/MCInfoBox";

import { Container, Row, Col } from "react-bootstrap";

import BandsVisualizer from "mc-react-bands";

import { ExploreButton } from "mc-react-library";

import { loadAiidaBands } from "../../common/restApiUtils";

import { AIIDA_REST_API_URL, EXPLORE_URL } from "../../common/restApiUtils";

import * as math from "mathjs";

import { formatAiidaProp } from "../utils";

function shiftBands(bandsData, shift) {
  bandsData.paths.forEach((path) => {
    path.values.forEach((subpath) => {
      subpath.forEach((val, idx, arr) => {
        arr[idx] += shift;
      });
    });
  });
}

function ElectronicInfoBox({ electronicData, metadata }) {
  let magStateStr = electronicData.magnetic_state;
  if (magStateStr == null) {
    magStateStr = "non-magnetic calculation;  magnetic state untested";
  }

  return (
    <MCInfoBox style={{ height: "200px" }}>
      <div>
        <b>General info</b>
        <ul className="no-bullets">
          <li>Band gap: {formatAiidaProp(electronicData.band_gap, "eV")}</li>
          <li>Magnetic state: {magStateStr}</li>
          <li>
            Total magnetization:{" "}
            {formatAiidaProp(electronicData.total_magnetization, "µB/cell", 2)}
          </li>
          <li>
            Absolute magnetization:{" "}
            {formatAiidaProp(
              electronicData.absolute_magnetization,
              "µB/cell",
              2,
            )}
          </li>
        </ul>
      </div>
    </MCInfoBox>
  );
}

const ElectronicSection = (props) => {
  const [bandsData, setBandsData] = useState(null);
  const [loadingBands, setLoadingBands] = useState(true);

  let electronicData = props.loadedData.details.electronic;
  console.log("electronicData", electronicData);

  // check if we can display bands
  let bandsAvailable = true;
  if (
    electronicData.bands_uuid == null ||
    electronicData.fermi_energy.value == null ||
    electronicData.band_gap.value == null
  ) {
    bandsAvailable = false;
  }

  let bandShift = 0.0;
  if (bandsAvailable) {
    // Shifting the bands such that Fermi energy is 0:
    // It looks like the fermi energy currently gives us the top of the conduction band
    // instead of the middle of the band gap. Therefore, shift additionally by half the gap.
    // Note: for spin-polarized calculations, there are 2 Fermi energies. Taking the maximum
    // here seems to work best to align 0 to the middle of the gap (although not stricly correct).
    bandShift = -math.max(electronicData.fermi_energy.value);
    bandShift -= electronicData.band_gap.value / 2;
  }

  useEffect(() => {
    setBandsData(null);
    if (bandsAvailable) {
      loadAiidaBands(electronicData.bands_uuid).then((bands) => {
        shiftBands(bands, bandShift);
        setBandsData(bands);
        setLoadingBands(false);
      });
    } else {
      setLoadingBands(false);
    }
  }, []);

  let bandsJsx = "";
  if (!bandsAvailable) {
    bandsJsx = (
      <span>Electronic bands are not available for this material.</span>
    );
  } else if (loadingBands) {
    bandsJsx = (
      <div style={{ width: "150px", padding: "40px", margin: "0 auto" }}>
        <McloudSpinner />
      </div>
    );
  } else {
    bandsJsx = (
      <>
        <div className="subsection-title">
          Electronic band structure{" "}
          <ExploreButton
            explore_url={EXPLORE_URL}
            uuid={electronicData.bands_uuid}
          />
        </div>
        <BandsVisualizer
          bandsDataList={[bandsData]}
          energyRange={[-6.0, 6.0]}
          bandsColorInfo={["#3560A0", "red"]}
          formatSettings={{
            bandsYlabel: "Electronic bands (eV)",
          }}
        />
      </>
    );
  }

  return (
    <div>
      <div className="section-heading">Electronic properties</div>
      <Container fluid className="section-container">
        <Row>
          <Col className="flex-column">{bandsJsx}</Col>
          <Col className="flex-column">
            <div style={{ marginTop: "35px" }}>
              <ElectronicInfoBox
                electronicData={electronicData}
                metadata={props.loadedData.metadata}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ElectronicSection;
