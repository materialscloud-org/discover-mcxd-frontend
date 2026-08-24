import Form from "react-bootstrap/Form";

const CELL_OPTIONS = [
  { value: "aiida", label: "As calculated" },
  { value: "primitive", label: "Primitive" },
  { value: "conventional", label: "Conventional" },
];

export default function CellSelector({ value, onChange }) {
  return (
    <Form.Select
      size="sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "auto",
        borderColor: "#a09f9f",
        fontWeight: "500",
        fontSize: "14.px",
        color: "#454444",
      }}
    >
      {CELL_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Form.Select>
  );
}
