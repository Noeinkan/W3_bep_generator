// Quality Assurance and Control Help Content
export const qualityAssuranceHelp = {
  qaFramework: {
    description: `Define the quality assurance framework including all QA activities, responsible parties, frequency, and tools/methods used to ensure information quality throughout the project.

Cover QA activities for:
• Model geometry and accuracy
• Data completeness and accuracy
• Adherence to standards and conventions
• Coordination and clash detection
• Deliverable completeness
• Compliance with client requirements`,

    iso19650: `ISO 19650-2:2018 Section 5.4.5 - Model Production Delivery Table

Quality assurance processes ensure that information delivered meets the defined information standard and is suitable for its intended purpose.`,

    bestPractices: [
      'Define QA activities at multiple levels: author self-check, peer review, formal QA',
      'Specify frequency for each QA activity (daily, weekly, milestone)',
      'Assign clear responsibilities using RACI matrix',
      'Utilize automated validation tools (Solibri, Navisworks, BIMcollab)',
      'Maintain QA checklist templates for different information types',
      'Document QA results and non-conformances',
      'Establish corrective action procedures for quality issues',
      'Conduct periodic QA audits of processes and deliverables'
    ],

    examples: {
      'Commercial Building': `QA Framework table example:

| QA Activity | Responsibility | Frequency | Tools/Methods |
|------------|---------------|-----------|--------------|
| Author Self-Check | Model Author | Before sharing to WIP | Internal model audit, visual review |
| Peer Review | Team Colleague | Weekly | Cross-check against standards |
| Internal Clash Detection | Discipline Lead | Before publishing to Shared | Navisworks, tolerance 25mm |
| Model Validation | BIM Coordinator | Weekly | Solibri rule-based checking |
| Federated Clash Detection | BIM Coordinator | Weekly | Navisworks automated clash tests |
| Coordinate System Check | BIM Manager | Per model publication | Survey point verification |
| Data Completeness Check | Information Manager | Milestone | Parameter audit, classification check |
| Drawing QA | CAD Manager | Before client submission | Drawing standards compliance |
| IFC Export Validation | BIM Coordinator | Before client delivery | IFC viewer verification, MVD checker |
| Client Deliverable Review | Project Director | Milestone | Deliverable checklist sign-off |

**QA Metrics:**
• Target: <50 clashes per federated model
• Model file health: Zero critical errors
• Classification completeness: 100% of elements
• Parameter population: 95%+ for required fields`,

      'Infrastructure': `Infrastructure QA framework:

| QA Activity | Responsibility | Frequency | Tools/Methods |
|------------|---------------|-----------|--------------|
| Alignment Validation | Highway Lead | Per design iteration | Alignment report, visual check |
| Structure Model Check | Structural Lead | Weekly | Tekla model checker, analysis validation |
| Drainage Network Validation | Drainage Engineer | Per update | Hydraulic analysis, gradient check |
| Clash Detection (Utilities) | Coordination Lead | Fortnightly | Navisworks, statutory undertaker coordination |
| Survey Data Verification | Survey Manager | Per survey delivery | Point cloud registration, accuracy check |
| Design Code Compliance | Technical Director | Milestone | DMRB compliance check, design certificate |
| Drawing Coordination | CAD Lead | Before issue | Cross-reference check, consistency review |
| As-Built Verification | Site Engineer | Monthly | Survey vs model comparison |

**Quality Targets:**
• Alignment accuracy: ±10mm horizontal, ±5mm vertical
• Zero clashes with confirmed utilities
• All structures independently checked
• 100% as-built survey verification`
    },

    commonMistakes: [
      'No multi-level QA defined (only single review)',
      'QA frequency not specified leading to inconsistent checking',
      'Responsibilities not clearly assigned (RACI)',
      'No automated validation tools utilized',
      'QA results not documented or tracked',
      'Missing corrective action procedures',
      'No QA metrics or targets defined',
      'Periodic audits not scheduled or performed'
    ],

    aiPrompt: {
      system: 'You are a BIM quality assurance lead. Define a QA framework that assures information quality, compliance with standards, and suitability for purpose under ISO 19650.',
      instructions: 'Define the QA framework as a short table-like list of QA activities. For each activity specify responsibility (RACI-style), frequency, and tools/methods (e.g., Solibri/Navisworks checks, checklists, audits). Include author self-check, peer review, automated validation, coordination/clash review, and milestone deliverable sign-off. Include how non-conformances are recorded and closed, and 2-3 measurable quality targets. Maximum 180 words.',
      style: 'structured, activity-based, measurable targets, audit-ready, concise'
    },

    relatedFields: ['modelValidation', 'reviewProcesses', 'approvalWorkflows', 'complianceVerification']
  },

  modelValidation: {
    description: `Define comprehensive model validation procedures ensuring models meet quality, accuracy, and completeness standards before coordination and delivery.

Validation should cover:
• Geometric accuracy and modeling standards compliance
• Data completeness (parameters, properties, classification)
• Coordinate system and datum verification
• Model performance and file health
• Interoperability (IFC export validation)
• Clash detection (internal discipline clashes)
• Compliance with LOD/LOIN requirements`,

    iso19650: `ISO 19650-2:2018 Section 5.4.4 - Information Model Review

Information models must undergo systematic validation to verify they meet quality standards, are geometrically coordinated, and contain required information before exchange or approval.`,

    bestPractices: [
      'Implement automated validation using Solibri Model Checker or similar',
      'Define model validation checklist with pass/fail criteria',
      'Validate before publishing to CDE Shared folder',
      'Check coordinate system alignment and shared coordinates',
      'Run internal clash detection before federated coordination',
      'Validate IFC export against MVD requirements',
      'Check parameter and classification completeness',
      'Verify model file health (audit, purge, workset integrity)',
      'Document validation results and maintain validation log'
    ],

    examples: {
      'Commercial Building': `Model validation workflow:

**Pre-Publication Validation Checklist:**

Geometric Validation:
☑ Model aligned to correct coordinate system (OSGB36 origin)
☑ Levels match project datum (±5mm tolerance)
☑ Grid intersections verified against coordination model
☑ No detached elements or elements far from origin (>1km)
☑ Internal discipline clash detection complete (<50 clashes acceptable)

Data Validation:
☑ All elements classified using Uniclass 2015 (minimum Ss_XX_XX)
☑ Required parameters populated (Fire Rating, Acoustic Rating, U-Value)
☑ Space naming and numbering complete per room data sheet
☑ Door/window schedules complete with all required fields
☑ Material assignments appropriate (not Generic/Default)

File Health:
☑ Model audit completed with warnings resolved
☑ Purge unused families, groups, line patterns
☑ Worksets properly organized and minimal overlap
☑ File size reasonable (<500MB, <100K elements)
☑ No corrupt families or errors preventing model opening

Interoperability:
☑ IFC 4 export successful using Coordination View 2.0 MVD
☑ IFC geometry visually verified in viewer (Solibri/BIMcollab)
☑ IFC validation report generated with <10 errors
☑ BCF export capability verified

**Automated Validation (Solibri Rules):**
• Accessibility: Door widths, corridor widths, accessible routes
• Building Code: Stair geometry, guard heights, headroom
• MEP Clearances: Maintenance access, equipment clearances
• Quality: Duplicate elements, overlapping elements, small gaps
• Data: Classification completeness, parameter population`,

      'Infrastructure': `Infrastructure model validation:

**Highway Model Validation:**
☑ Alignment stationing consistent across all disciplines
☑ Vertical alignment matches approved design profile (±10mm)
☑ Cross-sections validate against design templates
☑ Superelevation transitions geometrically correct
☑ Tie-ins to existing road verified against survey
☑ Earthwork volumes within ±5% of estimate

**Structure Model Validation:**
☑ Structural analysis model matches BIM geometry model
☑ Connection details modeled to construction tolerance
☑ Rebar clearances and cover verified
☑ Loadings and design codes documented in model properties
☑ Clash detection with highway and drainage complete

**Drainage Model Validation:**
☑ Pipe gradients meet minimum design standards (1:200)
☑ Invert levels verified against longitudinal sections
☑ Hydraulic analysis results attached to model
☑ Outfall levels verified against watercourse survey
☑ Clash detection with utilities and structures complete`
    },

    commonMistakes: [
      'No systematic validation process, relying on ad-hoc checking',
      'Validation performed too late (after delivery instead of before)',
      'Missing automated validation tools and manual checking only',
      'No validation checklist leading to inconsistent reviews',
      'Internal clash detection skipped before federated coordination',
      'IFC export validation not performed before client delivery',
      'Validation results not documented or tracked',
      'No corrective action process for failed validations'
    ],

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are a BIM model validation expert. Generate concise, practical validation procedures using checklist format.',
      instructions: 'Generate content similar to the examples above. Use checklist format (☑) with specific validation tools (e.g., Solibri Model Checker), quantifiable metrics (e.g., <50 clashes, ±5mm tolerance), and actionable items. Keep it practical and structured. Maximum 150 words.',
      style: 'checklist-based, specific tools mentioned, quantifiable metrics, structured categories'
    },

    relatedFields: ['qaFramework', 'reviewProcesses', 'complianceVerification', 'modelReviewAuthorisation']
  },

  reviewProcesses: {
    description: `Define formal review processes for design coordination, quality assurance, and client approvals at key project milestones.

Establish review processes for:
• Discipline internal reviews (peer review)
• Cross-disciplinary coordination reviews
• Design development milestone reviews
• Client and stakeholder reviews
• Constructability and value engineering reviews
• Pre-tender and pre-construction reviews`,

    iso19650: `ISO 19650-2:2018 Section 5.4.4 - Information Model Review and Authorization

Formal review processes ensure information is validated, coordinated, and approved by appropriate parties before progression to the next project stage.`,

    bestPractices: [
      'Define review frequency aligned with project milestones (RIBA stages)',
      'Establish review team composition and responsibilities',
      'Use federated models for coordination review sessions',
      'Document review comments using BCF or structured comment logs',
      'Define review duration and comment response timeframes',
      'Implement review sign-off procedures before stage progression',
      'Conduct design freeze periods before major milestones',
      'Maintain review meeting minutes and action logs'
    ],

    examples: {
      'Commercial Building': `Review process schedule:

**Weekly Coordination Review (Design Phase):**
• Frequency: Every Monday 10am
• Attendees: All discipline leads, BIM coordinator
• Duration: 2 hours
• Process:
  1. Review federated model (latest Shared versions)
  2. Discuss clash report from previous week
  3. Address coordination issues and design conflicts
  4. Assign actions with owners and deadlines
  5. Document decisions in meeting minutes
• Outputs: Updated clash register, action log, BCF issues

**Milestone Design Review (RIBA Stage Gates):**
• Trigger: End of RIBA Stage 3, 4, 5
• Attendees: Project director, client, all leads, consultants
• Duration: Half-day workshop
• Process:
  1. Design freeze 1 week before review
  2. Pre-review QA validation complete
  3. Presentation of federated model and key deliverables
  4. Client comments captured in structured log
  5. Comment resolution period (2 weeks)
  6. Formal sign-off before progressing to next stage
• Outputs: Review report, client approval, updated models

**Constructability Review (Pre-Construction):**
• Trigger: 4 weeks before tender
• Attendees: Design team, cost consultant, contractor (if early engagement)
• Process:
  1. Review construction sequences in 4D model
  2. Identify buildability issues and risks
  3. Value engineering opportunities
  4. Coordination with procurement strategy
• Outputs: Constructability report, design amendments`,

      'Infrastructure': `Infrastructure review framework:

**Fortnightly Design Coordination (Detailed Design):**
• Disciplines: Highway, Structures, Drainage, Utilities
• Focus: Interface coordination, clashes, design consistency
• Tools: Navisworks federated model review
• Deliverables: Clash resolution log, design change notices

**Statutory Review Meetings:**
• Frequency: Monthly during design
• Attendees: Statutory undertakers, local authority, planning
• Purpose: Coordination of utilities diversions, approvals
• Outputs: Agreed interface drawings, approval milestones

**Stage Gate Reviews (3 stages):**
1. Preliminary Design Review (30% design)
   - Concept approval, major decisions confirmed
2. Detailed Design Review (90% design)
   - Design coordination complete, ready for tender
3. Pre-Construction Review (100% design)
   - Constructability validated, contractor queries addressed

**Design Certification:**
• Independent technical review at each stage gate
• Design compliance with DMRB, Eurocodes verified
• Sign-off by Technical Director before progression`
    },

    commonMistakes: [
      'No defined review schedule aligned with milestones',
      'Review team composition not specified',
      'Not using federated models for coordination reviews',
      'Review comments not documented systematically (BCF)',
      'No timeframes for comment resolution',
      'Missing formal sign-off before stage progression',
      'No design freeze period before major reviews',
      'Review meeting minutes not maintained or distributed'
    ],

    relatedFields: ['approvalWorkflows', 'coordinationMeetings', 'modelReviewAuthorisation', 'issueResolution']
  },

  approvalWorkflows: {
    description: `Define approval workflows and authorization procedures for information deliverables, ensuring appropriate review and sign-off before information is shared or published.

Establish workflows for:
• Internal discipline approvals (author-checker-approver)
• Cross-discipline coordination approvals
• Lead appointed party approvals
• Client/appointing party approvals
• Milestone and stage gate approvals
• As-built and handover approvals`,

    iso19650: `ISO 19650-2:2018 Section 5.4.6 - Information Approval and Authorization

Clear approval workflows ensure information is reviewed and authorized by competent parties before being used for decision-making or construction.`,

    bestPractices: [
      'Implement author-checker-approver workflow for all deliverables',
      'Define approval authority matrix (who can approve what)',
      'Use CDE workflow states to manage approval status',
      'Establish timeframes for approval (e.g., 5 working days)',
      'Implement digital approval workflows within CDE',
      'Require formal sign-off for milestone deliverables',
      'Maintain approval logs and audit trails',
      'Define escalation process for approval delays or disputes'
    ],

    examples: {
      'Commercial Building': `Approval workflow process:

**Level 1: Internal Discipline Approval (Author-Checker-Approver)**
1. Author: Model author creates/updates information (WIP folder)
2. Checker: Peer review by colleague (48-hour SLA)
   - Check against modeling standards
   - Verify parameter completeness
   - Internal clash detection
3. Approver: Discipline lead approval (24-hour SLA)
   - Assign suitability code (S0, S1, S2, etc.)
   - Publish to Shared folder
   - Notify coordination team

**Level 2: Cross-Discipline Coordination Approval**
1. BIM Coordinator: Federate all discipline models
2. Clash Detection: Generate clash report
3. Coordination Review: Weekly meeting to resolve clashes
4. BIM Manager Approval: Coordination sign-off
   - Suitability code S1 (Suitable for Coordination)

**Level 3: Lead Appointed Party Approval (Client Submission)**
1. Information Manager: Collate all deliverables
2. QA Review: Final quality validation
3. Project Director: Internal approval and sign-off
4. Submit to Client: Move to Published folder
   - Suitability code S3 (Suitable for Review & Comment) or S4 (Suitable for Stage Approval)

**Level 4: Client/Appointing Party Approval**
1. Client Review: Comment period (10 working days)
2. Comment Resolution: Address client feedback
3. Client Authorization: Formal approval
   - Suitability code S4 (Stage Approved) or S6 (As-built Authorized)

**Approval Authority Matrix:**
| Information Type | Author | Checker | Discipline Approver | BIM Manager | Project Director | Client |
|-----------------|--------|---------|---------------------|-------------|------------------|--------|
| WIP Models | ✓ | - | - | - | - | - |
| Shared Models | ✓ | ✓ | ✓ | - | - | - |
| Coordinated Models | ✓ | ✓ | ✓ | ✓ | - | - |
| Client Deliverables | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| Stage Approval | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

**Timeframes:**
• Internal checking: 48 hours
• Discipline approval: 24 hours
• BIM Manager coordination approval: 72 hours
• Project Director sign-off: 5 working days
• Client review: 10 working days`,

      'Infrastructure': `Infrastructure approval process:

**Design Approval Workflow:**

**Stage 1: Designer Internal Approval**
• Author → Senior Engineer (technical check) → Discipline Lead (approval)
• Timeframe: 3 working days
• Output: Suitability S1 (Coordination)

**Stage 2: Multi-Discipline Coordination**
• Federated model review → Clash resolution → BIM Manager approval
• Timeframe: 1 week (fortnightly cycle)
• Output: Suitability S2 (Information)

**Stage 3: Design Certification**
• Independent Checker (IC) review
• Technical Director approval
• Compliance with DMRB, Eurocodes certified
• Timeframe: 2 weeks
• Output: Suitability S3 (Review & Comment) for client

**Stage 4: Client Approval**
• Client technical review (Highways England, Network Rail, etc.)
• Approval to proceed to next design stage
• Timeframe: 4 weeks
• Output: Suitability S4 (Stage Approved)

**Stage 5: Construction Approval**
• Contractor buildability review
• Final design freeze
• Issue for Construction authorization
• Output: Suitability S5 (Construction)

**Approval Escalation:**
• Day 1-5: Normal workflow
• Day 6-10: Reminder to approver
• Day 11+: Escalate to Project Manager
• Critical path items: Immediate escalation`
    },

    commonMistakes: [
      'No author-checker-approver workflow defined',
      'Approval authority matrix not documented',
      'CDE workflow states not used to track approvals',
      'No timeframes specified for approvals',
      'Manual approval tracking instead of digital CDE workflows',
      'Missing formal sign-off for milestones',
      'Approval logs not maintained',
      'No escalation process for delayed approvals'
    ],

    relatedFields: ['reviewProcesses', 'workflowStates', 'documentControlInfo', 'modelReviewAuthorisation']
  },

  complianceVerification: {
    description: `Define procedures for verifying compliance with project standards, client requirements, regulatory codes, and ISO 19650 information management protocols.

Verification should cover:
• Compliance with project BIM execution plan
• Adherence to naming and classification standards
• Compliance with LOD/LOIN requirements
• Building regulation and code compliance
• Client EIR and PIR compliance
• ISO 19650 process compliance`,

    iso19650: `ISO 19650-2:2018 Section 5.4.5 - Model Production Delivery Table

Compliance verification ensures delivered information meets all project requirements, standards, and regulatory obligations.`,

    bestPractices: [
      'Implement automated compliance checking using rule-based tools',
      'Conduct periodic compliance audits (monthly or per milestone)',
      'Verify adherence to EIR requirements at each delivery milestone',
      'Check regulatory code compliance (building codes, accessibility)',
      'Validate ISO 19650 process compliance (CDE usage, naming, etc.)',
      'Document compliance status in delivery reports',
      'Establish corrective action procedures for non-compliance',
      'Include compliance verification in QA framework'
    ],

    examples: {
      'Commercial Building': `Compliance verification procedures:

**BIM Execution Plan Compliance:**
• Verification: Monthly audit by Information Manager
• Checks:
  - Models following naming conventions (ISO 19650 format)
  - Classification applied (Uniclass 2015 to required depth)
  - LOD compliance per stage (LOD 300 Stage 3, LOD 350 Stage 4)
  - CDE workflow states used correctly (WIP/Shared/Published)
  - Parameter population completeness (95%+ target)
• Tool: Automated compliance report from Solibri/BIMcollab
• Output: Monthly compliance report with corrective actions

**Building Regulations Compliance:**
• Verification: Milestone review by Building Control Consultant
• Checks:
  - Fire escape routes and travel distances (Approved Document B)
  - Accessibility compliance (Approved Document M)
  - Structural loading compliance (Approved Document A)
  - Energy performance (Part L compliance)
• Tool: Solibri Model Checker with UK Building Regs ruleset
• Output: Compliance certificate for Building Control submission

**Client EIR Compliance:**
• Verification: Stage gate review by Project Director
• Checks:
  - All EIR deliverables provided (models, data, drawings)
  - Information delivery milestones met
  - Data drops in correct format (IFC, COBie, etc.)
  - Security and data classification requirements met
• Output: EIR compliance matrix (RAG status report)

**ISO 19650 Process Compliance:**
• Verification: Quarterly audit by Information Manager
• Checks:
  - CDE structure and workflow compliance
  - Suitability codes applied correctly (S0-S6)
  - Information containers named per standard
  - Approval workflows followed
  - Audit trails maintained
• Tool: CDE audit report
• Output: ISO 19650 compliance certificate`,

      'Infrastructure': `Infrastructure compliance framework:

**Design Standards Compliance (DMRB):**
• Verification: Independent technical review at each stage
• Checks:
  - Geometric design compliance (alignment standards, sight lines)
  - Pavement design per DMRB CD 226
  - Drainage design per DMRB CD 526
  - Structures design per Eurocodes and DMRB BD/CD series
• Tool: Design checker software + manual review
• Output: Technical compliance certificate

**Planning Conditions Compliance:**
• Verification: Monthly by Planning Consultant
• Checks:
  - Environmental mitigation measures modeled
  - Landscape screening provisions
  - Noise barrier heights and locations
  - Ecology protection measures
• Output: Planning compliance report for local authority

**Statutory Approvals Compliance:**
• Verification: Interface coordination meetings
• Checks:
  - Utilities diversions per statutory undertaker agreements
  - Highway authority technical approvals (S278, S38)
  - Environmental permits (watercourse crossings, etc.)
  - CDM compliance and safety file requirements
• Output: Approvals tracker (RAG status)

**Client PIR Compliance:**
• Verification: Stage deliverable reviews
• Checks:
  - Asset data completeness for handover
  - GIS data format and accuracy
  - As-built model accuracy (±25mm tolerance)
  - O&M manual integration with model
• Output: PIR compliance statement`
    },

    commonMistakes: [
      'No automated compliance checking tools used',
      'Compliance audits not scheduled regularly',
      'EIR requirements not tracked systematically',
      'Building code compliance not verified until late stage',
      'ISO 19650 process compliance assumed, not verified',
      'Compliance status not documented in reports',
      'No corrective action process for non-compliance',
      'Compliance verification separate from QA framework'
    ],

    relatedFields: ['qaFramework', 'modelValidation', 'reviewProcesses', 'approvalWorkflows']
  },

  modelReviewAuthorisation: {
    description: `Define the procedures for reviewing and authorizing information models before they are shared, published, or used for construction and asset management.

Include procedures for:
• Model review criteria and checklists
• Authorization levels and responsibilities
• Sign-off procedures for different model purposes
• Documentation of review outcomes
• Non-conformance handling and resubmission
• Final authorization for construction and handover`,

    iso19650: `ISO 19650-2:2018 Section 5.4.6 - Information Approval

Model authorization ensures that information is fit for its intended purpose and has been reviewed and approved by appropriate competent parties.`,

    bestPractices: [
      'Define suitability codes (S0-S7) for different authorization levels',
      'Establish authorization matrix defining who can authorize what',
      'Require formal sign-off for milestone model deliveries',
      'Document authorization with date, authorizer name, and suitability code',
      'Implement digital authorization workflows within CDE',
      'Define resubmission procedures for rejected models',
      'Maintain authorization log tracking all approvals',
      'Final authorization (S6) required before as-built handover'
    ],

    examples: {
      'Commercial Building': `Model authorization process using ISO 19650 suitability codes:

**Suitability Code Framework:**

**S0 - Work in Progress (WIP)**
• Review: Self-check by author only
• Authorization: None required
• Purpose: Internal development
• Location: WIP folder
• Documentation: None

**S1 - Suitable for Coordination**
• Review Criteria:
  - Model meets internal standards
  - Coordinate system correct
  - Internal clash detection complete (<50 clashes)
  - Ready for multi-discipline coordination
• Authorized by: Discipline Lead
• Documentation: Internal review checklist signed
• Location: Shared folder

**S2 - Suitable for Information**
• Review Criteria:
  - Federated coordination complete
  - Cross-discipline clashes resolved (target: <10 clashes)
  - Model validated (Solibri rules passed)
  - Information content verified
• Authorized by: BIM Manager
• Documentation: Coordination review report
• Location: Shared folder

**S3 - Suitable for Review & Comment**
• Review Criteria:
  - Full QA validation passed
  - Client deliverable checklist complete
  - IFC export validated
  - Ready for client review
• Authorized by: Project Director
• Documentation: QA report + sign-off certificate
• Location: Published folder (client access)

**S4 - Suitable for Stage Approval**
• Review Criteria:
  - Client comments addressed
  - Stage deliverables complete per EIR
  - Milestone requirements met
  - Stage gate approval obtained
• Authorized by: Client/Appointing Party
• Documentation: Client approval letter + sign-off
• Location: Published folder (approved)

**S6 - Suitable for PIM Authorization (As-Built)**
• Review Criteria:
  - As-built survey verification complete
  - Asset data validated (COBie)
  - O&M information linked
  - Handover requirements met
• Authorized by: Client Asset Manager
• Documentation: Handover certificate + PIM authorization
• Location: Archive folder (final record)

**Authorization Matrix:**
| Suitability | Reviewer | Authorizer | Criteria | Documentation |
|-------------|----------|------------|----------|---------------|
| S0 | Author | Author | Self-check | None |
| S1 | Peer | Discipline Lead | Internal standards | Review checklist |
| S2 | BIM Coordinator | BIM Manager | Coordination | Clash report |
| S3 | QA Team | Project Director | Client-ready | QA certificate |
| S4 | Client Team | Client Rep | Stage approval | Approval letter |
| S6 | FM Team | Asset Manager | As-built handover | Handover cert |

**Non-Conformance Procedure:**
1. Review identifies non-conformance
2. Model rejected with detailed comments (BCF)
3. Author corrects issues
4. Resubmit for review (same suitability level)
5. Re-authorization if compliant`,

      'Infrastructure': `Infrastructure authorization workflow:

**Design Stage Authorizations:**

**S1 - Coordination (Internal)**
• Authorizer: Discipline Engineer
• Criteria: Design standards met, ready for coordination
• Documentation: Design calculation sign-off

**S2 - Information (Federated)**
• Authorizer: Lead Engineer
• Criteria: Multi-discipline coordination complete
• Documentation: Coordination meeting minutes

**S3 - Review (Client Submission)**
• Authorizer: Technical Director
• Criteria: Independent check complete, design certified
• Documentation: Independent Checker certificate

**S4 - Approval (Stage Gate)**
• Authorizer: Client Representative (Highways England, Network Rail)
• Criteria: Technical approval, compliance verified
• Documentation: Technical Approval Certificate (TAC)

**S5 - Construction**
• Authorizer: Principal Designer (CDM)
• Criteria: Buildability confirmed, contractor accepted
• Documentation: Construction authorization letter

**S6 - As-Built (Handover)**
• Authorizer: Client Asset Manager
• Criteria: As-built verified, asset data complete
• Documentation: Asset Information Model (AIM) acceptance

**Resubmission Process:**
If model fails authorization:
1. Authorizer documents reasons for rejection
2. Design team addresses comments (tracked in register)
3. Updated model resubmitted within defined timeframe
4. Re-review and authorization decision (accept/reject)
5. If critical path: escalation to Project Manager`
    },

    commonMistakes: [
      'Suitability codes (S0-S7) not defined or used',
      'No authorization matrix - unclear who can authorize',
      'Missing formal sign-off procedures for milestones',
      'Authorization not documented (date, name, code)',
      'Manual authorization instead of digital CDE workflows',
      'No resubmission procedures for failed reviews',
      'Authorization log not maintained',
      'S6 (as-built) authorization skipped at handover'
    ],

    relatedFields: ['approvalWorkflows', 'modelValidation', 'reviewProcesses', 'workflowStates']
  }

};
