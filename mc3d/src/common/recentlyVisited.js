import { Store } from "@tanstack/store";

const STORAGE_KEY = "mc3d-recently-visited";
const MAX_ENTRIES = 30;

function loadEntries() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((e) => e && typeof e.id === "string");
  } catch {
    return [];
  }
}

// Entries: { id, method, formula, spacegroup, visitedAt }.
export const recentlyVisitedStore = new Store({ entries: loadEntries() });

recentlyVisitedStore.subscribe(() => {
  try {
    const next = JSON.stringify(recentlyVisitedStore.state.entries);
    // only write when changed: unconditional writes re-fire storage
    // events in other tabs, causing a cross-tab update loop.
    if (window.localStorage.getItem(STORAGE_KEY) !== next) {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  } catch {
    /* storage unavailable - ignore */
  }
});

export function recordVisit(entry) {
  if (!entry?.id) return;
  recentlyVisitedStore.setState((state) => ({
    entries: [
      { ...entry, visitedAt: Date.now() },
      ...state.entries.filter(
        (e) => !(e.id === entry.id && e.method === entry.method),
      ),
    ].slice(0, MAX_ENTRIES),
  }));
}

export function clearRecentlyVisited() {
  recentlyVisitedStore.setState(() => ({ entries: [] }));
}
