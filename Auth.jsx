import { useState } from "react";
import { grad, DEPTS, YEARS, ORG1 } from "../utils";
import { Icon } from "../components/Icon";

export function Auth({ users, onLogin, onSignup }) {
  const [mode, setMode] = useState("in"), [role, setRole] = useState("student"), [show, setShow] = useState(false), [err, setErr] = useState("");
  const [f, setF] = useState({ name: "", email: "", pass: "", roll: "", club: "", dept: DEPTS[0], year: YEARS[0] });
  const set = k => e => { setF({ ...f, [k]: e.target.value }); setErr(""); };

  const submit = e => {
    e.preventDefault();
    const email = f.email.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Enter a valid college email.");

    if (mode === "in") {
      const u = users.find(x => x.email === email && x.pass === f.pass);
      return u ? onLogin(u) : setErr("Incorrect email or password.");
    }

    if (!f.name.trim()) return setErr("Enter your full name.");
    if (f.pass.length < 6) return setErr("Password must be at least 6 characters.");
    if (role === "student" && !f.roll.trim()) return setErr("Enter your roll number.");
    if (users.some(x => x.email === email)) return setErr("An account with this email already exists. Sign in instead.");

    onSignup({
      name: f.name.trim(),
      email,
      pass: f.pass,
      role,
      ...(role === "student"
        ? { roll: f.roll.trim().toUpperCase(), dept: f.dept, year: f.year }
        : { club: f.club.trim() })
    });
  };

  const demo = (email) => onLogin(users.find(u => u.email === email));

  return (
    <div className="login">
      <section className="hero">
        <div className="logo"><i><Icon n="cal" s={17} /></i><span>Campus Events</span></div>
        <div>
          <span className="badge"><i className="live" />New events every week</span>
          <h1>Don't just hear about it. <em>Be there.</em></h1>
          <p style={{ marginTop: 18 }}>Hackathons, workshops, concerts and cricket leagues. Browse what's on, grab your seat in one tap and get your ticket instantly.</p>
          <div className="feat">
            <span><Icon n="check" />Seats lock automatically, and a waitlist takes over</span>
            <span><Icon n="check" />Instant digital tickets and live notifications</span>
            <span><Icon n="check" />Check-in, participant lists and CSV export for organisers</span>
          </div>
        </div>
        <div className="sample">
          <div className="stub" style={{ background: grad("Cultural") }}>
            <em>Sat</em><b>18</b><small>Oct</small>
          </div>
          <div><h3>Open Mic Evening</h3><small>Amphitheatre · 12 seats left</small></div>
        </div>
      </section>

      <section className="formside">
        <form className="card" onSubmit={submit} noValidate>
          <h2>{mode === "in" ? "Welcome back" : "Create your account"}</h2>
          <p className="sub">{mode === "in" ? "Sign in to browse or manage events." : "It takes under a minute."}</p>

          {mode === "up" && (
            <div className="seg" role="group" aria-label="Account type">
              <button type="button" aria-pressed={role === "student"} onClick={() => setRole("student")}>Student</button>
              <button type="button" aria-pressed={role === "organiser"} onClick={() => setRole("organiser")}>Organiser</button>
            </div>
          )}

          {mode === "up" && (
            <label className="f">
              Full name
              <input className="field" value={f.name} onChange={set("name")} placeholder={role === "student" ? "e.g. Ananya Rao" : "e.g. Ravi Kumar"} autoComplete="name" />
            </label>
          )}

          <label className="f">
            College email
            <input className="field" type="email" value={f.email} onChange={set("email")} placeholder="you@college.edu" autoComplete="email" />
          </label>

          <label className="f">
            Password
            <span className="pw">
              <input className="field" type={show ? "text" : "password"} value={f.pass} onChange={set("pass")} placeholder={mode === "up" ? "At least 6 characters" : "Your password"} autoComplete={mode === "in" ? "current-password" : "new-password"} />
              <button type="button" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
            </span>
          </label>

          {mode === "up" && role === "student" && <>
            <label className="f">
              Roll number
              <input className="field" value={f.roll} onChange={set("roll")} placeholder="e.g. 21CS104" />
            </label>
            <div className="row">
              <label className="f">
                Department
                <select className="field" value={f.dept} onChange={set("dept")}>
                  {DEPTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </label>
              <label className="f">
                Year
                <select className="field" value={f.year} onChange={set("year")}>
                  {YEARS.map(d => <option key={d}>{d}</option>)}
                </select>
              </label>
            </div>
          </>}

          {err && <div className="err" role="alert" style={{ marginBottom: 12 }}>{err}</div>}

          <button className="btn w">{mode === "in" ? "Sign in" : "Create account"}</button>

          <div className="demo">
            {mode === "in" ? (
              <>New here? <button type="button" onClick={() => { setMode("up"); setErr(""); }}>Create an account</button></>
            ) : (
              <>Already registered? <button type="button" onClick={() => { setMode("in"); setErr(""); }}>Sign in</button></>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
