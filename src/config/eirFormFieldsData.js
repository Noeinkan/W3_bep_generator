/**
 * EIR form field definitions (no React/lucide). Server-safe.
 * Maps ISO 19650 EIR Table of Contents to form steps and fields.
 */

export const eirFormFields = {
  0: {
    number: 'P',
    title: 'Project Information',
    fields: [
      { number: 'P.1', name: 'projectName', label: 'Project name', required: true, type: 'text', placeholder: 'Full project name...' },
      { number: 'P.2', name: 'projectNumber', label: 'Project number / reference', type: 'text', placeholder: 'e.g. PROJ-2026-001' },
      { number: 'P.3', name: 'clientOrganisation', label: 'Client / appointing party', type: 'text', placeholder: 'Organisation name...' },
      { number: 'P.4', name: 'projectAddress', label: 'Project address / location', type: 'textarea', rows: 2, placeholder: 'Site address or geographic description...' },
      { number: 'P.5', name: 'projectDescription', label: 'Project description', required: true, type: 'textarea', rows: 3, placeholder: 'Brief description of scope and type of works...' },
      { number: 'P.6', name: 'formOfContract', label: 'Form of contract', type: 'text', placeholder: 'e.g. NEC4, JCT Design & Build...' },
      { number: 'P.7', name: 'projectPhasing', label: 'Project phasing', type: 'textarea', rows: 2, placeholder: 'Describe project phases or stages if applicable...' },
      { number: 'P.8', type: 'section-header', label: 'Key Project Contacts' },
      { number: 'P.9', name: 'keyContacts', label: 'Key project contacts', type: 'table', columns: ['Role', 'Name', 'Organisation', 'Email', 'Phone'] }
    ]
  },
  1: {
    number: '0',
    title: 'Executive Summary',
    fields: [
      { number: '0.1', name: 'executiveSummary', label: 'Executive Summary', required: true, type: 'textarea', rows: 5, placeholder: 'Summarise the purpose and scope of this Exchange Information Requirements document...' }
    ]
  },
  2: {
    number: '1',
    title: 'Introduction',
    fields: [
      { number: '1.1', name: 'eirPurpose', label: 'Exchange Information Requirements (EIR) purpose', required: true, type: 'textarea', rows: 4, placeholder: 'Define the purpose of this EIR and how it aligns with OIR, PIR and AIR...' },
      { number: '1.2', type: 'section-header', label: 'Information management goals and objectives' },
      { number: '1.2.1', name: 'goals', label: 'Goals', type: 'textarea', rows: 3, placeholder: 'High-level information management goals for the project...' },
      { number: '1.2.2', name: 'objectives', label: 'Objectives', type: 'textarea', rows: 3, placeholder: 'Specific, measurable objectives for information delivery...' },
      { number: '1.3', type: 'section-header', label: 'Information requirements hierarchy and documentation progression' },
      { number: '1.3.1', name: 'informationRequirementsHierarchy', label: 'Information requirements hierarchy (OIR → PIR/AIR → EIR)', type: 'textarea', rows: 3, placeholder: 'Describe how OIR, PIR and AIR feed into this EIR...' },
      { number: '1.3.2', type: 'info-banner', label: 'EIR response requirements: pre-appointment BEP, supplementary documents, supplier capability assessment, mobilisation plan, risk assessment, delivery team BEP.' },
      { number: '1.3.2.1', name: 'preBepRequirement', label: 'Pre-appointment BIM execution plan (pre-BEP)', type: 'textarea', rows: 2, placeholder: 'Requirements for the pre-appointment BEP response...' },
      { number: '1.3.2.2', name: 'supplementaryDocuments', label: 'Supplementary documents', type: 'textarea', rows: 2, placeholder: 'List any supplementary documents required...' },
      { number: '1.3.2.3', name: 'supplierCapabilityAssessment', label: 'Supplier capability and capacity assessment', type: 'textarea', rows: 2, placeholder: 'Requirements for capability and capacity assessment...' },
      { number: '1.3.2.4', name: 'mobilisationPlanRequirement', label: 'Mobilisation plan', type: 'textarea', rows: 2, placeholder: 'Requirements for the mobilisation plan...' },
      { number: '1.3.2.5', name: 'informationDeliveryRiskAssessment', label: 'Information delivery risk assessment', type: 'textarea', rows: 2, placeholder: 'Requirements for information delivery risk assessment...' },
      { number: '1.3.2.6', name: 'deliveryTeamBepRequirement', label: "Delivery team's BIM execution plan (BEP)", type: 'textarea', rows: 2, placeholder: 'Requirements for the appointed party BEP...' }
    ]
  },
  3: {
    number: '2',
    title: 'Information Requirements',
    fields: [
      { number: '2.1', name: 'informationPurpose', label: 'Information purpose', required: true, type: 'textarea', rows: 4, placeholder: 'Define the purpose of information to be produced and exchanged...' },
      { number: '2.2', name: 'bimUses', label: 'BIM uses', type: 'table', columns: ['BIM Use', 'Priority (High/Med/Low)', 'Description / Goal', 'Responsible Party', 'Project Stage'] },
      { number: '2.3', name: 'planOfWork', label: 'Plan of work', type: 'textarea', rows: 3, placeholder: 'Reference or describe the plan of work (e.g. RIBA stages)...' },
      { number: '2.4', name: 'informationDeliveryMilestones', label: 'Information delivery milestones (dates and purposes)', required: true, type: 'milestones-table', columns: ['Stage/Phase', 'Milestone Description', 'Deliverables', 'Due Date', 'Gate', 'Notes'] },
      { number: '2.5', name: 'informationSecurityRequirements', label: 'Information security requirements', type: 'textarea', rows: 4, placeholder: 'Security classification, access control and handling requirements...' },
      { number: '2.6', name: 'spatialCoordinationRequirements', label: 'Spatial coordination requirements', type: 'textarea', rows: 3, placeholder: 'Requirements for spatial coordination and clash detection...' },
      { number: '2.7', name: 'pimRequirements', label: 'Project Information Model (PIM) requirements', type: 'textarea', rows: 4, placeholder: 'PIM requirements for design and construction phases...' },
      { number: '2.8', name: 'aimRequirements', label: 'Asset Information Model (AIM) requirements (at handover)', type: 'textarea', rows: 4, placeholder: 'AIM requirements at handover and for asset management...' },
      { number: '2.9', name: 'informationKpis', label: 'Information management key performance indicators (KPIs)', type: 'table', columns: ['KPI', 'Target', 'Measurement', 'Responsibility'] },
      { number: '2.10', name: 'healthSafetyRiskManagement', label: 'Health and safety and design/construction risk management', type: 'textarea', rows: 4, placeholder: 'Information requirements supporting H&S and risk management...' }
    ]
  },
  4: {
    number: '3.1',
    title: 'Information Standards',
    fields: [
      { number: '3.1.1', name: 'projectSpecificStandards', label: 'Project-specific standards', type: 'textarea', rows: 3, placeholder: 'Project-specific information standards...' },
      { number: '3.1.2', type: 'section-header', label: 'Information identification conventions' },
      { number: '3.1.2.1', name: 'informationContainerIdentification', label: 'Information container identification (naming convention)', type: 'naming-conventions' },
      { number: '3.1.2.2', name: 'cdeMetadataRequirements', label: 'Common Data Environment (CDE) metadata requirements', type: 'table', columns: ['Metadata Field', 'Requirement', 'Format', 'Notes'] },
      { number: '3.1.3', type: 'section-header', label: 'Method of assignment for level of information need' },
      { number: '3.1.3.1', name: 'lodLoiMatrix', label: 'Level of detail (LOD) / Level of information (LOI)', type: 'table', columns: ['Element Category / Discipline', 'Project Stage', 'LOD', 'LoI', 'Format', 'Responsible', 'Notes'] },
      { number: '3.1.4', type: 'section-header', label: 'Data authoring' },
      { number: '3.1.4.1', name: 'dataExchangeFormats', label: 'Data exchange formats', type: 'table', columns: ['Exchange Type', 'Format', 'Purpose', 'Notes'] },
      { number: '3.1.5', name: 'softwarePlatforms', label: 'Information software platforms (authoring & viewing tools)', type: 'table', columns: ['Platform/Tool', 'Usage', 'Information Types', 'Notes'] },
      { number: '3.1.6', name: 'informationModelQuality', label: 'Information model quality (assurance/checking requirements)', type: 'textarea', rows: 4, placeholder: 'Quality assurance and checking requirements for information models...' }
    ]
  },
  5: {
    number: '3.2',
    title: 'Information Production Methods and Procedures',
    fields: [
      { number: '3.2.1', name: 'responsibilityMatrix', label: 'Information management functions (responsibility matrix)', type: 'im-activities-matrix', matrixType: 'im-activities' },
      { number: '3.2.2', type: 'section-header', label: 'Information collaboration process' },
      { number: '3.2.2.1', name: 'cdeWorkflow', label: 'Common Data Environment (CDE) workflow', type: 'textarea', rows: 4, placeholder: 'CDE workflow states and transition rules...' },
      { number: '3.2.2.2', name: 'informationExchangeFrequency', label: 'Information exchange frequency', type: 'textarea', rows: 2, placeholder: 'Required frequency of information exchanges...' },
      { number: '3.2.2.3', name: 'mobilisationProcedures', label: 'Mobilisation', type: 'textarea', rows: 3, placeholder: 'Mobilisation procedures and timing...' },
      { number: '3.2.2.4', name: 'trainingRequirements', label: 'Training', type: 'textarea', rows: 3, placeholder: 'Training requirements for information management...' },
      { number: '3.2.3', name: 'authorisationAcceptanceProcess', label: 'Authorisation and acceptance process', type: 'textarea', rows: 4, placeholder: 'How information is authorised and accepted...' },
      { number: '3.2.4', name: 'spatialCoordinationStrategy', label: 'Spatial coordination strategy', type: 'textarea', rows: 3, placeholder: 'Strategy for spatial coordination and clash detection...' },
      { number: '3.2.5', name: 'legacyInformationRequirements', label: 'Legacy information and shared resources requirements', type: 'textarea', rows: 3, placeholder: 'Requirements for legacy information and shared resources...' },
      { number: '3.2.6', name: 'captureExistingAssetInformation', label: 'Capture of existing asset information', type: 'textarea', rows: 3, placeholder: 'Requirements for capturing existing asset information...' },
      { number: '3.2.7', name: 'informationContainerBreakdownStructure', label: 'Information container breakdown structure', type: 'textarea', rows: 3, placeholder: 'Breakdown structure for information containers...' },
      { number: '3.2.8', name: 'federationStrategy', label: 'Federation strategy', type: 'textarea', rows: 3, placeholder: 'How models from different task teams are combined into a federated model, including ownership, coordination zones and clash detection responsibilities...' },
      { number: '3.2.9', name: 'lessonsLearnt', label: 'Lessons learnt', type: 'textarea', rows: 3, placeholder: 'Process for capturing and applying lessons learnt...' }
    ]
  },
  6: {
    number: 'A',
    title: 'Appendices',
    fields: [
      { number: 'A.1', name: 'appendixResponsibilityMatrix', label: 'Responsibility matrix (detailed RACI or equivalent)', type: 'table', columns: ['Activity', 'Responsible', 'Accountable', 'Consulted', 'Informed'] },
      { number: 'A.2', name: 'appendixMilestonesTable', label: 'Information delivery milestones table', type: 'table', columns: ['Stage', 'Milestone', 'Date', 'Purpose', 'Deliverables'] },
      { number: 'A.3', name: 'appendixLodLoiMatrix', label: 'LOD/LOI matrix per discipline and stage', type: 'table', columns: ['Discipline', 'Stage', 'LOD', 'LOI', 'Format', 'Notes'] },
      { number: 'A.4', name: 'appendixSoftwareSchedule', label: 'Software & exchange format schedule', type: 'table', columns: ['Software', 'Version', 'Formats', 'Purpose', 'Notes'] },
      { number: 'A.5', name: 'appendixCdeSpec', label: 'CDE platform specification', type: 'textarea', rows: 4, placeholder: 'CDE platform specification and requirements...' },
      { number: 'A.6', name: 'appendixSecurityMetadata', label: 'Security classification & metadata requirements', type: 'table', columns: ['Classification', 'Description', 'Metadata', 'Controls'] },
      { number: 'A.7', name: 'appendixClassificationSystem', label: 'Project-specific classification system (e.g. Uniclass 2015)', type: 'table', columns: ['Category', 'Classification', 'Code Format', 'Application'] },
      { number: 'A.8', name: 'appendixExampleRequirementsTables', label: 'Example information requirements tables (structured vs unstructured)', type: 'textarea', rows: 4, placeholder: 'Example tables or references for structured and unstructured requirements...' }
    ]
  }
};

/**
 * Get EIR form fields for a step index (single document type; no pre/post split).
 * @param {number} stepIndex - 0-based step index
 * @returns {object|null} Step config with number, title, fields or null
 */
export function getEirFormFields(stepIndex) {
  if (eirFormFields[stepIndex]) {
    return eirFormFields[stepIndex];
  }
  return null;
}
