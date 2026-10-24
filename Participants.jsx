import { useState } from "react";
import { fmt, ticketId, saveCsv } from "../utils";
import { Modal } from "./Modal";
import { Icon } from "./Icon";

export function Participants({ e, A, onClose }) {
  const [q, setQ] = useState(""), [code, setCode] = useState(""), [msg, setMsg] = useState(null);
  const scan = ev => {
    ev.preventDefault(); const c = code.trim().toUpperCase(); const r = e.regs.find(x => ticketId(e, x) === c);
    if (!r) setMsg({ bad: true, t: "No valid ticket with that code." });
    else if (r.checked) setMsg({ bad: true, t: `${r.name} is already checked in.` });
    else { A.checkin(e, r); setMsg({ t: `${r.name} checked in.` }); }
    setCode("");
  };
  const rows = e.regs.filter(r => (r.name + r.email + (r.roll || "") + (r.dept || "")).toLowerCase().includes(q.toLowerCase()));
  const checked = e.regs.filter(r => r.checked).length;
  return (
    <Modal onClose={onClose} wide label="Participants">
      <div className="mb">
        <h3>{e.title}</h3>
        <p className="sub">{e.regs.length} of {e.seats} seats filled · {checked} checked in{e.wait.length ? ` · ${e.wait.length} on waitlist` : ""}</p>
        {e.regs.length === 0 ? <div className="empty" style={{ marginBottom: 16 }}><h3>No registrations yet</h3>Share the portal with students to start filling seats.</div> : <>
          <form className="scan" onSubmit={scan}><input className="field" value={code} onChange={x => setCode(x.target.value)} placeholder="Check in by ticket code, e.g. CE-AB12CD" aria-label="Ticket code" /><button className="btn sm">Check in</button></form>
          {msg && <div className={msg.bad ? "err" : "okmsg"} role="status" style={{ marginBottom: 10 }}>{msg.t}</div>}
          <div className="search" style={{ marginBottom: 12 }}><Icon n="search" s={18} /><input value={q} onChange={x => setQ(x.target.value)} placeholder="Search by name, email, roll no or department" aria-label="Search participants" /></div>
          <div className="scroll-x"><table className="tbl"><thead><tr><th>In</th><th>Name</th><th>Roll no</th><th>Dept</th><th>Year</th><th>Ticket</th><th>Registered</th><th></th></tr></thead>
            <tbody>{rows.map(r => <tr key={r.email}>
              <td><input type="checkbox" checked={!!r.checked} onChange={() => A.checkin(e, r)} aria-label={"Check in " + r.name} /></td>
              <td><b>{r.name}</b><br /><small style={{ color: "var(--muted)" }}>{r.email}</small></td><td>{r.roll || "–"}</td><td>{r.dept || "–"}</td><td>{r.year || "–"}</td><td><code>{ticketId(e, r)}</code></td><td>{fmt.ago(r.at)}</td>
              <td><button className="btn sm dng" onClick={() => A.confirm({ title: `Remove ${r.name}?`, text: "They will be notified and the next person on the waitlist gets the seat.", yes: "Remove", no: "Keep", fn: () => A.removeReg(e, r) })} aria-label={"Remove " + r.name}><Icon n="x" s={14} /></button></td></tr>)}
              {rows.length === 0 && <tr><td colSpan="8" style={{ textAlign: "center", color: "var(--muted)" }}>No one matches "{q}".</td></tr>}</tbody></table></div></>}
        <div className="foot"><button className="btn sec" onClick={onClose}>Close</button><button className="btn" disabled={!e.regs.length} onClick={() => saveCsv(e)}><Icon n="dl" />Download CSV</button></div>
      </div>
    </Modal>
  );
}
