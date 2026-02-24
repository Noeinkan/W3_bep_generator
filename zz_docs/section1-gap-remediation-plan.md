# Section 1 — Introduction Gap Remediation Plan

**Date:** 2026-02-24
**Based on:** Benchmark BEP Section 1 analysis (pp. 7–8)
**Constraint:** No new steps — all changes must fit within existing Step 1 ("BEP Type & Project Info")

---

## Gaps to Close

| # | Missing Element | Current State |
|---|---|---|
| 1 | BEP purpose statement (response to EIR + PIR) | No field |
| 2 | PIR → EIR → BEP → IS → IPMP → Mob.Plan / Risk Register / IDP diagram | No field |
| 3 | Signposted documents list (IS, IPMP missing; others exist elsewhere) | Partial |
| 4 | "BEP per direct appointment" note | No field |
| 5 | ISO 19650 terminology definitions (Task Team, Appointed Party, LAP, IPDT) | No field |
| 6 | ISO 19650-2 party interface diagram | No field |

---

## Approach: Extend Step 1 with a Preamble Section

All 6 elements will be added to Step 1 (`bepConfig.js` → `formFields['pre-appointment'][0]` and `formFields['post-appointment'][0]`) as new fields inserted **before** the existing project data fields.

A `section-header` divider will separate the new Introduction preamble from the existing project data fields.

---

## New Fields (in order)

### 1. EIR / PIR Reference (Purpose Statement)
- **Field name:** `eirPirReference`
- **Type:** `textarea` (rows: 3)
- **Label:** `BEP Purpose — Response to EIR and PIR`
- **Placeholder:** `This BEP is prepared in response to the Exchange Information Requirements (EIR) ref. [EIR-REF] issued by [Appointing Party] and the Project Information Requirements (PIR) ref. [PIR-REF] dated [date]. It sets out the appointed delivery team's approach to meeting those requirements in accordance with ISO 19650-2:2018.`
- **Section number:** `1.1`
- **Notes:** Links to EIR upload context. For post-appointment, label changes to "Confirmed response" (same field name, different placeholder).

---

### 2. Document Hierarchy Diagram (PIR → EIR → BEP chain)
- **Field name:** `documentHierarchyDiagram`
- **Type:** `static-diagram` (new display-only field type, renders a fixed SVG/ASCII representation) **OR** `textarea` as a fallback description if static diagram type is too heavy to implement now
- **Label:** `Information Requirements Document Hierarchy`
- **Content (static):** Renders the chain: `PIR → EIR → BEP → Information Standard → IPMP → { Mobilisation Plan | Risk Register | Information Delivery Plan }`
- **Section number:** `1.2`
- **Implementation note:** Start with a `static-diagram` type that renders a styled read-only HTML diagram in the form. No user input needed. The form step renderer will need a case for `static-diagram` type.

---

### 3. Signposted Documents Table
- **Field name:** `signpostedDocuments`
- **Type:** `table`
- **Label:** `Related Documents Signposted by this BEP`
- **Columns:** `['Document', 'Reference / Title', 'Location / CDE Path', 'Status']`
- **Default rows (pre-populated):**
  - Information Standard (IS)
  - Information Production Methods and Procedures (IPMP)
  - Master Information Delivery Plan (MIDP)
  - Information Risk Register
  - Mobilisation Plan
  - Federation Strategy
- **Section number:** `1.3`
- **Notes:** `emptyBepData.js` needs a `signpostedDocuments` array with these 6 pre-populated rows.

---

### 4. Appointment Note (static text)
- **Field name:** *(none — display only)*
- **Type:** `info-banner`
- **Label / content:** `ISO 19650 Requirement: A separate BEP must be prepared and maintained for each direct appointment within the project. This document covers the appointment of [Appointed Party] only.`
- **Section number:** `1.4`
- **Implementation note:** `info-banner` is a new display-only field type — renders a styled callout box (blue/info colour). No user input.

---

### 5. ISO 19650 Terminology Definitions
- **Field name:** `iso19650Definitions`
- **Type:** `table`
- **Label:** `ISO 19650 Party Definitions`
- **Columns:** `['Term', 'ISO 19650 Definition', 'Role on This Project']`
- **Default rows (pre-populated):**
  - Task Team
  - Appointed Party
  - Lead Appointed Party (LAP)
  - Integrated Project Delivery Team (IPDT)
  - Appointing Party
- **Section number:** `1.5`
- **Notes:** Third column "Role on This Project" is editable — users fill in actual names/entities. First two columns ship with ISO text pre-filled as read-only or placeholder.

---

