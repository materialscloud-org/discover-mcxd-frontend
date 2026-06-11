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

import { wannierTraceConfigs } from "@mcxd/shared";
import { buildTraceFormat } from "@mcxd/shared";

import { McTable } from "@mcxd/shared";

import { Button } from "react-bootstrap";

import JSZip from "jszip";
import { saveAs } from "file-saver";

const EXPLORE_URL = EXPLORE_URLS["pbesol-v1-wannierisation"];

// we do some hardcoding here while its a demo; TODO - cleanup
// TODO - this fully rerenders when switching methodology (this is a free place for performance gains)
// Perhaps switching page structure is a nice way to avoid this.

const S3_ROOT_URL =
  "https://rgw.cscs.ch/matcloud:mc-discover-mcxd-public/mc3d/pbesol-v1_wannierisation/dev";

const wannierMethod = "pbesol-v1";

const aiidaProfile = "pbesol-v1-wannierisation";

const downloadCube = (id, index) => {
  const url = `${S3_ROOT_URL}/${id}/aiida_${String(index).padStart(5, "0")}.cube.br`;
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `aiida_${String(index).padStart(5, "0")}.cube`; // guaranteed
      a.click();
      URL.revokeObjectURL(a.href);
    })
    .catch(console.error);
};

function shiftBands(bandsData, shift) {
  bandsData.paths.forEach((path) => {
    path.values.forEach((subpath) => {
      subpath.forEach((val, idx, arr) => {
        arr[idx] += shift;
      });
    });
  });
}

async function downloadAllCubesZip(id, wannierData) {
  try {
    const wfArray = wannierData?.wf_info?.wf_array || [];

    if (!wfArray.length) return;

    const zip = new JSZip();

    await Promise.all(
      wfArray.map(async function ({ index }) {
        const filename = `aiida_${String(index).padStart(5, "0")}.cube`;

        const url = `${S3_ROOT_URL}/${id}/${filename}.br`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch ${filename}`);
        }

        const blob = await response.blob();

        zip.file(filename, blob);
      }),
    );

    const zipBlob = await zip.generateAsync({
      type: "blob",
    });

    saveAs(zipBlob, `wannier_cubes_${id}.zip`);
  } catch (err) {
    console.error("Failed to create ZIP:", err);
  }
}

async function downloadAllDatFiles(id) {
  try {
    const files = ["aiida_tb.dat", "aiida_wsvec.dat"];

    const zip = new JSZip();

    await Promise.all(
      files.map(async (filename) => {
        const url = `${S3_ROOT_URL}/${id}/${filename}.br`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch ${filename}`);
        }

        const blob = await response.blob();

        zip.file(filename, blob);
      }),
    );

    const zipBlob = await zip.generateAsync({
      type: "blob",
    });

    saveAs(zipBlob, `wannier_dat_${id}.zip`);
  } catch (err) {
    console.error("Failed to create DAT ZIP:", err);
  }
}

const WannierisationSection = ({ params, loadedData }) => {
  const { id, method } = params;
  const [wanLoading, setWanLoading] = useState(false);
  const [bandsLoading, setBandsLoading] = useState(false);

  const [error, setError] = useState(false);
  const [wannierData, setWannierData] = useState(null);
  const [bandsData, setBandsData] = useState([]);

  console.log("lD", loadedData);

  // Fetch wannier data
  useEffect(() => {
    if (!id || !method) return;

    const fetchWannier = async () => {
      setWanLoading(true);

      try {
        // 1. Load base DHVA metadata
        const baseData = await loadWannier("pbesol-v1", id);

        setWannierData(baseData);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch DHVA data");
      } finally {
        setWanLoading(false);
      }
    };

    fetchWannier();
  }, [id, method]);

  // fetch bands
  useEffect(() => {
    if (!wannierData) return;

    const fetchBands = async () => {
      try {
        setBandsLoading(true);

        const bandUuids = [
          wannierData?.pw_band_uuid,
          wannierData?.w90_band_uuid,
        ].filter(Boolean);

        if (!bandUuids.length) return;

        const results = await Promise.all(
          bandUuids.map((uuid) => loadAiidaBands(aiidaProfile, uuid)),
        );

        // shift by fermi
        const fermiEnergy = wannierData.fermi_energy;
        results.forEach((r) => shiftBands(r, -fermiEnergy));

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
        setBandsLoading(false);
      }
    };

    fetchBands();
  }, [wannierData]);

  if (bandsLoading || wanLoading)
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
  if (error || wannierData === null) return <></>;

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
              Comparison between Quantum ESPRESSO (QE){" "}
              {wannierData?.pw_band_uuid && (
                {/* <ExploreButton
                  explore_url={EXPLORE_URL}
                  uuid={wannierData?.pw_band_uuid}
                /> */}
              )}{" "}
              and Wannier90 (W90){" "}
              {wannierData?.w90_band_uuid && (
                {/* <ExploreButton
                  explore_url={EXPLORE_URL}
                  uuid={wannierData.w90_band_uuid}
                /> */}
              )}
              interpolated bands. E<sub>F</sub> is the QE SCF Fermi energy.
            </div>
            <BandStructure
              bandsDataArray={bandsData}
              minYval={-15.4}
              maxYval={15.8}
              layoutOverrides={{
                ...COMMON_LAYOUT_CONFIG,
                yaxis: {
                  ...COMMON_LAYOUT_CONFIG.yaxis,
                  title: {
                    ...COMMON_LAYOUT_CONFIG.yaxis?.title,
                    text: "E - E<sub>F</sub> [eV]",
                  },
                },
              }}
            />
          </Col>
          <Col>
            <div className="subsection-title">Wannierisation Information</div>
            <div className="mb-3 ms-2">
              The table below provides information regarding the Wannier
              centers.
              <McTable
                style={{ maxHeight: "425px" }}
                dontFormatCols={[0]}
                headerRow={[
                  "Index",
                  "x [Å]",
                  "y [Å]",
                  "z [Å]",
                  "Spread [Å²]",
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => downloadAllCubesZip(params.id, wannierData)}
                  >
                    <span className="bi bi-download me-2" />
                    All
                  </Button>,
                ]}
                contents={(wannierData?.wf_info?.wf_array || []).map((v) => [
                  v.index,
                  v.center?.[0],
                  v.center?.[1],
                  v.center?.[2],
                  v.spread,
                  <Button
                    size="sm"
                    onClick={() => downloadCube(params.id, v.index)}
                  >
                    <span className="bi bi-download" />
                  </Button>,
                ])}
              />
              <div className="pt-3 ms-2">
                Download a zip of the Hamiltonians{" "}
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => downloadAllDatFiles(params.id, wannierData)}
                >
                  <span className="bi bi-download" />
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default WannierisationSection;
