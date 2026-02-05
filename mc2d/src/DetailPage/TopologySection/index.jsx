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

import { CitationBanner } from "@mcxd/shared";

import { buildTraceFormat } from "@mcxd/shared";

import { HWCCPlot } from "./hwccPlot";

import {
  TOPOLOGICAL_EXPLORE_URL,
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

        shiftBands(socBands, -topologyData.fermi_with_SOC);
        shiftBands(nosocBands, -topologyData.fermi_without_SOC);

        const finalBands = [
          {
            bandsData: nosocBands,
            traceFormat: buildTraceFormat(topologyTraceConfigs.nosoc),
          },
          {
            bandsData: socBands,
            traceFormat: buildTraceFormat(topologyTraceConfigs.soc),
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
      <Container fluid className="section-container">
        <div
          style={{
            margin: "10px 0px",
            padding: "20px 0px 10px",
            borderBottom: "1px solid #c4c4c4",
          }}
        >
          <div style={{ fontSize: "24px" }}>Topological insulators</div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "2px",
              alignItems: "center",
            }}
          >
            <CitationBanner
              citationKeys={["Marrazzo2019", "Grassano2023"]}
              doiIndices={[0, 1]}
            />
          </div>
        </div>
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
              topological insulating two-dimensional materials. This requires
              high-accuracy spin-orbit coupling DFT calculations. This frontend
              section contains the final band structure and the corrosponding
              calculated band gaps. For further details regarding the
              methodology see the{" "}
              <Link
                to="/contributions/topology"
                target="_blank"
                rel="noopener noreferrer"
              >
                contributed details for this section
              </Link>
              .
            </div>
          </Col>
          <Row>
            <Col md={6}>
              <div className="subsection-title">Electronic band structure</div>
              <div className="mb-3 ms-2">
                Calculated with spin-orbit coupling{" "}
                {topologyData.soc_bandstructure_uuid && (
                  <ExploreButton
                    explore_url={TOPOLOGICAL_EXPLORE_URL}
                    uuid={topologyData.soc_bandstructure_uuid}
                  />
                )}{" "}
                and without{" "}
                {topologyData.nosoc_bandstructure_uuid && (
                  <ExploreButton
                    explore_url={TOPOLOGICAL_EXPLORE_URL}
                    uuid={topologyData.nosoc_bandstructure_uuid}
                  />
                )}
              </div>
              <BandStructure
                bandsDataArray={bandsData}
                loading={loadingBands}
                minYval={-1.55}
                maxYval={1.55}
                layoutOverrides={{
                  ...COMMON_LAYOUT_CONFIG,
                }}
              />
            </Col>
            <Col md={6}>
              <div className="subsection-title">Topological information</div>
              <McInfoBox title="General">
                <ul className="no-bullets">
                  {loadedData?.topologyInfo?.inversion_strength && (
                    <li>{`Topological inversion strength: ${loadedData?.topologyInfo.inversion_strength} meV `}</li>
                  )}
                  <li>{`spin-orbit coupling band gap: ${loadedData?.topologyInfo.soc_band_gap} meV `}</li>
                </ul>
              </McInfoBox>

              {loadedData?.topologyInfo?.hwcc &&
                Object.keys(loadedData.topologyInfo.hwcc).length > 0 && (
                  <>
                    {" "}
                    <div className="subsection-title mt-2">
                      HWCC tracking plot
                    </div>
                    <HWCCPlot hwcc={loadedData.topologyInfo.hwcc} />
                  </>
                )}
            </Col>
          </Row>
        </Row>
      </Container>
    </div>
  );
};

export default TopologySection;
