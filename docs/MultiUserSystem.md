Multi-User Collaboration System Implementation Plan
Context
The BEP Generator is currently single-user only—each project has one owner who creates, edits, and exports BEPs. However, BEPs are inherently collaborative documents: a BIM Coordinator writes sections, a BIM Manager reviews, and a Project Director approves. Without multi-user support and role-based access control, the tool cannot support real-world BEP workflows.

Current limitations identified:

No collaboration tables or role system in database
Security vulnerability: Routes accept userId from query params instead of authenticated req.user
Projects linked to single user_id with no way to share
No permission checks on project/draft operations
No approval workflow for draft review/approval
User requirements:

Roles: Owner (full access), Editor (can edit), Viewer (read-only)
Email invitations: Invite users via email with accept/decline flow
Approval workflows: Drafts move through draft → pending review → approved/rejected states
Ownership transfer: Current owner can transfer to another member
This plan implements a complete collaboration system with RBAC, invitations, approval workflows, and fixes existing security gaps.

Database Schema Changes
New Tables (add to server/db/database.js)
Five new tables will be created to support collaboration:

project_members - Links users to projects with roles (owner/editor/viewer)
project_invitations - Manages email invitations with tokens and expiry
draft_approvals - Tracks approval requests for drafts
draft_version_history - Snapshots draft data when submitted/approved
project_activity_log - Audit trail for all collaboration actions
Key design decisions:

Foreign keys with ON DELETE CASCADE for data integrity
Unique constraint on (project_id, user_id) in project_members (one membership per user per project)
Invitation tokens use crypto.randomBytes for security
Approval status: pending → approved/rejected (immutable once reviewed)
Schema Modifications
drafts table - Add approval workflow columns:


ALTER TABLE drafts ADD COLUMN approval_status TEXT DEFAULT 'draft'
  CHECK(approval_status IN ('draft', 'pending_review', 'approved', 'rejected'));
ALTER TABLE drafts ADD COLUMN approved_by TEXT;
ALTER TABLE drafts ADD COLUMN approved_at TEXT;
ALTER TABLE drafts ADD COLUMN last_modified_by TEXT;
Migration Strategy
Script: server/scripts/migrate-add-collaboration.js

Run once to populate project_members with existing project creators as owners
Ensures backward compatibility (existing projects.user_id preserved)
Safe rollback: migrations are additive, no data loss
Backend Implementation
1. New Service Layer
File: server/services/collaborationService.js

Centralized business logic for:

Members: getProjectMembers(), removeMember(), updateMemberRole()
Invitations: createInvitation(), acceptInvitation(), declineInvitation(), cancelInvitation()
Ownership: transferOwnership() (demote current owner to editor, promote new owner)
Approvals: submitForReview(), approveDraft(), rejectDraft()
Activity: logActivity(), getProjectActivity()
Key method: getUserProjectMembership(projectId, userId) - Used by middleware to check access

Email integration: Reuses existing emailService.sendMail() for invitation emails

2. New Authorization Middleware
File: server/middleware/projectAuthMiddleware.js

Two middleware functions:

requireProjectAccess(minRole) - Checks user has at least viewer/editor/owner role
requireProjectRole(role) - Checks user has exact role (e.g., 'owner' only)
Pattern:


router.delete('/:projectId/members/:id',
  authenticateToken,           // (existing) verify JWT, attach req.user
  requireProjectRole('owner'), // (new) verify user is owner of project
  (req, res) => { ... }
);
Attaches req.projectMembership to request for downstream use.

3. New API Routes
File: server/routes/collaboration.js

Member management (/api/collaboration/projects/:projectId/...):

GET /members - List members (viewer+)
DELETE /members/:memberId - Remove member (owner only)
PUT /members/:memberId/role - Change role (owner only)
Invitations (/api/collaboration/...):

POST /projects/:projectId/invitations - Send invite (owner only)
GET /projects/:projectId/invitations - List invites (owner only)
DELETE /projects/:projectId/invitations/:id - Cancel invite (owner only)
GET /invitations/my - Get user's pending invites
POST /invitations/:token/accept - Accept invite
POST /invitations/:token/decline - Decline invite
Ownership:

POST /projects/:projectId/transfer-ownership - Transfer to another member (owner only)
Approvals (/api/collaboration/drafts/...):

