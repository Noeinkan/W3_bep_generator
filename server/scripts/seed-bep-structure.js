/**
 * Seed Script: Populate BEP Structure Tables from bepConfig.js
 *
 * This script reads the existing bepConfig.js and populates the
 * bep_step_configs and bep_field_configs tables with the default template.
 *
 * Usage: node server/scripts/seed-bep-structure.js
 */

const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');

// Icon name mapping (Lucide component name to string)
const ICON_MAP = {
  Building: 'Building',
  FileText: 'FileText',
  Users: 'Users',
  Target: 'Target',
  Database: 'Database',
  Calendar: 'Calendar',
  Monitor: 'Monitor',
  Settings: 'Settings',
  CheckCircle: 'CheckCircle',
  Shield: 'Shield',
  BookOpen: 'BookOpen',
  AlertCircle: 'AlertCircle'
};

// Step definitions from bepConfig.js
const STEPS = [
  { number: 1, title: 'BEP Type & Project Info', icon: 'Building', description: 'Define BEP type and basic project information', category: 'Commercial' },
  { number: 2, title: 'Executive Summary', icon: 'FileText', description: 'High-level overview and key commitments', category: 'Commercial' },
  { number: 3, title: 'Stakeholders & Roles', icon: 'Users', description: 'Define project stakeholders and responsibilities', category: 'Commercial' },
  { number: 4, title: 'BIM Goals & Uses', icon: 'Target', description: 'Define BIM objectives and applications', category: 'Commercial' },
  { number: 5, title: 'Level of Information Need', icon: 'Database', description: 'Specify LOIN requirements and content', category: 'Management' },
  { number: 6, title: 'Information Delivery Planning', icon: 'Calendar', description: 'MIDP, TIDPs and delivery schedules', category: 'Management' },
  { number: 7, title: 'Common Data Environment', icon: 'Monitor', description: 'CDE specification and workflows', category: 'Technical' },
  { number: 8, title: 'Technology Requirements', icon: 'Settings', description: 'Software, hardware and technical specs', category: 'Technical' },
  { number: 9, title: 'Information Production', icon: 'FileText', description: 'Methods, standards and procedures', category: 'Management' },
  { number: 10, title: 'Quality Assurance', icon: 'CheckCircle', description: 'QA framework and validation processes', category: 'Management' },
  { number: 11, title: 'Security & Privacy', icon: 'Shield', description: 'Information security and privacy measures', category: 'Management' },
  { number: 12, title: 'Training & Competency', icon: 'BookOpen', description: 'Training requirements and competency levels', category: 'Management' },
  { number: 13, title: 'Coordination & Risk', icon: 'AlertCircle', description: 'Collaboration procedures and risk management', category: 'Management' },
  { number: 14, title: 'Appendices', icon: 'FileText', description: 'Supporting materials and templates', category: 'Management' }
];

// Field definitions from bepConfig.js
// Steps 0-2 have different fields for pre-appointment and post-appointment
// Steps 3-13 have shared fields

