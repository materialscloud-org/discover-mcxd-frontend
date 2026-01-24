import * as React from "react";

export function ExampleButton(props) {
  return (
    <button
      {...props}
      style={{
        padding: "8px 12px",
        borderRadius: 8,
        border: "1px solid #ccc",
        background: "orange",
        cursor: "pointer",
        ...props.style,
      }}
    />
  );
}