### 6. Party Interface Diagram
- **Field name:** `partyInterfaceDiagram`
- **Type:** `static-diagram`
- **Label:** `ISO 19650-2:2018 — Interfaces Between Parties`
- **Content:** Renders a read-only representation of the ISO 19650-2 party relationship: Appointing Party ↔ Lead Appointed Party ↔ Task Teams, with IPDT spanning all.
- **Section number:** `1.6`
- **Implementation note:** Same `static-diagram` renderer as field 2. Two separate diagram definitions (one for doc hierarchy, one for party interfaces).

---

## New Field Types Required

Two new read-only field types must be added to the form step renderer ([FormStepRHF.js](src/components/steps/FormStepRHF.js) or wherever field type dispatch lives):

| Type | Behaviour |
|---|---|
| `static-diagram` | Renders a pre-defined React component (passed via `diagramKey` prop). No RHF registration. No user input. |
| `info-banner` | Renders a styled info callout div with the `label` text. No RHF registration. No user input. |

---

## Files to Change

| File | Change |
|---|---|
| `src/config/bepConfig.js` | Add 6 new fields to `formFields['pre-appointment'][0].fields` and `formFields['post-appointment'][0].fields` — inserted before existing fields, after a new `section-header` "Introduction" |
| `src/data/emptyBepData.js` | Add `signpostedDocuments: []` (with 6 default rows) and `iso19650Definitions: []` (with 5 default rows) |
| `src/components/steps/FormStepRHF.js` (or field renderer) | Add cases for `static-diagram` and `info-banner` field types |
| New file: `src/components/forms/diagrams/DocumentHierarchyDiagram.jsx` | Static SVG/styled component for the PIR→EIR→BEP chain |
| New file: `src/components/forms/diagrams/PartyInterfaceDiagram.jsx` | Static SVG/styled component for ISO 19650-2 party interfaces |

---

## Out of Scope (this plan)

- No changes to export/PDF template (separate task — once fields are confirmed correct)
- No changes to AI suggestion mappings
- No new steps
- No database schema changes (these are all JSON-stored form fields in the draft)

---

## Open Questions

1. Should `static-diagram` components be purely decorative (rendered in form but excluded from DOCX/PDF export) or should they export as images/SVG?
2. For `iso19650Definitions` — should the "ISO 19650 Definition" column be editable or locked with standard text?
3. For `signpostedDocuments` — should the 6 default rows be locked (user can only fill reference/path/status) or fully deletable/addable?

---

---

# Section 2 — Project Description Gap Remediation Plan

**Date:** 2026-02-24
**Based on:** Benchmark BEP Section 2 analysis (pp. 9–14)
**Constraint:** No new steps — all changes must fit within existing steps (primarily Step 1 and Step 3)

---

## Gap Summary

| # | Benchmark Element | Coverage | Priority |
|---|---|---|---|
| 1 | Project description — physical scope | ✅ Present | — |
| 2 | Project map / site diagram | ❌ Missing | Medium |
| 3 | Key governance table (contract form, governance stage, OPPM ref) | ⚠️ Partial | High |
| 4 | Project purpose statement (strategic driver, capacity deficit, Net Zero) | ⚠️ Partial | Medium |
| 5 | Delivery model diagram (partnership wheel, entity key, integrator role) | ❌ Missing | Low |
| 6 | Scope division table (Partner, scope summary, work packages) | ⚠️ Partial | High |
| 7 | High-level programme (Gantt-style visual) | ⚠️ Partial | Low |
| 8 | Referenced material table (doc number, title, revision) | ✅ Present (Appendices) | — |
| 9 | BEP Exceptions & Exclusions (3 tables with mitigation + risk register refs) | ❌ Missing | **Critical** |

---

## Approach: Extend Existing Steps — No New Steps

- **Step 1** — Add governance table, project purpose field, project map upload, scope division table, and exceptions framework
- **Step 3** — Enhance `taskTeamsBreakdown` columns to include scope summary and work packages (or add a separate scope division table)

---

## New Fields

### 1. Project Purpose Statement
- **Field name:** `projectPurposeStatement`
- **Type:** `textarea` (rows: 4)
- **Label:** `Project Strategic Purpose`
- **Placeholder:** `Describe the strategic driver for the project — e.g. network reinforcement, capacity deficit, regulatory requirement, sustainability target (Net Zero 2035), or client programme objective.`
- **Step:** Step 1
- **Section number:** `1.x` (after project description)
- **Notes:** Distinct from `projectDescription` (which covers physical scope) — this captures *why* the project exists at a strategic/policy level.

---

