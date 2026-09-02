# Yulduzlar Osmoni — Star Board

A classroom star-reward tracker (Next.js App Router + MongoDB). Multiple
teachers can log in, each managing their own classes/rosters, five reward
reasons per lesson, a "top stars" view, lesson history, monthly stats with a
top-3 reward pick, and a finish-lesson flow that archives the day's results.

## Setup

1. Install dependencies (already done if you ran this via the assistant):

   ```bash
   npm install
   ```

2. Create `.env.local` from the example:

   ```bash
   cp .env.local.example .env.local
   ```

   Edit it and set:
   - `MONGODB_URI` — a MongoDB Atlas connection string (free tier works:
     https://www.mongodb.com/cloud/atlas) or a local `mongod` instance.
   - `AUTH_SECRET` — a long random string used to sign login sessions.
     Generate one with:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000 — since no teacher accounts exist yet, you'll
   land on **/setup** to create the first account. That account becomes the
   **admin**.

## Accounts & access

- The **first account created (via `/setup`)** is the admin.
- The admin can create additional teacher accounts from the "O'qituvchilar"
  panel (visible only to the admin, on the class-picker screen).
- Every teacher (including the admin) logs in at `/login` and only ever sees
  and manages **their own** classes — rosters, stars, and history are not
  shared between teachers.
- Sessions are a signed cookie (30 days). Log out with "Chiqish".

## How it works

- **Classes**: each teacher creates as many classes as they want, each with
  its own student roster. Switch classes from "Sinflar" in the top-left of
  the board.
- **Stars**: click a student, tick off reward reasons (participation, correct
  answer, helping a classmate, discipline, most active) — up to 5 per lesson.
- **Finish lesson** ("Darsni yakunlash"): archives every student's star count
  for that lesson/topic/date into history, then resets stars for the next
  lesson.
- **History** ("Tarix"): browse the last 60 finished lessons per class (top 3
  of each lesson).
- **Oylik hisobot** (monthly report): pick a month and see every student's
  total stars summed across that month's finished lessons, ranked — the top
  3 are highlighted as the reward pick for the month.
- **Roster** ("Ro'yxat"): add/remove students from the class.

## Data model

- `Teacher` — login, password hash, role (`admin` | `teacher`).
- `Class` — owner (teacher), name, student list, in-progress star counts (per
  current lesson), topic, lesson date.
- `History` — one entry per finished lesson per class: date, topic, and every
  student's star count that lesson (used both for the lesson-level top-3 and
  the monthly aggregate).

## Deploying

Any Next.js host works (Vercel, Render, your own server). Set `MONGODB_URI`
and `AUTH_SECRET` as environment variables in that host's dashboard — use a
hosted MongoDB (e.g. MongoDB Atlas) rather than a local database when
deploying, and use a freshly generated `AUTH_SECRET` (don't reuse a dev one).

## Original prototypes

The `reference-jsx/` folder keeps the three original single-file React
prototypes (`yulduzlar-taxtasi.jsx` → `-v3.jsx`) this app was built from, for
reference only — they are not part of the running app.
