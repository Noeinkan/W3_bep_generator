# BEP Tier-1 Quality Roadmap

## Context
Current app generates a 42-page BEP. A real Tier-1 National Grid BEP runs 85 pages. Analysis identified six gap categories: governance, exceptions/derogations, appendices, PDF polish, content specificity, and contractual tone. This roadmap closes those gaps while preserving the local-Ollama EIR-analysis and guided-authoring strengths.

### Current export pipeline
```
formData → htmlTemplateService.generateBEPHTML() → puppeteerPdfService.generatePDFFromHTML() → PDF
```
- `htmlTemplateService.js` (1,462 lines) — all HTML rendering
- `bepStyles.css` (485 lines) — A4 print CSS
- `puppeteerPdfService.js` (297 lines) — Puppeteer wrapper (no headerTemplate/footerTemplate yet)
- `bepConfig.js` (371 lines) — 14 steps, field definitions
- `emptyBepData.js` (217 lines) — default data skeleton
- `bepValidationSchemas.js` (265 lines) — Zod schemas for all 14 steps

---

## 12-Step Roadmap

---

### Step 1 — Document Control Table & Approval Block
**Gap:** No revision history, no signatory block, no document reference number. Real Tier-1 BEPs open with a document control table and formal approval page.
**Effort:** 5 h
**Files:**
- `server/services/htmlTemplateService.js` — add `renderDocumentControlTable()` and `renderApprovalBlock()` inserted between cover page and TOC
- `server/services/templates/bepStyles.css` — styles for revision table rows, status chip (WIP/SHR/PBL), approval grid
- `src/config/bepConfig.js` — add `documentControl` fields to step 0 (`projectInfo`): `documentReference`, `revisionStatus`, `revisions[]` (each: version, date, author, description, approver), `classification`
- `src/data/emptyBepData.js` — default `documentControl` object with one empty revision row
- `src/schemas/bepValidationSchemas.js` — extend `projectInfoSchema` with optional `documentControl` sub-object

**Acceptance criteria:**
- Exported PDF contains a revision history table immediately after the cover page listing version, date, author, description, approver
- Document reference number (e.g. `PROJ-BEP-PLN-IM-000001`) appears on cover page and in document control table
- Status badge (WIP / SHR / PBL / ARC) rendered as colour-coded chip

---

### Step 2 — Running Page Headers & Footers
**Gap:** Zero header/footer on any page. Real BEPs show document ref, revision, date in the header and "Page X of Y" in the footer.
**Effort:** 4 h
**Files:**
- `server/services/puppeteerPdfService.js` — add `headerTemplate` and `footerTemplate` strings to `page.pdf()` options (Puppeteer supports these natively); enable `displayHeaderFooter: true`
- `server/services/htmlTemplateService.js` — expose `documentReference`, `revision`, and `date` in the return value so the export route can pass them into `puppeteerPdfService`
- `server/routes/export.js` — forward metadata from `htmlTemplateService` to `puppeteerPdfService` options
- `server/services/templates/bepStyles.css` — add `@page` margin adjustments (top: 35mm, bottom: 30mm) to make room for Puppeteer header/footer

**Acceptance criteria:**
- Every page except the cover shows header: `[document reference] | Rev [X] | [date]`
- Every page shows footer: `[project name]` left, `Page N of M` right
- Cover page suppressed via CSS `page: coverPage; @page coverPage { margin-top: 0; }`

---

### Step 3 — Purpose, Scope, Applicable Documents & Definitions Sections
**Gap:** Real BEPs open with explicit Purpose, Scope, Applicable Documents (normative/informative list), and Definitions & Abbreviations sections before technical content.
**Effort:** 7 h
**Files:**
- `src/config/bepConfig.js` — insert two new steps after step 0: **"Purpose & Scope"** (fields: `documentPurpose`, `documentScope`, `applicableDocuments` table) and **"Definitions & Abbreviations"** (fields: `definitions` table with Term/Definition columns, `abbreviations` table)
- `src/data/emptyBepData.js` — add default data for both new steps including pre-filled ISO 19650 abbreviations (AIR, BEP, CDE, EIR, IFC, LOD, LOI, OIR, PIR, TIDP, MIDP, RACI)
- `src/schemas/bepValidationSchemas.js` — add `purposeScopeSchema` and `definitionsSchema`; update `getSchemaForStep()` index mapping
- `server/services/htmlTemplateService.js` — update `renderContentSections()` to handle new step types; pre-filled abbreviations table renders alphabetically sorted

