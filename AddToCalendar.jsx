import { useState, useEffect } from "react";
import { calLinks, saveIcs } from "../utils";
import { Icon } from "./Icon";

export function AddToCalendar({ e }) {
  const [open, setOpen] = useState(false);
  const links = calLinks(e);
  useEffect(() => {
    if (!open) return;
    const h = ev => { if (!ev.target.closest(".addcal")) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const done = () => setOpen(false);
  return (
    <span className="addcal">
      <button type="button" className="btn out" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}><Icon n="cal" />Add to calendar</button>
      {open && <div className="menu" role="menu">
        <a role="menuitem" href={links.google} target="_blank" rel="noopener noreferrer" onClick={done}><Icon n="cal" />Google Calendar</a>
        <a role="menuitem" href={links.outlook} target="_blank" rel="noopener noreferrer" onClick={done}><Icon n="cal" />Outlook Calendar</a>
        <button type="button" role="menuitem" onClick={() => { saveIcs(e); done(); }}><Icon n="dl" /><span>Apple / other<small>Download .ics file</small></span></button>
      </div>}
    </span>
  );
}
