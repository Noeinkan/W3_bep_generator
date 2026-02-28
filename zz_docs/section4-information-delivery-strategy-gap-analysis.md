# Section 4 — Information Delivery Strategy: Benchmark vs BEP Editor

## 1. Benchmark content (from BENCHMARK_EDEU-GGP PDF & benchmarkBEP.MD)

Section 4 in the benchmark BEP (pp. 26–33) is titled **Information Delivery Strategy** and includes:

| Ref | Title | Benchmark content |
|-----|--------|-------------------|
| **4.1** | Level of Information Need | Figure 4-1: Geometric (LOD), Non-Geometric (Uniclass, LOI, Attributes, Lifecycle), Documentation (Specs, Certs, Reports) |
| 4.1.1 | Geometric Information | Table 4-1 (LOD 2 with purpose), Figure 4-2 (visual), NBS banding reference |
| 4.1.2 | Non-Geometric Information | Table 4-2 (LOI 2 with purpose), Uniclass 2015, NBS LOI link |
| **4.2** | Information Delivery Plan | |
| 4.2.1 | High-level Responsibility Matrix | Tables 4-3, 4-4, 4-5 **per package** (e.g. Sub-50, 51, 52) — PIM elements × Stages E/F/G × responsible organisations |
| 4.2.2 | Detailed Responsibility Matrix | Reference to detailed matrix |
| 4.2.3 | Task Information delivery plan(s) | **Table 4-6**: 15 TIDPs with **package**, **organisation**, **file name**, **description** |
| 4.2.4 | Master Information Delivery Plan | MIDP reference |
| **4.3** | Client and Project IM & Digital Objectives | **Table 4-7**: 8 strategic objectives with **digital actions** and **responses** (CDE, coordination, TIDP/MIDP, clash, quantities, H&S, field use, analysis); **Table 4-8**: Appointing Party IM goals |
| 4.3.1 | Approach to facilitating Appointing Party's IM goals | Placeholder / narrative |
| 4.4 | Mobilisation plan | Reference |
| 4.5 | Delivery Team Capability & Capacity Summary | Reference |
| 4.6 | Training requirements | **Table 4-9**: Partner WIP training (3 modules — duration, audience, delivery dates); **Table 4-10**: Client systems training (8 modules, same structure) |
| 4.7 | Delivery Team's information risk register | Reference |

**Benchmark quality note:** Separate high-level responsibility matrices per package, exhaustive TIDP register (15 TIDPs), and dual training plan tables (partner WIP + client systems) show strong planning maturity.

---

## 2. What the BEP editor currently has

### 2.1 Level of Information Need (our Step 5 — LOIN)

| Our field | Type | Benchmark equivalent |
|-----------|------|----------------------|
| `informationPurposes` | checkbox | Partial (purposes) |
| `geometricalInfo` | textarea | 4.1.1 — but benchmark has **Table 4-1 (LOD + purpose)** and figure |
| `alphanumericalInfo` | textarea | 4.1.2 — benchmark has **Table 4-2 (LOI + purpose)** and Uniclass/NBS |
| `documentationInfo` | textarea | Documentation branch of LOIN |
| `informationFormats` | checkbox (fileFormats) | Formats |
| `projectInformationRequirements` | textarea | PIR narrative |

**Gap:** No **structured LOD table** (level + purpose) or **LOI table**; no NBS/Uniclass references. All geometric/non-geometric are free text.

### 2.2 Information Delivery Planning (our Step 6)

| Our field | Type | Benchmark equivalent |
|-----------|------|----------------------|
| `keyMilestones` | milestones-table | 4.2.4 / 6.2.6 style milestones ✓ |
| `tidpRequirements` | tidp-reference | 4.2.3 — link to TIDPs ✓ |
| `tidpDescription` | textarea | Notes ✓ |
| `midpDescription` | textarea | 4.2.4 ✓ |
| `informationDeliverablesMatrix` | deliverables-matrix | 4.2.2 detailed matrix ✓ |
| `informationManagementMatrix` | im-activities-matrix | Annex A RACI ✓ |
| `mobilisationPlan` | textarea | 4.4 ✓ |
| `teamCapabilitySummary` | textarea | 4.5 ✓ |
| `informationRiskRegister` | table (Risk, Impact, Probability, Mitigation) | 4.7 ✓ |
| `taskTeamExchange` | textarea | Exchange protocols ✓ |
| `modelReferencing3d` | textarea | Model referencing ✓ |

**What we already have (Table 4-6 style):** A **TIDP register table is already rendered in the BEP**. Project TIDPs are passed into the preview and all exports (PDF via `bepFormatter` / `htmlTemplateService`, DOCX via `docxGenerator`). The Information Delivery Planning section shows one row per TIDP with columns: Task Team, Discipline, Team Leader, Reference (and in some outputs Deliverables). So we **do** have the TIDP list in the BEP; it is auto-populated from project TIDPs, not stored as a separate BEP form field.

**Gaps:**

- **High-level responsibility matrix per package** (4.2.1): Benchmark has **multiple** high-level matrices (e.g. one per substation/package) mapping PIM elements × stages × organisations. We have one deliverables matrix and one IM-activities matrix; we do not have a “high-level, per-package” matrix in the BEP form.
- **Optional column alignment with Table 4-6**: Benchmark Table 4-6 uses columns *Package*, *Organisation*, *File name*, *Description*. Our TIDP table uses *Task Team*, *Discipline*, *Team Leader*, *Reference* (and *Deliverables* in one place). If we add/capture package and file name on TIDPs, we could optionally render the same column set as the benchmark.
- **Client and Project IM & Digital Objectives** (4.3): No field for **Table 4-7** (strategic objectives + digital actions + responses) or **Table 4-8** (Appointing Party IM goals).