**Acceptance criteria:**
- PDF sections 2 (Purpose & Scope) and 3 (Definitions & Abbreviations) appear before technical content
- Applicable Documents table has columns: Ref, Document Title, Document Number, Status
- Abbreviations table pre-populated with 12 ISO 19650 standard terms
- Step number offsets update correctly throughout TOC and all subsequent sections

---

### Step 4 — Formal Appendices System (A–E)
**Gap:** Current appendices step is minimal. Real BEPs close with lettered appendices (App A: Software Versions, App B: RACI, App C: Referenced Docs, App D: COBie Requirements, App E: EIR Compliance Matrix).
**Effort:** 6 h
**Files:**
- `server/services/htmlTemplateService.js` — replace current `renderContentSections()` appendix handling with a dedicated `renderAppendices(formData)` method; renders lettered appendix headers (APPENDIX A, B…) with page-break-before; each appendix has its own section style
- `src/config/bepConfig.js` — restructure the final step into 5 sub-sections: App A (software versions matrix with Discipline/Software/Version/License columns), App B (RACI reference — links to responsibility matrix data), App C (referenced documents table), App D (COBie requirements), App E (EIR compliance checklist)
- `src/data/emptyBepData.js` — expand `appendices` object with default rows for each appendix
- `src/schemas/bepValidationSchemas.js` — expand `appendicesSchema` with sub-schemas per appendix
- `server/services/templates/bepStyles.css` — add `.appendix-header` style (large serif letter + title, full-width rule)

**Acceptance criteria:**
- PDF ends with five distinct lettered appendix sections, each starting on a new page
- TOC lists appendices as "Appendix A — Software Register", "Appendix B — RACI Matrix" etc.
- App B pulls RACI data already stored in `responsibility_matrix` DB table if available

---

### Step 5 — Exceptions & Derogations Section
**Gap:** No mechanism to record or render formal exceptions to EIR requirements — a mandatory section in any real BEP.
**Effort:** 3 h
**Files:**
- `src/config/bepConfig.js` — add a new step **"Exceptions & Derogations"** (fields: `exceptions` table with columns: EIR Clause Ref, Requirement, Proposed Alternative, Justification, Agreed By; `noExceptions` boolean toggle)
- `src/data/emptyBepData.js` — add `exceptions` default (empty table, `noExceptions: false`)
- `src/schemas/bepValidationSchemas.js` — add `exceptionsSchema`
- `server/services/htmlTemplateService.js` — render section with introductory clause text ("The following exceptions/derogations from the EIR have been agreed with the Appointing Party...") followed by table or a "No exceptions" statement if toggle set

**Acceptance criteria:**
- When no exceptions exist and toggle is set, section renders a single sentence: "There are no exceptions to the requirements set out in the EIR."
- When exceptions exist, full table renders with EIR clause numbers
- AI suggestion button wired to new field type `eirExceptions`

---

### Step 6 — Model Progression Specification (LOD/LOI Matrix per Phase)
**Gap:** Current model development step has LOD requirements but no phase-by-phase breakdown per discipline — the core of Tier-1 BEP specificity.
**Effort:** 6 h
**Files:**
- `src/config/bepConfig.js` — add `modelProgressionMatrix` table field to the model development step; columns: Discipline, RIBA Stage 2 (LOD/LOI), Stage 3, Stage 4, Stage 5, Stage 6; add `informationDeliverySchedule` table with Milestone, Date, Format, Purpose, EIR Ref columns
- `src/data/emptyBepData.js` — pre-fill matrix with 8 disciplines (Architecture, Structure, MEP×3, Facades, Civil, Fire) and empty LOD cells; pre-fill delivery schedule with common RIBA stages
- `server/services/htmlTemplateService.js` — add `renderModelProgressionMatrix()` that renders a cross-table with discipline rows and stage columns; highlight cells where LOD ≥ 350 in green
- `server/services/templates/bepStyles.css` — add `.lod-matrix` styles: compact 9pt cells, color-coded LOD levels (200=yellow, 300=blue, 350=teal, 400=green)
- `ml-service/eir_analyzer.py` — expand EIR field mapping to extract `lod_by_stage` from `lod_loi_requirements` and map to `modelProgressionMatrix`

