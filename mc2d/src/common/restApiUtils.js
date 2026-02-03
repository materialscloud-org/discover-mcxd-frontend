// ------------------------------------------------------------------------------------------------
// REST API UTILITIES
// Define all functions for api calls here.

// By default, use development API URLS
let mcRestApiUrl = "https://mcxd-api.dev.materialscloud.org/";
let aiidaRestBaseUrl = "https://aiida.materialscloud.org";
let exploreBaseUrl = "https://develop.mc-frontend.pages.dev/explore/";

// Use production backend if specified
if (import.meta.env.VITE_PRODUCTION_BACKEND === "true") {
  mcRestApiUrl = "https://mcxd-api.materialscloud.org/";
  aiidaRestBaseUrl = "https://aiida.materialscloud.org";
  exploreBaseUrl = "https://www.materialscloud.org/explore/";
}

export const MC_REST_API_URL_BASE = mcRestApiUrl;
export const MC_REST_API_URL = `${mcRestApiUrl}mc2d/pbe-v1`;

export const AIIDA_REST_API_URL = `${aiidaRestBaseUrl}/mc2d/api/v4`;
export const TOPOLOGICAL_AIIDA_REST_API_URL = `${aiidaRestBaseUrl}/2dtopo/api/v4`;

export const EXPLORE_URL = `${exploreBaseUrl}mc2d`;
export const TOPOLOGICAL_EXPLORE_URL = `${exploreBaseUrl}2dtopo`;

// method for fetching with a fallback url.
async function fetchWithFallback(primaryUrl, fallbackUrl, timeout = 3500) {
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    let response = await fetch(primaryUrl, { signal });
    clearTimeout(timeoutId);

    if (!response.ok)
      throw new Error(`Primary fetch failed with status ${response.status}`);
    return await response.json();
  } catch (err) {
    if (!fallbackUrl) {
      console.error("Fetch failed:", err);
      return null;
    }

    console.warn("Primary fetch failed, trying fallback:", err);

    const fallbackController = new AbortController();
    const fallbackSignal = fallbackController.signal;
    const fallbackTimeoutId = setTimeout(
      () => fallbackController.abort(),
      timeout,
    );

    try {
      let response = await fetch(fallbackUrl, {
        signal: fallbackSignal,
      });
      clearTimeout(fallbackTimeoutId);

      if (!response.ok)
        throw new Error(`Fallback fetch failed with status ${response.status}`);
      return await response.json();
    } catch (fallbackErr) {
      console.error("Both fetch attempts failed:", fallbackErr);
      return null;
    }
  }
}

// delay function for testing loading animations:
const delay = (ms) => {
  console.log(`delaying for ${ms}ms for testing loading animations`);
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export async function loadIndex() {
  // await delay(2000);
  let endpoint = `${MC_REST_API_URL}/overview`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching index:", error);
  }
}

export async function loadMetadata() {
  let endpoint = `${MC_REST_API_URL}/meta`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }
}

export async function loadDatasetIndex(id) {
  const primary = `${mcRestApiUrl}mc2d/dataset-index/${id}`;
  const fallback = `${mcRestApiUrl}mc2d/dataset-index/${id}`;
  return fetchWithFallback(primary, fallback);
}

export async function loadTopologyDetails(id) {
  let endpoint = `${MC_REST_API_URL}/2dtopo_base/${id}`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching details:", error);
  }
}

export async function loadDetails(id) {
  let endpoint = `${MC_REST_API_URL}/core_base/${id}`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching details:", error);
  }
}

export async function loadAiidaAttributes(uuid) {
  let endpoint = `${AIIDA_REST_API_URL}/nodes/${uuid}/contents/attributes`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    const json = await response.json();
    return json.data.attributes;
  } catch (error) {
    console.error("Error fetching AiiDA attributes:", error);
  }
}

export async function loadAiidaCif(uuid) {
  let endpoint = `${AIIDA_REST_API_URL}/nodes/${uuid}/download?download_format=cif&download=false`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    const json = await response.json();
    return json.data.download.data;
  } catch (error) {
    console.error("Error fetching AiiDA cif:", error);
  }
}

export async function loadAiidaBands(uuid) {
  // await delay(2000);
  let endpoint = `${AIIDA_REST_API_URL}/nodes/${uuid}/download?download_format=json`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching AiiDA bands:", error);
  }
}

export async function loadTopoBands(uuid) {
  // await delay(2000);
  let endpoint = `${TOPOLOGICAL_AIIDA_REST_API_URL}/nodes/${uuid}/download?download_format=json`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching AiiDA bands:", error);
  }
}

export async function loadPhononVis(id) {
  let endpoint = `${MC_REST_API_URL}/core_phonon-vis/${id}`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    if (!response.ok) {
      return null;
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching phonon-vis:", error);
    return null;
  }
}

export async function loadStructureUuids() {
  let endpoint = `${MC_REST_API_URL}/core_structure-uuids`;
  try {
    const response = await fetch(endpoint, { method: "get" });
    if (!response.ok) {
      return null;
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching structure-uuids:", error);
    return null;
  }
}
