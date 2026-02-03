# CLAUDE.md — BEP Generator

## Workflow rules

- **Describe approach first.** Before writing any code, outline the plan and wait for approval. If requirements are ambiguous, ask clarifying questions before touching a file.
- **Break large tasks into small ones.** If a change touches more than 3 files, stop and break it into smaller, sequential tasks before starting.
- **After writing code, flag risks.** List what could break and suggest tests to cover it.
- **Bug workflow: test first.** When fixing a bug, start by writing (or identifying) a test that reproduces it, then fix until it passes.
- **Learn from corrections.** Whenever a correction is made, add a new rule here so the same mistake doesn't repeat.

## Project layout

- Frontend: `src/` — React 19 + CRA (`react-scripts`). Feature folders inside `src/components/`.
- Backend: `server/` — Express + better-sqlite3. Routes in `server/routes/`, business logic in `server/services/`.
- ML service: `ml-service/` — Python + Ollama. Separate process.
- All three start together via `npm start` (concurrently).

## Key conventions

- **Forms:** React Hook Form + Zod schemas (schemas live in `src/schemas/`).
- **State:** React Context + local state. No global store (no Redux/Zustand).
- **API calls:** Service layer in `src/services/` wraps fetch/axios calls.
- **Styles:** Tailwind CSS. No custom CSS files unless necessary.
- **Tests:** Jest. Frontend tests in `src/__tests__/`. Run with `npm test`.
- **DB:** SQLite via better-sqlite3 (synchronous). DB files in `server/db/`.

## Things to watch out for

- **FormBuilderProvider scope.** `useFormBuilder()` only works inside `<FormBuilderProvider>`. If a layout or wrapper component needs `isEditMode`, `steps`, or any editor state, it must be defined *inside* the provider in the JSX tree — you can't read that context from a parent above it. Pattern: define an inner component inside the provider's children.
- **form-builder barrel exports.** Sub-modules have their own barrels: import from `form-builder/field-editor`, `form-builder/step-editor`, etc. The top-level `form-builder/index.js` re-exports `FormBuilderProvider`, `useFormBuilder`, and `BepStructureMap`.
- better-sqlite3 is synchronous — don't accidentally introduce async patterns around DB calls.
- Puppeteer (PDF export) is heavy; avoid pulling it into frontend bundles.
- Security middleware (Helmet, rate-limit) exists but some is commented out in dev — don't remove it.
- CRA (react-scripts) constrains webpack config; don't try to eject or override without good reason.
- The ML service is a separate Python process — changes there need a separate restart.
