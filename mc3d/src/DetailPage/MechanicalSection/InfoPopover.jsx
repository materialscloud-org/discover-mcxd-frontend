import { Form, Popover } from "react-bootstrap";

import { HelpButton } from "mc-react-library";

const methodPopover = (
  <Popover id="popover-basic">
    <Popover.Header>
      <b>Method details</b>
    </Popover.Header>
    <Popover.Body style={{ textAlign: "justify" }}>
      <p>
        For many materials in this dataset, elastic properties were calculated
        using different methodologies.
      </p>

      <ul className="ps-2">
        <li className="mb-2">
          <b>FD:</b> Finite displacement, which applies small strains to a
          structure and determines the elastic response from the resulting
          stresses.
        </li>
        <li className="mb-2">
          <b>Born:</b> Uses a long-wavelength expansion of the dynamical matrix
          to calculate the elastic response of a material from its atomic
          interactions.
        </li>
        <li>
          <b>VRH:</b> Voigt–Reuss–Hill averaging, which estimates the elastic
          modulus by averaging two bounds: the Voigt upper bound and the Reuss
          lower bound.
        </li>
      </ul>
    </Popover.Body>
  </Popover>
);

export function MechanicalMethodButton() {
  return (
    <>
      <HelpButton popover={methodPopover} />
    </>
  );
}
