import { useState } from "react";
import Popover from "react-bootstrap/Popover";

import IcsdLogo from "../../assets/icsd.png";
import CodLogo from "../../assets/cod.png";
import MpdsLogo from "../../assets/mpds.png";

import { HelpButton } from "mc-react-library";

import "./SourceInfo.css";

function sourceUrl(source) {
  if (source["database"] == "MPDS") {
    return `https://mpds.io/#entry/${source["id"]}`;
  }
  if (source["database"] == "COD") {
    return `http://www.crystallography.net/cod/${source["id"]}.html`;
  }
  if (source["database"] == "ICSD") {
    return `https://icsd.fiz-karlsruhe.de/linkicsd.xhtml?coll_code=${source["id"]}`;
  }
  return null;
}

const logos = {
  ICSD: IcsdLogo,
  COD: CodLogo,
  MPDS: MpdsLogo,
};

function SourceInfoText({ sources, metadata }) {
  if (!("info" in metadata)) {
    console.warn("metadata['info'] not present.");
    return null;
  }

  // aggregate flags over ALL sources: warn if any of them reports it
  let infoTextList = [];
  let infoPopupList = [];

  // safety against null values.
  let hpThresh = metadata?.info?.source?.high_pressure_threshold;
  let htThresh = metadata?.info?.source?.high_temperature_threshold;

  const hasTheoretical = sources.some((s) => s?.info?.is_theoretical);
  const hasHighPressure = sources.some((s) => s?.info?.is_high_pressure);
  const hasHighTemperature = sources.some((s) => s?.info?.is_high_temperature);

  if (hasTheoretical) {
    infoTextList.push("theoretical origin");
    infoPopupList.push("is of theoretical origin");
  }

  if (hasHighPressure && hpThresh) {
    infoTextList.push("high pressure");
    infoPopupList.push(
      `was characterized at a pressure higher than ${hpThresh.value} ${hpThresh.unit}`,
    );
  }

  if (hasHighTemperature && htThresh) {
    infoTextList.push("high temperature");
    infoPopupList.push(
      `was characterized at a temperature higher than ${htThresh.value} ${htThresh.unit}`,
    );
  }

  let infoText = "";
  if (infoTextList.length > 0) {
    infoText = infoTextList.join(" ");
    infoText = `(${infoText})`;
  }

  if (infoText == "") {
    return null;
  }

  for (let i = 0; i < infoPopupList.length; i++) {
    if (i < infoPopupList.length - 1) {
      infoPopupList[i] = infoPopupList[i] + " ";
    } else {
      infoPopupList[i] = infoPopupList[i] + ".";
    }
  }

  const sourcePopover = (
    <Popover id="popover-basic">
      <Popover.Body>
        The primary source database reported that the source crystal
        <ul style={{ margin: "0" }}>
          {infoPopupList.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </Popover.Body>
    </Popover>
  );

  return (
    <span
      style={{
        display: "inline-flex",
        gap: "5px",
        alignItems: "center",
      }}
    >
      {infoText}
      <span
        style={{
          width: "20px",
          height: "20px",
          fontSize: "14px",
        }}
      >
        <HelpButton popover={sourcePopover} placement="top" />
      </span>
    </span>
  );
}

// How many equivalent sources to show before collapsing the rest.
const MAX_VISIBLE_SOURCES = 9;

export default function SourceInfo({ sources, metadata }) {
  const [expanded, setExpanded] = useState(false);

  if (!sources || sources.length === 0) {
    return null;
  }

  const visibleSources = expanded
    ? sources
    : sources.slice(0, MAX_VISIBLE_SOURCES);
  const nHidden = sources.length - visibleSources.length;

  return (
    <>
      <span>
        <b>Sources</b> <SourceInfoText sources={sources} metadata={metadata} />
      </span>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, max-content)",
          columnGap: "20px",
          rowGap: "2px",
          justifyContent: "start",
          alignItems: "center",
          padding: "8px 0px 0px 8px",
        }}
      >
        {visibleSources.map((s) => {
          const logo = logos[s.database];

          return (
            <a
              key={`${s.database}-${s.id}`}
              className="source-a"
              href={sourceUrl(s)}
              title="Go to source data"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                gap: "5px",
                alignItems: "center",
              }}
            >
              {logo && <img src={logo} style={{ height: "20px" }} />}
              {s.database} ID: {s.id}
            </a>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {nHidden > 0 && (
          <button className="source-toggle" onClick={() => setExpanded(true)}>
            Show all {sources.length} equivalent sources...
          </button>
        )}
        {expanded && sources.length > MAX_VISIBLE_SOURCES && (
          <button className="source-toggle" onClick={() => setExpanded(false)}>
            Show fewer
          </button>
        )}
      </div>
    </>
  );
}