const PRE_APPOINTMENT_FIELDS = {
  0: [
    { name: 'projectName', label: 'Project Name', required: true, type: 'text', placeholder: 'Greenfield Office Complex Phase 2' },
    { name: 'projectNumber', label: 'Project Number', type: 'text', placeholder: 'GF-2024-017' },
    { name: 'projectType', label: 'Project Type', required: true, type: 'select', options: 'projectTypes' },
    { name: 'appointingParty', label: 'Appointing Party', required: true, type: 'text', placeholder: 'ABC Development Corporation' },
    { name: 'proposedTimeline', label: 'Proposed Project Timeline', type: 'timeline', placeholder: '24 months (Jan 2025 - Dec 2026)' },
    { name: 'estimatedBudget', label: 'Estimated Project Budget', type: 'budget', placeholder: '£12.5 million' },
    { name: 'projectDescription', label: 'Project Description', type: 'textarea', rows: 4, placeholder: 'A modern 8-storey office complex featuring sustainable design principles...' },
    { name: 'tenderApproach', label: 'Our Proposed Approach', type: 'textarea', rows: 3, placeholder: 'Our approach emphasizes collaborative design coordination through advanced BIM workflows...' }
  ],
  1: [
    { name: 'projectContext', label: 'Project Context and Overview', required: true, type: 'textarea', rows: 4, placeholder: 'This BEP outlines our comprehensive approach to delivering the project using advanced BIM methodologies...' },
    { name: 'bimStrategy', label: 'BIM Strategy Summary', required: true, type: 'textarea', rows: 3, placeholder: 'Our BIM strategy centers on early clash detection, integrated 4D/5D modeling...' },
    { name: 'keyCommitments', label: 'Key Commitments and Deliverables', required: true, type: 'introTable', config: { introPlaceholder: 'We commit to full ISO 19650-2:2018 compliance throughout all project phases. Key deliverables include:', tableColumns: ['Deliverable', 'Description', 'Due Date'] } },
    { name: 'keyContacts', label: 'Key Project Contacts', type: 'table', config: { columns: ['Role', 'Name', 'Company', 'Email', 'Phone Number'] } },
    { name: 'valueProposition', label: 'Value Proposition', type: 'textarea', rows: 3, placeholder: 'Our BIM approach will deliver cost reductions through early clash detection...' }
  ],
  2: [
    { name: 'proposedLead', label: 'Proposed Lead Appointed Party', required: true, type: 'text', placeholder: 'Smith & Associates Architects Ltd.' },
    { name: 'proposedInfoManager', label: 'Proposed Information Manager', required: true, type: 'text', placeholder: 'Sarah Johnson, BIM Manager (RICS Certified, ISO 19650 Lead)' },
    { name: 'proposedTeamLeaders', label: 'Proposed Task Team Leaders', type: 'table', config: { columns: ['Discipline', 'Name & Title', 'Company', 'Experience'] } },
    { name: 'proposedResourceAllocation', label: 'Proposed Resource Allocation - Capability and Capacity', type: 'table', config: { columns: ['Role', 'Proposed Personnel', 'Key Competencies/Experience', 'Anticipated Weekly Allocation (Hours)', 'Software/Hardware Requirements', 'Notes'] } },
    { name: 'teamCapabilities', label: 'Team Capabilities and Experience', type: 'textarea', rows: 4, placeholder: 'Our multidisciplinary team brings 15+ years of BIM implementation experience...' },
    { name: 'trackRecordProjects', label: 'Track Record - Similar Projects Experience', type: 'table', config: { columns: ['Project Name', 'Value', 'Completion Date', 'Project Type', 'Our Role', 'Key BIM Achievements'] } },
    { name: 'eirComplianceMatrix', label: 'EIR Compliance Matrix - Demonstration of Capability', type: 'table', config: { columns: ['EIR Requirement', 'Our Proposed Response', 'Evidence/Experience', 'BEP Section Reference'] } },
    { name: 'proposedMobilizationPlan', label: 'Proposed Mobilization Plan', type: 'textarea', rows: 3, placeholder: 'Upon appointment, our mobilization plan includes: Week 1 - Team onboarding and ISO 19650 training...' },
    { name: 'subcontractors', label: 'Proposed Subcontractors/Partners', type: 'table', config: { columns: ['Role/Service', 'Company Name', 'Certification', 'Contact'] } }
  ]
};

