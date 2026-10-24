import { fmt, isPast, ticketId } from "../utils";
import { Modal } from "./Modal";
import { QR } from "./QR";
import { Icon } from "./Icon";
import { AddToCalendar } from "./AddToCalendar";

export function Ticket({ e, user, A, onClose }) {
  const id = ticketId(e, user), past = isPast(e);
  return (
    <Modal onClose={onClose} label="Your ticket">
      <div className="mb">
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}><span className="pill ok"><Icon n="check" s={12} />Registered</span></div>
        <h3>You're in!</h3><p className="sub">Show this ticket at the venue. We've also added it to My events.</p>
        <div className="tk">
          <div><h4>{e.title}</h4><p>{fmt.full(e.date)}</p><p>{e.venue}</p><p style={{ marginTop: 10 }}>{user.name}{user.roll ? ` · ${user.roll}` : ""}</p><p><code>{id}</code></p></div>
          <QR seed={id} />
        </div>
        <div className="foot">
          {!past && <button className="btn dng" onClick={() => A.confirm({ title: "Cancel your registration?", text: `Your seat in "${e.title}" will go to the next person on the waitlist.`, yes: "Cancel registration", no: "Keep my seat", fn: () => A.cancel(e) })}>Cancel registration</button>}
          <AddToCalendar e={e} />
          <button className="btn" onClick={onClose}>Done</button>
        </div>
      </div>
    </Modal>
  );
}
