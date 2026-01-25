import React, { useState, useEffect } from "react";

import { McloudSpinner, ExploreButton } from "mc-react-library";

import { McInfoBox } from "@mcxd/shared";

import { Container, Row, Col } from "react-bootstrap";

import BandsVisualizer from "mc-react-bands";

import { loadAiidaBands } from "../../common/restApiUtils";

import { AIIDA_REST_API_URL, EXPLORE_URL } from "../../common/restApiUtils";

import * as math from "mathjs";

import { BandStructure, COMMON_LAYOUT_CONFIG } from "@mcxd/shared";
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
    <McInfoBox style={{ height: "200px" }}>
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
    </McInfoBox>
  );
}

const ElectronicSection = (props) => {
  const [bandsData, setBandsData] = useState(null);
  const [loadingBands, setLoadingBands] = useState(true);

  const electronicData = props.loadedData.details.electronic;

  const bandsAvailable = !!(
    electronicData.bands_uuid &&
    electronicData.fermi_energy.value != null &&
    electronicData.band_gap.value != null
  );

  useEffect(() => {
    if (bandsAvailable) {
      setLoadingBands(true);
      loadAiidaBands(electronicData.bands_uuid).then((bands) => {
        // Calculate shift
        let bandShift = -math.max(electronicData.fermi_energy.value);
        bandShift -= electronicData.band_gap.value / 2;

        shiftBands(bands, bandShift);
        setBandsData(bands);
        setLoadingBands(false);
      });
    } else {
      setLoadingBands(false);
    }
  }, [electronicData.bands_uuid]);

  return (
    <div>
      <div className="section-heading">Electronic properties</div>
      <Container fluid className="section-container">
        <Row>
          <Col className="flex-column" sm={12} md={6}>
            {!bandsAvailable ? (
              <span>Electronic bands are not available for this material.</span>
            ) : (
              <>
                <div className="subsection-title">
                  Electronic band structure{" "}
                  <ExploreButton
                    explore_url={EXPLORE_URL}
                    uuid={electronicData.bands_uuid}
                  />
                </div>
                <BandStructure
                  bandsDataArray={
                    bandsData
                      ? [
                          {
                            bandsData: bandsData,
                            traceFormat: {
                              hovertemplate:
                                "Energy: %{y:.4f} eV<extra></extra>",
                            },
                          },
                        ]
                      : null
                  }
                  loading={loadingBands}
                  minYval={-6.0}
                  maxYval={6.0}
                  layoutOverrides={{
                    ...COMMON_LAYOUT_CONFIG,
                    showlegend: false,
                  }}
                />
              </>
            )}
          </Col>
          <Col className="flex-column" sm={12} md={6}>
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