const POST_APPOINTMENT_FIELDS = {
  0: [
    { name: 'sectionHeader1', label: 'Project Info', type: 'section-header' },
    { name: 'projectName', label: 'Project Name', required: true, type: 'text', placeholder: 'Greenfield Office Complex Phase 2' },
    { name: 'projectNumber', label: 'Project Number', type: 'text', placeholder: 'GF-2024-017' },
    { name: 'projectType', label: 'Project Type', required: true, type: 'select', options: 'projectTypes' },
    { name: 'appointingParty', label: 'Appointing Party', required: true, type: 'text', placeholder: 'ABC Development Corporation' },
    { name: 'confirmedTimeline', label: 'Confirmed Project Timeline', type: 'timeline', placeholder: '24 months (Jan 2025 - Dec 2026)' },
    { name: 'confirmedBudget', label: 'Confirmed Project Budget', type: 'budget', placeholder: '£12.5 million' },
    { name: 'projectDescription', label: 'Project Description', type: 'textarea', rows: 4, placeholder: 'A modern 8-storey office complex featuring sustainable design principles...' },
    { name: 'deliveryApproach', label: 'Confirmed Delivery Approach', type: 'textarea', rows: 3, placeholder: 'Our delivery approach implements collaborative design coordination through advanced BIM workflows...' }
  ],
  1: [
    { name: 'projectContext', label: 'Project Context and Overview', required: true, type: 'textarea', rows: 4, placeholder: 'This BEP confirms our comprehensive approach to delivering the project using advanced BIM methodologies...' },
    { name: 'bimStrategy', label: 'BIM Strategy Summary', required: true, type: 'textarea', rows: 3, placeholder: 'Our confirmed BIM strategy centres on early clash detection, integrated 4D/5D modelling...' },
    { name: 'keyCommitments', label: 'Key Commitments and Deliverables', required: true, type: 'introTable', config: { introPlaceholder: 'We are committed to full ISO 19650-2:2018 compliance throughout all project phases. Key deliverables include:', tableColumns: ['Deliverable', 'Description', 'Due Date'] } },
    { name: 'keyContacts', label: 'Key Project Contacts', type: 'table', config: { columns: ['Role', 'Name', 'Company', 'Email', 'Phone Number'] } },
    { name: 'valueProposition', label: 'Value Proposition', type: 'textarea', rows: 3, placeholder: 'Our BIM approach will deliver cost reductions through early clash detection...' }
  ],
  2: [
    { name: 'organizationalStructure', label: "Delivery Team's Organisational Structure and Composition", type: 'orgchart' },
    { name: 'leadAppointedPartiesTable', label: 'Lead Appointed Parties and Information Managers', type: 'orgstructure-data-table', config: { readOnly: true } },
    { name: 'taskTeamsBreakdown', label: 'Task Teams', type: 'table', config: { columns: ['Task Team', 'Discipline', 'Leader', 'Leader Contact', 'Company'] } },
    { name: 'resourceAllocationTable', label: 'Resource Allocation - Capability and Capacity Assessment', type: 'table', config: { columns: ['Role', 'Assigned Personnel', 'Key Competencies/Experience', 'Weekly Allocation (Hours)', 'Software/Hardware Requirements', 'Notes'] } },
    { name: 'confirmedTrackRecord', label: 'Confirmed Track Record - Delivered Similar Projects', type: 'table', config: { columns: ['Project Name', 'Value', 'Completion Date', 'Project Type', 'Our Role', 'Key BIM Achievements'] } },
    { name: 'mobilizationPlan', label: 'Mobilization Plan and Risk Mitigation', type: 'textarea', rows: 6, placeholder: 'PHASED MOBILIZATION TIMELINE\n\nWeek 1 - Onboarding and Training:\n  - Team orientation and project kickoff meeting...' },
    { name: 'informationManagementResponsibilities', label: 'Information Management Responsibilities', type: 'textarea', rows: 3, placeholder: 'The Information Manager oversees all aspects of information production, validation, and exchange...' }
  ]
};

