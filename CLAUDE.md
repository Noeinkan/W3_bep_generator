# CLAUDE.md — BEP Generator

## Project Overview
BEP Generator — a React 19 + Vite + Express + SQLite application for building, editing, and exporting BIM Execution Plan (BEP) documents, along with TIDP/MIDP management, IDRM dashboards, and responsibility matrices. Includes an AI/ML service (FastAPI + Ollama) for EIR analysis and content generation.

## Environment
Primary development is on Windows (PowerShell). CI/web environments may use Linux. For bash commands, prefer cross-platform syntax. Handle output display issues by using explicit print/echo statements or alternative verification methods.

## Workflow rules

- **Describe approach first.** Before writing any code, outline the plan and wait for approval. If requirements are ambiguous, ask clarifying questions before touching a file.
- **Break large tasks into small ones.** If a change touches more than 3 files, stop and break it into smaller, sequential tasks before starting.
- **After writing code, flag risks.** List what could break and suggest tests to cover it.
- **Bug workflow: test first.** When fixing a bug, start by writing (or identifying) a test that reproduces it, then fix until it passes.
- **Learn from corrections.** Whenever a correction is made, add a new rule here so the same mistake doesn't repeat.
- **After code changes,** run `npm test` before considering done.
- **Stay focused.** Do not perform additional unrequested work like installing packages, creating extra documentation, or expanding scope without explicit user approval.

## Workflow Preferences
- Before starting implementation, briefly confirm the approach with the user rather than diving into extensive codebase exploration. Keep initial exploration focused and minimal.

## Project layout

```
W3_bep_generator/
├── src/                      # Frontend — React 19 + Vite
│   ├── components/           # Feature folders (see below)
│   ├── contexts/             # AuthContext, ProjectContext, BepFormContext, EirContext
│   ├── schemas/              # Zod validation schemas
│   ├── services/             # API service layer (axios/fetch wrappers)
│   ├── hooks/                # Custom React hooks
│   ├── data/                 # Static data, templates, help content
│   ├── config/               # bepConfig.js (BEP types, step categories, field mappings)
│   ├── constants/            # fieldExamples, routes, tidpTemplates, ISO activities
│   ├── utils/                # cn, complianceCheck, csvHelpers, layoutUtils, etc.
│   ├── styles/               # App.css, index.css
│   ├── assets/               # Static assets (logo, images)
│   ├── __tests__/            # Frontend tests (Vitest)
│   └── App.js                # Root component with route definitions
├── server/                   # Backend — Express + better-sqlite3
│   ├── routes/               # API route handlers
│   ├── services/             # Business logic services
│   ├── db/                   # database.js (SQLite setup + migrations), .db file
│   ├── middleware/            # authMiddleware.js (JWT verify)
│   ├── validators/           # Joi validation (auth, tidp, midp)
│   ├── scripts/              # DB migration and seed scripts
│   ├── __tests__/            # Backend tests (Jest)
│   ├── app.js                # Express app module (routes for testing)
│   ├── server.js             # Server entry point (startup, middleware, Puppeteer init)
│   └── package.json          # Separate backend dependencies
├── ml-service/               # ML service — FastAPI + Ollama
│   ├── api_ollama.py         # FastAPI server
│   ├── eir_analyzer.py       # EIR document analysis
│   ├── ollama_generator.py   # Ollama LLM integration
│   ├── text_extractor.py     # Document text extraction
│   └── requirements.txt      # Python dependencies
├── nginx/                    # Nginx reverse proxy config (production)
├── scripts/                  # Dev scripts (check-ports, start-ollama, reports)
├── docs/                     # Documentation and migration reports
├── docker-compose.yml        # Production Docker setup
├── Dockerfile.backend        # Backend Docker image
├── vite.config.js            # Vite config (proxy, build chunks, JSX)
├── vitest.config.js          # Vitest config (jsdom, threads pool)
├── tailwind.config.js        # Tailwind CSS config
└── package.json              # Root package (scripts, frontend deps)
```

### Frontend component directories

