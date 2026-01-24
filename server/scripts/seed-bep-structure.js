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
    { number: '1.1', name: 'projectName', label: 'Project Name', required: true, type: 'text', placeholder: 'Greenfield Office Complex Phase 2' },
    { number: '1.1', name: 'projectNumber', label: 'Project Number', type: 'text', placeholder: 'GF-2024-017' },
    { number: '1.1', name: 'projectType', label: 'Project Type', required: true, type: 'select', options: 'projectTypes' },
    { number: '1.1', name: 'appointingParty', label: 'Appointing Party', required: true, type: 'text', placeholder: 'ABC Development Corporation' },
    { number: '1.1', name: 'proposedTimeline', label: 'Proposed Project Timeline', type: 'timeline', placeholder: '24 months (Jan 2025 - Dec 2026)' },
    { number: '1.1', name: 'estimatedBudget', label: 'Estimated Project Budget', type: 'budget', placeholder: '£12.5 million' },
    { number: '1.1', name: 'projectDescription', label: 'Project Description', type: 'textarea', rows: 4, placeholder: 'A modern 8-storey office complex featuring sustainable design principles...' },
    { number: '1.1', name: 'tenderApproach', label: 'Our Proposed Approach', type: 'textarea', rows: 3, placeholder: 'Our approach emphasizes collaborative design coordination through advanced BIM workflows...' }
  ],
  1: [
    { number: '2.1', name: 'projectContext', label: 'Project Context and Overview', required: true, type: 'textarea', rows: 4, placeholder: 'This BEP outlines our comprehensive approach to delivering the project using advanced BIM methodologies...' },
    { number: '2.1', name: 'bimStrategy', label: 'BIM Strategy Summary', required: true, type: 'textarea', rows: 3, placeholder: 'Our BIM strategy centers on early clash detection, integrated 4D/5D modeling...' },
    { number: '2.1', name: 'keyCommitments', label: 'Key Commitments and Deliverables', required: true, type: 'introTable', config: { introPlaceholder: 'We commit to full ISO 19650-2:2018 compliance throughout all project phases. Key deliverables include:', tableColumns: ['Deliverable', 'Description', 'Due Date'] } },
    { number: '2.1', name: 'keyContacts', label: 'Key Project Contacts', type: 'table', config: { columns: ['Role', 'Name', 'Company', 'Email', 'Phone Number'] } },
    { number: '2.1', name: 'valueProposition', label: 'Value Proposition', type: 'textarea', rows: 3, placeholder: 'Our BIM approach will deliver cost reductions through early clash detection...' }
  ],
  2: [
    { number: '3.1', name: 'proposedLead', label: 'Proposed Lead Appointed Party', required: true, type: 'text', placeholder: 'Smith & Associates Architects Ltd.' },
    { number: '3.1', name: 'proposedInfoManager', label: 'Proposed Information Manager', required: true, type: 'text', placeholder: 'Sarah Johnson, BIM Manager (RICS Certified, ISO 19650 Lead)' },
    { number: '3.1', name: 'proposedTeamLeaders', label: 'Proposed Task Team Leaders', type: 'table', config: { columns: ['Discipline', 'Name & Title', 'Company', 'Experience'] } },
    { number: '3.1', name: 'proposedResourceAllocation', label: 'Proposed Resource Allocation - Capability and Capacity', type: 'table', config: { columns: ['Role', 'Proposed Personnel', 'Key Competencies/Experience', 'Anticipated Weekly Allocation (Hours)', 'Software/Hardware Requirements', 'Notes'] } },
    { number: '3.1', name: 'teamCapabilities', label: 'Team Capabilities and Experience', type: 'textarea', rows: 4, placeholder: 'Our multidisciplinary team brings 15+ years of BIM implementation experience...' },
    { number: '3.2', name: 'trackRecordProjects', label: 'Track Record - Similar Projects Experience', type: 'table', config: { columns: ['Project Name', 'Value', 'Completion Date', 'Project Type', 'Our Role', 'Key BIM Achievements'] } },
    { number: '3.3', name: 'eirComplianceMatrix', label: 'EIR Compliance Matrix - Demonstration of Capability', type: 'table', config: { columns: ['EIR Requirement', 'Our Proposed Response', 'Evidence/Experience', 'BEP Section Reference'] } },
    { number: '3.4', name: 'proposedMobilizationPlan', label: 'Proposed Mobilization Plan', type: 'textarea', rows: 3, placeholder: 'Upon appointment, our mobilization plan includes: Week 1 - Team onboarding and ISO 19650 training...' },
    { number: '3.5', name: 'subcontractors', label: 'Proposed Subcontractors/Partners', type: 'table', config: { columns: ['Role/Service', 'Company Name', 'Certification', 'Contact'] } }
  ]
};