const SHARED_FIELDS = {
  3: [
    { name: 'bimGoals', label: 'BIM Goals', required: true, type: 'textarea', rows: 4, placeholder: 'The BIM goals for this project are to enhance design coordination through clash detection...' },
    { name: 'primaryObjectives', label: 'Primary Objectives', type: 'textarea', rows: 3, placeholder: 'Primary objectives include: eliminating design conflicts before construction through rigorous clash detection protocols...' },
    { name: 'bimUses', label: 'BIM Uses', required: true, type: 'checkbox', config: { options: 'bimUses' } },
    { name: 'bimValueApplications', label: 'BIM Applications for Project Value', required: true, type: 'textarea', rows: 4, placeholder: 'BIM will maximize project value through: 4D scheduling for time optimization...' },
    { name: 'valueMetrics', label: 'Success Metrics and Value Measurement', required: true, type: 'table', config: { columns: ['Value Area', 'Target Metric', 'Measurement Method', 'Baseline/Benchmark'] } },
    { name: 'strategicAlignment', label: 'Alignment with Client Strategic Objectives', type: 'textarea', rows: 3, placeholder: 'BIM strategy directly supports client objectives including cost and time reductions...' },
    { name: 'collaborativeProductionGoals', label: 'Objectives/Goals for the Collaborative Production of Information', type: 'textarea', rows: 4, placeholder: 'Collaborative production goals focus on establishing unified data standards across all disciplines...' }
  ],
  4: [
    { name: 'informationPurposes', label: 'Information Purposes', required: true, type: 'checkbox', config: { options: 'informationPurposes' } },
    { name: 'geometricalInfo', label: 'Geometrical Information Requirements', type: 'textarea', rows: 3, placeholder: 'Geometrical information requirements include: LOD 300 for all structural elements during design development...' },
    { name: 'alphanumericalInfo', label: 'Alphanumerical Information Requirements', type: 'textarea', rows: 3, placeholder: 'Alphanumerical information requirements encompass: complete material specifications with thermal and fire ratings...' },
    { name: 'documentationInfo', label: 'Documentation Requirements', type: 'textarea', rows: 3, placeholder: 'Documentation requirements include: technical specification documents for all building systems...' },
    { name: 'informationFormats', label: 'Information Formats', type: 'checkbox', config: { options: 'fileFormats' } },
    { name: 'projectInformationRequirements', label: 'Project Information Requirements (PIR)', type: 'textarea', rows: 4, placeholder: 'Project Information Requirements specify deliverable information to support asset management objectives...' }
  ],
  5: [
    { name: 'keyMilestones', label: 'Key Information Delivery Milestones', required: true, type: 'milestones-table', config: { columns: ['Stage/Phase', 'Milestone Description', 'Deliverables', 'Due Date'] } },
    { name: 'tidpRequirements', label: 'Task Information Delivery Plans (TIDPs)', type: 'tidp-reference', placeholder: 'TIDPs define discipline-specific delivery requirements...' },
    { name: 'tidpDescription', label: 'TIDP Description and Notes', type: 'textarea', rows: 3, placeholder: 'Additional notes about TIDPs, coordination requirements...' },
    { name: 'midpDescription', label: 'Master Information Delivery Plan (MIDP)', required: true, type: 'textarea', rows: 4, placeholder: 'The MIDP establishes a structured schedule for information delivery aligned with RIBA Plan of Work 2020 stages...' },
    { name: 'informationDeliverablesMatrix', label: 'Information Deliverables Responsibility Matrix', type: 'deliverables-matrix', config: { matrixType: 'deliverables' } },
    { name: 'informationManagementMatrix', label: 'Information Management Activities (Annex A)', type: 'im-activities-matrix', config: { matrixType: 'im-activities' } },
    { name: 'mobilisationPlan', label: 'Mobilisation Plan', type: 'textarea', rows: 3, placeholder: 'Project mobilisation occurs over 4 weeks: Week 1 includes CDE setup, template development...' },
    { name: 'teamCapabilitySummary', label: 'Delivery Team Capability & Capacity Summary', type: 'textarea', rows: 3, placeholder: 'The delivery team provides comprehensive BIM capabilities across all disciplines...' },
    { name: 'informationRiskRegister', label: "Delivery Team's Information Risk Register", type: 'table', config: { columns: ['Risk Description', 'Impact', 'Probability', 'Mitigation'] } },
    { name: 'taskTeamExchange', label: 'Exchange of Information Between Task Teams', type: 'textarea', rows: 3, placeholder: 'Information exchange protocols establish: weekly model federation with automated clash detection reports...' },
    { name: 'modelReferencing3d', label: 'Referencing of 3D Information Models', type: 'textarea', rows: 3, placeholder: 'Model referencing procedures ensure consistent spatial coordination: shared coordinate system established from Ordnance Survey grid references...' }
  ],
  6: [
    { name: 'cdeStrategy', label: 'Multi-Platform CDE Strategy', type: 'cdeDiagram', placeholder: 'The project employs a federated CDE approach...' },
    { name: 'cdePlatforms', label: 'CDE Platform Matrix', required: true, type: 'table', config: { columns: ['Platform/Service', 'Usage/Purpose', 'Information Types', 'Workflow States', 'Access Control'] } },
    { name: 'workflowStates', label: 'Unified Workflow States', required: true, type: 'table', config: { columns: ['State Name', 'Description', 'Access Level', 'Next State'] } },
    { name: 'accessControl', label: 'Integrated Access Control', type: 'textarea', rows: 3, placeholder: 'Unified role-based access control across all CDE platforms with Single Sign-On (SSO) integration...' },
    { name: 'securityMeasures', label: 'Multi-Platform Security Framework', type: 'textarea', rows: 3, placeholder: 'End-to-end encryption for data in transit and at rest using AES-256 standards across all platforms...' },
    { name: 'backupProcedures', label: 'Comprehensive Backup Strategy', type: 'textarea', rows: 3, placeholder: 'Automated daily backups with 30-day retention policy across all CDE platforms...' }
  ],
  7: [
    { name: 'bimSoftware', label: 'BIM Software Applications', required: true, type: 'checkbox', config: { options: 'software' } },
    { name: 'fileFormats', label: 'File Formats', required: true, type: 'checkbox', config: { options: 'fileFormats' } },
    { name: 'hardwareRequirements', label: 'Hardware Requirements', type: 'textarea', rows: 3, placeholder: 'Minimum workstation specifications: Intel i7 processor, 32GB RAM...' },
    { name: 'networkRequirements', label: 'Network Requirements', type: 'textarea', rows: 3, placeholder: 'Network infrastructure requirements: minimum 100Mbps bandwidth...' },
    { name: 'interoperabilityNeeds', label: 'Interoperability Requirements', type: 'textarea', rows: 3, placeholder: 'Interoperability requirements ensure seamless data exchange between platforms...' },
    { name: 'softwareHardwareInfrastructure', label: 'Software, Hardware and IT Infrastructure', type: 'table', config: { columns: ['Category', 'Item/Component', 'Specification', 'Purpose'] } }
  ],
  8: [
    { name: 'modelingStandards', label: 'Standards and Guidelines', required: true, type: 'table', config: { columns: ['Standard/Guideline', 'Version', 'Application Area', 'Compliance Level'] } },
    { name: 'namingConventions', label: 'Naming Conventions and Document Control', required: true, type: 'naming-conventions' },
    { name: 'fileStructure', label: 'Folder Structure Description', type: 'textarea', rows: 3, placeholder: 'CDE folder structure organized by project phase, discipline, and information container...' },
    { name: 'fileStructureDiagram', label: 'Folder Structure Diagram', type: 'fileStructure' },
    { name: 'volumeStrategy', label: 'Volume Strategy (Spatial Breakdown)', required: true, type: 'mindmap' },
    { name: 'informationBreakdownStrategy', label: 'Discipline and System Breakdown', type: 'textarea', rows: 3, placeholder: 'Information breakdown organizes models by discipline, zone, and level...' },
    { name: 'federationStrategy', label: 'Federation Approach and Clash Matrix', type: 'federation-strategy', required: true, placeholder: 'Define federation approach, clash detection matrix, and coordination procedures per ISO 19650-2' },
    { name: 'federationProcess', label: 'Federation Workflow Process', type: 'textarea', rows: 3, placeholder: 'Federation process involves weekly model coordination and clash detection...' },
    { name: 'classificationSystems', label: 'Classification Systems Selection', required: true, type: 'table', config: { columns: ['Classification System', 'Application Area', 'Code Format', 'Responsibility'] } },
    { name: 'classificationStandards', label: 'Implementation Standards', type: 'table', config: { columns: ['Element Category', 'Classification System', 'Code Format', 'Example Code', 'Description'] } },
    { name: 'dataExchangeProtocols', label: 'Data Exchange Protocols', type: 'table', config: { columns: ['Exchange Type', 'Format', 'Frequency', 'Delivery Method'] } }
  ],
  9: [
    { name: 'qaFramework', label: 'Quality Assurance Framework', required: true, type: 'table', config: { columns: ['QA Activity', 'Responsibility', 'Frequency', 'Tools/Methods'] } },
    { name: 'modelValidation', label: 'Model Validation Procedures', required: true, type: 'textarea', rows: 4, placeholder: 'Model validation procedures include automated clash detection, standards compliance checks...' },
    { name: 'reviewProcesses', label: 'Review Processes', type: 'textarea', rows: 3, placeholder: 'Review processes involve multi-stage model coordination meetings and technical reviews...' },
    { name: 'approvalWorkflows', label: 'Approval Workflows', type: 'textarea', rows: 3, placeholder: 'Approval workflows follow a staged process with defined sign-off points...' },
    { name: 'complianceVerification', label: 'Compliance Verification', type: 'textarea', rows: 3, placeholder: 'Compliance verification ensures adherence to project standards and requirements...' },
    { name: 'modelReviewAuthorisation', label: 'Information Model Review and Authorisation', type: 'textarea', rows: 3, placeholder: 'Information model review and authorisation follows ISO 19650 approval protocols...' }
  ],
  10: [
    { name: 'dataClassification', label: 'Data Classification', required: true, type: 'table', config: { columns: ['Classification Level', 'Description', 'Examples', 'Access Controls'] } },
    { name: 'accessPermissions', label: 'Access Permissions', required: true, type: 'textarea', rows: 3, placeholder: 'Access permissions are managed through role-based controls with defined user groups...' },
    { name: 'encryptionRequirements', label: 'Encryption Requirements', type: 'textarea', rows: 3, placeholder: 'Encryption requirements mandate AES-256 encryption for data at rest and in transit...' },
    { name: 'dataTransferProtocols', label: 'Data Transfer Protocols', type: 'textarea', rows: 3, placeholder: 'Data transfer protocols use secure HTTPS/SFTP connections with authentication...' },
    { name: 'privacyConsiderations', label: 'Privacy Considerations', type: 'textarea', rows: 3, placeholder: 'Privacy considerations ensure GDPR compliance and data protection measures...' }
  ],
  11: [
    { name: 'bimCompetencyLevels', label: 'BIM Competency Levels', required: true, type: 'textarea', rows: 4, placeholder: 'BIM competency levels defined for all team members following ISO 19650 requirements...' },
    { name: 'trainingRequirements', label: 'Training Requirements', type: 'textarea', rows: 3, placeholder: 'Training requirements include ISO 19650 certification and software-specific training...' },
    { name: 'certificationNeeds', label: 'Certification Requirements', type: 'textarea', rows: 3, placeholder: 'Certification requirements mandate ISO 19650 Lead and Practitioner qualifications...' },
    { name: 'projectSpecificTraining', label: 'Project-Specific Training', type: 'textarea', rows: 3, placeholder: 'Project-specific training covers naming conventions, templates, and workflow procedures...' }
  ],
  12: [
    { name: 'coordinationMeetings', label: 'Coordination Meetings', required: true, type: 'textarea', rows: 3, placeholder: 'Coordination meetings scheduled weekly for design review and clash resolution...' },
    { name: 'issueResolution', label: 'Issue Resolution Process', type: 'textarea', rows: 3, placeholder: 'Issue resolution process follows BCF workflow with tracked assignments and deadlines...' },
    { name: 'communicationProtocols', label: 'Communication Protocols', type: 'textarea', rows: 3, placeholder: 'Communication protocols establish clear channels for design coordination and reporting...' },
    { name: 'informationRisks', label: 'Information-Related Risks', required: true, type: 'textarea', rows: 4, placeholder: 'Information-related risks include data loss, version control issues, and coordination failures...' },
    { name: 'technologyRisks', label: 'Technology-Related Risks', type: 'textarea', rows: 3, placeholder: 'Technology risks include software compatibility issues, system downtime...' },
    { name: 'riskMitigation', label: 'Risk Mitigation Strategies', type: 'textarea', rows: 3, placeholder: 'Risk mitigation strategies include regular backups, redundant systems...' },
    { name: 'contingencyPlans', label: 'Contingency Plans', type: 'textarea', rows: 3, placeholder: 'Contingency plans address potential project disruptions with backup procedures...' },
    { name: 'performanceMetrics', label: 'Performance Metrics and KPIs', type: 'textarea', rows: 3, placeholder: 'Performance metrics track delivery milestones, model quality, and coordination efficiency...' },
    { name: 'monitoringProcedures', label: 'Monitoring Procedures', type: 'textarea', rows: 3, placeholder: 'Monitoring procedures ensure ongoing compliance with project standards and schedules...' },
    { name: 'auditTrails', label: 'Audit Trails', type: 'textarea', rows: 3, placeholder: 'Audit trails maintain complete records of model changes and approvals...' },
    { name: 'changeManagementProcess', label: 'Change Management Process', type: 'textarea', rows: 4, placeholder: 'CHANGE REQUEST PROCEDURE\n\nAll changes to project information requirements must follow formal change management...' },
    { name: 'updateProcesses', label: 'Update Processes', type: 'textarea', rows: 3, placeholder: 'Update processes define how changes are incorporated into models and documentation...' },
    { name: 'projectKpis', label: 'Project Key Performance Indicators (KPIs)', type: 'table', config: { columns: ['KPI Name', 'Target Value', 'Measurement Method', 'Responsibility'] } }
  ],
  13: [
    { name: 'cobieRequirements', label: 'Appendix A: COBie Data Requirements', type: 'table', config: { columns: ['Component Type', 'Required Parameters', 'Data Source', 'Validation Method'] } },
    { name: 'softwareVersionMatrix', label: 'Appendix B: Software Version Compatibility Matrix', type: 'table', config: { columns: ['Software', 'Version', 'File Formats Supported', 'Interoperability Notes'] } },
    { name: 'referencedDocuments', label: 'Appendix C: Referenced Documents and Standards', type: 'standardsTable' }
  ]
};

