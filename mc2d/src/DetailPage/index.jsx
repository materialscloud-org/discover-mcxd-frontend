import React, { useState, useEffect } from "react";

import TitleAndLogo from "../common/TitleAndLogo";

import { useParams, useNavigate } from "react-router-dom";

import MaterialsCloudHeader from "mc-react-header";

import { formatChemicalFormula } from "mc-react-library";

import { Container, Row, Col } from "react-bootstrap";

import { getSymmetryInfo } from "mc-react-library";

import { CitationBanner } from "@mcxd/shared";

import {
  loadMetadata,
  loadDetails,
  loadAiidaAttributes,
  loadAiidaCif,
  loadDatasetIndex,
  loadTopologyDetails,
} from "../common/restApiUtils";

import "./index.css";
import { McloudSpinner } from "mc-react-library";

import OverviewSection from "./OverviewSection";
import ElectronicSection from "./ElectronicSection";
import VibrationalSection from "./VibrationalSection";
import ParentsSection from "./ParentsSection";
import StructureSection from "./StructureSection";

import TopologySection from "./TopologySection";

function formatTitle(formulaStr, id) {
  return (
    <span>
      {formatChemicalFormula(formulaStr)} ({id})
    </span>
  );
}

async function fetchCompoundData(id) {
  let datasetIndex = await loadDatasetIndex(id);

  let metadata = await loadMetadata(id);
  let details = await loadDetails(id);

  let symmetryInfo = getSymmetryInfo(details.general.space_group_number);

  let structureUuid = details.general.structure_relaxed_uuid;

  let aiidaAttributes = await loadAiidaAttributes(structureUuid);
  let structureCif = await loadAiidaCif(structureUuid);

  // fetch and bundle topology metadata.
  let topologyInfo = {};
  if (datasetIndex?.index?.["pbe-v1"]?.includes("2dtopo_base")) {
    topologyInfo = await loadTopologyDetails(id);
  }

  return {
    metadata: metadata,
    details: details,
    symmetryInfo: symmetryInfo,
    structureInfo: { aiidaAttributes: aiidaAttributes, cif: structureCif },
    datasetIndex: datasetIndex,
    topologyInfo: topologyInfo,
  };
}

function DetailPage() {
  const [loadedData, setLoadedData] = useState(null);

  // for routing
  const navigate = useNavigate();
  const params = useParams(); // Route parameters

  useEffect(() => {
    setLoadedData(null);
    fetchCompoundData(params.id).then((loadedData) => {
      console.log("Loaded general data", loadedData);
      setLoadedData(loadedData);
    });
  }, [params.id]);

  let title = null;
  let loading = loadedData == null;
  if (!loading) {
    title = formatTitle(loadedData.details.general.formula, params.id);
  }

  return (
    <>
      <MaterialsCloudHeader
        activeSection={"discover"}
        breadcrumbsPath={[
          { name: "Discover", link: "https://www.materialscloud.org/discover" },
          {
            name: "Materials Cloud Two-Dimensional Structure Database",
            link: `${import.meta.env.BASE_URL}`,
          },
          { name: params.id, link: null },
        ]}
      />
      <Container fluid="xxl">
        <TitleAndLogo />
        {loading ? (
          <div style={{ width: "150px", padding: "40px", margin: "0 auto" }}>
            <McloudSpinner />
          </div>
        ) : (
          <>
            <div className="detail-page-heading">{title}</div>
            <CitationBanner
              citationKeys={loadedData.details.general.citations}
            />
            <OverviewSection params={params} loadedData={loadedData} />
            <StructureSection params={params} loadedData={loadedData} />
            <ElectronicSection params={params} loadedData={loadedData} />
            <VibrationalSection params={params} loadedData={loadedData} />

            {/* Topology only if in dataset-index */}
            {loadedData?.topologyInfo &&
              Object.keys(loadedData.topologyInfo).length > 0 && (
                <TopologySection params={params} loadedData={loadedData} />
              )}

            <ParentsSection params={params} loadedData={loadedData} />
          </>
        )}
      </Container>
    </>
  );
}

export default DetailPage;
