import { describe, it, expect, beforeEach } from "vitest";
import { renderToString } from "react-dom/server";
import App from "./App.jsx";
import { Auth } from "./pages/Auth.jsx";
import { CalendarView } from "./components/CalendarView.jsx";
import { Detail } from "./components/Detail.jsx";
import { Ticket } from "./components/Ticket.jsx";
import { Participants } from "./components/Participants.jsx";
import { Profile } from "./components/Profile.jsx";
import { EventForm } from "./components/EventForm.jsx";
import { SEED_USERS, seedEvents } from "./utils";

const mem = {};
beforeEach(() => {
  for (const k of Object.keys(mem)) delete mem[k];
  globalThis.localStorage = { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; } };
});

const student = SEED_USERS.find(u => u.role === "student");
const A = new Proxy({}, { get: () => () => {} });
const events = seedEvents();

describe("renders without crashing", () => {
  it("auth screen when signed out", () => {
    expect(renderToString(<App />)).toContain("Welcome back");
    expect(renderToString(<Auth users={SEED_USERS} onLogin={() => {}} onSignup={() => {}} />)).toContain("Demo student");
  });
  it("student browse", () => {
    mem.ce2_me = JSON.stringify(student.email);
    const html = renderToString(<App />);
    expect(html).toContain("Upcoming events");
    expect(html).toContain("Hack the Campus 2026");
  });
  it("organiser dashboard with insights", () => {
    mem.ce2_me = JSON.stringify("club@college.edu");
    const html = renderToString(<App />);
    expect(html).toContain("Your events");
    expect(html).toContain("Registrations, last 14 days");
  });
  it("calendar, detail, ticket, participants, profile, form", () => {
    const props = { user: student, busy: null, A, saved: [] };
    expect(renderToString(<CalendarView events={events} {...props} />)).toContain("cal-g");
    const past = events.find(e => e.title === "Resume Clinic");
    expect(renderToString(<Detail e={past} {...props} onClose={() => {}} />)).toContain("Reviews");
    expect(renderToString(<Ticket e={events[0]} user={student} A={A} onClose={() => {}} />)).toContain("Add to calendar");
    expect(renderToString(<Participants e={events[0]} A={A} onClose={() => {}} />)).toContain("Check in by ticket code");
    expect(renderToString(<Profile user={student} onSave={() => {}} onReset={() => {}} onClose={() => {}} />)).toContain("Your profile");
    expect(renderToString(<EventForm init={null} onSave={() => {}} onClose={() => {}} />)).toContain("Registration deadline");
  });
});
