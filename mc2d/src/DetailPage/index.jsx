import React from "react";

import PageLayout from "../Layout";

import { useParams, useNavigate } from "react-router-dom";

import { formatTitle } from "@mcxd/shared";

import { getSymmetryInfo } from "mc-react-library";

import { CitationBanner } from "@mcxd/shared";

import { useQuery } from "@tanstack/react-query";
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

import { MC2D_TOC_REGISTRY } from "./tocRegistry";

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

function useCompoundData(id) {
  return useQuery({
    queryKey: ["compound", id],
    queryFn: () => fetchCompoundData(id),
    enabled: !!id,
  });
}

function DetailPage() {
  // for routing
  const navigate = useNavigate();
  const params = useParams(); // Route parameters

  const {
    data: loadedData,
    isPending: loading,
    isError,
  } = useCompoundData(params.id);

  let title = null;
  if (!loading && !isError && loadedData) {
    title = formatTitle(loadedData.details.general.formula, params.id);
  }

  return (
    <PageLayout
      breadcrumbs={[{ name: params.id, link: null }]}
      tocRegistry={MC2D_TOC_REGISTRY}
    >
      {loading ? (
        <div style={{ width: "150px", padding: "40px", margin: "0 auto" }}>
          <McloudSpinner />
        </div>
      ) : isError ? (
        <div style={{ padding: "40px", margin: "0 auto", textAlign: "center" }}>
          Failed to load data for {params.id}.
        </div>
      ) : (
        <>
          <div className="detail-page-heading">{title}</div>
          <CitationBanner citationKeys={loadedData.details.general.citations} />
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
    </PageLayout>
  );
}

export default DetailPage;
