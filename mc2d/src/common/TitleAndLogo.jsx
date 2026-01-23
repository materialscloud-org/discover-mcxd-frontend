import React from "react";

import "./TitleAndLogo.css";

import Mc2dLogo from "../assets/mc2d.png";

import { DoiBadge } from "mc-react-library";

export default function TitleAndLogo() {
  return (
    <div className="title-and-logo">
      <div className="title-and-doi">
        <span className="title-span">
          Materials Cloud Two-Dimensional Structure Database (MC2D)
        </span>
        <div className="doi-container">
          <DoiBadge doi_id="az-b2" label="Data DOI" />
          <DoiBadge doi_id="36-nd" label="Data DOI" />
        </div>
      </div>
      <img src={Mc2dLogo} className="mc2d-logo"></img>
    </div>
  );
}
