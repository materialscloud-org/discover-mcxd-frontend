import { ExploreButton } from "mc-react-library";

import { EXPLORE_URL } from "../common/restApiUtils";

export function formatAiidaProp(property, unit = null, prec = 3, factor = 1) {
  if (property == null) {
    return <span>N/A</span>;
  }
  let val = property.value ?? 0.0;
  val *= factor;
  let valStr = val.toFixed(prec);
  if (unit) {
    valStr += ` ${unit}`;
  }
  return (
    <span>
      {valStr}{" "}
      <ExploreButton explore_url={EXPLORE_URL} uuid={property.uuid ?? null} />
    </span>
  );
}

function sourceUrl(db, id) {
  if (db == "MPDS") {
    return `https://mpds.io/#entry/${id}`;
  }
  if (db == "COD") {
    return `http://www.crystallography.net/cod/${id}.html`;
  }
  if (db == "ICSD") {
    return `https://icsd.fiz-karlsruhe.de/linkicsd.xhtml?coll_code=${id}`;
  }
  return null;
}

export function formatSourceLink(db, id) {
  return (
    <a href={sourceUrl(db, id)} title={"Go to source data"} target="_blank">
      {db} - {id}
    </a>
  );
}
