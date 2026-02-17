# CLAUDE.md — BEP Generator

## Project Overview
BEP Generator — React 19 + Vite + Express + SQLite tool for building/exporting BEP documents.

## Environment
This is a Windows development environment. For bash commands, use PowerShell-compatible syntax and handle output display issues by using explicit print/echo statements or alternative verification methods.

## Workflow rules

- **Describe approach first.** Before writing any code, outline the plan and wait for approval. If requirements are ambiguous, ask clarifying questions before touching a file.
- **Break large tasks into small ones.** If a change touches more than 3 files, stop and break it into smaller, sequential tasks before starting.
- **After writing code, flag risks.** List what could break and suggest tests to cover it.
- **Bug workflow: test first.** When fixing a bug, start by writing (or identifying) a test that reproduces it, then fix until it passes.
- **Learn from corrections.** Whenever a correction is made, add a new rule here so the same mistake doesn't repeat.
- **Tailwind semantic token naming.** Use dashed keys/classes only (e.g., `text-ui-text-muted`, `bg-ui-primary-hover`, `bg-ui-success-bg`); never use camelCase token names in Tailwind config or utility classes; when adding new UI tokens, keep config keys and class usage naming style exactly matched.
- **After code changes,** run `npm test` before considering done.
- **Stay focused.** Do not perform additional unrequested work like installing packages, creating extra documentation, or expanding scope without explicit user approval.

## Workflow Preferences
- Before starting implementation, briefly confirm the approach with the user rather than diving into extensive codebase exploration. Keep initial exploration focused and minimal.

## Project layout

- Frontend: `src/` — React 19 + Vite. Feature folders inside `src/components/`.
- Backend: `server/` — Express + better-sqlite3. Routes in `server/routes/`, business logic in `server/services/`.
- ML service: `ml-service/` — Python + Ollama. Separate process.
- All three start together via `npm start` (concurrently).

## Key conventions

- **Forms:** React Hook Form + Zod schemas (schemas live in `src/schemas/`).
- **State:** React Context + local state. No global store (no Redux/Zustand).
- **API calls:** Service layer in `src/services/` wraps fetch/axios calls.
- **Styles:** Tailwind CSS. No custom CSS files unless necessary.
- **Tests:** Vitest. Frontend tests in `src/__tests__/`. Run with `npm test`.
- **DB:** SQLite via better-sqlite3 (synchronous). DB files in `server/db/`.

## Things to watch out for

- **FormBuilderProvider scope.** `useFormBuilder()` only works inside `<FormBuilderProvider>`. If a layout or wrapper component needs `isEditMode`, `steps`, or any editor state, it must be defined *inside* the provider in the JSX tree — you can't read that context from a parent above it. Pattern: define an inner component inside the provider's children.
- **form-builder barrel exports.** Sub-modules have their own barrels: import from `form-builder/field-editor`, `form-builder/step-editor`, etc. The top-level `form-builder/index.js` re-exports `FormBuilderProvider`, `useFormBuilder`, and `BepStructureMap`.
- better-sqlite3 is synchronous — don't accidentally introduce async patterns around DB calls.
- Puppeteer (PDF export) is heavy; avoid pulling it into frontend bundles.
- **Export pipeline:** PDF/DOCX generation uses `htmlTemplateService` (renders HTML with `server/services/templates/bepStyles.css`) → Puppeteer. Temp files go to `server/temp/` and should be cleaned up after export.
- Security middleware (Helmet, rate-limit) exists but some is commented out in dev — don't remove it.
- Vite handles frontend bundling and dev server; keep `vite.config.js` aligned with existing proxy/env behavior.
- The ML service is a separate Python process — changes there need a separate restart.

## Token optimization — MANDATORY

### Step 0: Read the project index FIRST
Before ANY exploration, read `.claude/project-index.md`. It maps every directory, context provider, API route, schema, and hook in ~130 lines. This replaces 90% of Glob/Grep discovery.

### Step 1: Use the index to locate, then targeted reads
1. **Look up the location** in the project index (directory → purpose table).
2. **Grep with a narrow path** — e.g., `Grep pattern="createTIDP" path="server/services/"` not the whole repo.
3. **Read only the lines you need** — use `offset`/`limit` on Read for files >150 lines. Grep for the function first, then read ±30 lines around it.

### Step 2: Never do these
- **No repo-wide Glob/Grep** without a path filter. Always scope to a specific directory.
- **No speculative file reads.** Don't read a file "just to understand the codebase." Use the index.
- **No reading entire large files.** If a file is >200 lines, search for the relevant section first.
- **No re-exploring known paths.** The index already maps: schemas → `src/schemas/`, services → `src/services/`, routes → `server/routes/`, DB → `server/services/`, contexts → `src/contexts/`, hooks → `src/hooks/`, config → `src/config/`, constants → `src/constants/`.
- **No loading build/, node_modules/, venv/, .db files.**

### Token budget awareness
- A typical targeted Grep + 30-line Read = ~200 tokens
- A full file Read = ~2,000-5,000 tokens
- A repo-wide Grep = ~5,000-20,000 tokens
- Always choose the smallest operation that answers the question

## Quick reference

| Task | Command |
|------|---------|
| Start all | `npm start` |
| Tests | `npm test` |
| Frontend only | `npm run start:frontend` |
| Backend only | `npm run start:backend` |
| Build | `npm run build` |
| Preview build | `npm run preview` |

## Common patterns

- **New API endpoint:** Route in `server/routes/` → Service in `server/services/` → Frontend call in `src/services/apiService.js`
- **New form:** Schema in `src/schemas/` → Component uses `useForm` with `zodResolver`
- **New page:** Add to `src/components/pages/` → Register route in `App.js`
- **Export/PDF generation:** Data → `htmlTemplateService.js` (render HTML + CSS from `templates/`) → `puppeteerPdfService.js` (Puppeteer) → temp file in `server/temp/` → stream to client → cleanup

## Session Management
When hitting usage limits mid-task, always save progress by:
1. Documenting what's been completed
2. Listing specific next steps
3. Noting any files with partial edits that need attention
