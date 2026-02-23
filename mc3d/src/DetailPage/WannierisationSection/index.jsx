import { useState, useEffect } from "react";
import {
  ExploreButton,
  StructDownloadButton,
  McloudSpinner,
} from "mc-react-library";

import { Container, Row, Col } from "react-bootstrap";

import { WarningBoxOtherMethod } from "../../common/WarningBox";
import { EXPLORE_URLS, loadWannier } from "../../common/MCrestApiUtils";
import { loadAiidaBands } from "../../common/aiidaRestApiUtils";

import { BandStructure, COMMON_LAYOUT_CONFIG } from "@mcxd/shared";
import {
  SUPERCON_BANDS_LAYOUT_CONFIG,
  SUPERCON_PHONON_A2F_LAYOUT_CONFIG,
} from "@mcxd/shared";

import { wannierTraceConfigs } from "@mcxd/shared";
import { buildTraceFormat } from "@mcxd/shared";

const EXPLORE_URL = EXPLORE_URLS["pbesol-v1-wannierisation"];

// we do some hardcoding here while its a demo; TODO - cleanup
// TODO - this fully rerenders when switching methodology (this is a free place for performance gains)
// Perhaps switching page structure is a nice way to avoid this.

const S3_ROOT_URL =
  "https://rgw.cscs.ch/matcloud:mc-discover-mcxd-public/mc3d/pbesol-v1_wannierisation/dev";

const wannierMethod = "pbesol-v1";

const aiidaProfile = "pbesol-v1-wannierisation";

const WannierisationSection = ({ params, loadedData }) => {
  const { id, method } = params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [wannierData, setWannierData] = useState(null);
  const [bandsData, setBandsData] = useState([]);

  console.log("wannier", params);
  console.log("lD", loadedData);

  // Fetch wannier data
  useEffect(() => {
    if (!id || !method) return;

    const fetchWannier = async () => {
      setLoading(true);

      try {
        // 1. Load base DHVA metadata
        const baseData = await loadWannier("pbesol-v1", id);

        setWannierData(baseData);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch DHVA data");
      } finally {
        setLoading(false);
      }
    };

    fetchWannier();
  }, [id, method]);

  // fetch bands
  useEffect(() => {
    if (!wannierData) return;

    const fetchBands = async () => {
      try {
        setLoading(true);

        const bandUuids = [
          wannierData?.pw_band_uuid,
          wannierData?.w90_band_uuid,
        ].filter(Boolean);

        if (!bandUuids.length) return;

        const results = await Promise.all(
          bandUuids.map((uuid) => loadAiidaBands(aiidaProfile, uuid)),
        );

        const finalBands = results.map((bands, index) => {
          const config =
            index === 0 ? wannierTraceConfigs.pw : wannierTraceConfigs.w90;

          return {
            bandsData: bands,
            traceFormat: buildTraceFormat(config),
          };
        });

        setBandsData(finalBands);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch band data");
      } finally {
        setLoading(false);
      }
    };

    fetchBands();
  }, [wannierData]);

  console.log(wannierData);

  if (loading)
    return (
      <>
        <div className="section-heading">Wannierisation</div>

        <Row>
          <div style={{ width: "150px", padding: "40px", margin: "0 auto" }}>
            <McloudSpinner />
          </div>
        </Row>
      </>
    );
  if (error) return <></>;

  console.log("bandsData", bandsData);

  return (
    <div>
      <div className="section-heading">Wannierisation</div>

      {method !== wannierMethod && (
        <WarningBoxOtherMethod method={wannierMethod} id={id} />
      )}

      <Container fluid className="section-container">
        <Row>
          <Col sm={12} md={6} className="mt-3 mt-md-0">
            <div className="subsection-title">Electronic band structure</div>
            <div className="mb-3 ms-2">
              Calculated with PW (QE){" "}
              {wannierData?.pw_band_uuid && (
                <ExploreButton
                  explore_url={EXPLORE_URLS["pbesol-v1-wannierisation"]}
                  uuid={wannierData?.pw_band_uuid}
                />
              )}{" "}
              and W90{" "}
              {wannierData?.w90_band_uuid && (
                <ExploreButton
                  explore_url={EXPLORE_URLS["pbesol-v1-wannierisation"]}
                  uuid={wannierData.w90_band_uuid}
                />
              )}
            </div>
            <BandStructure
              bandsDataArray={bandsData}
              minYval={-15.4}
              maxYval={15.8}
              layoutOverrides={COMMON_LAYOUT_CONFIG}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default WannierisationSection;
