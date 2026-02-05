import { ExploreButton } from "mc-react-library";
import { EXPLORE_URLS } from "./aiidaRestApiUtils";

export function format_aiida_prop(
  property,
  metadata,
  methodLabel,
  prec = 3,
  factor = 1,
) {
  if (property == null) {
    return <span>N/A</span>;
  }
  let val = property.value ?? 0.0;
  val *= factor;
  let valStr = val.toFixed(prec);
  if (metadata.unit) {
    valStr += ` ${metadata.unit}`;
  }
  return (
    <span>
      {valStr}{" "}
      <ExploreButton
        explore_url={EXPLORE_URLS[methodLabel]}
        uuid={property.uuid ?? null}
      />
    </span>
  );
}
