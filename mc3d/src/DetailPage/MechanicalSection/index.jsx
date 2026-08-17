import { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { McInfoBox } from "@mcxd/shared";
import { EXPLORE_URLS } from "../../common/fetchingUtils";
import { ExploreButton } from "mc-react-library";

import MECHANICAL_PROPERTY_META from "./metadata";
import ElasticConstantsMatrix from "./ElasticConstantsMatrix";
import VickersHardnessTable from "./VickersHardnessTable";

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
  return getPropertyMeta(key)?.name ?? key;
}

function PropertyList({ data }) {
  return (
    <div>
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="mb-2 d-flex align-items-baseline">
          <span className="me-2">{formatPropertyLabel(key)}:</span>
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
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
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

  const [method, setMethod] = useState(null);
  const [pseudopotential, setPseudopotential] = useState(null);
  const [intermediateSelections, setIntermediateSelections] = useState({});
  const [average, setAverage] = useState(null);

  const methods = useMemo(() => getObjectKeys(elastic), [elastic]);

  useEffect(() => {
    setMethod((current) =>
      methods.includes(current) ? current : (methods[0] ?? null),
    );
  }, [methods]);

  const methodData = method ? elastic?.[method] : null;

  const pseudopotentials = useMemo(
    () => getObjectKeys(methodData),
    [methodData],
  );

  useEffect(() => {
    setPseudopotential((current) =>
      pseudopotentials.includes(current)
        ? current
        : (pseudopotentials[0] ?? null),
    );
  }, [pseudopotentials]);

  let selectedData = pseudopotential ? methodData?.[pseudopotential] : null;

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
    const value = intermediateSelections[levelIndex] ?? keys[0];

    intermediateLevels.push({
      levelIndex,
      options: keys,
      value,
    });

    selectedData = selectedData[value];
  }

  const averages = useMemo(() => {
    if (!isObject(selectedData)) {
      return [];
    }

    return Object.keys(selectedData).filter((key) =>
      key.toLowerCase().includes("average"),
    );
  }, [selectedData]);

  useEffect(() => {
    setAverage((current) =>
      averages.includes(current) ? current : (averages[0] ?? null),
    );
  }, [averages]);

  const averageData =
    average && isObject(selectedData) ? selectedData[average] : null;

  const elasticConstants = selectedData?.elastic_constants;
  const vickersHardness = averageData?.vickers_hardness;
  const workchainUuid = selectedData?.workchain_uuid;

  const scalarData = averageData
    ? Object.fromEntries(
        Object.entries(averageData).filter(
          ([key]) => key !== "vickers_hardness",
        ),
      )
    : null;

  if (!elastic || !methods.length || !isObject(selectedData)) {
    return null;
  }

  return (
    <div>
      <div className="section-heading">Mechanical Properties</div>

      <Container fluid className="section-container">
        <Row>
          <Col lg={3}>
            <Selector
              label="Method"
              value={method}
              options={methods}
              onChange={(event) => {
                setMethod(event.target.value);
                setPseudopotential(null);
                setIntermediateSelections({});
                setAverage(null);
              }}
            />
          </Col>

          <Col lg={3}>
            <Selector
              label="Pseudopotential"
              value={pseudopotential}
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
                value={average}
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
                      explore_url={EXPLORE_URLS["pbesol-v1-mechanical"]} // todo add this...
                      uuid={workchainUuid}
                    />
                  )}
                </div>
                <McInfoBox title={average ?? "Mechanical Properties"}>
                  <PropertyList data={scalarData} />
                </McInfoBox>
              </>
            )}
          </Col>

          <Col lg={6}>
            {elasticConstants && (
              <>
                <div className="subsection-title mb-2">
                  {formatPropertyLabel("elastic_constants")}
                </div>

                <ElasticConstantsMatrix value={elasticConstants} />
              </>
            )}

            {vickersHardness && (
              <>
                <div className="subsection-title mb-2 mt-3">
                  {formatPropertyLabel("vickers_hardness")}
                </div>

                <VickersHardnessTable value={vickersHardness} />
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
