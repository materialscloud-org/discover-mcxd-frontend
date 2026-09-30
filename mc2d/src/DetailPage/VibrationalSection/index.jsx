import React from "react";
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

import { useQuery } from "@tanstack/react-query";

import { buildTraceFormat } from "@mcxd/shared";

import { VibrationalIcon } from "../../assets/sectionIcons";

const phononTraceConfig = {
  label: "Phonons",
  units: "THz",
  trace: {
    mode: "lines",
    line: {
      color: "#6baed6",
      dash: "solid",
      width: 2.25,
      opacity: 0.95,
    },
  },
};

const VibrationalSection = (props) => {
  const vibrationalData = props.loadedData.details.vibrational;
  const bandsUuid = vibrationalData.phonon_bands_uuid;

  const { data: bandsData, isPending: bandsPending } = useQuery({
    queryKey: ["vibrational-bands", bandsUuid],
    queryFn: () => loadAiidaBands(bandsUuid),
    enabled: !!bandsUuid,
  });

  // disabled queries stay pending: only load when bands are expected
  const loadingBands = !!bandsUuid && bandsPending;

  const { data: phononVisData } = useQuery({
    queryKey: ["phonon-vis", props.params.id],
    queryFn: () => loadPhononVis(props.params.id),
    enabled: !!props.params.id,
  });

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
    <div id="vibrational" data-toc-section="vibrational">
      <div className="section-heading">
        <VibrationalIcon size={22} className="section-heading-icon" />
        Vibrational properties
      </div>
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
                bandsDataArray={{
                  ...bandsData,
                  traceFormat: buildTraceFormat(phononTraceConfig),
                }}
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
