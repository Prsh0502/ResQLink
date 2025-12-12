# ResQ-Link Command Center UI

A single-page React dashboard that recreates the ResQ-Link Command Center experience shown in the provided reference screens. It includes four primary tabs—Overview, Incidents, Volunteers, and Analytics—with matching cards, controls, and a stylized city heatmap.

## Tech Stack
- React 19 + Vite
- CSS (no UI libraries)

## Getting Started
1) Install dependencies
```bash
npm install
```
2) Run the dev server
```bash
npm run dev
```
3) Open the app
The terminal will show a local URL (typically http://localhost:5173). Open it in your browser to view the dashboard.

## Available Scripts
- `npm run dev` — start Vite with HMR
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

## Project Structure
- `src/App.jsx` — UI layout, tab logic, sample data, heatmap, charts
- `src/App.css` — component-level styling and layout system
- `src/index.css` — global styles and font imports
- `public/` — static assets served by Vite

## Notes on the Implementation
- Tabs and sub-tabs mirror the reference screens: Overview (map + comms), Incidents (filters, alerts), Volunteers (roster cards), Analytics (trends, donut, bar chart).
- The heatmap layer is CSS-based: radial gradients over a stylized grid background; pins indicate critical/pending/available spots.
- Charts are lightweight, built with SVG (trends) and CSS (donut/bar), keeping dependencies minimal.
- Sample data is hard-coded for quick visualization; replace with live data sources as needed.

## Customization
- Update colors or spacing in `src/App.css`.
- Swap the CSS heatmap for a real map provider by replacing the `heatmapPoints` layer with map markers.
- Replace sample data in `src/App.jsx` with API calls or state management of your choice.

## License
MIT
