import React from "react";

import Form from "react-bootstrap/Form";

import { useNavigate } from "react-router-dom";

function extractIntId(strId) {
  return parseInt(strId.split(/-|\//)[1]);
}

export default function RelatedSection({
  params,
  loadedData,
  currentStructure,
  sameFormulaStructures,
}) {
  let aiidaRestEndpoint = loadedData.aiidaRestEndpoint;
  let details = loadedData.details;
  let metadata = loadedData.metadata;
  let structureInfo = loadedData.structureInfo;

  const navigate = useNavigate();

  let formula = currentStructure.compound;

  let currentId = `${currentStructure.id}/${currentStructure.functional}`;

  let formatedArr = [];

  sameFormulaStructures.ids.forEach((id, index) => {
    let sg = sameFormulaStructures.spacegrps[index];
    formatedArr.push({ id: id, sg: sg });
  });

  // sort by the numerical value of mc3d-id
  formatedArr.sort((a, b) => extractIntId(a.id) - extractIntId(b.id));

  return (
    <div className="selection-section">
      <b>Related structures</b>
      <br />
      <span>
        Crystals with this chemical formula
        <Form.Select
          size="sm"
          style={{
            width: "340px",
            display: "inline",
            margin: "4px 6px 2px 6px",
          }}
          value={currentId}
          onChange={(v) => {
            navigate(
              `${process.env.PUBLIC_URL}/details/${formula}/${v.target.value}`,
            );
            // navigate(0);
          }}
        >
          {formatedArr.map((e) => (
            <option key={e.id} value={e.id}>
              {e.id} (spacegroup {e.sg})
            </option>
          ))}
        </Form.Select>
      </span>
    </div>
  );
}