POST /drafts/:draftId/submit-for-review - Submit draft (editor+)
POST /approvals/:approvalId/approve - Approve (owner only)
POST /approvals/:approvalId/reject - Reject with feedback (owner only)
GET /drafts/:draftId/approvals - Approval history
GET /drafts/:draftId/versions - Version snapshots
Activity log:

GET /projects/:projectId/activity - Audit trail (viewer+)
4. Update Existing Routes
File: server/routes/projects.js

CRITICAL SECURITY FIX: Stop accepting userId from request params/body.

Before (VULNERABLE):


router.get('/', (req, res) => {
  const userId = req.query.userId; // Any user can access any userId!
  const projects = projectService.getAllProjects(userId);
  res.json({ projects });
});
After (SECURE):


router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.id; // From JWT token
  const projects = collaborationService.getUserProjects(userId); // Returns projects where user is member
  res.json({ projects });
});
Apply same fix to:

server/routes/drafts.js - Use req.user.id instead of req.query.userId
server/routes/tidp.js - Use req.user.id
server/routes/documents.js - Use req.user.id
5. Email Template
File: server/services/emailTemplates.js

Add projectInvitationEmail({ projectName, inviterName, role, acceptUrl, message }):

Subject: "You've been invited to collaborate on {projectName}"
Includes personalized message from inviter
Accept button with token URL
Expires in 7 days notice
Frontend Implementation
1. Update ProjectContext
File: src/contexts/ProjectContext.js

New state:

projectMembers - Array of members with roles
pendingInvitations - User's pending project invites
userRole - Current user's role in selected project ('owner'|'editor'|'viewer')
canEdit - Derived boolean (owner or editor)
canManageMembers - Derived boolean (owner only)
New methods:

loadProjectMembers(projectId) - Fetch members
inviteToProject(projectId, email, role, message) - Send invitation
loadPendingInvitations() - Fetch user's invites
acceptInvitation(token) - Accept invite, reload projects
Integration: Call loadProjectMembers() when currentProject changes

2. New UI Components
src/components/collaboration/ProjectMembersDialog.js
Modal showing all project members
Each member: avatar, name, email, role badge (with icon)
Owner can: change role (toggle editor/viewer), remove member
"Invite Member" button → opens InviteMemberDialog
src/components/collaboration/InviteMemberDialog.js
Form: email (required), role (editor/viewer dropdown), message (optional)
Validation: email format, prevent duplicate invites
On submit: call inviteToProject(), show toast, close dialog
src/components/collaboration/DraftApprovalPanel.js
Shows current approval status of draft
If pending: Owner sees approve/reject buttons with comment box
If draft: Editor sees "Submit for Review" button with comment box
Shows approval history below (who submitted, who reviewed, comments)
src/components/collaboration/InvitationsList.js
Notification banner on ProjectsPage showing pending invites
Each invite: project name, inviter name, role
Accept/Decline buttons
3. Permission-Aware UI Updates
File: src/components/pages/ProjectsPage.js

Show "Manage Members" button (owner only)
Disable delete button for non-owners
Show role badge next to project name
File: src/components/pages/PreviewExportPage.js

Integrate <DraftApprovalPanel /> in sidebar
Show/hide edit buttons based on canEdit
Implementation Order
Phase 1: Database & Backend Core (No Frontend Changes Yet)
Add new tables to server/db/database.js
Create collaborationService.js with all business logic
Create projectAuthMiddleware.js
Create server/routes/collaboration.js
Add email template to emailTemplates.js
Run migration script migrate-add-collaboration.js
Test: Use Postman to verify endpoints work
Phase 2: Security Fixes (Backend)
Update server/routes/projects.js to use req.user.id and requireProjectAccess
Update server/routes/drafts.js to use req.user.id
Update server/routes/tidp.js to use req.user.id
Update server/routes/documents.js to use req.user.id
Register collaboration routes in server/index.js
Test: Verify authorization works, can't access other users' data
Phase 3: Frontend - Context & Components
Update ProjectContext.js with new state/methods
Create ProjectMembersDialog.js
Create InviteMemberDialog.js
Create DraftApprovalPanel.js
Create InvitationsList.js
Test: Components render, API calls work
Phase 4: Frontend - Integration
Add "Manage Members" button to ProjectsPage.js
Add <InvitationsList /> to ProjectsPage.js
Add <DraftApprovalPanel /> to draft editing pages
Add permission checks to hide/disable UI based on canEdit, canManageMembers
Test: Full flow end-to-end
Critical Files Summary
New Files (10 total)
server/db/database.js - Add 5 new tables + ALTER drafts
server/services/collaborationService.js - Core business logic (~400 lines)
server/middleware/projectAuthMiddleware.js - Authorization checks (~80 lines)
server/routes/collaboration.js - API endpoints (~350 lines)
server/scripts/migrate-add-collaboration.js - Data migration
server/services/emailTemplates.js - Add projectInvitationEmail function
src/components/collaboration/ProjectMembersDialog.js - Member management UI
src/components/collaboration/InviteMemberDialog.js - Invite form UI
src/components/collaboration/DraftApprovalPanel.js - Approval workflow UI
src/components/collaboration/InvitationsList.js - Pending invites banner
Modified Files (5 total)
src/contexts/ProjectContext.js - Add collaboration state/methods
server/routes/projects.js - Fix userId vulnerability, add auth middleware
server/routes/drafts.js - Fix userId vulnerability
server/routes/tidp.js - Fix userId vulnerability
server/routes/documents.js - Fix userId vulnerability
Existing Functions/Services to Reuse
emailService.sendMail() - For sending invitations
authMiddleware.authenticateToken - For JWT verification
authService.getUserById() - For user lookups
Database patterns from database.js - Table creation, indexes, foreign keys
React Context pattern from AuthContext.js - State management
Verification & Testing
End-to-End Test Scenario
Setup: Two users - Alice (Project Owner), Bob (to be invited)

