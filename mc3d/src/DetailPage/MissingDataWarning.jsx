import { Button } from "react-bootstrap";

import PageLayout from "../Layout";

// full page error component to handle when data is missing.
export default function MissingDataWarning({ params, navigate }) {
  return (
    <PageLayout>
      <div
        style={{
          textAlign: "center",
          marginTop: "5rem",
          marginBottom: "25rem",
        }}
      >
        <div
          style={{
            color: "red",
            fontSize: "large",
            marginBottom: "0.5rem",
          }}
        >
          {`Oops! You tried to visit ${params.id}/${params.method} but something went wrong.`}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Button variant="primary" onClick={() => navigate(0)}>
            Try Again
          </Button>
          <Button variant="primary" onClick={() => navigate("/")}>
            Home Page
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
