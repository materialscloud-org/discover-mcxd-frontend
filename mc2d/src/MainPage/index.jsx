import React, { useEffect, useState, useRef } from "react";

import { useNavigate } from "react-router-dom";

import "./index.css";

import MaterialsCloudHeader from "mc-react-header";

import MaterialSelector from "mc-react-ptable-materials-grid";

import TitleAndLogo from "../common/TitleAndLogo";

import { Container, Tab, Tabs, Form } from "react-bootstrap";

import { aboutText } from "./about";
import { restapiText } from "./restapiText";

import { loadIndexMc2d } from "./loadIndexMc2d";

import { DownloadButton } from "./DownloadButton.jsx";
import { CitationsList } from "../common/CitationsList.jsx";

const MainPage = ({ tab }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(tab || "use");

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    loadIndexMc2d().then((loadedData) => {
      setColumns(loadedData.columns);
      setRows(loadedData.rows);
    });
  }, []);

  const materialSelectorRef = useRef(null);

  const handleTabSelect = (selectedTab) => {
    setActiveTab(selectedTab);
    if (selectedTab == "use") {
      navigate(`/`);
    } else {
      navigate(`/${selectedTab}`);
    }
  };

  return (
    <MaterialsCloudHeader
      activeSection={"discover"}
      breadcrumbsPath={[
        { name: "Discover", link: "https://www.materialscloud.org/discover" },
        {
          name: "Materials Cloud Two-Dimensional Structure Database",
          link: null,
        },
      ]}
    >
      <Container fluid="xxl">
        <TitleAndLogo />
        <div className="description">
          Materials Cloud Two-Dimensional Structure Database is a curated set of
          2D materials obtained by screening most known 3D crystal structures by
          a computational exfoliation procedure. This database contains the
          relaxed 2D materials and their various properties. For more details,
          please see the related publications:
          <div style={{ margin: "10px" }}>
            <CitationsList citationLabels={["Mounet18", "Campi23"]} />
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
      </Container>
    </MaterialsCloudHeader>
  );
};

export default MainPage;
