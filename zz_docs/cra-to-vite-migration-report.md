# CRA to Vite Migration Report

Date: 2026-02-15  
Branch: `migrate/cra-to-vite`  
Rollback tag: `pre-vite-migration`

## Scope

Completed migration of frontend tooling from Create React App (`react-scripts`) to Vite + Vitest.
Backend (`server/`) and ML service (`ml-service/`) runtime behavior remains unchanged.

## Executed Steps

### Step 1: Setup and Git Safety
- Created branch `migrate/cra-to-vite`
- Created and pushed rollback tag `pre-vite-migration`
- Installed dev dependencies: `vite`, `@vitejs/plugin-react`, `vitest`, `@vitest/ui`, `jsdom`

### Step 2: Vite Configuration
- Added `vite.config.js` with:
  - Dev server port `3000`
  - Proxy `/api -> http://localhost:3001`
  - Output dir `build/`
  - Manual vendor chunk splitting
  - CSS modules config
  - `process.env` define mapping for existing code compatibility
  - JSX support for existing `.js/.jsx` files under `src/`

### Step 3: index.html Migration
- Moved HTML entry to project root `index.html`
- Removed `%PUBLIC_URL%` placeholders
- Added module entry script: `/src/index.jsx`
- Removed `public/index.html`

### Step 4: Scripts and Dependencies
- Updated `package.json` scripts to Vite/Vitest commands
- Removed `react-scripts`
- Added `preview`, `test:ui`, and `test:run` scripts

### Step 5: Environment Variables
- Added `VITE_API_URL=/api` to:
  - `.env`
  - `.env.development`
  - `.env.production`
- Removed unsupported `NODE_ENV=production` from `.env.production`

### Step 6: Manifest Metadata
- Updated `public/manifest.json` to BEP Generator metadata/branding

### Step 7: Vitest Configuration
- Added `vitest.config.js`
- Updated `src/setupTests.js` for Vitest + RTL cleanup
- Scoped Vitest to frontend tests in `src/**` to avoid backend Jest suite crossover

### Step 8: First Vite Run
- `npm run start:frontend` launched successfully on `http://localhost:3000`
- Startup observed: `ready in 524 ms`

### Step 9: Production Build + Preview
- `npm run build` succeeded
- Output generated in `build/`
- Build time observed: `17.77s`
- `npm run preview` served at `http://localhost:4173`

### Step 10: Tests
- `npm test -- --run` succeeded
- Result: `2 passed files`, `4 passed tests`

## Integration Smoke Checks (Terminal-Verifiable)

Executed with backend + frontend running:
- `GET http://localhost:3001/health` -> `200 OK`
- `POST http://localhost:3001/api/auth/login` with `{}` -> `400` (expected validation rejection)
- `GET http://localhost:3000/` -> `200`
- `GET http://localhost:3000/api/ai/health` -> `200` (Vite proxy path verified)

## Performance Snapshot

| Metric | Observed Before (CRA target baseline) | Observed After (Vite in this migration) |
|---|---:|---:|
| Frontend dev startup | 30-60s (historical) | 0.45-0.52s |
| Production build | 120-180s (historical) | 17.77s |
| Frontend test run | N/A (different runner) | 3.54s |

Note: HMR latency requires interactive browser editing session to measure accurately.

## Non-Blocking Warnings Observed

- `baseline-browser-mapping` data stale warning from dependency tooling.
- Rollup chunk size warning for large vendor/app chunks (existing app size profile).
- Dynamic-vs-static import notices for certain modules (existing import graph behavior).

No blocking migration errors remain.

## Manual QA Checklist (Step 11 - still required)

These flows require browser/UI execution and were not fully automatable in terminal:

1. Authentication: register, verify email, login, logout
2. Project creation and selection
3. BEP form wizard: multi-step save/load/preview
4. Export flows: PDF/DOCX generation and output validation
5. TIDP/MIDP CRUD, dashboards, and exports
6. Responsibility matrix create/edit/export
7. AI user journeys: EIR analysis and guided generation
8. HMR check: edit a UI component and verify hot update timing
9. Browser console check: confirm zero runtime errors

## Rollback

```bash
git reset --hard pre-vite-migration
git checkout master
```

## PR Notes

Recommended title: `chore: migrate frontend from CRA to Vite`

Suggested highlights:
- Zero backend/ML runtime changes
- Dev server and build performance improvements
- CRA dependency removed and migration reversible via git tag
