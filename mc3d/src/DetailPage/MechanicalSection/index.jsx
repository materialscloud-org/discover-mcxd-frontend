import { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { CitationBanner, McInfoBox } from "@mcxd/shared";
import { EXPLORE_URLS, loadAiidaAttributes } from "../../common/fetchingUtils";
import { ExploreButton } from "mc-react-library";

import MECHANICAL_PROPERTY_META from "./metadata";
import ElasticConstantsMatrix from "./ElasticConstantsMatrix";
import VickersHardnessTable from "./VickersHardnessTable";
import { Link } from "react-router-dom";
import { WarningBoxOtherMethod } from "../../common/WarningBox";

import { MechanicalMethodButton } from "./InfoPopover";

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function getObjectKeys(value) {
  return isObject(value) ? Object.keys(value) : [];
}

function getPropertyMeta(key) {
  return MECHANICAL_PROPERTY_META[key] ?? null;
}

function formatValue(value, key) {
  if (value == null) {
    return "—";
  }

  const meta = getPropertyMeta(key);

  if (typeof value === "number") {
    const formatted = value.toFixed(meta?.decimals ?? 3);
    return meta?.unit ? `${formatted} ${meta.unit}` : formatted;
  }

  return String(value);
}

function formatPropertyLabel(key) {
  if (key === "c") {
    return "c ratio";
  }

  return getPropertyMeta(key)?.name ?? key;
}

function PropertyList({ data }) {
  return (
    <div>
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="mb-2 d-flex align-items-baseline">
          <span className="me-2">
            {getPropertyMeta(key)?.symbol && (
              <>
                <i>{getPropertyMeta(key).symbol}</i> ·{" "}
              </>
            )}
            {formatPropertyLabel(key)}:{" "}
          </span>
          <span>{formatValue(value, key)}</span>
        </div>
      ))}
    </div>
  );
}

function Selector({ label, value, options, onChange }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>

      <Form.Select value={value ?? ""} onChange={onChange}>
        {options.map((option) => {
          const label = option.split("_")[0];
          const capitalized = label.charAt(0).toUpperCase() + label.slice(1);

          return (
            <option key={option} value={option}>
              {capitalized}
            </option>
          );
        })}
      </Form.Select>
    </Form.Group>
  );
}

