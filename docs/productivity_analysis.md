# BEP Suite — Product Analysis & Strategic Assessment

**Date:** February 2026

---

## What the Industry Actually Needs

BIM Execution Plans are a **universal pain point** in construction. Here's what BIM managers deal with today:

| Problem | Current industry reality |
|---------|------------------------|
| **BEPs are written in Word** | 90%+ of BEPs are copy-pasted Word documents from the last project, edited by hand. There is no dominant "BEP tool" in the market. |
| **EIRs arrive as PDFs** | Appointing parties send 30–80 page PDFs. The supply chain must manually read them and respond in the BEP. Hours of work per bid. |
| **TIDP/MIDP is Excel hell** | Teams manage TIDPs in spreadsheets. Consolidating into an MIDP is a manual, error-prone, multi-day task. |
| **No single source of truth** | BEP lives in one place, TIDP in another, responsibility matrix in a third. Keeping them in sync is manual. |
| **Compliance is a checkbox** | ISO 19650 compliance is self-assessed. There's no tooling that validates completeness against the standard. |
| **AI is not used here yet** | As of 2026, no major BIM planning tool offers AI-assisted BEP writing or EIR analysis. This is a genuine white space. |

### Competitors

The competitors in this space are essentially:

- **Plannerly** — web-based BEP tool, template-driven, no AI, subscription model
- **Asite BEP module** — part of a larger CDE platform, enterprise-only
- **BIM Track / BIMcollab** — issue tracking, not BEP authoring
- **Word/Excel templates** from UK BIM Framework — free but manual

---

## What This App Does Well (Genuinely)

**This is not a toy.** Here is what's actually impressive:

### 1. Domain Depth Is Exceptional
14 wizard steps covering the full ISO 19650-2 BEP structure, with 100+ fields including custom types like CDE diagrams, federation strategy builders, naming convention generators, mind maps, and org charts. Most commercial tools don't go this deep.

### 2. The TIDP/MIDP System Is Real
Auto-MIDP generation from TIDPs, risk register auto-detection, resource planning by discipline, evolution snapshots — this isn't a wrapper around CRUD, it's genuine information management logic (~1,700 lines across the two services).

### 3. AI Is a Legitimate Differentiator
EIR document upload → structured JSON extraction → field-specific suggestions is a workflow no competitor offers. The guided Q&A authoring mode is smart UX. Running locally via Ollama means firms can use it without sending confidential bid documents to OpenAI.

### 4. The Frontend Is Production-Caliber
95+ well-structured components, config-driven form rendering, TipTap rich text, interactive node diagrams, command palette, onboarding — this feels like a real product, not a prototype.

### 5. Responsibility Matrix with TIDP Sync
Bridges a real gap. The ability to define IM activities and deliverables, then auto-populate from TIDPs, solves a coordination problem that's currently done in spreadsheets.

---

## What's Honestly Holding It Back

### Critical Gaps (Would Block Real Adoption)

| Issue | Impact | Reality check |
|-------|--------|--------------|
| **No authentication** | **Blocker** | A BIM manager cannot use a tool that has hardcoded credentials and stores passwords in plaintext localStorage. This is the #1 thing preventing real-world deployment. The frontend UI exists; the backend is 100% missing. |
| **Single-user only** | **Blocker** | BEPs are collaborative documents. A BIM Coordinator writes sections, a BIM Manager reviews, a Project Director approves. Without user roles and multi-user support, this remains a solo tool — which removes half the value proposition. |
| **No project management** | **Blocker** | There's no `projects` table. `projectId` is a free-text string. A firm working on 5 projects simultaneously has no dashboard, no project switching, no organised workspace. |
| **Test coverage: 5 assertions** | **Serious** | For a codebase this complex, 5 test assertions is effectively zero coverage. No firm will trust their bid documents to untested export logic. Any refactoring is high-risk. |
| **DOCX image export disabled** | **Serious** | The most visually impressive features (CDE diagrams, mind maps, org charts, federation strategy) are rendered as plain text in the exported document. The export is the deliverable — if it looks basic, the 30 minutes spent in the app feel wasted. |

### Architecture Concerns

| Issue | Details |
|-------|---------|
| **Schema mismatch** | The `midps` table stores `aggregatedData` in a column called `modelUse`, `deliverySchedule` in `discipline`, `includedTIDPs` in `responsible`. Any new developer will be confused. |
| **Stubbed core features** | Critical path analysis returns `[]`. Circular dependency detection returns `false`. Evolution history generates **fake data** by subtracting from current values. These are presented as features in the UI. |
| **Console.log pollution** | 50+ emoji-decorated console.logs ship to production. Every API request is logged with `📤` / `📸` prefixes. This screams "prototype" to anyone who opens DevTools. |
| **SQLite ceiling** | SQLite is fine for a single-user desktop tool. The moment you want multi-user, concurrent writes, or server deployment, you need PostgreSQL/MySQL. The synchronous `better-sqlite3` pattern makes migration harder. |

