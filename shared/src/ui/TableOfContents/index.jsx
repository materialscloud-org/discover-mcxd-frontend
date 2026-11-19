import { useEffect, useState } from "react";
import "./index.css";

import {
  FloatingCard,
  MinimisedFab,
  MenuFab,
  MenuOverlay,
} from "../FloatingPanel/index.jsx";

const SECTION_ATTR = "data-toc-section";

function scrollToSection(id) {
  const el = document.querySelector(`[${SECTION_ATTR}="${id}"]`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // update hash without jumping
    window.history.replaceState(null, "", `#${id}`);
  }
}

/**
 * registry: [{ id, label, logo }] — central per-app definition.
 * Entries are built from the existing HTML: only registry ids actually
 * present in the DOM (async/conditional sections appear on their own)
 * are shown, in registry order.
 */
function useTocItems(registry) {
  const [visibleIds, setVisibleIds] = useState([]);

  useEffect(() => {
    const scan = () => {
      const found = registry
        .filter(({ id }) => document.querySelector(`[${SECTION_ATTR}="${id}"]`))
        .map(({ id }) => id);
      setVisibleIds((prev) =>
        prev.length === found.length && prev.every((v, i) => v === found[i])
          ? prev
          : found,
      );
    };

    scan();

    // pick up sections that mount late (async data)
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });

    // honour deep links once sections exist
    const hash = window.location.hash.slice(1);
    if (hash && document.querySelector(`[${SECTION_ATTR}="${hash}"]`)) {
      document
        .querySelector(`[${SECTION_ATTR}="${hash}"]`)
        ?.scrollIntoView({ block: "start" });
    }

    return () => observer.disconnect();
  }, [registry]);

  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (!visibleIds.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.getAttribute(SECTION_ATTR));
          }
        }
      },
      {
        // highlight the section whose top is near the viewport top
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0,
      },
    );

    const elements = visibleIds
      .map((id) => document.querySelector(`[${SECTION_ATTR}="${id}"]`))
      .filter(Boolean);

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [visibleIds]);

  const items = registry.filter(({ id }) => visibleIds.includes(id));
  return { items, activeId };
}

function TocLabel({ item }) {
  if (!item.logo) return item.label;
  return (
    <>
      <span className="mcxd-toc-icon" aria-hidden="true">
        {item.logo}
      </span>
      {item.label}
    </>
  );
}

const TOC_MIN_KEY = "mcxd-toc-minimized";

export default function TableOfContents({ registry }) {
  const { items, activeId } = useTocItems(registry);
  const [minimized, setMinimized] = useState(() => {
    try {
      return window.localStorage.getItem(TOC_MIN_KEY) === "1";
    } catch {
      return false;
    }
  });

  const setMinimizedPersist = (value) => {
    setMinimized(value);
    try {
      window.localStorage.setItem(TOC_MIN_KEY, value ? "1" : "0");
    } catch {
      /* storage unavailable - ignore */
    }
  };

  if (!items.length) return null;

  if (minimized) {
    return (
      <MinimisedFab
        onExpand={() => setMinimizedPersist(false)}
        label="Show table of contents"
      />
    );
  }

  return (
    <FloatingCard title="Contents" onMinimise={() => setMinimizedPersist(true)}>
      <ul className="mcxd-toc-list">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={activeId === item.id ? "active" : ""}
              aria-current={activeId === item.id ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.id);
              }}
            >
              <TocLabel item={item} />
            </a>
          </li>
        ))}
      </ul>
    </FloatingCard>
  );
}

export function TableOfContentsMenu({ registry }) {
  const { items, activeId } = useTocItems(registry);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!items.length) return null;

  return (
    <>
      <MenuFab
        open={open}
        onToggle={() => setOpen((v) => !v)}
        openLabel="Open table of contents"
        closeLabel="Close table of contents"
      />
      <MenuOverlay open={open} onClose={() => setOpen(false)} title="Contents">
        <ul className="mcxd-toc-list">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={activeId === item.id ? "active" : ""}
                aria-current={activeId === item.id ? "true" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                  setOpen(false);
                }}
              >
                <TocLabel item={item} />
              </a>
            </li>
          ))}
        </ul>
      </MenuOverlay>
    </>
  );
}
