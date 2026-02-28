# Section 6.2 PIM Delivery Strategy — Benchmark vs BEP Editor

**Last updated:** Plan revised for a **generic BEP** (no appointing-party-specific methods, procedures, or artifacts).

**Scope:** The BEP editor must remain a **generic** BEP tool. It should support the **structure and types of content** implied by benchmark section 6.2 (subsections, tables, diagrams) without prescribing **appointing-party-specific** methods, procedures, or artifacts. Artifacts such as DCAAR forms, "Engineering S5" vs "Non-Engineering S5" review workflows, and client-specific stage-gate processes (e.g. BP500SI) belong to the organization that owns the benchmark document ([BENCHMARK_EDEU-GGP-ZZZZ-XXXXXX-PLN-IM-000001-P04.pdf](zz_BEP/BENCHMARK_EDEU-GGP-ZZZZ-XXXXXX-PLN-IM-000001-P04.pdf)); the editor should allow delivery teams to describe their **own** assurance and review approach in equivalent, generic terms.

---

## Benchmark Section 6 TOC (structure reference)

From [benchmarkBEP.MD](benchmarkBEP.MD). Section 6 = "PIM And AIM Delivery Strategy" (pp. 37–45).

| Ref | Title | Page |
|-----|--------|------|
| 6.1 | Overview of Information Requirements and Delivery Model | 37 |
| **6.2** | **Project Information Model delivery strategy** | **37** |
| 6.2.1 | Common Data Environment – Client | 37 |
| 6.2.1.1 | Common Data Environment – Partners | 38 |
| 6.2.2 | Distributed information model | 39 |
| 6.2.3 | PIM Exchange | 39 |
| 6.2.4 | Information model Assurance | 40 |
| 6.2.4.1 | Engineering deliverable (S5) in Stage F *(client-specific; omit as prescribed)* | 40 |
| 6.2.4.2 | Non-Engineering (S5) in Stage F *(client-specific; omit as prescribed)* | 40 |
| 6.2.5 | Stage-based delivery | 40 |
| 6.2.5.1 | Security on Exchanges | 42 |
| 6.2.6 | Information Delivery Milestones | 42 |
| 6.3 | Asset Information Model Delivery Strategy | 43 |

---

## Reference document structure (benchmark — for structure only)

Section **6.2** "Project Information Model delivery strategy" in the benchmark PDF includes:

| Ref | Title | Benchmark content (structure) | Generic equivalent in editor |
|-----|--------|-------------------------------|------------------------------|
| 6.2.1 | Common Data Environment – Client | Table: client CDE resources | Generic: "Client CDE" table (platform, purpose, info types, owner) |
| 6.2.1.1 | Common Data Environment – Partners | Table: partners × platforms | Generic: "Partner CDE" table (partner, platforms, purpose) |
| 6.2.2 | Distributed information model | Diagram: WIP → Shared → Published | Generic: same diagram concept (no client-specific entities) |
| 6.2.3 | PIM Exchange | Table: owner, info type, permitted status, retention | Generic: CDE environment summary table with same column types |
| 6.2.4 | Information model Assurance | Pipeline (WAP/DID → TIDP → … → DCAAR → Assurance) | **Generic:** Narrative/diagram for "assurance pipeline" — user defines steps (no DCAAR or client forms) |
| 6.2.4.1 / 6.2.4.2 | Engineering S5 / Non-Engineering S5 | Client-specific: DCAAR, Function Lead workflow | **Omit as prescribed structure.** Optional single narrative/table for "review and approval workflows" (user-defined) |
| 6.2.5 | Stage-based delivery | Figure + table: stage-gate process, stage-by-stage assurance | Generic: optional diagram + table (stages, assurance approach) — no BP500SI or client process names |
| 6.2.5.1 | Security on Exchanges | Table: security classifications (PA/IU/CI/SC); 3-tier framework | Generic: table (classification, description, controls) + narrative for control framework — user defines classifications |
| 6.2.6 | Information Delivery Milestones | Table: milestones, gates, programme version | Generic: extend milestones table with optional gate/programme version columns |

---

## Current editor mapping

