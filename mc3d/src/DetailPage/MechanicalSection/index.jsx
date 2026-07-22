import { Container, Row, Col, Table } from "react-bootstrap";
import { McInfoBox } from "@mcxd/shared";

export default function MechanicalSection({
  params,
  loadedData,
  mechanicalData,
}) {
  const born = mechanicalData?.mechDetails?.elastic?.SSSP?.born;
  const mechDetails = born ? Object.values(born)[0] : null;

  if (!mechDetails) return null;

  function renderValue(value) {
    // Primitive values
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return value;
    }

    // 6x6 elastic constants matrix
    if (
      Array.isArray(value) &&
      value.length > 0 &&
      value.every((row) => Array.isArray(row))
    ) {
      return (
        <Table bordered hover size="sm" responsive className="mb-0">
          <tbody>
            {value.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>
                    {typeof cell === "number" ? cell.toFixed(2) : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }

    // Array of objects (e.g. vickers_hardness)
    if (Array.isArray(value)) {
      return (
        <Table bordered hover size="sm" responsive className="mb-0">
          <tbody>
            {value.map((obj, i) =>
              Object.entries(obj).map(([k, v]) => (
                <tr key={`${i}-${k}`}>
                  <td>
                    <strong>{k}</strong>
                  </td>
                  <td>{typeof v === "number" ? v.toFixed(3) : String(v)}</td>
                </tr>
              )),
            )}
          </tbody>
        </Table>
      );
    }

    // Plain object
    if (value && typeof value === "object") {
      return (
        <>
          {Object.entries(value).map(([k, v]) => (
            <div key={k}>
              <strong>{k}: </strong>
              <span>{renderValue(v)}</span>
            </div>
          ))}
        </>
      );
    }

    return String(value);
  }

  return (
    <div>
      <div className="section-heading">Mechanical Properties</div>

      <Container fluid className="section-container">
        <Row>
          {Object.entries(mechDetails).map(([section, value]) => (
            <Col lg={6} className="mb-3" key={section}>
              <div className="subsection-title">{`${section}`}</div>

              <McInfoBox title={section}>{renderValue(value)}</McInfoBox>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
