import React, { useState, useEffect } from "react";

import { ExploreButton, StructDownloadButton } from "mc-react-library";

import { Container, Row, Col } from "react-bootstrap";

import { McInfoBox } from "@mcxd/shared";

import { Link } from "react-router-dom";

import {
  BandStructure,
  COMMON_LAYOUT_CONFIG,
  standardTraceConfigs,
  topologyTraceConfigs,
} from "@mcxd/shared";
import { formatAiidaProp } from "../utils";

import { buildTraceFormat } from "@mcxd/shared";

import { HWCCPlot } from "./hwccPlot";

import {
  AIIDA_REST_API_URL,
  TOPOLOGICAL_AIIDA_REST_API_URL,
  TOPOLOGICAL_EXPLORE_URL,
  EXPLORE_URL,
  loadTopoBands,
} from "../../common/restApiUtils";

function shiftBands(bandsData, shift) {
  bandsData.paths.forEach((path) => {
    path.values.forEach((subpath) => {
      subpath.forEach((val, idx, arr) => {
        arr[idx] += shift;
      });
    });
  });
}

const WarningBox = ({ children }) => {
  return (
    <div
      className="alert alert-warning"
      style={{ margin: "10px 10px 5px 10px" }}
      role="alert"
    >
      {children}
    </div>
  );
};

const TopologySection = ({ params, loadedData }) => {
  const [bandsData, setBandsData] = useState(null);
  const [loadingBands, setLoadingBands] = useState(true);
  let details = loadedData.details;

  const topologyData = loadedData?.topologyInfo;

  useEffect(() => {
    if (
      !topologyData?.soc_bandstructure_uuid ||
      !topologyData?.nosoc_bandstructure_uuid
    ) {
      return;
    }

    const loadBands = async () => {
      setLoadingBands(true);

      try {
        const [socBands, nosocBands] = await Promise.all([
          loadTopoBands(topologyData.soc_bandstructure_uuid),
          loadTopoBands(topologyData.nosoc_bandstructure_uuid),
        ]);

        shiftBands(socBands, -topologyData.fermi_without_SOC);
        shiftBands(nosocBands, -topologyData.fermi_without_SOC);

        const finalBands = [
          {
            bandsData: socBands,
            traceFormat: buildTraceFormat(topologyTraceConfigs.soc),
          },
          {
            bandsData: nosocBands,
            traceFormat: buildTraceFormat(topologyTraceConfigs.nosoc),
          },
        ];

        setBandsData(finalBands);
      } catch (err) {
        console.error("Failed to load topology bands:", err);
      } finally {
        setLoadingBands(false);
      }
    };

    loadBands();
  }, [
    topologyData?.soc_bandstructure_uuid,
    topologyData?.nosoc_bandstructure_uuid,
  ]);

  return (
    <div>
      <div className="section-heading">Topological Insulators</div>

      <Container fluid className="section-container">
        <Row>
          <Col className="flex-column">
            <WarningBox>
              Warning: This dataset re-relaxes the structure with a different
              methodology. To see this new structure, explore the AiiDA
              provenance{" "}
              <ExploreButton
                explore_url={TOPOLOGICAL_EXPLORE_URL}
                uuid={topologyData.structure_uuid}
              />
            </WarningBox>
            <div style={{ padding: "10px 10px", textAlign: "justify" }}>
              This dataset provides results from a high-throughput search for
              topological insulating two-dimensional materials.. This requires
              high-accuracy Spin-orbit coupling DFT calculations. This frontend
              section contains the final band structure and the corrosponding
              calculated band gaps. For further details regarding the
              methodology see the{" "}
              <Link
                to="/contributions"
                target="_blank"
                rel="noopener noreferrer"
              >
                extended dataset documentation
              </Link>
              .
            </div>
          </Col>
          <Row>
            <Col className="flex-column">
              <div className="subsection-title">
                Spin orbit and no Spin-orbit band structure
              </div>
              <BandStructure
                bandsDataArray={bandsData}
                loading={loadingBands}
                minYval={-1.5}
                maxYval={1.5}
                layoutOverrides={{
                  ...COMMON_LAYOUT_CONFIG,
                }}
              />
            </Col>
            <Col className="flex-column">
              <div className="subsection-title">HWCC tracking plot</div>
              <HWCCPlot hwcc={loadedData?.topologyInfo.hwcc} />
            </Col>
          </Row>
        </Row>
      </Container>
    </div>
  );
};

export default TopologySection;
