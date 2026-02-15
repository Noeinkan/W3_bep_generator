// Coordination, Collaboration & Risk Management Help Content
export const coordinationRiskHelp = {
  changeManagementProcess: {
    description: `Define the formal change management process for handling modifications to project information requirements, BIM strategy, delivery schedules, or technical standards during project execution. This ensures all changes are controlled, documented, and communicated systematically.

Cover:
• **Change Initiation**: How changes are requested (forms, CDE workflows, stakeholder triggers)
• **Impact Assessment**: Evaluation criteria (cost, time, quality, coordination, resources)
• **Approval Authority**: Who approves changes (Change Control Board, client, IM)
• **Implementation Process**: How approved changes are executed (TIDP/MIDP updates, notifications)
• **Documentation**: Change log, audit trails, version control per ISO 19650-2 clause 5.7
• **Communication**: Team notification procedures and stakeholder updates

This prevents uncontrolled scope creep and maintains information integrity throughout the project lifecycle.`,

    iso19650: `ISO 19650-2:2018 Section 5.7 - Information Management During Project Delivery

The standard requires systematic management of changes to information requirements and delivery plans. Changes must be:
• Properly authorized by the appointing party
• Documented with clear audit trails
• Communicated to all affected task teams
• Reflected in updated TIDPs and MIDP

**Post-Appointment Context**: Change management is critical during execution to handle evolving client requirements, design development, and unforeseen challenges whilst maintaining information delivery commitments.

Robust change control prevents coordination failures, missed deliverables, and disputes over scope.`,

    bestPractices: [
      'Establish clear thresholds for minor vs. major changes requiring different approval levels',
      'Define Change Control Board composition (IM, Project Director, Client Rep minimum)',
      'Set response timeframes (e.g., 5 working days for standard changes)',
      'Use CDE-integrated change request forms with mandatory impact assessments',
      'Require changes to trigger automatic TIDP/MIDP review and updates',
      'Maintain comprehensive change log with audit trail per ISO 19650',
      'Implement automated team notifications when changes are approved',
      'Link changes to contract variations when affecting scope/cost',
      'Conduct regular Change Control Board meetings (weekly or fortnightly)',
      'Document rejected changes with rationale for future reference',
      'Include change statistics in project performance reporting'
    ],

    examples: {
      'Commercial Building': `CHANGE MANAGEMENT PROCEDURE

**Change Request Initiation:**
Any stakeholder may submit change request via CDE workflow using standardized form CR-001. Request must include: description, justification, affected deliverables, proposed solution.

**Impact Assessment (Information Manager):**
Within 3 working days, IM evaluates:
• Schedule impact on TIDP/MIDP milestones
• Resource allocation changes required
• Coordination effects across task teams
• Software/technology implications
• Budget impact (if scope change)
• Risk to downstream deliverables

**Approval Process:**
Minor Changes (no milestone impact, <5 days effort): IM approval, 2-day turnaround
Standard Changes (milestone shift, significant effort): Change Control Board (weekly meetings), 5-day decision
Major Changes (scope change, contract variation): CCB + Client Director approval, 10-day process with commercial review

**Implementation:**
Approved changes trigger:
1. TIDP/MIDP schedule updates published to CDE
2. Automated email notifications to all affected task teams
3. Updated Information Delivery Plan issued within 5 days
4. Coordination meeting scheduled if multi-discipline impact
5. Change log updated with approval reference and audit trail

**Documentation:**
All changes recorded in Change Register (CR-LOG-001) per ISO 19650-2 clause 5.7 including: CR number, date, requestor, description, impact assessment, approval decision, implementation date, affected TIDPs.

Monthly change reports presented to client showing: number of changes, categories, schedule impact, lessons learned.`,

      'Infrastructure': `CHANGE CONTROL FRAMEWORK

**Trigger Events:**
• Design development requiring additional information
• Client requirement changes from stakeholder consultation
• Statutory authority feedback (Network Rail, EA, Highways England)
• Ground conditions discoveries requiring design changes
• Third-party coordination issues (utilities, property)

**Change Categories:**

**Category A - Expedited** (non-critical, <2 days):
• Cosmetic model adjustments
• Nomenclature corrections
• Reporting format changes
Approval: Information Manager, 1-day turnaround

**Category B - Standard** (affects deliverables, 2-10 days):
• Design iteration affecting coordination
• Additional analysis requirements
• Software/format changes
Approval: CCB (IM, Lead Designer, Client PM), 5-day decision at weekly meeting

**Category C - Major** (milestone impact, contract variation):
• Scope changes from public inquiry
• Statutory requirements changes
• Major design revisions
Approval: CCB + Client Director + Commercial Manager, 15-day formal review with NEC contract assessment

**Implementation Protocol:**
1. IM updates MIDP with revised milestones
2. Affected TIDPs reissued with change tracking
3. Email notification via CDE to all task teams
4. Coordination workshop if multi-discipline (within 5 days)
5. Change incorporated in next model federation
6. Updated delivery schedules published to client portal

**Audit Trail:**
Change register maintained in CDE with full versioning. Monthly governance reports include change velocity metrics, approval times, and impact on critical path.`,

      'Healthcare': `HEALTHCARE PROJECT CHANGE MANAGEMENT

**Change Initiation:**
Change requests submitted via Aconex workflow using form HBN-CR-001 with mandatory fields:
• Clinical/non-clinical classification
• HBN/HTM compliance impact
• Infection control implications
• Medical equipment coordination effects
• Operational hospital constraints

**Fast-Track for Clinical Safety:**
Changes affecting patient safety, infection control, or HTM compliance processed within 24 hours with Clinical Lead and IM joint approval.

**Standard Process (3-5 days):**
Change Control Board composition:
• Information Manager (chair)
• Clinical Lead (medical planning)
• MEP Coordinator (critical systems)
• Client Estates Director
• Trust Infection Control Advisor (for relevant changes)

Impact assessment includes:
• HBN 04-01 infection control compliance
• Medical gases/critical ventilation impact
• Medical equipment clashes
• Phasing impact on operational hospital
• Clinical workflow effects

**Approval Matrix:**
Minor (cosmetic, no clinical impact): IM approval, 1 day
Standard (design change, technical): CCB, 5 days
Major (clinical space change, HTM): CCB + Trust Medical Director + NHS capital approval if >£50k, 10 days
Emergency (patient safety): Clinical Lead + IM, 24 hours

**Implementation:**
• HBN/HTM compliance re-verified
• Clinical equipment coordination updated
• Infection control advisor sign-off for relevant changes
• Updated room data sheets issued
• Trust Estates team notified
• TIDP/MIDP revised with clinical milestone protection

**Documentation:**
Change log includes clinical impact classification. Monthly reports to Trust include patient safety implications of changes and compliance status.`
    },

    commonMistakes: [
      'No clear change initiation process - informal requests causing confusion',
      'Missing impact assessment requirements - changes approved without understanding effects',
      'Undefined approval authority leading to delays and disputes',
      'No distinction between minor and major changes - everything requires same approval',
      'Failing to update TIDP/MIDP when changes affect schedules',
      'Poor communication - teams unaware of approved changes',
      'No change log or audit trail per ISO 19650 requirements',
      'Not linking BIM changes to contract variations when scope affected',
      'No timeframes for decisions - changes languish indefinitely',
      'Missing Change Control Board meetings leading to bottlenecks'
    ],

    aiPrompt: {
      system: 'You are a BIM project controls expert specializing in change management procedures aligned with ISO 19650-2.',
      instructions: 'Generate a comprehensive change management process description. Include: change initiation procedures, impact assessment criteria, approval authority/matrix (minor/standard/major changes), implementation steps (TIDP/MIDP updates, notifications), documentation requirements (change log per ISO 19650-2 clause 5.7), and communication protocols. Make it specific with timeframes and responsible parties. Structure with clear headings. Maximum 200 words.',
      style: 'systematic, process-oriented, ISO 19650-compliant, clear authority levels, structured'
    },

    relatedFields: ['updateProcesses', 'auditTrails', 'informationManagementResponsibilities', 'mobilizationPlan']
  }
};
