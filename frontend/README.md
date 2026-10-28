# CampusPass frontend

React + Vite + Tailwind + React Router + lucide-react.

    npm install
    npm run dev        # sample data (clearly labelled in the UI)
    npm run build && npm run preview

## Connect the real API
Copy `.env.example` to `.env`, set `VITE_API_URL` and `VITE_EVENTS_PATH`.
Field mapping lives in `src/api/events.js` (`normalise`). Login lives in `src/api/auth.js` (not implemented).

## Structure
- `tailwind.config.js` design tokens (palette, fonts)
- `src/components` Nav, Hero, Graphic (category SVG posters), EventRow, States, Footer
- `src/pages` Home (search, filters, paged list), EventDetail, SignIn