**Acceptance criteria:**
- PDF renders a colour-coded LOD/LOI matrix grid visible at a glance
- EIR analysis auto-populates LOD values when extracted from EIR document
- Delivery schedule table links milestones to EIR references

---

### Step 7 — Spatial Coordination & Clash Management Enhancement
**Gap:** Current clash detection is a basic text field. Real BEPs specify clash severity levels, sign-off process, frequency, and responsibility by discipline pair.
**Effort:** 5 h
**Files:**
- `src/config/bepConfig.js` — add to model development/coordination step: `clashSeverityMatrix` table (Severity Level, Description, Resolution Owner, SLA, Sign-off Required), `clashDetectionSchedule` (Discipline Pair, Frequency, Software, Responsible), `coordinationMeetingProtocol` textarea
- `src/data/emptyBepData.js` — pre-fill severity matrix with 4 levels (Critical/Major/Minor/Cosmetic) including standard descriptions
- `server/services/htmlTemplateService.js` — add `renderClashSeverityMatrix()` with colour-coded severity rows (red/amber/yellow/grey)
- `server/services/templates/bepStyles.css` — `.severity-critical { background: #fee2e2 }`, `.severity-major { background: #fef3c7 }` etc.

**Acceptance criteria:**
- PDF renders a clash severity level table with colour banding
- Pre-filled severity descriptions match common industry practice (Critical = structural/life safety clash)
- AI suggestion button available for `coordinationMeetingProtocol` field

---

### Step 8 — AI Prompt Upgrade: Contractual Tone & ISO 19650 Language
**Gap:** Generated content reads as advisory/descriptive rather than contractual. Real BEP language uses "shall", "will", "is required to", references specific ISO 19650 clauses.
**Effort:** 4 h
**Files:**
- `ml-service/ollama_generator.py` — add `BEP_SYSTEM_PROMPT` constant (lines ~40–65 area) with explicit instructions: use contractual language ("shall"), reference ISO 19650-2:2018, avoid hedging words ("may wish to", "could consider"), target 3rd-person formal register; inject into every `suggest_for_field()` call
- `ml-service/eir_analyzer.py` — upgrade `FIELD_SUGGESTION_PROMPT` to require ISO clause references and contractual phrasing
- New field-type → tone mappings in `ollama_generator.py`: `eirExceptions`, `modelProgressionMatrix`, `clashSeverityMatrix`, `coordinationMeetingProtocol`, `documentPurpose`, `documentScope` with tailored prompts
- `server/routes/ai.js` — expose new field types in `/api/ai/field-types` endpoint (currently 25 types → extend to ~35)

**Acceptance criteria:**
- Generated text for BIM goals contains "shall" at least twice per paragraph
- Generated exceptions text references specific EIR clause format ("Clause X.X of the EIR")
- AI suggestions for LOD fields include numeric LOD values (e.g. "LOD 350 at RIBA Stage 4")
- `npm test` passes with no regressions on existing AI routes

---

### Step 9 — EIR Analyzer: Extract Governance & Exceptions Data
**Gap:** EIR analyzer extracts 18 field types but misses document control metadata, derogations, security classification, and project information requirements that appear in Tier-1 EIRs.
**Effort:** 5 h
**Files:**
- `ml-service/eir_analyzer.py` — expand `EirAnalysis` Pydantic model with: `document_control` (reference, revision, status, classification), `derogations_requested` (list), `security_classification` (string), `project_phases` (list with phase name, description, target date); expand `EIR_ANALYSIS_PROMPT` to extract these; add field mappings for `documentReference`, `classification`, `eirExceptions`, `projectPhases`
- `ml-service/api_ollama.py` — expose new extracted fields via `/suggest-from-eir` endpoint
- `server/routes/ai.js` — add new field type mappings to `/api/ai/suggest-from-eir` route

**Acceptance criteria:**
- After EIR upload, document reference number auto-populates the `documentReference` form field
- Security classification (e.g. "OFFICIAL") auto-populates classification field
- EIR-extracted derogations pre-fill the exceptions table rows
- Existing EIR analysis tests continue to pass

---

