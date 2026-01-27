import { useEffect, useState, useRef } from "react";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import "./index.css";

import { Container, Tab, Tabs } from "react-bootstrap";
import MaterialsCloudHeader from "mc-react-header";
import MaterialSelector from "mc-react-ptable-materials-grid";

import TitleAndLogo from "../common/TitleAndLogo";
import { aboutText } from "./about";
import { restapiText } from "./restapi";
import { loadDataMc3d } from "./loadDataMc3d";
import { DownloadButton } from "./DownloadButton";
import { MethodSelectionBox } from "./MethodSelectionBox";
import { loadGeneralInfo } from "../common/MCrestApiUtils";

import { CitationBanner } from "@mcxd/shared";

import {
  updateColumnsFromUrl,
  getMethodFromUrl,
  getMethodFromPreset,
  getPresetColumnFilters,
} from "./handleUrlParams";

const DEFAULT_METHOD = "pbesol-v2";
const sessionDataCache = {};

const tabRoutes = {
  use: "/",
  about: "/about",
  restapi: "/restapi",
};

// MC3D Landing page React component.
function MainPage({ tab }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(tab || "use");

  useEffect(() => {
    const pathTab =
      location.pathname === "/" ? "use" : location.pathname.slice(1);
    setActiveTab(pathTab);
  }, [location]);

  const handleTabSelect = (selectedTab) => {
    navigate(tabRoutes[selectedTab]);
  };

  const urlParams = new URLSearchParams(location.search);

  const [genInfo, setGenInfo] = useState(null);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  // derive current method, preset and filters directly from URL
  const preset = urlParams.get("preset") || null;
  const method = preset
    ? getMethodFromPreset(preset)
    : getMethodFromUrl(urlParams, DEFAULT_METHOD);
  const columnFilters = getPresetColumnFilters(preset);

  const materialSelectorRef = useRef(null);

  useEffect(() => {
    loadGeneralInfo().then(setGenInfo);
  }, []);

  useEffect(() => {
    // check the cache to see if it already exists.
    const key = preset || method;
    if (sessionDataCache[key]) {
      const cached = sessionDataCache[key];
      setColumns(updateColumnsFromUrl(cached.columns, urlParams));
      setRows(cached.rows);
      return;
    }
    // if not load it and cache it.
    loadDataMc3d(method).then((loadedData) => {
      sessionDataCache[key] = loadedData;
      const updatedColumns = updateColumnsFromUrl(
        loadedData.columns,
        urlParams,
      );
      setColumns(updatedColumns);
      setRows(loadedData.rows);
    });
  }, [method, preset]);

  const handleMethodChange = (event) => {
    const selected = event.target.value;
    const url = new URL(window.location);

    if (selected === "superconductivity" || selected === "phonons") {
      url.searchParams.set("preset", selected);
      url.searchParams.delete("method");
    } else {
      url.searchParams.set("method", selected);
      url.searchParams.delete("preset");
    }

    navigate(`${location.pathname}?${url.searchParams.toString()}`, {
      replace: true,
    });
    setRows([]);
  };

  return (
    <>
      <MaterialsCloudHeader
        className="header"
        activeSection={"discover"}
        breadcrumbsPath={[
          {
            name: "Discover",
            link: "https://www.materialscloud.org/discover",
          },
          {
            name: "Materials Cloud Three-Dimensional Structure Database",
            link: null,
          },
        ]}
      />
      <Container fluid="xxl">
        <TitleAndLogo />
        <div className="description">
          The Materials Cloud Three-Dimensional Structure Database is a curated
          dataset of unique, stoichiometric, experimentally known inorganic
          compounds, and of their calculated properties. Structures have been
          obtained with fully-relaxed density-functional theory calculations,
          starting from experimental ones imported, cleaned and parsed from the
          MPDS, COD and ICSD databases. For more details, please see the related
          publication:
          <div style={{ margin: "10px" }}>
            <CitationBanner citationKeys={["HuberMc3d25"]} />
          </div>
        </div>

        <Tabs
          className="main-tabs"
          activeKey={activeTab}
          onSelect={handleTabSelect}
        >
          {" "}
          <Tab eventKey="use" title="Use">
            <MethodSelectionBox
              genInfo={genInfo}
              method={method}
              selectedDisplay={preset || null} // display "preset value" if preset active
              handleMethodChange={handleMethodChange}
            />
            {/* <div className="description">
              Search for materials in the selected subdatabase by filtering
              based on the periodic table and the columns of the table below:
            </div> */}
            <MaterialSelector
              ref={materialSelectorRef}
              columns={columns}
              rows={rows}
              columnFilters={columnFilters}
            />
            <DownloadButton
              materialSelectorRef={materialSelectorRef}
              disabled={rows.length == 0}
              methodLabel={method}
            />
          </Tab>
          <Tab eventKey="about" title="About">
            {aboutText}
          </Tab>
          <Tab eventKey="restapi" title="REST API">
            {restapiText}
          </Tab>
        </Tabs>
      </Container>
    </>
  );
}

export default MainPage;