export default function MechanicalSection({
  params,
  loadedData,
  mechanicalData,
}) {
  const elastic = mechanicalData?.mechDetails?.elastic;
  const method = mechanicalData?.method;

  const [subMethod, setSubmethod] = useState(null);
  const [pseudopotential, setPseudopotential] = useState(null);
  const [intermediateSelections, setIntermediateSelections] = useState({});
  const [average, setAverage] = useState(null);

  const [scfParamsData, setScfParamsData] = useState(null);
  const [scfKpointsData, setScfKpointsData] = useState(null);
  const [scfQpointsData, setScfQpointsData] = useState(null);
  const [scfLoading, setScfLoading] = useState(false);

  /*
   * --------------------------------------------------------------------------
   * Method
   * --------------------------------------------------------------------------
   */

  const methods = useMemo(() => getObjectKeys(elastic), [elastic]);

  const selectedMethod =
    subMethod && methods.includes(subMethod)
      ? subMethod
      : methods.includes("FD")
        ? "FD"
        : (methods[0] ?? null);

  const methodData = selectedMethod ? elastic?.[selectedMethod] : null;

  /*
   * --------------------------------------------------------------------------
   * Pseudopotential
   * --------------------------------------------------------------------------
   */

  const pseudopotentials = useMemo(
    () => getObjectKeys(methodData),
    [methodData],
  );

  const selectedPseudopotential =
    pseudopotential && pseudopotentials.includes(pseudopotential)
      ? pseudopotential
      : (pseudopotentials[0] ?? null);

  /*
   * --------------------------------------------------------------------------
   * Walk through intermediate levels
   * --------------------------------------------------------------------------
   */

  let selectedData = selectedPseudopotential
    ? methodData?.[selectedPseudopotential]
    : null;

  const intermediateLevels = [];

  while (isObject(selectedData)) {
    const keys = Object.keys(selectedData);

    const hasMechanicalData = keys.some(
      (key) => key === "elastic_constants" || key === "workchain_uuid",
    );

    const averageKeys = keys.filter((key) =>
      key.toLowerCase().includes("average"),
    );

    if (hasMechanicalData || averageKeys.length > 0 || keys.length === 0) {
      break;
    }

    const levelIndex = intermediateLevels.length;

    const value =
      intermediateSelections[levelIndex] &&
      keys.includes(intermediateSelections[levelIndex])
        ? intermediateSelections[levelIndex]
        : keys[0];

    intermediateLevels.push({
      levelIndex,
      options: keys,
      value,
    });

    selectedData = selectedData[value];
  }

  /*
   * --------------------------------------------------------------------------
   * Average
   * --------------------------------------------------------------------------
   */

  const averages = useMemo(() => {
    if (!isObject(selectedData)) {
      return [];
    }

    return Object.keys(selectedData).filter((key) =>
      key.toLowerCase().includes("average"),
    );
  }, [selectedData]);

  const selectedAverage =
    average && averages.includes(average) ? average : (averages[0] ?? null);

  const averageData =
    selectedAverage && isObject(selectedData)
      ? selectedData[selectedAverage]
      : null;

  /*
   * --------------------------------------------------------------------------
   * Calculated data
   * --------------------------------------------------------------------------
   */

  const elasticConstants = selectedData?.elastic_constants;
  const vickersHardness = averageData?.vickers_hardness;
  const workchainUuid = selectedData?.workchain_uuid;

  const scfParaUuid = selectedData?.scf_parameters_uuid;
  const scfKpointsUuid = selectedData?.scf_kpoints_uuid;
  const scfQpointsUuid = selectedData?.qpoints_uuid;

  /*
   * --------------------------------------------------------------------------
   * Load SCF calculation details
   * --------------------------------------------------------------------------
   */

  useEffect(() => {
    setScfParamsData(null);
    setScfKpointsData(null);
    setScfQpointsData(null);

    if (!scfParaUuid || !scfKpointsUuid) {
      setScfLoading(false);
      return;
    }

    let cancelled = false;

    setScfLoading(true);

    Promise.all([
      loadAiidaAttributes("pbesol-v1-mechanical", scfParaUuid),
      loadAiidaAttributes("pbesol-v1-mechanical", scfKpointsUuid),
      scfQpointsUuid
        ? loadAiidaAttributes("pbesol-v1-mechanical", scfQpointsUuid)
        : Promise.resolve(null),
    ]).then(([paramsData, kpointsData, qpointsData]) => {
      if (!cancelled) {
        setScfParamsData(paramsData ?? null);
        setScfKpointsData(kpointsData ?? null);
        setScfQpointsData(qpointsData ?? null);
        setScfLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [scfParaUuid, scfKpointsUuid, scfQpointsUuid]);

  /*
   * --------------------------------------------------------------------------
   * Scalar properties
   * --------------------------------------------------------------------------
   */

  const scalarData = averageData
    ? Object.fromEntries(
        Object.entries(averageData)
          .filter(([key]) => key !== "vickers_hardness")
          .sort(
            ([keyA], [keyB]) =>
              (MECHANICAL_PROPERTY_META[keyA]?.order ?? Infinity) -
              (MECHANICAL_PROPERTY_META[keyB]?.order ?? Infinity),
          ),
      )
    : null;

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
          <div style={{ fontSize: "24px" }}>Mechanical details</div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "2px",
              alignItems: "center",
            }}
          >
            <CitationBanner
              citationKeys={["YZhangMechanical2026"]}
              doiIndices={[0, 1]}
            />
          </div>
        </div>

        {params.method !== method && (
          <WarningBoxOtherMethod method={method} id={params.id} />
        )}

        <div style={{ padding: "10px 10px", textAlign: "justify" }}>
          This dataset extends the PBEsol-v1 database by providing results from
          a high-throughput calculations of elastic properties of materials.
          This frontend section contains the elastic constants and related
          quantities such as Young's modulus, Poisson's ratio, Lamé parameters,
          acoustic velocities, etc. For further details regarding the
          methodology see the{" "}
          <Link
            to="/contributions/mechanical"
            target="_blank"
            rel="noopener noreferrer"
          >
            contributed details for this section
          </Link>
          .
        </div>

        <br />

        <Row>
          <Col lg={3}>
            <Selector
              label={
                <span className="d-inline-flex align-items-center gap-1">
                  Method <MechanicalMethodButton />
                </span>
              }
              value={selectedMethod}
              options={methods}
              onChange={(event) => {
                setSubmethod(event.target.value);
                setPseudopotential(null);
                setIntermediateSelections({});
                setAverage(null);
              }}
            />
          </Col>

          <Col lg={3}>
            <Selector
              label="Pseudopotential"
              value={selectedPseudopotential}
              options={pseudopotentials}
              onChange={(event) => {
                setPseudopotential(event.target.value);
                setIntermediateSelections({});
                setAverage(null);
              }}
            />
          </Col>

          {intermediateLevels.map((level) => (
            <Col lg={3} key={level.levelIndex}>
              <Selector
                label={
                  <>
                    <strong>q</strong>-points distance [Å⁻¹]
                  </>
                }
                value={level.value}
                options={level.options}
                onChange={(event) => {
                  setIntermediateSelections((current) => ({
                    ...current,
                    [level.levelIndex]: event.target.value,
                  }));
                  setAverage(null);
                }}
              />
            </Col>
          ))}

          {averages.length > 0 && (
            <Col lg={3}>
              <Selector
                label="Average"
                value={selectedAverage}
                options={averages}
                onChange={(event) => setAverage(event.target.value)}
              />
            </Col>
          )}
        </Row>

        <Row className="mt-2">
          <Col lg={6}>
            {scalarData && Object.keys(scalarData).length > 0 && (
              <>
                <div className="subsection-title">
                  Calculated Properties{" "}
                  {workchainUuid && (
                    <ExploreButton
                      explore_url={EXPLORE_URLS["pbesol-v1-mechanical"]}
                      uuid={workchainUuid}
                    />
                  )}
                </div>

                <McInfoBox>
                  <PropertyList data={scalarData} />
                </McInfoBox>
              </>
            )}

            {scalarData &&
              Object.keys(scalarData).length > 0 &&
              (selectedMethod === "FD" || selectedMethod === "Born") && (
                <div className="pt-4">
                  <div className="subsection-title">
                    Calculation Details{" "}
                    {scfParaUuid && (
                      <ExploreButton
                        explore_url={EXPLORE_URLS["pbesol-v1-mechanical"]}
                        uuid={scfParaUuid}
                      />
                    )}
                  </div>

                  <McInfoBox title="Calculation Details">
                    {scfLoading && <div>Loading...</div>}

                    {!scfLoading && (scfParamsData || scfKpointsData) && (
                      <div className="mb-3">
                        <ul className="no-bullets">
                          <li>
                            exchange-correlation functional:{" "}
                            {selectedData?.pseudo ?? "—"}
                          </li>

                          <li>
                            E<sub>cut</sub>:{" "}
                            {scfParamsData?.SYSTEM?.ecutwfc ?? "—"} Ry
                          </li>

                          <li>Smearing type: Marzari-Vanderbilt</li>
                          <li>Smearing: 0.272 eV</li>

                          <li>
                            DFT <strong>k</strong>-grid:{" "}
                            {scfKpointsData?.mesh?.join(" × ") ?? "—"}{" "}
                            <ExploreButton
                              explore_url={EXPLORE_URLS["pbesol-v1-mechanical"]}
                              uuid={scfKpointsUuid}
                            />
                          </li>

                          {scfQpointsData?.mesh && scfQpointsUuid && (
                            <li>
                              DFT <strong>q</strong>-grid:{" "}
                              {scfQpointsData.mesh.join(" × ")}{" "}
                              <ExploreButton
                                explore_url={
                                  EXPLORE_URLS["pbesol-v1-mechanical"]
                                }
                                uuid={scfQpointsUuid}
                              />
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {!scfLoading && !scfParamsData && !scfKpointsData && (
                      <div>No SCF data available</div>
                    )}
                  </McInfoBox>
                </div>
              )}
          </Col>

          <Col lg={6}>
            {elasticConstants && (
              <>
                <div className="subsection-title">
                  {formatPropertyLabel("elastic_constants")} [
                  {MECHANICAL_PROPERTY_META.elastic_constants.unit}]
                </div>

                <ElasticConstantsMatrix value={elasticConstants} />
              </>
            )}

            {vickersHardness && (
              <>
                <div className="subsection-title mt-3">Vickers Hardness</div>
                <VickersHardnessTable value={vickersHardness} />
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
