# Project Index — Arcquio

> **Purpose:** Compact codebase map so Claude reads this FIRST instead of exploring.
> ~175 lines vs ~50,000+ lines of source code.

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
| `src/components/common/` | Button, Select, Modal, FormField, ConfirmDialog, RootErrorBoundary |
| `src/components/eir/` | EIR upload, analysis view, suggest button, EirStepWrapper (pre-step flow), EirFillSummaryModal |
| `src/components/export/` | BEP preview renderer, hidden component renderer |
| `src/components/form-builder/` | Dynamic form structure editor (steps, fields, drag-drop) |
| `src/components/forms/ai/` | AI assistant tabs, suggestion buttons, smart help, GuidedAIWizardTab (inline step-by-step AI wizard) |
| `src/components/forms/base/` | Base inputs: text, textarea, checkbox, editable table |
| `src/components/forms/controls/` | Progress bar/sidebar, command palette, search filter |
| `src/components/forms/custom/` | CDE platform, naming convention, federation, RACI, clash matrix |
| `src/components/forms/diagrams/` | Org chart, folder structure, volume mindmap, CDE diagram, DocumentHierarchyDiagram, FederationFlowchartDiagram, LoinProgressionDiagram, PartyInterfaceDiagram |
| `src/components/forms/editors/` | TipTap rich text editor + toolbar + extensions |
| `src/components/forms/specialized/` | Budget input, milestones table, org structure field, EirReferenceField, LoinReferenceField, TidpReferenceField, TidpSectionField, DeliverablesMatrixField, ImActivitiesMatrixField |
| `src/components/forms/tables/` | TableBubbleMenu (TipTap table bubble menu) |
| `src/components/forms/dialogs/` | TableInsertDialog |
| `src/components/layout/` | MainLayout (sidebar, header, Outlet) |
| `src/components/midp/` | MIDP form, list, evolution dashboard |
| `src/components/pages/` | HomePage (+ sections: Integration, ISOCompliance, ProductCard, SocialProof), ProjectsPage, BEPGeneratorWrapper, PreviewExportPage, ProfilePage, SettingsPage, TidpEditorPage, RoleChoicePage |
| `src/components/pages/auth/` | Login, Register, ForgotPassword, ResetPassword, VerifyEmail, VerificationPending pages |
| `src/components/pages/bep/` | BepLayout, BepStartMenuView, BepSelectTypeView, BepFormView, BepPreviewView, BepDraftsView, BepImportView, BepInfoRequirementsView, BepStructureMapView, BepTemplatesView, BepTypeSelector, ImportBepDialog, TemplateGallery; `components/` subfolder: BepHeader, BepSidebar, BepFooter, SuccessToast, EirResponsivenessMatrixModal, DocumentHistoryModal, DocumentStatusWidget |
| `src/components/pages/loin-tables/` | LoinTablesPage, LoinRowForm, LoinRowsTable, LoinPropertyRequirementsModal — LOIN row manager + IDS properties (IFC entity, property requirements) and Export IDS |
| `src/components/pages/eir-manager/` | EirManagerPage, EirFormView, EirDraftsView, EirStartMenu, EirStartMenuView — EIR authoring (create/edit drafts, Publish, export); BEP form links to project EIRs and loads analysis |
| `src/components/pages/oir-manager/` | OirManagerPage, OirFormView, OirDraftsView, OirStartMenu, OirStartMenuView — OIR (Owner Information Requirements) authoring, mirrors EIR module structure |
| `src/components/pages/drafts/` | DraftManager, DraftListItem, SaveDraftDialog, SearchAndFilters |
| `src/components/pages/tidp-midp/` | TIDPMIDPDashboard, TidpMidpManager, RiskRegister, ResourcePlan, QualityGates, DependencyMatrix, CascadingImpact; `dashboard/` subfolder: TIDPsView, MIDPsView, StatisticsCards, MIDPAnalyticsDrawer, MIDPSummaryPanel, HelpModal |
| `src/components/pages/idrm-manager/` | IDRMDashboard; `dashboard/` subfolder: IMActivitiesView, DeliverablesView, TemplatesView, StatisticsCards, QuickActions, HelpModal |
| `src/components/pages/bim-import/` | BimImportPage — IFC upload, parse (STEP text), preview suggested deliverables, import to Responsibility Matrix |
| `src/components/responsibility-matrix/` | RACI matrix manager, IM activities, deliverables, export, TIDP sync |
| `src/components/tidp/` | TIDP dashboard, form, list, details, import, Excel editor |
| `src/components/steps/` | FormStepRHF (RHF step wrapper) |
| `src/contexts/` | AuthContext, ProjectContext, BepFormContext, EirContext, EirFormContext (RHF for EIR authoring), OirFormContext (RHF for OIR authoring), PartyRoleContext (appointing/lead party role selection) |
| `src/schemas/` | bepValidationSchemas.js, authSchemas.js, eirValidationSchemas.js, oirValidationSchemas.js (Zod) |
| `src/services/` | apiService, documentService, draftApiService, backendPdfService, bepFormatter, docxGenerator, bimService (parseIfcFile) |
| `src/hooks/` | useAISuggestion, useDrafts, useDraftSave, useDraftFilters, useDraftOperations, useExport, useTidpData, useTIDPFilters, useMidpData, useMidpSubPage, useResponsibilityMatrix, useStepNavigation, useMindmapD3, useOutsideClick, useUndoRedo, useDocumentHistory, useEirFill, useSnippets |
| `src/data/` | emptyBepData, emptyEirData, emptyOirData, templateRegistry, helpContentData, cdePlatformLibrary; `templates/`: commercialOfficeTemplate, commercialOfficeEirTemplate; `helpContent/`: loin |
| `src/config/` | bepConfig.js (barrel — re-exports CONFIG unchanged, imports lucide icons for frontend), bepSteps.js (14-step list + categories + icons), bepTypeDefinitions.js (pre/post-appointment metadata), bepOptions.js (bimUses, fileFormats, software, projectTypes), bepFormFields.js (all field definitions + getFormFields, imports lucide); **server-safe variants (no lucide-react):** bepStepsData.js (step data only), bepFormFieldsData.js (field data only), bepConfigForServer.js (server-safe CONFIG barrel); **EIR config (same split pattern):** eirConfig.js, eirSteps.js, eirFormFieldsData.js, eirStepsData.js, eirConfigForServer.js; **OIR config:** oirConfig.js, oirSteps.js, oirFormFieldsData.js, oirStepsData.js, oirConfigForServer.js |
| `src/constants/` | fieldExamples, iso19650ActivitiesTemplate, routes, tidpTemplates, documentHistory, sidebarUi, idsEntities (IFC entity options + suggestIfcEntity) |
| `src/utils/` | cn, complianceCheck, csvHelpers, imageCompression, markdownToHtml, validationUtils, eirResponsivenessMatrix, snippetUtils |
| `server/routes/` | auth, tidp, midp, drafts, ai, export, documents, projects, validation, bep-structure, responsibility-matrix, bim, migrate, loin, snippets, eir, oir |
| `server/services/` | tidpService, midpService, authService, emailService, emailTemplates, projectService, exportService, htmlTemplateService, puppeteerPdfService, bepStructureService, responsibilityMatrixService, eirExportService, eirDocumentExportService, eirFormAnalysisMapper, eirService, oirService, tidpSyncService, encryptedSecretService, loinService, idsGeneratorService, snippetService, loadBepConfig, ifcParserService, guidedAiQuestionsCache |
| `server/services/templates/` | bepStyles.css (HTML/CSS templates for PDF/export rendering) |
| `server/database.js` | Primary DB entry point — better-sqlite3 setup, all table creation, sample project seeding; writes to `server/db/bep-generator.db` |
| `server/db/` | SQLite data directory; `database.js` here is legacy (path differs); `.db` file lives here |
| `server/middleware/` | authMiddleware.js (JWT verify) |
| `server/validators/` | authValidator.js, midpValidator.js, tidpValidator.js (request validation) |
| `server/scripts/` | One-off migration scripts (migrate-add-*, migrate-localStorage-to-db) + audit-orphaned-records, seed-bep-structure, backup-database |
| `server/__tests__/` | Vitest server-side tests: tidp, midp, projects, htmlTemplateService, eirAnalysisApi, eirFormAnalysisMapper |
| `ml-service/` | api_ollama.py (FastAPI), eir_analyzer.py, ollama_generator.py (OLLAMA_MODEL env var, default `qwen3`), text_extractor.py, benchmark_models.py, verify_ollama.py |