### Step 10 — DOCX Export Structural Parity
**Gap:** DOCX export (`src/services/docxGenerator.js`) lacks headers/footers, proper styles, and the new sections added in Steps 1–7.
**Effort:** 7 h
**Files:**
- `src/services/docxGenerator.js` — add: `Header` and `Footer` objects (document ref left, page number right) to every section; `DocumentControlTable` function using `docx` Table API; `AppendicesSection` function; update section numbering to match new step ordering; add styles for LOD matrix table (conditional cell shading)
- `server/routes/export.js` — pass `documentControl` data from `formData` to the DOCX generator

**Acceptance criteria:**
- DOCX file opens in Word with running header/footer matching PDF
- Document control table appears in DOCX on page 2
- All five appendices render in DOCX with lettered headings
- LOD matrix table renders with correct column structure in DOCX

---

### Step 11 — PDF Visual Polish & Professional Typography
**Gap:** Current PDF uses system font stack, limited typographic hierarchy, and a strong blue gradient cover that looks app-generated rather than corporate.
**Effort:** 4 h
**Files:**
- `server/services/templates/bepStyles.css` — import Google Fonts fallback stack (or embed via base64 for offline); increase section heading size to 14pt; add `.section-rule` full-width 2px blue line under section headings; increase body line-height to 1.7; add `.field-label` uppercase tracking; add alternating table row shading (`#f8fafc` on even rows); reduce cover gradient opacity for a more corporate look; add ISO badge to footer
- `server/services/htmlTemplateService.js` — add project logo placeholder box on cover page (renders grey box if no logo, or base64 image if `options.logoBase64` supplied); add classification box (RED border for CONFIDENTIAL, grey for OFFICIAL) at top-right of cover

**Acceptance criteria:**
- PDF cover page has a professional logo placeholder area
- Section headings have a consistent blue rule underline
- Body text renders at 11pt with 1.7 line-height, readable at 100% zoom
- Classification label visible on cover page

---

### Step 12 — Supply Chain Capability Assessment
**Gap:** Real Tier-1 BEPs include a capability and capacity assessment of each task team, demonstrating that appointed parties can meet EIR requirements.
**Effort:** 4 h
**Files:**
- `src/config/bepConfig.js` — add `capabilityAssessment` table field to the team structure step: columns: Task Team / Company, BIM Role, Software Competency, ISO 19650 Training (Y/N), Previous BIM Projects, Capacity (FTE)
- `src/data/emptyBepData.js` — add empty `capabilityAssessment` table default
- `src/schemas/bepValidationSchemas.js` — add `capabilityAssessment` array to `teamStructureSchema`
- `server/services/htmlTemplateService.js` — render capability assessment table in team structure section
- `ml-service/ollama_generator.py` — add field type `capabilityAssessment` with prompt instructing professional assessment language referencing ISO 19650-2 Annex B

**Acceptance criteria:**
- PDF team section includes capability assessment table
- EIR analysis maps extracted `role_responsibilities` data to pre-fill task team rows
- AI suggestion for capability assessment references ISO 19650-2 Annex B

---

## Prioritised Execution Order

| Priority | Step | Effort | Impact |
|----------|------|--------|--------|
| 1 | Step 1 — Document Control | 5 h | Very High |
| 2 | Step 2 — Page Headers/Footers | 4 h | Very High |
| 3 | Step 3 — Purpose/Scope/Definitions | 7 h | High |
| 4 | Step 11 — PDF Polish | 4 h | High (visual) |
| 5 | Step 4 — Appendices | 6 h | High |
| 6 | Step 5 — Exceptions/Derogations | 3 h | High |
| 7 | Step 6 — LOD Matrix | 6 h | High |
| 8 | Step 8 — AI Tone | 4 h | Medium-High |
| 9 | Step 7 — Clash Management | 5 h | Medium |
| 10 | Step 9 — EIR Expansion | 5 h | Medium |
| 11 | Step 10 — DOCX Parity | 7 h | Medium |
| 12 | Step 12 — Capability Assessment | 4 h | Medium |
| **Total** | | **~60 h** | |

---

## Verification (end-to-end)
1. `npm start` — start all three services
2. Create a new Post-Appointment BEP, upload a real EIR, run EIR analysis
3. Verify auto-populated fields: document reference, security classification, LOD values, exceptions
4. Export PDF — check: cover with logo placeholder + classification, revision table, running headers/footers, all 12+ sections numbered correctly, five appendices, LOD matrix, clash severity table
5. Export DOCX — open in Word, verify header/footer, styles, document control table
6. `npm test` — all Vitest tests pass
