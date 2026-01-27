import { FaBook } from "react-icons/fa";
import { DoiBadge } from "mc-react-library";
import { CITATION_MAPPING } from "./citationMapping";
import "./Citation.css";

export const CitationBanner = ({ citationKeys, doiIndices = [0] }) => {
  return (
    <div className="citationtext-list">
      {citationKeys.map((key) => {
        const citation = CITATION_MAPPING[key];
        if (!citation) return null;

        const { authorsShort, assoiciatedDois = [] } = citation;
        if (assoiciatedDois.length === 0) return null;

        const selectedDois = doiIndices
          .map((i) => assoiciatedDois[i])
          .filter(Boolean);

        const mainDoi = selectedDois[0];
        if (!mainDoi) return null;

        return (
          <div key={key} className="citationtext-item">
            {/* Main citation line */}
            <a
              className="citation-a"
              href={`https://doi.org/${mainDoi.doi}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaBook size={16} /> {authorsShort}, {mainDoi.journalRefShort} (
              {mainDoi.year})
            </a>

            {/* DOI badges */}
            {selectedDois.map((d) => (
              <span key={d.doi} className="citationtext-inline-badge">
                <DoiBadge
                  doi={d.doi}
                  label={d.type === "data" ? "Data DOI" : "Paper DOI"}
                  color={d.type === "data" ? "#a2cbff" : "#a2e5b7"}
                />
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};
