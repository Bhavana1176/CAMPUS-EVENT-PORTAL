# Campus Events – College Event Registration Portal

A modern React + Vite frontend. There is no backend: data is kept in the browser (localStorage).

## Run
```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit + render tests (Vitest)
npm run build      # production build in /dist
```
Needs Node.js 18 or newer.

## Demo accounts (password: demo123)
| Role      | Email                  |
|-----------|------------------------|
| Student   | student@college.edu    |
| Organiser | club@college.edu (also techsoc@college.edu, sports@college.edu) |

You can also create your own student or organiser account from the sign-up screen.

## Features
**Accounts**
- Sign up / sign in for students (roll no, department, year) and organisers
- Profile editing, password change, "Reset demo data"

**Students**
- Browse upcoming events: search, category chips, sort, seats-available filter
- Grid view and month **calendar view**
- One-click registration and a digital ticket with QR-style code
- Registration closes automatically when seats are full, then a **waitlist** opens;
  the next person is promoted automatically when a seat frees up
- Registration deadlines
- Save events, "Add to calendar" (.ics download)
- Dashboard: Upcoming, Waitlist, Saved, Past
- Rate and review events you attended
- Notifications (registered, waitlist promotion, event updated or cancelled)

**Organisers**
- Create, edit, duplicate and delete events (category, seats, venue, deadline)
- Open or close registration manually
- **Insights**: registrations over 14 days, top departments, popular event, waitlist and rating
- Participant list with search, **check-in by ticket code**, remove, and CSV export
- Notifications when students register, cancel or review

**General**: dark mode, responsive layout, keyboard accessible, confirm dialogs

## Project structure
```
src/
  main.jsx               entry point
  App.jsx                state, actions (the "A" object) and page layout
  utils.js               seat/waitlist logic, dates, seed data, CSV and .ics export
  index.css              all styles (design tokens at the top)
  pages/Auth.jsx         sign in / sign up
  components/
    Icon  QR  Modal  EventCard (Seats, Pill, BtnFor, GridCard)
    Detail  Ticket  EventForm  Participants  Profile
    CalendarView  Analytics  Rating
  utils.test.js          logic tests (waitlist, states, deadlines)
  smoke.test.jsx         renders every screen
```

## Connecting a real backend later
Every data change goes through the `A` actions object in `App.jsx`
(register, cancel, create, edit, del, checkin, rate ...). Replace these with API calls
and replace the localStorage reads at the top of `App()` with fetches.
