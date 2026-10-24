export const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
export const pad = x => String(x).padStart(2, "0");
export const toLocal = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
export const inDays = (n, h = 10) => { const d = new Date(); d.setDate(d.getDate() + n); d.setHours(h, 0, 0, 0); return toLocal(d); };
export const uid = () => Math.random().toString(36).slice(2, 9);
export const hash = s => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
export const CATS = {
  Tech: ["#2848F0", "#7B5CFF"], Cultural: ["#D6336C", "#FF9A5C"], Sports: ["#0E9F6E", "#7BC62D"],
  Workshop: ["#0A8FB3", "#2848F0"], Academic: ["#3B4A6B", "#7C8DB5"], Social: ["#E58A00", "#E5484D"]
};
export const grad = c => `linear-gradient(135deg,${(CATS[c] || CATS.Tech)[0]},${(CATS[c] || CATS.Tech)[1]})`;
export const DEPTS = ["CSE", "ECE", "EEE", "Mechanical", "Civil", "IT", "AI & DS", "MBA"];
export const YEARS = ["1st year", "2nd year", "3rd year", "4th year"];
export const ORG1 = "club@college.edu", ORG2 = "techsoc@college.edu", ORG3 = "sports@college.edu";
export const SEED_USERS = [
  { name: "Priya Sharma", club: "Events Club", email: ORG1, pass: "demo123", role: "organiser" },
  { name: "Rahul Verma", club: "Tech Society", email: ORG2, pass: "demo123", role: "organiser" },
  { name: "Sneha Patel", club: "Sports Council", email: ORG3, pass: "demo123", role: "organiser" },
  { name: "Ananya Rao", email: "student@college.edu", pass: "demo123", role: "student", roll: "21CS104", dept: "CSE", year: "3rd year" }
];
export const stu = (n, e, r, d, y, ago, chk) => ({ name: n, email: e, roll: r, dept: d, year: y, at: Date.now() - ago * 36e5, checked: !!chk });
export const seedEvents = () => [
  { id: uid(), title: "Hack the Campus 2026", cat: "Tech", desc: "A 24-hour hackathon for all years. Form teams of up to four, pick a problem from the campus problem board and ship a working prototype by sunrise. Mentors from industry will review demos, and the top three teams win internships and prizes.", date: inDays(5, 9), venue: "Innovation Lab, Block C", deadline: inDays(4, 18), seats: 4, organiser: ORG2, orgName: "Tech Society", closed: false, created: Date.now() - 9e8,
    regs: [stu("Ananya Rao", "student@college.edu", "21CS104", "CSE", "3rd year", 30), stu("Karthik Reddy", "karthik@college.edu", "21EC033", "ECE", "3rd year", 26), stu("Meera Iyer", "meera@college.edu", "22IT019", "IT", "2nd year", 12), stu("Rohit Das", "rohit@college.edu", "20ME077", "Mechanical", "4th year", 4)],
    wait: [stu("Sana Khan", "sana@college.edu", "22CS150", "CSE", "2nd year", 2)] },
  { id: uid(), title: "Intro to Product Design", cat: "Workshop", desc: "Hands-on workshop on turning a rough idea into a clickable prototype. We will cover user flows, wireframes and basic prototyping. Bring your laptop; no design experience needed.", date: inDays(9, 14), venue: "Seminar Hall 2", seats: 40, organiser: ORG1, orgName: "Events Club", closed: false, created: Date.now() - 8e8,
    regs: [stu("Karthik Reddy", "karthik@college.edu", "21EC033", "ECE", "3rd year", 20), stu("Meera Iyer", "meera@college.edu", "22IT019", "IT", "2nd year", 9)], wait: [] },
  { id: uid(), title: "Inter-department Cricket League", cat: "Sports", desc: "Knockout T10 matches between departments. Captains register their squad of eleven. Matches run from morning to evening across two days.", date: inDays(14, 8), venue: "Main Ground", seats: 16, organiser: ORG3, orgName: "Sports Council", closed: false, created: Date.now() - 7e8, regs: [stu("Rohit Das", "rohit@college.edu", "20ME077", "Mechanical", "4th year", 40)], wait: [] },
  { id: uid(), title: "Open Mic Evening", cat: "Cultural", desc: "Poetry, music, stand-up, anything goes. Two minutes on stage in any language. Sign up to perform or just come to cheer.", date: inDays(3, 17), venue: "Amphitheatre", seats: 60, organiser: ORG1, orgName: "Events Club", closed: false, created: Date.now() - 6e8, regs: [stu("Ananya Rao", "student@college.edu", "21CS104", "CSE", "3rd year", 15)], wait: [] },
  { id: uid(), title: "Machine Learning Guest Lecture", cat: "Academic", desc: "Dr. Lakshmi Narayan from a leading research lab speaks on how modern language models are trained, followed by Q&A.", date: inDays(7, 11), venue: "Auditorium", seats: 200, organiser: ORG2, orgName: "Tech Society", closed: false, created: Date.now() - 5e8, regs: [], wait: [] },
  { id: uid(), title: "Freshers' Welcome Mixer", cat: "Social", desc: "Meet seniors, play icebreakers and enjoy food from the campus food court. All first years welcome.", date: inDays(12, 16), venue: "Student Centre Lawn", seats: 120, organiser: ORG1, orgName: "Events Club", closed: false, created: Date.now() - 4e8, regs: [], wait: [] },
  { id: uid(), title: "Resume Clinic", cat: "Workshop", desc: "Placement cell mentors review your resume one-on-one in 15-minute slots.", date: inDays(-3, 11), venue: "Placement Cell", ratings: [{ email: "student@college.edu", name: "Ananya Rao", stars: 5, text: "Very useful feedback on my resume." }, { email: "meera@college.edu", name: "Meera Iyer", stars: 4, text: "Good session, wish it was longer." }], seats: 30, organiser: ORG1, orgName: "Events Club", closed: false, created: Date.now() - 2e9,
    regs: [stu("Ananya Rao", "student@college.edu", "21CS104", "CSE", "3rd year", 200, true), stu("Meera Iyer", "meera@college.edu", "22IT019", "IT", "2nd year", 190, false)], wait: [] }
];
export const fmt = {
  month: d => new Date(d).toLocaleString("en", { month: "short" }),
  day: d => new Date(d).getDate(),
  wd: d => new Date(d).toLocaleString("en", { weekday: "short" }),
  time: d => new Date(d).toLocaleString("en", { hour: "numeric", minute: "2-digit" }),
  full: t => new Date(t).toLocaleString("en", { dateStyle: "medium", timeStyle: "short" }),
  ago: t => { const m = (Date.now() - t) / 6e4; return m < 1 ? "just now" : m < 60 ? `${Math.floor(m)} min ago` : m < 1440 ? `${Math.floor(m / 60)} h ago` : `${Math.floor(m / 1440)} d ago`; }
};
export const when = d => { const ms = new Date(d) - Date.now(); if (ms < 0) return "Ended"; const m = ms / 6e4, h = m / 60, dd = Math.ceil(h / 24); return h < 1 ? `Starts in ${Math.ceil(m)} min` : h < 24 ? `Starts in ${Math.floor(h)} h` : `In ${dd} day${dd > 1 ? "s" : ""}`; };
export const isPast = e => new Date(e.date) < new Date();
export const isFull = e => e.regs.length >= e.seats;
export const isReg = (e, u) => e.regs.some(r => r.email === u.email);
export const isWait = (e, u) => e.wait.some(r => r.email === u.email);
export const stateOf = (e, u) => isPast(e) ? "past" : isReg(e, u) ? "registered" : isWait(e, u) ? "waitlisted" : isClosed(e) ? "closed" : isFull(e) ? "full" : "open";
export const fill = e => { const regs = [...e.regs], wait = [...e.wait], promoted = []; while (regs.length < e.seats && wait.length) { const p = wait.shift(); regs.push({ ...p, at: Date.now() }); promoted.push(p); } return { e: { ...e, regs, wait }, promoted }; };
export const ticketId = (e, u) => "CE-" + hash(e.id + u.email).toString(36).toUpperCase().slice(0, 6);

