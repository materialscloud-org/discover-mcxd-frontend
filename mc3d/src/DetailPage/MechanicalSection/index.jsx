import { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { CitationBanner, McInfoBox } from "@mcxd/shared";
import { useQuery } from "@tanstack/react-query";

import { MechanicalIcon } from "../../assets/sectionIcons";
import {
  EXPLORE_URLS,
  loadAiidaAttributes,
  loadMechanicalProps,
} from "../../common/fetchingUtils";
import { ExploreButton } from "mc-react-library";

import MECHANICAL_PROPERTY_META from "./metadata";
import ElasticConstantsMatrix from "./ElasticConstantsMatrix";
import VickersHardnessTable from "./VickersHardnessTable";
import { Link } from "react-router-dom";
import { WarningBoxOtherMethod } from "../../common/WarningBox";
import { WarningBox } from "../../common/WarningBox";

import { MechanicalMethodButton } from "./InfoPopover";

function useMechanicalDetails(dataMethod, id) {
  return useQuery({
    queryKey: ["mechanical", dataMethod, id],
    queryFn: () => loadMechanicalProps(dataMethod, id),
    enabled: !!dataMethod && !!id,
  });
}

function useScfAttributes(apiMethod, paramsUuid, kpointsUuid, qpointsUuid) {
  return useQuery({
    queryKey: ["scf-attrs", apiMethod, paramsUuid, kpointsUuid, qpointsUuid],
    queryFn: () =>
      Promise.all([
        loadAiidaAttributes(apiMethod, paramsUuid),
        loadAiidaAttributes(apiMethod, kpointsUuid),
        qpointsUuid
          ? loadAiidaAttributes(apiMethod, qpointsUuid)
          : Promise.resolve(null),
      ]).then(([params, kpoints, qpoints]) => ({
        params: params ?? null,
        kpoints: kpoints ?? null,
        qpoints: qpoints ?? null,
      })),
    enabled: !!paramsUuid && !!kpointsUuid,
  });
}

const AVERAGES = ["voigt_average", "VRH_average", "reuss_average"];

function formatValue(value, key) {
  if (
    value == null ||
    value === "NaN" ||
    (typeof value === "number" && Number.isNaN(value))
  ) {
    return "—";
  }

  const meta = MECHANICAL_PROPERTY_META[key];

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

  return MECHANICAL_PROPERTY_META[key]?.name ?? key;
}

function PropertyList({ data }) {
  return (
    <div>
      {Object.entries(data).map(([key, value]) => {
        const meta = MECHANICAL_PROPERTY_META[key];

        return (
          <div key={key} className="mb-2 d-flex align-items-baseline">
            <span className="me-2">
              {meta?.symbol && (
                <>
                  <i>{meta.symbol}</i> ·{" "}
                </>
              )}
              {formatPropertyLabel(key)}:{" "}
            </span>
            <span>{formatValue(value, key)}</span>
          </div>
        );
      })}
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
  mechanicalMethod,
}) {
  const { data: mechDetails } = useMechanicalDetails(
    mechanicalMethod,
    params.id,
  );

  const elastic = mechDetails?.elastic;
  const method = mechanicalMethod;

  const [subMethod, setSubMethod] = useState(null);
  const [pseudopotential, setPseudopotential] = useState(null);
  const [intermediateSelections, setIntermediateSelections] = useState({});
  const [average, setAverage] = useState(null);

  /*
   * --------------------------------------------------------------------------
   * Method
   * --------------------------------------------------------------------------
   */

  const methods = elastic ? Object.keys(elastic) : [];

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

  const pseudopotentials = methodData ? Object.keys(methodData) : [];

  const selectedPseudopotential =
    pseudopotential && pseudopotentials.includes(pseudopotential)
      ? pseudopotential
      : (pseudopotentials[0] ?? null);

  /*
   * --------------------------------------------------------------------------
   * Walk through intermediate levels
   * --------------------------------------------------------------------------
   */

  let currentData = selectedPseudopotential
    ? methodData?.[selectedPseudopotential]
    : null;

  const intermediateLevels = [];

  while (currentData) {
    const keys = Object.keys(currentData);

    if (keys.some((key) => AVERAGES.includes(key))) {
      break;
    }

    const levelIndex = intermediateLevels.length;
    const value = intermediateSelections[levelIndex] ?? keys[0];

    intermediateLevels.push({
      levelIndex,
      options: keys,
      value,
    });

    currentData = currentData[value];
  }

  /*
   * --------------------------------------------------------------------------
   * Selected Average
   * --------------------------------------------------------------------------
   */
  const selectedAverage = AVERAGES.includes(average) ? average : AVERAGES[0];
  const averageData = currentData?.[selectedAverage] ?? null;

  /*
   * --------------------------------------------------------------------------
   * Calculated data
   * --------------------------------------------------------------------------
   */

  const elasticConstants = currentData?.elastic_constants;
  const vickersHardness = averageData?.vickers_hardness;
  const workchainUuid = currentData?.workchain_uuid;

  const scfParamsUuid = currentData?.scf_parameters_uuid;
  const scfKpointsUuid = currentData?.scf_kpoints_uuid;
  const scfQpointsUuid = currentData?.qpoints_uuid;

  /*
   * --------------------------------------------------------------------------
   * Load SCF calculation details
   * --------------------------------------------------------------------------
   */

  const { data: scfData, isFetching: scfLoading } = useScfAttributes(
    "pbesol-v1-mechanical",
    scfParamsUuid,
    scfKpointsUuid,
    scfQpointsUuid,
  );

  const scfParamsData = scfData?.params ?? null;
  const scfKpointsData = scfData?.kpoints ?? null;
  const scfQpointsData = scfData?.qpoints ?? null;

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

  const hasNaNCalculatedProperty =
    scalarData &&
    Object.values(scalarData).some(
      (value) =>
        value === "NaN" || (typeof value === "number" && Number.isNaN(value)),
    );

  // escape on failure (after all hooks to preserve hook order across renders)
  if (!elastic || Object.keys(elastic).length === 0) {
    return null;
  }

  return (
    <div id="mechanical" data-toc-section="mechanical">
      <Container fluid className="section-container">
        <div
          style={{
            margin: "10px 0px",
            padding: "20px 0px 10px",
            borderBottom: "1px solid #c4c4c4",
          }}
        >
          <div style={{ fontSize: "24px" }}>
            <MechanicalIcon size={22} className="section-heading-icon" />
            Mechanical details
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
                setSubMethod(event.target.value);
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

          <Col lg={3}>
            <Selector
              label="Average"
              value={selectedAverage}
              options={AVERAGES}
              onChange={(event) => setAverage(event.target.value)}
            />
          </Col>
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

                {hasNaNCalculatedProperty && (
                  <WarningBox style={{ margin: "2px 10px 10px 10px" }}>
                    Warning: Some properties were calculated to be unphysical
                    for this q-points distance.
                  </WarningBox>
                )}

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
                    {scfParamsUuid && (
                      <ExploreButton
                        explore_url={EXPLORE_URLS["pbesol-v1-mechanical"]}
                        uuid={scfParamsUuid}
                      />
                    )}
                  </div>

                  <McInfoBox title="Calculation Details">
                    {scfLoading && <div>Loading...</div>}

                    {!scfLoading && (scfParamsData || scfKpointsData) && (
                      <div className="mb-3">
                        <ul className="no-bullets">
                          <li>exchange-correlation functional: PBE</li>

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