- **Step 6** "Information Delivery Planning" ([bepFormFields.js](src/config/bepFormFields.js) shared step index 5): `keyMilestones`, `tidpRequirements`, `tidpDescription`, `midpDescription`, `informationDeliverablesMatrix`, `informationManagementMatrix`, `mobilisationPlan`, `teamCapabilitySummary`, `informationRiskRegister`, `taskTeamExchange`, `modelReferencing3d`. No 6.2.1–6.2.5 subsections.
- **Step 7** "Common Data Environment": `cdeStrategy`, `cdePlatforms`, `workflowStates`, etc. Single CDE matrix; no Client vs Partner CDE split. No PIM Exchange table (owner, permitted status, retention).
- **Step 11** "Information Security and Privacy": generic data classification and access; no "Security on Exchanges" table or 3-tier framework.
- **Export:** [htmlTemplateService.js](server/services/htmlTemplateService.js) (PDF), [docxGenerator](src/services/) / [htmlToDocx.js](src/services/htmlToDocx.js) (DOCX). [emptyBepData.js](src/data/emptyBepData.js), [bepValidationSchemas.js](src/schemas/bepValidationSchemas.js) for new fields.

---

## Principles for a generic BEP editor

1. **Structure, not branding:** Use the benchmark to identify **subsection headings**, **table column types**, and **diagram concepts** (e.g. "assurance pipeline", "distributed model", "security on exchanges"). Do not hard-code client-specific names (DCAAR, BP500SI, PA/IU/CI/SC as the only option).
2. **User-defined procedures:** Where the benchmark has appointing-party procedures (e.g. Engineering vs Non-Engineering S5, DCAAR form), the editor provides **generic** placeholders: e.g. "Information model assurance pipeline" (narrative or diagram), "Review and approval workflows" (narrative or simple table). The delivery team fills in their own or the appointing party’s process.
3. **Optional classifications:** Security on exchanges can be a table with user-defined rows; offer example classifications in help/placeholder text only, not as fixed schema.
4. **No bespoke forms:** The editor does not include or reference specific form types (e.g. DCAAR) unless they are added later as user-uploaded appendices or generic "assurance evidence" references.

---

## Identified gaps (generic framing)

| # | Benchmark element | Generic editor equivalent | Gap |
|---|-------------------|---------------------------|-----|
| 1 | 6.2.1 / 6.2.1.1 Client & Partner CDE tables | Two optional tables: Client CDE resources; Partner CDE resources (generic column names) | Missing; add without client-specific platform names |
| 2 | 6.2.2 Distributed information model diagram | Optional diagram: WIP → Shared → Published (generic) | Missing |
| 3 | 6.2.3 PIM Exchange table | Optional table: Owner/Environment, Information Type, Permitted Status, Retention | Missing; add with generic columns |
| 4 | 6.2.4 Information model Assurance | **Generic** assurance pipeline (narrative or diagram) — user describes steps (e.g. TIDP → federation → review → approval); no DCAAR or client process names | Missing; add as narrative/diagram only |
| 5 | 6.2.4.1 / 6.2.4.2 Engineering / Non-Engineering S5 | **Do not add** as separate prescribed subsections. Optional single field: "Review and approval workflows" (textarea or simple table) for delivery team to describe their/client process in their own terms | No prescribed S5 split or DCAAR; optional generic workflows field only |
| 6 | 6.2.5 Stage-based delivery | Optional stage-gate diagram (generic) + table (Stage, Assurance approach, Notes) — no BP500SI or client process names | Missing; add as generic stage/assurance table + optional diagram |
| 7 | 6.2.5.1 Security on Exchanges | Optional table (Classification, Description, Controls) + narrative for control framework; classifications user-defined (examples in help only) | Missing; add generic security-on-exchange table + narrative |
| 8 | 6.2.6 Information Delivery Milestones | Extend existing milestones table with optional Gate, Programme version | Add optional columns only |

---

## Improvement plan (generic BEP)

### 1. Subsection structure for 6.2

- Add optional subsection "6.2 Project Information Model delivery strategy" in the editor (e.g. in [bepFormFields.js](src/config/bepFormFields.js)) with **generic** child fields. Export (PDF/DOCX) can render 6.2.1–6.2.6-style headings without prescribing client methods.

