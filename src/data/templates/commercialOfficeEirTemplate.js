/**
 * Pre-filled EIR template data — Commercial Office Complex
 * Covers all 7 steps (0–6) of the updated EIR form structure (ISO 19650).
 * Used by templateRegistry.js when applying the Commercial Office template.
 */

const COMMERCIAL_OFFICE_EIR_TEMPLATE = {

  // ─── Step 0: Project Information ────────────────────────────────────────────
  projectName: 'Commercial Office Complex — Placeholder Project',
  projectNumber: 'PROJ-2026-001',
  clientOrganisation: 'Example Developments Ltd',
  projectAddress: '123 Business Park Drive\nCity Centre\nEC1A 1BB',
  projectDescription:
    'A multi-storey commercial office complex comprising approximately 15,000 m² of flexible Grade A office space across 8 floors, ground-floor retail units, two basement car-parking levels, and landscaped public realm. The development targets BREEAM Excellent and WELL Building Standard certification.',
  formOfContract: 'NEC4 Engineering and Construction Contract (ECC), Option C — Target Cost with Activity Schedule',
  projectPhasing:
    'Phase 1: Design development and planning consent (RIBA Stages 2–3)\nPhase 2: Procurement and pre-construction (RIBA Stage 4)\nPhase 3: Construction (RIBA Stages 5–6)\nPhase 4: Handover and close-out (RIBA Stage 7)',
  keyContacts: [
    { Role: 'Appointing Party / Client', Name: 'Jane Smith', Organisation: 'Example Developments Ltd', Email: 'j.smith@example-dev.com', Phone: '+44 20 7000 0001' },
    { Role: 'Project Manager', Name: 'Tom Brown', Organisation: 'PM Consulting Ltd', Email: 't.brown@pmconsulting.com', Phone: '+44 20 7000 0002' },
    { Role: 'Information Manager', Name: 'Sarah Lee', Organisation: 'BIM Solutions Ltd', Email: 's.lee@bim-solutions.com', Phone: '+44 20 7000 0003' },
    { Role: 'Lead Designer (Architect)', Name: 'Michael Rossi', Organisation: 'Rossi Architects LLP', Email: 'm.rossi@rossi-arch.com', Phone: '+44 20 7000 0004' },
    { Role: 'Structural Engineer', Name: 'Priya Patel', Organisation: 'Structural Partners Ltd', Email: 'p.patel@structpartners.com', Phone: '+44 20 7000 0005' },
  ],

  // ─── Step 1: Executive Summary ───────────────────────────────────────────────
  executiveSummary:
     'This Exchange Information Requirements (EIR) document sets out the information management requirements of Example Developments Ltd (the Appointing Party) for the design, construction, and handover of the Commercial Office Complex development.\n\nThe EIR is issued to all tenderers and appointed parties to define the standards, methods, and procedures for the production and delivery of project information throughout the project lifecycle, in accordance with ISO 19650-2:2018.\n\nAll parties responding to this EIR shall demonstrate compliance by submitting a pre-appointment BIM Execution Plan (pre-BEP) and, upon appointment, shall develop a post-appointment BEP and Master Information Delivery Plan (MIDP) that satisfy these requirements.\n\nThe Appointing Party\'s primary objectives are to achieve a high-quality, coordinated Project Information Model (PIM) to support construction delivery, and a comprehensive Asset Information Model (AIM) to enable effective building operation and maintenance upon handover.',

  // ─── Step 2: Introduction ─────────────────────────────────────────────────────
  eirPurpose:
    'This EIR defines the Appointing Party\'s information requirements in accordance with ISO 19650-2:2018. It establishes the scope, format, quality and schedule of information to be delivered by the appointed parties at each stage of the project, from design through construction to handover.\n\nThe EIR is aligned with the Appointing Party\'s Organisational Information Requirements (OIR) and Asset Information Requirements (AIR), and feeds directly into the Project Information Requirements (PIR). Appointed parties are required to respond to this EIR through a BIM Execution Plan (BEP) and MIDP.',
  goals:
    '1. Ensure all project information is produced, shared, and managed in a consistent, coordinated, and secure manner throughout the project lifecycle.\n2. Achieve a fully coordinated federated model at each information exchange milestone, minimising clashes and RFIs during construction.\n3. Deliver a structured Asset Information Model (AIM) at practical completion to support facilities management and building operations.\n4. Demonstrate compliance with ISO 19650-2 across all appointed parties and task teams.\n5. Achieve BREEAM Excellent and WELL Building Standard certification supported by accurate model data.',
  objectives:
    '1. Appoint an Information Manager responsible for overseeing the CDE, model federation, and information exchange processes.\n2. Achieve zero unresolved major clashes at each federated model milestone.\n3. Deliver all information containers with correct naming, metadata, and revision status as defined in this EIR.\n4. Complete a Soft Landings handover including COBie-compliant asset data by the agreed handover date.\n5. Hold formal information management review meetings at each RIBA Stage gate.\n6. Achieve a minimum information delivery compliance rate of 95% against the MIDP schedule.',
  informationRequirementsHierarchy:
    'The information requirements hierarchy for this project follows the ISO 19650 framework:\n\n• Organisational Information Requirements (OIR) — defined by Example Developments Ltd to support strategic asset management objectives.\n• Asset Information Requirements (AIR) — derived from OIR; specifies information needed to operate and maintain the completed asset.\n• Project Information Requirements (PIR) — derived from OIR; specifies information needed to support project delivery decisions.\n• Exchange Information Requirements (EIR) — this document; translates PIR into specific deliverables, formats, and timescales for appointed parties.\n\nAppointed parties shall ensure their BEP and MIDP trace each information deliverable back to its originating requirement in this EIR.',
  preBepRequirement:
    'All tenderers shall submit a pre-appointment BIM Execution Plan (pre-BEP) as part of their tender response. The pre-BEP shall demonstrate the tenderer\'s capability and approach to meeting these Exchange Information Requirements, and shall include:\n• Organisation chart and BIM resource allocation\n• Proposed software platforms and file formats\n• Proposed naming conventions and CDE approach\n• Risk assessment for information delivery\n• Evidence of relevant BIM experience on comparable projects',
  supplementaryDocuments:
    'Tenderers shall also submit the following supplementary documents alongside the pre-BEP:\n• Supplier BIM Capability Assessment (using the supplied template)\n• Proposed MIDP structure and key information delivery dates\n• Software and hardware schedule\n• Quality assurance procedures for information production',
  supplierCapabilityAssessment:
    'All appointed parties shall complete the Appointing Party\'s Supplier BIM Capability and Capacity Assessment prior to appointment. This assessment evaluates:\n• Staff BIM competency levels and training records\n• Software licences and hardware capability\n• CDE access and prior experience\n• Relevant project experience and references\n\nA minimum capability threshold applies; parties not meeting the threshold will be required to submit a remediation plan within 2 weeks of appointment.',
  mobilisationPlanRequirement:
    'The post-appointment BEP shall include a Mobilisation Plan covering:\n• CDE setup and access provisioning for all task teams\n• Software configuration and template distribution\n• BIM kick-off meeting schedule\n• Training programme for team members who require upskilling\n• Confirmation of naming convention implementation\n• First federated model coordination meeting date',
  informationDeliveryRiskAssessment:
    'Appointed parties shall include an Information Delivery Risk Register in their BEP, identifying risks to timely and accurate information delivery. Each risk entry shall include a likelihood score, impact score, mitigation measure, and risk owner. The register shall be reviewed and updated at each RIBA Stage gate.',
  deliveryTeamBepRequirement:
    'The post-appointment BEP shall be submitted within 4 weeks of contract award and shall be agreed with the Appointing Party before any information production commences. The BEP shall be a live document, updated at each stage and re-issued for acceptance at each RIBA Stage gate. The BEP shall address all sections of this EIR and include the agreed MIDP as an appendix.',

  // ─── Step 3: Information Requirements ────────────────────────────────────────
  informationPurpose:
    'The information produced and exchanged on this project serves three primary purposes:\n\n1. Project Delivery Support — providing accurate, coordinated, and timely information to support design, procurement, and construction decisions, including regulatory submissions, contractor coordination, and construction programming.\n\n2. Asset Management Preparation — building a structured Asset Information Model (AIM) that will support facilities management, planned preventative maintenance, and statutory compliance for the operational life of the building.\n\n3. Stakeholder Reporting — providing the Appointing Party with clear visibility of project progress, coordination status, and information quality at each stage.',
  bimUses: [
    { 'BIM Use': 'Design Coordination & Clash Detection', 'Priority (High/Med/Low)': 'High', 'Description / Goal': 'Federated model coordination to identify and resolve spatial clashes between disciplines before construction', 'Responsible Party': 'Lead Appointed Party (LAP)', 'Project Stage': 'RIBA 3–5' },
    { 'BIM Use': 'Visualisation & Design Communication', 'Priority (High/Med/Low)': 'Medium', 'Description / Goal': 'Rendered visualisations and walkthroughs for client review and stakeholder engagement', 'Responsible Party': 'Architect', 'Project Stage': 'RIBA 2–4' },
    { 'BIM Use': 'Quantity Take-off & Cost Estimation', 'Priority (High/Med/Low)': 'High', 'Description / Goal': 'Model-based quantities for cost planning and procurement', 'Responsible Party': 'Cost Consultant / QS', 'Project Stage': 'RIBA 3–5' },
    { 'BIM Use': 'Construction Sequencing (4D)', 'Priority (High/Med/Low)': 'Medium', 'Description / Goal': '4D simulation to programme review and site logistics planning', 'Responsible Party': 'Main Contractor', 'Project Stage': 'RIBA 5' },
    { 'BIM Use': 'Asset Data Capture (COBie)', 'Priority (High/Med/Low)': 'High', 'Description / Goal': 'Structured asset data for FM handover, including maintainable assets, components, and systems', 'Responsible Party': 'All Task Teams', 'Project Stage': 'RIBA 5–7' },
    { 'BIM Use': 'Regulatory / Planning Submission', 'Priority (High/Med/Low)': 'High', 'Description / Goal': 'Model-derived drawings and data for planning and building control submissions', 'Responsible Party': 'Architect', 'Project Stage': 'RIBA 3' },
    { 'BIM Use': 'Energy & Sustainability Analysis', 'Priority (High/Med/Low)': 'Medium', 'Description / Goal': 'Energy modelling and daylight analysis to support BREEAM Excellent target', 'Responsible Party': 'MEP / Sustainability Consultant', 'Project Stage': 'RIBA 2–4' },
  ],
  planOfWork:
    'The project follows the RIBA Plan of Work 2020. Key stages relevant to information delivery are:\n\n• Stage 2 — Concept Design: Initial coordination models, site analysis, and design options\n• Stage 3 — Spatial Coordination: Fully coordinated spatial model, planning submission\n• Stage 4 — Technical Design: Detailed design models, specification, procurement information\n• Stage 5 — Manufacturing & Construction: Construction issue models, as-built capture, COBie data collection\n• Stage 6 — Handover: AIM delivery, COBie submission, O&M manuals\n• Stage 7 — Use: Post-occupancy evaluation, handover of AIM to FM team',
  informationDeliveryMilestones: [
    { 'Stage/Phase': 'RIBA Stage 2', 'Milestone Description': 'Concept Design Coordination Model', 'Deliverables': 'Architectural and structural concept models (IFC); design intent report', 'Due Date': '2026-06-30', 'Gate': 'Stage 2 Sign-off', 'Notes': 'LOD 200; models to be federated by Information Manager' },
    { 'Stage/Phase': 'RIBA Stage 3', 'Milestone Description': 'Spatial Coordination Model — Planning Issue', 'Deliverables': 'Coordinated federated model (IFC); clash detection report; planning drawings (PDF)', 'Due Date': '2026-10-31', 'Gate': 'Planning Submission', 'Notes': 'LOD 300; zero unresolved major clashes' },
    { 'Stage/Phase': 'RIBA Stage 4', 'Milestone Description': 'Technical Design Model — Tender Issue', 'Deliverables': 'Fully coordinated technical design model; specification; schedule of materials', 'Due Date': '2027-03-31', 'Gate': 'Tender Issue', 'Notes': 'LOD 350; COBie structure to be in place' },
    { 'Stage/Phase': 'RIBA Stage 5', 'Milestone Description': 'Construction Issue Model', 'Deliverables': 'Construction coordination model; contractor shop drawings; updated clash reports', 'Due Date': '2027-07-01', 'Gate': 'Construction Start', 'Notes': 'LOD 400; monthly model updates required' },
    { 'Stage/Phase': 'RIBA Stage 6–7', 'Milestone Description': 'As-Built Model & AIM Handover', 'Deliverables': 'As-built federated model; COBie data export; O&M manuals; AIM delivery', 'Due Date': '2028-12-31', 'Gate': 'Practical Completion', 'Notes': 'LOD 500; AIM to be validated before handover' },
  ],
  informationSecurityRequirements:
    'All project information shall be classified according to the Appointing Party\'s security classification scheme:\n\n• OPEN — publicly available information (e.g. planning documents)\n• SENSITIVE — commercially sensitive or design information (default classification for all project models and drawings)\n• RESTRICTED — information relating to building security systems, access control, or structural vulnerability\n\nSENSITIVE and RESTRICTED information shall only be shared via the project CDE. RESTRICTED information requires explicit authorisation from the Appointing Party before transmission. All CDE users shall complete a data security awareness briefing before being granted access.',
  spatialCoordinationRequirements:
    'Spatial coordination shall be carried out using the agreed federated model in Autodesk Construction Cloud (ACC). All task teams shall submit IFC models to the shared coordination zone on the agreed schedule. The Information Manager shall run clash detection using Autodesk Navisworks on a minimum monthly cycle and issue a Clash Detection Report within 5 working days of each federation. Major clashes (Severity A) must be resolved within 10 working days; Minor clashes (Severity B) within 20 working days.',
  pimRequirements:
    'The Project Information Model (PIM) shall contain all information produced during the project from concept through to handover. The PIM shall be maintained in the project CDE and shall include:\n\n• Native authoring files (Revit, structural analysis files, MEP models)\n• Federated coordination model (IFC 2x3 or IFC 4)\n• Clash detection reports and coordination issue logs\n• 2D drawings extracted from the model (PDF and DWG)\n• Specifications and schedules\n• Construction programmes and 4D simulations\n\nThe PIM shall be progressively developed to reflect the agreed LOD at each RIBA Stage gate.',
  aimRequirements:
    'The Asset Information Model (AIM) shall be delivered at Practical Completion and shall include:\n\n• As-built geometric models (IFC, LOD 500) for all major building systems\n• COBie data file covering all maintainable assets and components\n• O&M manuals and maintenance schedules (PDF, linked to model components)\n• Warranties and guarantees schedule\n• Fire and life safety information\n• Building Regulation compliance documentation\n\nCOBie data shall be validated against the agreed COBie template prior to submission. The AIM shall be structured to enable import into the Appointing Party\'s CAFM/FM system.',
  informationKpis: [
    { KPI: 'Information Delivery Compliance', Target: '≥ 95% of MIDP items delivered on time', Measurement: 'MIDP tracker — items delivered vs. scheduled', Responsibility: 'Information Manager' },
    { KPI: 'Clash Resolution Rate', Target: 'All Severity A clashes resolved within 10 days', Measurement: 'Clash Detection Report — open vs. closed issues', Responsibility: 'LAP / Design Lead' },
    { KPI: 'Naming Convention Compliance', Target: '100% of submitted containers compliant', Measurement: 'CDE audit — non-compliant files returned to WIP', Responsibility: 'All Task Teams' },
    { KPI: 'COBie Data Quality', Target: 'Zero mandatory field errors at handover', Measurement: 'COBie validation report', Responsibility: 'LAP' },
    { KPI: 'BIM Meeting Attendance', Target: '≥ 90% attendance at scheduled BIM coordination meetings', Measurement: 'Meeting attendance records', Responsibility: 'Information Manager' },
  ],
  healthSafetyRiskManagement:
    'Information produced on this project shall support the Principal Designer\'s and Principal Contractor\'s health and safety obligations under the Construction (Design and Management) Regulations 2015 (CDM 2015). Specific information requirements include:\n\n• Health and Safety File — all task teams shall contribute relevant H&S information in accordance with the agreed H&S File structure\n• Pre-Construction Information — available in the project CDE from project start\n• Construction Phase Plan — contractor to maintain and link to relevant model elements where applicable\n• Structural risk information — to be embedded in model properties for critical structural elements\n• Maintenance access and hazard information — to be included in COBie asset data at handover\n\nH&S information deliverables shall be tracked in the MIDP and reviewed at each Stage gate.',

  // ─── Step 4: Information Standards ───────────────────────────────────────────
  projectSpecificStandards:
    'All information produced on this project shall comply with the following standards and references:\n\n• ISO 19650-1:2018 — Organisation and digitisation of information about buildings and civil engineering works\n• ISO 19650-2:2018 — Delivery phase of the assets\n• PAS 1192-3:2014 — Specification for information management for the operational phase\n• BS EN ISO 9001:2015 — Quality Management Systems\n• NBS BIM Object Standard — for manufacturer and library objects\n• Uniclass 2015 — classification system for all elements, systems, and spaces\n• RIBA Plan of Work 2020 — project stages and information gateways\n\nWhere project-specific requirements deviate from published standards, the BEP shall document the deviation and obtain written approval from the Appointing Party.',
  informationContainerIdentification: {
    overview:
      'All information containers (model files, drawings, documents) shall be named in accordance with the ISO 19650-2 naming convention. The naming convention applies to all files uploaded to the project CDE.',
    namingFields: [
      { label: 'Project Code', example: 'COC', description: 'Unique project identifier assigned by the Appointing Party' },
      { label: 'Originator', example: 'RSA', description: '3-letter code for the originating organisation (from project directory)' },
      { label: 'Zone', example: 'ZZ', description: 'Building zone; ZZ for whole-building scope' },
      { label: 'Level / Location', example: 'L02', description: 'Floor level or location code' },
      { label: 'Type', example: 'M3', description: 'Information type code (e.g. M3 = 3D Model, DR = Drawing, SP = Specification)' },
      { label: 'Role', example: 'A', description: 'Discipline code (A=Architecture, S=Structure, M=Mechanical, E=Electrical, P=Plumbing)' },
      { label: 'Number', example: '0001', description: 'Sequential 4-digit number' },
    ],
    namingPattern: '{ProjectCode}-{Originator}-{Zone}-{Level}-{Type}-{Role}-{Number}',
    deliverableAttributes: [
      { label: 'Revision', example: 'P01', description: 'Preliminary revision; C01 for construction issue' },
      { label: 'Status', example: 'S2', description: 'CDE workflow status code (S0=WIP, S1=Shared, S2=Published, S3=Archived)' },
      { label: 'Classification', example: 'Ss_20_10_30', description: 'Uniclass 2015 classification code' },
    ],
  },
  cdeMetadataRequirements: [
    { 'Metadata Field': 'Document Title', Requirement: 'Mandatory', Format: 'Free text (max 150 characters)', Notes: 'Clear, descriptive title' },
    { 'Metadata Field': 'Document Number', Requirement: 'Mandatory', Format: 'Per naming convention', Notes: 'Auto-generated by CDE on upload' },
    { 'Metadata Field': 'Revision', Requirement: 'Mandatory', Format: 'P01, P02… / C01, C02…', Notes: 'Reset at each Stage gate for new preliminary issue' },
    { 'Metadata Field': 'Status Code', Requirement: 'Mandatory', Format: 'S0 / S1 / S2 / S3', Notes: 'Must match actual CDE folder location' },
    { 'Metadata Field': 'Discipline', Requirement: 'Mandatory', Format: 'From agreed list', Notes: 'Architecture, Structure, MEP, Civil, etc.' },
    { 'Metadata Field': 'RIBA Stage', Requirement: 'Mandatory', Format: 'Stage 2–7', Notes: 'Stage at which container was first issued' },
    { 'Metadata Field': 'Security Classification', Requirement: 'Mandatory', Format: 'OPEN / SENSITIVE / RESTRICTED', Notes: 'Default: SENSITIVE' },
    { 'Metadata Field': 'Uniclass 2015 Code', Requirement: 'Recommended', Format: 'Ss_ / Pr_ / EF_ prefix', Notes: 'Required for all model objects in COBie scope' },
  ],
  lodLoiMatrix: [
    { 'Element Category / Discipline': 'Architectural — General Arrangement', 'Project Stage': 'RIBA 2', LOD: '200', LoI: 'Low', Format: 'RVT / IFC', Responsible: 'Architect', Notes: 'Massing and area schedules only' },
    { 'Element Category / Discipline': 'Architectural — General Arrangement', 'Project Stage': 'RIBA 3', LOD: '300', LoI: 'Medium', Format: 'RVT / IFC', Responsible: 'Architect', Notes: 'Planning-level detail; room data included' },
    { 'Element Category / Discipline': 'Architectural — General Arrangement', 'Project Stage': 'RIBA 4', LOD: '350', LoI: 'High', Format: 'RVT / IFC', Responsible: 'Architect', Notes: 'Full specification, finishes and fixtures' },
    { 'Element Category / Discipline': 'Structural', 'Project Stage': 'RIBA 3', LOD: '300', LoI: 'Medium', Format: 'RVT / IFC', Responsible: 'Structural Engineer', Notes: 'Grid, column and beam sizes' },
    { 'Element Category / Discipline': 'Structural', 'Project Stage': 'RIBA 4', LOD: '350', LoI: 'High', Format: 'RVT / IFC', Responsible: 'Structural Engineer', Notes: 'Connection details and cast-in items' },
    { 'Element Category / Discipline': 'MEP Systems', 'Project Stage': 'RIBA 3', LOD: '200', LoI: 'Low', Format: 'RVT / IFC', Responsible: 'MEP Engineer', Notes: 'Schematic routing and space allocation' },
    { 'Element Category / Discipline': 'MEP Systems', 'Project Stage': 'RIBA 4', LOD: '350', LoI: 'High', Format: 'RVT / IFC', Responsible: 'MEP Engineer', Notes: 'Full equipment schedules and connection data' },
    { 'Element Category / Discipline': 'MEP Systems', 'Project Stage': 'RIBA 5–6', LOD: '400', LoI: 'High', Format: 'RVT / IFC', Responsible: 'MEP Contractor', Notes: 'Fabrication-level; COBie asset data' },
    { 'Element Category / Discipline': 'All Disciplines', 'Project Stage': 'RIBA 7 (Handover)', LOD: '500', LoI: 'Full', Format: 'IFC / COBie', Responsible: 'LAP', Notes: 'As-built; all COBie mandatory fields populated' },
  ],
  dataExchangeFormats: [
    { 'Exchange Type': 'Model Coordination (inter-discipline)', Format: 'IFC 2x3 or IFC 4', Purpose: 'Clash detection and federated model review', Notes: 'IFC export settings to be agreed at BIM kick-off' },
    { 'Exchange Type': 'Native Model Files', Format: 'Autodesk Revit (.rvt)', Purpose: 'Intra-discipline coordination and design development', Notes: 'Shared via CDE in agreed folder structure' },
    { 'Exchange Type': 'Drawings', Format: 'PDF (vector) + DWG', Purpose: 'Construction issue and regulatory submission', Notes: 'PDF primary; DWG where specifically requested' },
    { 'Exchange Type': 'Specifications', Format: 'PDF + NBS format', Purpose: 'Procurement and construction reference', Notes: 'NBS Chorus preferred' },
    { 'Exchange Type': 'Asset Data (Handover)', Format: 'COBie (XLSX or IFC-COBie)', Purpose: 'FM handover and CAFM import', Notes: 'COBie template provided by Appointing Party' },
    { 'Exchange Type': 'GIS / Survey', Format: 'DWG / LandXML / GeoTIFF', Purpose: 'Site survey and topographic data', Notes: 'OS National Grid coordinates (EPSG:27700)' },
  ],
  softwarePlatforms: [
    { 'Platform/Tool': 'Autodesk Revit', Usage: 'Authoring (Architecture, Structure, MEP)', 'Information Types': 'Native .rvt models, schedules, drawings', Notes: 'Version 2024 minimum; shared models via CDE' },
    { 'Platform/Tool': 'Autodesk Construction Cloud (ACC)', Usage: 'Common Data Environment (CDE)', 'Information Types': 'All project information containers', Notes: 'Primary CDE; all task teams must have ACC access' },
    { 'Platform/Tool': 'Autodesk Navisworks Manage', Usage: 'Clash detection and 4D simulation', 'Information Types': 'NWD / NWF federated models', Notes: 'Used by Information Manager and LAP' },
    { 'Platform/Tool': 'Solibri Model Checker', Usage: 'Model quality checking (IFC)', 'Information Types': 'IFC files', Notes: 'Optional; used for IFC compliance validation' },
    { 'Platform/Tool': 'Microsoft Excel', Usage: 'COBie data and schedules', 'Information Types': 'COBie XLSX, MIDP, RACI', Notes: 'COBie template provided; validated before submission' },
  ],
  informationModelQuality:
    'Information models shall meet the following quality standards before being moved from the WIP to the Shared zone of the CDE:\n\n1. No critical Navisworks or Solibri errors (model must be clash-free at Severity A within discipline)\n2. All objects must carry the mandatory property sets as defined in the LOD/LOI matrix\n3. Naming convention compliance — zero non-conformances\n4. Model origin and shared coordinates aligned to the agreed survey control points\n5. File size optimised — large RVT files should be split by discipline/zone to remain below 200 MB\n6. IFC export validated against the agreed IFC export configuration\n\nModel quality audits shall be conducted by the Information Manager at each Stage gate. Non-compliant containers will be returned to the originator for correction.',

  // ─── Step 5: Information Production Methods and Procedures ───────────────────
  responsibilityMatrix: [],
  cdeWorkflow:
    'The project Common Data Environment (CDE) is hosted on Autodesk Construction Cloud (ACC). The following workflow states apply to all information containers:\n\n• WIP (Work in Progress) — information being produced; accessible only to the originating task team\n• SHARED (In Review / Coordination) — information submitted for coordination, review, or approval; accessible to authorised reviewers\n• PUBLISHED (Approved / Issued) — information formally issued for a defined purpose (e.g. construction, regulatory submission)\n• ARCHIVED — superseded information retained for reference\n\nTransitions between states require formal review and acceptance. No information shall be used for construction purposes unless it has reached PUBLISHED status with the correct issue purpose code.',
  informationExchangeFrequency:
    'Information exchanges shall occur at the following minimum frequencies:\n\n• Coordination models (IFC) — monthly during RIBA Stages 3–5; bi-weekly during the peak construction phase\n• RFI / Technical Query responses — within 10 working days of receipt\n• Drawing issues — in accordance with the agreed MIDP schedule\n• Clash Detection Reports — within 5 working days of each model federation\n• MIDP updates — monthly review and re-issue if substantive changes occur\n• COBie data updates — quarterly during RIBA Stage 5; final issue at Practical Completion',
  mobilisationProcedures:
    'Mobilisation shall be completed within 4 weeks of contract award and shall include:\n\n1. CDE setup — project workspace configured in ACC; folder structure and naming conventions applied; all task team members granted appropriate access roles\n2. Template distribution — Revit templates, IFC export configurations, and COBie spreadsheet issued to all task teams\n3. BIM kick-off meeting — agenda to cover CDE workflow, naming conventions, model origin and shared coordinates, MIDP review, and Q&A\n4. Training — any team member without a current CDE competency must complete the Appointing Party\'s CDE onboarding module before accessing SHARED or PUBLISHED zones\n5. Confirmation — LAP to issue written confirmation to the Appointing Party that mobilisation is complete before information production commences',
  trainingRequirements:
    'The following training requirements apply to all appointed parties:\n\n• CDE Onboarding (ACC) — mandatory for all users; 2-hour online module provided by the Appointing Party\n• ISO 19650 Awareness — recommended for all project team members; evidence of completion to be provided in BEP Appendix\n• Revit Standards & Templates — all Revit authors to complete project-specific standards briefing\n• COBie Data Entry — all task teams responsible for asset data to complete COBie data entry training\n• Clash Detection Review — coordination team leads to be trained in Navisworks clash review process\n\nTraining completion records shall be maintained by the LAP and made available on request.',
  authorisationAcceptanceProcess:
    'Information shall follow the authorisation and acceptance process defined below before progressing to PUBLISHED status:\n\n1. Author — produces information in WIP zone; carries out internal quality checks\n2. Checker — independent technical check within the same task team\n3. Reviewer — cross-discipline coordination review (LAP or Information Manager)\n4. Approver — formal acceptance by the Appointing Party or delegated authority\n\nAll review comments shall be recorded in the project CDE. Information shall not be resubmitted unless all comments are addressed or formally rejected with written justification. The target review cycle is 10 working days.',
  spatialCoordinationStrategy:
    'Spatial coordination shall use a "divide and conquer" approach by zone and level:\n\n• Building model divided into 4 zones (Zone A: North Core, Zone B: South Office, Zone C: Ground Level Retail, Zone D: Basement)\n• Each task team is responsible for its discipline model within the agreed zone\n• The Information Manager produces the federated model by combining all zone models in Navisworks\n• Clash tolerance: ±10 mm for hard clashes; ±50 mm for soft clearance\n• Coordination meetings: fortnightly during RIBA Stages 3–5; weekly during critical construction phases\n• Priority coordination areas: plant rooms, core service risers, ceiling voids at level changes',
  legacyInformationRequirements:
    'The following legacy information is available and shall be incorporated into the project PIM where applicable:\n\n• Site survey and topographic survey (DWG format) — provided by Appointing Party at project start\n• Geotechnical investigation report (PDF) — available in CDE PUBLISHED zone\n• Existing services survey (PDF/DWG) — to be verified and modelled as a starting point for MEP design\n• Planning history documents — available from the Appointing Party\n\nAll legacy information shall be reviewed for accuracy and fitness for purpose before use. The originator of any model element derived from legacy data shall note the source in the element properties.',
  captureExistingAssetInformation:
    'Existing asset information shall be captured as follows:\n\n• A full topographic and measured building survey shall be commissioned prior to RIBA Stage 2 and made available in the project CDE\n• Where demolition or enabling works are required, a pre-demolition survey shall be completed and archived\n• Existing M&E services shall be surveyed and the survey data incorporated into the MEP coordination model by RIBA Stage 3\n• Any existing asset data available from the Appointing Party\'s CAFM system shall be reviewed for potential incorporation into the AIM at handover',
  informationContainerBreakdownStructure:
    'The Information Container Breakdown Structure (ICBS) defines how project information is organised in the CDE. The ICBS is structured as follows:\n\n• Level 1: CDE Zone (WIP / SHARED / PUBLISHED / ARCHIVED)\n• Level 2: Discipline (Architecture, Structure, MEP, Civil, Landscape, Fire, etc.)\n• Level 3: Building Zone (Zone A–D, as per spatial coordination zones)\n• Level 4: RIBA Stage\n• Level 5: Information Type (Models, Drawings, Specifications, Reports, Data)\n\nThe full ICBS directory structure is defined in the CDE setup document, which forms an appendix to the BEP.',
  federationStrategy:
    'The federated model is the primary coordination tool for the project and shall be maintained by the Information Manager throughout design and construction.\n\n**Model ownership:**\n• Each discipline task team owns and maintains its own authoring model\n• The Information Manager owns the federated coordination model (NWD/NWF)\n\n**Coordination zones:**\n• The building is divided into 4 coordination zones (see Spatial Coordination Strategy)\n• Task teams shall use the agreed shared coordinates origin (OS National Grid, EPSG:27700) in all models\n\n**Federation schedule:**\n• Monthly federation during RIBA Stages 3–5\n• Bi-weekly federation during peak construction (RIBA Stage 5 months 3–18)\n• Additional ad-hoc federation may be requested for critical design issues\n\n**Clash detection responsibilities:**\n• Information Manager: runs all-discipline clash detection; issues Clash Detection Report\n• Discipline leads: responsible for resolving clashes within their discipline scope\n• LAP: escalates unresolved clashes to design coordination meeting',
  lessonsLearnt:
    'A formal lessons learnt process shall be applied throughout the project:\n\n• At each RIBA Stage gate, the Information Manager shall facilitate a lessons learnt workshop with task team leads\n• Lessons learnt relating to information management (CDE, coordination, naming, COBie) shall be captured in a register maintained in the project CDE\n• The register shall be reviewed at the start of each new stage and relevant lessons applied to the updated BEP\n• At project close, a final lessons learnt report shall be issued to the Appointing Party for incorporation into their organisational knowledge base\n• Positive lessons (what worked well) shall be captured alongside areas for improvement',

  // ─── Step 6: Appendices ────────────────────────────────────────────────────────
  appendixResponsibilityMatrix: [
    { Activity: 'CDE Administration & Access Management', Responsible: 'Information Manager', Accountable: 'LAP', Consulted: 'Appointing Party', Informed: 'All Task Teams' },
    { Activity: 'BEP Production & Maintenance', Responsible: 'LAP', Accountable: 'LAP', Consulted: 'Appointing Party', Informed: 'All Task Teams' },
    { Activity: 'MIDP Production & Maintenance', Responsible: 'Information Manager', Accountable: 'LAP', Consulted: 'All Task Teams', Informed: 'Appointing Party' },
    { Activity: 'Model Authoring (Architecture)', Responsible: 'Architect', Accountable: 'Architect', Consulted: 'LAP', Informed: 'Information Manager' },
    { Activity: 'Model Authoring (Structure)', Responsible: 'Structural Engineer', Accountable: 'Structural Engineer', Consulted: 'LAP', Informed: 'Information Manager' },
    { Activity: 'Model Authoring (MEP)', Responsible: 'MEP Engineer', Accountable: 'MEP Engineer', Consulted: 'LAP', Informed: 'Information Manager' },
    { Activity: 'Federated Model Production', Responsible: 'Information Manager', Accountable: 'LAP', Consulted: 'All Discipline Leads', Informed: 'Appointing Party' },
    { Activity: 'Clash Detection & Reporting', Responsible: 'Information Manager', Accountable: 'LAP', Consulted: 'Discipline Leads', Informed: 'Appointing Party' },
    { Activity: 'COBie Data Entry & QA', Responsible: 'All Task Teams', Accountable: 'LAP', Consulted: 'FM Consultant', Informed: 'Appointing Party' },
    { Activity: 'AIM Validation & Handover', Responsible: 'LAP', Accountable: 'LAP', Consulted: 'FM Consultant', Informed: 'Appointing Party' },
  ],
  appendixMilestonesTable: [
    { Stage: 'RIBA Stage 2', Milestone: 'Concept Design Coordination Model', Date: '2026-06-30', Purpose: 'Design review and client sign-off', Deliverables: 'IFC models (Arch + Structure); federated NWD; design report' },
    { Stage: 'RIBA Stage 3', Milestone: 'Spatial Coordination Model — Planning Issue', Date: '2026-10-31', Purpose: 'Planning submission; spatial coordination complete', Deliverables: 'Coordinated IFC; clash report; planning drawings PDF' },
    { Stage: 'RIBA Stage 4', Milestone: 'Technical Design Model — Tender Issue', Date: '2027-03-31', Purpose: 'Procurement; construction tender', Deliverables: 'Full coordinated model (LOD 350); specification; COBie skeleton' },
    { Stage: 'RIBA Stage 5', Milestone: 'Construction Issue Model', Date: '2027-07-01', Purpose: 'Construction commencement', Deliverables: 'Construction-ready models (LOD 400); updated coordination reports' },
    { Stage: 'RIBA Stage 6–7', Milestone: 'As-Built Model & AIM Handover', Date: '2028-12-31', Purpose: 'Practical Completion; FM handover', Deliverables: 'As-built models (LOD 500); COBie export; O&M manuals; AIM' },
  ],
  appendixLodLoiMatrix: [
    { Discipline: 'Architecture', Stage: 'RIBA 2', LOD: '200', LOI: 'Low', Format: 'RVT / IFC', Notes: 'Massing, area schedules' },
    { Discipline: 'Architecture', Stage: 'RIBA 3', LOD: '300', LOI: 'Medium', Format: 'RVT / IFC', Notes: 'Spatial design, room data' },
    { Discipline: 'Architecture', Stage: 'RIBA 4', LOD: '350', LOI: 'High', Format: 'RVT / IFC', Notes: 'Full spec, finishes, fixtures' },
    { Discipline: 'Structure', Stage: 'RIBA 3', LOD: '300', LOI: 'Medium', Format: 'RVT / IFC', Notes: 'Grid, column/beam sizes' },
    { Discipline: 'Structure', Stage: 'RIBA 4', LOD: '350', LOI: 'High', Format: 'RVT / IFC', Notes: 'Connections, cast-in items' },
    { Discipline: 'MEP', Stage: 'RIBA 3', LOD: '200', LOI: 'Low', Format: 'RVT / IFC', Notes: 'Schematic routing' },
    { Discipline: 'MEP', Stage: 'RIBA 4', LOD: '350', LOI: 'High', Format: 'RVT / IFC', Notes: 'Equipment schedules' },
    { Discipline: 'All', Stage: 'RIBA 7', LOD: '500', LOI: 'Full', Format: 'IFC / COBie', Notes: 'As-built; full COBie' },
  ],
  appendixSoftwareSchedule: [
    { Software: 'Autodesk Revit 2024', Version: '2024', Formats: '.rvt, IFC 2x3/4', Purpose: 'Model authoring', Notes: 'Mandatory for Architecture, Structure, MEP' },
    { Software: 'Autodesk Construction Cloud (ACC)', Version: 'SaaS', Formats: 'All formats', Purpose: 'CDE', Notes: 'All parties must hold valid ACC licence' },
    { Software: 'Autodesk Navisworks Manage 2024', Version: '2024', Formats: '.nwd, .nwf, IFC', Purpose: 'Coordination / clash detection', Notes: 'Information Manager and LAP only' },
    { Software: 'Autodesk AutoCAD 2024', Version: '2024', Formats: '.dwg, .dxf', Purpose: '2D drawings (civil / surveys)', Purpose2: '', Notes: 'Where 3D authoring is not applicable' },
    { Software: 'Microsoft Excel', Version: '365', Formats: '.xlsx', Purpose: 'COBie, MIDP, RACI', Notes: '' },
  ],
  appendixCdeSpec:
    'CDE Platform: Autodesk Construction Cloud (ACC) — Document Management module\n\nProject URL: To be confirmed at project award\n\nFolder structure: As per agreed ICBS (see Information Container Breakdown Structure section)\n\nAccess roles:\n• Appointing Party — Full read access to all zones; approval rights for PUBLISHED zone\n• LAP / Information Manager — Admin rights; CDE management\n• Task Teams — WIP write access to own discipline folder; SHARED read access to all; PUBLISHED read access\n• External Reviewers — SHARED read access to specified folders only\n\nRetention: All project information to be retained in ARCHIVE zone for a minimum of 10 years post-completion\n\nBackup: ACC provides automatic cloud backup; Appointing Party to maintain a separate archive export at each Stage gate',
  appendixSecurityMetadata: [
    { Classification: 'OPEN', Description: 'Publicly available information', Metadata: 'PUBLIC tag in CDE', Controls: 'No restrictions; may be shared externally' },
    { Classification: 'SENSITIVE', Description: 'Commercial, design, or technical information', Metadata: 'SENSITIVE tag; default for all project files', Controls: 'CDE access only; no unauthorised forwarding' },
    { Classification: 'RESTRICTED', Description: 'Security-sensitive building information', Metadata: 'RESTRICTED tag; separate folder in CDE', Controls: 'Named individuals only; Appointing Party approval required for access' },
  ],
  appendixClassificationSystem: [
    { Category: 'Systems', Classification: 'Uniclass 2015 Ss_', 'Code Format': 'Ss_XX_XX_XX', Application: 'Building systems (HVAC, electrical, plumbing, fire)' },
    { Category: 'Products', Classification: 'Uniclass 2015 Pr_', 'Code Format': 'Pr_XX_XX_XX', Application: 'Individual products and components' },
    { Category: 'Elements', Classification: 'Uniclass 2015 EF_', 'Code Format': 'EF_XX_XX_XX', Application: 'Building elements (walls, slabs, roofs)' },
    { Category: 'Spaces', Classification: 'Uniclass 2015 SL_', 'Code Format': 'SL_XX_XX_XX', Application: 'Spatial locations and zones' },
    { Category: 'Activities', Classification: 'Uniclass 2015 Ac_', 'Code Format': 'Ac_XX_XX_XX', Application: 'FM activities and maintenance tasks' },
  ],
  appendixExampleRequirementsTables:
    'Example structured requirement (LOI property set — MEP equipment):\n\nProperty Set: Pset_ManufacturerTypeInformation\n• Manufacturer (string, mandatory)\n• ModelLabel (string, mandatory)\n• ArticleNumber (string, recommended)\n• Warranty (string, recommended)\n\nProperty Set: Pset_MaintenanceRequirements\n• MaintenanceInterval (duration, mandatory for FM assets)\n• MaintenanceDescription (string, recommended)\n\nExample unstructured requirement (NBS specification clause):\n"Refer to NBS Specification Section Y50 — Thermal insulation for pipework and ductwork. Contractor to provide product data sheets and thermal performance certificates for all insulation products. Certificates to be uploaded to the CDE PUBLISHED zone under the Specifications folder."',
};

export default COMMERCIAL_OFFICE_EIR_TEMPLATE;
