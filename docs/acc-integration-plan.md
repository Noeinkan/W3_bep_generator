# ACC Integration Plan (Phase 1 MVP)

## Scope (Locked)
- Export-focused ACC bridge only (no APS OAuth upload yet)
- Local-first security model
- Document workflows only in this phase
- Mapping model: **1 local project -> 1 ACC project**

## Objective
Deliver a practical Autodesk Construction Cloud-compatible workflow without compromising privacy:
- Generate ACC-ready folder-structured ZIP packages
- Include ISO 19650 metadata manifest
- Keep data and secrets local

---

## What has been implemented

### 1) ACC-Compatible Export Package
- New backend endpoint: `POST /api/export/acc/package`
- Generates ISO 19650-style folder structure:
  - `Appointment/`
  - `Work In Progress/`
  - `Shared/`
  - `Published/`
  - `Archive/`
- Places generated outputs in subfolders (e.g. BEP PDF in `Shared/Planning/`, optional TIDP/MIDP/matrix files)
- Creates `manifest.json` with package metadata
- Returns downloadable `.zip` for manual upload to ACC

### 2) Export Service Extensions
- Added helpers for:
  - ACC folder scaffold
  - Filename sanitization
  - Manifest generation
  - Archive creation
- Archive creation is cross-platform best effort:
  - Windows: PowerShell `Compress-Archive`
  - Unix-like: `zip`
  - Clear error if no archive tool is available

### 3) Project-Level ACC Linkage
- Extended `projects` schema with:
  - `acc_hub_id`
  - `acc_project_id`
  - `acc_default_folder`
- Added safe migrations for existing databases
- Updated create/update project APIs and service logic

### 4) Encrypted Local Secret Foundation
- Added `acc_secrets` table in SQLite
- Added `encryptedSecretService` (AES-256-GCM)
- Supports:
  - `setSecret(projectId, secretType, plainValue)`
  - `getSecret(projectId, secretType)`
  - `deleteSecret(projectId, secretType)`
- Uses `LOCAL_ENCRYPTION_KEY` when provided (local dev fallback exists)

### 5) Frontend Integration
- Added API method: `exportACCFolderPackage(payload)`
- Added export UI option: **ACC Package**
- Wired BEP preview/export flow to call backend ACC package endpoint

### 6) Documentation
- README updated to include ACC package export endpoint and feature note

---

## Phase 1 Acceptance Criteria
- User can export an ACC-ready ZIP package from the app
- Package contains expected ISO 19650 container folders
- Package includes `manifest.json`
- Existing export flows (PDF/DOCX/XLSX) remain unaffected
- Project records can store ACC linkage values
- Secrets can be stored encrypted in local SQLite

---

## Phase 2 (Next) - APS API Upload
Planned follow-up work:
1. Autodesk OAuth connection flow (local app)
2. Token lifecycle management using encrypted local storage
3. ACC hub/project/folder discovery endpoints
4. Direct upload of BEP/TIDP/MIDP artifacts via APS Data Management API
5. Optional project picker and upload target UX

---

## Security Notes
- Phase 1 does **not** send data to external AI or cloud services for ACC integration
- Package generation is local
- Secret storage is local (SQLite) and encrypted at rest
- For production, set a strong `LOCAL_ENCRYPTION_KEY`

---

## File Location
This plan is saved at:
- `acc-integration-plan.md`
