// Executive Summary Help Content
export const executiveSummaryHelp = {
  projectContext: {
    description: `Provide the project context and overview that sets the scene for the BEP. This should explain why this BEP exists, what the project aims to achieve, and how BIM will support those aims.

Include:
• High-level project purpose and strategic objectives
• Context within client's broader portfolio or strategy
• Key stakeholders and their interests
• Project significance (regional flagship, innovation, sustainability leadership)
• How BIM enables project success
• Alignment with client's digital transformation goals`,

    iso19650: `ISO 19650-2:2018 Section 5.1.1 - Assessment and Need

The project context establishes the foundation for information requirements. It demonstrates understanding of the appointing party's business objectives and how information management supports those objectives throughout the asset lifecycle.`,

    bestPractices: [
      'Start with the "why" - explain the business case and strategic importance',
      'Connect BIM implementation to client\'s organizational goals',
      'Mention any sustainability, innovation, or certification aspirations',
      'Reference the client\'s digital maturity and information requirements',
      'Explain how this project fits within the client\'s portfolio',
      'Highlight any unique aspects that make BIM particularly valuable',
      'Keep focus on outcomes and benefits, not just processes',
      'Use language appropriate to the BEP type (proposed vs. confirmed)'
    ],

    examples: {
      'Pre-Appointment': `This BEP outlines our comprehensive approach to delivering the Greenfield Office Complex using advanced BIM methodologies. Our strategy emphasizes collaborative design coordination, data-driven decision making, and seamless information handover to support long-term facility management.

The project represents a significant investment in sustainable commercial development, aligning with the client's carbon-neutral portfolio strategy. BIM will enable early sustainability validation, lifecycle cost optimization, and creation of a digital twin supporting the client's smart building vision. This approach directly supports the client's goal of achieving 30% operational cost reduction across their estate through digital innovation.`,

      'Post-Appointment': `This BEP confirms our comprehensive approach to delivering the Greenfield Office Complex using advanced BIM methodologies in full compliance with the client's Exchange Information Requirements (EIR v2.1). Our strategy centers on collaborative design coordination, data-driven decision making, and seamless information handover to support long-term facility management.

The project serves as a flagship example of sustainable commercial development, directly supporting the client's carbon-neutral portfolio strategy. BIM implementation will validate sustainability targets at each design stage, optimize lifecycle costs, and deliver a comprehensive digital twin integrated with the client's CAFM systems. This approach is aligned with the client's digital transformation roadmap and information management maturity goals.`
    },

    commonMistakes: [
      'Being too generic - could apply to any project without customization',
      'Focusing on BIM process rather than business objectives and outcomes',
      'Not connecting to the client\'s strategic goals or requirements',
      'Missing reference to sustainability or innovation aspirations',
      'No mention of how BIM addresses project-specific challenges',
      'Overly technical language instead of business-focused narrative',
      'Failing to differentiate between proposed and confirmed language'
    ],

    aiPrompt: {
      system: 'You are a BIM business strategy consultant. Generate compelling project context that connects BIM implementation to strategic business objectives.',
      instructions: 'Generate content similar to the examples above. Explain the business case, strategic importance, and how BIM supports client objectives. Include sustainability goals, digital transformation alignment, and portfolio context. Use business-focused language connecting BIM to outcomes, not just processes. Maximum 150 words.',
      style: 'business-focused, strategic alignment, outcome-oriented, client objectives emphasis'
    },

    relatedFields: ['projectDescription', 'bimStrategy', 'strategicAlignment']
  },

  bimStrategy: {
    description: `Describe your comprehensive BIM strategy for this project. Explain how BIM will be used throughout the project lifecycle to deliver value, reduce risk, improve collaboration, and meet the client's information requirements.

Cover:
• Primary BIM objectives and goals
• Key BIM uses (clash detection, 4D/5D, energy analysis, etc.)
• Technology and software approach
• Collaboration and coordination methods
• Information management approach
• Digital twin / FM handover strategy
• How BIM reduces project risks`,

    iso19650: `ISO 19650-2:2018 Section 5.1.4 - Mobilization of Resources

The BIM strategy should demonstrate how the delivery team will mobilize information management capabilities, establish information management processes, and deliver against the Exchange Information Requirements (EIR). It must show understanding of the appointing party's information requirements.`,

    bestPractices: [
      'Link BIM uses directly to client business objectives and project goals',
      'Be specific about which BIM processes will be used and why',
      'Mention federated model approach for multi-discipline coordination',
      'Reference clash detection protocols and expected clash reduction targets',
      'Include 4D sequencing for construction planning if applicable',
      '5D cost management integration for budget control and value engineering',
      'Explain digital twin approach for FM handover and lifecycle management',
      'Reference cloud-based collaboration platforms (BIM 360, Trimble Connect, etc.)',
      'Quantify expected benefits where possible (% clash reduction, time savings)'
    ],

    examples: {
      'Commercial Building': `Our confirmed BIM strategy centres on early clash detection to eliminate design conflicts, integrated 4D/5D modelling for construction sequencing and cost control, and comprehensive digital twin creation for facilities management. We will utilize federated models across all disciplines (Architecture, Structure, MEP, Civils) with real-time collaboration through BIM 360.

Key processes include weekly clash detection reducing RFIs by 40%, 4D sequencing for complex MEP installation coordination, 5D integration enabling continuous value engineering, and LOD 350 models for fabrication. The digital twin will include all MEP systems, space data, and equipment for predictive maintenance, reducing operational costs by 25% over 5 years.`,

      'Infrastructure': `Our BIM strategy emphasizes 3D design coordination for complex junction geometries, 4D sequencing for traffic management and utilities diversions, and integrated civil/structures/drainage models for clash-free construction documentation. We will use 12d Model for road/drainage design, Tekla for structures, and Navisworks for coordination.

Key benefits include clash-free design reducing on-site variations by 60%, 4D visualization for stakeholder engagement and planning approvals, quantity extraction for accurate cost estimates, and as-built model delivery for asset management. All design data will be delivered in IFC format for the client's asset management system.`,

      'Healthcare': `Our BIM strategy addresses the complexity of live hospital operations during construction, stringent infection control requirements, and integration with existing building systems. We will implement phased coordination models, detailed MEP clash detection for medical gases and critical ventilation, and 4D sequencing coordinated with hospital operations.

Specific processes include: room-by-room coordination to LOD 350 for clinical spaces, medical equipment spatial coordination, services coordination for complex ceiling voids, and detailed handover models including all MEP systems with maintenance data for the Trust's CAFM system. Target: zero clashes in critical clinical areas before construction.`
    },

    commonMistakes: [
      'Generic statements like "We will use BIM" without specific processes',
      'No connection between BIM uses and project-specific challenges',
      'Failing to quantify expected benefits or improvements',
      'Not mentioning specific software or technology platforms to be used',
      'Omitting the digital twin / FM handover strategy',
      'No reference to level of information need (LOIN) or LOD requirements',
      'Missing coordination and clash detection protocols',
      'Not addressing how BIM reduces specific project risks'
    ],

    aiPrompt: {
      system: 'You are a BIM strategy architect. Generate comprehensive BIM strategies that connect specific processes to project goals and measurable benefits.',
      instructions: 'Generate content similar to the examples above. Include primary BIM uses (clash detection, 4D/5D, energy analysis), specific software platforms (BIM 360, Navisworks, Solibri), coordination methods (federated models, weekly clash detection), quantified targets (40% RFI reduction, LOD 350), and digital twin strategy. Use structured paragraphs with measurable outcomes. Maximum 150 words.',
      style: 'comprehensive, specific tools mentioned, quantified benefits, multi-dimensional (3D/4D/5D), digital twin focus'
    },

    relatedFields: ['bimGoals', 'primaryObjectives', 'bimUses']
  },

  keyCommitments: {
    description: `List your firm commitments and key deliverables for this project. These are the specific, measurable outcomes you will deliver using BIM processes. This section demonstrates accountability and sets clear expectations.

Include:
• ISO 19650 compliance commitment
• Specific model deliverables (federated models, LOD, frequency)
• Data deliverables (COBie, asset data, O&M information)
• 4D/5D deliverables if applicable
• Coordination and clash detection commitments
• CDE and information management commitments
• Quality assurance and validation processes
• Digital twin / FM handover commitments`,

    iso19650: `ISO 19650-2:2018 Section 5.4 - Information Delivery Planning

The delivery team must commit to specific information deliverables aligned with the project's Information Delivery Plan (IDP). These commitments should be measurable, time-bound, and directly responsive to the Exchange Information Requirements (EIR).`,

    bestPractices: [
      'Start with ISO 19650-2:2018 compliance as primary commitment',
      'Be specific and measurable - "Coordinated model every 2 weeks" not "regular models"',
      'Include LOD specifications for each project stage (RIBA 3: LOD 300, RIBA 4: LOD 350, etc.)',
      'Commit to specific clash detection frequency and resolution targets',
      'Reference COBie or other structured data format for FM handover',
      'Mention CDE implementation with role-based access and audit trails',
      'Include quality checking protocols (Solibri, Navisworks validation)',
      'State information security and data protection commitments',
      'Quantify where possible (95% clash-free, < 24hr issue resolution, etc.)'
    ],

    examples: {
      'Commercial Building': `We are committed to full ISO 19650-2:2018 compliance throughout all project phases. Key deliverables include:

• Coordinated federated models at each RIBA stage milestone (LOD 300 at Stage 3, LOD 350 at Stage 4)
• Bi-weekly clash detection with 95% clash resolution before construction
• Comprehensive COBie 2.4 data for all MEP systems and building components at handover
• 4D construction sequences for all major building elements and MEP installations
• 5D cost model integrated with design for continuous value engineering
• Complete digital twin with IoT sensor integration and equipment data
• All information delivered through BIM 360 CDE with full audit trails and version control
• Monthly model quality validation using Solibri and Navisworks`,

      'Infrastructure': `We commit to delivering the scheme in full accordance with ISO 19650-2:2018 and the client's BIM Protocol. Specific commitments include:

• Coordinated 3D design models for all disciplines (Highway, Structures, Drainage, Utilities) at each design stage
• Weekly clash detection during detailed design with clash-free issue for construction
• 4D construction programme models for stakeholder visualization and planning consent
• Quantity schedules extracted from models for all major elements (earthworks, structures, pavements)
• As-built models delivered in IFC 4 format for the client's asset management system
• Full compliance with UK BIM Framework and National Highways BIM requirements
• GIS integration for linear asset data management`,

      'Healthcare': `Our key commitments for this healthcare project include:

• Full ISO 19650-2:2018 and HBN 00-07 (Planning for a Resilient Healthcare Estate) compliance
• Room-by-room coordination models to LOD 350 for all clinical spaces
• Medical equipment spatial coordination models before procurement
• Clash-free MEP models for medical gases, critical ventilation, and electrical systems
• Detailed handover models with full COBie data for integration with the Trust's CAFM system
• O&M manuals linked to model components for maintenance planning
• Phased construction models coordinated with operational hospital constraints
• Information security compliant with NHS Data Security Standards`
    },

    commonMistakes: [
      'Vague commitments like "we will deliver high quality models"',
      'No specific LOD or level of information need mentioned',
      'Missing frequency or timing of deliverables',
      'No mention of structured data (COBie) for FM handover',
      'Omitting CDE implementation and information management',
      'Not addressing quality assurance or validation processes',
      'Failing to reference ISO 19650 or other applicable standards',
      'No quantified targets or success criteria'
    ],

    aiPrompt: {
      system: 'You are a BIM strategy architect. Generate comprehensive BIM strategies that connect specific processes to project goals and measurable benefits.',
      instructions: 'Generate content similar to the examples above. Include primary BIM uses (clash detection, 4D/5D, energy analysis), specific software platforms (BIM 360, Navisworks, Solibri), coordination methods (federated models, weekly clash detection), quantified targets (40% RFI reduction, LOD 350), and digital twin strategy. Use structured paragraphs with measurable outcomes. Maximum 150 words.',
      style: 'comprehensive, specific tools mentioned, quantified benefits, multi-dimensional (3D/4D/5D), digital twin focus'
    },

    relatedFields: ['bimStrategy', 'informationManagementResponsibilities']
  },

  keyContacts: {
    description: `List the key project contacts and their roles in a structured table format. This provides a quick reference for stakeholder communication and ensures all parties know who to contact for different aspects of the project.

Include for each contact:
• Role/Position (Project Director, BIM Manager, Lead Designer, etc.)
• Full name and professional qualifications if relevant
• Company/Organization
• Contact details (email, phone)
• Specific responsibilities or areas of authority`,

    iso19650: `ISO 19650-2:2018 Section 5.1.3 - Capability and Capacity

Clear identification of key personnel demonstrates the delivery team's organizational structure and lines of communication. This supports effective information management by establishing accountability and contact points for all stakeholders.`,

    bestPractices: [
      'Include all key decision-makers and technical leads',
      'List the Information Manager prominently',
      'Include client representatives and approving authorities',
      'Add professional qualifications for key BIM/technical roles',
      'Keep contact details current and verified',
      'Include role descriptions that clarify areas of responsibility',
      'Consider adding availability/escalation notes for critical contacts',
      'Update table whenever personnel changes occur'
    ],

    examples: {
      'Table Structure': `Role | Name | Company | Contact Details
Project Director | James Smith, CEng | ABC Developments | j.smith@abc.com / +44 7700 900123
BIM Manager | Sarah Johnson, RICS MBIM | Smith & Associates | s.johnson@smith-assoc.co.uk / +44 7700 900234
Lead Architect | Michael Chen, ARB RIBA | Smith & Associates | m.chen@smith-assoc.co.uk / +44 7700 900345
Structural Lead | David Williams, CEng MIStructE | Jones Engineering | d.williams@joneseng.co.uk / +44 7700 900456
MEP Lead | Emma Davis, CEng MCIBSE | TechServ Solutions | e.davis@techserv.co.uk / +44 7700 900567
Client Representative | Robert Brown | ABC Developments | r.brown@abc.com / +44 7700 900678`
    },

    commonMistakes: [
      'Missing the Information Manager or BIM Manager contact',
      'Not including client representatives',
      'Incomplete or outdated contact details',
      'No indication of roles or responsibilities',
      'Missing professional qualifications for technical roles',
      'Not updating when personnel change',
      'Too many contacts - focus on key decision-makers only'
    ],

    aiPrompt: {
      system: 'You are a BIM project management expert specializing in ISO 19650 organizational structures.',
      instructions: 'Generate a professional table of key project contacts for a BIM Execution Plan. Include role, name with qualifications, company, and contact details. Focus on essential decision-makers: Project Director, BIM/Information Manager, Lead Architect, Structural Lead, MEP Lead, and Client Representative. Include professional qualifications (CEng, RICS, ARB, etc.) where relevant. Maximum 150 words.',
      style: 'table format, professional, ISO 19650 tone, concise'
    },

    relatedFields: ['proposedInfoManager', 'informationManager', 'assignedTeamLeaders']
  },

  valueProposition: {
    description: `Articulate the value that your BIM approach will deliver to the client and project. This is your opportunity to sell the benefits - explain how BIM will save money, reduce risk, improve quality, accelerate delivery, and support long-term asset management.

Quantify value wherever possible:
• Cost savings through clash reduction and value engineering
• Time savings through better coordination and planning
• Quality improvements through visualization and analysis
• Risk reduction through early problem identification
• Operational benefits through digital twin and asset data
• Sustainability benefits through analysis and optimization

Make it compelling and client-focused.`,

    iso19650: `ISO 19650-1:2018 Section 5.2 - Value and Benefits

Information management processes should deliver tangible value to all project stakeholders. The value proposition demonstrates return on investment for BIM implementation and aligns with the appointing party's business case.`,

    bestPractices: [
      'Lead with quantified cost and time savings where possible',
      'Connect value to client\'s strategic objectives and pain points',
      'Include both short-term (design/construction) and long-term (operations) value',
      'Reference risk reduction and quality improvements',
      'Mention sustainability and environmental benefits',
      'Include stakeholder communication and decision-making improvements',
      'Support claims with evidence from past projects if possible',
      'Make it client-focused - "you will benefit from" not "we will deliver"',
      'Keep it concise but impactful - focus on the top 3-5 value drivers'
    ],

    examples: {
      'Commercial Building': `Our BIM approach will deliver significant value across design, construction, and operational phases:

Cost Savings: 15% reduction in construction costs through early clash detection (saving £9.75M on £65M project), eliminating costly on-site rework and programme delays. Continuous 5D value engineering will identify £2-3M of savings opportunities during design development.

Time Benefits: 25% faster design coordination through real-time federated models and cloud collaboration, compressing design programme by 8 weeks. 4D construction sequencing will optimize site logistics and MEP installation, preventing typical 3-4 week delays from coordination issues.

Quality & Risk: Virtual construction through BIM eliminates surprise clashes and buildability issues, reducing project risk and ensuring predictable delivery. Enhanced stakeholder visualization supports faster approvals and reduces design changes.

Operational Value: The digital twin will deliver 30% operational cost savings (£450K annually) through predictive maintenance, space optimization, and energy management. Structured asset data enables immediate FM system integration, avoiding 6-month manual data collection typically required.

Sustainability: Integrated energy and carbon analysis ensures net-zero operational carbon target is met, with embedded carbon reduced by 30% through informed material selection and lifecycle assessment.`,

      'Infrastructure': `Our BIM approach delivers value throughout the project lifecycle:

Risk Reduction: Clash-free design coordination between highway, structures, drainage, and utilities prevents costly on-site conflicts that typically delay infrastructure projects by 3-6 months. Early identification of constraints and clashes protects the £180M budget.

Programme Benefits: 4D construction sequencing optimizes traffic management and construction logistics, reducing overall programme by 6-8 weeks and minimizing disruption to the community. Faster delivery means earlier realization of scheme benefits.

Cost Certainty: Accurate quantity extraction from coordinated models provides reliable cost estimates (±3%), enabling better commercial management and value engineering. This typically saves 5-10% (£9-18M) through optimized design and construction planning.

Stakeholder Benefits: High-quality 3D visualization supports faster planning consent and public engagement, reducing approval timescales by 2-3 months. Environmental impact visualization demonstrates minimal impact on sensitive areas.

Asset Management: Complete as-built data in the client's asset management system enables predictive maintenance planning, lifecycle cost optimization, and integration with the strategic road network. This delivers 20-25% savings in whole-life maintenance costs.`
    },

    commonMistakes: [
      'Generic claims without quantified evidence or metrics',
      'Focusing only on BIM process rather than client value and benefits',
      'Not connecting value to client\'s specific pain points or objectives',
      'Missing long-term operational and asset management value',
      'No mention of risk reduction or quality improvements',
      'Vague savings claims like "significant cost savings" without numbers',
      'Ignoring sustainability and environmental benefits',
      'Not comparing to alternative (non-BIM) approach to show differential value'
    ],

    aiPrompt: {
      system: 'You are a BIM value consultant. Generate compelling value propositions with quantified benefits across cost, time, quality, risk, and operations.',
      instructions: 'Generate content similar to the examples above. Include quantified cost savings (% reduction, £ amounts), time benefits (weeks saved), risk reduction metrics, operational savings (annual £, % reduction), and sustainability benefits. Structure with clear categories (Cost Savings, Time Benefits, Quality & Risk, Operational Value, Sustainability). Use specific numbers and percentages. Maximum 150 words.',
      style: 'quantified metrics, multi-category structure, percentage savings, monetary values, client benefit focus'
    },

    relatedFields: ['bimStrategy', 'bimGoals', 'keyCommitments']
  }
,

  // === Migrated from legacy helpContentData.js ===
  referencedMaterial: {
      "description": "List all referenced documents, standards, and materials that inform or govern this BEP. This establishes the regulatory and contractual framework within which information will be managed.\n\nInclude:\n• Exchange Information Requirements (EIR) with version\n• Project Information Requirements (PIR)\n• Relevant ISO standards (19650, 1192, etc.)\n• Client BIM standards or protocols\n• Health & Safety information requirements\n• Industry standards (RIBA Plan of Work, NBS, etc.)\n• Contract-specific requirements",
      "iso19650": "ISO 19650-2:2018 Section 5.1.1 - Information Requirements\n\nThe BEP must reference and respond to the appointing party's Exchange Information Requirements (EIR) and any applicable standards, protocols, or information requirements that govern information management.",
      "bestPractices": [
          "Always reference the EIR with version number and date",
          "List ISO 19650-2:2018 as the primary information management standard",
          "Include relevant BS and PAS standards (BS 1192, PAS 1192-2)",
          "Reference client-specific BIM protocols or standards",
          "Mention RIBA Plan of Work 2020 if relevant",
          "Include health & safety information requirements (CDM 2015)",
          "Keep list focused - only documents that actually inform the BEP"
      ],
      "examples": {
          "Post-Appointment": "This BEP references and responds to the following documents and standards:\n\n• Exchange Information Requirements (EIR) v2.1, dated March 2024\n• Project Information Requirements (PIR) dated March 2024\n• ISO 19650-2:2018 - Organization and digitization of information (BIM)\n• BS 1192:2007+A2:2016 - Collaborative production of information\n• PAS 1192-2:2013 - Information management (specification for capital/delivery)\n• Client BIM Standards Manual v3.0\n• RIBA Plan of Work 2020 - Stage definitions and deliverables\n• CDM Regulations 2015 - Health & Safety Information Requirements\n• NBS BIM Toolkit guidance\n• Project-specific Quality Plan dated February 2024"
      },
      "commonMistakes": [
          "Not referencing the EIR or PIR",
          "Missing version numbers and dates for key documents",
          "Not mentioning ISO 19650 standards",
          "Including too many irrelevant documents",
          "Not updating when referenced documents are revised"
      ],
      "aiPrompt": {
          "system": "You are a BIM documentation specialist. Generate concise reference lists of governing documents and standards for a BEP.",
          "instructions": "Generate content similar to the example above. Provide a bullet list of referenced documents including EIR (with version/date), PIR, ISO 19650 series (as applicable), BS/PAS guidance where relevant, client BIM standards/protocols, RIBA/NBS references (if applicable), and H&S information requirements. Keep it focused on documents that govern information management for this project. Maximum 140 words.",
          "style": "bullet list, version/date included, formal citations, ISO 19650-aligned"
      },
      "relatedFields": [
          "projectContext",
          "informationManagementResponsibilities"
      ]
  },
};
