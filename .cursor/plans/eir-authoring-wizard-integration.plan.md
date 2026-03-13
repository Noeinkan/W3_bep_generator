# EIR Authoring Wizard & BEP Handshake

## Use existing forms and components for EIR steps and fields

**Do not introduce new EIR-specific form UI.** The EIR wizard already uses the same stack as the rest of the app:

- **Step and field config:** [src/config/eirConfig.js](src/config/eirConfig.js), [src/config/eirStepsData.js](src/config/eirStepsData.js), [src/config/eirFormFieldsData.js](src/config/eirFormFieldsData.js) define EIR steps and fields (section-header, info-banner, textarea, table, milestones-table, naming-conventions, im-activities-matrix, etc.).
- **Rendering:** [EirFormView](src/components/pages/eir-manager/EirFormView.js) passes `EIR_CONFIG.getFormFields(currentStep)` as `stepConfig` into [FormStepRHF](src/components/steps/FormStepRHF.js), which in turn uses [InputFieldRHF](src/components/forms/base/InputFieldRHF.js) and [InputField](src/components/forms/base/InputField.js) (plus [FieldTypeRegistry](src/components/form-builder/FieldTypeRegistry.js) for specialized types).

All new work (AI suggestions, EIR→analysis mapping, BEP linkage, export) must **plug into this existing pipeline** — same `FormStepRHF`, same `InputFieldRHF`/`InputField`, same field type definitions in `eirFormFieldsData`. No duplicate or EIR-only form components.

---

## Current capabilities in this repo

- **Structured EIR authoring already exists:** `EirManagerPage` and `EirFormView` provide a multi-step EIR editor driven by `EirFormProvider` with Zod validation and step config from the files above. Drafts are persisted via [server/routes/eir.js](server/routes/eir.js) and [server/services/eirService.js](server/services/eirService.js).
- **EIR ingestion and analysis already power BEP:** Upload + AI analysis of EIR/AIR/PIR/OIR documents happens through [EirUploadStep](src/components/eir/EirUploadStep.js) and `ml-service/eir_analyzer.py`, with results rendered by [EirAnalysisView](src/components/eir/EirAnalysisView.js) and exported via [server/services/eirExportService.js](server/services/eirExportService.js).
- **BEP-side consumption is wired:** [EirContext](src/contexts/EirContext.js), [useEirFill](src/hooks/useEirFill.js), and [eirResponsivenessMatrix](src/utils/eirResponsivenessMatrix.js) serve BEP field suggestions and build an EIR→BEP responsiveness matrix from the analyzed EIR JSON.

## Gaps vs. the "own both sides" EIR→BEP vision

- **Authored EIRs are not yet first-class inputs to the BEP pipeline:** EIR drafts store a rich, ISO-aligned structure (`EMPTY_EIR_DATA`, `eirFormFieldsData`), but there is no canonical mapping from this structure back into the `EirAnalysis` JSON shape that BEP suggestions and the responsiveness matrix already consume.
- **No explicit EIR↔BEP linkage:** BEP drafts and flows do not yet reference a specific EIR draft for a project, so the responsiveness matrix is document-based rather than a live handshake between authored EIR and BEP.
- **EIR authoring wizard is largely manual:** The EIR form uses the same components as BEP but lacks inline AI assistance (suggestion buttons, prefill) like the BEP generator has.

## Implementation plan

### 1. Make authored EIR drafts produce canonical EIR analysis JSON

- Add a **transformer from EIR form data → `EirAnalysis`-shaped JSON** (backend): map `eir_drafts.data` fields (from `eirFormFieldsData` / `emptyEirData`) to the structure expected by `EirContext` / `buildEirMatrix` (e.g. `informationDeliveryMilestones` → `delivery_milestones`, CDE/metadata → `cde_requirements`).
- Expose this via **`GET /api/eir/drafts/:id/analysis`** (or store derived `analysis_json` on save) so BEP flows can consume authored EIRs without re-running the ML analyzer.

### 2. Link EIR drafts to BEP drafts and the responsiveness matrix

- Add **BEP↔EIR association** (e.g. `linked_eir_id` on BEP drafts) and surface it in BEP start/wizard and in `EirResponsivenessMatrixModal`.
- When a BEP is linked to an EIR draft, **fetch that draft’s analysis JSON** and call `setEirAnalysis` so `useEirFill` and `buildEirMatrix` work unchanged.

### 3. Add AI assistance to the EIR authoring wizard

- **Backend:** New endpoint (e.g. `POST /api/ai/suggest-eir-field`) that takes `fieldName`, `currentText`, optional `eirDraftData`, and returns suggestions aligned with the **existing EIR field taxonomy** in `eirFormFieldsData`.
- **Frontend:** Reuse patterns from [src/components/forms/ai/](src/components/forms/ai/) (suggestion buttons, side-panels) and attach them to the **existing** EIR fields rendered by `FormStepRHF` / `InputFieldRHF` — no new field components; AI only augments the current form.

### 4. Tighten the UX flows for appointing vs appointed parties

- **Appointing party:** In `EirManagerPage`, add guidance and a "Publish EIR" (or similar) so a draft can be marked as the active EIR for a project.
- **Appointed party:** In the BEP start view, surface the project’s published EIR and pre-select it as the source for suggestions and the responsiveness matrix; keep EIR upload + analysis as fallback.

### 5. Exports, tests, and safety nets

- Extend EIR export so authored content can be rendered (reuse/adapt `EirExportService` and existing templates).
- Add **unit tests for the EIR-form-data→EirAnalysis transformer** and integration tests for BEP↔EIR linkage and AI suggestion flow.

## Key idea

Use **only the existing EIR form stack** (config + FormStepRHF + InputFieldRHF + InputField + FieldTypeRegistry). Treat the structured EIR form as another producer of the same canonical `EirAnalysis` JSON the BEP side already understands, then add linkage and AI on top of that pipeline.
