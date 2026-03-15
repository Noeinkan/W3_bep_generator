# CLAUDE.md — Arcquio

## Stack
React 19 + Vite + Express + better-sqlite3 (SQLite) + Python/Ollama ML service. All start via `npm start`.

## Environment
Windows host, bash shell — Unix syntax only (forward slashes, `&&`, `/dev/null`).

## Workflow
- **Plan first.** For 3+ steps or multi-file changes, outline and wait for approval.
- **Subagents for research.** Offload exploration/analysis to subagents; keep main context for implementation.
- **Verify before done.** Run `npm test` after every code change.
- **Fix bugs autonomously.** Root cause → failing test → fix.
- **Stay focused.** No new packages, docs, or scope expansion without approval.
- **Self-improve.** After corrections, update auto memory (`~/.claude/projects/.../memory/`).
- **Tailwind tokens.** Dashed keys only (`text-ui-text-muted`, `bg-ui-primary-hover`). Never camelCase.
- **English only.** All UI copy, comments, commit messages — English.

## Layout
- `src/` — React frontend. Components in `src/components/`, hooks in `src/hooks/`, schemas in `src/schemas/`, services in `src/services/`, config in `src/config/`.
- `server/` — Express backend. Routes in `server/routes/`, services in `server/services/`, DB in `server/db/`, tests in `server/__tests__/`.
- `ml-service/` — Python/Ollama. Separate process, needs separate restart.

## Conventions
- Forms: React Hook Form + Zod (`src/schemas/`)
- State: React Context + local state (no Redux/Zustand)
- Styles: Tailwind CSS (no custom CSS unless necessary)
- Tests: Vitest — frontend `src/__tests__/`, backend `server/__tests__/`. Run: `npm test`
- DB: better-sqlite3 is **synchronous** — no async patterns around DB calls

## Critical gotchas

**BEP config split** — Frontend barrel: `bepConfig.js` (has lucide icons). Edit sub-modules: `bepSteps.js`, `bepTypeDefinitions.js`, `bepOptions.js`, `bepFormFields.js`. Server-safe versions (no icons): `bepStepsData.js`, `bepFormFieldsData.js`, `bepConfigForServer.js` → consumed by `loadBepConfig.js`. Never import icon-bearing files on the server.

**Default BEP structure** — `bepConfigForServer.js` is single source of truth. No DB seed needed; changing config is enough.

**EIR module** — `EirStepWrapper`, `EirFillSummaryModal` in `src/components/eir/`. Fill logic: `useEirFill`. Doc history: `useDocumentHistory`. Never put EIR/doc-history logic in `BepFormView.js`.

**EIR authoring flow** — EirManagerPage → EirFormView (author) → `eirFormAnalysisMapper.js` maps form data to EirAnalysis JSON → GET `/api/eir/drafts/:id/analysis` (no ML). Publish: POST `/api/eir/drafts/:id/publish` (one per project). BEP links via `linkedEirId`; analysis feeds EirContext → responsiveness matrix.

**BepFormView is layout-only.** Orchestrates hooks and sub-components. Domain logic belongs in hooks.

**FormBuilderProvider scope** — `useFormBuilder()` only works *inside* `<FormBuilderProvider>`. Components needing editor state must be defined inside the provider's children subtree, not above it.

**form-builder barrels** — Import from `form-builder/field-editor`, `form-builder/step-editor`, etc. Top-level `form-builder/index.js` exports only `FormBuilderProvider`, `useFormBuilder`, `BepStructureMap`.

**PDF export** — `htmlTemplateService` (HTML + `server/services/templates/bepStyles.css`) → Puppeteer → `server/temp/` → stream → cleanup. Keep Puppeteer server-side only.

**DOCX export** — Client-side via `src/services/docxGenerator.js` (separate pipeline).

**Security middleware** — Helmet + rate-limit exist; some commented out in dev. Do not remove.

**`.env` files** — Never commit. Only `.env.example` is tracked. Secrets via env vars or `encryptedSecretService`.

## Token optimization — MANDATORY

1. **Read `.claude/project-index.md` first.** It maps every dir, route, schema, hook, and context in ~130 lines. Do this before any Glob/Grep.
2. **Narrow all searches.** Always scope Grep/Glob to a specific directory.
3. **Read only what you need.** Use `offset`/`limit` for files >150 lines. Grep for the function first, then read ±30 lines.
4. **Never:** repo-wide Glob/Grep, speculative reads, reading `build/`, `node_modules/`, `venv/`, `.db` files.

## Commands

| Task | Command |
|------|---------|
| Start all | `npm start` |
| Tests | `npm test` |
| Frontend only | `npm run start:frontend` |
| Backend only | `npm run start:backend` |
| Build | `npm run build` |
| Deploy | `bash deploy.sh` |

## Common patterns

- **New API endpoint:** `server/routes/` → `server/services/` → `src/services/apiService.js`
- **New form:** schema in `src/schemas/` → `useForm` + `zodResolver`
- **New page:** `src/components/pages/` → register in `App.js`
- **New protected route:** apply `server/middleware/authMiddleware.js`
- **IDS export:** LOIN rows → `idsGeneratorService.generateIdsXml()` → POST `/api/export/loin/:projectId/ids`
- **IFC import:** `/ifc-import` → POST `/api/bim/parse-ifc` → `ifcParserService` (STEP text, no extra deps) → import deliverables
- **EIR AI suggest:** POST `/api/ai/suggest-eir-field` (proxies to ML service)

## Session management
When hitting limits mid-task: document what's done, list next steps, note any files with partial edits.
