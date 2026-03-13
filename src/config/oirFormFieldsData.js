/**
 * OIR form field definitions (no React/lucide). Server-safe.
 * Maps ISO 19650 OIR structure to form steps and fields.
 */

const MATURITY_OPTIONS = [
  { value: '', label: 'Select maturity level...' },
  { value: 'level-0', label: 'Level 0 – No formal process' },
  { value: 'level-1', label: 'Level 1 – Managed' },
  { value: 'level-2', label: 'Level 2 – Defined' },
  { value: 'level-3', label: 'Level 3 – Quantitatively managed' },
  { value: 'level-4', label: 'Level 4 – Optimizing' }
];

export const oirFormFields = {
  0: {
    number: '0',
    title: 'Executive Summary',
    fields: [
      { number: '0.1', name: 'execSummary', label: 'Executive Summary', required: true, type: 'textarea', rows: 6, placeholder: 'Summarise the organisation\'s information requirements and the strategic drivers behind this OIR document. Include the scope, key objectives, and how this OIR will be used to develop downstream requirements (AIR, EIR)...' }
    ]
  },
  1: {
    number: '1',
    title: 'Organizational Objectives & Asset Portfolio',
    fields: [
      { number: '1.1', name: 'organizationName', label: 'Organization name', type: 'text', placeholder: 'Full legal name of the organization...' },
      { number: '1.2', name: 'businessDrivers', label: 'Business drivers and strategic goals', type: 'textarea', rows: 4, placeholder: 'Key strategic goals that information must support (e.g. cost reduction, safety improvement, regulatory compliance, asset performance)...' },
      { number: '1.3', name: 'assetPortfolioOverview', label: 'Asset portfolio overview', type: 'textarea', rows: 4, placeholder: 'Describe the portfolio of assets: types, quantity, geographic spread, lifecycle stages, and approximate value...' },
      { number: '1.4', name: 'assetTypes', label: 'Asset types and scale', type: 'table', columns: ['Asset Type', 'Count', 'Value Band', 'Lifecycle Stage', 'Notes'] },
      { number: '1.5', name: 'informationUseCases', label: 'Primary information use cases', type: 'textarea', rows: 3, placeholder: 'How will the information be used operationally, strategically, and for compliance? (e.g. maintenance planning, capital investment decisions, regulatory reporting)...' }
    ]
  },
  2: {
    number: '2',
    title: 'Information Management Maturity',
    fields: [
      { number: '2.1', name: 'currentMaturityLevel', label: 'Current information management maturity level', type: 'select', options: MATURITY_OPTIONS },
      { number: '2.2', name: 'targetMaturityLevel', label: 'Target maturity level', type: 'select', options: MATURITY_OPTIONS },
      { number: '2.3', name: 'maturityGapAnalysis', label: 'Maturity gap analysis', type: 'textarea', rows: 4, placeholder: 'Describe the gap between current and target maturity. What are the key barriers to improvement? (technology, people, process)...' },
      { number: '2.4', name: 'maturityRoadmapSummary', label: 'Maturity improvement roadmap summary', type: 'textarea', rows: 3, placeholder: 'High-level steps to progress maturity: training programmes, tool investments, governance changes, process improvements...' }
    ]
  },
  3: {
    number: '3',
    title: 'Asset Information Framework',
    fields: [
      { number: '3.1', name: 'classificationApproach', label: 'Classification approach', type: 'textarea', rows: 3, placeholder: 'Describe the classification system(s) used across the portfolio (e.g. Uniclass 2015, OmniClass, ISO 81346, custom taxonomy)...' },
      { number: '3.2', name: 'classificationTable', label: 'Classification system reference', type: 'table', columns: ['Classification System', 'Version', 'Scope', 'Applicable Assets', 'Notes'] },
      { number: '3.3', name: 'metadataStandards', label: 'Metadata standards and schema', type: 'textarea', rows: 3, placeholder: 'Reference standards for asset metadata (e.g. ISO 81346, COBie, IFC, PAS 1192-3, CBRE, FM:Systems)...' },
      { number: '3.4', name: 'assetDataSchema', label: 'Asset data schema requirements', type: 'table', columns: ['Asset Type', 'Attribute Group', 'Required Fields', 'Format', 'Source'] },
      { number: '3.5', name: 'aimRequirementsOverview', label: 'Asset Information Model (AIM) requirements', type: 'textarea', rows: 4, placeholder: 'Describe the long-term AIM requirements driven by operations and maintenance needs. What information must be maintained and updated throughout the asset lifecycle?...' }
    ]
  },
  4: {
    number: '4',
    title: 'Regulatory, Compliance & Reporting',
    fields: [
      { number: '4.1', name: 'regulatoryRequirements', label: 'Regulatory and statutory requirements', type: 'textarea', rows: 4, placeholder: 'List all legal or statutory obligations affecting information management (building safety regulations, environmental compliance, financial reporting, sector-specific legislation)...' },
      { number: '4.2', name: 'regulatoryTable', label: 'Regulatory requirements detail', type: 'table', columns: ['Regulation / Standard', 'Jurisdiction', 'Obligation', 'Affected Assets', 'Audit Frequency'] },
      { number: '4.3', name: 'reportingKpis', label: 'Reporting KPIs and dashboards', type: 'table', columns: ['KPI Name', 'Description', 'Target', 'Data Source', 'Reporting Cycle', 'Responsible'] },
      { number: '4.4', name: 'reportingCycles', label: 'Reporting cycles and dashboards', type: 'textarea', rows: 3, placeholder: 'Describe reporting frequency, formats, and recipients (board, operations, regulators, auditors)...' },
      { number: '4.5', name: 'auditRequirements', label: 'Audit and assurance requirements', type: 'textarea', rows: 3, placeholder: 'Internal and external audit requirements for information quality, completeness, and compliance...' }
    ]
  },
  5: {
    number: '5',
    title: 'Digital Strategy & Data Governance',
    fields: [
      { number: '5.1', name: 'bimStrategyStatement', label: 'BIM and digital strategy statement', type: 'textarea', rows: 4, placeholder: 'Organisation-wide BIM maturity targets, digital twin ambitions, information management strategy direction, and how this supports long-term asset performance goals...' },
      { number: '5.2', name: 'softwareStrategy', label: 'Software strategy', type: 'textarea', rows: 3, placeholder: 'Preferred platforms, integration requirements, and mandated or recommended tools across the portfolio...' },
      { number: '5.3', name: 'softwarePlatforms', label: 'Software platforms and usage', type: 'table', columns: ['Platform / Tool', 'Category', 'Primary Use', 'Mandatory / Recommended', 'Notes'] },
      { number: '5.4', name: 'dataOwnership', label: 'Data ownership and stewardship', type: 'textarea', rows: 3, placeholder: 'Define who owns, stewards, and is accountable for different categories of information across the asset lifecycle...' },
      { number: '5.5', name: 'dataLifecyclePolicy', label: 'Data lifecycle policy', type: 'textarea', rows: 3, placeholder: 'Retention, archival, deletion, and transition policies for asset information. Reference any applicable records management standards...' },
      { number: '5.6', name: 'dataGovernanceTable', label: 'Data governance roles', type: 'table', columns: ['Role', 'Responsibilities', 'Accountable For', 'Review Cycle'] }
    ]
  },
  6: {
    number: '6',
    title: 'Capacity, Capability & Implementation Roadmap',
    fields: [
      { number: '6.1', name: 'currentCapabilityAssessment', label: 'Current workforce capability assessment', type: 'textarea', rows: 3, placeholder: 'Summarise the current skill base: strengths, gaps, and key roles needing upskilling in information management and digital delivery...' },
      { number: '6.2', name: 'trainingStrategy', label: 'Training and development strategy', type: 'textarea', rows: 4, placeholder: 'Approach to building information management capability: internal training, external certifications (e.g. BRE, RICS, CIOB), recruitment strategy...' },
      { number: '6.3', name: 'capacityPlan', label: 'Capacity plan by role', type: 'table', columns: ['Role', 'Current FTE', 'Required FTE', 'Gap', 'Target Date', 'Training Required'] },
      { number: '6.4', name: 'implementationPhases', label: 'Implementation roadmap phases', type: 'table', columns: ['Phase', 'Description', 'Key Activities', 'Start Date', 'End Date', 'Success Criteria'] },
      { number: '6.5', name: 'successMetrics', label: 'Success metrics and review process', type: 'textarea', rows: 3, placeholder: 'How will success be measured? How often will the OIR be reviewed? Who is responsible for keeping it current?...' },
      { number: '6.6', name: 'risksAndMitigations', label: 'Risks and mitigations', type: 'table', columns: ['Risk Description', 'Likelihood', 'Impact', 'Mitigation', 'Owner'] }
    ]
  }
};

/**
 * Get OIR form fields for a step index.
 * @param {number} stepIndex - 0-based step index
 * @returns {object|null} Step config with number, title, fields or null
 */
export function getOirFormFields(stepIndex) {
  if (oirFormFields[stepIndex]) {
    return oirFormFields[stepIndex];
  }
  return null;
}
