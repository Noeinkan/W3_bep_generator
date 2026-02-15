// Team and Roles (Post-Appointment) Help Content
export const teamAndRolesPostHelp = {
  resourceAllocationTable: {
    description: `Define the confirmed resource allocation with detailed capability and capacity assessments for each role. This structured table demonstrates the delivery team's ability to meet Exchange Information Requirements (EIRs) per ISO 19650-2 clauses 5.3.3–5.3.5.

For each resource, specify:
• **Role**: Specific position (e.g., Senior BIM Coordinator, Discipline BIM Modeler)
• **Assigned Personnel**: Names of team members assigned to the role
• **Key Competencies/Experience**: Relevant skills, certifications (ISO 19650, BIM tools), years of experience
• **Weekly Allocation (Hours)**: Time commitment per week (use FTE equivalents)
• **Software/Hardware Requirements**: Tools needed (Revit 2024, Navisworks, workstation specs)
• **Notes**: Additional information on responsibilities, training needs, interoperability testing

This addresses capability evaluation (clause 5.3.4) by aggregating task team assessments and demonstrating competencies in BIM tools, standards compliance, and information security.`,

    iso19650: `ISO 19650-2:2018 Multiple Clauses:

**Section 5.1.3 - Capacity**: The delivery team must demonstrate sufficient capacity (people, time, resources) to deliver all information requirements throughout the appointment.

**Section 5.3.3 - Task Team Assessment**: Each task team's capability and capacity must be assessed to ensure they can fulfill their information delivery obligations.

**Section 5.3.4 - Capability Evaluation**: Aggregate assessments of team skills in BIM tools, standards compliance, information security, and collaborative working.

**Section 5.3.5 - Mobilization Requirements**: Resources must be tested and verified before collaborative production begins.

**Section 5.5.1-5.5.3 - Resource Setup**: IT infrastructure, software, hardware, and interoperability must be established and tested.`,

    bestPractices: [
      'Include all key information management roles (BIM Coordinator, Information Manager, CDE Administrator)',
      'Specify ISO 19650 certifications and BIM tool proficiencies',
      'Quantify weekly allocation using hours or FTE (Full-Time Equivalent)',
      'Detail software versions (e.g., Revit 2024) and hardware specifications',
      'Address information security training and CDE access requirements',
      'Include interoperability testing plans (IFC exports, federation workflows)',
      'Identify training needs for team members',
      'Show alignment with TIDP/MIDP delivery schedules',
      'Include contingency resources for capacity risks',
      'Document specialist consultants and engagement periods'
    ],

    examples: {
      'Senior BIM Coordinator': `• Role: Senior BIM Coordinator
• Assigned Personnel: John Doe, Jane Smith
• Key Competencies: 10+ years BIM federation experience; ISO 19650-certified; Expert in clash detection and CDE workflows; Certified in Navisworks and BIM 360
• Weekly Allocation: 40 hours (full-time coordination)
• Software/Hardware: Revit 2024, Navisworks Manage, BIM 360; High-spec workstation (32GB RAM, dedicated GPU)
• Notes: Leads federation strategy per clause 5.3.2(c); Training provided on CDE workflows and information security protocols`,

      'Discipline BIM Modeler': `• Role: Structural BIM Modeler
• Assigned Personnel: Alex Kim (Lead), Team of 3
• Key Competencies: 5+ years structural modeling in Revit; Proficient in IFC export and coordination; Information security training completed
• Weekly Allocation: 160 hours total (4 FTE)
• Software/Hardware: Revit 2024 (Structural), AutoCAD; Cloud CDE access
• Notes: Ensures model quality per production methods (clause 5.1.5); Interoperability tested with IFC 4 exports to verify data integrity`,

      'Information Manager': `• Role: Information Manager
• Assigned Personnel: Sarah Johnson
• Key Competencies: 8+ years managing information protocols; ISO 19650 Lead Assessor certification; Experience with CDE implementation and compliance auditing
• Weekly Allocation: 20 hours (QA/QC oversight)
• Software/Hardware: BIM 360, Aconex, or equivalent CDE platform; Audit and reporting tools
• Notes: Manages version control, approval workflows, and TIDP coordination; Integrates capacity gaps into project risk register per clause 5.3.6`
    },

    commonMistakes: [
      'Not specifying software versions or hardware requirements',
      'Omitting competency details (certifications, experience level)',
      'No mention of information security training',
      'Missing interoperability testing plans',
      'Not quantifying time allocation (hours/FTE)',
      'Failing to address training needs',
      'No contingency plans for resource shortfalls',
      'Not aligning with TIDP/MIDP schedules'
    ],

    aiPrompt: {
      system: 'You are a BIM delivery capability and capacity specialist. Generate ISO 19650-aligned resource allocation tables.',
      instructions: 'Generate a concise resource allocation table based on the description and examples. Include multiple roles (e.g., Senior BIM Coordinator, Discipline BIM Modeler, Information Manager). For each entry include: role, assigned personnel, key competencies/certifications, weekly allocation (hours/FTE), software/hardware requirements, and notes on responsibilities/testing (interoperability, security training). Use appointment-confirmed language. Maximum 150 words.',
      style: 'table-like entries, role-specific detail, quantified allocations, ISO 19650-2 terminology'
    },

    relatedFields: ['mobilizationPlan', 'taskTeamsBreakdown', 'informationManagementResponsibilities', 'confirmedBimGoals']
  },

  mobilizationPlan: {
    description: `Outline a phased mobilization plan that demonstrates how the delivery team will be onboarded, equipped, and verified for capability before full information production begins. This addresses ISO 19650-2 clauses 5.3.5 (mobilization) and 5.5.1-5.5.3 (resource setup and testing).

Include:
• **Phased Timeline**: Week-by-week or stage-by-stage mobilization schedule
• **Onboarding & Training**: ISO 19650 training, CDE workflows, information security briefings
• **IT Infrastructure Setup**: Software licensing, hardware provisioning, VPN/cloud access
• **Capability Verification**: Pilot models, federation testing, CDE submission procedures
• **Interoperability Testing**: IFC exports, data integrity checks, cross-discipline coordination
• **Risk Mitigation**: Documented capacity risks (skill shortfalls, IT issues) with contingency plans

The plan should ensure all resources are tested and ready for collaborative production before information delivery commences, with risks tracked in the project risk register.`,

    iso19650: `ISO 19650-2:2018 Multiple Clauses:

**Section 5.3.5 - Mobilization**: The lead appointed party must mobilize the delivery team, ensuring all task teams are capable and ready to produce information.

**Section 5.3.6 - Risk Register**: Capacity and capability risks must be documented in the delivery team's risk register with mitigation strategies.

**Section 5.5.1 - Information Technology Setup**: Establish and test IT infrastructure (hardware, software, networks) before production begins.

**Section 5.5.2 - Software and Tools**: Ensure all required software is licensed, configured, and tested for interoperability.

**Section 5.5.3 - Testing and Verification**: Verify team capability through pilot information production, testing workflows, CDE access, and federation processes.`,

    bestPractices: [
      'Use a phased approach (Week 1, Week 2, Week 3) for clarity',
      'Start with training (ISO 19650, CDE workflows, information security)',
      'Include IT setup (workstations, software licensing, cloud access)',
      'Test interoperability early (IFC exports, model federation, clash detection)',
      'Verify capability through pilot models before full production',
      'Document risks in project risk register per clause 5.3.6',
      'Include contingency plans (specialist consultants, backup resources)',
      'Align mobilization timeline with MIDP milestones',
      'Address CDE configuration (templates, shared object libraries, metadata)',
      'Plan for ongoing training and upskilling as needed'
    ],

    examples: {
      'Detailed Mobilization Plan': `**Week 1 - Onboarding and Training:**
• Team orientation and project kickoff meeting
• ISO 19650-2 training for all personnel (2-day workshop)
• Information security briefings and CDE access provisioning
• Review of EIR requirements and delivery obligations

**Week 2 - IT Infrastructure Setup:**
• Workstation configuration (Revit 2024, Navisworks, AutoCAD)
• Software licensing verification and activation
• Cloud storage allocation and VPN setup for remote collaboration
• CDE platform configuration (BIM 360/Aconex) with folder structure and permissions

**Week 3 - Capability Verification:**
• Pilot model production (one discipline per task team)
• Testing federation workflows and clash detection protocols
• IFC export testing to verify data integrity and interoperability
• CDE submission procedures walkthrough and quality checks
• Review against EIR requirements and client feedback

**Risk Mitigation:**
Resource capacity risks (skill shortfalls, IT connectivity issues, software compatibility) are documented in the project risk register per ISO 19650-2 clause 5.3.6. Contingency plans include:
• Access to specialist BIM consultants for advanced workflows
• Backup internet connectivity (4G/5G hotspots)
• Alternative software licenses (floating licenses for surge capacity)
• Escalation protocols via MIDP notifications to client

All resources will be tested for collaborative production capability before full information delivery commences.`,

      'Concise Plan': `Upon appointment, mobilization proceeds in three phases:

**Phase 1 (Week 1):** Team onboarding, ISO 19650 training, information security briefings, CDE access provisioning.

**Phase 2 (Week 2):** IT setup - software licensing (Revit 2024, Navisworks), hardware provisioning, cloud access configuration, interoperability testing via IFC exports.

**Phase 3 (Week 3):** Capability verification through pilot models demonstrating federation, clash detection, and CDE submission procedures aligned with EIRs.

**Risks:** Capacity gaps (IT connectivity, skill shortfalls) documented in risk register with mitigation via specialist consultants and contingency resource pools. All personnel tested before production begins.`
    },

    commonMistakes: [
      'No phased timeline or schedule',
      'Missing training and onboarding activities',
      'Not addressing IT infrastructure setup',
      'No capability verification or testing phase',
      'Failing to mention interoperability testing',
      'Not documenting risks in risk register',
      'No contingency plans for resource shortfalls',
      'Missing alignment with MIDP milestones',
      'Not addressing CDE configuration and templates'
    ],

    aiPrompt: {
      system: 'You are a BIM mobilization coordinator. Generate comprehensive mobilization plans with phased activities, capability testing, and risk management.',
      instructions: 'Generate content similar to the examples above. Use 3-week phased structure with detailed activities: Week 1 (onboarding, ISO 19650 training, EIR review, CDE access), Week 2 (IT setup, Revit/Navisworks licensing, cloud config, CDE templates), Week 3 (pilot models, federation testing, IFC validation, quality checks). Include risk mitigation section documenting capacity risks per ISO 19650-2 clause 5.3.6. Use structured format with bold headings and bullet points. Maximum 150 words.',
      style: 'phased structure (3 weeks), detailed activities, ISO 19650-2 compliant, risk register integration, capability verification emphasis'
    },

    relatedFields: ['resourceAllocationTable', 'informationManagementResponsibilities', 'cdeStructure', 'confirmedBimGoals']
  },

  informationManagementResponsibilities: {
    description: `Define the specific responsibilities of the Information Manager and the information management framework for the project. Explain what the Information Manager will do, how information processes will be managed, and what governance structures are in place.

Include:
• Information Manager's key responsibilities and authority
• CDE establishment and management duties
• TIDP coordination and monitoring
• Quality assurance and compliance checking
• Information security management
• Audit and reporting responsibilities
• Escalation and issue resolution processes`,

    iso19650: `ISO 19650-2:2018 Section 5.2 - Information Manager Role

The Information Manager is responsible for establishing the information management function, managing the CDE, coordinating information delivery, ensuring quality and security compliance, and maintaining audit trails throughout the appointment.`,

    bestPractices: [
      'Be specific about Information Manager authorities and responsibilities',
      'Explain CDE setup, management, and governance',
      'Define TIDP coordination and monitoring processes',
      'Address quality checking and validation duties',
      'Include information security responsibilities',
      'Mention reporting frequency and stakeholders',
      'Define escalation paths for information issues',
      'Reference ISO 19650 compliance monitoring',
      'Clarify decision-making authority on information matters'
    ],

    examples: {
      'Post-Appointment BEP': `The Information Manager oversees all aspects of information production, management, and exchange in accordance with ISO 19650-2:2018 and the client's EIR. Specific responsibilities include:

CDE Management: Establishing and maintaining the project CDE within 2 weeks of appointment, implementing role-based access controls, managing folder structures and naming conventions, ensuring audit trails and version control, and conducting monthly CDE health checks.

TIDP Coordination: Coordinating all Task Information Delivery Plans (TIDPs) across disciplines, monitoring deliverable compliance with LOIN requirements, tracking information delivery against the MIDP, facilitating cross-disciplinary information exchanges, and escalating delays or quality issues.

Quality Assurance: Implementing automated model validation workflows (Solibri, Navisworks), conducting pre-submission quality checks, ensuring federated model integrity, validating compliance with project standards, and maintaining quality registers.

Information Security: Managing access permissions and user authentication, implementing encryption protocols, conducting security audits, ensuring GDPR compliance, and managing data classification policies.

Governance & Reporting: Monthly reporting to project director and client on information delivery status, KPI performance, risks, and issues. Facilitating Information Management Team meetings every 2 weeks. Maintaining comprehensive audit trails for all information exchanges.

The Information Manager reports directly to the Project Director with authority to halt information submission that fails quality standards. Escalation to client representative occurs for systemic issues or resource constraints impacting delivery.`
    },

    commonMistakes: [
      'Vague responsibilities without specific tasks',
      'Not defining CDE management duties',
      'Missing TIDP coordination responsibilities',
      'No mention of quality assurance processes',
      'Information security responsibilities omitted',
      'Unclear reporting lines or authority',
      'No escalation procedures defined',
      'Missing compliance monitoring duties'
    ],

    aiPrompt: {
      system: 'You are an Information Manager specialist. Generate comprehensive responsibility frameworks covering CDE management, TIDP coordination, QA, security, and governance.',
      instructions: 'Generate content similar to the examples above. Structure with clear categories: CDE Management (setup, access control, audit trails), TIDP Coordination (monitoring deliverables, LOIN compliance, MIDP tracking), Quality Assurance (automated validation, Solibri/Navisworks checks), Information Security (access permissions, encryption, GDPR), Governance & Reporting (monthly reports, KPIs, escalation). Include specific timelines and authority levels. Maximum 150 words.',
      style: 'structured categories, specific responsibilities, ISO 19650-2 aligned, governance emphasis, clear authority and escalation'
    },

    relatedFields: ['informationManager', 'cdeStrategy', 'qaFramework']
  },

  organizationalStructure: {
    description: `This is an interactive organizational chart showing the delivery team's structure and composition. Use the chart builder to define:

• Project governance hierarchy
• Reporting lines and accountability
• Task team organization by discipline
• Information Manager position and authority
• Stakeholder relationships
• Communication channels`,

    iso19650: `ISO 19650-2:2018 Section 5.1.3 - Delivery Team Structure

The organizational structure demonstrates clear lines of authority, accountability, and communication. It shows how the delivery team is configured to deliver information requirements effectively.`,

    bestPractices: [
      'Position Information Manager with appropriate authority',
      'Show clear reporting lines to client/appointing party',
      'Organize task teams by discipline logically',
      'Include all key decision-makers and approvers',
      'Show coordination and communication paths',
      'Keep structure simple and clear - avoid over-complication',
      'Ensure consistency with contracts and other documentation'
    ],

    commonMistakes: [
      'Information Manager positioned with insufficient authority',
      'Unclear reporting lines or accountability',
      'Missing key stakeholders or decision-makers',
      'Overly complex structure that confuses rather than clarifies',
      'Inconsistency with other project documentation'
    ],

    aiPrompt: {
      system: 'You are a BIM Information Management specialist. Generate clear, ISO 19650-aligned organizational structures and reporting lines.',
      instructions: 'Describe the project organizational structure for information management. Include governance hierarchy, reporting lines to the appointing party, task teams by discipline, and the Information Manager role with authority/escalation. Mention communication channels and approval responsibilities for information deliverables. Keep it clear and practical (suitable for an org chart description). Maximum 130 words.',
      style: 'clear hierarchy, roles and reporting lines, ISO 19650 language, concise and unambiguous'
    },

    relatedFields: ['assignedTeamLeaders', 'informationManager', 'taskTeamsBreakdown']
  },

  taskTeamsBreakdown: {
    description: `Provide a detailed breakdown of all task teams in a structured table format. Define each team's composition, leadership, members, and specific responsibilities for information production.

Include for each task team:
• Task Team name/discipline (Architecture, Structure, MEP, etc.)
• Team Leader (name and role)
• Team Members (key personnel)
• Specific Responsibilities (information deliverables, coordination duties, quality requirements)`,

    iso19650: `ISO 19650-2:2018 Section 5.1.6 - Task Teams

Task teams are responsible groups that produce, manage, and exchange information within their domain. Each task team must have clear responsibilities, leadership, and coordination protocols.`,

    bestPractices: [
      'Include all disciplines contributing to information production',
      'Define specific deliverables for each task team',
      'List key team members with their roles',
      'Specify coordination responsibilities',
      'Mention software/tools each team will use',
      'Reference relevant TIDPs',
      'Ensure responsibilities align with LOIN and MIDP',
      'Cover both design and construction phase teams if applicable'
    ],

    examples: {
      'Table Entry': `Architecture Task Team | Michael Chen, Design Director | 8 architects, 2 BIM coordinators | Responsible for: spatial design models (LOD 350), architectural specifications, room data sheets, door/window schedules, material selections, design coordination with all disciplines. Software: Revit, Enscape. Deliverables per Architectural TIDP.

Structural Engineering Task Team | David Williams, Principal Engineer | 5 structural engineers, 1 BIM coordinator | Responsible for: structural analysis models, construction models (LOD 350), connection details, structural calculations, coordination with architecture and MEP. Software: Tekla Structures, Robot Structural Analysis. Deliverables per Structural TIDP.

MEP Task Team | Emma Davis, Associate Director | 6 MEP engineers (M/E/P split), 2 BIM coordinators | Responsible for: coordinated MEP models (LOD 350), system specifications, equipment schedules, energy analysis, spatial coordination, routing optimization, plant room layouts. Software: Revit MEP, IES-VE. Deliverables per MEP TIDP.`
    },

    commonMistakes: [
      'Not defining specific responsibilities or deliverables',
      'Missing team composition details',
      'No mention of software or tools',
      'Vague responsibilities that don\'t align with LOIN',
      'Missing coordination duties between teams',
      'Not referencing relevant TIDPs'
    ],

    aiPrompt: {
      system: 'You are a BIM task team coordination expert. Generate ISO 19650-aligned task team breakdowns for a BEP.',
      instructions: 'Generate a structured task team breakdown (table-style text). Include key disciplines as separate entries (minimum: Architecture, Structural Engineering, MEP). For each: task team name, team leader, team members/composition, specific responsibilities and information deliverables (aligned to LOIN and TIDP), coordination duties with other teams, and primary software/tools. Use clear, appointment-confirmed language. Maximum 160 words.',
      style: 'table-style entries, discipline headings, deliverable-focused, ISO 19650/TIDP/LOIN terminology'
    },

    relatedFields: ['assignedTeamLeaders', 'organizationalStructure', 'tidpRequirements']
  },

  confirmedTrackRecord: {
    description: `This field uses the same guidance as 'trackRecordProjects'. In the post-appointment context, this confirms the actual track record of the appointed team, providing the client with confidence in your proven delivery capability.`,
    iso19650: `See 'trackRecordProjects' for ISO 19650-2 guidance on demonstrating capability through past performance.`,
    bestPractices: ['See trackRecordProjects field for comprehensive guidance'],
    examples: { 'Reference': 'See trackRecordProjects for detailed examples' },
    commonMistakes: ['See trackRecordProjects for guidance'],
    aiPrompt: {
      system: 'See trackRecordProjects configuration',
      instructions: 'See trackRecordProjects configuration',
      style: 'See trackRecordProjects configuration'
    },
    relatedFields: ['trackRecordProjects', 'teamCapabilities', 'mobilizationPlan']
  }
,

  // === Migrated from legacy helpContentData.js ===
  leadAppointedParty: {
      "description": "Confirm the appointed Lead Appointed Party - the organization taking primary responsibility for managing information delivery and coordinating the delivery team.\n\nInclude:\n• Full legal company name\n• Company registration details if required\n• Relevant accreditations (ISO 19650, ISO 9001, etc.)\n• Brief company profile highlighting relevant credentials",
      "iso19650": "ISO 19650-2:2018 Section 5.1.3 - Lead Appointed Party\n\nThe Lead Appointed Party has overall responsibility for managing information and coordinating the delivery team's collective performance against the Exchange Information Requirements (EIR) throughout the appointment.",
      "bestPractices": [
          "Provide full legal entity name matching contract",
          "Include company registration number if required",
          "Confirm ISO 19650-2 certification or accreditation",
          "Mention other relevant standards (ISO 9001, Cyber Essentials)",
          "Add brief credentials demonstrating capability",
          "Ensure complete consistency with contract documentation"
      ],
      "examples": {
          "Architecture Firm": "Smith & Associates Architects Ltd. (Company No. 01234567, ISO 19650-2:2018 certified, ISO 9001:2015, Cyber Essentials Plus) - Established architectural practice with 20+ years experience and proven track record delivering BIM Level 2 projects exceeding £500M total value.",
          "Engineering Firm": "Jones Engineering Consultants LLP (ISO 19650-2 certified, Chartered Engineers) - Multidisciplinary engineering practice with dedicated information management capability and extensive experience coordinating complex commercial and infrastructure projects."
      },
      "commonMistakes": [
          "Using trading name instead of legal entity",
          "Missing company registration details",
          "Not confirming ISO 19650 certification",
          "Inconsistency with contract documents",
          "Insufficient credentials to demonstrate capability"
      ],
      "aiPrompt": {
          "system": "You are a BIM contract management expert specializing in appointed party confirmation.",
          "instructions": "Generate a confirmed Lead Appointed Party entry for BEP appointment. Include full legal company name, company registration number, ISO 19650-2 certification, ISO 9001 accreditation, and Cyber Essentials. Add brief credentials with years of experience and total project portfolio value. Use confident, appointment-confirmed language. Maximum 100 words.",
          "style": "appointment-confirmed language, factual, compliance-led, concise"
      },
      "relatedFields": [
          "proposedLead",
          "informationManager",
          "resourceAllocation"
      ]
  },

  informationManager: {
      "description": "Confirm the appointed Information Manager - the named individual responsible for managing information processes, CDE implementation, and ensuring ISO 19650 compliance throughout the project.\n\nInclude:\n• Full name and job title\n• Professional qualifications and memberships (RICS, CIOB, APM, etc.)\n• ISO 19650 and BIM certifications\n• Contact details\n• Brief experience summary demonstrating competency",
      "iso19650": "ISO 19650-2:2018 Section 5.1.3 - Information Manager\n\nThe Information Manager establishes and maintains information management processes, manages the CDE, coordinates TIDPs, ensures quality compliance, and manages information security. This is a critical role requiring proven competency and authority.",
      "bestPractices": [
          "Provide full name and formal job title",
          "List all relevant professional qualifications (RICS, CIOB, APM)",
          "Confirm ISO 19650 Lead or equivalent certification",
          "Include BIM-specific credentials (Autodesk, BRE, BSI)",
          "Add contact details for accessibility",
          "Quantify information management experience (years, project count)",
          "Confirm sufficient authority and dedicated availability"
      ],
      "examples": {
          "Senior Professional": "Sarah Johnson, BIM Manager and Information Manager (RICS MBIM, ISO 19650-2 Lead Practitioner, Autodesk Certified Professional, PRINCE2 Practitioner) - s.johnson@smith-assoc.co.uk / +44 7700 900234\n\n12+ years information management experience across commercial and infrastructure projects totaling £800M+. Proven track record implementing ISO 19650-2 compliant workflows, managing complex CDEs, and coordinating multi-disciplinary information delivery on projects up to £120M value.",
          "Experienced Specialist": "David Chen, Head of Digital Delivery (CEng, MICE, BIM Level 2 Certified, ISO 19650 Information Manager) - d.chen@joneseng.co.uk / +44 7700 900567\n\n15 years BIM implementation and information management leadership. Expertise in federated model coordination, CDE management, and ISO 19650 compliance across 40+ projects. Dedicated 80% FTE allocation to this project ensuring continuous information management oversight."
      },
      "commonMistakes": [
          "Not confirming ISO 19650 competency or certification",
          "Missing professional qualifications",
          "No contact details provided",
          "Insufficient experience for project complexity",
          "Unclear availability or time commitment",
          "Person lacks authority or organizational support",
          "No mention of BIM-specific expertise"
      ],
      "aiPrompt": {
          "system": "You are a BIM organizational expert specializing in Information Manager appointment and competency verification.",
          "instructions": "Generate a confirmed Information Manager entry for BEP appointment. Include full name, job title, professional qualifications (RICS, CIOB, APM), ISO 19650-2 Lead certification, BIM credentials (Autodesk, BRE), and contact details. Add experience summary with years, project count, and total portfolio value. Include FTE allocation. Use appointment-confirmed language. Maximum 150 words.",
          "style": "appointment-confirmed language, professional, competency-led, concise"
      },
      "relatedFields": [
          "proposedInfoManager",
          "informationManagementResponsibilities",
          "resourceAllocation"
      ]
  },

  assignedTeamLeaders: {
      "description": "Confirm the assigned Task Team Leaders for each discipline. These are the appointed technical leads responsible for information production, quality assurance, and coordination within their disciplines.\n\nInclude for each leader:\n• Discipline (Architecture, Structural, MEP, Civils, QS, etc.)\n• Name, job title, and professional qualifications\n• Company name\n• Detailed role responsibilities for this project\n• BIM competency and relevant experience",
      "iso19650": "ISO 19650-2:2018 Section 5.1.3 - Task Team Leaders\n\nTask Team Leaders manage information production within their discipline, ensure deliverables meet LOIN and quality requirements, coordinate through the Information Manager, and maintain their TIDP compliance throughout the appointment.",
      "bestPractices": [
          "Include all disciplines contributing to design information",
          "Confirm professional qualifications and chartered status",
          "Specify exact role responsibilities for this project",
          "Mention BIM competency level and software expertise",
          "Quantify relevant experience on similar projects",
          "Confirm dedicated time allocation (% FTE)",
          "Ensure leaders have authority and decision-making capacity"
      ],
      "examples": {
          "Table Entry": "Architecture | Michael Chen, Design Director (ARB, RIBA, BIM Level 2) | Smith & Associates | Responsible for architectural design coordination, spatial modeling to LOD 350, specification schedules, and design team leadership. 18 years experience, 50% FTE allocation.\n\nStructural Engineering | David Williams, Principal Engineer (CEng, MIStructE, Tekla Structures Expert) | Jones Engineering | Leads structural analysis, coordination models, connection details, and engineering calculations. Advanced BIM coordination expertise across 15 years, 40% FTE allocation.\n\nMEP Engineering | Emma Davis, Associate Director (CEng, MCIBSE, Revit MEP Specialist) | TechServ Solutions | Manages all building services design, MEP coordination to LOD 350, system specifications, and energy analysis. 14 years building services experience with digital twin expertise, 60% FTE allocation."
      },
      "commonMistakes": [
          "Missing role-specific responsibilities",
          "Not confirming time allocation or availability",
          "No mention of BIM competency for technical roles",
          "Insufficient experience for assigned responsibilities",
          "Vague experience descriptions",
          "Leaders without authority to make design decisions"
      ],
      "aiPrompt": {
          "system": "You are a BIM project delivery expert specializing in task team organization and resource confirmation.",
          "instructions": "Generate a table of confirmed Task Team Leaders for BEP appointment. Include entries for Architecture, Structural Engineering, and MEP Engineering (minimum). For each: discipline, name with job title, professional qualifications (ARB, CEng, chartered), company name, specific project responsibilities, BIM competency/software expertise, years of experience, and FTE allocation. Use appointment-confirmed language. Maximum 150 words.",
          "style": "table format, appointment-confirmed language, professional, concise"
      },
      "relatedFields": [
          "proposedTeamLeaders",
          "taskTeamsBreakdown",
          "resourceAllocationTable",
          "mobilizationPlan"
      ]
  },

  resourceAllocation: {
      "description": "(Legacy field - use resourceAllocationTable and mobilizationPlan instead)\n    \nDescribe the confirmed resource allocation across the delivery team. Explain the team composition, staffing levels, resource deployment across project phases, and how resources will be scaled to meet delivery demands.\n\nInclude:\n• Total team size and composition by discipline\n• Staffing levels at different project stages (RIBA stages)\n• Peak resource requirements and timing\n• Specialist resources and when they'll be engaged\n• Resource flexibility and contingency plans",
      "iso19650": "ISO 19650-2:2018 Section 5.1.3 - Capacity\n\nThe delivery team must demonstrate sufficient capacity (people, time, resources) to deliver all information requirements throughout the appointment. Resource allocation should align with the MIDP and delivery schedule.",
      "bestPractices": [
          "Quantify total team size by discipline (architects, engineers, etc.)",
          "Show resource deployment aligned with RIBA stages or project phases",
          "Identify peak resource periods and staffing levels",
          "Mention specialist resources and engagement timing",
          "Include BIM/coordination resources specifically",
          "Address resource contingency and flexibility",
          "Use FTE (Full-Time Equivalent) metrics where appropriate",
          "Ensure alignment with project programme and MIDP"
      ],
      "examples": {
          "Commercial Building": "The confirmed delivery team comprises 45 specialists across all disciplines providing comprehensive design and coordination capability:\n\nCore Team: 12 architects (including 3 BIM coordinators), 8 structural engineers, 10 MEP engineers (mechanical, electrical, public health), 6 quantity surveyors, 4 project managers, 5 BIM specialists.\n\nResource Deployment by RIBA Stage:\n• Stage 3 (Developed Design): 30 FTE - emphasis on spatial coordination and design development\n• Stage 4 (Technical Design): Peak deployment of 42 FTE - full technical coordination and documentation\n• Stage 5 (Construction): 15 FTE reducing to 8 FTE - construction support and as-built verification\n\nSpecialist Consultants: Sustainability consultant (6-month Stage 3-4 engagement), facade engineer (8-month detailed design period), acoustic consultant (Stage 3-4 design validation).\n\nResource Contingency: 20% additional capacity available through parent company resources for peak periods or technical challenges.",
          "Infrastructure": "The delivery team provides 35 specialists with infrastructure project expertise:\n\nCore Disciplines: 8 highway designers, 6 structural engineers, 8 civils/drainage engineers, 4 BIM coordinators, 5 project managers, 4 quantity surveyors.\n\nStage Deployment:\n• Concept Design: 18 FTE - options development and preliminary design\n• Detailed Design: Peak 32 FTE - full 3D coordination and construction documentation\n• Construction Support: 12 FTE - technical queries and as-built verification\n\nSpecialists: Geotechnical engineer (site investigation phase), environmental consultant (12-month consents period), traffic modeling specialist (6-month design validation).\n\nScalability: Access to parent company's 200+ infrastructure specialists for peer review and specialist input."
      },
      "commonMistakes": [
          "Not quantifying team size or composition",
          "Missing resource deployment across project phases",
          "No identification of peak resource requirements",
          "Not addressing BIM/coordination resources specifically",
          "Vague staffing commitments without FTE metrics",
          "Missing specialist consultant timing",
          "No resource contingency or flexibility mentioned",
          "Misalignment with project programme"
      ],
      "aiPrompt": {
          "system": "You are a BIM delivery manager. Produce ISO 19650-aligned resource allocation statements that evidence delivery capacity and scaling.",
          "instructions": "Write a resource allocation summary aligned to ISO 19650-2 capacity requirements. Include: total team size by discipline, explicit BIM roles (BIM Manager/Coordinator), phase-based deployment (by project stage) with peak FTE timing, specialist resources and when engaged, and contingency/scalability (e.g., access to wider resource pool). Keep it specific and quantified. Ensure alignment with programme/MIDP milestones. Maximum 140 words.",
          "style": "quantified (FTE), phase-based, role/discipline clarity, capacity evidence, concise"
      },
      "relatedFields": [
          "teamCapabilities",
          "assignedTeamLeaders",
          "mobilisationPlan"
      ]
  },
};