---

## How Useful Is It Today?

**For a solo BIM professional writing BEPs: 7/10.** It's genuinely faster than Word. The wizard guides you through ISO 19650 sections, AI helps write content, and the DOCX export (minus images) produces a professional document. The TIDP/MIDP system works for managing your own deliverables.

**For a team or firm: 3/10.** No auth, no collaboration, no roles, no project management. You can't share it, you can't deploy it, you can't trust it with sensitive bid data.

**Compared to doing it in Word/Excel: already better** for the solo use case, which is noteworthy.

---

## How Useful Could It Be?

**With the right changes: potentially a 9/10 product in a market that has no dominant player.**

Here's the reality: there is no good BEP tool. The industry is using Word templates and Excel spreadsheets for a process that ISO 19650 mandates on every BIM project globally. The total addressable market is every architecture, engineering, and construction firm doing BIM work. That's tens of thousands of firms.

### The Changes That Would Matter Most (Priority Order)

| Priority | Change | Why it matters |
|----------|--------|---------------|
| **1** | **Authentication + user roles** | Table stakes. BIM Manager, BIM Coordinator, Architect, Client (read-only). ~2 weeks of work, plan already documented. |
| **2** | **Projects as first-class entities** | A `projects` table with dashboard, switching, and scoped data. Everything else hangs off this. |
| **3** | **Fix DOCX export (enable images)** | The export IS the product for 80% of users. If diagrams don't appear, the tool fails at its primary job. |
| **4** | **Test coverage to 60%+** | Export services, TIDP/MIDP aggregation, validation, AI responses. Without this, you can't iterate safely. |
| **5** | **Complete the stubs** | Real critical path (topological sort on dependency graph). Real circular dependency detection. Real evolution history from snapshots. Don't fake data. |
| **6** | **PostgreSQL migration** | Required before multi-user deployment. Use Knex or Prisma for proper migrations. |
| **7** | **Client/appointing party portal** | Read-only view where clients review and approve BEPs. This alone is a selling point — "Share your BEP with the client in one click." |
| **8** | **CDE platform integrations** | API connections to Autodesk BIM 360/ACC, Trimble Connect, Aconex. Even if it's just "export to CDE" — the integration story matters for enterprise sales. |

---

## The AI Advantage Is Real but Fragile

The AI features are genuinely ahead of the market. **No competitor offers EIR-to-BEP AI analysis.** But this advantage has a shelf life — the big platforms (Autodesk, Trimble, Nemetschek) will add AI features to their existing tools. The window is probably 12–18 months.

The strategic play would be:

- **Make EIR analysis the hero feature** in marketing — "Upload your EIR, get a draft BEP in 5 minutes"
- **Fine-tune on real BEP/EIR data** to improve quality beyond generic llama3.2 output
- **Support cloud LLMs as an option** (OpenAI, Anthropic) alongside local Ollama — some firms won't want to run models locally

---

## Scorecard

| Area | Score | Notes |
|------|-------|-------|
| Frontend completeness | **9/10** | Exceptional component depth and variety |
| Form wizard | **8/10** | 14 steps, 100+ fields, pre/post variants, custom types |
| Export | **7/10** | Multi-format but DOCX image rendering disabled |
| TIDP/MIDP | **8/10** | Real system with aggregation, risk, resources — but stubbed CPM |
| Database | **6/10** | Functional but schema-mismatched, no users table, SQLite-only |
| Test coverage | **2/10** | 5 assertions total — critically undertested |
| Error handling | **6/10** | Exists but inconsistent across routes |
| AI integration | **7/10** | Well-designed UX, but hardcoded URL and duplicate implementations |
| Real-world readiness | **4/10** | No auth, no multi-user, no CDE/IFC integration |
| Code quality | **6/10** | Good architecture, but console.log pollution, stubs, disabled features |

---

## Bottom Line

This app has genuine domain depth that solves a real problem in an underserved market. The frontend and AI integration are well beyond MVP quality. But it's currently a **very polished single-user prototype** that needs auth, multi-user support, project management, and reliable exports to become a product that firms would actually pay for and depend on.

The bones are excellent — the gap is in the "enterprise readiness" layer, not in the core domain logic.