| Directory | What's there |
|-----------|-------------|
| `src/components/auth/` | Login, Register, ProtectedRoute |
| `src/components/common/` | Button, Select, Modal, FormField, ConfirmDialog |
| `src/components/eir/` | EIR upload, analysis view, suggest button |
| `src/components/export/` | BEP preview renderer, hidden component renderer |
| `src/components/form-builder/` | Dynamic form structure editor (steps, fields, drag-drop, FieldTypeRegistry) |
| `src/components/forms/ai/` | AI assistant tabs, suggestion buttons, smart help |
| `src/components/forms/base/` | Base inputs: text, textarea, checkbox, editable table |
| `src/components/forms/controls/` | Progress bar/sidebar, command palette, search filter |
| `src/components/forms/custom/` | CDE platform, naming convention, federation, RACI, clash matrix |
| `src/components/forms/diagrams/` | Org chart, folder structure, volume mindmap, CDE diagram |
| `src/components/forms/editors/` | TipTap rich text editor + toolbar + extensions |
| `src/components/forms/specialized/` | Budget input, milestones table, org structure field |
| `src/components/forms/tables/` | StandardsTable, TableBubbleMenu |
| `src/components/forms/dialogs/` | EditModal, FindReplaceDialog, TableInsertDialog |
| `src/components/layout/` | MainLayout (sidebar, header, Outlet) |
| `src/components/midp/` | MIDP form, list, evolution dashboard |
| `src/components/pages/` | HomePage, ProjectsPage, BEPGeneratorWrapper, ProfilePage, SettingsPage, TidpEditorPage |
| `src/components/pages/auth/` | LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage, VerifyEmailPage, VerificationPendingPage |
| `src/components/pages/bep/` | BEP workflow views: start menu, type selector, form, drafts, import, preview, structure map, templates |
| `src/components/pages/bep/components/` | BepHeader, BepFooter, BepSidebar, SuccessToast |
| `src/components/pages/drafts/` | DraftManager, DraftListItem, SaveDraftDialog, SearchAndFilters |
| `src/components/pages/tidp-midp/` | TIDP/MIDP dashboard, risk register, resource plan, quality gates, dependency matrix, cascading impact |
| `src/components/pages/idrm-manager/` | IDRM dashboard (IM activities, deliverables, templates) |
| `src/components/responsibility-matrix/` | RACI matrix manager, IM activities, deliverables, export, TIDP sync |
| `src/components/tidp/` | TIDP dashboard, form, list, details, import, Excel editor |
| `src/components/steps/` | FormStepRHF (RHF step wrapper) |

### Backend service layer

| Service | Purpose |
|---------|---------|
| `authService.js` | User authentication (bcrypt, JWT) |
| `projectService.js` | Project CRUD |
| `tidpService.js` | TIDP CRUD and container management |
| `midpService.js` | MIDP CRUD |
| `bepStructureService.js` | Dynamic BEP form structure (steps, fields) |
| `responsibilityMatrixService.js` | RACI matrix CRUD |
| `exportService.js` | Excel/data export |
| `puppeteerPdfService.js` | PDF generation via Puppeteer browser pool |
| `htmlTemplateService.js` | HTML template rendering for exports |
| `eirExportService.js` | EIR document export |
| `emailService.js` | Email sending (nodemailer) |
| `emailTemplates.js` | Email HTML templates |
| `tidpSyncService.js` | TIDP synchronization logic |

### Backend validators

| File | Validates |
|------|----------|
| `authValidator.js` | Auth request payloads (Joi) |
| `tidpValidator.js` | TIDP request payloads (Joi) |
| `midpValidator.js` | MIDP request payloads (Joi) |

## Key conventions

- **Forms:** React Hook Form + Zod schemas (schemas live in `src/schemas/`).
- **State:** React Context + local state. No global store (no Redux/Zustand).
- **API calls:** Service layer in `src/services/` wraps axios calls. Base URL configured via Vite proxy (`/api` → `localhost:3001`).
- **Styles:** Tailwind CSS. No custom CSS files unless necessary.
- **Tests (frontend):** Vitest + @testing-library/react. Tests in `src/__tests__/`. Run with `npm test`.
- **Tests (backend):** Jest + supertest. Tests in `server/__tests__/`. Run via `cd server && npm test`.
- **DB:** SQLite via better-sqlite3 (synchronous). DB file at `server/db/bep-generator.db`.
- **Backend validation:** Joi (not Zod) for request validation in `server/validators/`.
- **IDs:** `@paralleldrive/cuid2` for generating unique IDs on the backend.
- **File uploads:** multer (max 20MB for documents).

## Routing overview (App.js)