## Context Providers

| Provider | State | Hook |
|----------|-------|------|
| `AuthContext` | user, loading, login/logout/register | `useAuth()` |
| `ProjectContext` | currentProject, projects, loadProjects/selectProject | `useProject()` |
| `BepFormContext` | RHF form methods, errors, isDirty, isValid | `useBepForm()` |
| `EirContext` | EIR analysis data, field→EIR path mappings | `useEir()` |
| `EirFormContext` | RHF form methods for EIR authoring | `useEirForm()` |
| `OirFormContext` | RHF form methods for OIR authoring | `useOirForm()` |
| `PartyRoleContext` | Appointing party / lead appointed party role selection | `usePartyRole()` |
| `FormBuilderContext` | Form structure editing state (steps, fields, isEditMode) | `useFormBuilder()` |

## API Routes Quick Reference

| Base | Key endpoints |
|------|--------------|
| `/api/auth` | POST register, login, forgot-password, reset-password; GET me, verify-email/:token |
| `/api/projects` | CRUD: GET /, GET /:id, POST /, PUT /:id, DELETE /:id |
| `/api/drafts` | CRUD + filter by userId/projectId |
| `/api/tidp` | CRUD + filter by projectId |
| `/api/midp` | CRUD |
| `/api/ai` | POST generate, POST analyze-eir, POST suggest-eir-field, GET health |
| `/api/documents` | POST upload (max 20MB), POST analyze/:id, GET /:id, DELETE /:id |
| `/api/export` | POST tidp/:id/excel, midp/:id/excel, bep/pdf, bep/docx, eir/export, loin/:projectId/ids (.ids XML) |
| `/api/bep-structure` | Steps + fields CRUD (dynamic form structure) |
| `/api/responsibility-matrix` | RACI matrix CRUD |
| `/api/bim` | POST parse-ifc (multipart .ifc, max 50MB); returns model info + suggested deliverables |
| `/api/validation` | POST tidp/:id, POST midp/:id |
| `/api/migrate` | DB migration endpoints |
| `/api/loin` | LOIN rows CRUD (withPropertyCount=1 for badge); GET/POST /:rowId/properties, PUT/DELETE /properties/:id |
| `/api/eir` | EIR drafts: GET/POST /drafts, GET/PUT/DELETE /drafts/:id, GET /drafts/:id/analysis (form→EirAnalysis JSON), POST /drafts/:id/publish |
| `/api/oir` | OIR drafts: GET/POST /drafts, GET/PUT/DELETE /drafts/:id, POST /drafts/:id/publish |
| `/api/snippets` | Snippets CRUD + resolve ({{snippet:key}} substitution) |

