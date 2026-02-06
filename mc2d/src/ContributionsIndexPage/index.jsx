import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkFootnotes from "remark-footnotes";

import "katex/dist/katex.min.css";
import { Container, Table } from "react-bootstrap";
import { McloudSpinner } from "mc-react-library";

import "../ContributionsPage/index.css";
import PageLayout from "../Layout";

function ContributionsIndexPage() {
  const [markdown, setMarkdown] = useState(null);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    // Load the preface.md as the main index content
    fetch("/contributions/preface.md")
      .then((res) => (res.ok ? res.text() : Promise.reject()))
      .then(setMarkdown)
      .catch(() => setMarkdown("NOT_FOUND"));

    // Load the contributions.json for the table
    fetch("/contributions/contributions.json")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        // Exclude preface from the "other contributions" table
        const filtered = data.filter((c) => c.slug !== "preface");
        setEntries(filtered);
      })
      .catch(() => setEntries([]));
  }, []);

  return (
    <PageLayout
      breadcrumbs={[{ name: "Extended dataset documentation", link: null }]}
    >
      {markdown === null ? (
        <div style={{ width: "150px", padding: "40px", margin: "0 auto" }}>
          <McloudSpinner />
        </div>
      ) : markdown === "NOT_FOUND" ? (
        <h3>Page not found</h3>
      ) : (
        <>
          <div className="markdown-entry">
            <ReactMarkdown
              remarkPlugins={[remarkMath, remarkGfm, remarkFootnotes]}
              rehypePlugins={[rehypeKatex]}
            >
              {markdown}
            </ReactMarkdown>
          </div>

          <>
            <div style={{ padding: "0px 20px" }}>
              <h4
                style={{
                  marginTop: "2rem",
                  fontSize: "20px",
                  fontWeight: 400,
                }}
              >
                Contributed sections
              </h4>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((c) => (
                    <tr key={c.slug}>
                      <td>
                        <Link to={`/contributions/${c.slug}`}>{c.title}</Link>
                      </td>
                      <td>{c.description}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </>
        </>
      )}
    </PageLayout>
  );
}

export default ContributionsIndexPage;
