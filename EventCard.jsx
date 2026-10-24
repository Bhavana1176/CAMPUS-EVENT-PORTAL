import { grad, fmt, stateOf } from "../utils";
import { Icon } from "./Icon";

export function Seats({ e }) {
  const left = e.seats - e.regs.length, pct = Math.min(100, (e.regs.length / e.seats) * 100);
  const cls = left <= 0 ? " full" : left <= Math.max(2, e.seats * 0.15) ? " low" : "";
  return <div className="seats"><div className={"track" + cls}><i style={{ width: pct + "%" }} /></div><span>{left > 0 ? `${left} left` : e.wait.length ? `Full · ${e.wait.length} waiting` : "Full"}</span></div>;
}
const PILL = { past: ["end", "Ended"], registered: ["ok", "Registered"], waitlisted: ["wait", "On waitlist"], closed: ["closed", "Registration closed"], full: ["full", "Full · waitlist open"], open: ["open", "Open"] };
export const Pill = ({ s }) => <span className={"pill " + PILL[s][0]}>{s === "registered" && <Icon n="check" s={12} />}{PILL[s][1]}</span>;
export function BtnFor({ e, user, busy, A, size }) {
  const s = stateOf(e, user), b = busy === e.id, cls = "btn" + (size ? " " + size : "");
  const spin = b ? <span className="spin" /> : null;
  if (s === "past") return <button className={cls + " out"} disabled>Event ended</button>;
  if (s === "closed") return <button className={cls + " out"} disabled>Registration closed</button>;
  if (s === "registered") return <button className={cls + " sec"} onClick={ev => { ev.stopPropagation(); A.openTicket(e); }}><Icon n="tick" />View ticket</button>;
  if (s === "waitlisted") return <button className={cls + " out"} disabled={b} onClick={ev => { ev.stopPropagation(); A.leaveWait(e); }}>Leave waitlist</button>;
  if (s === "full") return <button className={cls + " out"} disabled={b} onClick={ev => { ev.stopPropagation(); A.register(e); }}>{spin}Join waitlist</button>;
  return <button className={cls} disabled={b} onClick={ev => { ev.stopPropagation(); A.register(e); }}>{spin}{b ? "Registering…" : "Register"}</button>;
}
export function GridCard({ e, user, busy, A, saved }) {
  const s = stateOf(e, user), sv = saved.includes(e.id);
  return (
    <article className="gc" onClick={() => A.detail(e)}>
      <div className="cov" style={{ background: grad(e.cat) }}>
        <div className="dchip"><b>{fmt.day(e.date)}</b><span>{fmt.month(e.date)}</span></div>
        <button className="save" aria-pressed={sv} aria-label={sv ? "Remove from saved" : "Save event"} onClick={ev => { ev.stopPropagation(); A.toggleSave(e); }}><Icon n="heart" /></button>
      </div>
      <div className="gb">
        <Pill s={s} />
        <h3>{e.title}</h3>
        <div className="meta"><span><Icon n="clock" />{fmt.wd(e.date)}, {fmt.time(e.date)}</span><span><Icon n="pin" />{e.venue}</span></div>
        <div className="grow" />
        <Seats e={e} />
        <BtnFor e={e} user={user} busy={busy} A={A} />
      </div>
    </article>
  );
}
