import React, { useState, useEffect } from "react";

import { McloudSpinner } from "mc-react-library";

import { MCInfoBox } from "../components/MCInfoBox";

import { Container, Row, Col } from "react-bootstrap";

import StructureVisualizer from "mc-react-structure-visualizer";

import {
  ExploreButton,
  StructDownloadButton,
  formatChemicalFormula,
  formatSpaceGroupSymbol,
} from "mc-react-library";

import {
  AIIDA_REST_API_URL,
  EXPLORE_URL,
  loadAiidaAttributes,
  loadAiidaCif,
} from "../../common/restApiUtils";

import { getSymmetryInfo } from "mc-react-library";

import Form from "react-bootstrap/Form";

import { formatAiidaProp, formatSourceLink } from "../utils";

function ParentInfoBox({ parentInfo, symmetryInfo }) {
  return (
    <MCInfoBox style={{ height: "450px" }}>
      <div>
        <b>General info</b>
        <ul className="no-bullets">
          <li>Formula: {formatChemicalFormula(parentInfo.formula)}</li>
          <li>
            Source database:{" "}
            {formatSourceLink(parentInfo.source_db, parentInfo.source_db_id)}
          </li>
          <li>
            Bravais lattice: {symmetryInfo.bravais_lattice} (
            {symmetryInfo.bravais_lattice_pearson})
          </li>
          <li>
            Space group symbol:{" "}
            {formatSpaceGroupSymbol(symmetryInfo.space_group_symbol)}
          </li>
          <li>Space group number: {parentInfo.space_group_number}</li>
        </ul>
      </div>
      <div>
        <b>Binding energies</b>
        <ul className="no-bullets">
          <li>
            DF2-C09 Binding energy:{" "}
            {formatAiidaProp(parentInfo.binding_energy_df2, "meV/Å²", 1)}
          </li>
          <li>
            rVV10 Binding energy:{" "}
            {formatAiidaProp(parentInfo.binding_energy_rvv10, "meV/Å²", 1)}
          </li>
        </ul>
      </div>
      <div>
        <b>Delta in interlayer distance (vdW vs revPBE)</b>
        <ul className="no-bullets">
          <li>
            Δ<sub>DF2</sub>:{" "}
            {formatAiidaProp(parentInfo.delta_df2, "%", 1, 100)}
          </li>
          <li>
            Δ<sub>rVV10</sub>:{" "}
            {formatAiidaProp(parentInfo.delta_rvv10, "%", 1, 100)}
          </li>
        </ul>
      </div>
    </MCInfoBox>
  );
}

const StructureViewerBox = ({ uuid, structureInfo }) => {
  return (
    <>
      <div className="subsection-title">
        Structure <ExploreButton explore_url={EXPLORE_URL} uuid={uuid} />
      </div>
      <div className="structure-view-box subsection-shadow">
        <StructureVisualizer
          cifText={structureInfo.cif}
          initSupercell={[2, 2, 2]}
        />
        <div className="download-button-container">
          <StructDownloadButton
            aiida_rest_url={AIIDA_REST_API_URL}
            uuid={uuid}
          />
        </div>
      </div>
    </>
  );
};

async function fetchParentStructure(uuid) {
  let aiidaAttributes = await loadAiidaAttributes(uuid);
  let structureCif = await loadAiidaCif(uuid);
  return { aiidaAttributes: aiidaAttributes, cif: structureCif };
}

const ParentsSection = (props) => {
  const [selectedParentIndex, setSelectedParentIndex] = useState(0);
  const [parentStructureInfo, setParentStructureInfo] = useState(null);
  // const [selectedParent, setSelectedParent] = useState(parentsList[0]);

  let parentsList = props.loadedData.details.parents_3d;
  let selectedParentUuid =
    parentsList[selectedParentIndex].initial_structure_uuid;

  let symmetryInfoList = [];
  parentsList.forEach((parent) => {
    symmetryInfoList.push(getSymmetryInfo(parent.space_group_number));
  });

  useEffect(() => {
    if (selectedParentUuid) {
      fetchParentStructure(selectedParentUuid).then((loaded) => {
        setParentStructureInfo(loaded);
      });
    } else {
      setParentStructureInfo(null);
    }
  }, [selectedParentIndex]);

  let loadingStructure =
    selectedParentUuid != null && parentStructureInfo == null;

  let naMsg = "Parent structure not available.";
  if (
    parentsList[selectedParentIndex].source_db == "ICSD" ||
    parentsList[selectedParentIndex].source_db == "MPDS"
  ) {
    naMsg = (
      <span>
        Parent structures originating from ICSD and MPDS cannot be displayed
        here for licensing reasons. Link to see the structure in the original
        database:{" "}
        {formatSourceLink(
          parentsList[selectedParentIndex].source_db,
          parentsList[selectedParentIndex].source_db_id,
        )}
        .
      </span>
    );
  }

  let structurePanel = <div style={{ margin: "71px 40px 0px" }}>{naMsg}</div>;

  if (loadingStructure) {
    structurePanel = (
      <div style={{ width: "150px", padding: "40px", margin: "0 auto" }}>
        <McloudSpinner />
      </div>
    );
  }

  if (parentStructureInfo != null) {
    structurePanel = (
      <StructureViewerBox
        uuid={selectedParentUuid}
        structureInfo={parentStructureInfo}
      />
    );
  }

  return (
    <div>
      <div id="parents-section" className="section-heading">
        3D parent crystals
      </div>
      <Container fluid className="section-container">
        <Row>
          <Col className="flex-column">
            <span>
              Select parent crystal:
              <Form.Select
                size="sm"
                style={{
                  display: "inline",
                  margin: "4px 6px 2px 6px",
                }}
                value={selectedParentIndex}
                onChange={(v) => {
                  setSelectedParentIndex(v.target.value);
                }}
              >
                {parentsList.map((e, i) => (
                  <option key={e.source_db_id} value={i}>
                    {e.formula} - {symmetryInfoList[i].space_group_symbol} (
                    {e.source_db} {e.source_db_id})
                  </option>
                ))}
              </Form.Select>
            </span>
            <div style={{ marginTop: "10px" }}>
              <ParentInfoBox
                parentInfo={parentsList[selectedParentIndex]}
                symmetryInfo={symmetryInfoList[selectedParentIndex]}
              />
            </div>
          </Col>
          <Col className="flex-column">{structurePanel}</Col>
        </Row>
      </Container>
    </div>
  );
};

export default ParentsSection;