Alice creates project → Alice automatically becomes owner in project_members
Alice invites Bob → Email sent with invitation token
Bob accepts invite → Bob added to project_members as editor
Bob edits draft → Changes saved with last_modified_by = Bob.id
Bob submits for review → Draft status → 'pending_review', approval record created
Alice reviews → Sees pending approval in UI
Alice approves → Draft status → 'approved', approved_by = Alice.id
Alice transfers ownership to Bob → Bob becomes owner, Alice becomes editor
Check activity log → All actions logged with timestamps
Verify permissions → Alice (now editor) can't delete project or invite others
Unit Tests
File: server/__tests__/collaborationService.test.js

Test cases:

getProjectMembers() returns all members with user details
createInvitation() sends email and creates record
acceptInvitation() adds member and updates status
acceptInvitation() rejects expired tokens
removeMember() prevents removing project owner
updateMemberRole() prevents changing owner role directly
transferOwnership() demotes old owner, promotes new owner
submitForReview() creates approval and version snapshot
approveDraft() requires owner role
rejectDraft() reverts draft to 'draft' status
Manual Verification Checklist
 Create new project → Creator is owner in DB
 Invite user (existing email) → Invitation sent
 Invite user (non-existent email) → Invitation sent, user can register + accept
 Accept invitation → User added to project_members
 Decline invitation → Status updated, user not added
 View project as editor → Can edit, can't delete
 View project as viewer → Read-only, can't edit
 Submit draft for review → Status changes, owner notified
 Approve draft → Status approved, timestamp recorded
 Reject draft → Status back to draft, comments saved
 Transfer ownership → Roles swapped correctly
 Remove member → Member deleted, can't access project
 Security: Try accessing other user's project → 403 Forbidden
Performance Checks
Database queries use indexes (verify with EXPLAIN QUERY PLAN)
Member list loads in <100ms for projects with <50 members
Activity log limited to 50 entries by default (pagination)
Rollback Plan
If issues arise post-deployment:

Database: New tables are independent - can be dropped without affecting existing data
Backend: Routes are additive - old code still works with projects.user_id
Frontend: Can revert to single-user UI, backend still functions
No data loss: Migration script only adds records, doesn't modify/delete existing data.

Notes
Email configuration required: Invitations won't send if SMTP not configured (logged to console in dev)
Token security: Invitation tokens use crypto.randomBytes(32), expire in 7 days
Backward compatibility: Existing projects.user_id maintained, updated during ownership transfer
Activity logging: All collaboration actions logged for audit trail
Cascading deletes: When project deleted, all members/invitations/approvals auto-deleted (FK constraints)
Success Criteria
✅ Multiple users can collaborate on a single project with different roles
✅ Owners can invite users via email with accept/decline flow
✅ Editors can create/edit drafts and submit for review
✅ Owners can approve/reject drafts with comments
✅ Ownership can be transferred between members
✅ Security vulnerability fixed (no more userId query params)
✅ All collaboration actions logged in activity log
✅ Permission checks enforce role-based access at API and UI level