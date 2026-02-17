# Project Index — BEP Generator

> **Purpose:** Compact codebase map so Claude reads this FIRST instead of exploring.
> ~180 lines vs ~50,000+ lines of source code.

## Architecture

```
Frontend (React 19)  →  Backend (Express)  →  SQLite (better-sqlite3)
     :3000                  :3001                server/db/bep-generator.db
                              ↕
                     ML Service (FastAPI + Ollama)
                            :8000 → :11434
```

## Directory → Purpose Map

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
| `src/contexts/` | AuthContext, ProjectContext, BepFormContext, EirContext |
| `src/schemas/` | bepValidationSchemas.js, authSchemas.js (Zod) |
| `src/services/` | apiService, draftApiService, draftStorageService, documentService, backendPdfService, bepFormatter, docxGenerator, docxGenerator.simple, eirExportService, htmlToDocx, componentScreenshotCapture |
| `src/hooks/` | useAISuggestion, useDrafts, useDraftSave, useDraftFilters, useDraftOperations, useExport, useTidpData, useMidpData, useResponsibilityMatrix, useStepNavigation, useTIDPFilters, useMindmapD3, useOutsideClick, useUndoRedo |
| `src/data/` | emptyBepData, templateRegistry, cdePlatformLibrary + helpContent/ (per-section), templates/ (commercialOfficeTemplate) |
| `src/config/` | bepConfig.js (BEP types, step categories, field mappings) |
| `src/constants/` | fieldExamples, iso19650ActivitiesTemplate, routes, tidpTemplates |
| `src/utils/` | cn, complianceCheck, csvHelpers, imageCompression, layoutUtils, markdownToHtml, mindmapUtils, nodeTypes, tidpExport, validationUtils |
| `server/routes/` | auth, tidp, midp, drafts, ai, export, documents, projects, validation, bep-structure, responsibility-matrix, migrate |
| `server/services/` | authService, tidpService, midpService, projectService, bepStructureService, responsibilityMatrixService, exportService, puppeteerPdfService, htmlTemplateService, eirExportService, emailService, emailTemplates, tidpSyncService |
| `server/db/` | database.js (better-sqlite3 setup, all table creation) |
| `server/middleware/` | authMiddleware.js (JWT verify) |
| `server/validators/` | authValidator.js, tidpValidator.js, midpValidator.js (Joi) |
| `server/scripts/` | migrate-add-draft-id.js, migrate-add-email-verified.js, migrate-localStorage-to-db.js, seed-bep-structure.js |
| `ml-service/` | api_ollama.py (FastAPI), eir_analyzer.py, ollama_generator.py, text_extractor.py |

## Context Providers

| Provider | State | Hook |
|----------|-------|------|
| `AuthContext` | user, loading, login/logout/register | `useAuth()` |
| `ProjectContext` | currentProject, projects, loadProjects/selectProject | `useProject()` |
| `BepFormContext` | RHF form methods, errors, isDirty, isValid | `useBepForm()` |
| `EirContext` | EIR analysis data, field→EIR path mappings | `useEir()` |
| `FormBuilderContext` | Form structure editing state (steps, fields, isEditMode) | `useFormBuilder()` |

## API Routes Quick Reference

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

## Schemas (Zod — frontend)

| File | Validates |
|------|----------|
| `bepValidationSchemas.js` | All BEP steps: projectInfo, teamStructure, bimUses, + fullBepSchema. Functions: `getSchemaForStep(i)`, `validateStepData(i, data)` |
| `authSchemas.js` | loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema |

## Validators (Joi — backend)

| File | Validates |
|------|----------|
| `authValidator.js` | Auth request payloads |
| `tidpValidator.js` | TIDP request payloads |
| `midpValidator.js` | MIDP request payloads |

## Tech Stack

- **Frontend:** React 19, React Router v7, RHF + Zod, TipTap, Tailwind CSS, @xyflow/react, @dnd-kit, lucide-react, axios, react-hot-toast, d3, dagre, html2canvas, DOMPurify, marked, papaparse, docx, xlsx
- **Backend:** Express, better-sqlite3, bcryptjs, jsonwebtoken, Puppeteer, multer, Joi, nodemailer, exceljs, pdfkit, dotenv, @paralleldrive/cuid2, lodash, date-fns
- **ML:** FastAPI, Ollama, pdfplumber, python-docx, pydantic
- **Dev/Test:** Vitest (frontend), Jest (backend), @testing-library/react, supertest, concurrently, nodemon, Vite 7

## DB Tables

users, projects, drafts, tidps, containers, midps, documents, steps, fields, field_types, responsibility_matrix (+ related)

## Startup

`npm start` → concurrently runs frontend (:3000) + backend (:3001) + ML service (:8000). Prestart checks ports + starts Ollama.

## Key Files

| File | Purpose |
|------|---------|
| `server/server.js` | Server entry point (middleware, all routes, Puppeteer init, graceful shutdown) |
| `server/app.js` | Express app module (subset of routes, used for testing) |
| `src/App.js` | React root with all route definitions |
| `vite.config.js` | Vite config (proxy /api → :3001, build chunks, JSX loader) |
| `vitest.config.js` | Vitest config (jsdom, threads pool) |
| `docker-compose.yml` | Production: backend + ml-service + ollama + nginx |
