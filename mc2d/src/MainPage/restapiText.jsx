import {
  MC_REST_API_URL_BASE,
  MC_REST_API_URL,
  AIIDA_REST_API_URL,
} from "../common/restApiUtils";

import "./restapiText.css";

const DOCS_URL = `${MC_REST_API_URL_BASE}docs`;
const INDEX_URL = `${MC_REST_API_URL}/overview`;
const SINGLE_ENTRY_URL = `${MC_REST_API_URL}/core_base/mc2d-1`;

export const restapiText = (
  <div className="restapi-text-container">
    <p>
      This section contains an overview of our REST APIs to access the MC2D
      data.
    </p>
    <div className="restapi-h">1. Materials Cloud and AiiDA REST APIs</div>
    <div>
      The MC2D frontend is running on:
      <ul>
        <li>
          The Materials Cloud REST API for the curated metadata:{" "}
          <a href={DOCS_URL} target="_blank">
            {DOCS_URL}
          </a>
          , see e.g.
          <ul>
            <li>
              Index of materials:{" "}
              <a href={INDEX_URL} target="_blank">
                {INDEX_URL}
              </a>
            </li>
            <li>
              Single entry data:{" "}
              <a href={SINGLE_ENTRY_URL} target="_blank">
                {SINGLE_ENTRY_URL}
              </a>
            </li>
          </ul>
        </li>
        <li>
          AiiDA REST API for properties and provenance:{" "}
          <a href={AIIDA_REST_API_URL} target="_blank">
            {AIIDA_REST_API_URL}
          </a>
        </li>
      </ul>
    </div>
    <div className="restapi-h">2. OPTIMADE REST API</div>
    <div>
      The MC2D database can also be accessed via an API following the{" "}
      <a
        href="https://www.optimade.org/optimade"
        target="_blank"
        rel="noopener noreferrer"
      >
        OPTIMADE specification
      </a>
      . This currently includes the crystal structures and some properties but
      no provenance information is provided. For the exact endpoints, see the{" "}
      <a
        href="https://materialscloud.org/optimade"
        target="_blank"
        rel="noopener noreferrer"
      >
        Materials Cloud OPTIMADE API page
      </a>
      .
    </div>
  </div>
);
