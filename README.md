# ✦ CosmicDeals ✦

Affiliate product showcase site — Vite + React.

## Setup

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```

Output is in the `dist/` folder.

## Deploy on Netlify

1. Push this repo to GitHub.
2. In Netlify: **Add new site** → **Import an existing project** → choose the repo.
3. Build settings (usually auto-detected from `netlify.toml`):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Deploy.

Single-page app routing is handled by the redirect rule in `netlify.toml`.
