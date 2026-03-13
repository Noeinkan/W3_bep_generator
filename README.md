# BIM Execution Plan (BEP) Suite

> **The end-to-end platform for ISO 19650-compliant BIM Execution Plans — guided, AI-assisted, and entirely on your machine.**

---

## The Problem

Every major construction and infrastructure project requires a BIM Execution Plan. ISO 19650 mandates it. Clients demand it. And yet producing one remains one of the most time-consuming, error-prone tasks in BIM management.

Here's why:

- **Blank-page paralysis.** BEPs have 20+ sections covering CDE workflows, naming conventions, LOINs, quality assurance, handover requirements, and more. Most teams start from a static Word template and stare at empty fields.
- **EIRs arrive as dense PDFs.** Exchange Information Requirements documents can be 40–100 pages. Extracting structured requirements from them manually — then mapping each one to the correct BEP section — takes days.
- **TIDPs and MIDPs live in spreadsheets.** Task Information Delivery Plans are typically managed in Excel, duplicated across teams, never properly consolidated. Generating a Master Information Delivery Plan from them is a manual, error-prone process done at the last minute.
- **No AI assistance on confidential projects.** ChatGPT and similar tools can help draft content — but sending bid documents and project data to an external API is not acceptable for most construction firms. So teams get no AI help at all.
- **ISO 19650 expertise is assumed, not embedded.** Standards compliance requires knowing which clauses apply, what goes where, and what "correct" looks like. That knowledge isn't in the template.

The result: BEPs take days to produce, are inconsistent across projects, and often fail to properly respond to the EIR they're meant to address.

---

## The Solution

BEP Suite is a full-stack platform that solves every one of these problems:

| Problem | How BEP Suite solves it |
|---------|------------------------|
| Blank-page paralysis | Multi-step guided wizard with field-level AI content generation — answer a few questions, get professional prose |
| EIR extraction | Upload any EIR (PDF or DOCX) → AI extracts structured JSON → fields auto-populated with EIR-aligned suggestions |
| TIDP/MIDP spreadsheets | Dedicated TIDP manager auto-consolidates into a MIDP with dependency tracking and responsibility matrices |
| No AI on confidential work | All inference runs locally via Ollama — no data ever leaves your network |
| ISO 19650 expertise gap | Standards compliance is built into the wizard flow, validation rules, and AI prompts — not assumed |

The output: a complete, professional, ISO 19650-compliant BEP in hours instead of days, exported to PDF or DOCX and ready to submit.

---

## Key Benefits

### For BIM Managers
- **Produce BEPs in hours, not days.** The guided wizard and AI content generation eliminate the blank-page problem entirely. Field-specific suggestions are generated on demand, tailored to your project context.
- **Respond directly to the EIR.** Upload the client's EIR document and let the AI extract requirements. The EIR Responsiveness Matrix shows exactly which requirements your BEP addresses and which are outstanding.
- **Consistency across projects.** Templates, naming conventions, and validation rules enforce the same standard every time — regardless of who writes the BEP.

### For Information Managers
- **TIDP → MIDP in one click.** Create TIDPs for each task team, define containers and deliverables, then auto-generate the consolidated MIDP. No copy-paste from spreadsheets.
- **Full responsibility matrices.** ISO 19650 Information Management Activities and Deliverables matrices, RACI assignments, and TIDP synchronisation — all in one place.
- **Track evolution over time.** The MIDP evolution dashboard shows progress, deliverable status trends, and team velocity.

### For the Whole Firm
- **Zero external API costs.** AI runs on your own hardware via Ollama. No per-token billing. No subscription to an AI service.
- **Confidential data stays on-premises.** Bid documents, project data, EIRs — none of it leaves your network. This is the only BEP tool with a fully local AI pipeline.
- **Export-ready documents.** High-fidelity PDF (via Puppeteer), editable DOCX, Excel data packages, and ACC-ready ZIP folders for direct upload.

---

## What's New

### March 2026

#### LOIN Tables Management
A new Level of Information Need (LOIN) tables module has been added with full CRUD operations. BIM managers can now define, edit, and delete LOIN tables directly within the platform — complete with a database schema, API routes, and a dedicated UI component.

#### IDS Generation from LOIN
LOIN tables can now drive machine-readable **buildingSMART IDS** (Information Delivery Specification) exports. Each LOIN row can have an **IFC entity** (e.g. IFCWALL, IFCSLAB) and **property requirements** (property set, name, data type, optional value constraint). The **Export IDS** button produces a `.ids` XML file compatible with Solibri, BlenderBIM, and other IDS checkers, so model deliverables can be validated automatically against the agreed information requirements. IFC entity is suggested from the element name; the IDS properties modal allows per-row editing of requirements.

#### Snippets Management
A reusable snippets library is now available within the BEP workflow. Snippets can be inserted inline into rich text fields as rendered chips (`{{snippet:key}}`), making it easy to maintain consistent boilerplate text across multiple BEP sections. The toolbar calls `editor.chain().focus().insertSnippetChip(key)` rather than inserting raw text.

