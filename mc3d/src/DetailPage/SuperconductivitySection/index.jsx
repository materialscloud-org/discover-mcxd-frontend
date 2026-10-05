import { Container, Row, Col } from "react-bootstrap";

import { Link } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import {
  loadAiidaBands,
  loadXY,
  loadSuperConDetails,
} from "../../common/fetchingUtils";

import { normalizeBandsData, prepareSuperConBand } from "@mcxd/shared";

import { CitationBanner } from "@mcxd/shared";

import { SuperconductivityIcon } from "../../assets/sectionIcons";

import { ExploreButton } from "mc-react-library";
import { EXPLORE_URLS } from "../../common/fetchingUtils";

import SuperconInfoBox from "./InfoBoxes";
import GapFunction from "./GapFunction";
import { getA2FTraces } from "./getA2FTraces";

// import BandStructure from "../../common/BandStructure/BandStructure";
import { BandStructure } from "@mcxd/shared";
import {
  SUPERCON_BANDS_LAYOUT_CONFIG,
  SUPERCON_PHONON_A2F_LAYOUT_CONFIG,
} from "@mcxd/shared";

import { WarningBox, WarningBoxOtherMethod } from "../../common/WarningBox";

function useSuperconDetails(dataMethod, id) {
  return useQuery({
    queryKey: ["supercon", dataMethod, id],
    queryFn: () => loadSuperConDetails(dataMethod, id),
    enabled: !!dataMethod && !!id,
  });
}

function safePrepareBands(bands, fermi, configName) {
  if (!bands || typeof fermi !== "number") return null;
  return prepareSuperConBand(bands, -fermi, configName);
}

function useSuperconBands(supercon, method) {
  const queryKey = ["supercon-bands", method, supercon?.structure_uuid];
  const loaderKey = `${method}-supercon`;

  return useQuery({
    queryKey,
    enabled: Boolean(supercon && method),
    queryFn: async () => {
      const loadBands = (uuid) =>
        uuid ? loadAiidaBands(loaderKey, uuid) : null;

      const [epwBands, qeBands, phBands] = await Promise.all([
        loadBands(supercon.epw_el_band_structure_uuid),
        loadBands(supercon.qe_el_band_structure_uuid),
        loadBands(supercon.epw_ph_band_structure_uuid),
      ]);

      const electronicBands = [
        safePrepareBands(
          epwBands,
          supercon.fermi_energy_coarse,
          "electronicEPW",
        ),
        safePrepareBands(qeBands, supercon.fermi_energy_coarse, "electronicQE"),
      ].filter(Boolean);

      const phononBands = safePrepareBands(phBands, 0, "phononEPW");

      return {
        el: normalizeBandsData(electronicBands),
        ph: phononBands ? [phononBands] : [],
      };
    },
  });
}

function useSuperconGapFunc(supercon, method) {
  return useQuery({
    queryKey: ["supercon-gap", method, supercon?.aniso_gap_function_uuid],
    queryFn: () => {
      if (!supercon?.aniso_gap_function_uuid) return null;
      return loadXY(`${method}-supercon`, supercon.aniso_gap_function_uuid);
    },
    enabled: !!supercon && !!method,
  });
}

function useSuperconA2F(supercon, method) {
  return useQuery({
    queryKey: ["supercon-a2f", method, supercon?.a2f_uuid],
    queryFn: () => {
      if (!supercon?.a2f_uuid) return null;
      return loadXY(`${method}-supercon`, supercon.a2f_uuid);
    },
    enabled: !!supercon && !!method,
  });
}

