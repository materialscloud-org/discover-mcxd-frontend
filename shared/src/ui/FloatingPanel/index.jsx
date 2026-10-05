import "./index.css";

export function BurgerIcon() {
  return (
    <span className="mcxd-fp-burger" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

// Fixed floating card (wide screens only, enforced by CSS).
export function FloatingCard({ title, onMinimise, minimiseLabel, children }) {
  return (
    <nav aria-label={title} className="mcxd-fp-card">
      <div className="mcxd-fp-header">
        <div className="mcxd-fp-title">{title}</div>
        <button
          type="button"
          className="mcxd-fp-min-btn"
          aria-label={minimiseLabel ?? `Minimise ${title}`}
          onClick={onMinimise}
        >
          <span aria-hidden="true">–</span>
        </button>
      </div>
      {children}
    </nav>
  );
}

// Hamburger shown in the card's place when minimised (wide screens only).
export function MinimisedFab({ onExpand, label }) {
  return (
    <button
      type="button"
      className="mcxd-fp-fab-desktop"
      aria-label={label}
      onClick={onExpand}
    >
      <BurgerIcon />
    </button>
  );
}

// Hamburger toggling the overlay panel (small screens only).
export function MenuFab({ open, onToggle, openLabel, closeLabel }) {
  return (
    <button
      type="button"
      className="mcxd-fp-fab"
      aria-expanded={open}
      aria-label={open ? closeLabel : openLabel}
      onClick={onToggle}
    >
      {open ? <span aria-hidden="true">✕</span> : <BurgerIcon />}
    </button>
  );
}

// Overlay panel with backdrop (small screens only).
export function MenuOverlay({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <>
      <div className="mcxd-fp-backdrop" onClick={onClose} />
      <nav aria-label={title} className="mcxd-fp-panel">
        <div className="mcxd-fp-title">{title}</div>
        {children}
      </nav>
    </>
  );
}
