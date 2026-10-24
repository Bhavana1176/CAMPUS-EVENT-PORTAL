import { useState, useEffect, useRef } from "react";
import { store, inDays, uid, CATS, grad, SEED_USERS, seedEvents, fmt, when, isPast, isFull, isReg, isWait, fill, isClosed, avgRating } from "./utils";
import { Participants } from "./components/Participants";
import { Profile } from "./components/Profile";
import { EventForm } from "./components/EventForm";
import { CalendarView } from "./components/CalendarView";
import { Ticket } from "./components/Ticket";
import { Analytics } from "./components/Analytics";
import { Modal } from "./components/Modal";
import { Seats, Pill, GridCard } from "./components/EventCard";
import { Icon } from "./components/Icon";
import { Detail } from "./components/Detail";
import { Auth } from "./pages/Auth";

export default function App() {
  const [users, setUsers] = useState(() => store.get("ce2_users", SEED_USERS).map(u => { const s = SEED_USERS.find(x => x.email === u.email); return s && s.club && !u.club ? { ...u, name: s.name, club: s.club } : u; }));
  const [me, setMe] = useState(() => store.get("ce2_me", null));
  const [events, setEvents] = useState(() => store.get("ce2_events", null) || seedEvents());
  const [notes, setNotes] = useState(() => store.get("ce2_notes", [{ id: "n0", to: "student@college.edu", msg: "Welcome to Campus Events! Browse upcoming events and register in one click.", at: Date.now(), read: false }]));
  const [savedMap, setSavedMap] = useState(() => store.get("ce2_saved", {}));
  const [tab, setTab] = useState(null), [q, setQ] = useState(""), [cat, setCat] = useState("All"), [sort, setSort] = useState("soon"), [onlyOpen, setOnlyOpen] = useState(false), [mt, setMt] = useState("upcoming"), [view, setView] = useState("grid");
  const [modal, setModal] = useState(null), [toast, setToast] = useState(""), [busy, setBusy] = useState(null), [bell, setBell] = useState(false);
  const ev = useRef(events); ev.current = events;
  const tt = useRef();
  useEffect(() => store.set("ce2_users", users), [users]);
  useEffect(() => store.set("ce2_me", me), [me]);
  useEffect(() => store.set("ce2_events", events), [events]);
  useEffect(() => store.set("ce2_notes", notes), [notes]);
  useEffect(() => store.set("ce2_saved", savedMap), [savedMap]);
  useEffect(() => { const t = store.get("ce2_theme", null); if (t) document.documentElement.dataset.theme = t; }, []);
  useEffect(() => { if (!bell) return; const h = e => { if (!e.target.closest(".bellwrap")) setBell(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, [bell]);

  const user = users.find(u => u.email === me) || null;
  const say = m => { setToast(m); clearTimeout(tt.current); tt.current = setTimeout(() => setToast(""), 2600); };
  const note = (to, msg) => setNotes(n => [{ id: uid(), to, msg, at: Date.now(), read: false }, ...n].slice(0, 150));
  const mutate = (id, fn) => {
    const cur = ev.current.find(x => x.id === id); if (!cur) return null;
    const { e: next, promoted } = fill(fn(cur));
    ev.current = ev.current.map(x => x.id === id ? next : x); setEvents(ev.current);
    promoted.forEach(p => note(p.email, `A seat opened up. You're now registered for ${next.title}.`));
    return next;
  };
  const act = (e, fn) => { setBusy(e.id); setTimeout(() => { fn(); setBusy(null); }, 450); };

  if (!user) return <Auth users={users} onLogin={u => { setMe(u.email); setTab(u.role === "organiser" ? "dash" : "browse"); }} onSignup={u => { setUsers(us => [...us, u]); setMe(u.email); setTab(u.role === "organiser" ? "dash" : "browse"); say("Account created. Welcome!"); }} />;
  const org = user.role === "organiser", curTab = tab || (org ? "dash" : "browse");
  const saved = savedMap[user.email] || [];
  const mine = notes.filter(n => n.to === user.email), unread = mine.filter(n => !n.read).length;
  const rec = () => ({ name: user.name, email: user.email, roll: user.roll || "", dept: user.dept || "", year: user.year || "", at: Date.now(), checked: false });

  const A = {
    rate: (e, stars, text) => { mutate(e.id, x => ({ ...x, ratings: [...(x.ratings || []).filter(r => r.email !== user.email), { email: user.email, name: user.name, stars, text }] })); note(e.organiser, `${user.name} rated ${e.title} ${stars} out of 5.`); say("Thanks for your feedback"); },
    saveProfile: f => { setUsers(us => us.map(u => u.email === user.email ? { ...u, ...f, pass: f.pass || u.pass } : u)); if (f.club) setEvents(es => es.map(e => e.organiser === user.email ? { ...e, orgName: f.club } : e)); setModal(null); say("Profile updated"); },
    reset: () => { setUsers(SEED_USERS); setEvents(seedEvents()); setNotes([]); setSavedMap({}); setMe(null); setTab(null); setModal(null); },
    detail: e => setModal({ t: "detail", id: e.id }),
    openTicket: e => setModal({ t: "ticket", id: e.id }),
    confirm: c => setModal({ t: "confirm", ...c }),
    toggleSave: e => { setSavedMap(m => { const l = m[user.email] || []; return { ...m, [user.email]: l.includes(e.id) ? l.filter(i => i !== e.id) : [...l, e.id] }; }); },
    register: e => act(e, () => {
      const cur = ev.current.find(x => x.id === e.id);
      if (!cur || isPast(cur) || isClosed(cur)) return say("Registration is closed for this event.");
      if (isReg(cur, user) || isWait(cur, user)) return say("You're already on this event.");
      if (isFull(cur)) {
        mutate(e.id, x => ({ ...x, wait: [...x.wait, rec()] }));
        note(user.email, `You're #${cur.wait.length + 1} on the waitlist for ${cur.title}. We'll notify you if a seat opens.`);
        say("Added to the waitlist"); setModal(null);
      } else {
        const n = mutate(e.id, x => ({ ...x, regs: [...x.regs, rec()] }));
        note(user.email, `You're registered for ${cur.title}. Your ticket is in My events.`);
        note(cur.organiser, `${user.name} registered for ${cur.title} (${n.regs.length}/${cur.seats} seats).`);
        if (n.regs.length >= n.seats) note(cur.organiser, `${cur.title} is now full. New sign-ups join the waitlist.`);
        setModal({ t: "ticket", id: e.id });
      }
    }),
    cancel: e => { mutate(e.id, x => ({ ...x, regs: x.regs.filter(r => r.email !== user.email) })); note(e.organiser, `${user.name} cancelled their registration for ${e.title}.`); setModal(null); say("Registration cancelled"); },
    leaveWait: e => { mutate(e.id, x => ({ ...x, wait: x.wait.filter(r => r.email !== user.email) })); say("Removed from the waitlist"); },
    create: f => { setEvents(es => [{ id: uid(), ...f, organiser: user.email, orgName: user.club || user.name, closed: false, created: Date.now(), ratings: [], regs: [], wait: [] }, ...es]); setModal(null); say("Event published"); },
    edit: (e, f) => { const n = mutate(e.id, x => ({ ...x, ...f })); n.regs.forEach(r => note(r.email, `${n.title} was updated. Check the new details.`)); setModal(null); say("Changes saved"); },
    toggleClosed: e => { mutate(e.id, x => ({ ...x, closed: !x.closed })); say(e.closed ? "Registration reopened" : "Registration closed"); },
    dup: e => { setEvents(es => [{ ...e, id: uid(), title: e.title + " (copy)", date: inDays(7, 10), deadline: "", ratings: [], regs: [], wait: [], closed: false, created: Date.now() }, ...es]); say("Event duplicated. Edit the date and details."); },
    del: e => { [...e.regs, ...e.wait].forEach(r => note(r.email, `${e.title} has been cancelled by the organiser.`)); setEvents(es => es.filter(x => x.id !== e.id)); setModal(null); say("Event deleted"); },
    checkin: (e, r) => mutate(e.id, x => ({ ...x, regs: x.regs.map(y => y.email === r.email ? { ...y, checked: !y.checked } : y) })),
    removeReg: (e, r) => { mutate(e.id, x => ({ ...x, regs: x.regs.filter(y => y.email !== r.email) })); note(r.email, `You were removed from ${e.title} by the organiser.`); setModal({ t: "people", id: e.id }); }
  };

  const toggleTheme = () => { const cur = document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); const n = cur === "dark" ? "light" : "dark"; document.documentElement.dataset.theme = n; store.set("ce2_theme", n); };
  const openBell = () => { setBell(b => !b); if (!bell) setNotes(ns => ns.map(n => n.to === user.email ? { ...n, read: true } : n)); };

  const byDate = (a, b) => new Date(a.date) - new Date(b.date);
  const upcoming = events.filter(e => !isPast(e)).sort(byDate);
  const myOrg = events.filter(e => e.organiser === user.email).sort((a, b) => new Date(b.date) - new Date(a.date));
  let browse = upcoming.filter(e => (e.title + e.desc + e.venue + e.orgName).toLowerCase().includes(q.toLowerCase()) && (cat === "All" || e.cat === cat) && (!onlyOpen || (!isFull(e) && !isClosed(e))));
  if (sort === "seats") browse = [...browse].sort((a, b) => (b.seats - b.regs.length) - (a.seats - a.regs.length));
  if (sort === "new") browse = [...browse].sort((a, b) => b.created - a.created);
  const myTabs = { upcoming: events.filter(e => !isPast(e) && isReg(e, user)).sort(byDate), waitlist: events.filter(e => !isPast(e) && isWait(e, user)).sort(byDate), saved: events.filter(e => saved.includes(e.id)).sort(byDate), past: events.filter(e => isPast(e) && isReg(e, user)).sort((a, b) => byDate(b, a)) };
  const nextEv = upcoming.find(e => !isFull(e) && !isClosed(e)) || upcoming[0];
  const gridProps = { user, busy, A, saved };
  const mEv = modal && modal.id && events.find(e => e.id === modal.id);

  const totalRegs = myOrg.reduce((n, e) => n + e.regs.length, 0), totalSeats = myOrg.reduce((n, e) => n + e.seats, 0), totalIn = myOrg.reduce((n, e) => n + e.regs.filter(r => r.checked).length, 0);

  return (
    <>
      <header className="bar"><div className="wrap">
        <div className="logo"><i><Icon n="cal" s={17} /></i><span>Campus Events</span></div>
        <nav className="tabs" aria-label="Sections">
          {org ? <button className="tab" aria-current="true">Dashboard</button> : <>
            <button className="tab" aria-current={curTab === "browse"} onClick={() => setTab("browse")}>Browse</button>
            <button className="tab" aria-current={curTab === "mine"} onClick={() => setTab("mine")}>My events</button></>}
        </nav>
        <div className="me">
          <div className="bellwrap" style={{ position: "relative" }}>
            <button className="ic" onClick={openBell} aria-label="Notifications"><Icon n="bell" />{unread > 0 && <span className="dot">{unread}</span>}</button>
            {bell && <div className="pop"><h4>Notifications</h4>{mine.length === 0 ? <div className="note">You're all caught up.</div> : mine.slice(0, 8).map(n => <div key={n.id} className="note">{n.msg}<small>{fmt.ago(n.at)}</small></div>)}</div>}
          </div>
          <button className="ic" onClick={toggleTheme} aria-label="Toggle dark mode"><Icon n="moon" /></button>
          <div className="who"><b>{user.name}</b><span>{org ? (user.club || "Organiser") : user.roll || "Student"}</span></div>
          <button className="avatar" style={{ border: 0, cursor: "pointer" }} onClick={() => setModal({ t: "profile" })} aria-label="Profile and settings">{user.name.charAt(0).toUpperCase()}</button>
          <button className="ghost" onClick={() => { setMe(null); setTab(null); setBell(false); }} aria-label="Sign out"><Icon n="out" /></button>
        </div>
      </div></header>

      <main><div className="wrap">
        {org ? <>
          <div className="head"><div><h2>Your events</h2><p>Create events, watch seats fill, check people in and export lists.</p></div>
            <button className="btn" onClick={() => setModal({ t: "form" })}><Icon n="plus" />Create event</button></div>
          <div className="stats">
            <div className="stat"><b>{myOrg.length}</b><span>Events created</span></div>
            <div className="stat"><b>{totalRegs}</b><span>Total registrations</span></div>
            <div className="stat"><b>{totalSeats ? Math.round(totalRegs / totalSeats * 100) : 0}%</b><span>Seats filled</span></div>
            <div className="stat"><b>{totalIn}</b><span>Checked in</span></div>
          </div>
          <Analytics events={myOrg} />
          <div className="list">
            {myOrg.length === 0 ? <div className="empty"><h3>No events yet</h3>Create your first event to start collecting registrations.<div style={{ marginTop: 16 }}><button className="btn" onClick={() => setModal({ t: "form" })}><Icon n="plus" />Create event</button></div></div> :
              myOrg.map(e => { const past = isPast(e); return (
                <article key={e.id} className={"ev" + (past ? " past" : "")}>
                  <div className="stub" style={{ background: grad(e.cat) }}><em>{fmt.wd(e.date)}</em><b>{fmt.day(e.date)}</b><small>{fmt.month(e.date)}</small></div>
                  <div className="mid">
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}><Pill s={past ? "past" : isClosed(e) ? "closed" : isFull(e) ? "full" : "open"} /><span className="pill end">{e.cat}</span></div>
                    <h3>{e.title}</h3>
                    <div className="meta"><span><Icon n="clock" />{fmt.time(e.date)}</span><span><Icon n="pin" />{e.venue}</span><span><Icon n="users" />{e.regs.filter(r => r.checked).length} checked in</span>{(e.ratings || []).length > 0 && <span>★ {avgRating(e).toFixed(1)} ({e.ratings.length})</span>}{e.deadline && !isPast(e) && <span><Icon n="lock" />Closes {fmt.full(e.deadline)}</span>}</div>
                    <div style={{ maxWidth: 380 }}><Seats e={e} /></div>
                    <div className="acts">
                      <button className="btn sm" onClick={() => setModal({ t: "people", id: e.id })}><Icon n="users" />Participants ({e.regs.length})</button>
                      <button className="btn sm out" onClick={() => setModal({ t: "form", id: e.id })}><Icon n="edit" />Edit</button>
                      {!past && <button className="btn sm out" onClick={() => A.toggleClosed(e)}><Icon n="lock" />{e.closed ? "Reopen" : "Close registration"}</button>}
                      <button className="btn sm out" onClick={() => A.dup(e)}><Icon n="copy" />Duplicate</button>
                      <button className="btn sm dng" onClick={() => A.confirm({ title: "Delete this event?", text: `"${e.title}" and its ${e.regs.length} registration${e.regs.length === 1 ? "" : "s"} will be removed. Registered students are notified.`, yes: "Delete event", no: "Keep event", fn: () => A.del(e) })}><Icon n="trash" />Delete</button>
                    </div>
                  </div>
                </article>); })}
          </div>
        </> : curTab === "browse" ? <>
          {nextEv && <div className="next" style={{ background: grad(nextEv.cat) }}>
            <div><span className="tag">Up next · {when(nextEv.date)}</span><h2>{nextEv.title}</h2><small>{fmt.full(nextEv.date)} · {nextEv.venue}</small></div>
            <button className="btn" onClick={() => A.detail(nextEv)}>See details</button></div>}
          <div className="head" style={{ marginBottom: 14 }}><div><h2>Upcoming events</h2><p>Find something worth showing up for, then register in one click.</p></div></div>
          <div className="tools">
            <div className="search"><Icon n="search" s={18} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by title, venue or club" aria-label="Search events" /></div>
            <select className="field" value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort events"><option value="soon">Soonest first</option><option value="seats">Most seats left</option><option value="new">Newly added</option></select>
            <button className="chip" aria-pressed={onlyOpen} onClick={() => setOnlyOpen(!onlyOpen)}>Seats available</button>
            <div className="vt" role="group" aria-label="View"><button aria-pressed={view === "grid"} onClick={() => setView("grid")}><Icon n="grid" s={15} />Grid</button><button aria-pressed={view === "cal"} onClick={() => setView("cal")}><Icon n="cal" s={15} />Calendar</button></div>
          </div>
          <div className="chips" role="group" aria-label="Category">{["All", ...Object.keys(CATS)].map(c => <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}</div>
          {view === "cal" ? <CalendarView events={browse} {...gridProps} /> : <div className="grid">{browse.length === 0 ? <div className="empty"><h3>No events match</h3>Try a different search, category or filter.</div> : browse.map(e => <GridCard key={e.id} e={e} {...gridProps} />)}</div>}
        </> : <>
          <div className="head"><div><h2>My events</h2><p>Your tickets, waitlists and saved events in one place.</p></div></div>
          <div className="stats">
            <div className="stat"><b>{myTabs.upcoming.length}</b><span>Upcoming</span></div>
            <div className="stat"><b>{myTabs.waitlist.length}</b><span>On waitlist</span></div>
            <div className="stat"><b>{myTabs.saved.length}</b><span>Saved</span></div>
            <div className="stat"><b>{myTabs.past.length}</b><span>Attended</span></div>
          </div>
          <div className="chips" role="group" aria-label="My events">{[["upcoming", "Upcoming"], ["waitlist", "Waitlist"], ["saved", "Saved"], ["past", "Past"]].map(([k, l]) => <button key={k} className="chip" aria-pressed={mt === k} onClick={() => setMt(k)}>{l}</button>)}</div>
          <div className="grid">{myTabs[mt].length === 0 ? <div className="empty"><h3>Nothing here yet</h3>{mt === "saved" ? "Tap the heart on any event to save it for later." : "Browse upcoming events and register in one click."}<div style={{ marginTop: 16 }}><button className="btn" onClick={() => setTab("browse")}>Browse events</button></div></div> : myTabs[mt].map(e => <GridCard key={e.id} e={e} {...gridProps} />)}</div>
        </>}
      </div></main>

      {modal && modal.t === "detail" && mEv && <Detail e={mEv} user={user} busy={busy} A={A} saved={saved} onClose={() => setModal(null)} />}
      {modal && modal.t === "ticket" && mEv && <Ticket e={mEv} user={user} A={A} onClose={() => setModal(null)} />}
      {modal && modal.t === "people" && mEv && <Participants e={mEv} A={A} onClose={() => setModal(null)} />}
      {modal && modal.t === "form" && (() => { const e = modal.id && events.find(x => x.id === modal.id); return <EventForm init={e ? { title: e.title, cat: e.cat, desc: e.desc, date: e.date, venue: e.venue, seats: String(e.seats), deadline: e.deadline || "", regsCount: e.regs.length } : null} onSave={f => e ? A.edit(e, f) : A.create(f)} onClose={() => setModal(null)} />; })()}
      {modal && modal.t === "confirm" && (
        <Modal onClose={() => setModal(null)} label={modal.title}><div className="mb">
          <h3>{modal.title}</h3><p className="sub">{modal.text}</p>
          <div className="foot"><button className="btn sec" onClick={() => setModal(null)}>{modal.no}</button><button className="btn dng" onClick={() => { const f = modal.fn; setModal(null); f(); }}>{modal.yes}</button></div></div>
        </Modal>)}
      {modal && modal.t === "profile" && <Profile user={user} onSave={A.saveProfile} onReset={A.reset} onClose={() => setModal(null)} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