const POST_APPOINTMENT_FIELDS = {
  0: [
    { number: '1.1', name: 'sectionHeader1', label: 'Project Info', type: 'section-header' },
    { number: '', name: 'projectName', label: 'Project Name', required: true, type: 'text', placeholder: 'Greenfield Office Complex Phase 2' },
    { number: '', name: 'projectNumber', label: 'Project Number', type: 'text', placeholder: 'GF-2024-017' },
    { number: '', name: 'projectType', label: 'Project Type', required: true, type: 'select', options: 'projectTypes' },
    { number: '', name: 'appointingParty', label: 'Appointing Party', required: true, type: 'text', placeholder: 'ABC Development Corporation' },
    { number: '', name: 'confirmedTimeline', label: 'Confirmed Project Timeline', type: 'timeline', placeholder: '24 months (Jan 2025 - Dec 2026)' },
    { number: '', name: 'confirmedBudget', label: 'Confirmed Project Budget', type: 'budget', placeholder: '£12.5 million' },
    { number: '1.2', name: 'projectDescription', label: 'Project Description', type: 'textarea', rows: 4, placeholder: 'A modern 8-storey office complex featuring sustainable design principles...' },
    { number: '1.3', name: 'deliveryApproach', label: 'Confirmed Delivery Approach', type: 'textarea', rows: 3, placeholder: 'Our delivery approach implements collaborative design coordination through advanced BIM workflows...' }
  ],
  1: [
    { number: '2.1', name: 'projectContext', label: 'Project Context and Overview', required: true, type: 'textarea', rows: 4, placeholder: 'This BEP confirms our comprehensive approach to delivering the project using advanced BIM methodologies...' },
    { number: '2.2', name: 'bimStrategy', label: 'BIM Strategy Summary', required: true, type: 'textarea', rows: 3, placeholder: 'Our confirmed BIM strategy centres on early clash detection, integrated 4D/5D modelling...' },
    { number: '2.3', name: 'keyCommitments', label: 'Key Commitments and Deliverables', required: true, type: 'introTable', config: { introPlaceholder: 'We are committed to full ISO 19650-2:2018 compliance throughout all project phases. Key deliverables include:', tableColumns: ['Deliverable', 'Description', 'Due Date'] } },
    { number: '2.4', name: 'keyContacts', label: 'Key Project Contacts', type: 'table', config: { columns: ['Role', 'Name', 'Company', 'Email', 'Phone Number'] } },
    { number: '2.5', name: 'valueProposition', label: 'Value Proposition', type: 'textarea', rows: 3, placeholder: 'Our BIM approach will deliver cost reductions through early clash detection...' }
  ],
  2: [
    { number: '3.1', name: 'organizationalStructure', label: "Delivery Team's Organisational Structure and Composition", type: 'orgchart' },
    { number: '3.2', name: 'leadAppointedPartiesTable', label: 'Lead Appointed Parties and Information Managers', type: 'orgstructure-data-table', config: { readOnly: true } },
    { number: '3.3', name: 'taskTeamsBreakdown', label: 'Task Teams', type: 'table', config: { columns: ['Task Team', 'Discipline', 'Leader', 'Leader Contact', 'Company'] } },
    { number: '3.4', name: 'resourceAllocationTable', label: 'Resource Allocation - Capability and Capacity Assessment', type: 'table', config: { columns: ['Role', 'Assigned Personnel', 'Key Competencies/Experience', 'Weekly Allocation (Hours)', 'Software/Hardware Requirements', 'Notes'] } },
    { number: '3.5', name: 'confirmedTrackRecord', label: 'Confirmed Track Record - Delivered Similar Projects', type: 'table', config: { columns: ['Project Name', 'Value', 'Completion Date', 'Project Type', 'Our Role', 'Key BIM Achievements'] } },
    { number: '3.6', name: 'mobilizationPlan', label: 'Mobilization Plan and Risk Mitigation', type: 'textarea', rows: 6, placeholder: 'PHASED MOBILIZATION TIMELINE\n\nWeek 1 - Onboarding and Training:\n  - Team orientation and project kickoff meeting...' },
    { number: '3.7', name: 'informationManagementResponsibilities', label: 'Information Management Responsibilities', type: 'textarea', rows: 3, placeholder: 'The Information Manager oversees all aspects of information production, validation, and exchange...' }
  ]
};