### 2.3 Training (our Step 12)

| Our field | Type | Benchmark equivalent |
|-----------|------|----------------------|
| `bimCompetencyLevels` | textarea | Competency narrative |
| `trainingRequirements` | textarea | 4.6 — but benchmark has **structured tables** |
| `certificationNeeds` | textarea | Certifications |
| `projectSpecificTraining` | textarea | Project-specific |

**Gap:** No **structured training tables**: (1) Partner WIP training — module, duration, audience, delivery date; (2) Client systems training — same columns. Benchmark uses Tables 4-9 and 4-10.

---

## 3. Summary: what’s missing vs benchmark Section 4

| # | Missing element | Benchmark ref | Priority |
|---|------------------|---------------|----------|
| 1 | **Structured LOD table** (level + purpose) in LOIN | 4.1.1 Table 4-1 | High |
| 2 | **Structured LOI / non-geometric table** (level + purpose, Uniclass) | 4.1.2 Table 4-2 | High |
| 3 | **High-level responsibility matrix per package** (optional multiple matrices) | 4.2.1 Tables 4-3–4-5 | Medium |
| — | ~~TIDP register table in BEP~~ | 4.2.3 Table 4-6 | **Already have** — table is rendered from project TIDPs in preview/PDF/DOCX. Optional: align columns with benchmark (Package, Organisation, File name, Description) if TIDP model supports. |
| 4 | **Client and Project IM & Digital Objectives** table (objective, digital action, response) | 4.3 Table 4-7 | High |
| 5 | **Appointing Party IM goals** (table or text) | 4.3.1 Table 4-8 | Medium |
| 6 | **Structured training tables**: Partner WIP + Client systems (module, duration, audience, delivery date) | 4.6 Tables 4-9, 4-10 | Medium |

---

## 4. Recommendations to make the BEP editor more complete

### 4.1 Level of Information Need (Step 5)

- **Add optional LOD table**  
  - Columns e.g.: *LOD Level*, *Description/Purpose*, *Stage/Phase*, *Notes*.  
  - Kept optional so existing textarea `geometricalInfo` remains valid; table can supplement or replace it for benchmark-style BEPs.

- **Add optional LOI / non-geometric table**  
  - Columns e.g.: *LOI Level*, *Attribute/Uniclass*, *Purpose*, *Stage/Phase*, *Notes*.  
  - Same idea: optional, can sit alongside `alphanumericalInfo`.

- **Optional NBS/Uniclass reference**  
  - Short text field or checkbox set: “NBS banding / Uniclass 2015 referenced” to align with benchmark 4.1.1/4.1.2.

### 4.2 Information Delivery Planning (Step 6)

- **TIDP register:** Already present — the BEP preview and exports (PDF, DOCX) render a TIDP table from project TIDPs. No new field needed. Optionally, if the TIDP model gains *package* and *file name* (or equivalent), the rendered table columns could be aligned with benchmark Table 4-6 (Package, Organisation, File name, Description).

- **Client and Project IM & Digital Objectives**  
  - New table field (e.g. `imDigitalObjectives`): columns **Objective**, **Digital action**, **Response** (or similar).  
  - Optional pre-filled rows (e.g. CDE, coordination, TIDP/MIDP, clash detection, quantities, H&S, field use, analysis) to mirror Table 4-7.

- **Appointing Party IM goals**  
  - New field: `appointingPartyImGoals` — table (e.g. **Priority**, **Goal**, **Delivery team response**) or textarea, to cover 4.3.1 / Table 4-8.

- **High-level responsibility matrix per package**  
  - Option A: Allow **multiple** “high-level” matrices in step 6 (e.g. one per package name), each with rows = PIM elements / stages, columns = organisations.  
  - Option B: Single matrix with an extra **Package** column so one table can represent multiple packages.  
  - Align with existing responsibility-matrix UX (e.g. matrix selector, IDRM) so we don’t duplicate logic.

### 4.3 Training (Step 12)

- **Structured training tables**  
  - **Partner WIP training** (e.g. `partnerWipTraining`): table columns **Module**, **Duration**, **Audience**, **Delivery date**.  
  - **Client systems training** (e.g. `clientSystemsTraining`): same structure.  
  - Keep existing `trainingRequirements` / `projectSpecificTraining` textareas for narrative; tables give benchmark-style Tables 4-9 and 4-10.

### 4.4 Export and PDF/DOCX

- Ensure **htmlTemplateService** and **docxGenerator** render:
  - New LOIN tables (LOD, LOI),
  - IM & Digital Objectives table,
  - Appointing Party IM goals,
  - High-level matrix (per package or with Package column),
  - Partner WIP and Client systems training tables,  
  so the exported BEP matches Section 4 structure when users fill them.

### 4.5 Data and validation

- **emptyBepData.js**: add default keys for new fields (empty arrays/tables or null).
- **bepValidationSchemas.js**: add optional schema for new tables (array of objects with required column keys).
- **bepFormFields.js**: add field definitions under Step 5, Step 6, and Step 12 as above.

---

## 5. Implementation order (suggested)

1. **Quick wins (high value, contained)**  
   - IM & Digital Objectives table in Step 6.  
   - Appointing Party IM goals (table or textarea) in Step 6.

2. **LOIN alignment**  
   - LOD table and LOI table in Step 5; optional NBS/Uniclass reference.

3. **Training**  
   - Partner WIP and Client systems training tables in Step 12.

4. **Advanced**  
   - High-level responsibility matrix per package (design with existing matrix/IDRM in mind).

5. **Export and tests**  
   - Update PDF/DOCX and run `npm test` after each change set.

This order keeps Section 4 coverage improvements incremental and avoids big refactors while moving the editor toward benchmark-level “Information Delivery Strategy” completeness.
