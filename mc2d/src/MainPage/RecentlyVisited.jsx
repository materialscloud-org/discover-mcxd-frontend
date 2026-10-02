import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import { useStore } from "@tanstack/react-store";
import { formatChemicalFormula } from "mc-react-library";

import { FloatingCard, MinimisedFab, MenuFab, MenuOverlay } from "@mcxd/shared";

import { recentlyVisitedStore } from "../common/recentlyVisited";

function EntryItems({ entries, onNavigate }) {
  return entries.map((entry) => (
    <ListGroup.Item
      key={entry.id}
      action
      as={Link}
      to={`/details/${entry.id}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onNavigate}
    >
      <div className="">
        {formatChemicalFormula(entry.formula)} ({entry.id})
      </div>
      {entry.spacegroup && (
        <div className="small text-muted" style={{ paddingLeft: "4px" }}>
          Space group: {entry.spacegroup}
        </div>
      )}
    </ListGroup.Item>
  ));
}

export default function RecentlyVisited() {
  const entries = useStore(recentlyVisitedStore, (s) => s.entries);
  const [minimized, setMinimized] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  if (entries.length === 0) return null;

  return (
    <>
      {!minimized && (
        <FloatingCard
          title="Recently visited"
          onMinimise={() => setMinimized(true)}
        >
          <ListGroup variant="flush">
            <EntryItems entries={entries} />
          </ListGroup>
        </FloatingCard>
      )}
      {minimized && (
        <MinimisedFab
          onExpand={() => setMinimized(false)}
          label="Show recently visited"
        />
      )}
      <MenuFab
        open={mobileOpen}
        onToggle={() => setMobileOpen((v) => !v)}
        openLabel="Open recently visited"
        closeLabel="Close recently visited"
      />
      <MenuOverlay
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Recently visited"
      >
        <ListGroup variant="flush">
          <EntryItems
            entries={entries}
            onNavigate={() => setMobileOpen(false)}
          />
        </ListGroup>
      </MenuOverlay>
    </>
  );
}