function seedBepStructure() {
  const now = new Date().toISOString();
  const forceMode = process.argv.includes('--force');

  // Check if data already exists
  const existingSteps = db.prepare('SELECT COUNT(*) as count FROM bep_step_configs WHERE project_id IS NULL AND draft_id IS NULL').get();
  if (existingSteps.count > 0) {
    if (forceMode) {
      console.log('Force mode: Clearing existing default template data...');
      // Delete existing default template data (project_id IS NULL AND draft_id IS NULL)
      db.prepare('DELETE FROM bep_field_configs WHERE project_id IS NULL AND draft_id IS NULL').run();
      db.prepare('DELETE FROM bep_step_configs WHERE project_id IS NULL AND draft_id IS NULL').run();
      console.log('Existing default template data cleared.');
    } else {
      console.log('Default template already exists. Use --force to overwrite.');
      console.log(`Found ${existingSteps.count} existing steps.`);
      return;
    }
  }

  console.log('Seeding BEP structure default template...');

  const stepIdMap = {}; // Maps step index to generated step ID

  // Create steps
  const insertStep = db.prepare(`
    INSERT INTO bep_step_configs
    (id, project_id, step_number, title, description, category, order_index, is_visible, icon, bep_type, created_at, updated_at, is_deleted)
    VALUES (?, NULL, ?, ?, ?, ?, ?, 1, ?, 'both', ?, ?, 0)
  `);

  const insertField = db.prepare(`
    INSERT INTO bep_field_configs
    (id, project_id, step_id, field_id, label, type, number, order_index, is_visible, is_required, placeholder, help_text, config, default_value, bep_type, created_at, updated_at, is_deleted)
    VALUES (?, NULL, ?, ?, ?, ?, ?, ?, 1, ?, ?, NULL, ?, NULL, ?, ?, ?, 0)
  `);

  const transaction = db.transaction(() => {
    // Insert all 14 steps
    STEPS.forEach((step, index) => {
      const stepId = uuidv4();
      stepIdMap[index] = stepId;

      insertStep.run(
        stepId,
        String(step.number),
        step.title,
        step.description,
        step.category,
        index,
        step.icon,
        now,
        now
      );

      console.log(`  Created step ${step.number}: ${step.title}`);
    });

    // Insert pre-appointment fields for steps 0-2
    [0, 1, 2].forEach(stepIndex => {
      const fields = PRE_APPOINTMENT_FIELDS[stepIndex] || [];
      const stepId = stepIdMap[stepIndex];

      fields.forEach((field, fieldIndex) => {
        const fieldId = uuidv4();
        insertField.run(
          fieldId,
          stepId,
          field.name,
          field.label,
          field.type,
          field.number || null,
          fieldIndex,
          field.required ? 1 : 0,
          field.placeholder || null,
          field.config ? JSON.stringify(field.config) : null,
          'pre-appointment',
          now,
          now
        );
      });

      console.log(`    Added ${fields.length} pre-appointment fields to step ${stepIndex}`);
    });

    // Insert post-appointment fields for steps 0-2
    [0, 1, 2].forEach(stepIndex => {
      const fields = POST_APPOINTMENT_FIELDS[stepIndex] || [];
      const stepId = stepIdMap[stepIndex];

      // Get the current max order_index for this step
      const maxOrder = db.prepare(`SELECT MAX(order_index) as max FROM bep_field_configs WHERE step_id = ?`).get(stepId);
      const startOrder = (maxOrder.max !== null ? maxOrder.max + 1 : 0);

      fields.forEach((field, fieldIndex) => {
        const fieldId = uuidv4();
        insertField.run(
          fieldId,
          stepId,
          field.name,
          field.label,
          field.type,
          field.number || null,
          startOrder + fieldIndex,
          field.required ? 1 : 0,
          field.placeholder || null,
          field.config ? JSON.stringify(field.config) : null,
          'post-appointment',
          now,
          now
        );
      });

      console.log(`    Added ${fields.length} post-appointment fields to step ${stepIndex}`);
    });

    // Insert shared fields for steps 3-13
    [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].forEach(stepIndex => {
      const fields = SHARED_FIELDS[stepIndex] || [];
      const stepId = stepIdMap[stepIndex];

      fields.forEach((field, fieldIndex) => {
        const fieldId = uuidv4();
        insertField.run(
          fieldId,
          stepId,
          field.name,
          field.label,
          field.type,
          field.number || null,
          fieldIndex,
          field.required ? 1 : 0,
          field.placeholder || null,
          field.config ? JSON.stringify(field.config) : null,
          'shared',
          now,
          now
        );
      });

      console.log(`    Added ${fields.length} shared fields to step ${stepIndex}`);
    });
  });

  try {
    transaction();
    console.log('\nBEP structure seeding completed successfully!');

    // Print summary
    const stepCount = db.prepare('SELECT COUNT(*) as count FROM bep_step_configs WHERE project_id IS NULL').get();
    const fieldCount = db.prepare('SELECT COUNT(*) as count FROM bep_field_configs WHERE project_id IS NULL').get();
    console.log(`\nSummary:`);
    console.log(`  Steps created: ${stepCount.count}`);
    console.log(`  Fields created: ${fieldCount.count}`);
  } catch (error) {
    console.error('Error seeding BEP structure:', error);
    throw error;
  }
}

// Run the seed
seedBepStructure();
