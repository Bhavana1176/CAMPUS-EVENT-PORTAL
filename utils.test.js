import { describe, it, expect } from "vitest";
import { fill, stateOf, isClosed, ticketId, avgRating, inDays } from "./utils";

const person = n => ({ name: n, email: n + "@x.edu" });
const mk = (o = {}) => ({ id: "e1", seats: 2, date: inDays(3), regs: [], wait: [], ...o });

describe("waitlist promotion", () => {
  it("promotes the waitlist in order when seats are free", () => {
    const { e, promoted } = fill(mk({ regs: [person("a")], wait: [person("b"), person("c")] }));
    expect(e.regs.map(r => r.name)).toEqual(["a", "b"]);
    expect(e.wait.map(r => r.name)).toEqual(["c"]);
    expect(promoted.map(r => r.name)).toEqual(["b"]);
  });
  it("does nothing when the event is full", () => {
    const { e, promoted } = fill(mk({ regs: [person("a"), person("b")], wait: [person("c")] }));
    expect(e.regs).toHaveLength(2);
    expect(promoted).toHaveLength(0);
  });
});

describe("event state", () => {
  const me = person("me");
  it("open, full, registered, waitlisted", () => {
    expect(stateOf(mk(), me)).toBe("open");
    expect(stateOf(mk({ regs: [person("a"), person("b")] }), me)).toBe("full");
    expect(stateOf(mk({ regs: [me] }), me)).toBe("registered");
    expect(stateOf(mk({ regs: [person("a"), person("b")], wait: [me] }), me)).toBe("waitlisted");
  });
  it("closed by organiser or by deadline", () => {
    expect(stateOf(mk({ closed: true }), me)).toBe("closed");
    expect(isClosed(mk({ deadline: inDays(-1) }))).toBe(true);
    expect(isClosed(mk({ deadline: inDays(1) }))).toBe(false);
  });
  it("past events are ended", () => {
    expect(stateOf(mk({ date: inDays(-2) }), me)).toBe("past");
  });
});

describe("helpers", () => {
  it("ticket ids are stable and well formed", () => {
    const e = mk(), u = person("me");
    expect(ticketId(e, u)).toBe(ticketId(e, u));
    expect(ticketId(e, u)).toMatch(/^CE-[A-Z0-9]{3,6}$/);
  });
  it("averages ratings", () => {
    expect(avgRating(mk())).toBe(0);
    expect(avgRating(mk({ ratings: [{ stars: 5 }, { stars: 4 }] }))).toBe(4.5);
  });
});

import { calLinks } from "./utils";
describe("calendar links", () => {
  it("builds Google and Outlook links with the event details", () => {
    const l = calLinks({ title: "Hack & Learn", desc: "Build things", venue: "Lab 1", date: "2026-11-02T10:00" });
    expect(l.google).toContain("calendar.google.com");
    expect(l.google).toContain("Hack%20%26%20Learn");
    expect(l.google).toContain("dates=");
    expect(l.outlook).toContain("outlook.live.com");
    expect(l.outlook).toContain("Lab%201");
  });
});