### 2. Key Governance Table
- **Field name:** `keyGovernanceTable`
- **Type:** `table`
- **Label:** `Project Governance`
- **Columns:** `['Role', 'Name / Organisation', 'Project Reference', 'Governance Stage', 'Contract Form']`
- **Default rows (pre-populated):**
  - Appointing Party
  - Project Executive
  - Project Manager
  - Information Manager
- **Step:** Step 1
- **Section number:** `1.x`
- **Notes:** Replaces/supplements the single `appointingParty` text field. `keyContacts` in Step 2 remains for full team contacts — this table is governance-specific.

---

### 3. Project Map / Site Image
- **Field name:** `projectMapImage`
- **Type:** `image-upload`
- **Label:** `Project Map or Site Diagram`
- **Step:** Step 1
- **Section number:** `1.x`
- **Notes:** Accepts image upload (PNG/JPG/SVG). Uses existing `imageCompression` utility (`src/utils/imageCompression.js`). Stored as base64 in draft JSON. Renders in PDF/DOCX export.

---

### 4. Scope Division Table
- **Field name:** `scopeDivisionTable`
- **Type:** `table`
- **Label:** `Project Scope Division by Partner / Appointed Party`
- **Columns:** `['Partner / Appointed Party', 'Scope Summary', 'Work Packages']`
- **Step:** Step 1 (or Step 3 — TBD)
- **Section number:** `1.x`
- **Notes:** Complements `taskTeamsBreakdown` (Step 3) which is discipline/contact-focused. This table is commercial/scope-focused — who is doing what at a work-package level.

---

### 5. BEP Exceptions and Exclusions *(Critical)*
Three separate table fields. All in Step 1 under a dedicated `section-header` "Exceptions and Exclusions".

#### 5a. ISO Standard Exceptions
- **Field name:** `isoStandardExceptions`
- **Type:** `table`
- **Label:** `ISO Reference Standard Exceptions (Table 2-4)`
- **Columns:** `['ISO Reference', 'Standard Title', 'Clause / Requirement', 'Agreed Change / Exception', 'Mitigation Measure', 'Risk Register Ref']`

#### 5b. Project Standard Exceptions
- **Field name:** `projectStandardExceptions`
- **Type:** `table`
- **Label:** `Project Reference Standard Exceptions (Table 2-5)`
- **Columns:** `['Document Reference', 'Standard / Specification Title', 'Clause / Requirement', 'Agreed Change / Exception', 'Mitigation Measure', 'Risk Register Ref']`

#### 5c. Key Client Documentation List
- **Field name:** `keyClientDocumentation`
- **Type:** `table`
- **Label:** `Key Client / Appointing Party Documentation (Table 2-6)`
- **Columns:** `['Document Reference', 'Title', 'Revision', 'Purpose', 'Risk / Comments']`

- **Step:** Step 1
- **Section number:** `1.x`
- **Notes:** All three tables start empty. No pre-populated rows — content is project-specific. These are the highest-maturity indicator from the benchmark. Risk Register Ref columns link contextually to the Risk Register in Step 6 (`informationRiskRegister`) and Step 13.

---

### 6. Delivery Model Description (Deferred)
- **Field name:** `deliveryModelDescription`
- **Type:** `textarea` (rows: 3) + optional `image-upload` for diagram
- **Label:** `Project Delivery Model`
- **Step:** Step 1 or Step 3
- **Priority:** Low — text description is sufficient for initial coverage; diagram upload is a nice-to-have

---

## Files to Change

| File | Change |
|---|---|
| `src/config/bepConfig.js` | Add new fields to `formFields['post-appointment'][0]` and `formFields['pre-appointment'][0]`: `projectPurposeStatement`, `keyGovernanceTable`, `projectMapImage`, `scopeDivisionTable`, `isoStandardExceptions`, `projectStandardExceptions`, `keyClientDocumentation` |
| `src/data/emptyBepData.js` | Add default empty values for all 7 new fields (`keyGovernanceTable` with 4 pre-populated rows, others as empty arrays/strings) |
| Field renderer | Add `image-upload` field type if not already present (check `src/components/forms/base/`) |

---

## Open Questions

1. Should `scopeDivisionTable` live in Step 1 (alongside project info) or Step 3 (alongside team structure)? Step 1 is more consistent with the benchmark's location; Step 3 is more logically grouped with team data.
2. For the exceptions tables — should the Risk Register Ref column be a free-text field or a dropdown/lookup that cross-references existing risk entries from `informationRiskRegister`?
3. Is `image-upload` already a supported field type in the form renderer, or does it need to be added? (The `imageCompression` utility exists — check if it's already wired to a field type.)