#### EIR Authoring Wizard & BEP Handshake
The appointing party can now **author** Exchange Information Requirements in-app, not only consume uploaded EIRs. From the EIR Manager (per project), users create and edit EIR drafts via an ISO 19650–aligned form wizard (**EirFormView**). Key additions:
- **Publish flow** — One EIR per project can be set as “Published”; delivery teams see it when creating a BEP. **Publish** in EirManagerPage calls `POST /api/eir/drafts/:id/publish`.
- **BEP ↔ EIR linkage** — BEP drafts store `linkedEirId`. In the BEP form, users select a project EIR (or the published one is pre-selected); the app loads **analysis from authored form data** via `GET /api/eir/drafts/:id/analysis` (no ML). That analysis feeds **EirContext** and the **EIR Responsiveness Matrix**, so the BEP responds to the same requirements whether the EIR was uploaded (AI-extracted) or authored in-app.
- **Ask AI on EIR fields** — Text/textarea fields in the EIR wizard support an “Ask AI” button; `POST /api/ai/suggest-eir-field` (proxied to the ML service) returns ISO 19650–oriented suggestions for the current field.
- **Export** — Authored EIR documents can be exported to PDF via the existing EIR document export pipeline (`eirDocumentExportService`), which renders the same form data used for analysis.

#### Enhanced EIR Management
EIR document management supports full CRUD — create, update, delete, and publish EIR drafts — with the above authoring and BEP handshake flows.

#### TipTap Editor Extensions
The rich text editor has been extended with four new capabilities:
- **Floating menu** — A `+` button appears on empty lines for quick block insertion
- **Bubble menu** — A mini formatting toolbar appears on text selection
- **Slash command palette** — Type `/` to open an insert menu for headings, lists, tables, and snippets
- **Word/character count** — A status bar below the editor shows live word and character counts

#### IntegrationSection Improvements
The Integrations section of the BEP form has been updated with additional tool entries and a revised layout for improved readability.

#### IFC Import — Auto-populate Deliverables
Upload an IFC model file (`.ifc`, max 50MB) from the **IFC Import** page (`/ifc-import`) to auto-suggest deliverable containers for the Responsibility Matrix. The server parses the IFC STEP text format (no extra npm packages): header metadata (project name, author, organisation, schema, file date) and discipline detection from entity scan (structural, architectural, MEP, civil). You get a preview of suggested deliverables (combined model + per-discipline), can edit names and stages, then import selected rows; each is created via the existing Responsibility Matrix deliverables API and you are redirected to the matrix with a success toast. BCF integration remains planned for a later release.

---

### February 2026

#### EIR Responsiveness Matrix
A new modal in the BEP workflow maps every requirement extracted from the uploaded EIR to the corresponding BEP section. At a glance you can see which EIR requirements are addressed, which are outstanding, and where gaps exist. This closes the loop between the client's information requirements and the BEP response.

#### Streaming AI Suggestions
AI content suggestions now stream token-by-token into the editor as they are generated, rather than appearing all at once after a delay. This makes the AI feel significantly more responsive, especially for longer sections like executive summaries and collaboration procedures.

#### Model Selection for AI Suggestions
The AI suggestion interface now exposes model selection — switch between any locally installed Ollama model without restarting the service. The backend dynamically retrieves available models and allows per-request model overrides.

#### Sample Project Seeding
New users now get a pre-populated sample project on first login, with example TIDPs, a draft BEP, and responsibility matrix entries. This gives teams an immediate reference to orient themselves rather than starting completely empty.

#### One-Command Hetzner Deployment
`bash deploy.sh` now handles the full production deployment pipeline: Docker image build, push to Hetzner, and service restart. No manual steps required after a code change.

#### SearchableSelect Component
A new `SearchableSelect` component replaces plain dropdowns in high-volume fields (software platforms, file formats, BIM uses). Supports fuzzy search, keyboard navigation, and multi-select.

#### Document History & EIR Fill Hooks
Two new hooks — `useDocumentHistory` and `useEirFill` — are now the canonical home for EIR document lifecycle logic. This removes domain logic from `BepFormView` and makes the fill pipeline independently testable.

#### BEP Config Modularisation
`bepConfig.js` is now a barrel re-exporting from four focused sub-modules: `bepSteps.js` (step list), `bepTypeDefinitions.js` (pre/post metadata), `bepOptions.js` (option arrays), `bepFormFields.js` (field definitions). All consumers import `CONFIG` from `bepConfig.js` unchanged.

#### CRA → Vite Migration
The frontend has been migrated from Create React App to Vite. Cold start time drops from ~30s to ~1s. Hot module replacement is near-instant. Production builds are smaller and faster. This is a fully transparent change — no user-facing behaviour changes.

#### Improved Validation & Draft Management
BEP form validation now uses per-step Zod schemas with real-time feedback. Draft management now scopes drafts to the active project, preventing cross-project draft contamination.

#### Docker Build Fixes
Several Docker build issues affecting the Hetzner deployment have been resolved: `bcryptjs`/`jsonwebtoken` are now correctly declared in `server/package.json`, and `index.html`/`vite.config.js` are correctly copied in the frontend build stage.

---

## Overview

BEP Suite consists of two integrated products:

