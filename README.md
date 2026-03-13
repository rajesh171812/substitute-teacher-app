# Substitute Teacher Dashboard

An iOS 18-styled React prototype for managing substitute teaching schedules, schools, and earnings.

## Stack

- **Next.js 16** — App Router
- **React 19**
- **Lucide React** — icons
- **Inline styles** — iOS 18 design token system

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Dashboard** — Monthly stats, earnings card, recent assignments, + Block FAB
- **Scheduler** — Outlook-style calendar, day detail drawer, + Block FAB
- **Schools** — District-grouped school list, add/edit/delete, search
- **Earnings** — Transaction history, yearly totals, export sheet

## Project Structure

```
src/
  app/
    layout.jsx        — Root layout (sets viewport, font meta)
    page.jsx          — Entry point → renders <App />
    globals.css       — Minimal global reset
  components/
    SubDashboard.jsx  — Full app (all components in one file)
public/
  favicon.ico
```

## Simulated Date

`TODAY_SIM = { year: 2026, month: 2, day: 10 }` — change this constant in
`src/components/SubDashboard.jsx` to shift the simulated "today".