| Route | Component | Auth |
|-------|-----------|------|
| `/home` | HomePage | Public |
| `/login`, `/register`, `/forgot-password`, `/reset-password/:token`, `/verify-email`, `/verification-pending` | Auth pages | Public |
| `/projects` | ProjectsPage | Protected |
| `/bep-generator/*` | BEPGeneratorWrapper (nested routes) | Protected |
| `/tidp-midp/*` | TIDPMIDPDashboard + sub-pages | Protected |
| `/idrm-manager/*` | IDRMDashboard + sub-pages | Protected |
| `/tidp-editor`, `/tidp-editor/:id` | TidpEditorPage | Protected |
| `/responsibility-matrix` | ResponsibilityMatrixManager | Protected |
| `/profile` | ProfilePage | Protected |
| `/settings` | SettingsPage | Protected |

## API Routes

| Base | Key endpoints |
|------|--------------|
| `/api/auth` | POST register, login, forgot-password, reset-password; GET me, verify-email/:token |
| `/api/projects` | CRUD: GET /, GET /:id, POST /, PUT /:id, DELETE /:id |
| `/api/drafts` | CRUD + filter by userId/projectId |
| `/api/tidp` | CRUD + filter by projectId |
| `/api/midp` | CRUD |
| `/api/ai` | POST generate, POST analyze-eir, GET health |
| `/api/documents` | POST upload (max 20MB), POST analyze/:id, GET /:id, DELETE /:id |
| `/api/export` | POST tidp/:id/excel, midp/:id/excel, bep/pdf, bep/docx, eir/export |
| `/api/bep-structure` | Steps + fields CRUD (dynamic form structure) |
| `/api/responsibility-matrix` | RACI matrix CRUD |
| `/api/validation` | POST tidp/:id, POST midp/:id |
| `/api/migrate` | DB migration endpoints |

## Context Providers

| Provider | State | Hook |
|----------|-------|------|
| `AuthContext` | user, loading, login/logout/register | `useAuth()` |
| `ProjectContext` | currentProject, projects, loadProjects/selectProject | `useProject()` |
| `BepFormContext` | RHF form methods, errors, isDirty, isValid | `useBepForm()` |
| `EirContext` | EIR analysis data, field→EIR path mappings | `useEir()` |
| `FormBuilderContext` | Form structure editing state (steps, fields, isEditMode) | `useFormBuilder()` |

## Custom Hooks

| Hook | Purpose |
|------|---------|
| `useAISuggestion` | AI content generation integration |
| `useDrafts` | Draft management (composite hook) |
| `useDraftSave` | Draft auto-save / manual save |
| `useDraftFilters` | Draft list filtering |
| `useDraftOperations` | Draft CRUD operations |
| `useExport` | BEP export (PDF, DOCX) |
| `useTidpData` | TIDP data fetching and state |
| `useMidpData` | MIDP data fetching and state |
| `useResponsibilityMatrix` | RACI matrix data and operations |
| `useStepNavigation` | Multi-step form navigation |
| `useTIDPFilters` | TIDP list filtering |
| `useMindmapD3` | D3-based mindmap rendering |
| `useOutsideClick` | Click-outside detection for modals/dropdowns |
| `useUndoRedo` | Undo/redo state management |

## Frontend Services

| Service | Purpose |
|---------|---------|
| `apiService.js` | Axios instance + API call wrappers |
| `draftApiService.js` | Draft-specific API calls |
| `draftStorageService.js` | Draft local storage fallback |
| `documentService.js` | Document upload/analysis API calls |
| `backendPdfService.js` | Backend PDF generation trigger |
| `bepFormatter.js` | BEP data formatting for export |
| `docxGenerator.js` | DOCX export generation |
| `docxGenerator.simple.js` | Simplified DOCX export |
| `eirExportService.js` | EIR export logic |
| `htmlToDocx.js` | HTML to DOCX conversion |
| `componentScreenshotCapture.js` | Component screenshot capture for exports |

## Schemas (Zod — frontend)

| File | Validates |
|------|----------|
| `bepValidationSchemas.js` | All BEP steps: projectInfo, teamStructure, bimUses, + fullBepSchema. Functions: `getSchemaForStep(i)`, `validateStepData(i, data)` |
| `authSchemas.js` | loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema |

## DB Tables

users, projects, drafts, tidps, containers, midps, documents, steps, fields, field_types, responsibility_matrix (+ related)

## Tech Stack