## Schemas (Zod)

| File | Validates |
|------|----------|
| `bepValidationSchemas.js` | All BEP steps: projectInfo, teamStructure, bimUses, + fullBepSchema (includes linkedEirId). Functions: `getSchemaForStep(i)`, `validateStepData(i, data)` |
| `authSchemas.js` | loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema |
| `eirValidationSchemas.js` | EIR step schemas; mirrors BEP schema pattern |
| `oirValidationSchemas.js` | OIR step schemas; mirrors BEP schema pattern |

## Tech Stack

- **Frontend:** React 19, React Router v7, RHF + Zod, TipTap, Tailwind, @xyflow/react, @dnd-kit, lucide-react, axios, react-hot-toast
- **Backend:** Express, better-sqlite3, bcryptjs, jsonwebtoken, Puppeteer, multer, docx, xlsx
- **ML:** FastAPI, Ollama, pdfplumber, python-docx, pydantic
- **Dev:** Vitest, concurrently, cross-env, nodemon

## DB Tables

users, projects, drafts, tidps, containers, midps, documents, steps, fields, field_types, responsibility_matrix (+ related), snippets, loin_rows (ifc_entity), loin_property_requirements, eir_drafts (id, user_id, project_id, title, data, status, created_at, updated_at), oir_drafts (same schema as eir_drafts)

## Startup

`npm start` → concurrently runs frontend (:3000) + backend (:3001) + ML service (:8000). Prestart checks ports + starts Ollama.

**Production (Docker/Hetzner):** `bash deploy.sh` → builds images via `docker-compose.yml`, pushes to Hetzner. Services: `backend` (3001), `ml-service` (8000), `frontend` (nginx). SQLite volume: `sqlite-data:/app/server/db`. Configured via `.env.production` (gitignored).
