import "./CitationBox.css";

export default function CitationBox(props) {
  return (
    <div className="citationbox-container">
      <b>{props.title}</b>
      <br />
      {props.authors}, {props.journal}, doi:{" "}
      <a href={`https://doi.org/${props.doi}`} target="_blank">
        {props.doi}
      </a>{" "}
      ({props.year})<br />
      {props.data ? (
        <div className="citationbox-extras">
          <b>Accompanying data: </b>
          {props.data}
        </div>
      ) : null}
      {props.arxiv ? (
        <div className="citationbox-extras">
          <b>arXiv: </b>
          {props.arxiv}
        </div>
      ) : null}
    </div>
  );
}