### 2. Client CDE and Partner CDE (6.2.1, 6.2.1.1) — generic

- Add two optional table fields: `clientCdeResources` (e.g. Platform/Resource, Purpose, Information Types, Owner, Notes) and `partnerCdeResources` (Partner, Platform(s), Purpose, Information Types, Notes). No fixed list of platforms (ACC, SharePoint, etc.); user fills in. Export under generic headings "Common Data Environment – Client" / "Common Data Environment – Partners".

### 3. Distributed information model diagram (6.2.2) — generic

- Add optional diagram field for WIP → Shared → Published across entities (generic labels). No client-specific entity names. Reuse or extend existing diagram components; export via existing image capture.

### 4. PIM Exchange (6.2.3) — generic

- Add optional table `pimExchangeEnvironments` (e.g. Owner/Environment, Information Type, Permitted Status, Retention). Optional short narrative for WIP/Shared/Published definitions (placeholder text only).

### 5. Information model Assurance (6.2.4) — generic only

- Add **generic** assurance pipeline field: narrative (textarea) and/or optional diagram. Placeholder/help text: e.g. "Describe the assurance pipeline (e.g. from information delivery plans through federation, review, and approval)." **Do not** reference DCAAR, WAP/DID, or client-specific steps as required structure. User defines their own or their appointing party’s process.
- **Do not add** separate fields for "Engineering S5" and "Non-Engineering S5" as in the benchmark. Optionally add one **generic** field: "Review and approval workflows" (textarea or simple table with user-defined columns) so teams can describe different workflow types in their own terms.

### 6. Stage-based delivery (6.2.5) — generic

- Add optional **generic** stage-gate / stage-based assurance table (e.g. Stage, Assurance Approach, Notes). Optional narrative or diagram for "stage-based delivery process" — no BP500SI or client process names. Help text can suggest "e.g. design stages, gate criteria" without prescribing a standard.

### 7. Security on Exchanges (6.2.5.1) — generic

- Add optional table `securityOnExchanges` with user-defined rows; columns e.g. Classification, Description, Controls. Optional narrative for "security control framework" (e.g. local WIP vs CDE vs published). **Do not** hard-code PA/IU/CI/SC; use as example classifications in help/placeholder only.

### 8. Information Delivery Milestones (6.2.6)

- Extend existing `keyMilestones` with optional columns: Gate (Y/N or text), Programme version. Keep existing columns; new ones optional.

### 9. Export and data

- PDF/DOCX: render new tables and subsection headings with **generic** labels (no client-specific form or process names). emptyBepData.js: defaults for new fields. bepValidationSchemas.js: optional schemas for new tables.

### 10. Implementation order

1. **Quick wins:** PIM Exchange table (6.2.3); Security on Exchanges table + narrative (6.2.5.1); **generic** assurance pipeline narrative (6.2.4); optional generic "Review and approval workflows" (no S5/DCAAR split).
2. **CDE split:** Client CDE and Partner CDE tables (6.2.1, 6.2.1.1).
3. **Stage-based delivery:** Generic stage/assurance table + optional diagram (6.2.5).
4. **Diagrams:** Distributed information model (6.2.2); optional assurance pipeline diagram (generic).
5. **Milestones:** Optional gate and programme version columns (6.2.6).
6. **Export and tests:** Update HTML/DOCX; run `npm test`.

---

## Summary

- **Benchmark:** Used only for **section structure and content types** (tables, diagrams, subsections). It is **not** the source of prescribed procedures or artifacts.
- **Generic BEP:** No DCAAR, no Engineering/Non-Engineering S5 as fixed structure, no client-specific stage-gate or security classification names. The editor provides **generic** fields and tables so any delivery team can describe their (or their appointing party’s) PIM delivery strategy in their own terms.
- **Optional generic fields:** Assurance pipeline (narrative/diagram), review/approval workflows (single generic field), stage-based assurance table, security-on-exchanges table with user-defined classifications, Client/Partner CDE tables, PIM Exchange table, distributed model diagram, and extended milestones columns.
