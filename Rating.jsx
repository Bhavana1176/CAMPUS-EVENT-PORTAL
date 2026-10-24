import { useState } from "react";
import { isPast, isReg, avgRating } from "../utils";

export function Rating({ e, user, A }) {
  const rs = e.ratings || [], mine = rs.find(r => r.email === user.email);
  const can = isPast(e) && isReg(e, user);
  const [stars, setStars] = useState(mine ? mine.stars : 0), [text, setText] = useState(mine ? mine.text : "");
  if (!rs.length && !can) return null;
  return (
    <div className="rate">
      <h4>Reviews{rs.length > 0 && <> · ★ {avgRating(e).toFixed(1)} <small style={{ color: "var(--muted)" }}>({rs.length})</small></>}</h4>
      {rs.slice(0, 3).map(r => <p key={r.email} style={{ margin: "0 0 6px", fontSize: 14 }}><span className="stars"><span className="on">{"★".repeat(r.stars)}</span></span> {r.text} <small style={{ color: "var(--muted)" }}>– {r.name}</small></p>)}
      {can && <>
        <p style={{ margin: "10px 0 4px", fontSize: 14, fontWeight: 600 }}>{mine ? "Update your rating" : "How was it?"}</p>
        <div className="stars">{[1, 2, 3, 4, 5].map(n => <button key={n} type="button" className={n <= stars ? "on" : ""} onClick={() => setStars(n)} aria-label={`${n} star${n > 1 ? "s" : ""}`}>★</button>)}</div>
        <textarea className="field" rows="2" style={{ margin: "8px 0" }} value={text} onChange={x => setText(x.target.value)} placeholder="Share a short comment (optional)" />
        <button className="btn sm" disabled={!stars} onClick={() => A.rate(e, stars, text.trim())}>{mine ? "Update review" : "Submit review"}</button>
      </>}
    </div>
  );
}
