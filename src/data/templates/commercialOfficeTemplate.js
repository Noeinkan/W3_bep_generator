import { RESOURCE_COLUMNS_PRE, RESOURCE_COLUMNS_POST } from '../emptyBepData';

// Commercial Office BEP Template
// Contains pre-filled data for a typical commercial office project
const COMMERCIAL_OFFICE_TEMPLATE = {
  // Common fields for both BEP types
  projectName: 'Greenfield Office Complex Phase 2',
  projectNumber: 'GF-2024-017',
  projectDescription: 'A modern 8-story office complex featuring sustainable design principles, flexible workspace layouts, and integrated smart building technologies. The building will accommodate 800+ employees across multiple tenants with shared amenities including conference facilities, cafeteria, and underground parking for 200 vehicles.',
  projectType: 'Commercial Building',
  appointingParty: 'ABC Development Corporation',

  // Pre-appointment specific fields
  proposedTimeline: '24 months (Jan 2025 - Dec 2026)',
  estimatedBudget: '£12.5 million',
  tenderApproach: 'Our approach emphasizes collaborative design coordination through advanced BIM workflows, early stakeholder engagement, and integrated sustainability analysis. We propose a phased delivery strategy with continuous value engineering and risk mitigation throughout all project stages.',
  proposedLead: 'Smith & Associates Architects Ltd.',
  proposedInfoManager: 'Sarah Johnson, BIM Manager (RICS Certified, ISO 19650 Lead)',

  // Executive Summary fields
  projectContext: 'This BEP outlines our comprehensive approach to delivering the Greenfield Office Complex using advanced BIM methodologies. Our strategy emphasizes collaborative design coordination, data-driven decision making, and seamless information handover to support long-term facility management. The project will serve as a flagship example of sustainable commercial development in the region.',
  bimStrategy: 'Our BIM strategy centers on early clash detection, integrated 4D/5D modeling for construction sequencing and cost control, and comprehensive digital twin creation for facilities management. We will utilize federated models across all disciplines with real-time collaboration through cloud-based platforms, ensuring design quality and construction efficiency while reducing project risks.',
  keyCommitments: {
    intro: 'We commit to full ISO 19650-2:2018 compliance throughout all project phases. Key deliverables include:',
    table: [
      { 'Deliverable': 'Coordinated Federated Models', 'Description': 'Multi-discipline coordinated models at each design milestone with clash detection', 'Due Date': 'Each milestone' },
      { 'Deliverable': 'COBie Data Handover', 'Description': 'Comprehensive asset data for facility management integration', 'Due Date': 'Project completion' },
      { 'Deliverable': '4D Construction Sequences', 'Description': 'Time-phased construction models for all major building elements', 'Due Date': 'Pre-construction' },
      { 'Deliverable': 'Digital Twin with IoT', 'Description': 'Complete digital twin with integrated IoT sensor data', 'Due Date': 'Project handover' }
    ]
  },
  keyContacts: [
    { 'Role': 'Project Director', 'Name': 'John Smith', 'Company': 'Smith & Associates Architects Ltd.', 'Email': 'j.smith@smithassociates.com', 'Phone Number': '+44 20 1234 5678' },
    { 'Role': 'BIM Manager', 'Name': 'Sarah Johnson', 'Company': 'Smith & Associates Architects Ltd.', 'Email': 's.johnson@smithassociates.com', 'Phone Number': '+44 20 1234 5679' },
    { 'Role': 'Client Representative', 'Name': 'David Brown', 'Company': 'ABC Development Corporation', 'Email': 'd.brown@abcdev.com', 'Phone Number': '+44 20 9876 5432' },
    { 'Role': 'Information Manager', 'Name': 'Sarah Johnson', 'Company': 'Smith & Associates Architects Ltd.', 'Email': 's.johnson@smithassociates.com', 'Phone Number': '+44 20 1234 5679' },
    { 'Role': 'Lead Architect', 'Name': 'Emma Davis', 'Company': 'Smith & Associates Architects Ltd.', 'Email': 'e.davis@smithassociates.com', 'Phone Number': '+44 20 1234 5680' },
    { 'Role': 'Structural Lead', 'Name': 'Robert Chen', 'Company': 'Engineering Excellence Ltd.', 'Email': 'r.chen@engexcel.com', 'Phone Number': '+44 20 2345 6789' },
    { 'Role': 'MEP Lead', 'Name': 'Lisa Rodriguez', 'Company': 'Advanced Systems Group', 'Email': 'l.rodriguez@asg.com', 'Phone Number': '+44 20 3456 7890' }
  ],
  valueProposition: 'Our BIM approach will deliver 15% reduction in construction costs through early clash detection, 25% faster design coordination, and comprehensive lifecycle cost analysis enabling informed material selections. The digital twin will provide 30% operational cost savings through predictive maintenance and space optimization, while the structured data handover ensures seamless facilities management integration.',

  proposedTeamLeaders: [
    { 'Discipline': 'Architecture', 'Name & Title': 'John Smith, Director', 'Company': 'Modern Design Associates', 'Experience': '12 years BIM experience, 50+ projects' },
    { 'Discipline': 'Structural', 'Name & Title': 'Emily Chen, Senior Engineer', 'Company': 'Engineering Excellence Ltd.', 'Experience': '10 years structural BIM, P.Eng' },
    { 'Discipline': 'MEP', 'Name & Title': 'Michael Rodriguez, BIM Coordinator', 'Company': 'Advanced Systems Group', 'Experience': '8 years MEP coordination experience' },
    { 'Discipline': 'Facades', 'Name & Title': 'David Wilson, Technical Director', 'Company': 'Curtain Wall Experts Ltd.', 'Experience': '15 years facade design, BIM certified' }
  ],
  teamCapabilities: 'Our multidisciplinary team brings 15+ years of BIM implementation experience across £500M+ of commercial projects. Key capabilities include: ISO 19650 certified information management, advanced parametric design using Revit/Grasshopper, integrated MEP coordination, 4D/5D modeling expertise, and digital twin development. Recent projects include the award-winning Tech Hub (£25M) and Riverside Commercial Center (£18M).',
  proposedResourceAllocation: {
    columns: RESOURCE_COLUMNS_PRE,
    data: [
      { 
        'Role': 'Senior BIM Coordinator', 
        'Proposed Personnel': 'John Doe (15+ years experience)', 
        'Key Competencies/Experience': 'ISO 19650-certified; Expert in BIM federation and clash detection; Navisworks specialist', 
        'Anticipated Weekly Allocation (Hours)': '40 (full-time)', 
        'Software/Hardware Requirements': 'Revit 2024, Navisworks Manage; High-spec workstation (32GB RAM)', 
        'Notes': 'Will lead federation strategy and coordinate all disciplines'
      },
      { 
        'Role': 'Architectural BIM Lead', 
        'Proposed Personnel': 'Emma Davis (10+ years)', 
        'Key Competencies/Experience': 'Revit Architecture certified; Advanced Dynamo scripting; IFC export expert', 
        'Anticipated Weekly Allocation (Hours)': '40 (full-time)', 
        'Software/Hardware Requirements': 'Revit 2024, Dynamo, Rhino/Grasshopper', 
        'Notes': 'Responsible for architectural model quality and team coordination'
      },
      { 
        'Role': 'Information Manager', 
        'Proposed Personnel': 'Sarah Johnson (8+ years)', 
        'Key Competencies/Experience': 'ISO 19650 Lead Assessor; CDE implementation specialist; Audit and compliance expert', 
        'Anticipated Weekly Allocation (Hours)': '20 (part-time)', 
        'Software/Hardware Requirements': 'BIM 360, Audit software', 
        'Notes': 'Will oversee information protocols and ensure ISO 19650 compliance'
      }
    ]
  },
  proposedMobilizationPlan: `Upon appointment, we will mobilize the team within 3 weeks:

**Week 1 - Onboarding:** Team orientation, ISO 19650-2 training (2-day workshop), information security briefings, EIR review sessions with all team leaders.

**Week 2 - IT Setup:** Software licensing activation (Revit 2024, Navisworks), workstation configuration, BIM 360 platform setup, cloud storage allocation, VPN configuration for remote collaboration.

**Week 3 - Verification:** Pilot model production for each discipline, federation testing, IFC export quality checks, CDE submission workflow testing, review against EIR requirements.

**Risk Mitigation:** We have identified potential risks (IT connectivity, specialist availability) with contingency plans including backup consultants and floating software licenses. Our proven mobilization process has achieved 100% on-time readiness on our last 5 projects.`,
  subcontractors: [
    { 'Role/Service': 'MEP Services', 'Company Name': 'Advanced Systems Group', 'Certification': 'ISO 19650 certified', 'Contact': 'info@advancedsystems.com' },
    { 'Role/Service': 'Curtain Wall', 'Company Name': 'Specialist Facades Ltd.', 'Certification': 'BIM Level 2 compliant', 'Contact': 'projects@specialistfacades.com' },
    { 'Role/Service': 'Landscaping', 'Company Name': 'Green Spaces Design', 'Certification': 'Autodesk certified', 'Contact': 'design@greenspaces.com' }
  ],
  trackRecordProjects: [
    { 'Project Name': 'Tech Innovation Hub', 'Value': '£25M', 'Completion Date': 'March 2023', 'Project Type': 'Commercial Office', 'Our Role': 'Lead Design Consultant', 'Key BIM Achievements': 'Zero clashes at construction, 30% RFI reduction, BREEAM Excellent achieved' },
    { 'Project Name': 'Riverside Commercial Centre', 'Value': '£18M', 'Completion Date': 'August 2022', 'Project Type': 'Mixed Use', 'Our Role': 'BIM Coordinator', 'Key BIM Achievements': '4D sequencing reduced programme by 8 weeks, digital twin handover' },
    { 'Project Name': 'Metropolitan Tower Refurbishment', 'Value': '£12M', 'Completion Date': 'December 2021', 'Project Type': 'Renovation/Retrofit', 'Our Role': 'Design Lead', 'Key BIM Achievements': 'Scan-to-BIM for existing conditions, clash-free MEP coordination' },
    { 'Project Name': 'University Research Building', 'Value': '£35M', 'Completion Date': 'June 2021', 'Project Type': 'Education', 'Our Role': 'Lead Appointed Party', 'Key BIM Achievements': 'Full COBie handover, integrated FM systems, 5D cost tracking' },
    { 'Project Name': 'Corporate Headquarters Phase 1', 'Value': '£42M', 'Completion Date': 'November 2020', 'Project Type': 'Commercial Building', 'Our Role': 'BIM Manager', 'Key BIM Achievements': 'First ISO 19650-certified project, established company BIM standards' }
  ],
  eirComplianceMatrix: [
    { 'EIR Requirement': 'ISO 19650-2:2018 Compliance', 'Our Proposed Response': 'Full compliance with all clauses; certified Information Manager leads delivery', 'Evidence/Experience': 'ISO 19650 Lead certification; 5+ projects delivered to ISO 19650', 'BEP Section Reference': 'Section 1, 3, 6' },
    { 'EIR Requirement': 'Federated Model Delivery', 'Our Proposed Response': 'Weekly federation using Navisworks with automated clash detection', 'Evidence/Experience': 'Tech Hub project: zero construction clashes', 'BEP Section Reference': 'Section 9.7' },
    { 'EIR Requirement': 'COBie Data at Handover', 'Our Proposed Response': 'Progressive COBie population with milestone validation', 'Evidence/Experience': 'University Research Building: full COBie handover accepted first time', 'BEP Section Reference': 'Section 5, 14' },
    { 'EIR Requirement': 'CDE Implementation', 'Our Proposed Response': 'BIM 360/Autodesk Construction Cloud with ISO 19650 workflows', 'Evidence/Experience': '8+ projects using cloud CDE platforms', 'BEP Section Reference': 'Section 7' },
    { 'EIR Requirement': 'LOD 350 for Construction', 'Our Proposed Response': 'Staged LOD progression with quality gates at each milestone', 'Evidence/Experience': 'Established LOD protocols; Solibri validation at each stage', 'BEP Section Reference': 'Section 5' },
    { 'EIR Requirement': 'IFC 4 Exchange', 'Our Proposed Response': 'Native authoring with validated IFC 4 exports; weekly testing', 'Evidence/Experience': 'Proven IFC workflows; buildingSMART certified validators', 'BEP Section Reference': 'Section 8' },
    { 'EIR Requirement': '4D Construction Sequencing', 'Our Proposed Response': 'Synchro Pro integration with contractor programme', 'Evidence/Experience': 'Riverside Centre: 8-week programme reduction through 4D', 'BEP Section Reference': 'Section 4' },
    { 'EIR Requirement': 'Digital Twin Handover', 'Our Proposed Response': 'Progressive digital twin development with IoT integration framework', 'Evidence/Experience': 'Tech Hub digital twin operational since 2023', 'BEP Section Reference': 'Section 4, 6' }
  ],
  proposedBimGoals: 'We propose to implement a collaborative BIM workflow that will improve design coordination by 60%, reduce construction conflicts by 90%, optimize project delivery timelines by 20%, and establish a comprehensive digital asset for facility management handover.',
  proposedObjectives: 'Our proposed objectives include achieving zero design conflicts at construction stage, reducing RFIs by 40%, improving construction efficiency by 25%, and delivering comprehensive FM data for operations.',
  intendedBimUses: ['Design Authoring', '3D Coordination', 'Clash Detection', 'Quantity Take-off', '4D Planning'],

  // Post-appointment specific fields
  confirmedTimeline: '24 months (Jan 2025 - Dec 2026)',
  confirmedBudget: '£12.5 million',
  deliveryApproach: 'Our delivery approach implements collaborative design coordination through advanced BIM workflows, stakeholder integration at key milestones, and continuous value engineering. We will execute a phased delivery strategy with integrated sustainability analysis and proactive risk management throughout all project stages to ensure on-time, on-budget completion.',
  referencedMaterial: {
    intro: 'This BEP references and responds to the following documents and standards:',
    table: [
      { 'Document/Standard': 'Exchange Information Requirements (EIR)', 'Version/Date': 'v2.1 - March 2024', 'Relevance/Purpose': 'Defines client information requirements and delivery expectations' },
      { 'Document/Standard': 'Project Information Requirements (PIR)', 'Version/Date': 'March 2024', 'Relevance/Purpose': 'Specifies project-specific information delivery standards' },
      { 'Document/Standard': 'ISO 19650-2:2018', 'Version/Date': '2018', 'Relevance/Purpose': 'Information management framework for delivery phase' },
      { 'Document/Standard': 'BS 1192:2007+A2:2016', 'Version/Date': '2007+A2:2016', 'Relevance/Purpose': 'Collaborative production of architectural, engineering and construction information' },
      { 'Document/Standard': 'PAS 1192-2:2013', 'Version/Date': '2013', 'Relevance/Purpose': 'Specification for information management for the capital/delivery phase' },
      { 'Document/Standard': 'Client BIM Standards Manual', 'Version/Date': 'v3.0', 'Relevance/Purpose': 'Client-specific BIM standards and procedures' },
      { 'Document/Standard': 'Health & Safety Information Requirements', 'Version/Date': 'Current', 'Relevance/Purpose': 'CDM regulations and safety information requirements' },
      { 'Document/Standard': 'RIBA Plan of Work 2020', 'Version/Date': '2020', 'Relevance/Purpose': 'Project stage definitions and deliverable milestones' }
    ]
  },
  leadAppointedParty: 'Smith & Associates Architects Ltd.',
  informationManager: 'Sarah Johnson, BIM Manager (RICS Certified, ISO 19650 Lead)',
  assignedTeamLeaders: [
    { 'Discipline': 'Architecture', 'Name & Title': 'John Smith, Project Director', 'Company': 'Modern Design Associates', 'Role Details': 'Overall design coordination and client liaison' },
    { 'Discipline': 'Structural', 'Name & Title': 'Emily Chen, Senior Engineer', 'Company': 'Engineering Excellence Ltd.', 'Role Details': 'Structural design and analysis coordination' },
    { 'Discipline': 'MEP', 'Name & Title': 'Michael Rodriguez, BIM Coordinator', 'Company': 'Advanced Systems Group', 'Role Details': 'MEP systems integration and clash detection' },
    { 'Discipline': 'Facades', 'Name & Title': 'David Wilson, Technical Director', 'Company': 'Curtain Wall Experts Ltd.', 'Role Details': 'Facade design and performance optimization' }
  ],
  finalizedParties: [
    { 'Role/Service': 'Architecture', 'Company Name': 'Modern Design Associates', 'Lead Contact': 'John Smith - j.smith@mda.com', 'Contract Value': '£2.1M' },
    { 'Role/Service': 'Structural Engineering', 'Company Name': 'Engineering Excellence Ltd.', 'Lead Contact': 'Emily Chen - e.chen@engexcel.com', 'Contract Value': '£1.8M' },
    { 'Role/Service': 'MEP Engineering', 'Company Name': 'Advanced Systems Group', 'Lead Contact': 'Michael Rodriguez - m.rodriguez@asg.com', 'Contract Value': '£3.2M' },
    { 'Role/Service': 'Quantity Surveying', 'Company Name': 'Cost Management Partners', 'Lead Contact': 'Sarah Williams - s.williams@cmp.com', 'Contract Value': '£0.3M' },
    { 'Role/Service': 'Specialist Facades', 'Company Name': 'Curtain Wall Experts Ltd.', 'Lead Contact': 'David Wilson - d.wilson@cwe.com', 'Contract Value': '£4.5M' }
  ],
  resourceAllocationTable: {
    columns: RESOURCE_COLUMNS_POST,
    data: [
      { 
        'Role': 'Senior BIM Coordinator', 
        'Assigned Personnel': 'John Doe, Jane Smith', 
        'Key Competencies/Experience': '10+ years BIM federation; ISO 19650-certified; Expert in clash detection and CDE workflows', 
        'Weekly Allocation (Hours)': '80 (2x40 FTE)', 
        'Software/Hardware Requirements': 'Revit 2024, Navisworks Manage; High-spec workstations (32GB RAM, dedicated GPU)', 
        'Notes': 'Leads federation strategy per ISO 19650-2 clause 5.3.2(c); Training provided on CDE workflows'
      },
      { 
        'Role': 'Discipline BIM Modeler - Architecture', 
        'Assigned Personnel': 'Emma Davis (Lead), Team of 3', 
        'Key Competencies/Experience': '5+ years architectural modeling; Revit certified; IFC export proficiency', 
        'Weekly Allocation (Hours)': '160 (4 FTE)', 
        'Software/Hardware Requirements': 'Revit 2024, AutoCAD; Cloud CDE access', 
        'Notes': 'Ensures model quality per production methods; Interoperability tested with IFC 4 exports'
      },
      { 
        'Role': 'Discipline BIM Modeler - Structural', 
        'Assigned Personnel': 'Alex Kim (Lead), Team of 2', 
        'Key Competencies/Experience': '6+ years structural modeling; Revit Structure expert; Steel connection detailing', 
        'Weekly Allocation (Hours)': '120 (3 FTE)', 
        'Software/Hardware Requirements': 'Revit 2024 Structure, Tekla integration; Analysis software', 
        'Notes': 'Coordination with architectural and MEP models; Clash detection protocols established'
      },
      { 
        'Role': 'Information Manager', 
        'Assigned Personnel': 'Sarah Johnson', 
        'Key Competencies/Experience': '8+ years information protocols; ISO 19650 Lead Assessor certification', 
        'Weekly Allocation (Hours)': '20 (QA/QC)', 
        'Software/Hardware Requirements': 'BIM 360, Aconex; Audit and reporting tools', 
        'Notes': 'Manages version control and approvals; Integrates capacity gaps into risk register per clause 5.3.6'
      },
      { 
        'Role': 'CDE Administrator', 
        'Assigned Personnel': 'Mike Lee', 
        'Key Competencies/Experience': '6+ years CDE setup; Metadata and security protocols', 
        'Weekly Allocation (Hours)': '40 (full-time)', 
        'Software/Hardware Requirements': 'BIM 360 or equivalent; Secure server infrastructure', 
        'Notes': 'Configures CDE per clause 5.1.6; Shared templates and object libraries management'
      }
    ]
  },
  mobilizationPlan: `PHASED MOBILIZATION TIMELINE

Week 1 - Onboarding and Training:
  - Team orientation and project kickoff meeting with all stakeholders
  - ISO 19650-2:2018 training for all personnel (2-day intensive workshop)
  - Information security briefings and CDE access provisioning with role-based permissions
  - Review of EIR requirements and delivery obligations with each task team

Week 2 - IT Infrastructure Setup:
  - Workstation configuration and deployment (Revit 2024, Navisworks, AutoCAD)
  - Software licensing verification and activation for all team members
  - Cloud storage allocation and VPN setup for secure remote collaboration
  - CDE platform configuration (BIM 360) with folder structure, naming conventions, and permissions
  - Shared template files and object libraries deployment

Week 3 - Capability Verification:
  - Pilot model production (one discipline per task team to test workflows)
  - Federation testing and clash detection protocol validation
  - IFC export testing to verify data integrity and interoperability compliance
  - CDE submission procedures walkthrough and quality checks
  - Review against EIR requirements with client feedback integration

RISK MITIGATION STRATEGY

Resource capacity risks (skill shortfalls, IT connectivity issues, software compatibility) are documented in the project risk register per ISO 19650-2 clause 5.3.6. 

Contingency Plans:
  - Access to specialist BIM consultants for advanced workflows
  - Backup internet connectivity (4G/5G mobile hotspots)
  - Alternative software licenses (floating licenses for surge capacity)
  - Escalation protocols via MIDP notifications to client for critical issues

CAPABILITY VERIFICATION

All resources will be tested for collaborative production capability before full information delivery commences. This includes verification of software interoperability, CDE access permissions, and information security compliance.`,
  resourceAllocation: 'Project staffing confirmed: 2x Senior BIM Coordinators, 4x Discipline BIM Modelers, 1x Information Manager, 1x CDE Administrator. Weekly allocation: 40 hours coordination, 160 hours modeling, 20 hours QA/QC.',
  informationManagementResponsibilities: 'Sarah Johnson, Information Manager, oversees all information production, validation, and exchange protocols in full compliance with ISO 19650-2:2018. Key responsibilities include establishing CDE governance structures, coordinating Task Information Delivery Plans (TIDPs) across all disciplines, ensuring model federation quality and consistency, implementing information security protocols including access controls and audit procedures, conducting weekly quality audits of information deliverables, facilitating cross-disciplinary coordination meetings, managing version control and approval workflows, monitoring compliance with established naming conventions and standards, coordinating client information exchanges and milestone reviews, and providing regular progress reports to project leadership on information delivery performance.',
  organizationalStructure: {
    id: 'appointing_gf2024',
    name: 'ABC Development Corporation',
    role: 'Appointing Party',
    contact: 'd.brown@abcdev.com | +44 20 9876 5432',
    leadGroups: [
      {
        id: 'lead_architecture',
        name: 'Smith & Associates Architects Ltd.',
        role: 'Lead Appointed Party - Architecture',
        contact: 'j.smith@smithassociates.com | +44 20 1234 5678',
        children: [
          {
            id: 'ap_interior',
            name: 'Interior Design Associates',
            role: 'Appointed Party - Interior Design',
            contact: 'info@interiordesign.com | +44 20 3456 7890'
          },
          {
            id: 'ap_landscape',
            name: 'Green Spaces Design',
            role: 'Appointed Party - Landscaping',
            contact: 'design@greenspaces.com | +44 20 4567 8901'
          }
        ]
      },
      {
        id: 'lead_structural',
        name: 'Engineering Excellence Ltd.',
        role: 'Lead Appointed Party - Structural Engineering',
        contact: 'e.chen@engexcel.com | +44 20 2345 6789',
        children: [
          {
            id: 'ap_geotechnical',
            name: 'Ground Engineering Specialists',
            role: 'Appointed Party - Geotechnical Engineering',
            contact: 'projects@groundeng.com | +44 20 5678 9012'
          },
          {
            id: 'ap_civil',
            name: 'Civil Works Partners',
            role: 'Appointed Party - Civil Engineering',
            contact: 'info@civilworks.com | +44 20 6789 0123'
          }
        ]
      },
      {
        id: 'lead_mep',
        name: 'Advanced Systems Group',
        role: 'Lead Appointed Party - MEP Engineering',
        contact: 'm.rodriguez@asg.com | +44 20 3456 7890',
        children: [
          {
            id: 'ap_hvac',
            name: 'Climate Control Experts',
            role: 'Appointed Party - HVAC Specialist',
            contact: 'design@climatecontrol.com | +44 20 7890 1234'
          },
          {
            id: 'ap_electrical',
            name: 'Power Systems Ltd.',
            role: 'Appointed Party - Electrical Services',
            contact: 'projects@powersystems.com | +44 20 8901 2345'
          },
          {
            id: 'ap_plumbing',
            name: 'Water & Drainage Solutions',
            role: 'Appointed Party - Plumbing & Drainage',
            contact: 'info@waterdrainage.com | +44 20 9012 3456'
          },
          {
            id: 'ap_fire',
            name: 'Fire Safety Engineering Ltd.',
            role: 'Appointed Party - Fire Protection',
            contact: 'safety@fireeng.com | +44 20 0123 4567'
          }
        ]
      },
      {
        id: 'lead_facades',
        name: 'Curtain Wall Experts Ltd.',
        role: 'Lead Appointed Party - Facade Engineering',
        contact: 'd.wilson@cwe.com | +44 20 4567 8901',
        children: [
          {
            id: 'ap_glazing',
            name: 'Advanced Glazing Solutions',
            role: 'Appointed Party - Glazing Specialist',
            contact: 'info@advancedglazing.com | +44 20 1234 5678'
          }
        ]
      },
      {
        id: 'lead_qs',
        name: 'Cost Management Partners',
        role: 'Lead Appointed Party - Quantity Surveying',
        contact: 's.williams@cmp.com | +44 20 5678 9012',
        children: []
      }
    ]
  },
  taskTeamsBreakdown: [
    { 'Task Team': 'Architecture', 'Discipline': 'Architecture', 'Leader': 'Emma Davis', 'Leader Contact': 'e.davis@smithassociates.com', 'Company': 'Smith & Associates Architects Ltd.' },
    { 'Task Team': 'Structural Engineering', 'Discipline': 'Structural', 'Leader': 'Robert Chen', 'Leader Contact': 'r.chen@engexcel.com', 'Company': 'Engineering Excellence Ltd.' },
    { 'Task Team': 'MEP Engineering', 'Discipline': 'MEP', 'Leader': 'Lisa Rodriguez', 'Leader Contact': 'l.rodriguez@asg.com', 'Company': 'Advanced Systems Group' },
    { 'Task Team': 'Quantity Surveying', 'Discipline': 'Cost Management', 'Leader': 'David Kumar', 'Leader Contact': 'd.kumar@cmp.com', 'Company': 'Cost Management Partners' },
    { 'Task Team': 'Facade Engineering', 'Discipline': 'Facades', 'Leader': 'David Wilson', 'Leader Contact': 'd.wilson@cwe.com', 'Company': 'Curtain Wall Experts Ltd.' }
  ],
  confirmedTrackRecord: [
    { 'Project Name': 'Tech Innovation Hub', 'Value': '£25M', 'Completion Date': 'March 2023', 'Project Type': 'Commercial Office', 'Our Role': 'Lead Design Consultant', 'Key BIM Achievements': 'Zero clashes at construction, 30% RFI reduction, BREEAM Excellent achieved' },
    { 'Project Name': 'Riverside Commercial Centre', 'Value': '£18M', 'Completion Date': 'August 2022', 'Project Type': 'Mixed Use', 'Our Role': 'BIM Coordinator', 'Key BIM Achievements': '4D sequencing reduced programme by 8 weeks, digital twin handover' },
    { 'Project Name': 'Metropolitan Tower Refurbishment', 'Value': '£12M', 'Completion Date': 'December 2021', 'Project Type': 'Renovation/Retrofit', 'Our Role': 'Design Lead', 'Key BIM Achievements': 'Scan-to-BIM for existing conditions, clash-free MEP coordination' },
    { 'Project Name': 'University Research Building', 'Value': '£35M', 'Completion Date': 'June 2021', 'Project Type': 'Education', 'Our Role': 'Lead Appointed Party', 'Key BIM Achievements': 'Full COBie handover, integrated FM systems, 5D cost tracking' },
    { 'Project Name': 'Corporate Headquarters Phase 1', 'Value': '£42M', 'Completion Date': 'November 2020', 'Project Type': 'Commercial Building', 'Our Role': 'BIM Manager', 'Key BIM Achievements': 'First ISO 19650-certified project, established company BIM standards' }
  ],
  confirmedBimGoals: 'The confirmed BIM goals include implementing collaborative workflows to achieve improved design coordination, reduced construction conflicts, optimized delivery timelines, and comprehensive digital asset creation for facility management.',
  implementationObjectives: 'Implementation objectives include zero design conflicts at construction, 40% reduction in RFIs, improved construction efficiency, and delivery of comprehensive FM data for operations.',
  finalBimUses: ['Design Authoring', '3D Coordination', 'Clash Detection', 'Quantity Take-off', '4D Planning'],

  // Legacy fields for backward compatibility
  bimUses: ['Design Authoring', '3D Coordination', 'Clash Detection', 'Quantity Take-off', '4D Planning'],
  // Legacy fields for backward compatibility (converted from table format)
  taskTeamLeaders: 'Architecture: John Smith (Modern Design Associates)\nStructural: Emily Chen (Engineering Excellence Ltd.)\nMEP: Michael Rodriguez (Advanced Systems Group)\nFacades: David Wilson (Curtain Wall Experts Ltd.)',
  appointedParties: 'Architecture: Modern Design Associates\nStructural: Engineering Excellence Ltd.\nMEP: Advanced Systems Group\nQuantity Surveyor: Cost Management Partners\nSpecialist Facades: Curtain Wall Experts Ltd.',
  informationPurposes: [
    'Design Development and Coordination',
    'Construction Planning and Sequencing',
    'Quantity Surveying and Cost Management',
    'Facility Management and Operations',
    'Clash Detection and Resolution',
    'Regulatory Compliance and Building Control',
    'Energy Analysis and Sustainability Assessment',
    'Structural Analysis and Performance Verification',
    'MEP Systems Coordination and Integration',
    'Health and Safety Planning (CDM Compliance)',
    'Stakeholder Communication and Visualization',
    'As-Built Documentation and Asset Handover',
    'Maintenance Planning and Lifecycle Management',
    'Space Planning and Occupancy Analysis',
    'Procurement and Supply Chain Management'
  ],
  geometricalInfo: 'LOD 350 for construction documentation phase, with dimensional accuracy of ±10mm for structural elements and ±5mm for MEP coordination points.',
  alphanumericalInfo: 'All building elements must include material specifications, performance data, manufacturer information, maintenance requirements, and warranty details.',
  documentationInfo: 'Construction drawings, specifications, schedules, O&M manuals, warranty documents, and asset registers in digital format.',
  informationFormats: ['IFC 4', 'PDF', 'BCF 2.1', 'DWG', 'COBie'],
  projectInformationRequirements: 'Project Information Requirements specify deliverable information to support asset management objectives: integrated 3D models with embedded property data for space management systems, energy consumption monitoring through IoT sensor integration, preventive maintenance scheduling with equipment lifecycle data, tenant fit-out guidelines with services capacity information, building performance analytics for continuous optimisation, digital twin connectivity for predictive maintenance, compliance monitoring systems for regulatory reporting, and structured data formats supporting client\'s existing CAFM systems and sustainability reporting requirements.',
  midpDescription: 'The MIDP coordinates all discipline-specific TIDPs into a unified delivery schedule aligned with RIBA stages and construction milestones. Information exchanges occur at stage gates with formal approval processes.',
  keyMilestones: [
    { 'Stage/Phase': 'Stage 2', 'Milestone Description': 'Concept Design Complete', 'Deliverables': 'Basic geometry and spatial coordination models', 'Due Date': 'Month 6' },
    { 'Stage/Phase': 'Stage 3', 'Milestone Description': 'Spatial Coordination', 'Deliverables': 'Full coordination model with clash detection', 'Due Date': 'Month 12' },
    { 'Stage/Phase': 'Stage 4', 'Milestone Description': 'Technical Design', 'Deliverables': 'Construction-ready information and documentation', 'Due Date': 'Month 18' },
    { 'Stage/Phase': 'Stage 5', 'Milestone Description': 'Manufacturing Support', 'Deliverables': 'Production information and fabrication models', 'Due Date': 'Month 24' },
    { 'Stage/Phase': 'Stage 6', 'Milestone Description': 'Handover', 'Deliverables': 'As-built models and FM data', 'Due Date': 'Month 36' }
  ],
  tidpRequirements: 'Each task team must produce TIDPs detailing their information deliverables, responsibilities, quality requirements, and delivery schedules in alignment with project milestones.',
  tidpDescription: 'TIDPs define discipline-specific delivery requirements aligned with project milestones. Each TIDP includes: information container definitions, production responsibilities, delivery schedules, quality checking procedures, and approval workflows. TIDPs are maintained by Task Team Leaders and reviewed monthly by the Information Manager to ensure alignment with the MIDP and project programme.',
  informationDeliverablesMatrix: {
    columns: ['Deliverable', 'Responsible Party', 'Due Date', 'Format', 'Status'],
    data: [
      { 'Deliverable': 'Architectural Design Model - Stage 2', 'Responsible Party': 'Smith & Associates Architects', 'Due Date': 'Month 6', 'Format': 'RVT, IFC 4', 'Status': 'Scheduled' },
      { 'Deliverable': 'Structural Analysis Model - Stage 2', 'Responsible Party': 'Engineering Excellence Ltd.', 'Due Date': 'Month 6', 'Format': 'RVT, IFC 4', 'Status': 'Scheduled' },
      { 'Deliverable': 'MEP Coordination Model - Stage 3', 'Responsible Party': 'Advanced Systems Group', 'Due Date': 'Month 12', 'Format': 'RVT, IFC 4', 'Status': 'Scheduled' },
      { 'Deliverable': 'Federated Coordination Model', 'Responsible Party': 'BIM Coordinator', 'Due Date': 'Weekly', 'Format': 'NWD', 'Status': 'Ongoing' },
      { 'Deliverable': 'Clash Detection Reports', 'Responsible Party': 'BIM Coordinator', 'Due Date': 'Bi-weekly', 'Format': 'BCF, PDF', 'Status': 'Ongoing' },
      { 'Deliverable': 'COBie Data Extract - Stage 4', 'Responsible Party': 'Information Manager', 'Due Date': 'Month 18', 'Format': 'COBie, XLSX', 'Status': 'Scheduled' },
      { 'Deliverable': 'As-Built Models - Stage 6', 'Responsible Party': 'All Disciplines', 'Due Date': 'Month 36', 'Format': 'RVT, IFC 4', 'Status': 'Scheduled' },
      { 'Deliverable': 'Digital Twin Package', 'Responsible Party': 'Information Manager', 'Due Date': 'Month 36', 'Format': 'IFC 4, COBie, JSON', 'Status': 'Scheduled' }
    ]
  },
  informationManagementMatrix: {
    columns: ['Activity', 'Lead Appointed Party', 'Appointed Parties', 'Information Manager', 'Appointing Party'],
    data: [
      { 'Activity': 'Establish information requirements', 'Lead Appointed Party': 'C', 'Appointed Parties': 'I', 'Information Manager': 'R', 'Appointing Party': 'A' },
      { 'Activity': 'Develop BEP', 'Lead Appointed Party': 'A', 'Appointed Parties': 'C', 'Information Manager': 'R', 'Appointing Party': 'I' },
      { 'Activity': 'Establish CDE', 'Lead Appointed Party': 'A', 'Appointed Parties': 'I', 'Information Manager': 'R', 'Appointing Party': 'C' },
      { 'Activity': 'Develop TIDPs', 'Lead Appointed Party': 'C', 'Appointed Parties': 'R', 'Information Manager': 'A', 'Appointing Party': 'I' },
      { 'Activity': 'Produce information', 'Lead Appointed Party': 'A', 'Appointed Parties': 'R', 'Information Manager': 'C', 'Appointing Party': 'I' },
      { 'Activity': 'Review and approve information', 'Lead Appointed Party': 'R', 'Appointed Parties': 'C', 'Information Manager': 'A', 'Appointing Party': 'I' },
      { 'Activity': 'Coordinate information models', 'Lead Appointed Party': 'C', 'Appointed Parties': 'C', 'Information Manager': 'R', 'Appointing Party': 'I' },
      { 'Activity': 'Submit information to client', 'Lead Appointed Party': 'A', 'Appointed Parties': 'C', 'Information Manager': 'R', 'Appointing Party': 'I' }
    ]
  },
  mobilisationPlan: 'Project mobilisation occurs over 4 weeks: Week 1 includes CDE setup, template development, and team onboarding; Week 2 involves standards training, tool deployment, and workflow testing; Week 3 encompasses pilot model creation, federation testing, and quality checking procedures; Week 4 includes final system validation, team competency verification, and formal project launch. All team members complete ISO 19650 certification and project-specific training before accessing the CDE and commencing information production activities.',
  teamCapabilitySummary: 'The delivery team provides comprehensive BIM capabilities across all disciplines: 15 certified BIM professionals with ISO 19650 competency, advanced modeling expertise in Revit, Tekla, and specialist analysis software, 5+ years experience delivering federated models for commercial projects £10M+, proven track record in clash detection reducing construction issues by 60%, established workflows for 4D/5D integration, and dedicated quality assurance resources ensuring deliverable compliance. Team capacity supports peak deployment of 35 specialists during technical design phases.',
  taskTeamExchange: 'Information exchange protocols establish: weekly model federation with automated clash detection reports, fortnightly design coordination meetings with federated model reviews, monthly design freeze periods for cross-disciplinary validation, standardised BCF workflows for issue resolution, real-time model access through shared CDE workspace, automated notification systems for model updates and issue assignments, and formal sign-off procedures for milestone deliverables ensuring all disciplines approve federated models before progression to next design stage.',
  modelReferencing3d: 'Model referencing procedures ensure consistent spatial coordination: shared coordinate system established from Ordnance Survey grid references, standardised origin points and level datums across all disciplines, automated reference model linking through shared CDE folders, version control protocols preventing out-of-date reference usage, clash detection workflows identifying reference model conflicts, weekly reference model updates with team notifications, and quality gates preventing model publication without current reference verification ensuring geometric consistency throughout the federated environment.',
  milestoneInformation: [
    { 'Milestone': 'Stage 2 - Concept Design', 'Information Required': 'Basic geometry models, spatial arrangements, outline specifications', 'Format': 'IFC 4, PDF drawings, Excel schedules', 'Quality Level': 'LOD 200, outline accuracy ±50mm' },
    { 'Milestone': 'Stage 3 - Spatial Coordination', 'Information Required': 'Coordinated discipline models, clash detection reports, design drawings', 'Format': 'IFC 4, BCF 2.1, PDF, DWG', 'Quality Level': 'LOD 300, coordination accuracy ±25mm' },
    { 'Milestone': 'Stage 4 - Technical Design', 'Information Required': 'Construction-ready models, detailed specifications, quantity schedules', 'Format': 'IFC 4, native files, PDF, Excel', 'Quality Level': 'LOD 350, construction accuracy ±10mm' },
    { 'Milestone': 'Stage 5 - Manufacturing', 'Information Required': 'Fabrication models, assembly sequences, installation guides', 'Format': 'IFC 4, manufacturer formats, 4D models', 'Quality Level': 'LOD 400, fabrication accuracy ±5mm' },
    { 'Milestone': 'Stage 6 - Handover', 'Information Required': 'As-built models, COBie data, O&M manuals, warranties', 'Format': 'IFC 4, COBie, PDF, digital documents', 'Quality Level': 'LOD 500, as-built verification complete' }
  ],
  informationRiskRegister: [
    { 'Risk Description': 'Model coordination conflicts due to discipline isolation', 'Impact': 'High - Construction delays and rework', 'Probability': 'Medium', 'Mitigation': 'Weekly federated model reviews, automated clash detection, early coordination protocols' },
    { 'Risk Description': 'Data loss or corruption in CDE platform', 'Impact': 'High - Project delays and data recreation costs', 'Probability': 'Low', 'Mitigation': 'Daily automated backups, geo-redundant storage, version control, disaster recovery procedures' },
    { 'Risk Description': 'Software interoperability failures between disciplines', 'Impact': 'Medium - Information exchange delays', 'Probability': 'Medium', 'Mitigation': 'Standardized IFC workflows, software compatibility testing, alternative exchange formats' },
    { 'Risk Description': 'Inconsistent information delivery by task teams', 'Impact': 'Medium - Project coordination issues', 'Probability': 'Medium', 'Mitigation': 'Clear TIDP requirements, regular progress monitoring, milestone quality gates' },
    { 'Risk Description': 'Team member turnover affecting BIM competency', 'Impact': 'Medium - Knowledge loss and training delays', 'Probability': 'Low', 'Mitigation': 'Cross-training programs, documented procedures, knowledge management systems' },
    { 'Risk Description': 'Client changes affecting information requirements', 'Impact': 'Medium - Scope creep and delivery delays', 'Probability': 'High', 'Mitigation': 'Change control procedures, impact assessments, flexible workflow systems' }
  ],
  workflowStates: [
    { 'State Name': 'Work in Progress (WIP)', 'Description': 'Active development by task teams', 'Access Level': 'Author only', 'Next State': 'Shared' },
    { 'State Name': 'Shared', 'Description': 'Available for coordination and review', 'Access Level': 'Team members', 'Next State': 'Published' },
    { 'State Name': 'Published', 'Description': 'Approved for use by the project team', 'Access Level': 'All stakeholders', 'Next State': 'Archived' },
    { 'State Name': 'Archived', 'Description': 'Historical versions for reference', 'Access Level': 'Read-only access', 'Next State': 'N/A' }
  ],
  bimSoftware: ['Autodesk Revit', 'Navisworks', 'Solibri Model Checker', 'BIM 360'],
  fileFormats: ['IFC 4', 'DWG', 'PDF', 'BCF 2.1', 'NWD'],
  hardwareRequirements: 'Minimum: Intel i7 or equivalent, 32GB RAM, dedicated graphics card (RTX 3060 or higher), 1TB SSD storage, dual monitors recommended.',
  networkRequirements: 'High-speed internet connection (minimum 100 Mbps), VPN access for remote working, secure cloud connectivity to CDE platform.',
  interoperabilityNeeds: 'Seamless data exchange between Revit disciplines, coordination in Navisworks, model checking in Solibri, and cloud collaboration through BIM 360.',
  informationBreakdownStrategy: 'Information breakdown follows ISO 19650 principles with clear segregation by discipline, building zone, and information type. Architecture models are subdivided by floor levels (L00-L08), structural models by structural zones (SZ01-SZ04), and MEP models by service zones (MZ01-MZ03). Each volume maintains consistent coordinate systems and spatial relationships. Cross-zone coordination models ensure seamless integration whilst enabling parallel development and efficient collaboration workflows across all disciplines.',
  federationProcess: 'Model federation occurs weekly through automated processes in Navisworks Manage, with daily clash detection runs for active design areas. Each discipline publishes IFC models to designated CDE folders following standardized naming conventions. The federation workflow includes automated quality checking, spatial coordination verification, and clash detection reporting. Federated models undergo review and approval before release to the wider project team, ensuring consistency and reliability of coordination information.',
  softwareHardwareInfrastructure: [
    { 'Category': 'BIM Authoring', 'Item/Component': 'Autodesk Revit Architecture 2024', 'Specification': 'Licensed seats: 12, Cloud entitlement', 'Purpose': 'Architectural design and documentation' },
    { 'Category': 'BIM Authoring', 'Item/Component': 'Autodesk Revit Structure 2024', 'Specification': 'Licensed seats: 8, Cloud entitlement', 'Purpose': 'Structural design and analysis integration' },
    { 'Category': 'BIM Authoring', 'Item/Component': 'Autodesk Revit MEP 2024', 'Specification': 'Licensed seats: 10, Cloud entitlement', 'Purpose': 'MEP systems design and coordination' },
    { 'Category': 'Model Coordination', 'Item/Component': 'Navisworks Manage 2024', 'Specification': 'Licensed seats: 6, Freedom entitlement', 'Purpose': 'Model federation and clash detection' },
    { 'Category': 'Quality Assurance', 'Item/Component': 'Solibri Model Checker v9.12', 'Specification': 'Licensed seats: 4, Annual subscription', 'Purpose': 'Model validation and rule checking' },
    { 'Category': 'Cloud Platform', 'Item/Component': 'Autodesk Construction Cloud', 'Specification': 'Premium plan, 500GB storage', 'Purpose': 'Collaborative design and data sharing' },
    { 'Category': 'Hardware Workstations', 'Item/Component': 'Dell Precision 5000 Series', 'Specification': 'Intel i7-13700K, 32GB RAM, RTX 4070, 1TB NVMe SSD', 'Purpose': 'BIM modeling and coordination workstations' },
    { 'Category': 'Network Infrastructure', 'Item/Component': 'Fiber Internet Connection', 'Specification': '1Gbps symmetric, 99.9% uptime SLA', 'Purpose': 'High-speed cloud collaboration and file sync' },
    { 'Category': 'Data Storage', 'Item/Component': 'Network Attached Storage (NAS)', 'Specification': 'Synology DS1821+, 64TB capacity, RAID 6', 'Purpose': 'Local backup and file server functionality' },
    { 'Category': 'Security', 'Item/Component': 'Multi-Factor Authentication', 'Specification': 'Microsoft Authenticator, SMS backup', 'Purpose': 'Enhanced security for all cloud platforms' }
  ],
  documentControlInfo: 'This BIM Execution Plan is prepared in accordance with ISO 19650-2:2018 standards for information management during the delivery phase of construction projects. Document classification: CONFIDENTIAL - Project delivery team access only. Version control follows established procedures with formal review and approval workflows. Document generated using Professional BEP Generator Tool v1.0, ensuring compliance with current industry standards and best practices. Regular updates and revisions will be managed through the project CDE with full audit trails maintained for all changes.',
  modelingStandards: [
    { 'Standard/Guideline': 'UK BIM Alliance Standards', 'Version': 'v2.1', 'Application Area': 'General BIM practices', 'Compliance Level': 'Mandatory' },
    { 'Standard/Guideline': 'Uniclass 2015', 'Version': '2015', 'Application Area': 'Classification system', 'Compliance Level': 'Mandatory' },
    { 'Standard/Guideline': 'AIA LOD Specification', 'Version': '2019', 'Application Area': 'Level of development', 'Compliance Level': 'Mandatory' },
    { 'Standard/Guideline': 'Company Modeling Guide', 'Version': 'v3.2', 'Application Area': 'Internal procedures', 'Compliance Level': 'Required' }
  ],
  namingConventions: {
    overview: '<p>File naming follows <strong>ISO 19650-2</strong> convention to ensure consistency, traceability, and efficient information management across all project deliverables.</p>',
    namingFields: [
      {
        fieldName: '[Project Code]',
        exampleValue: 'GF24',
        description: 'Unique project identifier assigned by the appointing party (e.g., GF24 for Greenfield 2024)'
      },
      {
        fieldName: '[Originator]',
        exampleValue: 'SAA',
        description: 'Organization/discipline creating the information (e.g., SAA=Smith Associates Architects, STR=Structural, MEP=MEP)'
      },
      {
        fieldName: '[Volume/System]',
        exampleValue: 'XX',
        description: 'Building zone, system, or spatial reference (XX=Whole building, 01=Core/Stair, 02=Office wings)'
      },
      {
        fieldName: '[Level/Location]',
        exampleValue: 'GF',
        description: 'Floor level or location code (e.g., GF=Ground Floor, 01-08=Floors, RF=Roof, B1=Basement)'
      },
      {
        fieldName: '[Type]',
        exampleValue: 'M3',
        description: 'Information type (e.g., M3=Model, DR=Drawing, SP=Specification, RP=Report, SC=Schedule)'
      },
      {
        fieldName: '[Role]',
        exampleValue: 'ARC',
        description: 'Discipline or role responsible for the content (ARC=Architecture, STR=Structural, MEP=MEP, FAC=Facades)'
      },
      {
        fieldName: '[Number]',
        exampleValue: '0001',
        description: 'Sequential 4-digit number for the deliverable'
      },
      {
        fieldName: '[Revision]',
        exampleValue: 'P01',
        description: 'Revision status (e.g., S1-S4=Design stages, P01+=Construction issue, C01+=As-built)'
      }
    ],
    namingPattern: '<p><strong>Pattern:</strong> [Project Code]-[Originator]-[Volume/System]-[Level/Location]-[Type]-[Role]-[Number]-[Revision]</p><p><strong>Examples:</strong></p><ul><li><code>GF24-SAA-XX-GF-M3-ARC-0001-P01.rvt</code> - Architecture model, ground floor, first issue</li><li><code>GF24-SAA-ZZ-ARC-DR-A-1001-P02.dwg</code> - Architecture drawing, second revision</li><li><code>GF24-EXL-01-STR-M3-STR-0015-C01.rvt</code> - Structural model, core area, as-built</li></ul>',
    deliverableAttributes: [
      {
        attributeName: 'File Format',
        exampleValue: '.rvt, .dwg, .pdf, .ifc',
        description: 'Acceptable file formats for each deliverable type'
      },
      {
        attributeName: 'Classification System',
        exampleValue: 'Uniclass 2015',
        description: 'Classification framework for organizing information'
      },
      {
        attributeName: 'Level of Information Need',
        exampleValue: 'LOD 300 / LOI 300',
        description: 'Required level of detail/information for the deliverable'
      },
      {
        attributeName: 'Security Classification',
        exampleValue: 'Confidential',
        description: 'Information security level (e.g., Public, Internal, Confidential, Restricted)'
      },
      {
        attributeName: 'Suitability Code',
        exampleValue: 'S2 - Suitable for Information',
        description: 'Document status/suitability per ISO 19650 (S0-S9, A1-A7, B1-B7, CR, etc.)'
      },
      {
        attributeName: 'Revision Code',
        exampleValue: 'P01',
        description: 'Revision code indicating version and status: P=First Production (P01-P99), C=Construction (C01-C99), A=As-Built (A01-A99), S=Spatial Coordination (S1-S4), D=Developed Design (D1-D9)'
      }
    ]
  },
  fileStructure: 'Organized by discipline and project phase with clear folder hierarchies, version control through file naming, and linked file management protocols.',
  // fileStructureDiagram: Removed to use the default ISO19650 structure from templateRegistry
  dataExchangeProtocols: [
    { 'Exchange Type': 'IFC Coordination', 'Format': 'IFC 4.0', 'Frequency': 'Weekly', 'Delivery Method': 'BIM 360 upload' },
    { 'Exchange Type': 'Issue Management', 'Format': 'BCF 2.1', 'Frequency': 'Daily as needed', 'Delivery Method': 'BCF workflow' },
    { 'Exchange Type': 'Drawing Sets', 'Format': 'PDF + DWG', 'Frequency': 'At milestones', 'Delivery Method': 'Client portal' },
    { 'Exchange Type': 'FM Handover', 'Format': 'COBie + IFC', 'Frequency': 'Final delivery', 'Delivery Method': 'Secure transfer' }
  ],
  qaFramework: [
    { 'QA Activity': 'Automated Model Checking', 'Responsibility': 'BIM Coordinator', 'Frequency': 'Daily', 'Tools/Methods': 'Solibri Model Checker + custom rules' },
    { 'QA Activity': 'Manual Design Reviews', 'Responsibility': 'Discipline Leads', 'Frequency': 'Weekly', 'Tools/Methods': 'Navisworks review sessions' },
    { 'QA Activity': 'Clash Detection', 'Responsibility': 'BIM Coordinator', 'Frequency': 'Bi-weekly', 'Tools/Methods': 'Navisworks Manage + BCF reports' },
    { 'QA Activity': 'Standards Compliance', 'Responsibility': 'Information Manager', 'Frequency': 'Monthly', 'Tools/Methods': 'Compliance checklist + audit trail' },
    { 'QA Activity': 'Client Reviews', 'Responsibility': 'Project Manager', 'Frequency': 'At milestones', 'Tools/Methods': 'Formal review meetings + sign-off' }
  ],
  modelValidation: 'Automated checking using Solibri Model Checker for geometric accuracy, completeness, and standard compliance. Manual reviews for design intent and buildability.',
  reviewProcesses: 'Stage gate reviews at each RIBA stage, weekly coordination reviews, monthly progress reviews, and formal design freeze approvals.',
  approvalWorkflows: 'Task team lead approval, discipline coordination review, project manager authorization, and client sign-off for major milestones.',
  complianceVerification: 'Regular audits against ISO 19650 requirements, BIM standards compliance checks, and quality metrics monitoring.',
  modelReviewAuthorisation: `Information model review and authorisation follows ISO 19650 approval protocols:

1. TASK TEAM REVIEW: Model authors perform self-checking using Revit warnings cleanup, visual inspection, and parameter verification before submission. Task Team Leader validates quality before progression to Shared state.

2. COORDINATION REVIEW: BIM Coordinator conducts clash detection and spatial coordination checks. BCF issues raised for identified conflicts with assigned resolution responsibilities and deadlines.

3. TECHNICAL REVIEW: Discipline leads review technical content for design compliance, buildability assessment, and standards adherence. Sign-off required before milestone submission.

4. INFORMATION MANAGER APPROVAL: Final authorisation for progression to Published state. Validates naming conventions, metadata completeness, and CDE compliance. Maintains audit trail of all approvals.

5. CLIENT MILESTONE REVIEW: Formal client review at defined data drops. Feedback incorporated through change management process. Published status confirmed upon client acceptance.`,
  dataClassification: [
    { 'Classification Level': 'Public', 'Description': 'Information that can be freely shared with external parties', 'Examples': 'Marketing materials, project brochures, general site photos', 'Access Controls': 'No access restrictions, publicly available' },
    { 'Classification Level': 'Internal', 'Description': 'Information for internal project team use only', 'Examples': 'Design development work, meeting minutes, progress reports', 'Access Controls': 'Project team members only, authenticated access required' },
    { 'Classification Level': 'Confidential', 'Description': 'Sensitive business information requiring protection', 'Examples': 'Commercial pricing, tender information, contractual details', 'Access Controls': 'Senior team members only, need-to-know basis, encryption required' },
    { 'Classification Level': 'Restricted', 'Description': 'Highly sensitive information with security implications', 'Examples': 'Security-sensitive building systems, access control details, critical infrastructure plans', 'Access Controls': 'Authorized personnel only, enhanced security measures, audit trails mandatory' },
    { 'Classification Level': 'Commercial-in-Confidence', 'Description': 'Commercially sensitive information affecting business operations', 'Examples': 'Cost breakdowns, supplier agreements, procurement strategies', 'Access Controls': 'Commercial team only, encrypted storage, controlled distribution' },
    { 'Classification Level': 'Technical-Confidential', 'Description': 'Technical information requiring specialized protection', 'Examples': 'Detailed BIM models, structural calculations, MEP system designs', 'Access Controls': 'Discipline experts only, version control, watermarked documents' }
  ],
  accessPermissions: 'Granular permissions based on project roles, need-to-know basis for sensitive information, regular access reviews, and immediate revocation upon project completion.',
  encryptionRequirements: 'AES-256 encryption for data at rest, TLS 1.3 for data in transit, encrypted email for sensitive communications, and secure file transfer protocols.',
  dataTransferProtocols: 'Secure cloud transfer through approved CDE, encrypted email for sensitive documents, secure FTP for large files, and audit trails for all transfers.',
  privacyConsiderations: 'GDPR compliance for all personal data, data retention policies, right to erasure procedures, and privacy impact assessments for data processing.',
  bimCompetencyLevels: 'Level 1 (Awareness): All project staff\nLevel 2 (Knowledge): Discipline leads and coordinators\nLevel 3 (Competence): BIM specialists and managers\nLevel 4 (Expertise): Information manager and senior BIM roles',
  trainingRequirements: 'Software proficiency certification, ISO 19650 awareness training, project-specific BIM procedures, and CDE platform training for all users.',
  certificationNeeds: 'BIM certification for key personnel, software vendor certifications, ISO 19650 practitioner certification, and ongoing professional development.',
  projectSpecificTraining: 'Project induction covering BIM requirements, CDE usage training, modeling standards workshop, and regular update sessions for process changes.',
  coordinationMeetings: 'Weekly BIM coordination meetings, monthly progress reviews, quarterly stakeholder updates, and ad-hoc sessions for critical issues.',
  clashDetectionWorkflow: 'Automated daily clash detection in Navisworks, weekly clash reports, prioritized resolution tracking, and formal sign-off on cleared clashes.',
  issueResolution: 'BCF-based issue tracking, responsibility assignment, deadline management, escalation procedures, and resolution verification process.',
  communicationProtocols: 'Project collaboration platform for daily communication, formal reporting channels, escalation matrix, and documented decision-making process.',
  federationStrategy: 'Central federated model in Navisworks updated weekly, discipline model linking protocols, version synchronization, and coordination point management.',
  informationRisks: 'Data loss through inadequate backup procedures, information security breaches, quality issues from insufficient checking, interoperability failures between software platforms.',
  technologyRisks: 'Software compatibility issues, hardware failures affecting productivity, network connectivity problems, cloud service outages, and version control conflicts.',
  riskMitigation: 'Robust backup strategies, comprehensive security measures, regular quality audits, software compatibility testing, and redundant system capabilities.',
  contingencyPlans: 'Alternative CDE platforms identified, backup workflow procedures, emergency communication protocols, and rapid response teams for critical issues.',
  performanceMetrics: 'Model quality scores, coordination efficiency metrics, information delivery timeline adherence, and stakeholder satisfaction ratings.',
  monitoringProcedures: 'Monthly performance reviews, automated quality checking, delivery milestone tracking, and continuous improvement feedback loops.',
  auditTrails: 'Comprehensive logging of all CDE activities, version history tracking, approval records, and change management documentation.',
  updateProcesses: 'Quarterly BEP reviews, change request procedures, stakeholder approval for modifications, and continuous alignment with project requirements.',
  changeManagementProcess: `CHANGE REQUEST PROCEDURE

All changes to project information requirements must follow formal change management:

1. CHANGE INITIATION: Any stakeholder can raise a change request via the CDE change request form, documenting proposed changes, justification, and impact assessment.

2. IMPACT ASSESSMENT: Information Manager evaluates impact on BEP, delivery schedules, resource requirements, and costs within 5 working days.

3. REVIEW & APPROVAL: Changes reviewed at monthly Information Management Review meeting. Critical changes escalated to Project Director for expedited review.

4. IMPLEMENTATION: Approved changes documented in BEP revision log, communicated to all stakeholders, and incorporated into relevant TIDPs within 10 working days.

5. VERIFICATION: Implementation verified through quality audits and stakeholder confirmation.`,

  projectKpis: [
    { 'KPI Name': 'Model Coordination Effectiveness', 'Target Value': '<5 clashes per 1000 elements', 'Measurement Method': 'Weekly Navisworks clash detection reports', 'Responsibility': 'BIM Coordinator' },
    { 'KPI Name': 'Information Delivery Timeliness', 'Target Value': '≥95% on-time delivery', 'Measurement Method': 'MIDP milestone tracking dashboard', 'Responsibility': 'Information Manager' },
    { 'KPI Name': 'Data Quality Compliance', 'Target Value': '≥90% first-time validation pass', 'Measurement Method': 'Solibri validation reports at data drops', 'Responsibility': 'Information Manager' },
    { 'KPI Name': 'RFI Reduction', 'Target Value': '≥40% reduction vs baseline', 'Measurement Method': 'Monthly RFI log analysis', 'Responsibility': 'Project Manager' },
    { 'KPI Name': 'Design Change Efficiency', 'Target Value': '≤5 working days response time', 'Measurement Method': 'Change request tracking system', 'Responsibility': 'BIM Manager' },
    { 'KPI Name': 'CDE Adoption Rate', 'Target Value': '≥98% via CDE (not email)', 'Measurement Method': 'Monthly CDE usage analytics', 'Responsibility': 'CDE Administrator' },
    { 'KPI Name': 'Team Competency Compliance', 'Target Value': '100% meeting requirements', 'Measurement Method': 'Quarterly competency assessments', 'Responsibility': 'Information Manager' }
  ],

  // Additional shared fields
  bimGoals: 'The BIM goals for this project are to enhance design coordination through clash detection reducing RFIs by 40%, improve construction sequencing through 4D modeling resulting in 20% schedule compression, enable accurate cost forecasting through 5D integration achieving ±2% budget variance, and deliver comprehensive digital asset information for lifecycle management supporting 25% reduction in operational costs over the first 5 years.',
  primaryObjectives: 'Primary objectives include: eliminating design conflicts before construction through rigorous clash detection protocols, optimising building performance through integrated analysis and simulation, enabling efficient construction through accurate quantity extraction and sequencing models, supporting sustainability targets through embedded carbon analysis and energy modeling, and facilitating seamless handover with structured asset data for predictive maintenance and space management.',
  collaborativeProductionGoals: 'Collaborative production goals focus on establishing unified data standards across all disciplines, implementing real-time model coordination through federated workflows, ensuring consistent information delivery at all project milestones, maintaining version control integrity throughout design development, facilitating transparent communication through shared visualisation platforms, and creating comprehensive audit trails for decision-making accountability whilst adhering to ISO 19650 information management principles.',
  
  alignmentStrategy: {
    meetingSchedule: {
      columns: ['Meeting Type', 'Frequency', 'Key Participants', 'Standard Agenda Items', 'Duration'],
      data: [
        { 
          'Meeting Type': 'BIM Coordination Meeting', 
          'Frequency': 'Weekly', 
          'Key Participants': 'BIM Manager, Lead Coordinators (Arch/Struct/MEP)', 
          'Standard Agenda Items': 'Model status review, clash detection results, coordination issues resolution, upcoming milestones', 
          'Duration': '90 minutes' 
        },
        { 
          'Meeting Type': 'Design Team Workshop', 
          'Frequency': 'Bi-weekly', 
          'Key Participants': 'All discipline leads, Project Manager, Client Representative', 
          'Standard Agenda Items': 'Design decisions, technical queries, RFI review, change management', 
          'Duration': '2 hours' 
        },
        { 
          'Meeting Type': 'Information Management Review', 
          'Frequency': 'Monthly', 
          'Key Participants': 'Information Manager, BIM Manager, CDE Administrator', 
          'Standard Agenda Items': 'Naming convention compliance, data quality audit, CDE access review, KPI reporting', 
          'Duration': '60 minutes' 
        },
        { 
          'Meeting Type': 'Client Progress Review', 
          'Frequency': 'Monthly', 
          'Key Participants': 'Project Director, Client PM, BIM Manager', 
          'Standard Agenda Items': 'Progress against EIR, milestone deliverables, risk register updates, upcoming requirements', 
          'Duration': '90 minutes' 
        }
      ]
    },
    raciReference: 'Responsibility matrices are defined in Section 3.3 Responsibility Matrix. Key decision points include:\n\n- Model Federation Approval: Accountable - Lead BIM Coordinator; Responsible - Discipline Coordinators; Consulted - Design Team; Informed - Client\n- Design Coordination Sign-off: Accountable - Design Manager; Responsible - Discipline Leads; Consulted - BIM Manager; Informed - Project Director\n- Information Delivery Approval: Accountable - Information Manager; Responsible - BIM Manager; Consulted - Task Team; Informed - Client Representative\n- CDE Access Management: Accountable - Information Manager; Responsible - CDE Administrator; Consulted - IT Security; Informed - Project Team\n- Change Request Processing: Accountable - Project Manager; Responsible - Design Manager; Consulted - Affected Disciplines; Informed - All Stakeholders',
    namingStandards: 'File naming follows ISO 19650-2 convention structure:\n\n[Project Code]-[Originator]-[Volume/System]-[Level/Location]-[Type]-[Role]-[Number]-[Revision]\n\nExample: GF24-SAA-XX-GF-M3-ARC-0001-P01.rvt\n\nFolder Structure Hierarchy:\n├── 00_WIP (Work in Progress - active development)\n├── 01_SHARED (Shared for coordination and review)\n├── 02_PUBLISHED (Published deliverables - approved)\n├── 03_ARCHIVE (Superseded versions with audit trail)\n\nNaming Components:\n- Project Code: GF24 (Greenfield 2024)\n- Originator: SAA (Smith Associates Architects), EXL (Engineering Excellence), ASG (Advanced Systems Group)\n- Volume: XX (Whole building), 01 (Core/Stair), 02 (Office wings)\n- Level: GF (Ground Floor), 01-08 (Floors 1-8), RF (Roof), B1 (Basement)\n- Type: M3 (Model), DR (Drawing), SP (Specification), RP (Report)\n- Role: ARC (Architecture), STR (Structural), MEP (MEP), FAC (Facades)\n- Number: Sequential 4-digit\n- Revision: S1-S4 (Design stages), P01+ (Construction issue)',
    qualityTools: {
      columns: ['Tool/Software', 'Check Type', 'Check Frequency', 'Responsible Role', 'Action on Failure'],
      data: [
        { 
          'Tool/Software': 'Autodesk Navisworks Manage', 
          'Check Type': 'Clash Detection (Hard/Soft clashes)', 
          'Check Frequency': 'Weekly for WIP models', 
          'Responsible Role': 'BIM Coordinator', 
          'Action on Failure': 'Issue clash report; Discipline team resolution within 48 hours; Re-test before milestone' 
        },
        { 
          'Tool/Software': 'Solibri Model Checker', 
          'Check Type': 'IFC compliance, information completeness, parameter validation', 
          'Check Frequency': 'At each data drop/milestone', 
          'Responsible Role': 'Information Manager', 
          'Action on Failure': 'Model rejected; Detailed non-compliance report issued; Resubmission required' 
        },
        { 
          'Tool/Software': 'BIMcollab Zoom', 
          'Check Type': 'Issue tracking and coordination workflow validation', 
          'Check Frequency': 'Continuous (real-time)', 
          'Responsible Role': 'Discipline Coordinators', 
          'Action on Failure': 'Automatic notification; Issue escalation if unresolved >72 hours; Progress report impact' 
        },
        { 
          'Tool/Software': 'Custom Python Scripts', 
          'Check Type': 'Naming convention compliance, metadata validation', 
          'Check Frequency': 'Daily automated scans', 
          'Responsible Role': 'CDE Administrator', 
          'Action on Failure': 'Automated rejection; Email notification to author; Correction required before publication' 
        },
        { 
          'Tool/Software': 'Revit Model Review Tools', 
          'Check Type': 'Model health, warnings, links integrity', 
          'Check Frequency': 'Before each coordination session', 
          'Responsible Role': 'Discipline BIM Authors', 
          'Action on Failure': 'Model cleanup required; Warning log maintained; Critical warnings prevent milestone submission' 
        }
      ]
    },
    trainingPlan: {
      columns: ['Role/Personnel', 'Training Topic', 'Provider/Method', 'Timeline', 'Competency Verification'],
      data: [
        { 
          'Role/Personnel': 'All Team Members', 
          'Training Topic': 'ISO 19650-2 Information Management Principles', 
          'Provider/Method': 'Internal workshop by Information Manager', 
          'Timeline': 'Week 1 (Project mobilization)', 
          'Competency Verification': 'Completion certificate; Knowledge assessment quiz (80% pass)' 
        },
        { 
          'Role/Personnel': 'BIM Authors (all disciplines)', 
          'Training Topic': 'Project naming conventions and CDE workflows', 
          'Provider/Method': 'Hands-on training session with CDE Administrator', 
          'Timeline': 'Week 1-2 (Before model initiation)', 
          'Competency Verification': 'Practical test: Submit sample file following all conventions' 
        },
        { 
          'Role/Personnel': 'BIM Coordinators', 
          'Training Topic': 'Navisworks clash detection and coordination workflows', 
          'Provider/Method': 'Autodesk certified training (external)', 
          'Timeline': 'Pre-project (if not certified); Refresher Month 3', 
          'Competency Verification': 'Autodesk certification; Successful clash report submission' 
        },
        { 
          'Role/Personnel': 'Design Team Leads', 
          'Training Topic': 'Quality checking procedures and compliance requirements', 
          'Provider/Method': 'Workshop by BIM Manager with live demonstrations', 
          'Timeline': 'Week 2; Refresher at Stage transitions', 
          'Competency Verification': 'Review and sign-off quality checklist; Successful milestone submission' 
        },
        { 
          'Role/Personnel': 'New Joiners (ongoing)', 
          'Training Topic': 'Project BEP induction and tool-specific training', 
          'Provider/Method': 'Onboarding package with mentoring from BIM Manager', 
          'Timeline': 'Within 1 week of joining project', 
          'Competency Verification': 'BEP comprehension test; Supervised work period (2 weeks)' 
        }
      ]
    },
    kpis: {
      columns: ['KPI Name', 'Measurement Metric', 'Target Value', 'Monitoring Frequency', 'Owner'],
      data: [
        { 
          'KPI Name': 'Model Coordination Effectiveness', 
          'Measurement Metric': 'Number of clashes per 1000 model elements', 
          'Target Value': '<5 clashes/1000 elements', 
          'Monitoring Frequency': 'Weekly', 
          'Owner': 'BIM Coordinator' 
        },
        { 
          'KPI Name': 'Information Delivery Timeliness', 
          'Measurement Metric': 'Percentage of deliverables submitted on/before deadline', 
          'Target Value': '≥95% on-time', 
          'Monitoring Frequency': 'Per milestone', 
          'Owner': 'Information Manager' 
        },
        { 
          'KPI Name': 'Data Quality Compliance', 
          'Measurement Metric': 'Percentage of models passing first-time validation checks', 
          'Target Value': '≥90% first-time pass', 
          'Monitoring Frequency': 'Per data drop', 
          'Owner': 'Information Manager' 
        },
        { 
          'KPI Name': 'RFI Reduction from BIM', 
          'Measurement Metric': 'Reduction in RFIs compared to baseline/similar projects', 
          'Target Value': '≥40% reduction', 
          'Monitoring Frequency': 'Monthly cumulative', 
          'Owner': 'Project Manager' 
        },
        { 
          'KPI Name': 'Design Change Efficiency', 
          'Measurement Metric': 'Average time from change request to updated model', 
          'Target Value': '≤5 working days', 
          'Monitoring Frequency': 'Monthly average', 
          'Owner': 'BIM Manager' 
        },
        { 
          'KPI Name': 'Team Competency Level', 
          'Measurement Metric': 'Percentage of team members meeting competency requirements', 
          'Target Value': '100% compliant', 
          'Monitoring Frequency': 'Quarterly', 
          'Owner': 'Information Manager' 
        },
        { 
          'KPI Name': 'CDE Usage and Adoption', 
          'Measurement Metric': 'Percentage of information exchanges through CDE vs. email', 
          'Target Value': '≥98% via CDE', 
          'Monitoring Frequency': 'Monthly', 
          'Owner': 'CDE Administrator' 
        }
      ]
    },
    alignmentStrategy: 'Ongoing alignment with appointing party information requirements will be maintained through:\n\n1. MONTHLY STAKEHOLDER REVIEWS: Regular workshops with client representatives to validate that delivered information continues to meet evolving project needs and strategic objectives. EIR alignment matrix updated and signed off monthly.\n\n2. CONTINUOUS KPI MONITORING: Real-time dashboard tracking all performance indicators with traffic light system. Deviations >10% from targets trigger immediate corrective action plans with root cause analysis and preventive measures.\n\n3. QUARTERLY BEP REVIEWS: Formal review of BEP effectiveness with all stakeholders. Assessment of whether processes remain fit-for-purpose. Updates issued as controlled documents with change logs and approval workflows.\n\n4. CHANGE MANAGEMENT INTEGRATION: All project scope changes assessed for information management impact. BEP updated accordingly through formal change request process with client approval. Information requirements matrix revised to reflect new/modified requirements.\n\n5. LESSONS LEARNED SESSIONS: Bi-monthly retrospectives capturing what\'s working well and improvement opportunities. Action items tracked to completion. Best practices documented and shared across project team.\n\n6. TECHNOLOGY ROADMAP REVIEWS: Quarterly assessment of whether software/tools remain optimal for project needs. Evaluation of new technologies that could enhance information delivery quality or efficiency.\n\n7. CONTINUOUS COMMUNICATION: Open channels maintained with appointing party Information Manager. Weekly status updates on information production progress. Proactive escalation of risks or issues affecting information delivery timelines or quality.'
  },
  
  cdeStrategy: 'The project employs a federated CDE approach utilizing multiple specialized platforms to optimize workflow efficiency and data management across different information types and project phases. Each platform is selected for its specific strengths while maintaining seamless integration and unified information governance through standardized protocols, consistent naming conventions, and automated synchronization processes.',
  cdePlatforms: [
    { 'Platform/Service': 'Microsoft SharePoint Online', 'Usage/Purpose': 'WIP collaboration and document management', 'Information Types': 'MS Office documents, specifications, reports, meeting minutes, correspondence', 'Workflow States': 'WIP, Review, Approved', 'Access Control': 'Team member authentication, version control, document check-out/in' },
    { 'Platform/Service': 'Autodesk Construction Cloud', 'Usage/Purpose': 'BIM model sharing and design coordination', 'Information Types': 'Native BIM models (RVT, DWG), IFC files, federated models, clash reports', 'Workflow States': 'WIP, Shared, Published', 'Access Control': 'Role-based access, model viewing permissions, download restrictions' },
    { 'Platform/Service': 'Bentley ProjectWise', 'Usage/Purpose': 'Engineering deliverables and technical drawings', 'Information Types': 'CAD drawings, engineering calculations, technical specifications, design reports', 'Workflow States': 'Draft, Review, Approved, Issued', 'Access Control': 'Discipline-based folders, approval workflows, audit trails' },
    { 'Platform/Service': 'Esri ArcGIS Online', 'Usage/Purpose': 'Geospatial data management and GIS analysis', 'Information Types': 'Survey data, site analysis, environmental data, location intelligence', 'Workflow States': 'Draft, Published, Archived', 'Access Control': 'GIS team access, public viewing portals, data export controls' },
    { 'Platform/Service': 'Aconex (Oracle)', 'Usage/Purpose': 'Client communication and formal submissions', 'Information Types': 'Official correspondence, RFIs, submittals, progress reports, certificates', 'Workflow States': 'Draft, Submitted, Under Review, Approved', 'Access Control': 'Client portal access, formal approval workflows, notification systems' }
  ],
  accessControl: 'Role-based access control with Project Administrator, Design Team, Review Team, and Client View permissions. Multi-factor authentication required for all users. Project folders restricted by discipline with read/write permissions assigned per project phase. Guest access limited to 30-day periods with approval workflows.',
  securityMeasures: 'End-to-end encryption for data in transit and at rest using AES-256 standards. SSL/TLS certificates for secure connections. Regular security audits and penetration testing. ISO 27001 certified cloud infrastructure. Automated malware scanning for all uploads. Data residency compliance with UK GDPR requirements.',
  backupProcedures: 'Automated daily backups with 30-day retention policy. Weekly full system backups with 12-month retention. Geo-redundant storage across multiple UK data centres. 99.9% uptime SLA with disaster recovery protocols. Regular backup integrity testing and documented restoration procedures. Monthly backup verification reports.',

  // Volume Strategy and Classification Systems
  volumeStrategy: 'Model breakdown strategy by building zones and disciplines: ARC (Architecture) models by floor levels (L00-L08), STR (Structural) models by structural zones (SZ01-SZ04), MEP (Mechanical/Electrical/Plumbing) models by service zones (MZ01-MZ03), Site models (SITE) for external works, and multi-zone models (ZZ) for coordination across boundaries. Each volume maintains consistent spatial relationships and coordinate systems for effective federation and clash detection.',
  classificationSystems: [
    { 'Classification System': 'Uniclass 2015', 'Application Area': 'Building Elements', 'Code Format': 'Ss_25_30_05', 'Responsibility': 'All Disciplines' },
    { 'Classification System': 'Uniclass 2015', 'Application Area': 'MEP Equipment', 'Code Format': 'Pr_35_31_26', 'Responsibility': 'MEP Engineers' },
    { 'Classification System': 'Uniclass 2015', 'Application Area': 'Architectural Elements', 'Code Format': 'Ac_45_10_12', 'Responsibility': 'Architects' },
    { 'Classification System': 'SfB/Uniclass', 'Application Area': 'Space Classification', 'Code Format': '(21) Office Areas', 'Responsibility': 'Space Planning Team' },
    { 'Classification System': 'COBie', 'Application Area': 'Asset Data', 'Code Format': 'Type.Component.Asset', 'Responsibility': 'Information Manager' }
  ],
  classificationStandards: [
    { 'Element Category': 'Structural Elements', 'Classification System': 'Uniclass 2015', 'Code Format': 'Ss_25_30_05', 'Example Code': 'Ss_25_30_05', 'Description': 'Structural concrete elements' },
    { 'Element Category': 'MEP Equipment', 'Classification System': 'Uniclass 2015', 'Code Format': 'Pr_35_31_26', 'Example Code': 'Pr_35_31_26', 'Description': 'MEP equipment systems' },
    { 'Element Category': 'Architectural Elements', 'Classification System': 'Uniclass 2015', 'Code Format': 'Ac_45_10_12', 'Example Code': 'Ac_45_10_12', 'Description': 'Architectural finishes' },
    { 'Element Category': 'Space Classification', 'Classification System': 'SfB/Uniclass', 'Code Format': '(21) Office Areas', 'Example Code': '(21) Office Areas', 'Description': 'Space classification codes' },
    { 'Element Category': 'Asset Data', 'Classification System': 'COBie', 'Code Format': 'Type.Component.Asset', 'Example Code': 'Type.Component.Asset', 'Description': 'Asset management data' },
    { 'Element Category': 'Building Services', 'Classification System': 'Uniclass 2015', 'Code Format': 'Ss_25_40_20', 'Example Code': 'Ss_25_40_20', 'Description': 'HVAC distribution systems' },
    { 'Element Category': 'Construction Products', 'Classification System': 'Uniclass 2015', 'Code Format': 'Pr_20_93_45', 'Example Code': 'Pr_20_93_45', 'Description': 'Insulation materials and products' },
    { 'Element Category': 'Work Results', 'Classification System': 'Uniclass 2015', 'Code Format': 'Zz_25_10_35', 'Example Code': 'Zz_25_10_35', 'Description': 'Concrete work execution standards' }
  ],


  // BIM Value Applications
  bimValueApplications: 'BIM will maximize project value through: 4D scheduling for time optimization reducing construction duration by 15%, energy modeling for sustainability compliance achieving BREEAM Excellent rating, life-cycle costing analysis enabling informed material selections with 20-year cost projections, design alternative evaluations through parametric modeling supporting value engineering decisions, pre-fabrication coordination reducing on-site assembly time by 30%, stakeholder visualization for enhanced buy-in and reduced change orders, and comprehensive digital asset creation supporting £2M+ operational cost savings over building lifecycle.',
  valueMetrics: [
    { 'Value Area': 'Schedule Optimization', 'Target Metric': '15% reduction in construction duration', 'Measurement Method': '4D model analysis vs baseline schedule', 'Baseline/Benchmark': '24-month traditional schedule' },
    { 'Value Area': 'Cost Reduction', 'Target Metric': '£500k savings through clash elimination', 'Measurement Method': 'Clash detection reports and change order tracking', 'Baseline/Benchmark': 'Industry average 3% RFI costs' },
    { 'Value Area': 'Sustainability Performance', 'Target Metric': 'BREEAM Excellent rating achievement', 'Measurement Method': 'Energy modeling validation', 'Baseline/Benchmark': 'Building Regulations Part L compliance' },
    { 'Value Area': 'Operational Efficiency', 'Target Metric': '25% reduction in FM costs', 'Measurement Method': 'Digital twin performance monitoring', 'Baseline/Benchmark': 'Industry benchmark £150/m²/year' },
    { 'Value Area': 'Quality Improvement', 'Target Metric': '40% reduction in RFIs', 'Measurement Method': 'Design coordination metrics', 'Baseline/Benchmark': 'Previous project average 120 RFIs' }
  ],
  strategicAlignment: 'BIM strategy directly supports client objectives including: 15% reduction in total project delivery time through optimized sequencing, achievement of net-zero carbon targets through integrated energy modeling, enhanced asset performance through digital twin implementation, improved tenant satisfaction via optimized space planning and MEP design, future-proofing for smart building integration, and comprehensive data foundation for predictive maintenance reducing operational costs by 25% annually.',

  // Appendices Data
  responsibilityMatrix: [
    { 'Task/Activity': 'Model Authoring - Architecture', 'Responsible Party': 'Lead Architect (Emma Davis)', 'Accountable Party': 'Project Director (Michael Thompson)', 'Support/Input': 'Planning Consultant, Interior Designer' },
    { 'Task/Activity': 'Model Authoring - Structural', 'Responsible Party': 'Structural Engineer (Robert Chen)', 'Accountable Party': 'Engineering Manager', 'Support/Input': 'Architect, MEP Engineer, Geotechnical' },
    { 'Task/Activity': 'Model Authoring - MEP', 'Responsible Party': 'MEP Engineer (Lisa Rodriguez)', 'Accountable Party': 'MEP Manager', 'Support/Input': 'Architect, Structural, Commissioning' },
    { 'Task/Activity': 'Clash Detection & Resolution', 'Responsible Party': 'BIM Manager (Sarah Johnson)', 'Accountable Party': 'Information Manager', 'Support/Input': 'All Discipline Leaders' },
    { 'Task/Activity': 'Model Federation', 'Responsible Party': 'Information Manager (Sarah Johnson)', 'Accountable Party': 'Project Director', 'Support/Input': 'BIM Coordinator, Quality Controller' },
    { 'Task/Activity': 'Quality Assurance', 'Responsible Party': 'Quality Controller', 'Accountable Party': 'Information Manager', 'Support/Input': 'Discipline Leads, Standards Compliance' },
    { 'Task/Activity': 'Information Exchange', 'Responsible Party': 'CDE Administrator', 'Accountable Party': 'Information Manager', 'Support/Input': 'IT Support, Security Team' },
    { 'Task/Activity': 'Client Reporting', 'Responsible Party': 'Project Manager', 'Accountable Party': 'Project Director', 'Support/Input': 'Information Manager, QS' }
  ],
  cobieRequirements: [
    { 'Component Type': 'Doors', 'Required Parameters': 'Fire Rating, U-Value, Warranty Period, Manufacturer, Model', 'Data Source': 'Architectural Model + Specification', 'Validation Method': 'Automated checking + Manual review' },
    { 'Component Type': 'Windows', 'Required Parameters': 'U-Value, Solar Heat Gain, Acoustic Rating, Warranty, Installation Date', 'Data Source': 'Architectural Model + Product Data', 'Validation Method': 'IFC export validation + COBie reports' },
    { 'Component Type': 'HVAC Equipment', 'Required Parameters': 'Capacity, Energy Rating, Maintenance Schedule, Serial Number, Commissioning Date', 'Data Source': 'MEP Model + Equipment Schedules', 'Validation Method': 'Equipment database validation' },
    { 'Component Type': 'Lighting Fixtures', 'Required Parameters': 'Wattage, Light Output, Control System, Replacement Cycle, Warranty', 'Data Source': 'MEP Model + Lighting Schedules', 'Validation Method': 'Automated parameter checking' },
    { 'Component Type': 'Structural Elements', 'Required Parameters': 'Material Grade, Load Capacity, Fire Rating, Installation Date, Inspection Schedule', 'Data Source': 'Structural Model + Material Data', 'Validation Method': 'Structural analysis integration' }
  ],
  softwareVersionMatrix: [
    { 'Software': 'Autodesk Revit', 'Version': '2024.2', 'File Formats Supported': 'RVT, RFA, RTE, IFC 4, DWG, DXF, PDF', 'Interoperability Notes': 'Primary authoring tool for all disciplines; IFC export validated with buildingSMART certification' },
    { 'Software': 'Autodesk Navisworks Manage', 'Version': '2024.1', 'File Formats Supported': 'NWD, NWF, NWC, IFC, DWG, RVT, FBX', 'Interoperability Notes': 'Federation and clash detection; direct Revit links; BCF export for issue tracking' },
    { 'Software': 'Solibri Model Checker', 'Version': '9.13', 'File Formats Supported': 'IFC 2x3, IFC 4, BCF 2.1, SMC', 'Interoperability Notes': 'Model validation and rule checking; IFC-only workflow; BCF issue export' },
    { 'Software': 'Autodesk Construction Cloud', 'Version': 'Current SaaS', 'File Formats Supported': 'All common formats via web interface', 'Interoperability Notes': 'Cloud CDE platform; Revit Cloud Worksharing; Design Collaboration' },
    { 'Software': 'Microsoft 365', 'Version': 'Current SaaS', 'File Formats Supported': 'DOCX, XLSX, PDF, SharePoint', 'Interoperability Notes': 'Document management; Teams integration; SharePoint for WIP documents' },
    { 'Software': 'Synchro Pro', 'Version': '2024 SP1', 'File Formats Supported': 'IFC, NWD, MPP, P6 XER', 'Interoperability Notes': '4D scheduling; imports from Navisworks and P6' },
    { 'Software': 'BIMcollab Zoom', 'Version': '8.0', 'File Formats Supported': 'IFC, BCF 2.1, BCF 3.0', 'Interoperability Notes': 'Issue management; BCF workflow; integrates with Revit and Navisworks' },
    { 'Software': 'AutoCAD', 'Version': '2024', 'File Formats Supported': 'DWG, DXF, PDF', 'Interoperability Notes': '2D documentation; legacy drawing support; Revit DWG export compatible' }
  ],
  referencedDocuments: [
    { 'Document/Standard': 'ISO 19650-1:2018', 'Version/Edition': '2018', 'Description': 'Organization and digitization of information about buildings and civil engineering works, including BIM - Part 1: Concepts and principles' },
    { 'Document/Standard': 'ISO 19650-2:2018', 'Version/Edition': '2018', 'Description': 'Organization and digitization of information about buildings and civil engineering works, including BIM - Part 2: Delivery phase of the assets' },
    { 'Document/Standard': 'ISO 19650-3:2020', 'Version/Edition': '2020', 'Description': 'Organization and digitization of information about buildings and civil engineering works - Part 3: Operational phase of the assets' },
    { 'Document/Standard': 'ISO 19650-5:2020', 'Version/Edition': '2020', 'Description': 'Organization and digitization of information about buildings and civil engineering works - Part 5: Security-minded approach to information management' },
    { 'Document/Standard': 'BS EN ISO 16739-1:2018', 'Version/Edition': '2018', 'Description': 'Industry Foundation Classes (IFC) for data sharing in the construction and facility management industries' },
    { 'Document/Standard': 'PAS 1192-2:2013', 'Version/Edition': '2013', 'Description': 'Specification for information management for the capital/delivery phase of construction projects using BIM (superseded by ISO 19650-2 but referenced for legacy context)' },
    { 'Document/Standard': 'UK BIM Framework', 'Version/Edition': '2021', 'Description': 'National guidance for implementing ISO 19650 in the UK construction industry' },
    { 'Document/Standard': 'RIBA Plan of Work 2020', 'Version/Edition': '2020', 'Description': 'Project stage definitions and deliverables framework for UK construction projects' },
    { 'Document/Standard': 'Uniclass 2015', 'Version/Edition': 'Current', 'Description': 'Unified classification system for the construction industry in the UK' },
    { 'Document/Standard': 'COBie UK 2012', 'Version/Edition': '2012', 'Description': 'Construction Operations Building information exchange specification for asset data handover' },
    { 'Document/Standard': 'AIA Document E203-2013', 'Version/Edition': '2013', 'Description': 'Building Information Modeling and Digital Data Exhibit (LOD framework reference)' },
    { 'Document/Standard': 'BIM Protocol 2nd Edition', 'Version/Edition': 'CIC 2018', 'Description': 'Construction Industry Council BIM Protocol for contractual requirements' }
  ],
  fileNamingExamples: 'Comprehensive file naming examples:\n\nProject Models:\nGF-SAA-L02-ARC-001 (Greenfield-Smith Associates-Level 02-Architecture-Model 001)\nGF-JEL-SZ1-STR-002 (Greenfield-Jones Engineering-Structural Zone 1-Structure-Model 002)\nGF-TSS-MZ2-MEP-003 (Greenfield-TechServ Solutions-MEP Zone 2-Services-Model 003)\n\nDrawings:\nGF-SAA-ZZ-ARC-DR-A-1001 (General Arrangement Plans)\nGF-JEL-ZZ-STR-DR-S-2001 (Structural General Arrangement)\nGF-TSS-L03-MEP-DR-M-3001 (Level 3 Mechanical Plans)\n\nDocuments:\nGF-SAA-ZZ-ARC-SP-001 (Architectural Specification)\nGF-CMP-ZZ-QS-RP-001 (Cost Report)\nGF-ALL-ZZ-PM-MR-001 (Project Meeting Minutes)',
  exchangeWorkflow: [
    { 'Exchange Point': 'Design Development Review', 'Information Required': 'Coordinated discipline models, clash reports, design drawings', 'Format': 'IFC 4, BCF 2.1, PDF', 'Quality Checks': 'Model validation, clash detection, drawing coordination', 'Approval Process': 'Discipline lead review, IM approval, client sign-off' },
    { 'Exchange Point': 'Technical Design Milestone', 'Information Required': 'Construction-ready models, specifications, quantities', 'Format': 'IFC 4, native files, schedules', 'Quality Checks': 'Construction readiness check, quantity validation', 'Approval Process': 'Technical review, QS validation, project director approval' },
    { 'Exchange Point': 'Construction Handover', 'Information Required': 'As-built models, COBie data, O&M information', 'Format': 'IFC 4, COBie, PDF manuals', 'Quality Checks': 'As-built verification, data completeness check', 'Approval Process': 'Construction team verification, client acceptance' },
    { 'Exchange Point': 'Facilities Management Handover', 'Information Required': 'Digital twin, asset data, maintenance schedules', 'Format': 'COBie, digital twin platform, maintenance systems', 'Quality Checks': 'Data integration testing, system functionality', 'Approval Process': 'FM team acceptance, operational readiness confirmation' }
  ]
};

export default COMMERCIAL_OFFICE_TEMPLATE;