// Form field definitions (no React/lucide). Server-safe.

// BEP-type-specific fields for steps 0–2
export const formFields = {
  'pre-appointment': {
    0: {
      number: '1',
      title: 'Project Information and Proposed Approach',
      fields: [
        { number: '1.1', name: 'projectName', label: 'Project Name', required: true, type: 'text', placeholder: 'Greenfield Office Complex Phase 2' },
        { number: '1.1', name: 'projectNumber', label: 'Project Number', type: 'text', placeholder: 'GF-2024-017' },
        { number: '1.1', name: 'projectType', label: 'Project Type', required: true, type: 'select', options: 'projectTypes' },
        { number: '1.1', name: 'appointingParty', label: 'Appointing Party', required: true, type: 'text', placeholder: 'ABC Development Corporation' },
        { number: '1.1', name: 'eirPirReference', label: 'BEP Purpose — Response to EIR and PIR (and OIR/AIR where applicable)', type: 'textarea', rows: 3, placeholder: 'This BEP is prepared in response to the Exchange Information Requirements (EIR) ref. [EIR-REF] issued by [Appointing Party] and the Project Information Requirements (PIR) ref. [PIR-REF] dated [date]. Where the appointing party has issued Organisational Information Requirements (OIR) or Asset Information Requirements (AIR), these feed into the PIR and are reflected in the EIR; this BEP sets out the delivery team\'s proposed approach to meeting those requirements in accordance with ISO 19650-2:2018.' },
        { number: '1.2', type: 'static-diagram', diagramKey: 'documentHierarchy', label: 'Information Requirements Document Hierarchy' },
        { number: '1.3', name: 'signpostedDocuments', label: 'Related Documents Signposted by this BEP', type: 'table', columns: ['Document', 'Reference / Title', 'Location / CDE Path', 'Status'] },
        { number: '1.4', type: 'info-banner', label: 'ISO 19650 Requirement: A separate BEP must be prepared and maintained for each direct appointment within the project. This document covers the appointment of [Appointed Party] only.' },
        { number: '1.5', name: 'iso19650Definitions', label: 'ISO 19650 Party Definitions', type: 'table', columns: ['Term', 'ISO 19650 Definition', 'Role on This Project'] },
        { number: '1.6', type: 'static-diagram', diagramKey: 'partyInterface', label: 'ISO 19650-2:2018 — Interfaces Between Parties' },
        { number: '1.1', name: 'proposedTimeline', label: 'Proposed Project Timeline', type: 'timeline', placeholder: '24 months (Jan 2025 - Dec 2026)' },
        { number: '1.1', name: 'estimatedBudget', label: 'Estimated Project Budget', type: 'budget', placeholder: '£12.5 million' },
        { number: '1.1', name: 'projectDescription', label: 'Project Description', type: 'textarea', rows: 4, placeholder: 'A modern 8-storey office complex featuring sustainable design principles...' },
        { number: '1.1', name: 'tenderApproach', label: 'Our Proposed Approach', type: 'textarea', rows: 3, placeholder: 'Our approach emphasizes collaborative design coordination through advanced BIM workflows...' }
      ]
    },
    1: {
      number: '2',
      title: 'Executive Summary',
      fields: [
        { number: '2.1', name: 'projectContext', label: 'Project Context and Overview', required: true, type: 'textarea', rows: 4, placeholder: 'This BEP outlines our comprehensive approach to delivering the project using advanced BIM methodologies...' },
        { number: '2.1', name: 'bimStrategy', label: 'BIM Strategy Summary', required: true, type: 'textarea', rows: 3, placeholder: 'Our BIM strategy centers on early clash detection, integrated 4D/5D modeling...' },
        { number: '2.1', name: 'keyCommitments', label: 'Key Commitments and Deliverables', required: true, type: 'introTable', introPlaceholder: 'We commit to full ISO 19650-2:2018 compliance throughout all project phases. Key deliverables include:', tableColumns: ['Deliverable', 'Description', 'Due Date'] },
        { number: '2.1', name: 'keyContacts', label: 'Key Project Contacts', type: 'table', columns: ['Role', 'Name', 'Company', 'Email', 'Phone Number'] },
        { number: '2.1', name: 'valueProposition', label: 'Value Proposition', type: 'textarea', rows: 3, placeholder: 'Our BIM approach will deliver cost reductions through early clash detection...' }
      ]
    },
    2: {
      number: '3',
      title: 'Proposed Team and Capabilities',
      fields: [
        { number: '3.1', name: 'proposedLead', label: 'Proposed Lead Appointed Party', required: true, type: 'text', placeholder: 'Smith & Associates Architects Ltd.' },
        { number: '3.1', name: 'proposedInfoManager', label: 'Proposed Information Manager', required: true, type: 'text', placeholder: 'Sarah Johnson, BIM Manager (RICS Certified, ISO 19650 Lead)' },
        { number: '3.1', name: 'proposedTeamLeaders', label: 'Proposed Task Team Leaders', type: 'table', columns: ['Discipline', 'Name & Title', 'Company', 'Experience'] },
        {
          number: '3.1',
          name: 'proposedResourceAllocation',
          label: 'Proposed Resource Allocation - Capability and Capacity',
          type: 'table',
          columns: ['Role', 'Proposed Personnel', 'Key Competencies/Experience', 'Anticipated Weekly Allocation (Hours)', 'Software/Hardware Requirements', 'Notes']
        },
        { number: '3.1', name: 'teamCapabilities', label: 'Team Capabilities and Experience', type: 'textarea', rows: 4, placeholder: 'Our multidisciplinary team brings 15+ years of BIM implementation experience...' },
        { number: '3.2', name: 'trackRecordProjects', label: 'Track Record - Similar Projects Experience', type: 'table', columns: ['Project Name', 'Value', 'Completion Date', 'Project Type', 'Our Role', 'Key BIM Achievements'] },
        { number: '3.3', name: 'eirComplianceMatrix', label: 'EIR Compliance Matrix - Demonstration of Capability', type: 'table', columns: ['EIR Requirement', 'Our Proposed Response', 'Evidence/Experience', 'BEP Section Reference'] },
        {
          number: '3.4',
          name: 'proposedMobilizationPlan',
          label: 'Proposed Mobilization Plan',
          type: 'textarea',
          rows: 3,
          placeholder: 'Upon appointment, our mobilization plan includes: Week 1 - Team onboarding and ISO 19650 training...'
        },
        { number: '3.5', name: 'subcontractors', label: 'Proposed Subcontractors/Partners', type: 'table', columns: ['Role/Service', 'Company Name', 'Certification', 'Contact'] }
      ]
    }
  },
  'post-appointment': {
    0: {
      number: '1',
      title: 'Project Information and Confirmed Objectives',
      fields: [
        { number: '1.1', type: 'section-header', label: 'Project Info' },
        { number: '', name: 'projectName', label: 'Project Name', required: true, type: 'text', placeholder: 'Greenfield Office Complex Phase 2' },
        { number: '', name: 'projectNumber', label: 'Project Number', type: 'text', placeholder: 'GF-2024-017' },
        { number: '', name: 'projectType', label: 'Project Type', required: true, type: 'select', options: 'projectTypes' },
        { number: '', name: 'appointingParty', label: 'Appointing Party', required: true, type: 'text', placeholder: 'ABC Development Corporation' },
        { number: '1.1', name: 'eirPirReference', label: 'BEP Purpose — Confirmed response to EIR and PIR (and OIR/AIR where applicable)', type: 'textarea', rows: 3, placeholder: 'This BEP confirms our response to the Exchange Information Requirements (EIR) ref. [EIR-REF] issued by [Appointing Party] and the Project Information Requirements (PIR) ref. [PIR-REF] dated [date]. Where OIR or AIR apply, they are reflected in the PIR and EIR; this document sets out the delivery team\'s confirmed approach and includes the MIDP/TIDP, Information Standard response, and IPMP in accordance with ISO 19650-2:2018.' },
        { number: '1.2', type: 'static-diagram', diagramKey: 'documentHierarchy', label: 'Information Requirements Document Hierarchy' },
        { number: '1.3', name: 'signpostedDocuments', label: 'Related Documents Signposted by this BEP', type: 'table', columns: ['Document', 'Reference / Title', 'Location / CDE Path', 'Status'] },
        { number: '1.4', type: 'info-banner', label: 'ISO 19650 Requirement: A separate BEP must be prepared and maintained for each direct appointment within the project. This document covers the appointment of [Appointed Party] only.' },
        { number: '1.5', name: 'iso19650Definitions', label: 'ISO 19650 Party Definitions', type: 'table', columns: ['Term', 'ISO 19650 Definition', 'Role on This Project'] },
        { number: '1.6', type: 'static-diagram', diagramKey: 'partyInterface', label: 'ISO 19650-2:2018 — Interfaces Between Parties' },
        { number: '', name: 'confirmedTimeline', label: 'Confirmed Project Timeline', type: 'timeline', placeholder: '24 months (Jan 2025 - Dec 2026)' },
        { number: '', name: 'confirmedBudget', label: 'Confirmed Project Budget', type: 'budget', placeholder: '£12.5 million' },
        { number: '1.2', name: 'projectDescription', label: 'Project Description', type: 'textarea', rows: 4, placeholder: 'A modern 8-storey office complex featuring sustainable design principles...' },
        { number: '1.3', name: 'deliveryApproach', label: 'Confirmed Delivery Approach', type: 'textarea', rows: 3, placeholder: 'Our delivery approach implements collaborative design coordination through advanced BIM workflows...' }
      ]
    },
    1: {
      number: '2',
      title: 'Executive Summary',
      fields: [
        { number: '2.1', name: 'projectContext', label: 'Project Context and Overview', required: true, type: 'textarea', rows: 4, placeholder: 'This BEP confirms our comprehensive approach to delivering the project using advanced BIM methodologies...' },
        { number: '2.2', name: 'bimStrategy', label: 'BIM Strategy Summary', required: true, type: 'textarea', rows: 3, placeholder: 'Our confirmed BIM strategy centres on early clash detection, integrated 4D/5D modelling...' },
        { number: '2.3', name: 'keyCommitments', label: 'Key Commitments and Deliverables', required: true, type: 'introTable', introPlaceholder: 'We are committed to full ISO 19650-2:2018 compliance throughout all project phases. Key deliverables include:', tableColumns: ['Deliverable', 'Description', 'Due Date'] },
        { number: '2.4', name: 'keyContacts', label: 'Key Project Contacts', type: 'table', columns: ['Role', 'Name', 'Company', 'Email', 'Phone Number'] },
        { number: '2.5', name: 'valueProposition', label: 'Value Proposition', type: 'textarea', rows: 3, placeholder: 'Our BIM approach will deliver cost reductions through early clash detection...' }
      ]
    },
    2: {
      number: '3',
      title: 'Confirmed Team and Responsibilities',
      fields: [
        { number: '3.1', name: 'organizationalStructure', label: 'Delivery Team\'s Organisational Structure and Composition', type: 'orgchart' },
        { number: '3.2', name: 'leadAppointedPartiesTable', label: 'Lead Appointed Parties and Information Managers', type: 'orgstructure-data-table', readOnly: true },
        { number: '3.3', name: 'taskTeamsBreakdown', label: 'Task Teams', type: 'table', columns: ['Task Team', 'Discipline', 'Leader', 'Leader Contact', 'Company'], columnWidths: ['12%', '12%', '15%', '28%', '33%'] },
        {
          number: '3.4',
          name: 'resourceAllocationTable',
          label: 'Resource Allocation - Capability and Capacity Assessment',
          type: 'table',
          columns: ['Role', 'Assigned Personnel', 'Key Competencies/Experience', 'Weekly Allocation (Hours)', 'Software/Hardware Requirements', 'Notes']
        },
        { number: '3.5', name: 'confirmedTrackRecord', label: 'Confirmed Track Record - Delivered Similar Projects', type: 'table', columns: ['Project Name', 'Value', 'Completion Date', 'Project Type', 'Our Role', 'Key BIM Achievements'] },
        {
          number: '3.6',
          name: 'mobilizationPlan',
          label: 'Mobilization Plan and Risk Mitigation',
          type: 'textarea',
          rows: 6,
          placeholder: 'PHASED MOBILIZATION TIMELINE\n\nWeek 1 - Onboarding and Training:\n  - Team orientation and project kickoff meeting...'
        },
        { number: '3.7', name: 'informationManagementResponsibilities', label: 'Information Management Responsibilities', type: 'textarea', rows: 3, placeholder: 'The Information Manager oversees all aspects of information production, validation, and exchange...' }
      ]
    }
  }
};