const SHARED_FIELDS = {
  3: [
    { number: '4.1', name: 'bimGoals', label: 'BIM Goals', required: true, type: 'textarea', rows: 4, placeholder: 'The BIM goals for this project are to enhance design coordination through clash detection...' },
    { number: '4.2', name: 'primaryObjectives', label: 'Primary Objectives', type: 'textarea', rows: 3, placeholder: 'Primary objectives include: eliminating design conflicts before construction through rigorous clash detection protocols...' },
    { number: '4.3', name: 'bimUses', label: 'BIM Uses', required: true, type: 'checkbox', config: { options: 'bimUses' } },
    { number: '4.4', name: 'bimValueApplications', label: 'BIM Applications for Project Value', required: true, type: 'textarea', rows: 4, placeholder: 'BIM will maximize project value through: 4D scheduling for time optimization...' },
    { number: '4.5', name: 'valueMetrics', label: 'Success Metrics and Value Measurement', required: true, type: 'table', config: { columns: ['Value Area', 'Target Metric', 'Measurement Method', 'Baseline/Benchmark'] } },
    { number: '4.6', name: 'strategicAlignment', label: 'Alignment with Client Strategic Objectives', type: 'textarea', rows: 3, placeholder: 'BIM strategy directly supports client objectives including cost and time reductions...' },
    { number: '4.7', name: 'collaborativeProductionGoals', label: 'Objectives/Goals for the Collaborative Production of Information', type: 'textarea', rows: 4, placeholder: 'Collaborative production goals focus on establishing unified data standards across all disciplines...' }
  ],
  4: [
    { number: '5.1', name: 'informationPurposes', label: 'Information Purposes', required: true, type: 'checkbox', config: { options: 'informationPurposes' } },
    { number: '5.2', name: 'geometricalInfo', label: 'Geometrical Information Requirements', type: 'textarea', rows: 3, placeholder: 'Geometrical information requirements include: LOD 300 for all structural elements during design development...' },
    { number: '5.3', name: 'alphanumericalInfo', label: 'Alphanumerical Information Requirements', type: 'textarea', rows: 3, placeholder: 'Alphanumerical information requirements encompass: complete material specifications with thermal and fire ratings...' },
    { number: '5.4', name: 'documentationInfo', label: 'Documentation Requirements', type: 'textarea', rows: 3, placeholder: 'Documentation requirements include: technical specification documents for all building systems...' },
    { number: '5.5', name: 'informationFormats', label: 'Information Formats', type: 'checkbox', config: { options: 'fileFormats' } },
    { number: '5.6', name: 'projectInformationRequirements', label: 'Project Information Requirements (PIR)', type: 'textarea', rows: 4, placeholder: 'Project Information Requirements specify deliverable information to support asset management objectives...' }
  ],
  5: [
    { number: '6.1', name: 'keyMilestones', label: 'Key Information Delivery Milestones', required: true, type: 'milestones-table', config: { columns: ['Stage/Phase', 'Milestone Description', 'Deliverables', 'Due Date'] } },
    { number: '6.2', name: 'tidpRequirements', label: 'Task Information Delivery Plans (TIDPs)', type: 'tidp-reference', placeholder: 'TIDPs define discipline-specific delivery requirements...' },
    { number: '6.3', name: 'tidpDescription', label: 'TIDP Description and Notes', type: 'textarea', rows: 3, placeholder: 'Additional notes about TIDPs, coordination requirements...' },
    { number: '6.4', name: 'midpDescription', label: 'Master Information Delivery Plan (MIDP)', required: true, type: 'textarea', rows: 4, placeholder: 'The MIDP establishes a structured schedule for information delivery aligned with RIBA Plan of Work 2020 stages...' },
    { number: '6.5', name: 'informationDeliverablesMatrix', label: 'Information Deliverables Responsibility Matrix', type: 'deliverables-matrix', config: { matrixType: 'deliverables' } },
    { number: '6.6', name: 'informationManagementMatrix', label: 'Information Management Activities (Annex A)', type: 'im-activities-matrix', config: { matrixType: 'im-activities' } },
    { number: '6.7', name: 'mobilisationPlan', label: 'Mobilisation Plan', type: 'textarea', rows: 3, placeholder: 'Project mobilisation occurs over 4 weeks: Week 1 includes CDE setup, template development...' },
    { number: '6.8', name: 'teamCapabilitySummary', label: 'Delivery Team Capability & Capacity Summary', type: 'textarea', rows: 3, placeholder: 'The delivery team provides comprehensive BIM capabilities across all disciplines...' },
    { number: '6.9', name: 'informationRiskRegister', label: "Delivery Team's Information Risk Register", type: 'table', config: { columns: ['Risk Description', 'Impact', 'Probability', 'Mitigation'] } },
    { number: '6.10', name: 'taskTeamExchange', label: 'Exchange of Information Between Task Teams', type: 'textarea', rows: 3, placeholder: 'Information exchange protocols establish: weekly model federation with automated clash detection reports...' },
    { number: '6.11', name: 'modelReferencing3d', label: 'Referencing of 3D Information Models', type: 'textarea', rows: 3, placeholder: 'Model referencing procedures ensure consistent spatial coordination: shared coordinate system established from Ordnance Survey grid references...' }
  ],
  6: [
    { number: '7.1', name: 'cdeStrategy', label: 'Multi-Platform CDE Strategy', type: 'cdeDiagram', placeholder: 'The project employs a federated CDE approach...' },
    { number: '7.2', name: 'cdePlatforms', label: 'CDE Platform Matrix', required: true, type: 'table', config: { columns: ['Platform/Service', 'Usage/Purpose', 'Information Types', 'Workflow States', 'Access Control'] } },
    { number: '7.3', name: 'workflowStates', label: 'Unified Workflow States', required: true, type: 'table', config: { columns: ['State Name', 'Description', 'Access Level', 'Next State'] } },
    { number: '7.4', name: 'accessControl', label: 'Integrated Access Control', type: 'textarea', rows: 3, placeholder: 'Unified role-based access control across all CDE platforms with Single Sign-On (SSO) integration...' },
    { number: '7.5', name: 'securityMeasures', label: 'Multi-Platform Security Framework', type: 'textarea', rows: 3, placeholder: 'End-to-end encryption for data in transit and at rest using AES-256 standards across all platforms...' },
    { number: '7.6', name: 'backupProcedures', label: 'Comprehensive Backup Strategy', type: 'textarea', rows: 3, placeholder: 'Automated daily backups with 30-day retention policy across all CDE platforms...' }
  ],
  7: [
    { number: '8.1', name: 'bimSoftware', label: 'BIM Software Applications', required: true, type: 'checkbox', config: { options: 'software' } },
    { number: '8.2', name: 'fileFormats', label: 'File Formats', required: true, type: 'checkbox', config: { options: 'fileFormats' } },
    { number: '8.3', name: 'hardwareRequirements', label: 'Hardware Requirements', type: 'textarea', rows: 3, placeholder: 'Minimum workstation specifications: Intel i7 processor, 32GB RAM...' },
    { number: '8.4', name: 'networkRequirements', label: 'Network Requirements', type: 'textarea', rows: 3, placeholder: 'Network infrastructure requirements: minimum 100Mbps bandwidth...' },
    { number: '8.5', name: 'interoperabilityNeeds', label: 'Interoperability Requirements', type: 'textarea', rows: 3, placeholder: 'Interoperability requirements ensure seamless data exchange between platforms...' },
    { number: '8.6', name: 'softwareHardwareInfrastructure', label: 'Software, Hardware and IT Infrastructure', type: 'table', config: { columns: ['Category', 'Item/Component', 'Specification', 'Purpose'] } }
  ],
  8: [
    { number: '9.1', name: 'modelingStandards', label: 'Standards and Guidelines', required: true, type: 'table', config: { columns: ['Standard/Guideline', 'Version', 'Application Area', 'Compliance Level'] } },
    { number: '9.2', name: 'namingConventions', label: 'Naming Conventions and Document Control', required: true, type: 'naming-conventions' },
    { number: '9.3', name: 'fileStructure', label: 'Folder Structure Description', type: 'textarea', rows: 3, placeholder: 'CDE folder structure organized by project phase, discipline, and information container...' },
    { number: '9.4', name: 'fileStructureDiagram', label: 'Folder Structure Diagram', type: 'fileStructure' },
    { number: '9.5', name: 'volumeStrategy', label: 'Volume Strategy (Spatial Breakdown)', required: true, type: 'mindmap' },
    { number: '9.6', name: 'informationBreakdownStrategy', label: 'Discipline and System Breakdown', type: 'textarea', rows: 3, placeholder: 'Information breakdown organizes models by discipline, zone, and level...' },
    { number: '9.7', name: 'federationStrategy', label: 'Federation Approach and Clash Matrix', type: 'federation-strategy', required: true, placeholder: 'Define federation approach, clash detection matrix, and coordination procedures per ISO 19650-2' },
    { number: '9.8', name: 'federationProcess', label: 'Federation Workflow Process', type: 'textarea', rows: 3, placeholder: 'Federation process involves weekly model coordination and clash detection...' },
    { number: '9.9', name: 'classificationSystems', label: 'Classification Systems Selection', required: true, type: 'table', config: { columns: ['Classification System', 'Application Area', 'Code Format', 'Responsibility'] } },
    { number: '9.10', name: 'classificationStandards', label: 'Implementation Standards', type: 'table', config: { columns: ['Element Category', 'Classification System', 'Code Format', 'Example Code', 'Description'] } },
    { number: '9.11', name: 'dataExchangeProtocols', label: 'Data Exchange Protocols', type: 'table', config: { columns: ['Exchange Type', 'Format', 'Frequency', 'Delivery Method'] } }
  ],
  9: [
    { number: '10.1', name: 'qaFramework', label: 'Quality Assurance Framework', required: true, type: 'table', config: { columns: ['QA Activity', 'Responsibility', 'Frequency', 'Tools/Methods'] } },
    { number: '10.2', name: 'modelValidation', label: 'Model Validation Procedures', required: true, type: 'textarea', rows: 4, placeholder: 'Model validation procedures include automated clash detection, standards compliance checks...' },
    { number: '10.3', name: 'reviewProcesses', label: 'Review Processes', type: 'textarea', rows: 3, placeholder: 'Review processes involve multi-stage model coordination meetings and technical reviews...' },
    { number: '10.4', name: 'approvalWorkflows', label: 'Approval Workflows', type: 'textarea', rows: 3, placeholder: 'Approval workflows follow a staged process with defined sign-off points...' },
    { number: '10.5', name: 'complianceVerification', label: 'Compliance Verification', type: 'textarea', rows: 3, placeholder: 'Compliance verification ensures adherence to project standards and requirements...' },
    { number: '10.6', name: 'modelReviewAuthorisation', label: 'Information Model Review and Authorisation', type: 'textarea', rows: 3, placeholder: 'Information model review and authorisation follows ISO 19650 approval protocols...' }
  ],
  10: [
    { number: '11.1', name: 'dataClassification', label: 'Data Classification', required: true, type: 'table', config: { columns: ['Classification Level', 'Description', 'Examples', 'Access Controls'] } },
    { number: '11.2', name: 'accessPermissions', label: 'Access Permissions', required: true, type: 'textarea', rows: 3, placeholder: 'Access permissions are managed through role-based controls with defined user groups...' },
    { number: '11.3', name: 'encryptionRequirements', label: 'Encryption Requirements', type: 'textarea', rows: 3, placeholder: 'Encryption requirements mandate AES-256 encryption for data at rest and in transit...' },
    { number: '11.4', name: 'dataTransferProtocols', label: 'Data Transfer Protocols', type: 'textarea', rows: 3, placeholder: 'Data transfer protocols use secure HTTPS/SFTP connections with authentication...' },
    { number: '11.5', name: 'privacyConsiderations', label: 'Privacy Considerations', type: 'textarea', rows: 3, placeholder: 'Privacy considerations ensure GDPR compliance and data protection measures...' }
  ],
  11: [
    { number: '12.1', name: 'bimCompetencyLevels', label: 'BIM Competency Levels', required: true, type: 'textarea', rows: 4, placeholder: 'BIM competency levels defined for all team members following ISO 19650 requirements...' },
    { number: '12.2', name: 'trainingRequirements', label: 'Training Requirements', type: 'textarea', rows: 3, placeholder: 'Training requirements include ISO 19650 certification and software-specific training...' },
    { number: '12.3', name: 'certificationNeeds', label: 'Certification Requirements', type: 'textarea', rows: 3, placeholder: 'Certification requirements mandate ISO 19650 Lead and Practitioner qualifications...' },
    { number: '12.4', name: 'projectSpecificTraining', label: 'Project-Specific Training', type: 'textarea', rows: 3, placeholder: 'Project-specific training covers naming conventions, templates, and workflow procedures...' }
  ],
  12: [
    { number: '13.1', name: 'coordinationMeetings', label: 'Coordination Meetings', required: true, type: 'textarea', rows: 3, placeholder: 'Coordination meetings scheduled weekly for design review and clash resolution...' },
    { number: '13.2', name: 'issueResolution', label: 'Issue Resolution Process', type: 'textarea', rows: 3, placeholder: 'Issue resolution process follows BCF workflow with tracked assignments and deadlines...' },
    { number: '13.3', name: 'communicationProtocols', label: 'Communication Protocols', type: 'textarea', rows: 3, placeholder: 'Communication protocols establish clear channels for design coordination and reporting...' },
    { number: '13.4', name: 'informationRisks', label: 'Information-Related Risks', required: true, type: 'textarea', rows: 4, placeholder: 'Information-related risks include data loss, version control issues, and coordination failures...' },
    { number: '13.5', name: 'technologyRisks', label: 'Technology-Related Risks', type: 'textarea', rows: 3, placeholder: 'Technology risks include software compatibility issues, system downtime...' },
    { number: '13.6', name: 'riskMitigation', label: 'Risk Mitigation Strategies', type: 'textarea', rows: 3, placeholder: 'Risk mitigation strategies include regular backups, redundant systems...' },
    { number: '13.7', name: 'contingencyPlans', label: 'Contingency Plans', type: 'textarea', rows: 3, placeholder: 'Contingency plans address potential project disruptions with backup procedures...' },
    { number: '13.8', name: 'performanceMetrics', label: 'Performance Metrics and KPIs', type: 'textarea', rows: 3, placeholder: 'Performance metrics track delivery milestones, model quality, and coordination efficiency...' },
    { number: '13.9', name: 'monitoringProcedures', label: 'Monitoring Procedures', type: 'textarea', rows: 3, placeholder: 'Monitoring procedures ensure ongoing compliance with project standards and schedules...' },
    { number: '13.10', name: 'auditTrails', label: 'Audit Trails', type: 'textarea', rows: 3, placeholder: 'Audit trails maintain complete records of model changes and approvals...' },
    { number: '13.11', name: 'changeManagementProcess', label: 'Change Management Process', type: 'textarea', rows: 4, placeholder: 'CHANGE REQUEST PROCEDURE\n\nAll changes to project information requirements must follow formal change management...' },
    { number: '13.12', name: 'updateProcesses', label: 'Update Processes', type: 'textarea', rows: 3, placeholder: 'Update processes define how changes are incorporated into models and documentation...' },
    { number: '13.13', name: 'projectKpis', label: 'Project Key Performance Indicators (KPIs)', type: 'table', config: { columns: ['KPI Name', 'Target Value', 'Measurement Method', 'Responsibility'] } }
  ],
  13: [
    { number: '', name: 'cobieRequirements', label: 'Appendix A: COBie Data Requirements', type: 'table', config: { columns: ['Component Type', 'Required Parameters', 'Data Source', 'Validation Method'] } },
    { number: '', name: 'softwareVersionMatrix', label: 'Appendix B: Software Version Compatibility Matrix', type: 'table', config: { columns: ['Software', 'Version', 'File Formats Supported', 'Interoperability Notes'] } },
    { number: '', name: 'referencedDocuments', label: 'Appendix C: Referenced Documents and Standards', type: 'standardsTable' }
  ]
};

function seedBepStructure() {
  const now = new Date().toISOString();

  // Check if data already exists
  const existingSteps = db.prepare('SELECT COUNT(*) as count FROM bep_step_configs WHERE project_id IS NULL').get();
  if (existingSteps.count > 0) {
    console.log('Default template already exists. Skipping seed.');
    console.log(`Found ${existingSteps.count} existing steps.`);
    return;
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
