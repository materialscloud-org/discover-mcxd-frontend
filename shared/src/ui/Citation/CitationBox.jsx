import { DoiBadge } from "mc-react-library";
import "./Citation.css";
import { CITATION_MAPPING } from "./citationMapping";

export const CitationBox = ({ citationKey, maxDois = Infinity }) => {
  const citation = CITATION_MAPPING[citationKey];
  if (!citation) return null;

  const { authors, authorsShort, assoiciatedDois = [] } = citation;

  const mainDoi = assoiciatedDois[0];
  const title = mainDoi?.title || citation.title || "Untitled";
  const journalRef = mainDoi?.journalRef || "";

  const extraDois = assoiciatedDois.slice(1, maxDois);
  const dataDois = extraDois.filter((d) => d.type === "data");
  const otherPublications = extraDois.filter(
    (d) => d.type === "paper" || d.type === "preprint",
  );

  return (
    <div className="citationbox-container">
      <div className="citationbox-title">
        <b>{title}</b>
        {mainDoi &&
          (mainDoi.type === "paper" || mainDoi.type === "preprint") && (
            <span className="citationbox-inline-badge">
              <DoiBadge doi={mainDoi.doi} label="Paper DOI" color="#a2e5b7" />
            </span>
          )}
      </div>

      {/* Main author / journal line */}
      <div className="citationbox-authors">
        {authors.join(", ")}
        {journalRef && `, ${journalRef}`}
      </div>

      {/* Accompanying data */}
      {dataDois.length > 0 && (
        <div className="citationbox-extras">
          <b>Accompanying data:</b>
          {dataDois.map((d) => (
            <div key={d.doi}>
              {authorsShort}, {d.journalRef} ({d.year})
              <span className="citationbox-inline-badge">
                <DoiBadge doi={d.doi} label="Data DOI" color="#a2cbff" />
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Other publications */}
      {otherPublications.length > 0 && (
        <div className="citationbox-extras">
          {otherPublications.map((d) => (
            <div key={d.doi}>
              <b>{d.journal}:</b> {authorsShort}, {d.journalRefShort} ({d.year})
              <span className="citationbox-inline-badge">
                <DoiBadge doi={d.doi} label="Paper DOI" color="#a2e5b7" />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