// Shared fields for steps 3–13 (same across both BEP types)
export const sharedFormFields = {
  3: {
    number: '4',
    title: 'BIM Goals and Objectives',
    fields: [
      { number: '4.1', name: 'bimGoals', label: 'BIM Goals', required: true, type: 'textarea', rows: 4, placeholder: 'The BIM goals for this project are to enhance design coordination through clash detection...' },
      { number: '4.2', name: 'primaryObjectives', label: 'Primary Objectives', type: 'textarea', rows: 3, placeholder: 'Primary objectives include: eliminating design conflicts before construction through rigorous clash detection protocols...' },
      { number: '4.3', name: 'bimUses', label: 'BIM Uses', required: true, type: 'checkbox', options: 'bimUses' },
      { number: '4.4', name: 'bimValueApplications', label: 'BIM Applications for Project Value', required: true, type: 'textarea', rows: 4, placeholder: 'BIM will maximize project value through: 4D scheduling for time optimization...' },
      { number: '4.5', name: 'valueMetrics', label: 'Success Metrics and Value Measurement', required: true, type: 'table', columns: ['Value Area', 'Target Metric', 'Measurement Method', 'Baseline/Benchmark'] },
      { number: '4.6', name: 'strategicAlignment', label: 'Alignment with Client Strategic Objectives', type: 'textarea', rows: 3, placeholder: 'BIM strategy directly supports client objectives including cost and time reductions...' },
      { number: '4.7', name: 'collaborativeProductionGoals', label: 'Objectives/Goals for the Collaborative Production of Information', type: 'textarea', rows: 4, placeholder: 'Collaborative production goals focus on establishing unified data standards across all disciplines...' }
    ]
  },
  4: {
    number: '5',
    title: 'Level of Information Need (LOIN)',
    fields: [
      { number: '5.1', name: 'informationPurposes', label: 'Information Purposes', required: true, type: 'checkbox', options: 'informationPurposes' },
      { number: '5.2', name: 'levelOfInformationMatrix', label: 'Level of Information Need Matrix (Model Element Table)', type: 'table', columns: ['Element Category / Discipline', 'Project Stage', 'LOD', 'LoI', 'Information Format', 'Author/Responsible', 'Notes'] },
      { number: '5.3', name: 'geometricalInfo', label: 'Geometrical Information Requirements', type: 'textarea', rows: 3, placeholder: 'Geometrical information requirements include: LOD 300 for all structural elements during design development. Summarise here; detail per element/stage in the LOIN table above.' },
      { number: '5.4', name: 'alphanumericalInfo', label: 'Alphanumerical Information Requirements', type: 'textarea', rows: 3, placeholder: 'Alphanumerical information requirements encompass: complete material specifications with thermal and fire ratings...' },
      { number: '5.5', name: 'documentationInfo', label: 'Documentation Requirements', type: 'textarea', rows: 3, placeholder: 'Documentation requirements include: technical specification documents for all building systems...' },
      { number: '5.6', name: 'informationFormats', label: 'Information Formats', type: 'checkbox', options: 'fileFormats' },
      { number: '5.7', name: 'projectInformationRequirements', label: 'Project Information Requirements (PIR)', type: 'textarea', rows: 4, placeholder: 'Project Information Requirements specify deliverable information to support asset management objectives...' },
      { number: '5.8', type: 'static-diagram', diagramKey: 'loinProgression', label: 'LOIN Progression by Project Stage' }
    ]
  },
  5: {
    number: '6',
    title: 'Information Delivery Planning',
    fields: [
      { number: '6.1', name: 'keyMilestones', label: 'Key Information Delivery Milestones', required: true, type: 'milestones-table', columns: ['Stage/Phase', 'Milestone Description', 'Deliverables', 'Due Date', 'Gate', 'Programme version'] },
      { number: '6.2', name: 'tidpRequirements', label: 'Task Information Delivery Plans (TIDPs)', type: 'tidp-reference', placeholder: 'TIDPs define discipline-specific delivery requirements: Architecture TIDP delivers spatial models and specification schedules biweekly, Structural TIDP provides analysis models and connection details monthly, MEP TIDP delivers coordinated services models and equipment schedules fortnightly, Quantity Surveying TIDP extracts cost data and material quantities monthly, and Sustainability TIDP delivers performance analysis and compliance reports at stage gates. Each TIDP includes quality checking procedures, approval workflows, and integration requirements with the federated model.' },
      { number: '6.3', name: 'tidpDescription', label: 'TIDP Description and Notes', type: 'textarea', rows: 3, placeholder: 'Additional notes about TIDPs, coordination requirements...' },
      { number: '6.4', name: 'midpDescription', label: 'Master Information Delivery Plan (MIDP)', required: true, type: 'textarea', rows: 4, placeholder: 'The MIDP establishes a structured schedule for information delivery aligned with RIBA Plan of Work 2020 stages...' },
      { number: '6.5', name: 'informationDeliverablesMatrix', label: 'Information Deliverables Responsibility Matrix', type: 'deliverables-matrix', matrixType: 'deliverables', placeholder: 'Deliverables schedule with responsibilities, due dates, and formats. Auto-syncs from TIDPs.' },
      { number: '6.6', name: 'informationManagementMatrix', label: 'Information Management Activities (Annex A)', type: 'im-activities-matrix', matrixType: 'im-activities', placeholder: 'Click to open the Responsibility Matrix Manager to define RACI assignments for information management activities.' },
      { number: '6.7', name: 'mobilisationPlan', label: 'Mobilisation Plan', type: 'textarea', rows: 3, placeholder: 'Project mobilisation occurs over 4 weeks: Week 1 includes CDE setup, template development...' },
      { number: '6.8', name: 'teamCapabilitySummary', label: 'Delivery Team Capability & Capacity Summary', type: 'textarea', rows: 3, placeholder: 'The delivery team provides comprehensive BIM capabilities across all disciplines...' },
      { number: '6.9', name: 'informationRiskRegister', label: 'Delivery Team\'s Information Risk Register', type: 'table', columns: ['Risk Description', 'Impact', 'Probability', 'Mitigation'] },
      { number: '6.10', name: 'taskTeamExchange', label: 'Exchange of Information Between Task Teams', type: 'textarea', rows: 3, placeholder: 'Information exchange protocols establish: weekly model federation with automated clash detection reports...' },
      { number: '6.11', name: 'modelReferencing3d', label: 'Referencing of 3D Information Models', type: 'textarea', rows: 3, placeholder: 'Model referencing procedures ensure consistent spatial coordination: shared coordinate system established from Ordnance Survey grid references...' },
      { number: '6.2', type: 'section-header', label: 'Project Information Model delivery strategy' },
      { number: '6.2.1', name: 'clientCdeResources', label: 'Common Data Environment – Client', type: 'table', columns: ['Platform/Resource', 'Purpose', 'Information Types', 'Owner', 'Notes'] },
      { number: '6.2.1.1', name: 'partnerCdeResources', label: 'Common Data Environment – Partners', type: 'table', columns: ['Partner', 'Platform(s)', 'Purpose', 'Information Types', 'Notes'] },
      { number: '6.2.3', name: 'pimExchangeEnvironments', label: 'PIM Exchange (CDE environment summary)', type: 'table', columns: ['Owner/Environment', 'Information Type', 'Permitted Status', 'Retention'] },
      { number: '6.2.3', name: 'pimExchangeDefinitions', label: 'WIP / Shared / Published definitions', type: 'textarea', rows: 2, placeholder: 'Optional: define Work in Progress, Shared, and Published states for information exchange.' },
      { number: '6.2.4', name: 'assurancePipeline', label: 'Information model Assurance pipeline', type: 'textarea', rows: 4, placeholder: 'Describe the assurance pipeline (e.g. from information delivery plans through federation, review, and approval). Define steps in your own or the appointing party’s terms.' },
      { number: '6.2.4', name: 'reviewApprovalWorkflows', label: 'Review and approval workflows', type: 'textarea', rows: 3, placeholder: 'Describe review and approval workflows for information deliverables (e.g. by discipline, stage, or type).' },
      { number: '6.2.5', name: 'stageBasedAssurance', label: 'Stage-based delivery (assurance by stage)', type: 'table', columns: ['Stage', 'Assurance Approach', 'Notes'] },
      { number: '6.2.5', name: 'stageBasedDeliveryNarrative', label: 'Stage-based delivery process', type: 'textarea', rows: 2, placeholder: 'Optional: describe the stage-gate or stage-based delivery process (e.g. design stages, gate criteria).' },
      { number: '6.2.5.1', name: 'securityOnExchanges', label: 'Security on Exchanges', type: 'table', columns: ['Classification', 'Description', 'Controls'] },
      { number: '6.2.5.1', name: 'securityOnExchangesFramework', label: 'Security control framework', type: 'textarea', rows: 2, placeholder: 'Describe the security control framework for exchanges (e.g. local WIP vs CDE vs published). Classifications are defined in the table above.' }
    ]
  },
  6: {
    number: '7',
    title: 'Common Data Environment (CDE)',
    fields: [
      { number: '7.1', name: 'cdeStrategy', label: 'Multi-Platform CDE Strategy', type: 'cdeDiagram', placeholder: 'The project employs a federated CDE approach utilizing multiple specialized platforms to optimize workflow efficiency and data management across different information types and project phases. Each platform is selected for its specific strengths while maintaining seamless integration and unified information governance.' },
      { number: '7.2', name: 'cdePlatforms', label: 'CDE Platform Matrix', required: true, type: 'table', columns: ['Platform/Service', 'Usage/Purpose', 'Information Types', 'Workflow States', 'Access Control'] },
      { number: '7.3', name: 'workflowStates', label: 'Unified Workflow States', required: true, type: 'table', columns: ['State Name', 'Description', 'Access Level', 'Next State'] },
      { number: '7.4', name: 'accessControl', label: 'Integrated Access Control', type: 'textarea', rows: 3, placeholder: 'Unified role-based access control across all CDE platforms with Single Sign-On (SSO) integration...' },
      { number: '7.5', name: 'securityMeasures', label: 'Multi-Platform Security Framework', type: 'textarea', rows: 3, placeholder: 'End-to-end encryption for data in transit and at rest using AES-256 standards across all platforms...' },
      { number: '7.6', name: 'backupProcedures', label: 'Comprehensive Backup Strategy', type: 'textarea', rows: 3, placeholder: 'Automated daily backups with 30-day retention policy across all CDE platforms...' }
    ]
  },
  7: {
    number: '8',
    title: 'Technology and Software Requirements',
    fields: [
      { number: '8.1', name: 'bimSoftware', label: 'BIM Software Applications', required: true, type: 'checkbox', options: 'software' },
      { number: '8.2', name: 'fileFormats', label: 'File Formats', required: true, type: 'checkbox', options: 'fileFormats' },
      { number: '8.3', name: 'hardwareRequirements', label: 'Hardware Requirements', type: 'textarea', rows: 3, placeholder: 'Minimum workstation specifications: Intel i7 processor, 32GB RAM...' },
      { number: '8.4', name: 'networkRequirements', label: 'Network Requirements', type: 'textarea', rows: 3, placeholder: 'Network infrastructure requirements: minimum 100Mbps bandwidth...' },
      { number: '8.5', name: 'interoperabilityNeeds', label: 'Interoperability Requirements', type: 'textarea', rows: 3, placeholder: 'Interoperability requirements ensure seamless data exchange between platforms...' },
      { number: '8.6', name: 'softwareHardwareInfrastructure', label: 'Software, Hardware and IT Infrastructure', type: 'table', columns: ['Category', 'Item/Component', 'Specification', 'Purpose'] }
    ]
  },
  8: {
    number: '9',
    title: 'Information Production Methods and Procedures',
    fields: [
      { number: '9.1', name: 'modelingStandards', label: 'Standards and Guidelines', required: true, type: 'table', columns: ['Standard/Guideline', 'Version', 'Application Area', 'Compliance Level'] },
      { number: '9.2', name: 'namingConventions', label: 'Naming Conventions and Document Control', required: true, type: 'naming-conventions' },
      { number: '9.3', name: 'fileStructure', label: 'Folder Structure Description', type: 'textarea', rows: 3, placeholder: 'CDE folder structure organized by project phase, discipline, and information container...' },
      { number: '9.4', name: 'fileStructureDiagram', label: 'Folder Structure Diagram', type: 'fileStructure' },
      { number: '9.5', name: 'volumeStrategy', label: 'Volume Strategy (Spatial Breakdown)', required: true, type: 'mindmap' },
      { number: '9.6', name: 'informationBreakdownStrategy', label: 'Discipline and System Breakdown', type: 'textarea', rows: 3, placeholder: 'Information breakdown organizes models by discipline, zone, and level. Defines how project information is decomposed into manageable containers aligned with ISO 19650...' },
      { number: '9.7', name: 'federationStrategy', label: 'Federation Approach and Clash Matrix', type: 'federation-strategy', required: true, placeholder: 'Define federation approach, clash detection matrix, and coordination procedures per ISO 19650-2' },
      { number: '9.8', name: 'federationProcess', label: 'Federation Workflow Process', type: 'textarea', rows: 3, placeholder: 'Federation process involves weekly model coordination and clash detection. Detail aggregation workflow, quality validation, and re-federation cycles...' },
      { number: '9.9', name: 'classificationSystems', label: 'Classification Systems Selection', required: true, type: 'table', columns: ['Classification System', 'Application Area', 'Code Format', 'Responsibility'] },
      { number: '9.10', name: 'classificationStandards', label: 'Implementation Standards', type: 'table', columns: ['Element Category', 'Classification System', 'Code Format', 'Example Code', 'Description'] },
      { number: '9.11', name: 'dataExchangeProtocols', label: 'Data Exchange Protocols', type: 'table', columns: ['Exchange Type', 'Format', 'Frequency', 'Delivery Method'] }
    ]
  },
  9: {
    number: '10',
    title: 'Quality Assurance and Control',
    fields: [
      { number: '10.1', name: 'qaFramework', label: 'Quality Assurance Framework', required: true, type: 'table', columns: ['QA Activity', 'Responsibility', 'Frequency', 'Tools/Methods'] },
      { number: '10.2', name: 'modelValidation', label: 'Model Validation Procedures', required: true, type: 'textarea', rows: 4, placeholder: 'Model validation procedures include automated clash detection, standards compliance checks...' },
      { number: '10.3', name: 'reviewProcesses', label: 'Review Processes', type: 'textarea', rows: 3, placeholder: 'Review processes involve multi-stage model coordination meetings and technical reviews...' },
      { number: '10.4', name: 'approvalWorkflows', label: 'Approval Workflows', type: 'textarea', rows: 3, placeholder: 'Approval workflows follow a staged process with defined sign-off points...' },
      { number: '10.5', name: 'complianceVerification', label: 'Compliance Verification', type: 'textarea', rows: 3, placeholder: 'Compliance verification ensures adherence to project standards and requirements...' },
      { number: '10.6', name: 'modelReviewAuthorisation', label: 'Information Model Review and Authorisation', type: 'textarea', rows: 3, placeholder: 'Information model review and authorisation follows ISO 19650 approval protocols...' }
    ]
  },
  10: {
    number: '11',
    title: 'Information Security and Privacy',
    fields: [
      { number: '11.1', name: 'dataClassification', label: 'Data Classification', required: true, type: 'table', columns: ['Classification Level', 'Description', 'Examples', 'Access Controls'] },
      { number: '11.2', name: 'accessPermissions', label: 'Access Permissions', required: true, type: 'textarea', rows: 3, placeholder: 'Access permissions are managed through role-based controls with defined user groups...' },
      { number: '11.3', name: 'encryptionRequirements', label: 'Encryption Requirements', type: 'textarea', rows: 3, placeholder: 'Encryption requirements mandate AES-256 encryption for data at rest and in transit...' },
      { number: '11.4', name: 'dataTransferProtocols', label: 'Data Transfer Protocols', type: 'textarea', rows: 3, placeholder: 'Data transfer protocols use secure HTTPS/SFTP connections with authentication...' },
      { number: '11.5', name: 'privacyConsiderations', label: 'Privacy Considerations', type: 'textarea', rows: 3, placeholder: 'Privacy considerations ensure GDPR compliance and data protection measures...' }
    ]
  },
  11: {
    number: '12',
    title: 'Training and Competency',
    fields: [
      { number: '12.1', name: 'bimCompetencyLevels', label: 'BIM Competency Levels', required: true, type: 'textarea', rows: 4, placeholder: 'BIM competency levels defined for all team members following ISO 19650 requirements...' },
      { number: '12.2', name: 'trainingRequirements', label: 'Training Requirements', type: 'textarea', rows: 3, placeholder: 'Training requirements include ISO 19650 certification and software-specific training...' },
      { number: '12.3', name: 'certificationNeeds', label: 'Certification Requirements', type: 'textarea', rows: 3, placeholder: 'Certification requirements mandate ISO 19650 Lead and Practitioner qualifications...' },
      { number: '12.4', name: 'projectSpecificTraining', label: 'Project-Specific Training', type: 'textarea', rows: 3, placeholder: 'Project-specific training covers naming conventions, templates, and workflow procedures...' }
    ]
  },
  12: {
    number: '13',
    title: 'Coordination, Collaboration & Risk Management',
    fields: [
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
      { number: '13.13', name: 'projectKpis', label: 'Project Key Performance Indicators (KPIs)', type: 'table', columns: ['KPI Name', 'Target Value', 'Measurement Method', 'Responsibility'] }
    ]
  },
  13: {
    number: '14',
    title: 'Appendices',
    fields: [
      { name: 'cobieRequirements', label: 'Appendix A: COBie Data Requirements', type: 'table', columns: ['Component Type', 'Required Parameters', 'Data Source', 'Validation Method'] },
      { name: 'softwareVersionMatrix', label: 'Appendix B: Software Version Compatibility Matrix', type: 'table', columns: ['Software', 'Version', 'File Formats Supported', 'Interoperability Notes'] },
      { name: 'referencedDocuments', label: 'Appendix C: Referenced Documents and Standards', type: 'standardsTable' }
    ]
  }
};

// Resolve form fields for a given BEP type + step index
export function getFormFields(bepType, stepIndex) {
  if (stepIndex <= 2 && formFields[bepType] && formFields[bepType][stepIndex]) {
    return formFields[bepType][stepIndex];
  }
  if (stepIndex >= 3 && sharedFormFields[stepIndex]) {
    return sharedFormFields[stepIndex];
  }
  return null;
}