import "./McInfoBox.css";

export const McInfoBox = ({ children, style = null }) => {
  return (
    <div style={style}>
      <div className="mc-info-container subsection-shadow overflow-auto rounded">
        {children}
      </div>
    </div>
  );
};
