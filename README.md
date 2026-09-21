# SubTrack

Schedule, earnings and schools for substitute teachers. Next.js (App Router) app that uses the Baseline design system
with a project-only Indigo / Coral / Amber theme. Responsive: bottom nav on phones, icon rail on tablets, sidebar on desktop.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

Needs Node 20 or newer.

## Where things are

- `src/app/layout.js` and `src/app/page.js`: the Next.js shell.
- `src/components/subtrack/SubTrack.jsx`: the whole app (one client component).
- `src/components/subtrack/tokens.css` and `bundle.css`: the Baseline design system. Do not edit; they are copied as-is.
- `src/components/subtrack/subtrack-theme.css`: the project palette (the only place raw colors live).
- `src/components/subtrack/subtrack-app.css`: SubTrack layout classes, built only from tokens.
- `public/`: static files, such as the welcome screen photo or video (see `public/README.txt`).

## Notes

- Google sign-in is simulated. Data lives in memory and resets when the page reloads.
- The welcome and setup screens are always dark; the rest follows the device's light or dark setting.
