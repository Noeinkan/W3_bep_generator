// Information Delivery Planning Help Content
export const deliveryPlanningHelp = {
  midpDescription: {
    description: `Describe the Master Information Delivery Plan (MIDP) - the high-level schedule that establishes when information will be delivered throughout the project.

Include:
• Alignment with project stages (RIBA Plan of Work)
• Key delivery milestones and dates
• Quality gates and approval processes
• Integration with project programme
• Coordination between disciplines`,

    iso19650: `ISO 19650-2:2018 Section 5.4 - Information Delivery Planning

The MIDP establishes the schedule of information delivery aligned with key decision points and the project's information requirements.`,

    bestPractices: [
      'Align with RIBA Plan of Work stages or equivalent',
      'Define clear milestone dates for each major deliverable',
      'Include quality gates with acceptance criteria',
      'Show integration with overall project programme',
      'Reference coordination between TIDPs',
      'Include client review and approval periods',
      'Address handover and close-out information delivery'
    ],

    aiPrompt: {
      system: 'You are a BIM delivery planning expert specializing in information delivery scheduling per ISO 19650.',
      instructions: 'Generate a Master Information Delivery Plan (MIDP) description. Include alignment with RIBA Plan of Work stages (1-7), key delivery milestones with indicative dates, quality gates and approval processes, integration with project programme, and coordination between Task Information Delivery Plans (TIDPs). Reference handover and close-out processes. Use structured paragraphs. Maximum 150 words.',
      style: 'structured paragraphs, ISO 19650 tone, milestone-led, concise'
    },

    relatedFields: ['keyMilestones', 'tidpRequirements']
  },

  keyMilestones: {
    description: `Define key information delivery milestones in a structured table showing stage/phase, description, deliverables, and due dates.`,

    iso19650: `ISO 19650-2:2018 Section 5.4 - Information Delivery Milestones

Key milestones represent critical points where information is delivered, reviewed, and approved before progressing to the next phase.`,

    bestPractices: [
      'Align milestones with RIBA stages or project phases',
      'Be specific about deliverables at each milestone',
      'Include realistic dates accounting for review periods',
      'Show progressive LOD development through stages',
      'Include handover and as-built milestones',
      'Reference quality requirements for each milestone'
    ],

    aiPrompt: {
      system: 'You are a BIM project scheduling expert specializing in milestone planning and phased information delivery.',
      instructions: 'Generate a table of key information delivery milestones for a BEP. Include 5-6 milestones aligned with RIBA stages (e.g., Stage 2, 3, 4, 5, 6, Handover). For each: stage/phase, description, key deliverables (models, specifications, schedules), and indicative due date. Show progressive LOD development (LOD 200→300→350→400). Use table format with pipe separators. Maximum 150 words.',
      style: 'table format, phased milestones, professional, concise'
    },

    relatedFields: ['midpDescription', 'milestoneInformation']
  },

  tidpRequirements: {
    description: `Define Task Information Delivery Plan (TIDP) requirements - discipline-specific delivery plans that feed into the MIDP.

Include:
• TIDP requirements for each discipline
• Delivery frequency (weekly, bi-weekly, monthly)
• Quality checking procedures
• Approval workflows
• Integration requirements with federated model`,

    iso19650: `ISO 19650-2:2018 Section 5.4.2 - Task Information Delivery Plans

TIDPs define how each task team will deliver information to meet their commitments within the MIDP, including specific deliverables, quality requirements, and schedules.`,

    bestPractices: [
      'Define TIDP for each major discipline (Architecture, Structure, MEP)',
      'Specify delivery frequency appropriate to discipline',
      'Include quality checking procedures before submission',
      'Define approval workflows and responsible parties',
      'Address coordination and clash detection requirements',
      'Reference software and formats for each TIDP',
      'Ensure TIDPs align with overall MIDP'
    ],

    aiPrompt: {
      system: 'You are a BIM delivery planning specialist focusing on task team coordination and discipline-specific delivery plans per ISO 19650.',
      instructions: 'Generate Task Information Delivery Plan (TIDP) requirements description. Cover TIDP requirements for each major discipline (Architecture, Structural Engineering, MEP). Include delivery frequency (weekly/bi-weekly/monthly) appropriate to each discipline, quality checking procedures before submission, approval workflows with responsible parties, coordination and clash detection requirements, and integration with federated model. Reference software and file formats. Ensure alignment with Master Information Delivery Plan (MIDP). Use structured paragraphs. Maximum 180 words.',
      style: 'structured paragraphs, discipline-led, ISO 19650 tone, concise'
    },

    relatedFields: ['midpDescription', 'taskTeamsBreakdown']
  },

  mobilisationPlan: {
    description: `Describe the project mobilisation plan - how the team, systems, and processes will be established at project start.

Include:
• CDE setup timeline
• Template and standard development
• Team onboarding and training schedule
• Tool deployment and testing
• Pilot model creation
• Competency verification
• Project launch readiness`,

    iso19650: `ISO 19650-2:2018 Section 5.2 - Mobilization

Mobilization establishes the information management capability, processes, and infrastructure necessary to deliver against the project's information requirements.`,

    bestPractices: [
      'Define week-by-week mobilisation activities',
      'Include CDE setup and configuration (Week 1-2)',
      'Address team training and onboarding',
      'Include pilot model creation and testing',
      'Verify competencies before production starts',
      'Test workflows and coordination procedures',
      'Define "go-live" criteria for project launch'
    ],

    aiPrompt: {
      system: 'You are a BIM project mobilization expert specializing in team setup, system deployment, and readiness planning per ISO 19650.',
      instructions: 'Generate a project mobilization plan describing how the team, systems, and processes will be established at project start. Include week-by-week timeline covering: CDE setup and configuration (Weeks 1-2), template and standard development, team onboarding and BIM training schedule, software tool deployment and testing, pilot model creation and validation, competency verification process, and project launch readiness criteria ("go-live" gates). Reference ISO 19650 compliance requirements. Show phased approach with clear milestones. Use structured paragraphs with timeline references. Maximum 180 words.',
      style: 'week-by-week plan, readiness gates, ISO 19650 tone, concise'
    },

    relatedFields: ['cdeStrategy', 'trainingRequirements', 'teamCapabilitySummary']
  },

  teamCapabilitySummary: {
    description: `Summarize the delivery team's BIM capability and capacity to meet project information requirements.`,

    iso19650: `ISO 19650-2:2018 Section 5.1.3 - Capability and Capacity

The team must demonstrate both capability (skills, knowledge, certifications) and capacity (resources, availability) to deliver all information requirements.`,

    bestPractices: [
      'Quantify team size and composition',
      'Reference ISO 19650 and BIM certifications',
      'Mention software competencies and licenses',
      'Include years of relevant experience',
      'Reference similar project delivery',
      'Address capacity for peak periods',
      'Mention quality assurance resources'
    ],

    aiPrompt: {
      system: 'You are a BIM team assessment specialist focusing on capability evaluation and resource capacity planning per ISO 19650.',
      instructions: 'Generate a team capability summary demonstrating the delivery team\'s BIM capability and capacity to meet project information requirements. Quantify team size and composition (e.g., 5 architects, 3 structural engineers, 4 MEP engineers). Reference ISO 19650 certifications, BIM qualifications, and relevant training. Mention software competencies (Revit, Tekla, Civil 3D) and available licenses. Include collective years of BIM experience and reference similar successful project deliveries. Address resource capacity for peak workload periods. Mention quality assurance resources and procedures. Use structured paragraphs. Maximum 160 words.',
      style: 'capability/capacity framing, ISO 19650 tone, structured, concise'
    },

    relatedFields: ['teamCapabilities', 'resourceAllocation', 'bimCompetencyLevels']
  },

  informationRiskRegister: {
    description: `Maintain a risk register specific to information delivery - identifying, assessing, and mitigating risks to information management.`,

    iso19650: `ISO 19650-2:2018 Section 5.7 - Information Management

Information risks must be identified, assessed, and mitigated throughout the appointment to ensure successful information delivery.`,

    bestPractices: [
      'Identify information-specific risks (data loss, incompatibility, delays)',
      'Assess impact (High/Medium/Low) and probability',
      'Define mitigation strategies for each risk',
      'Assign risk owners',
      'Review and update regularly',
      'Include technology, process, and people risks',
      'Link mitigations to contingency plans'
    ],

    aiPrompt: {
      system: 'You are a BIM risk management specialist focusing on information delivery risks and mitigation strategies per ISO 19650.',
      instructions: 'Generate an information risk register identifying, assessing, and mitigating risks specific to information management and BIM delivery. Include 5-7 key risks covering: data loss/corruption, software incompatibility issues, delivery schedule delays, resource/competency gaps, technology failures, coordination breakdown, and security breaches. For each risk specify: description, impact level (High/Medium/Low), probability (High/Medium/Low), mitigation strategy, risk owner role, and contingency plan. Include both technology risks and process/people risks. Use table format with pipe separators. Maximum 180 words.',
      style: 'table format, risk register tone, actionable mitigations, concise'
    },

    relatedFields: ['informationRisks', 'technologyRisks', 'riskMitigation']
  },

  taskTeamExchange: {
    description: `Define protocols for information exchange between task teams - how disciplines will share, coordinate, and approve information.

Include:
• Model federation frequency and process
• Coordination meeting schedule
• Issue resolution workflows (BCF)
• Sign-off procedures for milestones
• Real-time collaboration protocols
• Notification systems for updates`,

    iso19650: `ISO 19650-2:2018 Section 5.6 - Information Collaboration

Task teams must establish clear protocols for information exchange, coordination, issue resolution, and approval to maintain information quality and consistency.`,

    bestPractices: [
      'Define model federation frequency (weekly, bi-weekly)',
      'Establish coordination meeting rhythm',
      'Use BCF for issue tracking and resolution',
      'Define sign-off procedures at milestones',
      'Implement automated notifications for model updates',
      'Establish reference model update protocols',
      'Include clash detection and resolution workflows'
    ],

    aiPrompt: {
      system: 'You are a BIM coordination specialist focusing on interdisciplinary information exchange and collaboration protocols per ISO 19650.',
      instructions: 'Generate protocols for information exchange between task teams describing how disciplines will share, coordinate, and approve information. Include: model federation frequency and process (weekly/bi-weekly), coordination meeting schedule and agenda, issue resolution workflows using BCF format, sign-off procedures for milestone deliverables, real-time collaboration protocols, automated notification systems for model updates, reference model update procedures, and clash detection/resolution workflows. Define responsibilities for each discipline (Architecture, Structure, MEP). Use structured paragraphs organized by topic. Maximum 180 words.',
      style: 'ISO 19650 tone, structured by topic, procedural, concise'
    },

    relatedFields: ['coordinationMeetings', 'clashDetectionWorkflow', 'federationProcess']
  },

  modelReferencing3d: {
    description: `Define procedures for referencing 3D models to ensure spatial coordination and geometric consistency.

Include:
• Shared coordinate system (origin, grid, datums)
• Reference model linking protocols
• Version control for references
• Clash detection workflows
• Quality gates for reference verification`,

    iso19650: `ISO 19650-2:2018 Section 5.6 - Model Coordination

Model referencing procedures ensure all disciplines work in a common coordinate space enabling accurate spatial coordination and clash detection.`,

    bestPractices: [
      'Establish shared coordinate system from survey data',
      'Define standard origin points and level datums',
      'Implement automated reference linking through CDE',
      'Enforce version control to prevent out-of-date references',
      'Include quality checks preventing incorrect references',
      'Define reference model update notification process',
      'Test coordination in federated environment regularly'
    ],

    aiPrompt: {
      system: 'You are a BIM spatial coordination expert specializing in 3D model referencing and geometric consistency per ISO 19650.',
      instructions: 'Generate procedures for referencing 3D models to ensure spatial coordination and geometric consistency. Include: establishment of shared coordinate system from survey data (origin point, grid system, level datums), reference model linking protocols between disciplines, version control procedures to prevent out-of-date references, automated reference updates through CDE, clash detection workflows leveraging referenced models, quality gates for reference verification, and notification processes for reference model updates. Address both Revit and other BIM authoring tools. Use structured paragraphs organized by procedure type. Maximum 170 words.',
      style: 'procedural, ISO 19650 tone, structured, concise'
    },

    relatedFields: ['federationStrategy', 'clashDetectionWorkflow', 'volumeStrategy']
  }
,

  // === Migrated from legacy helpContentData.js ===
  milestoneInformation: {
      "description": "Define specific information requirements at each milestone in a detailed table format.",
      "iso19650": "ISO 19650-2:2018 Section 5.4 - Milestone Information Requirements\n\nEach milestone must have clearly defined information requirements including content, format, quality level, and acceptance criteria.",
      "bestPractices": [
          "Be specific about information required at each milestone",
          "Define format requirements (IFC, native, PDF, etc.)",
          "Specify quality level or LOD for each deliverable",
          "Include acceptance criteria",
          "Address both model and non-model information",
          "Reference review and approval requirements"
      ],
      "aiPrompt": {
          "system": "You are a BIM information requirements specialist focusing on milestone-based deliverable specification per ISO 19650.",
          "instructions": "Generate a detailed table of specific information requirements at each project milestone. Include 5-6 milestones aligned with RIBA stages (Stage 2, 3, 4, 5, 6, Handover). For each milestone specify: required deliverables (models, drawings, specifications, schedules), file formats (IFC, native Revit/Tekla, PDF, COBie), quality level/LOD (LOD 200-400), acceptance criteria, and approval requirements. Address both geometric model information and non-geometric documentation. Show progressive information development. Use table format with pipe separators. Maximum 180 words.",
          "style": "table format, milestone-led, acceptance criteria explicit, concise"
      },
      "relatedFields": [
          "keyMilestones",
          "geometricalInfo",
          "alphanumericalInfo"
      ]
  },
};
