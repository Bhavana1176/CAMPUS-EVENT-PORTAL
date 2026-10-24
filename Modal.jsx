import { useEffect } from "react";

export function Modal({ onClose, wide, children, label }) {
  useEffect(() => { const h = e => e.key === "Escape" && onClose(); document.addEventListener("keydown", h); return () => document.removeEventListener("keydown", h); }, []);
  return <div className="scrim" onMouseDown={e => e.target === e.currentTarget && onClose()}><div className={"modal" + (wide ? " wide" : "")} role="dialog" aria-modal="true" aria-label={label}>{children}</div></div>;
}
