import { avgRating, dayKey } from "../utils";

export function Analytics({ events }) {
  const regs = events.flatMap(e => e.regs.map(r => ({ ...r, ev: e })));
  const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - 13 + i); return d; });
  const counts = days.map(d => regs.filter(r => dayKey(new Date(r.at)) === dayKey(d)).length);
  const max = Math.max(1, ...counts);
  const dept = {}; regs.forEach(r => { const k = r.dept || "Other"; dept[k] = (dept[k] || 0) + 1; });
  const depts = Object.entries(dept).sort((a, b) => b[1] - a[1]).slice(0, 5), dmax = Math.max(1, ...depts.map(x => x[1]));
  const rated = events.filter(e => (e.ratings || []).length);
  const avg = rated.length ? rated.reduce((s, e) => s + avgRating(e), 0) / rated.length : 0;
  const waiting = events.reduce((n, e) => n + e.wait.length, 0);
  const top = [...events].sort((a, b) => b.regs.length - a.regs.length)[0];
  if (!events.length) return null;
  return (
    <div className="insights">
      <section className="panel">
        <h3>Registrations, last 14 days</h3>
        {regs.length === 0 ? <p style={{ color: "var(--muted)", margin: 0 }}>No registrations yet.</p> :
          <div className="bars" role="img" aria-label="Registrations per day for the last 14 days">
            {days.map((d, i) => <div key={i} title={`${d.toDateString()}: ${counts[i]}`}><i style={{ height: (counts[i] / max) * 100 + "%" }} /><small>{d.getDate()}</small></div>)}
          </div>}
      </section>
      <section className="panel">
        <h3>Top departments</h3>
        {depts.length === 0 ? <p style={{ color: "var(--muted)", margin: 0 }}>No data yet.</p> :
          <div className="hb">{depts.map(([k, v]) => <div key={k}><span>{k}</span><span className="t"><i style={{ width: (v / dmax) * 100 + "%" }} /></span><b>{v}</b></div>)}</div>}
      </section>
      <section className="panel full">
        <div className="hl">
          <div><small>Most popular</small><b>{top && top.regs.length ? top.title : "–"}</b></div>
          <div><small>Waitlisted students</small><b>{waiting}</b></div>
          <div><small>Average rating</small><b>{avg ? "★ " + avg.toFixed(1) : "–"}</b></div>
        </div>
      </section>
    </div>
  );
}