1. **BEP Generator** — Creates ISO 19650-compliant BIM Execution Plans with intelligent form wizards, AI-powered content suggestions, and professional export capabilities.

2. **TIDP/MIDP Manager** — Manages Task Information Delivery Plans (TIDPs) and automatically generates Master Information Delivery Plans (MIDPs) with full project coordination, dependency tracking, and team collaboration features.

### Why BEP Suite?

Most BEP tools are static templates or basic form fillers. BEP Suite is different:

- **EIR-to-BEP AI pipeline** — Upload an Exchange Information Requirements document (PDF/DOCX) and the AI extracts structured JSON, then generates field-specific content suggestions tailored to those requirements. No competitor offers this workflow.
- **Guided Q&A authoring** — Instead of staring at a blank field, answer a few contextual questions and let the AI compose professional, ISO 19650-aligned prose from your responses.
- **Your data stays on your machine** — All AI inference runs locally via [Ollama](https://ollama.ai). No confidential bid documents are sent to OpenAI, Google, or any external API. Perfect for firms handling sensitive construction and infrastructure projects.

---

## Key Features

### BEP Generator
- **Interactive Multi-Step Wizard** — Guided BEP creation process with progress tracking
- **Two BEP Types** — Support for both pre-appointment and post-appointment BEPs
- **AI-Powered Content Generation** — Local LLM-based text suggestions for all BEP sections (see [AI Features](#ai-features))
- **Streaming AI Suggestions** — Token-by-token streaming into the editor for a responsive authoring experience
- **Guided AI Authoring** — Answer contextual questions and let AI compose professional content from your responses
- **EIR Document Analysis** — Upload Exchange Information Requirements documents and auto-extract structured data
- **EIR Authoring** — Create and edit EIRs in-app (ISO 19650–aligned form), publish one per project, link a BEP to an authored EIR; analysis is derived from form data and drives the responsiveness matrix
- **EIR Responsiveness Matrix** — Visual mapping of EIR requirements to BEP sections with gap tracking (works for both uploaded and authored EIRs)
- **Model Selection** — Switch between any locally installed Ollama model per session
- **Rich Text Editing** — Professional TipTap editor with formatting, tables, images, and more
- **Professional Templates** — Pre-built ISO 19650-compliant templates
- **Draft Management** — Save, load, and manage multiple drafts scoped per project
- **Export Capabilities** — High-quality PDF and DOCX exports
- **Visual Builders** — Interactive diagrams for CDE workflows, folder structures, org charts
- **Context-Sensitive Help** — Field-level tooltips and guidance
- **Command Palette** — Quick navigation (Cmd+K style interface)
- **Onboarding System** — Interactive tutorials and sample projects for new users

### TIDP/MIDP Manager
- **Task Information Delivery Plan (TIDP) Creation** — Comprehensive TIDP editor with container management
- **Master Information Delivery Plan (MIDP) Auto-Generation** — Automatically consolidates TIDPs into MIDPs
- **Multi-Team Collaboration** — Coordinate information delivery across multiple teams
- **Excel/CSV Import** — Bulk import TIDPs from spreadsheets
- **Dependency Tracking** — Visualize and manage deliverable dependencies
- **Resource Allocation** — Track team resources and workload
- **Evolution Dashboard** — Monitor TIDP/MIDP progress over time
- **Responsibility Matrix** — ISO 19650 Information Management Activities and Deliverables matrices
- **Quality Gates** — Validation checks and acceptance criteria
- **Risk Register** — Identify and manage information delivery risks
- **Consolidated Exports** — Export entire project data to Excel or PDF
- **TIDP Synchronisation** — Auto-populate information from TIDPs to responsibility matrices

### Advanced Features
- **Interactive Visualisations** — Node-based diagrams using @xyflow/react
- **RACI Matrix Builder** — Define roles and responsibilities
- **Naming Convention Builder** — Create consistent file naming patterns
- **Timeline & Gantt Charts** — Project schedule visualisation
- **Deliverable Attributes Visualiser** — Comprehensive deliverable properties
- **Mind Map Builder** — Visual information structure planning
- **Project Analytics** — Statistics and progress tracking
- **Real-Time Validation** — ISO 19650 compliance checking
- **Batch Operations** — Bulk create, update, and delete TIDPs
- **Dependency Matrix** — Cross-team dependency visualisation

---

## Technology Stack

### Frontend
- **React 19.1.1** - Modern UI framework
- **Vite 7.x** - Frontend dev server and production bundler
- **React Router DOM 7.9.3** - Client-side routing
- **TipTap 3.6.2** - Rich text editor with extensive extensions
- **@xyflow/react 12.8.6** - Interactive node-based diagrams
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Lucide React 0.544.0** - Icon library
- **Axios 1.12.2** - HTTP client
- **D3.js 7.9.0** - Data visualisation
- **React Hook Form + Zod** - Form management and validation

### Backend
- **Node.js + Express** - RESTful API server (Port 3001)
- **SQLite** (better-sqlite3 12.4.1) - Lightweight database
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - API rate limiting
- **bcryptjs + jsonwebtoken** - Authentication

### ML/AI Service
- **Ollama** — Local LLM runtime (llama3.1:8b default, any Ollama model supported)
- **Python 3.8+** — ML runtime environment
- **FastAPI 0.104.1+** — High-performance API server (Port 8000)
- **Uvicorn** — ASGI server
- **pdfplumber / python-docx** — Document text extraction (EIR upload support)
- **NumPy** — Numerical computing

### Export Libraries
- **Puppeteer** - Headless browser PDF generation (server-side)
- **docx 9.5.1** - Word document generation (client-side)
- **xlsx 0.18.5** - Excel file handling
- **PapaParse 5.5.3** - CSV parsing

---

## Architecture

The application follows a modern three-tier architecture:

1. **Frontend Layer** - React SPA with 99+ modular components
2. **Backend API Layer** - Express REST API with SQLite persistence
3. **ML Service Layer** - Python FastAPI service for AI text generation

### AI Architecture

```
┌─────────────────────┐     ┌────────────────────────┐     ┌──────────────┐
│  React Frontend     │────▶│  Express Backend        │────▶│  ML Service   │
│  (Port 3000)        │     │  /api/ai/* proxy routes │     │  FastAPI:8000 │
│                     │     │  (Port 3001)            │     │               │
│  useAISuggestion()  │     │  ai.js route handler    │     │  api_ollama.py│
└─────────────────────┘     └────────────────────────┘     └───────┬───────┘
                                                                   │
                                                           ┌───────▼───────┐
                                                           │  Ollama       │
                                                           │  llama3.1:8b  │
                                                           │  (Port 11434) │
                                                           └───────────────┘
```

- **Frontend** calls the Express backend via the `useAISuggestion` hook and service layer
- **Backend** proxies AI requests to the Python ML service (`/api/ai/*` → FastAPI)
- **ML Service** orchestrates prompt construction, chunking, and calls to the Ollama API
- **Ollama** runs the LLM locally and returns completions (supports streaming)

### Database Schema

**Main Tables:**
- `users` - User accounts and authentication
- `projects` - Project workspaces
- `drafts` - BEP drafts scoped to project
- `tidps` - Task Information Delivery Plans
- `containers` - TIDP deliverable containers
- `midps` - Master Information Delivery Plans
- `documents` - Uploaded EIR and reference documents
- `information_management_activities` - ISO 19650 IM activities
- `information_deliverables` - Information deliverables with TIDP linkage
- `loin_tables` - Level of Information Need (LOIN) table definitions per project
- `snippets` - Reusable text snippets inserted as chips in rich text fields

---

## AI Features

The BEP Suite integrates a full AI layer powered by **Ollama** running locally. All inference runs on your machine — no data leaves your network. The AI service exposes six distinct capabilities, each tuned for its task:

### 1. BEP Content Generation (`/suggest`)
Generates professional, ISO 19650-aligned content for specific BEP fields (e.g., project description, BIM objectives, naming conventions).
- Uses field-specific prompts covering 24+ field types
- **Tokens:** ~200 | **Temperature:** 0.5
- Example fields: executive summary, collaboration procedures, CDE workflow, quality assurance, COBie requirements, and more

### 2. EIR Document Analysis (`/analyze-eir`)
Parses uploaded Exchange Information Requirements (EIR) documents and extracts structured JSON data following ISO 19650. This is the most demanding AI task in the suite.
- Accepts PDF, DOCX, and plain-text uploads via `/extract-text`
- Supports automatic chunking for large documents (configurable via `EIR_SINGLE_PASS_CHAR_LIMIT` / `EIR_CHUNK_TOKENS`)
- Parallel chunk processing with auto-concurrency tuning (`OLLAMA_MAX_CONCURRENCY`, `EIR_AUTO_CONCURRENCY_LATENCY`)
- **Tokens:** ~2 000 | **Context window:** 8 192 | **Temperature:** 0.3
- Outputs valid structured JSON covering project info, standards, deliverables, and requirements

### 3. EIR Summary Generation
Creates human-readable markdown summaries from EIR analysis JSON, making extracted data easy to review before applying to a BEP.
- **Tokens:** ~800 | **Temperature:** 0.5

### 4. Question Generation (`/generate-questions`)
Generates 3–5 contextual questions in JSON format to help users reason through and write BEP content for a given field.
- **Tokens:** ~400 | **Temperature:** 0.6
- Output: JSON array of questions tailored to the field type and any existing project context

### 5. Answer-based Content Generation (`/generate-from-answers`)
Takes the user's answers to the generated questions and composes professional BEP content that incorporates those answers.
- **Tokens:** ~400 | **Temperature:** 0.5
- Produces ready-to-use prose that can be inserted directly into the BEP document

### 6. EIR-based Field Suggestions (`/suggest-from-eir`)
Generates field-specific content suggestions pre-populated from EIR analysis data, bridging the gap between EIR requirements and BEP responses.
- Combines EIR analysis context with field-type-specific prompts for targeted suggestions
- **Temperature:** 0.5

### Supported BEP Field Types
Executive summary · Project objectives · BIM objectives · Stakeholders · Roles & responsibilities · Delivery team · Collaboration procedures · Information exchange protocols · CDE workflow · Model requirements · Data standards · Naming conventions · Quality assurance · Validation checks · Technology standards · Software platforms · Coordination process · Health & safety · Handover requirements · COBie requirements · and more

### Ollama Setup
1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Pull the default model:
```bash
ollama pull llama3.1:8b
```
3. Verify installation:
```bash
npm run verify:ollama
```

### EIR Analysis Tuning (Optional)
These environment variables let you speed up EIR analysis without reducing accuracy:

| Variable | Default | Description |
|----------|---------|-------------|
| `EIR_SINGLE_PASS_CHAR_LIMIT` | `30000` | Max characters analysed in one pass before chunking |
| `EIR_CHUNK_TOKENS` | `7000` | Chunk size used when the document is split |
| `OLLAMA_MAX_CONCURRENCY` | `auto` | Max parallel workers (`auto` adapts to the machine) |
| `EIR_AUTO_CONCURRENCY_LATENCY` | `60` | Seconds threshold to reduce workers when Ollama is slow |
| `OLLAMA_MODEL` | `llama3.1:8b` | Ollama model to use (any Ollama-compatible model) |
| `OLLAMA_QUESTIONS_MODEL` | _(same as OLLAMA_MODEL)_ | Optional: smaller/faster model for Guided AI question generation only (e.g. `qwen3:4b`, `llama3.2:3b`). Omit to use `OLLAMA_MODEL` for everything. |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama server address |

---

## API Endpoints

### TIDP Routes (`/api/tidp`)
- `GET /tidp` - Get all TIDPs
- `GET /tidp/:id` - Get specific TIDP
- `POST /tidp` - Create TIDP
- `PUT /tidp/:id` - Update TIDP
- `DELETE /tidp/:id` - Delete TIDP
- `POST /tidp/batch` - Batch create TIDPs
- `POST /tidp/import/excel` - Import from Excel
- `POST /tidp/import/csv` - Import from CSV
- `GET /tidp/project/:projectId/dependency-matrix` - Dependency visualisation

### MIDP Routes (`/api/midp`)
- `GET /midp` - Get all MIDPs
- `POST /midp/from-tidps` - Create MIDP from TIDPs
- `POST /midp/auto-generate/:projectId` - Auto-generate MIDP
- `PUT /midp/:id/update-from-tidps` - Update from TIDPs
- `GET /midp/:id/evolution` - Evolution dashboard data
- `GET /midp/:id/deliverables-dashboard` - Deliverables overview
- `GET /midp/:id/risk-register` - Risk register
- `GET /midp/:id/dependency-matrix` - Dependency matrix
- `POST /midp/:id/refresh` - Refresh MIDP from TIDPs

### Responsibility Matrix Routes (`/api/responsibility-matrix`)
- `GET/POST/PUT/DELETE /im-activities` - Information management activities
- `GET/POST/PUT/DELETE /deliverables` - Information deliverables
- `POST /sync-tidps` - Synchronise with TIDPs
- `GET /sync-status` - Get synchronisation status

### Export Routes (`/api/export`)
- `POST /tidp/:id/excel` - Export TIDP to Excel
- `POST /tidp/:id/pdf` - Export TIDP to PDF
- `POST /midp/:id/excel` - Export MIDP to Excel
- `POST /midp/:id/pdf` - Export MIDP to PDF
- `POST /eir/pdf` - Export EIR analysis (JSON + summary) to PDF
- `POST /eir-document/pdf` - Export authored EIR document (form data) to PDF
- `POST /responsibility-matrix/excel` - Export matrices to Excel
- `POST /project/:projectId/consolidated-excel` - Consolidated project export
- `POST /acc/package` - Generate ACC ISO 19650 folder-structured ZIP package for manual upload

### Validation Routes (`/api/validation`)
- `POST /tidp/:id` - Validate TIDP
- `POST /midp/:id` - Validate MIDP
- `POST /project/:projectId/comprehensive` - Comprehensive validation
- `GET /standards/iso19650` - Get ISO 19650 standards

### EIR Routes (`/api/eir`)
- `GET /drafts` — List EIR drafts (optional `projectId` query)
- `POST /drafts` — Create EIR draft
- `GET /drafts/:id` — Get single draft
- `PUT /drafts/:id` — Update draft (title, projectId, data, status)
- `GET /drafts/:id/analysis` — Get canonical EirAnalysis JSON from authored form data (no ML)
- `POST /drafts/:id/publish` — Set this draft as the project’s published EIR
- `DELETE /drafts/:id` — Delete draft

### AI Routes (`/api/ai`) — Express Proxy
- `GET /health` — ML service health check
- `POST /generate` — Generate text from a prompt
- `POST /suggest` — Field-specific BEP content suggestions
- `GET /field-types` — List available BEP field types
- `POST /suggest-from-eir` — Generate suggestions using EIR analysis data
- `POST /suggest-eir-field` — EIR authoring: suggest content for a single EIR form field (field name, label, current text, draft data)
- `POST /generate-questions` — Generate guided authoring questions
- `POST /generate-from-answers` — Generate content from user answers

### ML Service Routes (Port 8000) — FastAPI
- `GET /health` — Health check with Ollama connection status
- `GET /models` — List available Ollama models
- `POST /generate` — Generate text from prompt
- `POST /suggest` — Field-specific BEP suggestions
- `POST /extract-text` — Extract text from uploaded documents (PDF, DOCX)
- `POST /analyze-eir` — Analyse EIR document and extract structured JSON
- `POST /generate-questions` — Generate guided authoring questions
- `POST /generate-from-answers` — Generate content from user answers
- `POST /suggest-from-eir` — EIR-informed field suggestions
- `POST /suggest-eir-field` — EIR authoring: suggest content for one EIR form field (ISO 19650–oriented)

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** or yarn
- **(Optional) Ollama** for AI text generation features — [Download](https://ollama.ai)
- **(Optional) Python 3.8+** for running the ML service

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bep-generator
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **(Optional) Set up AI text generation with Ollama**

   Install Ollama from [ollama.ai](https://ollama.ai), then pull the default model:
   ```bash
   ollama pull llama3.1:8b
   ```

   Create a Python virtual environment for the ML service:
   ```bash
   cd ml-service
   python -m venv venv
   source venv/bin/activate       # Linux/Mac
   # venv\Scripts\activate        # Windows
   pip install -r requirements.txt
   ```

### Running the Application

#### Option 1: Full Stack with AI (Recommended)

```bash
npm start
```

This starts everything concurrently:
- React frontend at [http://localhost:3000](http://localhost:3000)
- Express backend at [http://localhost:3001](http://localhost:3001)
- Python ML service at [http://localhost:8000](http://localhost:8000)
- Ollama server (if not already running)

#### Option 2: Frontend & Backend Only (Without AI)

The application works without AI features — content generation will simply be unavailable. Run the same command and let the ML service startup fail silently.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start frontend + backend + ML service |
| `npm test` | Run all tests with Vitest |
| `npm run test:ui` | Open Vitest UI |
| `npm run build` | Production build to `build/` |
| `npm run preview` | Serve production build on port 4173 |
| `npm run start:ml` | Start ML service only |
| `npm run verify:ollama` | Verify Ollama install and model availability |
| `npm run start:ollama` | Start Ollama server manually |

---

## Project Structure

```
bep-generator/
├── src/                          # React frontend source
│   ├── components/               # React components (99+ files)
│   │   ├── auth/                # Authentication components
│   │   ├── eir/                 # EIR upload, analysis, responsiveness matrix
│   │   ├── forms/               # Form controls, AI assistant, rich text editor
│   │   ├── pages/               # Main application pages
│   │   │   ├── bep/            # BEP generator views and components
│   │   │   ├── tidp-midp/      # TIDP/MIDP dashboard and management
│   │   │   └── idrm-manager/   # Information Deliverables & Responsibility Matrix
│   │   ├── layout/              # MainLayout (sidebar, header)
│   │   └── common/              # Shared UI primitives
│   ├── config/                  # BEP config barrel + sub-modules
│   │   ├── bepConfig.js        # Barrel re-export (all consumers use this)
│   │   ├── bepSteps.js         # 14-step list + categories
│   │   ├── bepTypeDefinitions.js # Pre/post-appointment metadata
│   │   ├── bepOptions.js       # BIM uses, file formats, software arrays
│   │   └── bepFormFields.js    # All field definitions + getFormFields
│   ├── contexts/                # AuthContext, ProjectContext, BepFormContext, EirContext
│   ├── hooks/                   # useAISuggestion, useDraftSave, useDocumentHistory, useEirFill, ...
│   ├── schemas/                 # Zod validation schemas
│   ├── services/                # API calls, DOCX/PDF export services
│   └── constants/               # Routes, ISO 19650 templates, field examples
├── server/                      # Node.js backend
│   ├── server.js               # Express server entry point
│   ├── app.js                  # Express app configuration
│   ├── database.js             # DB setup, table creation, sample project seeding
│   ├── routes/                 # API route handlers
│   ├── services/               # Business logic and export services
│   │   └── templates/          # bepStyles.css (PDF/HTML export templates)
│   ├── middleware/             # authMiddleware.js (JWT verify)
│   └── db/                     # SQLite database directory
├── ml-service/                  # Python ML service
│   ├── api_ollama.py           # FastAPI server with Ollama integration
│   ├── eir_analyzer.py         # EIR document analysis pipeline
│   ├── ollama_generator.py     # Text generation with streaming support
│   ├── text_extractor.py       # PDF/DOCX text extraction
│   └── requirements.txt        # Python dependencies
├── deploy.sh                    # One-command Hetzner Docker deployment
├── docker-compose.yml           # Production Docker services
├── package.json                # Node dependencies and scripts
├── tailwind.config.js          # TailwindCSS configuration
└── README.md                   # This file
```

---

## Export Formats

### PDF Export
- Server-side rendering via Puppeteer (high fidelity, no browser quirks)
- Professional layout with headers/footers
- Table of contents with page numbers
- Embedded images and diagrams
- ISO 19650 compliant formatting

### DOCX Export
- Client-side generation via the `docx` library
- Microsoft Word format, fully editable
- Preserved formatting and styles
- Compatible with Word 2016+

### Excel Export
- Comprehensive project data with multiple worksheets
- Formulas and conditional formatting
- Import/export templates

### ACC Folder Package Export
- Generates a manual-upload ZIP with ISO 19650-style ACC folders (`Appointment`, `Work In Progress`, `Shared`, `Published`, `Archive`)
- Includes BEP PDF and optional MIDP/TIDP/matrix files plus a package `manifest.json`

---

## ISO 19650 Compliance

This application implements the following ISO 19650-2:2018 requirements:

- **Clause 5.1** - Information management process
- **Clause 5.3** - Information requirements
- **Clause 5.4** - Information delivery planning
- **Clause 5.6** - Information production methods and procedures
- **Clause 5.7** - Common Data Environment (CDE)
- **Annex A** - Responsibility matrices for information management
- **TIDP/MIDP Framework** - Complete implementation of task and master planning

---

## Security Features

- Helmet.js security headers
- CORS protection
- Rate limiting on API endpoints
- Input sanitisation with DOMPurify
- SQL injection prevention
- XSS protection
- JWT-based authentication (bcryptjs password hashing)

---

## Deployment

### Docker Production Deployment (Hetzner)

```bash
bash deploy.sh
```

This single command handles the full pipeline: Docker image build, push, and service restart on Hetzner.

**Services:**
- `backend` — Node.js Express server with built React frontend
- `ml-service` — Python FastAPI service for AI text generation
- `ollama` — Local LLM runtime
- `nginx` — Reverse proxy with SSL termination

**Useful commands:**
```bash
# Quick rebuild after code changes
cd /opt/bep-generator && git pull && docker compose up -d --build

# Rebuild single service
docker compose up -d --build backend
docker compose up -d --build ml-service

# Full restart (no rebuild)
docker compose down && docker compose up -d

# Nuclear rebuild
docker compose down && docker compose build --no-cache && docker compose up -d

# Check status
docker compose ps
docker compose logs backend --tail 20
docker compose logs ml-service --tail 20

# Health checks
curl https://your-domain/api/ai/health
docker compose exec backend wget -qO- http://ml-service:8000/health
```

**Environment variables (`.env.production`, gitignored):**
- `NODE_ENV=production`
- `APP_BASE_URL=https://your-domain`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` — email delivery

### Email Diagnostics (Dev)

```bash
curl http://localhost:3001/api/auth/email-health
```

Returns whether SMTP is configured and whether the server can verify the SMTP connection.

---

## System Requirements

### Minimum
- **CPU:** Dual-core processor
- **RAM:** 4 GB
- **Storage:** 500 MB free space

### Recommended (with AI features)
- **CPU:** Quad-core processor or better
- **RAM:** 8 GB (16 GB for optimal AI performance)
- **Storage:** 5 GB free space (for Ollama and models)
- **Ollama:** Latest version with llama3.1:8b (~5 GB download)

---

## Troubleshooting

### Port Already in Use
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Locked
- Close all connections to the database
- Restart the backend server
- Check file permissions on `server/db/bep-generator.db`

### ML Service Not Starting
- Verify Ollama is installed: `ollama list`
- Pull the model: `ollama pull llama3.1:8b`
- Verify Python: `python --version`
- Install dependencies: `pip install -r ml-service/requirements.txt`
- Check port 8000 is available
- Run: `npm run verify:ollama`

### Build Fails
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## Roadmap & Planned Features

### In Progress / Partially Done

| Feature | Status | Notes |
|---------|--------|-------|
| **User Authentication** | Implemented (mock bypass in dev) | Login, registration, JWT + bcryptjs wired end-to-end. Dev mode uses a mock user bypass; production requires real credentials. |
| **Protected Routes** | Component exists, not applied | `ProtectedRoute` built but not wired in `App.js` |
| **Profile Management** | UI only | Password change shows "Coming soon" |
| **Settings Persistence** | UI only | Appearance, notifications, language controls — currently logs to console only |
| **Compliance Report Export** | Disabled | Original jsPDF implementation preserved in comments; awaiting Puppeteer migration |
| **Security Middleware Activation** | Imported, not applied | `helmet` and `express-rate-limit` installed but need enabling in `app.js` |
| **Additional BEP Templates** | Commented out | Residential Complex and Healthcare Facility templates stubbed in `templateRegistry.js` |

---

### BEP Tier-1 Quality — 12-Step Roadmap

The current app generates a ~42-page BEP. A real Tier-1 BEP (e.g. National Grid) runs 85+ pages. The following steps close the gap. See `zz_docs/BEP Tier-1 Quality Roadmap.md` for full file-level detail.

| # | Feature | Effort | Priority |
|---|---------|--------|----------|
| 1 | **Document Control Table & Approval Block** — Revision history table, document reference number, status badge (WIP/SHR/PBL/ARC), formal signatory block | 5 h | Very High |
| 2 | **Running Page Headers & Footers** — Every page shows doc ref + revision in header; "Page N of M" in footer via Puppeteer `headerTemplate`/`footerTemplate` | 4 h | Very High |
| 3 | **Purpose, Scope, Applicable Documents & Definitions** — Two new BEP steps: Purpose & Scope (with applicable documents table) and Definitions & Abbreviations (pre-filled with 12 ISO 19650 terms) | 7 h | High |
| 4 | **PDF Visual Polish** — Professional typography, section rule underlines, alternating table row shading, logo placeholder, classification label on cover | 4 h | High |
| 5 | **Formal Appendices System (A–E)** — Five lettered appendices: Software Register, RACI Matrix, Referenced Docs, COBie Requirements, EIR Compliance Matrix | 6 h | High |
| 6 | **Exceptions & Derogations Section** — Formal table for EIR clause exceptions with Clause Ref / Proposed Alternative / Justification columns; "No exceptions" toggle | 3 h | High |
| 7 | **Model Progression Specification (LOD/LOI Matrix)** — Phase-by-phase LOD/LOI breakdown per discipline; colour-coded matrix grid; Information Delivery Schedule table | 6 h | High |
| 8 | **AI Prompt Upgrade: Contractual Tone** — System prompt enforcing "shall" language, ISO 19650 clause references, 3rd-person formal register across all suggestion endpoints | 4 h | Medium-High |
| 9 | **Clash Management Enhancement** — Clash severity matrix (Critical/Major/Minor/Cosmetic), clash detection schedule per discipline pair, coordination meeting protocol | 5 h | Medium |
| 10 | **EIR Analyzer: Governance & Exceptions Extraction** — Extract document control metadata, derogations, security classification, and project phases from EIR PDFs | 5 h | Medium |
| 11 | **DOCX Export Structural Parity** — Headers/footers, document control table, all five appendices, LOD matrix table in Word export | 7 h | Medium |
| 12 | **Supply Chain Capability Assessment** — Per-task-team capability table (BIM Role, Software Competency, ISO 19650 Training, Capacity FTE); auto-populated from EIR analysis | 4 h | Medium |

**Total estimated effort:** ~60 hours

---

### ACC / Autodesk Construction Cloud Integration

Phase 1 (manual export ZIP) is complete. Phase 2 adds direct upload via the APS API:

| Item | Status |
|------|--------|
| ACC-ready ZIP export with ISO 19650 folder structure | **Done** |
| `acc_hub_id` / `acc_project_id` linkage on projects | **Done** |
| Encrypted local secret storage (`encryptedSecretService`) | **Done** |
| Autodesk OAuth connection flow (local app) | Planned |
| Token lifecycle management (encrypted local storage) | Planned |
| ACC hub / project / folder discovery endpoints | Planned |
| Direct upload of BEP / TIDP / MIDP artifacts via APS Data Management API | Planned |
| Project picker and upload target UX | Planned |

---

### Multi-User Collaboration

Full RBAC and approval workflow system planned. See `zz_docs/MultiUserSystem.md` for schema and service design.

| Item | Status |
|------|--------|
| `project_members` table (owner / editor / viewer roles) | Planned |
| Email invitations with accept/decline flow | Planned |
| Draft approval workflow (draft → pending review → approved / rejected) | Planned |
| Ownership transfer | Planned |
| Project activity log / audit trail | Planned |
| Fix: routes currently accept `userId` from query params instead of `req.user` | Planned |

---

### Other Planned Value Adds

| Opportunity | Description |
|-------------|-------------|
| **Dark Mode / Theming** | Settings UI has a theme selector. Tailwind's `darkMode` support makes this straightforward |
| **Internationalisation (i18n)** | Language picker (EN, IT, ES, FR, DE) exists in settings. Needs `react-i18next` and string extraction |
| **Template Marketplace** | Publish, share, and import community BEP templates beyond built-in ones |
| **Version History & Diffing** | Track document revisions; `useUndoRedo` hook already exists and could be extended |
| **IFC Import** | Done — upload .ifc → parse STEP → suggest deliverables → import to Responsibility Matrix (see `/ifc-import`) |
| **BCF Integration** | Planned — import BCF issues / viewpoints to enrich deliverable or clash context |
| **Bulk EIR Processing** | Batch-upload multiple EIR documents and generate comparative analyses |
| **Offline-First PWA** | Service worker caching for fully offline use, syncing when connectivity returns |
| **Model Fine-Tuning Pipeline** | Custom LoRA fine-tuning on organisation-specific BEP data to improve suggestion quality |

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with clear commit messages
4. Run `npm test` and ensure all tests pass
5. Submit a pull request

---

## License

This project is proprietary software. All rights reserved.

---

## Acknowledgments

- **ISO 19650** - International standards for information management using BIM
- **Vite** - Fast frontend tooling and bundling
- **TipTap** - Excellent rich text editor framework
- **Ollama** - Local LLM runtime for private AI capabilities
- **FastAPI** - Modern Python web framework for ML API

---

## Learn More

### BIM Standards
- [ISO 19650-1:2018](https://www.iso.org/standard/68078.html) - Concepts and principles
- [ISO 19650-2:2018](https://www.iso.org/standard/68080.html) - Delivery phase of assets
- [UK BIM Framework](https://www.ukbimframework.org/) - Practical guidance

### Technology
- [Vite documentation](https://vite.dev/guide/)
- [React documentation](https://reactjs.org/)
- [Ollama Documentation](https://ollama.ai/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

---

**Version:** 2.2.0
**Last Updated:** March 2026
**Developed with:** React 19, Node.js, Python, and Ollama