export async function saveCsv(ev) {
  const rows = [["#", "Name", "Email", "Roll no", "Department", "Year", "Registered at", "Checked in", "Ticket"], ...ev.regs.map((r, i) => [i + 1, r.name, r.email, r.roll || "", r.dept || "", r.year || "", fmt.full(r.at), r.checked ? "Yes" : "No", ticketId(ev, r)])];
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const filename = ev.title.replace(/[^\w]+/g, "_") + "_participants.csv";
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
}

export const isClosed = e => !!e.closed || (!!e.deadline && new Date(e.deadline) < new Date());
export const avgRating = e => { const r = e.ratings || []; return r.length ? r.reduce((s, x) => s + x.stars, 0) / r.length : 0; };
export const dayKey = d => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
export function calLinks(e) {
  const start = new Date(e.date), end = new Date(start.getTime() + 2 * 36e5);
  const f = d => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const q = encodeURIComponent;
  return {
    google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${q(e.title)}&dates=${f(start)}/${f(end)}&details=${q(e.desc)}&location=${q(e.venue)}`,
    outlook: `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${q(e.title)}&startdt=${q(start.toISOString())}&enddt=${q(end.toISOString())}&body=${q(e.desc)}&location=${q(e.venue)}`
  };
}
export function saveIcs(e) {
  const f = d => new Date(d).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const esc = s => String(s).replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
  const end = new Date(new Date(e.date).getTime() + 2 * 36e5);
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Campus Events//EN", "BEGIN:VEVENT", `UID:${e.id}@campus-events`, `DTSTAMP:${f(Date.now())}`, `DTSTART:${f(e.date)}`, `DTEND:${f(end)}`, `SUMMARY:${esc(e.title)}`, `LOCATION:${esc(e.venue)}`, `DESCRIPTION:${esc(e.desc)}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = e.title.replace(/[^\w]+/g, "_") + ".ics";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
