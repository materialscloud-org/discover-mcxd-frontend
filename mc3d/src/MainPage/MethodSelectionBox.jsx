import { Dropdown, Popover } from "react-bootstrap";

import { HelpButton } from "mc-react-library";

import {
  MechanicalIcon,
  SuperconductivityIcon,
  VibrationalIcon,
} from "../assets/sectionIcons";

import "./MethodSelectionBox.css";

const popover = (
  <Popover id="popover-basic">
    <Popover.Header>
      <b>Datasets & views</b>
    </Popover.Header>
    <Popover.Body style={{ textAlign: "justify" }}>
      <p>
        MC3D contains <b>structure datasets</b> - collections computed with one
        consistent computational approach. The label (e.g., <i>PBEsol-v1</i>)
        contains the physical methodology and a version suffix representing the
        computational protocol.
      </p>
      <p>
        Structure datasets can have associated property contributions (e.g.,
        Superconductivity), and the corresponding <b>property-based views</b>{" "}
        allow to sort and filter the relevant data.
      </p>
      <p>
        Use the menu to select either a structure dataset or a property view.
        See the <b>About</b> tab and the publication for details.
      </p>
    </Popover.Body>
  </Popover>
);

export const MethodSelectionBox = (props) => {
  const structureOptions = {
    "pbesol-v2": "PBEsol-v2",
    "pbesol-v1": "PBEsol-v1",
    "pbe-v1": "PBE-v1",
  };

  Object.keys(structureOptions).forEach((key) => {
    if (props.genInfo?.["method-counts"]?.[key] != null) {
      structureOptions[key] += ` (${props.genInfo["method-counts"][key]})`;
    }
  });

  const viewOptions = [
    {
      value: "superconductivity",
      label: "Superconductivity (PBEsol-v1)",
      icon: <SuperconductivityIcon />,
    },
    {
      value: "phonons",
      label: "Phonons (PBEsol-v1)",
      icon: <VibrationalIcon />,
    },
    {
      value: "mechanical",
      label: "Mechanical (PBEsol-v1)",
      icon: <MechanicalIcon />,
    },
  ];

  const displayValue = props.selectedDisplay || props.method;

  const selectedView = viewOptions.find(({ value }) => value === displayValue);

  const handleSelect = (value) => {
    props.handleMethodChange({
      target: { value },
    });
  };

  return (
    <div className="method-selection-box-outer">
      <div className="method-selection-box">
        <p>Select a dataset or view:</p>

        <Dropdown>
          <Dropdown.Toggle
            className="method-selection-panel"
            size="sm"
            variant="light"
          >
            <span className="method-selection-selected">
              {selectedView?.icon}
              <span>
                {selectedView?.label || structureOptions[displayValue]}{" "}
              </span>
            </span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Header className="method-selection-category">
              Structure datasets
            </Dropdown.Header>

            {Object.entries(structureOptions).map(([value, label]) => (
              <Dropdown.Item
                key={value}
                active={displayValue === value}
                onClick={() => handleSelect(value)}
                className="method-selection-entry"
              >
                <span>{label}</span>
              </Dropdown.Item>
            ))}

            <Dropdown.Header className="method-selection-category">
              Property-based views
            </Dropdown.Header>

            {viewOptions.map(({ value, label, icon }) => (
              <Dropdown.Item
                key={value}
                active={displayValue === value}
                onClick={() => handleSelect(value)}
                className="method-selection-entry"
              >
                {icon}
                <span>{label}</span>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <HelpButton popover={popover} placement="bottom" />
      </div>
    </div>
  );
};
