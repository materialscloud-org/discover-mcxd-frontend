import { useState, useEffect, useMemo } from "react";

import "./index.css";

import { useParams, useNavigate } from "react-router-dom";

import { McloudSpinner } from "mc-react-library";

import { formatTitle } from "@mcxd/shared";

import { useQuery } from "@tanstack/react-query";
import {
  loadMetadata,
  loadDetails,
  loadDatasetIndex,
  loadAiidaAttributes,
} from "../common/fetchingUtils";

import AlternativeMethodsList from "./AlternativeMethodsList";
import buildResultsObject from "../common/buildResultsObject";

import OverviewSection from "./OverviewSection";
import StructureSection from "./StructureSection";
import ProvenanceSection from "./ProvenanceSection";
import XrdSection from "./XrdSection";

import VibrationalSection from "./VibrationalSection";
import SuperconductivitySection from "./SuperconductivitySection";

// if fetching fails we use this.
import MissingDataWarning from "./MissingDataWarning";

import { CitationBanner } from "@mcxd/shared";
import PageLayout from "../Layout";
import MechanicalSection from "./MechanicalSection";

import { MC3D_TOC_REGISTRY } from "./tocRegistry";

import { fromStructureData, getSymmetry } from "matsci-parse";

// contributed sections
// import RelatedSection from "./RelatedSection";

async function fetchCoreData(method, id) {
  const [metadata, details] = await Promise.all([
    loadMetadata(method, id),
    loadDetails(method, id),
  ]);

  const structureUuid = details?.general?.structure_uuid;
  if (!structureUuid) throw new Error("Missing structure UUID");

  const aiidaAttributes = await loadAiidaAttributes(method, structureUuid);

  return {
    metadata,
    details,
    structureInfo: { aiidaAttributes, cif: null },
  };
}

function useDatasetIndex(method, id) {
  return useQuery({
    queryKey: ["dataset-index", method, id],
    queryFn: () => loadDatasetIndex(method, id),
    enabled: !!method && !!id,
  });
}

function useCoreData(method, id, enabled = true) {
  return useQuery({
    queryKey: ["core", method, id],
    queryFn: () => fetchCoreData(method, id),
    enabled: !!method && !!id && enabled,
  });
}

function DetailPage() {
  const navigate = useNavigate();
  const params = useParams(); // Route parameters
  const [crystals, setCrystals] = useState({});
  const [selectedCell, setSelectedCell] = useState("aiida");
  const [usePrimitive, setUsePrimitive] = useState(true);

  const cellMode = {
    selectedCell,
    setSelectedCell,
  };

  const { data: datasetWrapper, isError: datasetError } = useDatasetIndex(
    params.method,
    params.id,
  );

  const datasetIndex = datasetWrapper?.index ?? null;

  const resultsObject = useMemo(
    () => buildResultsObject(datasetWrapper?.index, params.method),
    [datasetWrapper, params.method],
  );

  const coreEnabled =
    !!resultsObject && resultsObject.core_base === params.method;

  const { data: coreData, isError: coreError } = useCoreData(
    params.method,
    params.id,
    coreEnabled,
  );

  // fetching failed, or the dataset index has no core entry for this method
  const coreFailed =
    datasetError ||
    coreError ||
    (datasetWrapper !== undefined &&
      resultsObject.core_base !== params.method);

  useEffect(() => {
    async function runAnalysis() {
      const cs = fromStructureData(coreData.structureInfo.aiidaAttributes);
      const result = await getSymmetry(cs, 0.005);

      const crystals = result;
      crystals.aiida = cs;

      console.log("crystals", crystals);
      setCrystals(crystals);
    }

    if (coreData?.structureInfo) {
      runAnalysis();
    }
  }, [coreData]);

  // While loading, show spinner
  if (coreData == null && !coreFailed) {
    return (
      <PageLayout
        breadcrumbs={[{ name: `${params.id}/${params.method}`, link: null }]}
      >
        <div style={{ width: "150px", padding: "40px", margin: "0 auto" }}>
          <McloudSpinner />
        </div>
      </PageLayout>
    );
  }

  // if Data is missing we show the Error.
  if (coreFailed) {
    return <MissingDataWarning params={params} navigate={navigate} />;
  }

  // Otherwise proceed as normal.
  const title = formatTitle(
    coreData.details.general.formula,
    params.id,
    params.method,
  );

  return (
    <PageLayout
      breadcrumbs={[{ name: `${params.id}/${params.method}`, link: null }]}
      tocRegistry={MC3D_TOC_REGISTRY}
    >
      <div className="detail-page-heading">{title}</div>

      {/* Place this somewhere nice */}
      {/* <CitationBanner citationKeys={["HuberMc3d25"]} /> */}

      <div style={{ paddingLeft: "12px" }}>
        <AlternativeMethodsList
          id={params.id}
          methods={datasetIndex}
          currentMethod={params.method}
        />
      </div>

      <OverviewSection
        params={params}
        loadedData={coreData}
        headerStyle={{
          margin: "0px 0px 10px 0px",
          padding: "0px 0px 10px 0px",
        }}
        crystals={crystals}
        cellMode={cellMode}
      />
      <StructureSection
        params={params}
        loadedData={coreData}
        cellMode={cellMode}
        crystals={crystals}
      />
      <ProvenanceSection params={params} loadedData={coreData} />
      <XrdSection method={params.method} id={params.id} />

      {/* <ElectronicStructureSection params={params} /> */}

      <VibrationalSection
        params={params}
        loadedData={coreData}
        superconMethod={resultsObject?.supercon_base}
      />

      <SuperconductivitySection
        params={params}
        loadedData={coreData}
        superconMethod={resultsObject?.supercon_base}
      />

      <MechanicalSection
        params={params}
        loadedData={coreData}
        mechanicalMethod={resultsObject?.mechanical_base}
      />

      {/* <SimilaritySection params={params} /> */}
    </PageLayout>
  );
}

export default DetailPage;
