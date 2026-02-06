import "./TitleAndLogo.css";

import { DoiBadge } from "mc-react-library";

export function TitleAndLogo({
  titleString = "Materials Cloud X-Dimensional Structure Database (MCXD)",
  imgSrc = null,
  doiIds = null,
}) {
  return (
    <div className="title-and-logo">
      <div className="title-and-doi">
        <span className="title-span">{titleString}</span>
        <div className="doi-container" style={{ marginLeft: "4px" }}>
          {doiIds.map((doiId) => (
            <DoiBadge key={doiId} doi_id={doiId} label="Data DOI" />
          ))}
        </div>
      </div>
      <img src={imgSrc} className="mc3d-logo" alt="MC3D Logo" />
    </div>
  );
}
