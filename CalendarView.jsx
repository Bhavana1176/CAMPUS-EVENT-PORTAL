import { useState } from "react";
import { CATS, dayKey } from "../utils";
import { GridCard } from "./EventCard";
import { Icon } from "./Icon";

export function CalendarView({ events, user, busy, A, saved }) {
  const [m, setM] = useState(() => { const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); return d; });
  const [sel, setSel] = useState(dayKey(new Date()));
  const dim = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
  const cells = []; for (let i = 0; i < m.getDay(); i++) cells.push(null);
  for (let d = 1; d <= dim; d++) cells.push(new Date(m.getFullYear(), m.getMonth(), d));
  const byDay = {}; events.forEach(e => { const k = dayKey(new Date(e.date)); (byDay[k] = byDay[k] || []).push(e); });
  const shift = n => setM(new Date(m.getFullYear(), m.getMonth() + n, 1));
  const todayK = dayKey(new Date()), list = byDay[sel] || [];
  return (
    <>
      <div className="cal">
        <div className="cal-h">
          <h3>{m.toLocaleString("en", { month: "long", year: "numeric" })}</h3>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="ic" onClick={() => shift(-1)} aria-label="Previous month"><Icon n="left" /></button>
            <button className="ghost" onClick={() => { const d = new Date(); setM(new Date(d.getFullYear(), d.getMonth(), 1)); setSel(dayKey(d)); }}>Today</button>
            <button className="ic" onClick={() => shift(1)} aria-label="Next month"><Icon n="right" /></button>
          </div>
        </div>
        <div className="cal-g">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d} className="cal-d">{d}</div>)}
          {cells.map((d, i) => { if (!d) return <div key={i} />; const k = dayKey(d), evs = byDay[k] || [];
            return <button key={i} className={"cell" + (k === todayK ? " today" : "") + (k === sel ? " sel" : "")} onClick={() => setSel(k)} aria-label={`${d.toDateString()}, ${evs.length} events`}>
              <b>{d.getDate()}</b>
              <span className="dots">{evs.slice(0, 4).map(e => <i key={e.id} style={{ background: CATS[e.cat][0] }} />)}</span>
            </button>; })}
        </div>
      </div>
      <div className="grid">
        {list.length === 0 ? <div className="empty"><h3>No events on this day</h3>Pick a day with a coloured dot to see what's happening.</div> :
          list.map(e => <GridCard key={e.id} e={e} user={user} busy={busy} A={A} saved={saved} />)}
      </div>
    </>
  );
}
