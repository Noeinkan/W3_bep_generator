# CLAUDE.md — BEP Generator

## Project Overview
BEP Generator — React 19 + Vite + Express + SQLite tool for building/exporting BEP documents.

## Environment
Windows host, but shell is bash — use Unix syntax (forward slashes, `/dev/null` not NUL, `&&` chaining). Do not use PowerShell syntax.

## Workflow rules

- **Plan before coding.** For any non-trivial task (3+ steps, architectural decisions, or multi-file changes), outline the approach and wait for approval. Ask clarifying questions before touching a file.
- **Use subagents to protect context.** Offload research, exploration, and parallel analysis to subagents. Keep the main context window clean for implementation. One focused task per subagent.
- **Verify before done.** Never mark a task complete without proving it works. Run `npm test` after every code change. Diff behavior against main when relevant.
- **Fix bugs autonomously.** When given a bug report, just fix it — no hand-holding. Identify root cause → write or find a failing test → fix until it passes.
- **Demand elegance (balanced).** For non-trivial changes, pause and ask "is there a more elegant way?" Skip this for simple, obvious fixes. Don't over-engineer.
- **Self-improve after corrections.** Whenever a correction is made, record the lesson in the auto memory system (`~/.claude/projects/.../memory/`). Don't repeat the same mistake.
- **Tailwind semantic token naming.** Use dashed keys/classes only (e.g., `text-ui-text-muted`, `bg-ui-primary-hover`, `bg-ui-success-bg`); never use camelCase token names in Tailwind config or utility classes; when adding new UI tokens, keep config keys and class usage naming style exactly matched.
- **Stay focused.** Do not install packages, create extra documentation, or expand scope without explicit user approval.

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

- **BEP config is split into sub-modules.** `bepConfig.js` is the frontend barrel (imports lucide icons) — edit `bepSteps.js` (step list + icons), `bepTypeDefinitions.js` (pre/post metadata), `bepOptions.js` (option arrays), or `bepFormFields.js` (field definitions + icons). All frontend consumers import `CONFIG` from `bepConfig.js` unchanged. **For server-side use** (Node can't import lucide-react): use `bepStepsData.js` (step data only), `bepFormFieldsData.js` (field data only), and `bepConfigForServer.js` (server-safe CONFIG barrel) — these are consumed by `server/services/loadBepConfig.js`. Never import the icon-bearing variants on the server.
- **Default BEP structure: CONFIG is the single source of truth.** The default template (GET /template, clone-to-draft, reset) is built from `bepConfigForServer.js` on the server via `loadBepConfig.js`; no DB default template is read for the global default. Adding or changing fields/sections in config is enough—no seed run or frontend merge required.
- **EIR pre-step lives in the EIR module.** `EirStepWrapper` and `EirFillSummaryModal` are in `src/components/eir/`. The fill logic (`useEirFill`) and document history logic (`useDocumentHistory`) are in `src/hooks/`. Do not put EIR or document-history domain logic back into `BepFormView.js`.
- **BepFormView is layout-only.** `BepFormView.js` is pure orchestration — it composes hooks and sub-components. Domain logic belongs in hooks (`useEirFill`, `useDocumentHistory`, `useStepNavigation`, `useDraftSave`).
- **FormBuilderProvider scope.** `useFormBuilder()` only works inside `<FormBuilderProvider>`. If a layout or wrapper component needs `isEditMode`, `steps`, or any editor state, it must be defined *inside* the provider in the JSX tree — you can't read that context from a parent above it. Pattern: define an inner component inside the provider's children.
- **form-builder barrel exports.** Sub-modules have their own barrels: import from `form-builder/field-editor`, `form-builder/step-editor`, etc. The top-level `form-builder/index.js` re-exports `FormBuilderProvider`, `useFormBuilder`, and `BepStructureMap`.
- better-sqlite3 is synchronous — don't accidentally introduce async patterns around DB calls.
- Puppeteer (PDF export) is heavy; avoid pulling it into frontend bundles.
- **PDF export pipeline:** PDF uses `htmlTemplateService` (renders HTML with `server/services/templates/bepStyles.css`) → Puppeteer → temp file in `server/temp/` → cleaned up after export. DOCX is a separate client-side pipeline via `src/services/docxGenerator.js`.
- Security middleware (Helmet, rate-limit) exists but some is commented out in dev — don't remove it.
- Vite handles frontend bundling and dev server; keep `vite.config.js` aligned with existing proxy/env behavior.
- The ML service is a separate Python process — changes there need a separate restart.
- **`.env` files:** Never commit `.env.*` files (only `.env.example`). Secrets go in environment variables or `encryptedSecretService`. `.env.production` is gitignored — keep it that way.

## Token optimization — MANDATORY

### Step 0: Read the project index FIRST
Before ANY exploration, read `.claude/project-index.md`. It maps every directory, context provider, API route, schema, and hook in ~130 lines. This replaces 90% of Glob/Grep discovery.

### Step 1: Use the index to locate, then targeted reads
1. **Look up the location** in the project index (directory → purpose table).
2. **Grep with a narrow path** — e.g., `Grep pattern="createTIDP" path="server/services/"` not the whole repo.
3. **Read only the lines you need** — use `offset`/`limit` on Read for files >150 lines. Grep for the function first, then read ±30 lines around it.

### Never do these
- **No repo-wide Glob/Grep** without a path filter. Always scope to a specific directory.
- **No speculative file reads.** Don't read a file "just to understand the codebase." Use the index.
- **No reading entire large files.** If a file is >200 lines, search for the relevant section first.
- **No re-exploring known paths.** The index already maps: schemas → `src/schemas/`, services → `src/services/`, routes → `server/routes/`, DB → `server/services/`, contexts → `src/contexts/`, hooks → `src/hooks/`, config → `src/config/`, constants → `src/constants/`.
- **No loading build/, node_modules/, venv/, .db files.**

### Token budget
- Targeted Grep + 30-line Read = ~200 tokens
- Full file Read = ~2,000–5,000 tokens
- Repo-wide Grep = ~5,000–20,000 tokens

## Quick reference

| Task | Command |
|------|---------|
| Start all | `npm start` |
| Tests | `npm test` |
| Frontend only | `npm run start:frontend` |
| Backend only | `npm run start:backend` |
| Build | `npm run build` |
| Preview build | `npm run preview` |
| Deploy (Hetzner) | `bash deploy.sh` (Docker-based, builds + pushes to Hetzner) |

## Common patterns

- **New API endpoint:** Route in `server/routes/` → Service in `server/services/` → Frontend call in `src/services/apiService.js`
- **New protected route:** Apply `server/middleware/authMiddleware.js` before the route handler.
- **New form:** Schema in `src/schemas/` → Component uses `useForm` with `zodResolver`
- **New page:** Add to `src/components/pages/` → Register route in `App.js`
- **PDF export:** Data → `htmlTemplateService.js` (render HTML + CSS from `templates/`) → `puppeteerPdfService.js` (Puppeteer) → temp file in `server/temp/` → stream to client → cleanup
- **DOCX export:** Uses `docxGenerator` in `src/services/` (client-side, separate pipeline from PDF).

## Session Management
When hitting usage limits mid-task, always save progress by:
1. Documenting what's been completed
2. Listing specific next steps
3. Noting any files with partial edits that need attention
