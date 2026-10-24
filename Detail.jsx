import { grad, fmt, when, stateOf } from "../utils";
import { Modal } from "./Modal";
import { Seats, Pill, BtnFor } from "./EventCard";
import { Icon } from "./Icon";
import { Rating } from "./Rating";
import { AddToCalendar } from "./AddToCalendar";

export function Detail({ e, user, busy, A, saved, onClose }) {
  const s = stateOf(e, user), sv = saved.includes(e.id);
  return (
    <Modal onClose={onClose} label={e.title}>
      <div className="mcov" style={{ background: grad(e.cat) }}><button className="x" onClick={onClose} aria-label="Close"><Icon n="x" /></button><span className="tag">{e.cat}</span></div>
      <div className="mb">
        <Pill s={s} />
        <h3 style={{ marginTop: 10 }}>{e.title}</h3>
        <p className="sub" style={{ marginBottom: 6 }}>Hosted by {e.orgName} · {when(e.date)}</p>
        <div className="kv">
          <span><Icon n="cal" s={18} /><b>{fmt.full(e.date)}</b></span>
          <span><Icon n="pin" s={18} /><b>{e.venue}</b></span>
          <span><Icon n="users" s={18} /><b>{e.regs.length} of {e.seats} seats taken{e.wait.length ? ` · ${e.wait.length} on waitlist` : ""}</b></span>
          {e.deadline && <span><Icon n="clock" s={18} /><b>Register by {fmt.full(e.deadline)}</b></span>}
        </div>
        <p style={{ margin: "0 0 14px" }}>{e.desc}</p>
        <Seats e={e} />
        <Rating e={e} user={user} A={A} />
        <div className="foot" style={{ marginTop: 18 }}>
          <button className="btn out" onClick={() => A.toggleSave(e)}><Icon n="heart" />{sv ? "Saved" : "Save"}</button>
          {s === "registered" && <AddToCalendar e={e} />}
          <BtnFor e={e} user={user} busy={busy} A={A} />
        </div>
      </div>
    </Modal>
  );
}