- **Frontend:** React 19, React Router v7, React Hook Form + Zod, TipTap, Tailwind CSS, @xyflow/react, @dnd-kit, lucide-react, axios, react-hot-toast, d3, dagre, html2canvas, DOMPurify, marked, papaparse, docx, xlsx
- **Backend:** Express, better-sqlite3, bcryptjs, jsonwebtoken, Puppeteer, multer, Joi, nodemailer, exceljs, pdfkit, dotenv, @paralleldrive/cuid2, lodash, date-fns
- **ML:** FastAPI, Ollama, pdfplumber, python-docx, pydantic
- **Dev/Test:** Vitest (frontend), Jest (backend), @testing-library/react, supertest, concurrently, nodemon, Vite 7, PostCSS, Autoprefixer

## Build & Deployment

### Vite Build
- Output: `build/` directory
- Chunk splitting configured for: react-vendor, form-vendor, tiptap-vendor, dnd-vendor, diagram-vendor, office-vendor
- JSX in `.js` files handled via esbuild loader config
- Source maps enabled

### Docker (Production)
- `docker-compose.yml` defines 4 services: backend, ml-service, ollama, nginx
- Backend: `Dockerfile.backend` — Node.js + Puppeteer
- ML service: `ml-service/Dockerfile` — Python + FastAPI
- Ollama: official `ollama/ollama` image
- Nginx: reverse proxy with SSL termination
- SQLite data persisted via Docker volume

## Things to watch out for

- **FormBuilderProvider scope.** `useFormBuilder()` only works inside `<FormBuilderProvider>`. If a layout or wrapper component needs `isEditMode`, `steps`, or any editor state, it must be defined *inside* the provider in the JSX tree — you can't read that context from a parent above it. Pattern: define an inner component inside the provider's children.
- **form-builder barrel exports.** Sub-modules have their own barrels: import from `form-builder/field-editor`, `form-builder/step-editor`, etc. The top-level `form-builder/index.js` re-exports `FormBuilderProvider`, `useFormBuilder`, and `BepStructureMap`.
- **Two Express files.** `server/app.js` creates the Express app (used for testing). `server/server.js` imports it and adds additional middleware, routes, and starts listening. Routes may be registered in both — check both when debugging route issues.
- **Two package.json files.** Root `package.json` has frontend deps + root scripts. `server/package.json` has backend-only deps (Joi, exceljs, nodemailer, puppeteer, etc.). Run `npm install` in both root and `server/` when setting up.
- **Backend validation uses Joi, frontend uses Zod.** Don't mix them up. Joi validators live in `server/validators/`, Zod schemas in `src/schemas/`.
- better-sqlite3 is synchronous — don't accidentally introduce async patterns around DB calls.
- Puppeteer (PDF export) is heavy; avoid pulling it into frontend bundles. It initializes a browser pool on server start.
- Security middleware (Helmet, rate-limit) exists but is commented out in dev — don't remove it.
- Vite handles frontend bundling and dev server; keep `vite.config.js` aligned with existing proxy/env behavior. The `/api` proxy forwards to `localhost:3001`.
- The ML service is a separate Python process — changes there need a separate restart.
- JSON body limit is set to 50MB on the server (for BEP PDF generation with component images).

## Token optimization — MANDATORY

### Step 0: Read the project index FIRST
Before ANY exploration, read `.claude/project-index.md`. It maps every directory, context provider, API route, schema, and hook. This replaces 90% of Glob/Grep discovery.

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
| Tests (frontend) | `npm test` |
| Tests (backend) | `cd server && npm test` |
| Test UI | `npm run test:ui` |
| Test single run | `npm run test:run` |
| Frontend only | `npm run start:frontend` |
| Backend only | `npm run start:backend` |
| ML service only | `npm run start:ml` |
| Build | `npm run build` |
| Preview build | `npm run preview` |
| Verify Ollama | `npm run verify:ollama` |

## Common patterns

- **New API endpoint:** Route in `server/routes/` → Validator in `server/validators/` → Service in `server/services/` → Frontend call in `src/services/apiService.js`
- **New form:** Schema in `src/schemas/` → Component uses `useForm` with `zodResolver`
- **New page:** Add to `src/components/pages/` → Register route in `App.js` → Wrap with `<ProtectedRoute>` if auth required
- **New hook:** Add to `src/hooks/` → Export from the hook file → Import where needed
- **New context:** Add to `src/contexts/` → Wrap in provider tree in `App.js`
- **DB migration:** Add script in `server/scripts/` → Run via `node server/scripts/<script>.js`

## Session Management
When hitting usage limits mid-task, always save progress by:
1. Documenting what's been completed
2. Listing specific next steps
3. Noting any files with partial edits that need attention