// Main component
export default function SuperConductivitySection({
  params,
  loadedData,
  superconMethod,
}) {
  const { data: scDetails } = useSuperconDetails(superconMethod, params.id);

  const method = superconMethod;
  const supercon = scDetails?.supercon;

  const { data: bandsResults, isPending: bandsLoading } = useSuperconBands(
    supercon,
    method,
  ); // bands

  const { data: gapfuncData, isPending: gapfuncLoading } = useSuperconGapFunc(
    supercon,
    method,
  ); // gap

  const { data: a2fData } = useSuperconA2F(supercon, method); // a2f

  if (!supercon) return null;

  const bandsDataArray = bandsResults?.el ?? [];
  const phononBandsArray = bandsResults?.ph ?? [];

  const hasElecBands = !!bandsDataArray.length;
  const hasPhBands = !!phononBandsArray.length;

  return (
    <div id="superconductivity" data-toc-section="superconductivity">
      <Container fluid className="section-container">
        <div
          style={{
            margin: "10px 0px",
            padding: "20px 0px 10px",
            borderBottom: "1px solid #c4c4c4",
          }}
        >
          <div style={{ fontSize: "24px" }}>
            <SuperconductivityIcon size={22} className="section-heading-icon" />
            Superconductivity estimation
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "2px",
              alignItems: "center",
            }}
          >
            <CitationBanner
              citationKeys={["MBercxSupercon25"]}
              doiIndices={[0, 1]}
            />
          </div>
        </div>
        {params.method !== method && (
          <WarningBoxOtherMethod method={method} id={params.id} />
        )}
        {
          <WarningBox>
            Warning: This dataset re-relaxes (<em>PBE instead of PBEsol-v1</em>)
            the structure with a different methodology. To see this new
            structure, explore the AiiDA provenance{" "}
            <ExploreButton
              explore_url={EXPLORE_URLS["pbesol-v1-supercon"]}
              uuid={supercon.structure_uuid}
            />
          </WarningBox>
        }
        <div style={{ padding: "10px 10px", textAlign: "justify" }}>
          This dataset provides results from a high-throughput search for
          phonon-mediated superconductivity, where electron–phonon interactions
          and critical temperatures were systematically computed to identify and
          characterize promising superconducting materials. This frontend
          section contains the final superconductivity estimation results, as
          well as the intermediate electronic and vibrational calculated
          properties. For further details regarding the methodology see the{" "}
          <Link
            to="/contributions/superconductivity"
            target="_blank"
            rel="noopener noreferrer"
          >
            contributed details for this section
          </Link>
          .
        </div>

        {/* Info box and electronic bands */}
        <Row>
          {/* Looks bad on sm/md breakpoints but also md/lg breakpoints look bad too... */}
          <Col sm={12} md={6} className="mt-2 mt-md-5">
            <SuperconInfoBox params={params} superconData={supercon} />
          </Col>
          <Col sm={12} md={6} className="mt-3 mt-md-0">
            <div className="subsection-title">Electronic band structure</div>
            <div className="mb-3 ms-2">
              Calculated with Quantum ESPRESSO (QE){" "}
              {supercon.qe_el_band_structure_uuid && (
                <ExploreButton
                  explore_url={EXPLORE_URLS["pbesol-v1-supercon"]}
                  uuid={supercon.qe_el_band_structure_uuid}
                />
              )}{" "}
              and EPW{" "}
              {supercon.epw_el_band_structure_uuid && (
                <ExploreButton
                  explore_url={EXPLORE_URLS["pbesol-v1-supercon"]}
                  uuid={supercon.epw_el_band_structure_uuid}
                />
              )}
            </div>
            <BandStructure
              bandsDataArray={hasElecBands ? bandsResults.el : null}
              loading={bandsLoading}
              minYval={-10.4}
              maxYval={10.8}
              layoutOverrides={SUPERCON_BANDS_LAYOUT_CONFIG}
            />
          </Col>
        </Row>

        {/* Phonon bands and e-p interaction */}
        {supercon.epw_ph_band_structure_uuid && (
          <Row>
            <Col className="mt-4 mt-lg-0">
              <div className="subsection-title">
                Phonon bands and electron-phonon interaction
              </div>
              <div style={{ padding: "0px 10px" }}>
                Phonon band structure calculated with EPW{" "}
                {supercon.epw_ph_band_structure_uuid && (
                  <ExploreButton
                    explore_url={EXPLORE_URLS[method] + "-supercon"}
                    uuid={supercon.epw_ph_band_structure_uuid}
                  />
                )}{" "}
                Eliashberg spectral function [α²F(ω)], and electron-phonon
                coupling strength [λ(ω)]{" "}
                {supercon.a2f_uuid && (
                  <ExploreButton
                    explore_url={EXPLORE_URLS[method] + "-supercon"}
                    uuid={supercon.a2f_uuid}
                  />
                )}{" "}
              </div>

              <BandStructure
                bandsDataArray={hasPhBands ? bandsResults.ph : null}
                loading={bandsLoading}
                loadingIconScale={7}
                minYval={0}
                maxYval={supercon.highest_phonon_frequency + 4}
                dosDataArray={{
                  dosData: { x: [0], y: [0] }, // empty data to render
                  traceFormat: {
                    name: "",
                    legend: "legend2", // draw legend on axisTwo.
                    showlegend: false,
                    opacity: 0,
                  },
                }}
                layoutOverrides={SUPERCON_PHONON_A2F_LAYOUT_CONFIG}
                // draw traces on fake dos.
                customTraces={getA2FTraces({
                  a2f: a2fData?.a2f,
                  frequency: a2fData?.frequency,
                  degaussq: a2fData?.degaussq,
                  lambda: a2fData?.lambda,
                })}
              />
            </Col>
          </Row>
        )}

        {/* Anisotropic gap function. */}
        {supercon.aniso_info && (
          <Row>
            <Col style={{ maxWidth: "600px" }}>
              <div className="subsection-title">
                Anisotropic superconducting gap function{" "}
                {supercon.aniso_gap_function_uuid && (
                  <ExploreButton
                    explore_url={EXPLORE_URLS[method] + "-supercon"}
                    uuid={supercon.aniso_gap_function_uuid}
                  />
                )}{" "}
              </div>
              <GapFunction
                gapfuncData={gapfuncData}
                loading={gapfuncLoading}
                verts={supercon.aniso_info.temps}
                points={supercon.aniso_info.average_deltas}
                delta0={supercon.aniso_info.delta0}
                Tc={supercon.aniso_info.Tc}
                expo={supercon.aniso_info.expo}
                minXVal={0}
                maxXVal={null}
                minYVal={0}
                maxYVal={null}
              />
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}
