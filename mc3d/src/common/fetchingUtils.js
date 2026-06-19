/*

We define fetching of external data here.

*/

// By default we use the development backend:
const beProd = import.meta.env.VITE_PRODUCTION_BACKEND === "true";

const URLS = beProd
  ? {
      mcRest: "https://mcxd-api.materialscloud.org/mc3d",
      mcRestFallback: "https://mcxd-api.dev.materialscloud.org/",
      s3: "https://mcxd-publicbucket.materialscloud.xyz/mc3d",
      aiida: "https://aiida.materialscloud.org",
      explore: "https://www.materialscloud.org/explore/",
    }
  : {
      mcRest: "https://mcxd-api.dev.materialscloud.org/mc3d",
      mcRestFallback: "https://mcxd-api.dev.materialscloud.org/",
      s3: "https://rgw.cscs.ch/matcloud:mc-discover-mcxd-public/mc3d",
      aiida: "https://aiida.dev.materialscloud.org",
      explore: "https://develop.mc-frontend.pages.dev/explore/",
    };

const datasets = [
  "pbe-v1",
  "pbesol-v1",
  "pbesol-v2",
  "pbesol-v1-fermisurf",
  "pbesol-v1-supercon",
];

const explorePaths = ["pbe-v1", "pbesol-v1", "pbesol-v2", "pbesol-v1-supercon"];

export const AIIDA_API_URLS = Object.fromEntries(
  datasets.map((k) => [k, `${URLS.aiida}/mc3d-${k}/api/v4`]),
);

export const EXPLORE_URLS = Object.fromEntries(
  explorePaths.map((k) => [k, `${URLS.explore}/mc3d-${k}`]),
);

export const MC_REST_API_URL = URLS.mcRest;

export const S3_URL = URLS.s3;

const delayTest = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* 
The following function is used to fetch data from multiple sources
in the case that the first source URL is down, 
*/
async function fallbackFetch(urls = [], timeout = 3500) {
  for (const url of urls) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      return await res.json();
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn(`Fetch failed: ${url}`, err);
    }
  }

  console.error("All fetch attempts failed");
  return null;
}

/* 
MC REST API data fetches.
The MC REST API contains id-structureuuid mappings, and pointers to AiiDA UUIDs.
It also contains overview and meta data endpoints
*/

function mcRestFetch(path) {
  const primary = `${URLS.mcRest}/${path}`;
  const fallback = `${URLS.mcRestFallback}/${path}`;
  return fallbackFetch([primary, fallback]);
}

export const loadIndex = (method) => mcRestFetch(`${method}/overview`);

export const loadMetadata = (method) => mcRestFetch(`${method}/meta`);

export const loadDetails = (method, id) =>
  mcRestFetch(`${method}/core_base/${id}`);

export const loadDatasetIndex = (method, id) =>
  mcRestFetch(`dataset-index/${id}`);

export const loadDhva = (method, id) =>
  mcRestFetch(`${method}/fermisurf_base/${id}`);

export const loadSuperConDetails = (method, id) =>
  mcRestFetch(`${method}/supercon_base/${id}`);

export const loadSuperConPhononVis = (method, id) =>
  mcRestFetch(`${method}/supercon_phonon-vis/${id}`);

export const loadStructureUuids = (method) =>
  mcRestFetch(`${method}/structure-uuids`);

export const loadGeneralInfo = () => mcRestFetch("info");

/* 
AiiDA data fetches.
A lot of information is grabbed from AiiDA, and these endpoints are flexible.

These are directly referenced by UUID and thus should be fairly fast
However since these need assoiciated UUIDS, the data must exist in AiiDA and
the desired UUID must be added to the datapipeline
*/

// get attr
export async function loadAiidaAttributes(method, uuid) {
  let aiidaUrl = AIIDA_API_URLS[method];
  let endpoint = `${aiidaUrl}/nodes/${uuid}/contents/attributes`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    const json = await response.json();
    return json.data.attributes;
  } catch (error) {
    console.error("Error fetching AiiDA attributes:", error);
  }
}

// get cif
export async function loadAiidaCif(method, uuid) {
  let aiidaUrl = AIIDA_API_URLS[method];
  let endpoint = `${aiidaUrl}/nodes/${uuid}/download?download_format=cif&download=false`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    const json = await response.json();
    return json.data.download.data;
  } catch (error) {
    console.error("Error fetching AiiDA cif:", error);
  }
}

// get bands data
export async function loadAiidaBands(aiidaProfile, uuid) {
  // await delay(2000);
  let aiidaUrl = AIIDA_API_URLS[aiidaProfile];
  const endpoint = `${aiidaUrl}/nodes/${uuid}/download?download_format=json`;

  console.log("bands endpoint", endpoint);

  try {
    const response = await fetch(endpoint, { method: "get" });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching AiiDA bands:", error);
  }
}

export async function loadXY(aiidaProfile, uuid) {
  // await delay(2000);
  let aiidaUrl = AIIDA_API_URLS[aiidaProfile];

  const endpoint = `${aiidaUrl}/nodes/${uuid}/download?download_format=json`;

  try {
    const response = await fetch(endpoint, { method: "get" });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching AiiDA bands:", error);
  }
}

/*
S3 public bucket fetches:
Hosted by CSCS, with a base bucket URL at:
const S3_BASE = https://rgw.cscs.ch/matcloud:mc-discover-mcxd-public
with development and production split via URL:

development_DATA = `${S3_BASE}/mc3d/${METHOD}_{DATAID}/dev/{DATA}`

This data is compressed using brotli compression and has the correct headers
within the data pipeline. This data is particularly reserved for non-indexed
and large data (i.e. XRD/Fermisurfaces)

production is similarly split:
production_DATA = `${S3_BASE}/mc3d/${METHOD}_{DATAID}/prod/{DATA}`

--- There is also cloudflare proxy instance hosted that points to the S3_BASE:
const S3_BASE_CF = https://mcxd-publicbucket.materialscloud.xyz 

production_CF_DATA = `${S3_BASE_CF}/mc3d/${METHOD}_{DATAID}/dev/{DATA}

NOTE that double slashes seem to break pathing on the S3 bucket 
and thus some care is needed.
*/

export async function loadXrdWavelength({ method, id, wavelength }) {
  const url = `${S3_URL}/${method}_xrd/prod/${id}/${wavelength}.json.br`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return await res.json();
}

export { URLS };
