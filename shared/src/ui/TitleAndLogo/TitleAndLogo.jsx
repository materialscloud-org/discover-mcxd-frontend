import "./TitleAndLogo.css";

import Mc3dLogo from "./mc3d.png";

import { DoiBadge } from "mc-react-library";

export function TitleAndLogo({
  mcxd,
  // titleString = "Materials Cloud X-Dimensional Structure Database (MCXD)",
  // imgSrc = null,
  // doiIds = null,
}) {
  let titleString = "Materials Cloud X-Dimensional Structure Database (MCXD)";
  let imgSrc = null;
  let doiIds = null;
  if (mcxd === "mc3d") {
    titleString = "Materials Cloud Three-Dimensional Structure Database (MC3D)";
    imgSrc = Mc3dLogo;
    doiIds = ["rw-t0"];
  }

  console.log(doiIds);

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
