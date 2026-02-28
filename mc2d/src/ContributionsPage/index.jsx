import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Markdown & plugins
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkFootnotes from "remark-footnotes";

import "katex/dist/katex.min.css";
import "./index.css";

import PageLayout from "../Layout";
import { McloudSpinner } from "mc-react-library";

function ContributionsPage() {
  const { page } = useParams(); // URL param
  const navigate = useNavigate(); // hook for programmatic navigation
  const [markdown, setMarkdown] = useState(null);
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    if (!page) return;

    setMarkdown(null);
    setMetadata(null);

    // Load JSON metadata for this contribution
    fetch("/contributions/contributions.json")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        const entry = data.find((c) => c.slug === page);
        if (!entry) {
          // redirect if contribution doesn't exist
          navigate("/contributions", { replace: true });
          return;
        }
        setMetadata(entry);
      })
      .catch(() => {
        navigate("/contributions", { replace: true });
      });

    // Load markdown from its nested folder
    fetch(`/contributions/${page}/${page}.md`)
      .then((res) => {
        if (!res.ok) throw new Error("Markdown not found");
        return res.text();
      })
      .then(setMarkdown)
      .catch(() => {
        navigate("/contributions", { replace: true });
      });
  }, [page, navigate]);

  const title = metadata?.title || page;

  return (
    <PageLayout
      breadcrumbs={[
        {
          name: "Extended dataset documentation",
          link: `${import.meta.env.BASE_URL}contributions`,
        },
        { name: title, link: null },
      ]}
    >
      {markdown === null ? (
        <div style={{ width: "150px", padding: "40px", margin: "0 auto" }}>
          <McloudSpinner />
        </div>
      ) : (
        <div className="markdown-entry">
          <ReactMarkdown
            remarkPlugins={[remarkMath, remarkGfm, remarkFootnotes]}
            rehypePlugins={[rehypeKatex]}
            components={{
              a: ({ ...props }) => {
                const href = props.href || "";
                const isHashLink = href.startsWith("#");

                if (isHashLink) {
                  return (
                    <a
                      {...props}
                      onClick={(e) => {
                        e.preventDefault();
                        const container =
                          e.currentTarget.closest(".markdown-entry");
                        const el = container?.querySelector(href);

                        if (el) {
                          const yOffset = -80; // header offset
                          const y =
                            el.getBoundingClientRect().top +
                            window.pageYOffset +
                            yOffset;
                          window.scrollTo({ top: y, behavior: "smooth" });

                          el.classList.add("footnote-flash");
                          setTimeout(
                            () => el.classList.remove("footnote-flash"),
                            2000,
                          );
                        }
                      }}
                    />
                  );
                }

                return (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                );
              },
              img: ({ node, ...props }) => (
                <figure style={{ textAlign: "center", margin: "2.5em 0" }}>
                  <img
                    {...props}
                    style={{
                      maxHeight: "500px",
                      width: "auto",
                      display: "inline-block",
                    }}
                  />
                  {props.alt && (
                    <figcaption
                      style={{ fontSize: "0.9em", marginTop: "0.10em" }}
                    >
                      {props.alt}
                    </figcaption>
                  )}
                </figure>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      )}
    </PageLayout>
  );
}

export default ContributionsPage;
