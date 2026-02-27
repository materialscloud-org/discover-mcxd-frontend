import React, { useState, useEffect, useRef } from "react";

import { ExploreButton, StructDownloadButton } from "mc-react-library";

import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";

import { FaExclamationCircle } from "react-icons/fa";

import { McInfoBox } from "@mcxd/shared";

import { Link } from "react-router-dom";

import {
  BandStructure,
  COMMON_LAYOUT_CONFIG,
  standardTraceConfigs,
  topologyTraceConfigs,
} from "@mcxd/shared";

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

const WarningLabel = ({ warning }) => {
  const renderTooltip = (props) => (
    <Tooltip id="warning-tooltip" {...props}>
      {warning}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="top"
      overlay={renderTooltip}
      delay={{ show: 200, hide: 200 }}
    >
      <span
        style={{
          cursor: "help",
          color: "grey",
          verticalAlign: "top",
        }}
      >
        <FaExclamationCircle
          size="1.25em"
          style={{ marginBottom: "2px" }}
        />{" "}
      </span>
    </OverlayTrigger>
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

  console.log(topologyData);

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
              section contains the final band structure and the corresponding
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
                maxYval={1.57}
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
                    <li>{`Topological inversion strength (with spin-orbit couping): ${loadedData?.topologyInfo.inversion_strength} meV `}</li>
                  )}
                  <li>
                    {`Band gap (with spin-orbit couping): ${loadedData?.topologyInfo.soc_band_gap} meV `}{" "}
                    {loadedData?.topologyInfo?.strain_percent && (
                      <WarningLabel
                        warning={`This band gap is for ${loadedData.topologyInfo.strain_percent}% strain but the band structure shown is unstrained.`}
                      />
                    )}
                  </li>
                  {/* custom string for Pt material? */}
                  {/* <li
                    style={{
                      fontSize: "13px",
                      paddingTop: "4px",
                      fontStyle: "italic",
                    }}
                  >
                    {params?.id === "mc2d-400" &&
                      "Note: A Pd analog of this structure was also calculated. See the publication for more information"}
                  </li> */}
                </ul>
              </McInfoBox>

              {loadedData?.topologyInfo?.hwcc &&
                Object.keys(loadedData.topologyInfo.hwcc).length > 0 && (
                  <>
                    {" "}
                    <div className="subsection-title mt-2">
                      Hybrid Wannier charge center (HWCC) tracking plot
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
