import React, { useEffect, useState, useRef } from "react";

import { useNavigate, useLocation } from "react-router-dom";

import "./index.css";

import { MaterialSelector } from "@mcxd/shared";

import { Tab, Tabs } from "react-bootstrap";

import { aboutText } from "./about";
import { restapiText } from "./restapiText";

import { loadIndexMc2d } from "./loadIndexMc2d";
import { MethodSelectionBox } from "./MethodSelectionBox";

import { DownloadButton } from "./DownloadButton";

import { CitationBanner } from "@mcxd/shared";

import {
  updateColumnsFromUrl,
  getMethodFromUrl,
  getMethodFromPreset,
  getPresetColumnFilters,
} from "./handleUrlParams";

import PageLayout from "../Layout/index";

const tabRoutes = { use: "/", about: "/about", restapi: "/restapi" };

const DEFAULT_METHOD = "pbe-v1";
const sessionDataCache = {};

const MainPage = ({ tab }) => {
  const navigate = useNavigate();
  const location = useLocation();
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
    // check the cache to see if it already exists.
    const key = preset || method;
    if (sessionDataCache[key]) {
      const cached = sessionDataCache[key];
      setColumns(updateColumnsFromUrl(cached.columns, urlParams));
      setRows(cached.rows);
      return;
    }
    // if not load it and cache it.
    loadIndexMc2d().then((loadedData) => {
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

    if (selected === "2dtopo") {
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

  useEffect(() => {
    if (!materialSelectorRef.current) return;

    materialSelectorRef.current.clearFilters?.();

    if (Object.keys(columnFilters).length > 0) {
      materialSelectorRef.current.setFilters?.(columnFilters);
    }
  }, [columnFilters]);

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
          {/* <MethodSelectionBox
            method={method}
            selectedDisplay={preset || null} // display "preset value" if preset active
            handleMethodChange={handleMethodChange}
          /> */}
          <MaterialSelector
            ref={materialSelectorRef}
            columns={columns}
            rows={rows}
            columnFilters={columnFilters}
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
