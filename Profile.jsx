import { useState } from "react";
import { DEPTS, YEARS } from "../utils";
import { Modal } from "./Modal";

export function Profile({ user, onSave, onReset, onClose }) {
  const [f, setF] = useState({ name: user.name, club: user.club || "", roll: user.roll || "", dept: user.dept || DEPTS[0], year: user.year || YEARS[0], pass: "" });
  const [err, setErr] = useState(""), [sure, setSure] = useState(false);
  const set = k => e => { setF({ ...f, [k]: e.target.value }); setErr(""); };
  const stud = user.role === "student";
  const submit = e => {
    e.preventDefault();
    if (!f.name.trim()) return setErr("Name can't be empty.");
    if (!stud && !f.club.trim()) return setErr("Club or department can't be empty.");
    if (f.pass && f.pass.length < 6) return setErr("New password must be at least 6 characters.");
    onSave({ name: f.name.trim(), pass: f.pass, ...(stud ? { roll: f.roll.trim().toUpperCase(), dept: f.dept, year: f.year } : { club: f.club.trim() }) });
  };
  return (
    <Modal onClose={onClose} label="Profile">
      <form className="mb" onSubmit={submit} noValidate>
        <h3>Your profile</h3><p className="sub">{user.email} · {stud ? "Student" : "Organiser"}</p>
        <label className="f">Full name<input className="field" value={f.name} onChange={set("name")} /></label>
        {!stud && <label className="f">Club or department<input className="field" value={f.club} onChange={set("club")} /></label>}
        {stud && <>
          <label className="f">Roll number<input className="field" value={f.roll} onChange={set("roll")} /></label>
          <div className="row">
            <label className="f">Department<select className="field" style={{ width: "100%" }} value={f.dept} onChange={set("dept")}>{DEPTS.map(d => <option key={d}>{d}</option>)}</select></label>
            <label className="f">Year<select className="field" style={{ width: "100%" }} value={f.year} onChange={set("year")}>{YEARS.map(d => <option key={d}>{d}</option>)}</select></label>
          </div></>}
        <label className="f">New password <small style={{ color: "var(--muted)", fontWeight: 400 }}>(leave blank to keep current)</small><input className="field" type="password" value={f.pass} onChange={set("pass")} autoComplete="new-password" /></label>
        {err && <div className="err" role="alert" style={{ marginBottom: 10 }}>{err}</div>}
        <div className="foot" style={{ justifyContent: "space-between" }}>
          <button type="button" className="btn sm dng" onClick={() => sure ? onReset() : setSure(true)}>{sure ? "Click again to confirm reset" : "Reset demo data"}</button>
          <span style={{ display: "flex", gap: 10 }}><button type="button" className="btn sec" onClick={onClose}>Cancel</button><button className="btn">Save</button></span>
        </div>
      </form>
    </Modal>
  );
}
