# Project Index — BEP Generator

> **Purpose:** Compact codebase map so Claude reads this FIRST instead of exploring.
> ~150 lines vs ~50,000+ lines of source code.

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
| `src/components/form-builder/` | Dynamic form structure editor (steps, fields, drag-drop) |
| `src/components/forms/ai/` | AI assistant tabs, suggestion buttons, smart help |
| `src/components/forms/base/` | Base inputs: text, textarea, checkbox, editable table |
| `src/components/forms/controls/` | Progress bar/sidebar, command palette, search filter |
| `src/components/forms/custom/` | CDE platform, naming convention, federation, RACI, clash matrix |
| `src/components/forms/diagrams/` | Org chart, folder structure, volume mindmap, CDE diagram |
| `src/components/forms/editors/` | TipTap rich text editor + toolbar + extensions |
| `src/components/forms/specialized/` | Budget input, milestones table, org structure field |
| `src/components/layout/` | MainLayout (sidebar, header, Outlet) |
| `src/components/midp/` | MIDP form, list, evolution dashboard |
| `src/components/pages/` | HomePage (+ sections: Integration, ISOCompliance, ProductCard, SocialProof), ProjectsPage, BEPGeneratorWrapper, PreviewExportPage, ProfilePage, SettingsPage, TidpEditorPage |
| `src/components/pages/auth/` | Login, Register, ForgotPassword, ResetPassword, VerifyEmail, VerificationPending pages |
| `src/components/pages/bep/` | BepLayout, BepStartMenuView, BepSelectTypeView, BepFormView, BepPreviewView, BepDraftsView, BepImportView, BepInfoRequirementsView, BepStructureMapView, BepTemplatesView, BepTypeSelector, ImportBepDialog, TemplateGallery; `components/` subfolder: BepHeader, BepSidebar, BepFooter, SuccessToast |
| `src/components/pages/drafts/` | DraftManager, DraftListItem, SaveDraftDialog, SearchAndFilters |
| `src/components/pages/tidp-midp/` | TIDPMIDPDashboard, TidpMidpManager, RiskRegister, ResourcePlan, QualityGates, DependencyMatrix, CascadingImpact; `dashboard/` subfolder: TIDPsView, MIDPsView, StatisticsCards, MIDPAnalyticsDrawer, MIDPSummaryPanel, HelpModal |
| `src/components/pages/idrm-manager/` | IDRMDashboard; `dashboard/` subfolder: IMActivitiesView, DeliverablesView, TemplatesView, StatisticsCards, QuickActions, HelpModal |
| `src/components/responsibility-matrix/` | RACI matrix manager, IM activities, deliverables, export, TIDP sync |
| `src/components/tidp/` | TIDP dashboard, form, list, details, import, Excel editor |
| `src/components/steps/` | FormStepRHF (RHF step wrapper) |
| `src/contexts/` | AuthContext, ProjectContext, BepFormContext, EirContext |
| `src/schemas/` | bepValidationSchemas.js, authSchemas.js (Zod) |
| `src/services/` | apiService, documentService, draftApiService, backendPdfService, bepFormatter, docxGenerator |
| `src/hooks/` | useAISuggestion, useDrafts, useDraftSave, useDraftFilters, useDraftOperations, useExport, useTidpData, useTIDPFilters, useMidpData, useResponsibilityMatrix, useStepNavigation, useMindmapD3, useOutsideClick, useUndoRedo |
| `src/data/` | emptyBepData, templateRegistry, helpContentData, cdePlatformLibrary |
| `src/config/` | bepConfig.js (BEP types, step categories, field mappings) |
| `src/constants/` | fieldExamples, iso19650ActivitiesTemplate, routes, tidpTemplates |
| `src/utils/` | cn, complianceCheck, csvHelpers, imageCompression, markdownToHtml, validationUtils |
| `server/routes/` | auth, tidp, midp, drafts, ai, export, documents, projects, validation, bep-structure, responsibility-matrix, migrate |
| `server/services/` | tidpService, midpService, authService, emailService, emailTemplates, projectService, exportService, htmlTemplateService, puppeteerPdfService, bepStructureService, responsibilityMatrixService, eirExportService, tidpSyncService, encryptedSecretService |
| `server/services/templates/` | bepStyles.css (HTML/CSS templates for PDF/export rendering) |
| `server/db/` | database.js (better-sqlite3 setup, all table creation) |
| `server/middleware/` | authMiddleware.js (JWT verify) |
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

## Schemas (Zod)

| File | Validates |
|------|----------|
| `bepValidationSchemas.js` | All BEP steps: projectInfo, teamStructure, bimUses, + fullBepSchema. Functions: `getSchemaForStep(i)`, `validateStepData(i, data)` |
| `authSchemas.js` | loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema |

## Tech Stack

- **Frontend:** React 19, React Router v7, RHF + Zod, TipTap, Tailwind, @xyflow/react, @dnd-kit, lucide-react, axios, react-hot-toast
- **Backend:** Express, better-sqlite3, bcryptjs, jsonwebtoken, Puppeteer, multer, docx, xlsx
- **ML:** FastAPI, Ollama, pdfplumber, python-docx, pydantic
- **Dev:** Vitest, concurrently, cross-env, nodemon

## DB Tables

users, projects, drafts, tidps, containers, midps, documents, steps, fields, field_types, responsibility_matrix (+ related)

## Startup

`npm start` → concurrently runs frontend (:3000) + backend (:3001) + ML service (:8000). Prestart checks ports + starts Ollama.
