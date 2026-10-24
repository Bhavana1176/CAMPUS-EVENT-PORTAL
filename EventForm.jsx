import { useState } from "react";
import { CATS } from "../utils";
import { Modal } from "./Modal";

export function EventForm({ init, onSave, onClose }) {
  const [f, setF] = useState(init || { title: "", cat: "Tech", desc: "", date: "", venue: "", seats: "", deadline: "" }), [er, setEr] = useState({});
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const submit = e => {
    e.preventDefault(); const x = {}, n = parseInt(f.seats);
    if (!f.title.trim()) x.title = "Give the event a title.";
    if (f.desc.trim().length < 15) x.desc = "Add a short description (at least 15 characters).";
    if (!f.date) x.date = "Pick a date and time."; else if (!init && new Date(f.date) < new Date()) x.date = "Choose a future date and time.";
    if (!f.venue.trim()) x.venue = "Enter the venue.";
    if (!(n >= 1)) x.seats = "Seat limit must be at least 1."; else if (init && n < init.regsCount) x.seats = `${init.regsCount} students are already registered.`;
    if (f.deadline && f.date && new Date(f.deadline) >= new Date(f.date)) x.deadline = "Deadline must be before the event starts.";
    setEr(x);
    if (!Object.keys(x).length) onSave({ title: f.title.trim(), cat: f.cat, desc: f.desc.trim(), date: f.date, venue: f.venue.trim(), seats: n, deadline: f.deadline || "" });
  };
  const E = k => er[k] && <div className="err">{er[k]}</div>;
  return (
    <Modal onClose={onClose} label="Event form">
      <form className="mb" onSubmit={submit} noValidate>
        <h3>{init ? "Edit event" : "Create event"}</h3><p className="sub">{init ? "Registered students will be notified of changes." : "Students will see it as soon as you publish."}</p>
        <label className="f">Title<input className="field" value={f.title} onChange={set("title")} placeholder="e.g. Robotics Workshop" />{E("title")}</label>
        <div className="row">
          <label className="f">Category<select className="field" style={{ width: "100%" }} value={f.cat} onChange={set("cat")}>{Object.keys(CATS).map(c => <option key={c}>{c}</option>)}</select></label>
          <label className="f">Seat limit<input className="field" type="number" min="1" value={f.seats} onChange={set("seats")} placeholder="50" />{E("seats")}</label>
        </div>
        <label className="f">Description<textarea className="field" rows="3" value={f.desc} onChange={set("desc")} placeholder="What will happen and who should attend?" />{E("desc")}</label>
        <div className="row">
          <label className="f">Date and time<input className="field" type="datetime-local" value={f.date} onChange={set("date")} />{E("date")}</label>
          <label className="f">Venue<input className="field" value={f.venue} onChange={set("venue")} placeholder="e.g. Seminar Hall 1" />{E("venue")}</label>
        </div>
        <label className="f">Registration deadline <small style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</small><input className="field" type="datetime-local" value={f.deadline} onChange={set("deadline")} />{E("deadline")}</label>
        <div className="foot"><button type="button" className="btn sec" onClick={onClose}>Cancel</button><button className="btn">{init ? "Save changes" : "Publish event"}</button></div>
      </form>
    </Modal>
  );
}
