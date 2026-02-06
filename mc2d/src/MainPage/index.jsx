import React, { useEffect, useState, useRef } from "react";

import { useNavigate, useLocation } from "react-router-dom";

import "./index.css";

import MaterialSelector from "mc-react-ptable-materials-grid";

import { Tab, Tabs } from "react-bootstrap";

import { aboutText } from "./about";
import { restapiText } from "./restapiText";

import { loadIndexMc2d } from "./loadIndexMc2d";

import { DownloadButton } from "./DownloadButton";

import { CitationBanner } from "@mcxd/shared";

import PageLayout from "../Layout/index";

const tabRoutes = { use: "/", about: "/about", restapi: "/restapi" };

const MainPage = ({ tab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(tab || "use");

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const pathTab =
      location.pathname === "/" ? "use" : location.pathname.slice(1);
    setActiveTab(pathTab);
  }, [location]);

  useEffect(() => {
    loadIndexMc2d().then((loadedData) => {
      setColumns(loadedData.columns);
      setRows(loadedData.rows);
    });
  }, []);

  const materialSelectorRef = useRef(null);

  const handleTabSelect = (selectedTab) => {
    navigate(tabRoutes[selectedTab]);
  };

  return (
    <PageLayout>
      <div className="description">
        Materials Cloud Two-Dimensional Structure Database is a curated set of
        2D materials obtained by screening most known 3D crystal structures by a
        computational exfoliation procedure. This database contains the relaxed
        2D materials and their various properties. For more details, please see
        the related publications:
        <div style={{ margin: "10px" }}>
          <CitationBanner citationKeys={["Mounet18", "Campi23"]} />
        </div>
      </div>
      <Tabs
        className="main-tabs"
        activeKey={activeTab}
        onSelect={handleTabSelect}
      >
        <Tab eventKey="use" title="Use">
          <div style={{ marginTop: "20px" }}></div>
          <MaterialSelector
            ref={materialSelectorRef}
            columns={columns}
            rows={rows}
          />
          <DownloadButton
            materialSelectorRef={materialSelectorRef}
            disabled={rows.length == 0}
          />
        </Tab>
        <Tab eventKey="about" title="About">
          {aboutText}
        </Tab>
        <Tab eventKey="restapi" title="REST API">
          {restapiText}
        </Tab>
      </Tabs>
    </PageLayout>
  );
};

export default MainPage;
