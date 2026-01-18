// Help content for BEP form fields
// This provides contextual guidance, ISO 19650 references, best practices, and examples

const HELP_CONTENT = {
  // ====================================================================
  // PROJECT INFORMATION FIELDS
  // ====================================================================

  projectDescription: {
    description: `Provide a comprehensive project overview including scope, scale, complexity, and key objectives. This should give readers a clear understanding of what the project entails, its unique characteristics, and why BIM is essential for its delivery.

Include:
• Project type and primary use
• Physical scale (area, height, number of buildings)
• Project value/budget range
• Key sustainability or certification targets (LEED, BREEAM, WELL, etc.)
• Unique technical or design challenges
• Main stakeholder requirements and expectations
• Site constraints or existing conditions that impact delivery`,

    iso19650: `ISO 19650-2:2018 Section 5.1.2 - Project Information

The standard requires clear project definition including information about the appointing party's requirements, project objectives, constraints, and any specific information management requirements. This helps all parties understand the context for information delivery.`,

    bestPractices: [
      'Start with project type and scale to set context immediately',
      'Quantify wherever possible (area, capacity, budget range, timeline)',
      'Explicitly mention sustainability targets (BREEAM, LEED, WELL, PassivHaus)',
      'Highlight complexity factors that justify the BIM approach',
      'Reference the client\'s strategic objectives when known',
      'Include site context if it impacts design or construction approach',
      'Mention number of disciplines for complex multi-disciplinary projects',
      'Keep it concise but comprehensive (200-400 words is ideal)'
    ],

    examples: {
      'Commercial Building': `A modern 15-storey Grade A office complex with retail on the ground floor, located in central Manchester. The 45,000m² development will accommodate 800+ office workers with flexible workspace layouts, integrated smart building technologies, and targeting BREEAM Excellent certification.

The project includes basement parking for 150 vehicles, rooftop plant areas, and a double-height reception atrium. Key challenges include integration with adjacent heritage buildings, complex MEP systems for smart building features, and achieving net-zero operational carbon. Budget: £65M. Timeline: 32 months (Design to Handover).`,

      'Infrastructure': `A 12km dual-carriageway bypass including three major grade-separated junctions, two river crossings, and associated drainage infrastructure serving the town of Westfield. The scheme will relieve congestion in the town centre and support planned residential development of 5,000 new homes.

Key technical challenges include environmentally sensitive river crossings, complex utilities diversions, and coordination with operational rail infrastructure. The project requires extensive stakeholder engagement with Network Rail, Environment Agency, and local communities. Budget: £180M. Programme: 48 months including 18-month design phase.`,

      'Healthcare': `Extension and refurbishment of St. Mary's District Hospital adding 200-bed capacity across a new 5-storey clinical block. The development includes 4 operating theatres, diagnostic imaging suite, intensive care unit, and supporting clinical facilities, all requiring integration with existing operational hospital systems.

Critical requirements include stringent infection control (HBN 04-01 compliance), complex MEP systems for medical gases and critical ventilation, maintaining hospital operations throughout construction, and achieving BREEAM Healthcare Excellent. Budget: £85M. Phased delivery over 36 months with operational hospital constraints.`,

      'Residential': `Mixed-use development of 280 residential units across two towers (18 and 22 storeys) with ground floor retail and 2 levels of basement parking. Located on a brownfield site in East London, targeting 35% affordable housing and BREEAM Communities Excellent.

The scheme includes a mix of 1, 2, and 3-bed apartments, communal amenity spaces, and landscaped courtyard. Technical challenges include ground conditions requiring piled foundations, tall building regulations compliance, and complex MEP distribution in high-rise residential. Budget: £92M. Programme: 30 months.`,

      'Education': `New-build secondary academy for 1,200 students (11-18 years) on a greenfield site including sports facilities, performing arts centre, and science laboratories. The school is designed to PassivHaus standards with natural ventilation strategy, achieving net-zero carbon in operation.

Facilities include 60 teaching spaces, assembly hall for 400, double sports hall, 3G sports pitch, and extensive STEM facilities. The project must achieve BREEAM Excellent and meet strict DfE output specifications. Budget: £35M. Programme: 24 months including summer handover for September opening.`
    },

    commonMistakes: [
      'Being too vague or generic - "A large office building" tells readers nothing useful',
      'Omitting key project metrics (size, value, timeline) that provide context',
      'No mention of sustainability targets or environmental certifications',
      'Failing to highlight what makes the project complex or challenging',
      'Not connecting project characteristics to BIM requirements',
      'Too much unnecessary detail about architectural aesthetics',
      'Missing stakeholder context or client strategic objectives',
      'Not mentioning site constraints that impact delivery approach'
    ],

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are a BIM project planning expert. Generate comprehensive project descriptions that establish clear context for BIM execution.',
      instructions: 'Generate content similar to the examples above. Include project type, quantified metrics (area in m², budget, timeline), sustainability targets (BREEAM/LEED), key technical challenges, and site constraints. Use structured paragraphs covering scope, scale, complexity, and stakeholder requirements. Maximum 150 words.',
      style: 'comprehensive, quantified metrics, sustainability-focused, structured paragraphs, specific technical challenges'
    },

    relatedFields: ['projectType', 'estimatedBudget', 'confirmedBudget', 'proposedTimeline', 'confirmedTimeline']
  },

  // ====================================================================

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

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are a BIM strategy architect. Generate comprehensive BIM strategies that connect specific processes to project goals and measurable benefits.',
      instructions: 'Generate content similar to the examples above. Include primary BIM uses (clash detection, 4D/5D, energy analysis), specific software platforms (BIM 360, Navisworks, Solibri), coordination methods (federated models, weekly clash detection), quantified targets (40% RFI reduction, LOD 350), and digital twin strategy. Use structured paragraphs with measurable outcomes. Maximum 150 words.',
      style: 'comprehensive, specific tools mentioned, quantified benefits, multi-dimensional (3D/4D/5D), digital twin focus'
    },

    relatedFields: ['bimGoals', 'primaryObjectives', 'bimUses']
  },

  // ====================================================================

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

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are a BIM strategy architect. Generate comprehensive BIM strategies that connect specific processes to project goals and measurable benefits.',
      instructions: 'Generate content similar to the examples above. Include primary BIM uses (clash detection, 4D/5D, energy analysis), specific software platforms (BIM 360, Navisworks, Solibri), coordination methods (federated models, weekly clash detection), quantified targets (40% RFI reduction, LOD 350), and digital twin strategy. Use structured paragraphs with measurable outcomes. Maximum 150 words.',
      style: 'comprehensive, specific tools mentioned, quantified benefits, multi-dimensional (3D/4D/5D), digital twin focus'
    },

    relatedFields: ['bimStrategy', 'informationManagementResponsibilities']
  },

  // ====================================================================

  teamCapabilities: {
    description: `Describe your team's BIM capabilities, experience, and track record. This demonstrates that you have the right skills, certifications, and experience to deliver the project successfully using BIM.

Cover:
• Years of BIM implementation experience
• Team size and composition (BIM Manager, Coordinators, Modellers)
• Relevant certifications (ISO 19650, BIM Level 2, etc.)
• Software expertise and licenses
• Relevant project experience (similar type, scale, complexity)
• Value delivered on past projects (cost savings, clash reduction, etc.)
• Training and continuous professional development`,

    iso19650: `ISO 19650-2:2018 Section 5.1.3 - Capability and Capacity

The delivery team must demonstrate capability (skills, knowledge, certifications) and capacity (resources, availability) to meet the information management requirements. This includes evidence of past performance on similar projects.`,

    bestPractices: [
      'Lead with years of experience and total project value delivered using BIM',
      'Mention key certifications (ISO 19650 Lead, BIM Level 2, RICS, etc.)',
      'Quantify team composition (e.g., 5 BIM coordinators, 15 modellers)',
      'List core software competencies (Revit, Navisworks, Solibri, etc.)',
      'Reference 2-3 recent similar projects with measurable outcomes',
      'Include value delivered (% cost savings, clash reduction, time saved)',
      'Mention any awards or recognition for BIM excellence',
      'Reference continuous training and development programs',
      'Highlight unique capabilities (Dynamo scripting, computational design, etc.)'
    ],

    examples: {
      'Commercial Building': `Our multidisciplinary team brings 15+ years of BIM implementation experience across £500M+ of commercial projects. Key capabilities include:

• ISO 19650-2:2018 certified information management with dedicated BIM Manager (RICS Certified)
• Team of 25+ including 5 BIM Coordinators and 20 discipline modellers
• Advanced parametric design using Revit and Grasshopper for complex facade geometries
• Integrated MEP coordination expertise delivering 95% clash-free models
• 4D/5D modelling using Synchro and CostX for programme and cost integration
• Digital twin development with IoT integration experience
• Software licenses: Autodesk Construction Cloud (50 users), Solibri, Navisworks, Dynamo

Recent projects include the award-winning Tech Hub (£25M, 2022 - 40% clash reduction, 3-month programme saving) and Riverside Commercial Centre (£18M, 2023 - BREEAM Excellent achieved through BIM-enabled sustainability analysis).`,

      'Infrastructure': `Our infrastructure BIM team has delivered £2B+ of major projects over 12 years, specializing in highways, structures, and rail infrastructure. Core capabilities:

• Certified to PAS 1192-2:2013 and ISO 19650-2:2018 with dedicated Information Manager
• Team of 30+ including highway designers, structural engineers, and BIM specialists
• Expertise in 12d Model, Civil 3D, Tekla Structures, and Bentley systems
• Track record of delivering complex junction geometries and bridge structures
• 4D planning expertise for traffic management and construction sequencing
• GIS integration for linear asset management and handover
• Experience with Network Rail, Highways England, and HS2 BIM requirements

Recent schemes: A45 Junction Improvement (£85M, 2022 - 8 months early through 4D optimization) and Westside Rail Bridge (£32M, 2023 - zero site clashes through detailed coordination).`,

      'Healthcare': `Specialized healthcare BIM team with 10+ years NHS project experience totaling £350M+ of hospital and healthcare facilities. Key strengths:

• ISO 19650 and HBN 00-07 compliance with healthcare-sector BIM Manager
• Team of 18 including medical planning specialists and MEP coordinators
• Deep expertise in HBN/HTM standards and healthcare-specific requirements
• Medical equipment coordination and infection control modeling
• Complex MEP systems for medical gases, critical ventilation, and electrical resilience
• Experience maintaining operational hospitals during construction through phased BIM
• CAFM integration expertise for NHS Trusts

Recent projects: St. James's Hospital Extension (£55M, 2022 - full digital twin delivered), Regional Diagnostic Centre (£28M, 2023 - zero clashes in clinical areas, COBie handover 2 weeks early).`
    },

    commonMistakes: [
      'Generic claims without quantifiable evidence or metrics',
      'Not mentioning specific certifications or professional qualifications',
      'Missing team size and composition details',
      'No reference to past project examples with measurable outcomes',
      'Failing to link capabilities to project-specific requirements',
      'Not mentioning software licenses or technical infrastructure',
      'Omitting continuous development and training programs',
      'No differentiation - sounds like every other BIM team'
    ],

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are a BIM team capability consultant. Generate compelling team credentials with quantified experience, certifications, and proven track records.',
      instructions: 'Generate content similar to the examples above. Include years of experience, total project value (£M+), team size (coordinators, modellers), certifications (ISO 19650, RICS), software competencies (Revit, Navisworks, Solibri), and 2-3 recent projects with measurable outcomes (% clash reduction, time/cost savings). Use bullet points for capabilities and project examples. Maximum 150 words.',
      style: 'quantified experience, certifications prominent, software expertise, proven outcomes, project examples with metrics'
    },

    relatedFields: ['proposedInfoManager', 'informationManager', 'proposedResourceAllocation', 'proposedMobilizationPlan', 'trackRecordProjects']
  },

  trackRecordProjects: {
    description: `Document your team's track record by listing similar projects successfully delivered using BIM. This provides tangible evidence of your capability and capacity to deliver the current project, demonstrating proven experience with comparable scope, scale, and complexity.

Include for each project:
• **Project Name**: Clear project identifier
• **Value**: Project budget/contract value
• **Completion Date**: When the project was completed
• **Project Type**: Building type or infrastructure category
• **Our Role**: Your organization's role (Lead Designer, BIM Coordinator, etc.)
• **Key BIM Achievements**: Specific measurable outcomes (clash reduction %, time savings, cost optimization, etc.)

This demonstrates your proven track record and de-risks your appointment.`,

    iso19650: `ISO 19650-2:2018 Section 5.1.3 - Capability and Capacity

The standard requires demonstration of capability through evidence of past performance on similar projects. Track record with quantifiable outcomes provides compelling proof of your team's ability to deliver information management requirements successfully.

**Pre-Appointment Context**: In tender responses, track record demonstrates to the appointing party that your proposed team has successfully delivered comparable projects.

**Post-Appointment Context**: Confirmed track record provides the client with confidence and establishes benchmarks for expected performance on the current project.`,

    bestPractices: [
      'Select 3-5 most relevant projects that match current project type/scale',
      'Prioritize recent projects (last 3-5 years) to show current capability',
      'Include project values to demonstrate experience at appropriate scale',
      'Quantify BIM achievements with specific metrics (% clash reduction, time saved)',
      'Highlight similar technical challenges overcome (tall buildings, complex MEP, etc.)',
      'Include projects with same BIM standards/protocols when possible',
      'Mention awards, certifications, or client testimonials where applicable',
      'Show progression and evolution of BIM capabilities over time',
      'Reference projects with similar procurement routes if relevant'
    ],

    examples: {
      'Commercial Building': `**Riverside Commercial Centre** | £18M | Oct 2023 | Commercial Office | Lead Appointed Party | 95% clash-free coordination, BREEAM Excellent achieved through BIM energy analysis, 3-month programme acceleration through 4D sequencing, full COBie handover 2 weeks early

**Tech Hub Innovation Campus** | £25M | Mar 2022 | Mixed-Use Commercial | BIM Coordinator | 40% RFI reduction vs. baseline, £1.2M cost savings through early clash detection, integrated digital twin for FM with IoT sensors, Winner: BIM Excellence Award 2022

**City Quarter Office Tower** | £42M | Jul 2021 | High-Rise Office | Lead Designer | LOD 400 coordination across 8 disciplines, complex curtain wall parametric modeling, 60% reduction in site coordination issues, successful handover to client FM system`,

      'Infrastructure': `**A45 Junction Improvement Scheme** | £85M | Jun 2022 | Highway Infrastructure | Lead Designer | 8-month early completion through 4D optimization, zero on-site clashes, GIS-integrated asset data handover, Network Rail coordination without incidents

**Westside Rail Bridge Replacement** | £32M | Nov 2023 | Railway Bridge | BIM Coordination Lead | Complex Tekla/Civil3D integration, possession window optimization saving 3 weekends, as-built accuracy ±5mm verified, IFC handover to Network Rail standards

**River Valley Bypass** | £124M | Apr 2021 | Major Highway | Task Team Leader - Structures | 12km linear BIM coordination, 3 major bridges delivered clash-free, environmental constraints modeled and mitigated, EA approval accelerated by 6 weeks`,

      'Healthcare': `**St. James's Hospital Extension** | £55M | Sep 2022 | Healthcare - Acute | Lead Appointed Party | Full digital twin delivered for CAFM integration, HBN 04-01 infection control compliance verified, medical equipment clash detection, zero clinical area rework, operational hospital maintained throughout

**Regional Diagnostic Centre** | £28M | Dec 2023 | Healthcare - Diagnostics | BIM Manager | Complex medical gases and imaging equipment coordination, zero clashes in clinical zones, COBie handover 2 weeks early, radiation shielding verification through BIM, HTM compliance validation

**Community Health Hub** | £12M | May 2021 | Healthcare - Primary Care | Design Coordination | PassivHaus standard achieved through integrated energy modeling, natural ventilation CFD analysis, accessibility compliance verification, BREEAM Healthcare Excellent`
    },

    commonMistakes: [
      'Listing projects without quantifiable BIM achievements or outcomes',
      'Including projects too old (>5 years) that don\'t reflect current capabilities',
      'No connection between listed projects and current project requirements',
      'Missing key project details (value, completion date, specific role)',
      'Generic descriptions like "successful project delivery" without metrics',
      'Inflating your role or claiming credit for others\' achievements',
      'Listing too many projects (aim for 3-5 most relevant)',
      'Not highlighting similar technical challenges or complexity factors'
    ],

    aiPrompt: {
      system: 'You are a BIM project experience consultant. Generate compelling track record entries with specific, quantifiable BIM achievements that demonstrate proven capability.',
      instructions: 'Generate 3-5 project track record entries. Each should include: Project Name, Value (£M), Completion Date (recent 2-5 years), Project Type, Role (Lead Designer/BIM Coordinator/etc.), and Key BIM Achievements with specific metrics (% clash reduction, time/cost savings, quality improvements, awards). Make achievements realistic and specific to the project type. Maximum 200 words total.',
      style: 'quantified achievements, specific metrics, recent projects, professional, compelling evidence'
    },

    relatedFields: ['teamCapabilities', 'proposedResourceAllocation', 'bimStrategy']
  },

  eirComplianceMatrix: {
    description: `Demonstrate how your proposed approach addresses each requirement in the client's Exchange Information Requirements (EIR). This matrix provides a systematic mapping between EIR clauses and your BEP response, showing compliance and where to find supporting evidence.

For each EIR requirement, specify:
• **EIR Requirement**: Direct quote or summary of the specific EIR clause/requirement
• **Our Proposed Response**: How you will meet this requirement (approach, methodology, deliverables)
• **Evidence/Experience**: Proof of capability (past projects, certifications, team expertise)
• **BEP Section Reference**: Where in this BEP the detailed response can be found (e.g., "Section 8.2 - Software Requirements")

This demonstrates your thorough understanding of client requirements and de-risks your tender by showing full compliance.`,

    iso19650: `ISO 19650-2:2018 Section 5.1.2 - Exchange Information Requirements (EIR)

The appointing party's EIR defines what information is required, when, and to what level of detail. The pre-appointment BEP must demonstrate the prospective delivery team's understanding and ability to meet these requirements.

**Section 5.1.4 - Mobilization**: The BEP should explain how the proposed team will mobilize resources and establish processes to fulfill the EIR.

The EIR Compliance Matrix provides structured evidence that each requirement has been considered and addressed, reducing procurement risk and demonstrating tender quality.`,

    bestPractices: [
      'Extract every requirement from the EIR document systematically',
      'Group requirements by category (technical, process, deliverables, standards)',
      'Provide specific, actionable responses - avoid generic statements',
      'Reference concrete evidence (certifications, past projects, procedures)',
      'Cross-reference to specific BEP sections for detailed explanations',
      'Highlight where you exceed requirements or offer added value',
      'Be honest if you need to acquire capability - explain mitigation plan',
      'Use consistent terminology from the EIR document',
      'Include page/section numbers from EIR for traceability',
      'Have matrix reviewed by senior BIM manager and commercial lead'
    ],

    examples: {
      'Compliance Matrix Example': `**EIR Requirement**: "All models shall achieve Level 2 BIM maturity with BS 1192:2007 compliance and federated coordination models delivered biweekly"

**Our Proposed Response**: We will deliver Level 2 BIM with full BS 1192 compliance using disciplined naming conventions and CDE workflows. Federated models will be published every Friday with automated clash detection reports generated through Navisworks Manage.

**Evidence/Experience**: Our team has delivered 25+ Level 2 BIM projects totaling £400M+ over 5 years. All team members are certified to BS 1192. Recent Riverside Centre project (£18M) achieved 95% clash-free coordination through biweekly federation.

**BEP Section Reference**: Section 7 (CDE Strategy), Section 8.1 (BIM Software - Navisworks), Section 9.2 (Naming Conventions per BS 1192), Section 13.2 (Clash Detection Workflow)

---

**EIR Requirement**: "COBie data drops required at Stage 4 (Technical Design) and Stage 6 (Handover) per UK BIM Framework"

**Our Proposed Response**: COBie 2.4 UK datasets will be delivered at each milestone using Autodesk COBie Extension for Revit. Stage 4 drop will include all permanent equipment with specifications; Stage 6 will include as-built verification, commissioning data, and O&M manuals.

**Evidence/Experience**: Delivered COBie handovers on 12 projects including St. James's Hospital (£55M, 2022) where COBie data was delivered 2 weeks early and validated against client CAFM system with zero rework.

**BEP Section Reference**: Section 5.3 (Alphanumerical Information Requirements), Section 6.1 (Key Milestones), Appendix B (COBie Data Requirements)`
    },

    commonMistakes: [
      'Generic responses like "We will comply" without explaining how',
      'Missing EIR requirements - not comprehensive enough',
      'No evidence or proof of capability to deliver the response',
      'Failing to cross-reference to detailed BEP sections',
      'Copying EIR text without demonstrating understanding',
      'Not addressing difficult requirements or capability gaps honestly',
      'Missing section numbers from EIR for traceability',
      'No differentiation - could apply to any project/any team'
    ],

    aiPrompt: {
      system: 'You are an ISO 19650 compliance expert specializing in EIR response development for BIM tenders.',
      instructions: 'Generate 3-4 EIR compliance matrix entries. Each entry should include: EIR Requirement (specific technical/process requirement), Our Proposed Response (detailed approach), Evidence/Experience (past projects, certifications), and BEP Section Reference (cross-references). Make requirements realistic (software, standards, deliverables, data formats) and responses specific with concrete evidence. Maximum 200 words total.',
      style: 'systematic, evidence-based, cross-referenced, ISO 19650-compliant, professional'
    },

    relatedFields: ['bimStrategy', 'trackRecordProjects', 'teamCapabilities', 'proposedMobilizationPlan']
  },

  proposedResourceAllocation: {
    description: `Define your proposed resource allocation with detailed capability and capacity assessments for each role. This demonstrates your team's ability to meet the client's Exchange Information Requirements (EIRs) if appointed, per ISO 19650-2 clauses 5.3.3–5.3.5.

For each proposed resource, specify:
• **Role**: Specific position (e.g., Senior BIM Coordinator, Discipline BIM Modeler)
• **Proposed Personnel**: Names or descriptions of team members you will assign
• **Key Competencies/Experience**: Relevant skills, certifications (ISO 19650, BIM tools), years of experience
• **Anticipated Weekly Allocation (Hours)**: Expected time commitment per week
• **Software/Hardware Requirements**: Tools and infrastructure you will deploy
• **Notes**: Additional information on responsibilities, training plans, or interoperability approaches

This demonstrates your capability evaluation and capacity planning as part of your tender response.`,

    iso19650: `ISO 19650-2:2018 Multiple Clauses (Pre-Appointment Context):

**Section 5.1.3 - Capacity and Capability**: Proposed delivery team must demonstrate sufficient capability (skills, certifications) and capacity (people, time, resources) to deliver information requirements.

**Section 5.3.3 - Task Team Assessment**: Assessment of each proposed task team's capability and capacity to fulfill information delivery obligations.

**Section 5.3.4 - Capability Evaluation**: Proposed team skills in BIM tools, standards compliance, information security, and collaborative working.

Resource allocation proposal should align with anticipated MIDP schedule and demonstrate readiness for mobilization upon appointment.`,

    bestPractices: [
      'Include all key information management roles in your proposal',
      'Highlight ISO 19650 certifications and BIM tool proficiencies',
      'Quantify anticipated time allocation using hours or FTE',
      'Detail software/tools you will deploy (with versions)',
      'Address information security capabilities and training',
      'Show alignment with anticipated project phases and EIRs',
      'Include proposed interoperability testing approaches',
      'Demonstrate access to specialist resources if needed',
      'Show scalability for different project phases',
      'Reference similar projects where team has succeeded'
    ],

    examples: {
      'Tender Response Example': `Our proposed resource allocation demonstrates capability and capacity to deliver all EIR requirements:

**Senior BIM Coordinator**: John Doe (15+ years BIM federation; ISO 19650-certified; Expert clash detection) - 40 hrs/week - Revit 2024, Navisworks, BIM 360 on high-spec workstations.

**Structural Modelers**: Team of 3 led by Alex Kim (8 years Revit Structure) - 120 hrs/week total - Revit 2024, IFC 4 export capability tested.

**Information Manager**: Sarah Johnson (ISO 19650 Lead Assessor; 10+ years CDE management) - 20 hrs/week - BIM 360 platform with audit tools.

All personnel are ISO 19650 trained with information security certification. Interoperability verified through IFC testing on similar projects (Riverside Centre, Tech Hub). Capacity scalable to 50+ FTE if needed during peak design stages.`
    },

    commonMistakes: [
      'Not naming key personnel or providing credentials',
      'Omitting software versions and hardware specs',
      'No mention of certifications or training',
      'Missing time allocation quantification',
      'Not addressing information security capabilities',
      'Failing to show alignment with EIRs',
      'No evidence of past successful resource deployment'
    ],

    aiPrompt: {
      system: 'You are a BIM resource planning expert specializing in capability and capacity assessment per ISO 19650.',
      instructions: 'Generate a detailed resource allocation table for a BEP tender response. Include role, proposed personnel with qualifications, key competencies, weekly hours allocation, and software/hardware requirements. Focus on demonstrating capability (skills, certifications) and capacity (time, resources). Include ISO 19650 certifications and specific BIM tools. Maximum 150 words.',
      style: 'professional, ISO 19650-aligned, structured, concise'
    },

    relatedFields: ['proposedMobilizationPlan', 'teamCapabilities', 'proposedTeamLeaders', 'proposedInfoManager']
  },

  proposedMobilizationPlan: {
    description: `Outline your proposed mobilization plan showing how you will onboard, equip, and verify your team's capability upon appointment. This demonstrates your readiness and planning for ISO 19650-2 clauses 5.3.5 (mobilization) and 5.5.1-5.5.3 (resource setup).

Include in your proposal:
• **Phased Timeline**: Week-by-week mobilization schedule post-appointment
• **Onboarding & Training**: ISO 19650 training, CDE workflows, information security
• **IT Infrastructure**: Software licensing plans, hardware provisioning approach
• **Capability Verification**: How you will test and verify readiness (pilot models, testing)
• **Interoperability Testing**: Your approach to IFC exports, data integrity checks
• **Risk Mitigation**: How you will address potential capacity or capability risks

This shows the client you have a clear, detailed plan to be production-ready quickly after appointment.`,

    iso19650: `ISO 19650-2:2018 Multiple Clauses (Pre-Appointment Context):

**Section 5.3.5 - Mobilization**: Proposed plan for mobilizing the delivery team upon appointment, ensuring readiness for information production.

**Section 5.3.6 - Risk Management**: Identification of potential capacity/capability risks with proposed mitigation strategies.

**Section 5.5.1-5.5.3 - Resource Setup**: Proposed approach to establishing IT infrastructure, software, and testing workflows before production begins.`,

    bestPractices: [
      'Provide a clear phased timeline (e.g., 3-week mobilization)',
      'Show you understand ISO 19650 training requirements',
      'Demonstrate readiness with licensed software and infrastructure',
      'Propose specific capability verification activities',
      'Address interoperability testing proactively',
      'Identify potential risks and your mitigation plans',
      'Show you can mobilize quickly post-appointment',
      'Reference successful mobilizations on past projects',
      'Align timeline with anticipated project start'
    ],

    examples: {
      'Tender Mobilization Proposal': `Upon appointment, we propose a 3-week mobilization plan:

**Week 1:** Team onboarding, ISO 19650-2 training (2-day workshop), information security briefings, CDE access provisioning, EIR review sessions.

**Week 2:** IT setup - Revit 2024/Navisworks licensing activation, workstation configuration, BIM 360 platform setup, cloud storage, VPN for remote teams.

**Week 3:** Capability verification via pilot architectural model demonstrating federation, clash detection, IFC export quality, and CDE submission workflows per EIRs.

**Risk Mitigation:** We have identified risks (IT connectivity, specialist availability) and have contingency plans including backup consultants, alternative connectivity (4G hotspots), and floating software licenses. Our track record shows 100% on-time mobilization on last 5 projects.`,

      'Concise Proposal': `We will mobilize within 3 weeks post-appointment: Week 1 - Team onboarding and ISO 19650 training; Week 2 - IT infrastructure and software setup; Week 3 - Capability verification through pilot models and interoperability testing. Risks (capacity, IT) mitigated via specialist consultant access and contingency resources. Proven approach delivered successfully on Tech Hub and Riverside Centre projects.`
    },

    commonMistakes: [
      'No specific timeline or phasing',
      'Missing training and onboarding elements',
      'Not addressing IT infrastructure setup',
      'No capability verification or testing plan',
      'Failing to identify and mitigate risks',
      'Too vague - not demonstrating real planning',
      'Not referencing past successful mobilizations'
    ],

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are a BIM mobilization planning expert. Generate detailed, phased mobilization plans demonstrating readiness and capability verification.',
      instructions: 'Generate content similar to the examples above. Use 3-week phased structure: Week 1 (onboarding, ISO 19650 training), Week 2 (IT setup, software licensing, BIM 360/CDE configuration), Week 3 (pilot models, capability verification, IFC testing). Include risk mitigation with specific contingencies. Use structured format with clear phases and actionable items. Maximum 150 words.',
      style: 'phased timeline (3 weeks), structured approach, capability verification, risk mitigation, actionable steps'
    },

    relatedFields: ['proposedResourceAllocation', 'teamCapabilities', 'proposedBimGoals']
  },

  // ====================================================================

  bimGoals: {
    description: `Define the overarching BIM goals for this project. These are the high-level objectives that BIM will help achieve - they should align with the client's business objectives and project success criteria.

Typical BIM goals include:
• Improve design coordination and reduce conflicts
• Enhance construction efficiency and reduce waste
• Enable accurate cost forecasting and value engineering
• Support sustainability and environmental targets
• Facilitate asset management and operational efficiency
• Reduce project risks and improve predictability
• Enable better stakeholder communication and engagement

Make goals SMART: Specific, Measurable, Achievable, Relevant, Time-bound.`,

    iso19650: `ISO 19650-2:2018 Section 5.1.1 - Assessment and Need

BIM goals should be established based on the appointing party's information requirements and the project's business objectives. They provide the framework for defining BIM uses and information exchange requirements.`,

    bestPractices: [
      'Align BIM goals with client business objectives (cost, quality, time, sustainability)',
      'Make goals measurable with quantified targets (reduce clashes by 40%, etc.)',
      'Include both design phase and construction/FM lifecycle goals',
      'Reference sustainability targets (carbon reduction, energy performance)',
      'Connect goals to risk reduction and quality improvement',
      'Mention stakeholder communication and approval processes',
      'Include digital twin / asset management goals for long-term value',
      'State goals that address project-specific challenges',
      'Keep to 3-5 primary goals - avoid laundry lists'
    ],

    examples: {
      'Commercial Building': `The BIM goals for this project are to:

1. Enhance design coordination through rigorous clash detection, reducing RFIs by 40% and eliminating on-site design conflicts that typically delay programme by 3-4 weeks

2. Improve construction sequencing through integrated 4D modeling, resulting in 20% schedule compression and optimized site logistics for the constrained urban site

3. Enable accurate cost forecasting through 5D integration, achieving ±2% budget variance and supporting continuous value engineering throughout design development

4. Support net-zero carbon targets through integrated energy analysis and embedded carbon calculations, ensuring BREEAM Excellent certification

5. Deliver comprehensive digital asset information for lifecycle management, supporting 25% reduction in operational costs over the first 5 years through predictive maintenance and space optimization`,

      'Infrastructure': `Our BIM goals for this bypass scheme are:

1. Eliminate design coordination conflicts between highway, structures, drainage, and utilities disciplines through federated model coordination, preventing costly on-site clashes

2. Optimize construction programme through 4D sequencing, reducing traffic management impacts by 30% and enabling faster delivery of benefits to the community

3. Enable accurate quantity extraction and cost control, maintaining budget certainty and supporting value engineering through design development

4. Support environmental consent through visualization and 3D analysis, demonstrating minimal impact on sensitive river crossings and protected species habitats

5. Deliver complete as-built asset information for the highway authority's asset management system, enabling predictive maintenance and lifecycle cost optimization`
    },

    commonMistakes: [
      'Vague goals like "improve collaboration" without measurable outcomes',
      'Not connecting BIM goals to client business objectives',
      'Missing quantified targets or success criteria',
      'Focusing only on design phase, ignoring construction and FM',
      'Not addressing project-specific challenges or constraints',
      'Too many goals - dilutes focus (keep to 3-5 primary goals)',
      'Goals that aren\'t actually achievable through BIM processes',
      'No connection to sustainability or environmental targets'
    ],

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are a BIM goals strategist. Generate SMART BIM goals aligned with client business objectives and measurable project outcomes.',
      instructions: 'Generate content similar to the examples above. Create 3-5 numbered goals covering: design coordination (40% RFI reduction, clash elimination), construction optimization (4D sequencing, 20% schedule compression), cost control (5D integration, ±2% budget variance), sustainability (net-zero carbon, BREEAM/LEED targets), and digital asset delivery (25% operational cost reduction). Each goal should be specific, measurable, and outcome-focused. Maximum 150 words.',
      style: 'numbered goals (3-5), SMART objectives, quantified targets, lifecycle perspective, sustainability integrated'
    },

    relatedFields: ['bimStrategy', 'primaryObjectives', 'bimUses']
  },

  // ====================================================================

  primaryObjectives: {
    description: `State the primary objectives that will be achieved through BIM implementation. These are the specific, actionable outcomes that support the overarching BIM goals.

Objectives should be concrete and tactical, such as:
• Clash-free design coordination for MEP systems
• 4D construction sequencing for complex areas
• Accurate quantity take-off for cost control
• Energy analysis to meet performance targets
• COBie data for FM handover
• Virtual reality walkthroughs for client approvals
• Safety planning through 4D visualization

Be specific about which BIM processes will be used to achieve each objective.`,

    iso19650: `ISO 19650-2:2018 Section 5.1.6 - Collaborative Production of Information

Primary objectives should demonstrate how the delivery team will collaboratively produce, manage, and exchange information to meet the project's information requirements. They translate high-level goals into specific delivery activities.`,

    bestPractices: [
      'Make objectives specific and actionable - state exactly what will be done',
      'Link each objective to a specific BIM process or use case',
      'Include objectives across the full project lifecycle (design, construction, handover)',
      'Reference quality standards and acceptance criteria',
      'Mention coordination frequency (weekly clash detection, bi-weekly coordination)',
      'Include data and information deliverables (COBie, asset data, IFC exports)',
      'Address stakeholder communication and approval processes',
      'Specify software tools that will be used for each objective',
      'Keep objectives aligned with project priorities and constraints'
    ],

    examples: {
      'Commercial Building': `Primary objectives include:

1. Eliminate design conflicts before construction through rigorous weekly clash detection protocols, achieving 95% clash-free models before tender with < 24hr clash resolution SLA

2. Optimize building performance through integrated energy modeling and CFD analysis, ensuring compliance with net-zero carbon targets and validating passive design strategies

3. Enable efficient construction through accurate quantity extraction and 4D sequencing models, supporting just-in-time procurement and optimized site logistics for constrained urban site

4. Support sustainability targets through embedded carbon analysis and material lifecycle assessment, enabling informed material selections that reduce whole-life carbon by 30%

5. Deliver comprehensive digital twin with structured asset data (COBie 2.4), equipment specifications, and O&M information for seamless FM integration and predictive maintenance`,

      'Healthcare': `Primary objectives for this hospital extension:

1. Achieve zero clashes in critical clinical areas through room-by-room coordination to LOD 350, with specific focus on medical gases, critical ventilation, and ceiling void coordination

2. Coordinate medical equipment spatially with all building services before procurement, ensuring adequate clearances, power supplies, and servicing access for all clinical equipment

3. Validate infection control design through airflow analysis and room pressure validation, ensuring compliance with HBN 04-01 and achieving required air change rates

4. Support phased construction planning through 4D models coordinated with operational hospital constraints, minimizing disruption to live clinical services

5. Deliver complete asset data integrated with the Trust's CAFM system, including all MEP systems, medical equipment, and maintenance schedules for lifecycle management`
    },

    commonMistakes: [
      'Objectives too vague - "improve coordination" rather than specific clash detection protocols',
      'Not specifying which BIM processes or tools will be used',
      'Missing quality standards or acceptance criteria',
      'No connection to project-specific challenges',
      'Focusing only on design, ignoring construction and handover objectives',
      'Objectives that aren\'t measurable or verifiable',
      'Not addressing information deliverables (COBie, IFC, etc.)',
      'Missing objectives for stakeholder communication and approvals'
    ],

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are a BIM implementation specialist. Generate specific, actionable primary objectives linked to BIM processes and measurable outcomes.',
      instructions: 'Generate content similar to the examples above. Create 4-5 numbered objectives covering: clash detection protocols (95% clash-free, <24hr resolution), performance modeling (energy analysis, net-zero validation), construction optimization (4D sequencing, quantity extraction), sustainability analysis (embedded carbon, lifecycle assessment), and digital twin delivery (COBie 2.4, asset data). Each objective must be specific, measurable, and tool/process-linked. Maximum 150 words.',
      style: 'numbered objectives (4-5), specific processes, measurable criteria, tool-specific, lifecycle coverage'
    },

    relatedFields: ['bimGoals', 'bimStrategy', 'bimUses']
  },

  // ====================================================================

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

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are a BIM value consultant. Generate compelling value propositions with quantified benefits across cost, time, quality, risk, and operations.',
      instructions: 'Generate content similar to the examples above. Include quantified cost savings (% reduction, £ amounts), time benefits (weeks saved), risk reduction metrics, operational savings (annual £, % reduction), and sustainability benefits. Structure with clear categories (Cost Savings, Time Benefits, Quality & Risk, Operational Value, Sustainability). Use specific numbers and percentages. Maximum 150 words.',
      style: 'quantified metrics, multi-category structure, percentage savings, monetary values, client benefit focus'
    },

    relatedFields: ['bimStrategy', 'bimGoals', 'keyCommitments']
  },

  // ====================================================================

  bimUses: {
    description: `Select the specific BIM uses that will be applied on this project. BIM uses are the specific ways that BIM processes and models will be utilized to deliver value.

Common BIM uses include:
• Design Authoring (3D modeling)
• Design Reviews and Coordination
• 3D Coordination / Clash Detection
• 4D Planning and Sequencing
• 5D Cost Estimation and Control
• Energy and Sustainability Analysis
• Structural Analysis
• MEP Analysis and Coordination
• Quantity Take-off
• Virtual Reality / Visualization
• Digital Fabrication
• Asset Management / Digital Twin
• Construction Sequencing
• Safety Planning

Select uses that are appropriate for your project type, complexity, and client requirements.`,

    iso19650: `ISO 19650-2:2018 Section 5.1.1 - Information Requirements

BIM uses should be selected based on the project's information requirements and the value they deliver. Each BIM use should support specific project objectives and information delivery milestones.`,

    bestPractices: [
      'Select BIM uses that directly support your stated BIM goals and objectives',
      'Prioritize uses that address project-specific challenges',
      'Consider the full project lifecycle - design, construction, and operations',
      'For each selected use, be prepared to explain the specific process and tools',
      'Infrastructure projects: focus on 3D coordination, 4D sequencing, quantities',
      'Commercial buildings: clash detection, 4D/5D, energy analysis, digital twin',
      'Healthcare: clash detection, MEP coordination, medical equipment planning',
      'Education: design reviews, sustainability analysis, stakeholder visualization',
      'Don\'t check every box - select 6-10 uses that truly add value',
      'Be realistic about team capability and project budget'
    ],

    examples: {
      'Commercial Building': `Selected BIM Uses for this project:

✓ Design Authoring - All disciplines (Architecture, Structure, MEP)
✓ Design Reviews - Weekly coordination meetings with federated models
✓ 3D Coordination - Bi-weekly clash detection achieving 95% clash-free
✓ Clash Detection - Using Navisworks with automated clash reports
✓ 4D Planning - Construction sequencing for MEP installation and core fit-out
✓ 5D Cost Management - Integrated cost model for value engineering
✓ Energy Analysis - IES-VE for net-zero carbon validation
✓ Quantity Take-off - For all major elements and cost planning
✓ Digital Twin - Complete asset data with IoT integration for FM
✓ Virtual Reality - Client design reviews and stakeholder engagement

These uses directly support our goals of design coordination, cost control, sustainability targets, and FM handover.`,

      'Infrastructure': `Selected BIM Uses for this bypass scheme:

✓ Design Authoring - Highway (12d), Structures (Tekla), Drainage (Civil 3D)
✓ 3D Coordination - Highway/structures/utilities clash detection
✓ Design Reviews - Federated model reviews with client and stakeholders
✓ 4D Planning - Construction sequencing and traffic management
✓ Quantity Take-off - Earthworks, structures, pavements, drainage
✓ Site Analysis - Environmental impact and constraints mapping
✓ Structural Analysis - Bridge design and analysis
✓ Construction Sequencing - Phasing plans and logistics
✓ Asset Management - As-built data for highway authority systems

Focus is on coordination, quantities, sequencing, and asset data delivery.`
    },

    commonMistakes: [
      'Selecting too many BIM uses without focus or justification',
      'Choosing uses that don\'t align with project goals or challenges',
      'Not considering team capability or software availability',
      'Missing critical uses for project type (e.g., clash detection for MEP-heavy projects)',
      'No explanation of how each use will be implemented',
      'Ignoring FM / asset management uses for projects requiring handover',
      'Selecting advanced uses (VR, digital fabrication) without proper justification',
      'Not prioritizing uses based on value delivery'
    ],

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are a BIM planning expert. Select and describe appropriate BIM uses aligned to project goals and ISO 19650 information requirements.',
      instructions: 'Generate content similar to the examples above. List 6–10 BIM uses using a clear tick format (✓). For each use, include a short description of how it will be applied and the value/outcome (and name typical tools where relevant). Ensure the selection aligns with the stated BIM goals and lifecycle needs (design, construction, operations). Maximum 170 words.',
      style: 'tick-list format, use/value focused, realistic selection, ISO 19650 terminology'
    },

    relatedFields: ['bimGoals', 'primaryObjectives', 'bimStrategy']
  },

  // ====================================================================

  tenderApproach: {
    description: `Describe your proposed approach to delivering this project during the tender/pre-appointment phase. Explain your methodology, key strategies, and how you will meet the client's requirements.

Cover:
• Overall delivery philosophy and approach
• Key strategies (collaboration, early engagement, risk mitigation, etc.)
• How you will meet the client's specific requirements
• Phased delivery or staging approach if applicable
• Value engineering and optimization strategies
• Risk management approach
• Stakeholder engagement strategy
• Quality assurance processes

This is your chance to differentiate your approach from competitors.`,

    iso19650: `ISO 19650-2:2018 Section 5.1 - Appointment

The proposed approach should demonstrate understanding of the appointing party's requirements, project constraints, and information management expectations. It should show how the delivery team will establish capability and capacity.`,

    bestPractices: [
      'Lead with your core delivery philosophy (collaboration, innovation, quality, etc.)',
      'Emphasize early engagement and proactive coordination',
      'Highlight BIM as enabler for risk reduction and value delivery',
      'Mention phased approach aligned with RIBA stages or project phases',
      'Reference continuous value engineering throughout design',
      'Include stakeholder engagement and communication strategy',
      'Mention quality assurance and ISO 19650 compliance',
      'Address project-specific challenges or constraints',
      'Keep it client-focused - emphasize benefits to them'
    ],

    examples: {
      'Commercial Building': `Our approach emphasizes collaborative design coordination through advanced BIM workflows, early stakeholder engagement, and integrated sustainability analysis from the outset.

We propose a phased delivery strategy aligned with RIBA stages, with intensive coordination during Stage 3 to eliminate design conflicts before Stage 4 technical design. Continuous value engineering through 5D integration will identify cost savings opportunities while maintaining design quality and sustainability targets.

Our BIM-first approach enables early clash detection, reducing construction risks and ensuring predictable delivery. Weekly coordination meetings with all disciplines using federated models will maintain design quality and buildability. We will engage the contractor early (Stage 3) to validate constructability and optimize sequencing.

Risk management is embedded in our process through proactive clash detection, regular design reviews, and continuous stakeholder engagement. Quality is assured through ISO 19650-2:2018 compliance, automated model validation, and structured review gates at each RIBA stage milestone.`,

      'Infrastructure': `Our approach prioritizes early 3D design coordination to eliminate clashes between highway, structures, drainage, and utilities before detailed design, reducing construction risk and protecting the programme.

We will implement a staged delivery approach: Stage 1 - Options design with preliminary 3D models for stakeholder engagement; Stage 2 - Concept design with full 3D coordination; Stage 3 - Detailed design with clash-free construction documentation.

4D planning will be used from concept stage to optimize construction programme, traffic management, and stakeholder impacts. Early engagement with statutory undertakers will ensure utilities coordination is resolved during design, not on site.

Risk management focuses on early identification through 3D coordination, environmental analysis for sensitive areas, and stakeholder engagement for planning consent. Value engineering will be continuous through design development, supported by accurate quantity extraction from coordinated models.`
    },

    commonMistakes: [
      'Generic approach that could apply to any project',
      'Not addressing project-specific challenges or constraints',
      'Missing BIM integration in the delivery approach',
      'No mention of stakeholder engagement or communication',
      'Failing to connect approach to client\'s stated requirements',
      'Too much focus on process, not enough on value and outcomes',
      'Not explaining how risks will be managed',
      'Missing quality assurance and compliance commitments'
    ],

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are a BIM delivery strategy consultant. Generate compelling tender proposals that differentiate the team\'s approach and demonstrate value.',
      instructions: 'Generate content similar to the examples above. Include delivery philosophy, phased strategy (RIBA stages), BIM-enabled value engineering, early stakeholder engagement, risk management through clash detection, and quality assurance. Use structured paragraphs with specific methodologies. Maximum 150 words.',
      style: 'strategic, value-focused, differentiated approach, structured methodology, client-benefit emphasis'
    },

    relatedFields: ['bimStrategy', 'deliveryApproach', 'keyCommitments']
  },

  // ====================================================================

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

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are a BIM business strategy consultant. Generate compelling project context that connects BIM implementation to strategic business objectives.',
      instructions: 'Generate content similar to the examples above. Explain the business case, strategic importance, and how BIM supports client objectives. Include sustainability goals, digital transformation alignment, and portfolio context. Use business-focused language connecting BIM to outcomes, not just processes. Maximum 150 words.',
      style: 'business-focused, strategic alignment, outcome-oriented, client objectives emphasis'
    },

    relatedFields: ['projectDescription', 'bimStrategy', 'strategicAlignment']
  },

  // ====================================================================

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

  // ====================================================================

  deliveryApproach: {
    description: `Describe your confirmed approach to delivering this project during the post-appointment phase. Explain how you will execute the project, manage information, and deliver against the agreed commitments.

Cover:
• Delivery methodology and execution strategy
• Information management and CDE implementation
• Coordination processes and schedules
• Quality assurance and validation procedures
• Risk management and mitigation strategies
• Stakeholder engagement and communication protocols
• Phased delivery aligned with project programme
• Compliance with ISO 19650 and standards

Use confident, confirmed language - "We will..." not "We propose..."`,

    iso19650: `ISO 19650-2:2018 Section 5.2 - Mobilization

The delivery approach should confirm how information management capability will be mobilized, processes established, and information delivered throughout the appointment. It demonstrates readiness to execute against the agreed plan.`,

    bestPractices: [
      'Use confirmed language - "We will..." "Our team will..." "Implementation will..."',
      'Emphasize proven processes and established workflows',
      'Reference specific coordination schedules (weekly, bi-weekly)',
      'Mention CDE implementation and information management protocols',
      'Include quality gates and validation processes',
      'Address risk management and continuous improvement',
      'Reference ISO 19650 compliance and audit processes',
      'Explain phased delivery aligned with project programme',
      'Keep focus on execution, delivery, and outcomes'
    ],

    examples: {
      'Commercial Building': `Our delivery approach implements collaborative design coordination through established BIM workflows, stakeholder integration at defined milestones, and continuous value engineering throughout all project stages.

We will execute a phased delivery strategy aligned with RIBA stages and the agreed project programme. Stage 3 will focus on design development with bi-weekly coordination meetings, achieving 95% clash-free models before Stage 4. Stage 4 will deliver detailed technical design to LOD 350 with full MEP coordination and buildability validation.

BIM 360 CDE will be implemented within 2 weeks of appointment with role-based access, structured folders, and audit trails. Weekly clash detection will run throughout design with < 24hr resolution SLA for critical clashes. Monthly model quality validation using Solibri will ensure compliance with project standards.

Risk management is embedded through proactive clash detection, regular design reviews at each milestone, and continuous stakeholder engagement. Quality gates at Stage 3 and Stage 4 completion will ensure all deliverables meet ISO 19650-2:2018 requirements before progression.

Proactive risk management through early identification and mitigation will ensure on-time, on-budget completion. Our integrated sustainability analysis will validate net-zero carbon targets throughout design development.`,

      'Healthcare': `Our delivery approach for this hospital extension implements rigorous coordination processes tailored to the complexity of live hospital operations, stringent infection control requirements, and integration with existing building systems.

We will implement phased coordination models aligned with the construction programme, with room-by-room LOD 350 coordination for all clinical spaces. Weekly coordination meetings will focus on medical gases, critical ventilation, and ceiling void coordination, achieving zero clashes in critical clinical areas.

The CDE will be implemented using BIM 360 with the Trust's IT security requirements and NHS data standards. All clinical areas will undergo additional quality validation for HBN 04-01 compliance, including airflow analysis and room pressure validation.

4D models will be developed in coordination with the Trust's operational constraints, ensuring minimal disruption to clinical services. Construction sequencing will be validated with the Trust's clinical teams before any enabling works commence.

All information deliverables will be structured for integration with the Trust's CAFM system, with COBie data prepared progressively throughout design and validated before handover. O&M information will be linked to model components for immediate use by the FM team.`
    },

    commonMistakes: [
      'Using tentative language - "We propose..." instead of "We will..."',
      'Generic delivery approach not tailored to project specifics',
      'No mention of specific coordination schedules or frequencies',
      'Missing CDE implementation details',
      'No quality validation or compliance checking processes',
      'Failing to address project-specific constraints or challenges',
      'Not explaining phased delivery aligned with programme',
      'Missing risk management and continuous improvement processes'
    ],

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are a BIM execution planning expert. Generate confident, execution-focused delivery plans with confirmed processes and timelines.',
      instructions: 'Generate content similar to the examples above. Use confident language ("We will..."). Include phased delivery (RIBA stages), specific coordination schedules (weekly/bi-weekly), CDE implementation timeline, quality gates, clash resolution SLAs, and ISO 19650 compliance. Use structured paragraphs with actionable commitments. Maximum 150 words.',
      style: 'confident tone, execution-focused, specific schedules, quality gates, actionable commitments'
    },

    relatedFields: ['bimStrategy', 'tenderApproach', 'keyCommitments', 'informationManagementResponsibilities']
  },

  // ====================================================================
  // STEP 2: TEAM AND CAPABILITIES FIELDS
  // ====================================================================

  proposedLead: {
    description: `Identify the proposed Lead Appointed Party - the organization that will take primary responsibility for managing information delivery and coordinating the delivery team during the appointment.

Include:
• Full legal company name
• Brief company profile or credentials if space permits
• Relevant accreditations (ISO 19650, ISO 9001, etc.)
• Track record in similar projects`,

    iso19650: `ISO 19650-2:2018 Section 5.1.3 - Lead Appointed Party

The Lead Appointed Party has overall responsibility for managing information and coordinating the delivery team's collective performance against the Exchange Information Requirements (EIR).`,

    bestPractices: [
      'Provide the full legal entity name as it appears on contracts',
      'Mention key accreditations (ISO 19650, ISO 9001, BIM Level 2)',
      'Add brief credentials highlighting relevant experience',
      'Reference company registration number if required',
      'Ensure consistency with contract documentation'
    ],

    examples: {
      'Architecture Firm': `Smith & Associates Architects Ltd. (ISO 19650-2 certified, ISO 9001:2015 accredited) - Award-winning practice with 15+ years delivering complex commercial projects using advanced BIM methodologies across £500M+ portfolio.`,
      'Engineering Firm': `Jones Engineering Consultants LLP (ISO 19650 Lead, Chartered Engineers) - Multidisciplinary engineering practice specializing in infrastructure and commercial developments with proven BIM coordination capability.`
    },

    commonMistakes: [
      'Using informal company name instead of legal entity',
      'Not mentioning ISO 19650 certification or BIM credentials',
      'Providing too much marketing text instead of factual credentials',
      'Inconsistency with contract documentation'
    ],

    aiPrompt: {
      system: 'You are a BIM tender expert specializing in organizational capability assessment.',
      instructions: 'Generate a proposed Lead Appointed Party entry for a BEP tender response. Include full legal company name, relevant ISO certifications (ISO 19650-2, ISO 9001), and brief credentials demonstrating BIM capability. Reference years of experience and project portfolio value. Keep it professional and factual, avoiding marketing language. Maximum 100 words.',
      style: 'professional, factual, compliance-led, concise'
    },

    relatedFields: ['leadAppointedParty', 'informationManager', 'teamCapabilities']
  },

  proposedInfoManager: {
    description: `Identify the proposed Information Manager - the individual responsible for managing information processes, CDE implementation, and ensuring compliance with ISO 19650 throughout the project.

Include:
• Full name and job title
• Relevant professional qualifications (RICS, BIM certifications)
• Key credentials (ISO 19650 Lead, BIM Level 2, etc.)
• Relevant experience summary if space permits`,

    iso19650: `ISO 19650-2:2018 Section 5.1.3 - Information Manager

The Information Manager is responsible for establishing and maintaining information management processes, managing the CDE, and ensuring all information exchanges meet quality and compliance requirements.`,

    bestPractices: [
      'Include professional qualifications (RICS, CIOB, APM, etc.)',
      'Mention ISO 19650 Lead or similar certifications',
      'Add BIM-specific credentials (Autodesk Certified, BIM Level 2)',
      'State years of information management experience',
      'Ensure this person has authority and availability for the role'
    ],

    examples: {
      'Experienced Professional': `Sarah Johnson, BIM Manager (RICS MBIM, ISO 19650-2 Lead, Autodesk Certified Professional) - 12+ years information management experience across commercial and infrastructure projects.`,
      'Senior Specialist': `David Chen, Head of Digital Delivery (CEng, MICE, BIM Level 2 Certified) - 15 years BIM implementation leadership with expertise in ISO 19650 compliance and CDE management.`
    },

    commonMistakes: [
      'Not including professional qualifications or certifications',
      'Proposing someone without ISO 19650 knowledge',
      'Missing BIM-specific credentials',
      'Nominating someone without sufficient seniority or authority',
      'Not confirming availability and commitment to the project'
    ],

    aiPrompt: {
      system: 'You are a BIM resource planning expert specializing in ISO 19650 competency assessment.',
      instructions: 'Generate a proposed Information Manager entry for a BEP tender response. Include full name, job title, professional qualifications (RICS, CIOB, etc.), ISO 19650 Lead certification, and BIM credentials (Autodesk Certified, BIM Level 2). Add brief experience summary with years and project types. Emphasize information management expertise and ISO 19650 compliance. Maximum 100 words.',
      style: 'professional, competency-focused, ISO 19650 tone, concise'
    },

    relatedFields: ['informationManager', 'proposedLead', 'teamCapabilities']
  },

  proposedTeamLeaders: {
    description: `List the proposed Task Team Leaders for each discipline in a structured table. These are the key technical leads responsible for information production within their respective disciplines.

Include for each leader:
• Discipline (Architecture, Structural, MEP, Civils, QS, etc.)
• Name, job title, and relevant qualifications
• Company name
• Experience summary (years in discipline, relevant projects, BIM experience)`,

    iso19650: `ISO 19650-2:2018 Section 5.1.3 - Task Team Leaders

Task Team Leaders are responsible for managing information production within their discipline, ensuring deliverables meet LOIN requirements, and coordinating with other task teams through the Information Manager.`,

    bestPractices: [
      'Include all major disciplines (Architecture, Structure, MEP minimum)',
      'Add professional qualifications (ARB, CEng, chartered status)',
      'Mention BIM competency level or certifications',
      'Quantify experience (years, project count, value delivered)',
      'Reference relevant project types or complexity',
      'Ensure proposed leaders have authority and capacity'
    ],

    examples: {
      'Table Entry': `Architecture | Michael Chen, Design Director (ARB, RIBA, BIM Level 2) | Smith & Associates | 18 years architectural practice, 12 years BIM leadership, delivered 25+ commercial projects including award-winning Tech Hub (£25M)

Structural Engineering | David Williams, Principal Engineer (CEng, MIStructE, Tekla Certified) | Jones Engineering | 15 years structural design, advanced BIM coordination expertise, delivered complex commercial and infrastructure projects totaling £300M+

MEP Engineering | Emma Davis, Associate Director (CEng, MCIBSE, Revit MEP Specialist) | TechServ Solutions | 14 years building services design, expert in complex MEP coordination and digital twin development for smart buildings`
    },

    commonMistakes: [
      'Missing key disciplines (Structure or MEP)',
      'Not including professional qualifications',
      'No mention of BIM competency or experience',
      'Vague experience descriptions without quantification',
      'Proposing junior staff without demonstrated leadership experience'
    ],

    aiPrompt: {
      system: 'You are a BIM team organization expert specializing in multi-disciplinary coordination.',
      instructions: 'Generate a table of proposed Task Team Leaders for a BEP tender response. Include Architecture, Structural Engineering, and MEP Engineering (minimum). For each row: discipline, name + job title, professional qualifications (e.g., ARB, CEng, chartered status), company, and a brief experience summary (years, BIM competency, relevant projects). Use pipe-separated table format. Max 150 words.',
      style: 'ISO 19650-aligned, concise, professional, tender-ready; avoid disclaimers and filler; ensure roles show authority and BIM coordination competence.'
    },

    relatedFields: ['assignedTeamLeaders', 'teamCapabilities', 'taskTeamsBreakdown']
  },

  subcontractors: {
    description: `List proposed subcontractors, specialist consultants, and key partners who will support project delivery in a structured table format.

Include for each:
• Role/Service (Facade Engineering, Sustainability, Acoustic Consulting, etc.)
• Company name
• Relevant certifications or accreditations
• Key contact person and details`,

    iso19650: `ISO 19650-2:2018 Section 5.1.3 - Appointed Parties

All appointed parties contributing to information production must be identified with their roles, capabilities, and information delivery responsibilities clearly defined.`,

    bestPractices: [
      'Include all specialist consultants contributing to the design',
      'List subcontractors responsible for key information deliverables',
      'Mention relevant certifications (BREEAM AP, LEED AP, etc.)',
      'Include BIM capability where relevant to the role',
      'Add contact details for coordination purposes',
      'Only list parties who will actually produce information'
    ],

    examples: {
      'Table Entry': `Sustainability Consultant | GreenBuild Advisory Ltd | BREEAM AP, LEED AP | Jane Smith - j.smith@greenbuild.co.uk

Facade Engineering | Advanced Facades LLP | ISO 9001, BIM Level 2 | Tom Johnson - t.johnson@advancedfacades.com

Acoustic Consultant | SoundTech Consulting | IOA Member, BREEAM Acoustic Specialist | Lisa Brown - l.brown@soundtech.co.uk

Geotechnical Engineer | Ground Engineering Partners | ICE Accredited, Ground Investigation Specialists | Mark Davis - m.davis@groundeng.co.uk`
    },

    commonMistakes: [
      'Listing contractors who don\'t contribute to design information',
      'Missing specialist consultants critical to the design',
      'No mention of relevant certifications or BIM capability',
      'Incomplete contact information',
      'Including too many minor subcontractors - focus on key information producers'
    ],

    aiPrompt: {
      system: 'You are a BIM project coordination expert specializing in specialist consultant integration.',
      instructions: 'Generate a table of proposed subcontractors and specialist consultants for a BEP tender response. Include 3-4 key specialists (e.g., Sustainability, Facade Engineering, Acoustics, Geotechnical). For each: role/service, company name, relevant certifications (BREEAM AP, LEED AP, BIM Level 2, etc.), and key contact with email. Use table format with pipe separators. Maximum 120 words.',
      style: 'table format, professional, certifications included, concise'
    },

    relatedFields: ['proposedTeamLeaders', 'assignedTeamLeaders', 'teamCapabilities']
  },

  leadAppointedParty: {
    description: `Confirm the appointed Lead Appointed Party - the organization taking primary responsibility for managing information delivery and coordinating the delivery team.

Include:
• Full legal company name
• Company registration details if required
• Relevant accreditations (ISO 19650, ISO 9001, etc.)
• Brief company profile highlighting relevant credentials`,

    iso19650: `ISO 19650-2:2018 Section 5.1.3 - Lead Appointed Party

The Lead Appointed Party has overall responsibility for managing information and coordinating the delivery team's collective performance against the Exchange Information Requirements (EIR) throughout the appointment.`,

    bestPractices: [
      'Provide full legal entity name matching contract',
      'Include company registration number if required',
      'Confirm ISO 19650-2 certification or accreditation',
      'Mention other relevant standards (ISO 9001, Cyber Essentials)',
      'Add brief credentials demonstrating capability',
      'Ensure complete consistency with contract documentation'
    ],

    examples: {
      'Architecture Firm': `Smith & Associates Architects Ltd. (Company No. 01234567, ISO 19650-2:2018 certified, ISO 9001:2015, Cyber Essentials Plus) - Established architectural practice with 20+ years experience and proven track record delivering BIM Level 2 projects exceeding £500M total value.`,
      'Engineering Firm': `Jones Engineering Consultants LLP (ISO 19650-2 certified, Chartered Engineers) - Multidisciplinary engineering practice with dedicated information management capability and extensive experience coordinating complex commercial and infrastructure projects.`
    },

    commonMistakes: [
      'Using trading name instead of legal entity',
      'Missing company registration details',
      'Not confirming ISO 19650 certification',
      'Inconsistency with contract documents',
      'Insufficient credentials to demonstrate capability'
    ],

    aiPrompt: {
      system: 'You are a BIM contract management expert specializing in appointed party confirmation.',
      instructions: 'Generate a confirmed Lead Appointed Party entry for BEP appointment. Include full legal company name, company registration number, ISO 19650-2 certification, ISO 9001 accreditation, and Cyber Essentials. Add brief credentials with years of experience and total project portfolio value. Use confident, appointment-confirmed language. Maximum 100 words.',
      style: 'appointment-confirmed language, factual, compliance-led, concise'
    },

    relatedFields: ['proposedLead', 'informationManager', 'resourceAllocation']
  },

  informationManager: {
    description: `Confirm the appointed Information Manager - the named individual responsible for managing information processes, CDE implementation, and ensuring ISO 19650 compliance throughout the project.

Include:
• Full name and job title
• Professional qualifications and memberships (RICS, CIOB, APM, etc.)
• ISO 19650 and BIM certifications
• Contact details
• Brief experience summary demonstrating competency`,

    iso19650: `ISO 19650-2:2018 Section 5.1.3 - Information Manager

The Information Manager establishes and maintains information management processes, manages the CDE, coordinates TIDPs, ensures quality compliance, and manages information security. This is a critical role requiring proven competency and authority.`,

    bestPractices: [
      'Provide full name and formal job title',
      'List all relevant professional qualifications (RICS, CIOB, APM)',
      'Confirm ISO 19650 Lead or equivalent certification',
      'Include BIM-specific credentials (Autodesk, BRE, BSI)',
      'Add contact details for accessibility',
      'Quantify information management experience (years, project count)',
      'Confirm sufficient authority and dedicated availability'
    ],

    examples: {
      'Senior Professional': `Sarah Johnson, BIM Manager and Information Manager (RICS MBIM, ISO 19650-2 Lead Practitioner, Autodesk Certified Professional, PRINCE2 Practitioner) - s.johnson@smith-assoc.co.uk / +44 7700 900234

12+ years information management experience across commercial and infrastructure projects totaling £800M+. Proven track record implementing ISO 19650-2 compliant workflows, managing complex CDEs, and coordinating multi-disciplinary information delivery on projects up to £120M value.`,

      'Experienced Specialist': `David Chen, Head of Digital Delivery (CEng, MICE, BIM Level 2 Certified, ISO 19650 Information Manager) - d.chen@joneseng.co.uk / +44 7700 900567

15 years BIM implementation and information management leadership. Expertise in federated model coordination, CDE management, and ISO 19650 compliance across 40+ projects. Dedicated 80% FTE allocation to this project ensuring continuous information management oversight.`
    },

    commonMistakes: [
      'Not confirming ISO 19650 competency or certification',
      'Missing professional qualifications',
      'No contact details provided',
      'Insufficient experience for project complexity',
      'Unclear availability or time commitment',
      'Person lacks authority or organizational support',
      'No mention of BIM-specific expertise'
    ],

    aiPrompt: {
      system: 'You are a BIM organizational expert specializing in Information Manager appointment and competency verification.',
      instructions: 'Generate a confirmed Information Manager entry for BEP appointment. Include full name, job title, professional qualifications (RICS, CIOB, APM), ISO 19650-2 Lead certification, BIM credentials (Autodesk, BRE), and contact details. Add experience summary with years, project count, and total portfolio value. Include FTE allocation. Use appointment-confirmed language. Maximum 150 words.',
      style: 'appointment-confirmed language, professional, competency-led, concise'
    },

    relatedFields: ['proposedInfoManager', 'informationManagementResponsibilities', 'resourceAllocation']
  },

  assignedTeamLeaders: {
    description: `Confirm the assigned Task Team Leaders for each discipline. These are the appointed technical leads responsible for information production, quality assurance, and coordination within their disciplines.

Include for each leader:
• Discipline (Architecture, Structural, MEP, Civils, QS, etc.)
• Name, job title, and professional qualifications
• Company name
• Detailed role responsibilities for this project
• BIM competency and relevant experience`,

    iso19650: `ISO 19650-2:2018 Section 5.1.3 - Task Team Leaders

Task Team Leaders manage information production within their discipline, ensure deliverables meet LOIN and quality requirements, coordinate through the Information Manager, and maintain their TIDP compliance throughout the appointment.`,

    bestPractices: [
      'Include all disciplines contributing to design information',
      'Confirm professional qualifications and chartered status',
      'Specify exact role responsibilities for this project',
      'Mention BIM competency level and software expertise',
      'Quantify relevant experience on similar projects',
      'Confirm dedicated time allocation (% FTE)',
      'Ensure leaders have authority and decision-making capacity'
    ],

    examples: {
      'Table Entry': `Architecture | Michael Chen, Design Director (ARB, RIBA, BIM Level 2) | Smith & Associates | Responsible for architectural design coordination, spatial modeling to LOD 350, specification schedules, and design team leadership. 18 years experience, 50% FTE allocation.

Structural Engineering | David Williams, Principal Engineer (CEng, MIStructE, Tekla Structures Expert) | Jones Engineering | Leads structural analysis, coordination models, connection details, and engineering calculations. Advanced BIM coordination expertise across 15 years, 40% FTE allocation.

MEP Engineering | Emma Davis, Associate Director (CEng, MCIBSE, Revit MEP Specialist) | TechServ Solutions | Manages all building services design, MEP coordination to LOD 350, system specifications, and energy analysis. 14 years building services experience with digital twin expertise, 60% FTE allocation.`
    },

    commonMistakes: [
      'Missing role-specific responsibilities',
      'Not confirming time allocation or availability',
      'No mention of BIM competency for technical roles',
      'Insufficient experience for assigned responsibilities',
      'Vague experience descriptions',
      'Leaders without authority to make design decisions'
    ],

    aiPrompt: {
      system: 'You are a BIM project delivery expert specializing in task team organization and resource confirmation.',
      instructions: 'Generate a table of confirmed Task Team Leaders for BEP appointment. Include entries for Architecture, Structural Engineering, and MEP Engineering (minimum). For each: discipline, name with job title, professional qualifications (ARB, CEng, chartered), company name, specific project responsibilities, BIM competency/software expertise, years of experience, and FTE allocation. Use appointment-confirmed language. Maximum 150 words.',
      style: 'table format, appointment-confirmed language, professional, concise'
    },

    relatedFields: ['proposedTeamLeaders', 'taskTeamsBreakdown', 'resourceAllocationTable', 'mobilizationPlan']
  },

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

    // AI Prompt Configuration for generating field content
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

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are a BIM mobilization coordinator. Generate comprehensive mobilization plans with phased activities, capability testing, and risk management.',
      instructions: 'Generate content similar to the examples above. Use 3-week phased structure with detailed activities: Week 1 (onboarding, ISO 19650 training, EIR review, CDE access), Week 2 (IT setup, Revit/Navisworks licensing, cloud config, CDE templates), Week 3 (pilot models, federation testing, IFC validation, quality checks). Include risk mitigation section documenting capacity risks per ISO 19650-2 clause 5.3.6. Use structured format with bold headings and bullet points. Maximum 150 words.',
      style: 'phased structure (3 weeks), detailed activities, ISO 19650-2 compliant, risk register integration, capability verification emphasis'
    },

    relatedFields: ['resourceAllocationTable', 'informationManagementResponsibilities', 'cdeStructure', 'confirmedBimGoals']
  },

  resourceAllocation: {
    description: `(Legacy field - use resourceAllocationTable and mobilizationPlan instead)
    
Describe the confirmed resource allocation across the delivery team. Explain the team composition, staffing levels, resource deployment across project phases, and how resources will be scaled to meet delivery demands.

Include:
• Total team size and composition by discipline
• Staffing levels at different project stages (RIBA stages)
• Peak resource requirements and timing
• Specialist resources and when they'll be engaged
• Resource flexibility and contingency plans`,

    iso19650: `ISO 19650-2:2018 Section 5.1.3 - Capacity

The delivery team must demonstrate sufficient capacity (people, time, resources) to deliver all information requirements throughout the appointment. Resource allocation should align with the MIDP and delivery schedule.`,

    bestPractices: [
      'Quantify total team size by discipline (architects, engineers, etc.)',
      'Show resource deployment aligned with RIBA stages or project phases',
      'Identify peak resource periods and staffing levels',
      'Mention specialist resources and engagement timing',
      'Include BIM/coordination resources specifically',
      'Address resource contingency and flexibility',
      'Use FTE (Full-Time Equivalent) metrics where appropriate',
      'Ensure alignment with project programme and MIDP'
    ],

    examples: {
      'Commercial Building': `The confirmed delivery team comprises 45 specialists across all disciplines providing comprehensive design and coordination capability:

Core Team: 12 architects (including 3 BIM coordinators), 8 structural engineers, 10 MEP engineers (mechanical, electrical, public health), 6 quantity surveyors, 4 project managers, 5 BIM specialists.

Resource Deployment by RIBA Stage:
• Stage 3 (Developed Design): 30 FTE - emphasis on spatial coordination and design development
• Stage 4 (Technical Design): Peak deployment of 42 FTE - full technical coordination and documentation
• Stage 5 (Construction): 15 FTE reducing to 8 FTE - construction support and as-built verification

Specialist Consultants: Sustainability consultant (6-month Stage 3-4 engagement), facade engineer (8-month detailed design period), acoustic consultant (Stage 3-4 design validation).

Resource Contingency: 20% additional capacity available through parent company resources for peak periods or technical challenges.`,

      'Infrastructure': `The delivery team provides 35 specialists with infrastructure project expertise:

Core Disciplines: 8 highway designers, 6 structural engineers, 8 civils/drainage engineers, 4 BIM coordinators, 5 project managers, 4 quantity surveyors.

Stage Deployment:
• Concept Design: 18 FTE - options development and preliminary design
• Detailed Design: Peak 32 FTE - full 3D coordination and construction documentation
• Construction Support: 12 FTE - technical queries and as-built verification

Specialists: Geotechnical engineer (site investigation phase), environmental consultant (12-month consents period), traffic modeling specialist (6-month design validation).

Scalability: Access to parent company's 200+ infrastructure specialists for peer review and specialist input.`
    },

    commonMistakes: [
      'Not quantifying team size or composition',
      'Missing resource deployment across project phases',
      'No identification of peak resource requirements',
      'Not addressing BIM/coordination resources specifically',
      'Vague staffing commitments without FTE metrics',
      'Missing specialist consultant timing',
      'No resource contingency or flexibility mentioned',
      'Misalignment with project programme'
    ],

    aiPrompt: {
      system: 'You are a BIM delivery manager. Produce ISO 19650-aligned resource allocation statements that evidence delivery capacity and scaling.',
      instructions: 'Write a resource allocation summary aligned to ISO 19650-2 capacity requirements. Include: total team size by discipline, explicit BIM roles (BIM Manager/Coordinator), phase-based deployment (by project stage) with peak FTE timing, specialist resources and when engaged, and contingency/scalability (e.g., access to wider resource pool). Keep it specific and quantified. Ensure alignment with programme/MIDP milestones. Maximum 140 words.',
      style: 'quantified (FTE), phase-based, role/discipline clarity, capacity evidence, concise'
    },

    relatedFields: ['teamCapabilities', 'assignedTeamLeaders', 'mobilisationPlan']
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

    // AI Prompt Configuration for generating field content
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

    // AI Prompt Configuration for generating field content
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

Structural Engineering Task Team | David Williams, Principal Engineer | 5 structural engineers, 1 BIM coordinator | Responsible for: structural analysis models, construction models (LOD 350), connection details, structural calculations, loading schedules, coordination with architecture and MEP. Software: Tekla Structures, Robot Structural Analysis. Deliverables per Structural TIDP.

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

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are a BIM task team coordination expert. Generate ISO 19650-aligned task team breakdowns for a BEP.',
      instructions: 'Generate a structured task team breakdown (table-style text). Include key disciplines as separate entries (minimum: Architecture, Structural Engineering, MEP). For each: task team name, team leader, team members/composition, specific responsibilities and information deliverables (aligned to LOIN and TIDP), coordination duties with other teams, and primary software/tools. Use clear, appointment-confirmed language. Maximum 160 words.',
      style: 'table-style entries, discipline headings, deliverable-focused, ISO 19650/TIDP/LOIN terminology'
    },

    relatedFields: ['assignedTeamLeaders', 'organizationalStructure', 'tidpRequirements']
  },

  // ====================================================================
  // STEP 3: BIM GOALS - ADDITIONAL FIELDS
  // ====================================================================

  referencedMaterial: {
    description: `List all referenced documents, standards, and materials that inform or govern this BEP. This establishes the regulatory and contractual framework within which information will be managed.

Include:
• Exchange Information Requirements (EIR) with version
• Project Information Requirements (PIR)
• Relevant ISO standards (19650, 1192, etc.)
• Client BIM standards or protocols
• Health & Safety information requirements
• Industry standards (RIBA Plan of Work, NBS, etc.)
• Contract-specific requirements`,

    iso19650: `ISO 19650-2:2018 Section 5.1.1 - Information Requirements

The BEP must reference and respond to the appointing party's Exchange Information Requirements (EIR) and any applicable standards, protocols, or information requirements that govern information management.`,

    bestPractices: [
      'Always reference the EIR with version number and date',
      'List ISO 19650-2:2018 as the primary information management standard',
      'Include relevant BS and PAS standards (BS 1192, PAS 1192-2)',
      'Reference client-specific BIM protocols or standards',
      'Mention RIBA Plan of Work 2020 if relevant',
      'Include health & safety information requirements (CDM 2015)',
      'Keep list focused - only documents that actually inform the BEP'
    ],

    examples: {
      'Post-Appointment': `This BEP references and responds to the following documents and standards:

• Exchange Information Requirements (EIR) v2.1, dated March 2024
• Project Information Requirements (PIR) dated March 2024
• ISO 19650-2:2018 - Organization and digitization of information (BIM)
• BS 1192:2007+A2:2016 - Collaborative production of information
• PAS 1192-2:2013 - Information management (specification for capital/delivery)
• Client BIM Standards Manual v3.0
• RIBA Plan of Work 2020 - Stage definitions and deliverables
• CDM Regulations 2015 - Health & Safety Information Requirements
• NBS BIM Toolkit guidance
• Project-specific Quality Plan dated February 2024`
    },

    commonMistakes: [
      'Not referencing the EIR or PIR',
      'Missing version numbers and dates for key documents',
      'Not mentioning ISO 19650 standards',
      'Including too many irrelevant documents',
      'Not updating when referenced documents are revised'
    ],

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are a BIM documentation specialist. Generate concise reference lists of governing documents and standards for a BEP.',
      instructions: 'Generate content similar to the example above. Provide a bullet list of referenced documents including EIR (with version/date), PIR, ISO 19650 series (as applicable), BS/PAS guidance where relevant, client BIM standards/protocols, RIBA/NBS references (if applicable), and H&S information requirements. Keep it focused on documents that govern information management for this project. Maximum 140 words.',
      style: 'bullet list, version/date included, formal citations, ISO 19650-aligned'
    },

    relatedFields: ['projectContext', 'informationManagementResponsibilities']
  },

  bimValueApplications: {
    description: `Explain how BIM will be applied to maximize project value across cost, time, quality, risk, and sustainability dimensions. This demonstrates the tangible benefits of BIM implementation.

Cover:
• 4D scheduling for time optimization
• 5D cost management for budget control
• Energy and sustainability modeling
• Lifecycle cost analysis
• Design alternative evaluations
• Pre-fabrication and construction optimization
• Stakeholder visualization and engagement
• Digital twin for operational value`,

    iso19650: `ISO 19650-1:2018 Section 5.2 - Value and Benefits

BIM applications should deliver measurable value aligned with project objectives and the appointing party's business case. Value should be demonstrated across design, construction, and operational phases.`,

    bestPractices: [
      'Quantify value wherever possible (% savings, time reduction, etc.)',
      'Cover multiple value dimensions (cost, time, quality, risk, sustainability)',
      'Include both short-term (design/construction) and long-term (operations) value',
      'Link applications to specific project challenges or requirements',
      'Mention 4D for schedule optimization and visualization',
      'Reference 5D for cost control and value engineering',
      'Include sustainability and energy performance applications',
      'Address digital twin and lifecycle value',
      'Be specific - name processes and outcomes'
    ],

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are a BIM value and benefits specialist. Generate clear descriptions of BIM applications that deliver measurable project value.',
      instructions: 'Explain how BIM will be applied to maximize value across cost, time, quality, risk, and sustainability. Include practical uses (4D scheduling, 5D cost management, energy/sustainability modelling, lifecycle costing, construction optimisation/prefabrication, stakeholder visualisation, digital twin/operations). Link each application to expected outcomes and quantify where reasonable. Maximum 150 words.',
      style: 'benefit-led, measurable outcomes, project-focused, ISO 19650-1 value language'
    },

    relatedFields: ['valueProposition', 'bimGoals', 'strategicAlignment']
  },

  valueMetrics: {
    description: `Define measurable success metrics and how BIM value will be tracked throughout the project. This table establishes accountability and enables value demonstration.

Include for each metric:
• Value Area (Cost, Time, Quality, Risk, Sustainability, etc.)
• Target Metric (specific, quantified goal)
• Measurement Method (how it will be tracked)
• Baseline/Benchmark (comparison point)`,

    iso19650: `ISO 19650-1:2018 Section 5.2 - Performance Measurement

Value realization should be tracked through defined metrics and KPIs that demonstrate BIM contribution to project outcomes.`,

    bestPractices: [
      'Make metrics SMART (Specific, Measurable, Achievable, Relevant, Time-bound)',
      'Cover key value areas (cost, time, quality, risk, sustainability)',
      'Define clear measurement methods',
      'Establish baseline or benchmark for comparison',
      'Include both leading indicators (process) and lagging indicators (outcomes)',
      'Ensure metrics align with client priorities',
      'Keep metrics focused - 5-8 key measures maximum'
    ],

    examples: {
      'Table Entry': `Cost Savings | 15% reduction in construction costs through clash elimination | Track RFIs and change orders vs. baseline | Industry average: 8-12% savings

Time Efficiency | 25% faster design coordination | Measure coordination cycle time vs. previous projects | Baseline: 6-week coordination cycles

Quality | 95% clash-free models before construction | Automated clash detection reports | Benchmark: 60-70% typical

Risk Reduction | 40% reduction in design-related RFIs | Track RFI count during construction | Project baseline: 200 RFIs (predicted)

Sustainability | Achieve net-zero operational carbon | Energy modeling validation at each stage | Target: EPC A rating, <15 kWh/m²/year`
    },

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are a BIM performance and value measurement specialist. Generate SMART BIM value metrics and tracking methods.',
      instructions: 'Generate 5–8 value metrics in a table-style format. For each include: value area, target metric (SMART), measurement method, and baseline/benchmark. Cover at least cost, time, quality, risk, and sustainability. Keep metrics realistic and aligned with BIM processes (clash detection, coordination cycles, RFIs/change, energy modelling). Maximum 160 words.',
      style: 'table-style rows, SMART targets, measurable methods, concise and accountable'
    },

    relatedFields: ['bimGoals', 'valueProposition', 'performanceMetrics']
  },

  strategicAlignment: {
    description: `Explain how the BIM strategy aligns with and supports the client's strategic business objectives. This demonstrates understanding of the client's broader goals and how BIM enables them.

Address:
• Client's digital transformation or innovation goals
• Portfolio management objectives
• Sustainability and ESG commitments
• Operational efficiency targets
• Asset management strategy
• Cost reduction or value creation goals
• Regulatory or certification requirements`,

    iso19650: `ISO 19650-1:2018 Section 5.1 - Strategic Purposes

Information management should support the appointing party's strategic purposes and organizational objectives across the asset lifecycle.`,

    bestPractices: [
      'Demonstrate clear understanding of client\'s business strategy',
      'Link BIM implementation to specific client objectives',
      'Address sustainability and ESG if relevant to client',
      'Reference client\'s digital maturity or transformation goals',
      'Mention portfolio or estate management if applicable',
      'Connect to long-term asset management strategy',
      'Quantify alignment where possible',
      'Show understanding beyond the immediate project'
    ],

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are a BIM strategy advisor. Generate ISO 19650-aligned statements linking BIM delivery to client strategic objectives.',
      instructions: 'Explain how the BIM strategy supports the client\'s strategic objectives (digital transformation, sustainability/ESG, operational efficiency, asset management, cost/value creation, regulatory requirements). Make the links explicit and outcome-focused, and reference how information management enables these outcomes across the asset lifecycle. Maximum 140 words.',
      style: 'strategic, client-focused, measurable outcomes where possible, ISO 19650-1 lifecycle language'
    },

    relatedFields: ['projectContext', 'bimStrategy', 'valueProposition']
  },

  collaborativeProductionGoals: {
    description: `Define goals for collaborative information production across the delivery team. This establishes expectations for how teams will work together to produce, validate, and exchange information.

Include:
• Unified data standards and consistency
• Real-time model coordination and federation
• Consistent information delivery at milestones
• Version control and change management
• Transparent communication and visualization
• Audit trails and accountability
• ISO 19650 compliance objectives`,

    iso19650: `ISO 19650-2:2018 Section 5.1.6 - Collaborative Production

Collaborative production goals should establish how task teams will work together to produce information that meets requirements, maintains consistency, and supports effective decision-making.`,

    bestPractices: [
      'Emphasize standardization across disciplines',
      'Address real-time or frequent coordination',
      'Include version control and change management goals',
      'Mention audit trails and transparency',
      'Reference quality assurance and validation',
      'Address communication and visualization',
      'Link to ISO 19650 information management principles'
    ],

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are a BIM information management lead. Define collaborative production goals aligned to ISO 19650 workflows and controls.',
      instructions: 'Define concise collaborative production goals for the delivery team. Include unified standards/metadata, federation and coordination cadence, milestone delivery consistency, version control and change management, QA/validation, audit trails/accountability, and ISO 19650 compliance targets. Use bullet points or short paragraphs and keep it actionable. Maximum 140 words.',
      style: 'actionable goals, standardisation and control focus, ISO 19650 terminology, concise'
    },

    relatedFields: ['bimGoals', 'informationManagementResponsibilities', 'alignmentStrategy']
  },

  alignmentStrategy: {
    description: `Define your comprehensive approach to facilitating information management goals and maintaining alignment throughout the project. This structured strategy covers 7 key aspects required by ISO 19650-2.

The Information Management Strategy Builder provides an interactive interface to document:
1. **Coordination Meeting Schedule** - Regular meetings for information management oversight
2. **RACI Responsibility Matrices** - Clear accountability for information production and approval
3. **Naming and Folder Structure Standards** - Standardized conventions ensuring consistency
4. **Quality Checking Tools** - Automated validation processes for compliance
5. **Training and Competency Requirements** - Ensuring team capability
6. **Performance Monitoring and KPIs** - Measurable indicators of effectiveness
7. **Ongoing Alignment Maintenance** - Strategy for continuous improvement

Each section can be completed independently and includes structured fields appropriate to the content type (tables for schedules/tools, text for strategies/standards).`,

    iso19650: `**ISO 19650-2:2018 Key Clauses:**

**Section 5.2 - Mobilization and Collaboration**
Requires establishing information management processes, responsibilities, and communication protocols. The alignment strategy demonstrates how these will be implemented and maintained.

**Section 5.4.1 - Collaborative Production of Information**
Mandates coordination procedures, quality assurance processes, and competency requirements. Your strategy must show how information will be produced, checked, and approved consistently.

**Section 5.6 - Information Delivery Milestones**
Requires performance monitoring against agreed milestones. KPIs demonstrate measurable compliance with information requirements.

**Section 5.3.4 - Mobilization**
Addresses team competency verification, training requirements, and capacity assessment. Training plans ensure compliance.

The strategy must demonstrate continuous alignment between appointing party requirements (EIR) and delivery team processes throughout the project lifecycle.`,

    bestPractices: [
      '**Coordination Meetings:** Schedule regular meetings at appropriate frequencies (weekly BIM coordination, bi-weekly design reviews, monthly IM reviews). Define clear participants and agenda items.',
      
      '**RACI Matrices:** Reference detailed responsibility matrices (typically in Section 3.3). Highlight key decision points: model approvals, information delivery, change management, CDE access.',
      
      '**Naming Standards:** Follow ISO 19650-2 file naming convention structure. Document folder hierarchies (WIP/Shared/Published/Archive). Provide specific examples for your project.',
      
      '**Quality Tools:** List specific software tools (Navisworks for clash detection, Solibri for IFC validation). Define check frequencies, responsible roles, and failure actions.',
      
      '**Training Plan:** Identify training needs by role. Include ISO 19650 awareness, project-specific workflows, tool competency. Define verification methods (certificates, practical tests).',
      
      '**KPIs:** Set measurable targets for key areas: model coordination quality, delivery timeliness, data quality, RFI reduction. Assign owners and monitoring frequency.',
      
      '**Ongoing Alignment:** Establish review cycles (monthly stakeholder reviews, quarterly BEP reviews). Implement change management for scope variations. Maintain open communication channels with appointing party.'
    ],

    examples: [
      {
        title: 'Comprehensive IM Strategy (Large Commercial Project)',
        content: `**Meeting Schedule:** Weekly BIM coordination (90 min), bi-weekly design workshops (2 hours), monthly IM reviews (60 min), monthly client progress reviews (90 min). All with defined participants and standard agendas.

**RACI Reference:** Section 3.3 defines full matrices. Key decisions: Model federation approval (Accountable: Lead BIM Coordinator), Design sign-off (Accountable: Design Manager), Information delivery (Accountable: Information Manager).

**Naming Convention:** [Project Code]-[Originator]-[Volume]-[Level]-[Type]-[Role]-[Number]-[Revision]
Example: PRJ01-ARC-XX-01-M3-ARC-0001-P01.rvt
Folder structure: 00_WIP / 01_SHARED / 02_PUBLISHED / 03_ARCHIVE

**Quality Tools:** 
- Navisworks: Weekly clash detection, BIM Coordinator, 48hr resolution
- Solibri: Milestone IFC validation, Information Manager, model rejection on failure
- Custom scripts: Daily naming checks, CDE Admin, automated rejection

**Training:** 
- All team: ISO 19650 workshop (Week 1), 80% pass quiz
- BIM Authors: Naming conventions training (Week 1-2), practical test
- Coordinators: Navisworks certification (pre-project/refresher)

**KPIs:** 
- Clash density <5/1000 elements (weekly)
- 95% on-time delivery (per milestone)
- 90% first-time validation pass (per data drop)
- 40% RFI reduction vs baseline (monthly cumulative)

**Alignment Maintenance:** Monthly client workshops validating EIR alignment. Continuous KPI monitoring with >10% deviation triggering corrective actions. Quarterly BEP reviews with stakeholders. Change management integration for scope variations.`
      },
      {
        title: 'Essential IM Strategy (Medium Residential Project)',
        content: `**Meetings:** Bi-weekly coordination (60 min): BIM Manager + Coordinators. Monthly design review (90 min): All leads + client.

**RACI:** See Section 3.3. Key accountability: Model approval - BIM Manager; Design sign-off - Project Architect; Information delivery - Information Manager.

**Naming:** Standard ISO 19650 format: RES24-[Disc]-[Zone]-[Level]-[Type]-[Role]-[Num]-[Rev]
Folders: WIP / Shared / Published / Archive

**Quality Tools:** Navisworks clash detection (bi-weekly), Revit health checks (before milestones).

**Training:** Team ISO 19650 overview (Project start), tool-specific as needed.

**KPIs:** <10 critical clashes per coordination session, 90% milestone delivery on-time.

**Alignment:** Monthly client review of deliverables against EIR checklist. Quarterly BEP effectiveness review.`
      },
      {
        title: 'Lean IM Strategy (Small Extension Project)',
        content: `**Meetings:** Weekly 30-minute virtual coordination check-ins. Monthly client review meeting.

**RACI:** Project Lead accountable for all information delivery. Discipline leads responsible for their models.

**Naming:** Project standard format with simplified zones. Cloud folder structure: Draft / Review / Approved.

**Quality Tools:** Basic Revit warnings check before sharing. Simple coordination review in viewer.

**Training:** Brief project BIM requirements session at kickoff. Reference materials on shared drive.

**KPIs:** All models clash-free before client review. Deliverables submitted on agreed dates.

**Alignment:** Direct client communication. Informal monthly check that deliverables meet expectations.`
      }
    ],

    commonMistakes: [
      '❌ **Generic statements without specifics:** "We will have regular meetings and use quality tools" - Define exactly what, when, who, how often.',
      
      '❌ **Missing measurement criteria:** Strategy describes processes but no KPIs to measure effectiveness. Must include measurable targets.',
      
      '❌ **No responsibility assignment:** Processes defined but unclear who owns each activity. Must reference RACI or assign explicit accountability.',
      
      '❌ **Ignoring training needs:** Assumes team knows all processes and tools. Must address competency verification and training plans.',
      
      '❌ **Static approach:** No provision for reviews, updates, or continuous improvement. Must show how alignment will be maintained throughout lifecycle.',
      
      '❌ **Disconnected from project specifics:** Generic IM strategy not tailored to project type, size, complexity. Must align with actual project needs.',
      
      '❌ **No integration with appointing party requirements:** Strategy doesn\'t demonstrate how it delivers against specific EIR requirements.'
    ],

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are an ISO 19650 information management strategist. Generate practical alignment strategies that remain consistent with the EIR throughout delivery.',
      instructions: 'Generate content similar to the examples above. Cover the 7 aspects: meeting schedule, RACI reference, naming/folder standards (include one naming example), quality tools and check cadence, training/competency verification, KPIs with measurable targets, and ongoing alignment maintenance (review cycle and change management). Use short headings and concise paragraphs/bullets. Maximum 180 words.',
      style: 'structured headings, measurable KPIs, specific tools/cadence, ISO 19650-2 aligned'
    },

    relatedFields: ['coordinationMeetings', 'informationManagementResponsibilities', 'qaFramework', 'responsibilityMatrix', 'trainingPlan']
  },

  // ====================================================================
  // STEP 4: LEVEL OF INFORMATION NEED (LOIN)
  // ====================================================================

  informationPurposes: {
    description: `Select the purposes for which information will be used throughout the project lifecycle. This defines what the information needs to support.`,

    iso19650: `ISO 19650-1:2018 - Information purposes define why information is needed and guide the level of information need (LOIN) specification.`,

    bestPractices: [
      'Select purposes that align with project objectives and client requirements',
      'Include both design/construction and operational purposes',
      'Cover all major disciplines and use cases',
      'Ensure consistency with EIR and PIR'
    ],

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are an ISO 19650 information requirements specialist. Define clear information purposes that drive the Level of Information Need (LOIN).',
      instructions: 'List the key purposes for project information across the lifecycle (design development, coordination, construction planning, procurement, handover/operations). Use a short bullet list and align to the EIR/PIR and BIM uses. Keep it concise and project-focused. Maximum 120 words.',
      style: 'bullet list, lifecycle coverage, purpose-led, ISO 19650 language'
    },

    relatedFields: ['geometricalInfo', 'alphanumericalInfo', 'projectInformationRequirements']
  },

  geometricalInfo: {
    description: `Define the geometrical information requirements - the level of detail, accuracy, and dimensional information needed in 3D models.

Include:
• LOD (Level of Development) requirements by stage and discipline
• Accuracy and tolerance requirements
• Survey and as-built requirements
• Spatial coordination requirements
• Detail level for different elements (structure, MEP, architecture)`,

    iso19650: `ISO 19650-1:2018 Section 5.3 - Geometrical Information

Geometrical information requirements specify the detail, dimensionality, location, appearance, and parametric behavior required for information models.`,

    bestPractices: [
      'Define LOD progression through project stages (LOD 300 → 350 → 400)',
      'Specify accuracy/tolerance requirements (±5mm for surveys, etc.)',
      'Address coordination requirements between disciplines',
      'Include as-built verification requirements',
      'Reference LOD specification or similar standards',
      'Be specific about detail level for critical elements',
      'Align with project complexity and information uses'
    ],

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are a BIM geometric information specialist. Specify geometrical requirements aligned to ISO 19650 Level of Information Need.',
      instructions: 'Define geometrical information requirements by stage and discipline. Include LOD/LOIN progression, key tolerances/accuracy (with example values), coordination requirements (e.g., critical interfaces), and survey/as-built verification expectations. Keep it practical and measurable. Maximum 140 words.',
      style: 'requirements-focused, stage-based, quantifiable tolerances, ISO 19650/LOIN terminology'
    },

    relatedFields: ['alphanumericalInfo', 'informationPurposes', 'volumeStrategy']
  },

  alphanumericalInfo: {
    description: `Define the alphanumerical (non-graphical) information requirements - the properties, parameters, and data needed for model elements.

Include:
• Material specifications and properties
• Manufacturer information and part numbers
• Cost data and lifecycle information
• Performance specifications
• Asset data for FM handover (COBie)
• Maintenance schedules and warranty information`,

    iso19650: `ISO 19650-1:2018 Section 5.3 - Alphanumerical Information

Alphanumerical requirements specify properties, attributes, and parameters that must be captured for information elements to support defined purposes.`,

    bestPractices: [
      'Define data requirements aligned with information purposes',
      'Include COBie or equivalent structured data for FM handover',
      'Specify manufacturer and product data requirements',
      'Address cost data and quantities',
      'Include maintenance and warranty information',
      'Reference performance specifications (thermal, structural, etc.)',
      'Ensure consistency with client asset management requirements'
    ],

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are a BIM data requirements specialist. Specify alphanumerical information needs for models and asset data delivery.',
      instructions: 'Define required properties/attributes aligned to information purposes and PIR. Cover identification/classification, specifications/performance, manufacturer/product data, quantities/cost (where applicable), COBie/FM asset data, maintenance/warranty fields, and any required property sets/parameter naming conventions. Keep it structured and concise. Maximum 150 words.',
      style: 'structured categories, asset-data oriented, consistent naming, ISO 19650/COBie-aware'
    },

    relatedFields: ['geometricalInfo', 'documentationInfo', 'projectInformationRequirements']
  },

  documentationInfo: {
    description: `Define documentation requirements - the supporting documents, specifications, certificates, and manuals required alongside models.

Include:
• Technical specifications
• O&M (Operation & Maintenance) manuals
• Health & Safety documentation
• Commissioning reports and certificates
• Warranties and guarantees
• Training materials
• Compliance certificates`,

    iso19650: `ISO 19650-2:2018 Section 5.4 - Documentation

Documentation requirements specify non-model information deliverables necessary for asset operation, maintenance, and compliance.`,

    bestPractices: [
      'Include O&M manuals linked to model elements',
      'Specify health & safety file requirements (CDM 2015)',
      'Address commissioning and test certificates',
      'Include warranty documentation requirements',
      'Mention training materials for operators',
      'Reference compliance and certification documents',
      'Link documentation to asset data where possible'
    ],

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are a BIM documentation deliverables specialist. Define required supporting documentation alongside models.',
      instructions: 'List the required documentation deliverables (specifications, schedules, certificates, commissioning reports, O&M manuals, H&S file, warranties, training materials). Indicate expected formats (PDF/native) and note that documentation should be linked to model elements/asset data where applicable. Keep it concise. Maximum 120 words.',
      style: 'deliverable list, format-aware, compliance-focused, concise'
    },

    relatedFields: ['alphanumericalInfo', 'projectInformationRequirements']
  },

  projectInformationRequirements: {
    description: `Define the Project Information Requirements (PIR) - the information needed to support asset management and operational objectives beyond project delivery.

Address:
• Asset management system integration
• Space management and occupancy data
• Energy monitoring and performance tracking
• Maintenance planning and scheduling
• Digital twin connectivity
• Building performance analytics
• Compliance and regulatory reporting`,

    iso19650: `ISO 19650-1:2018 Section 5.1.2 - Project Information Requirements

PIR specify deliverable information to support the operational phase and ongoing asset management throughout the asset lifecycle.`,

    bestPractices: [
      'Align with client\'s CAFM or asset management systems',
      'Include space data for occupancy management',
      'Address energy and performance monitoring requirements',
      'Include preventive maintenance schedules',
      'Specify digital twin or IoT integration needs',
      'Reference regulatory reporting requirements',
      'Ensure structured data format compatibility (COBie, etc.)'
    ],

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are an ISO 19650 PIR specialist. Define operational information requirements that support asset management and the whole-life value of the asset.',
      instructions: 'Describe the PIR for operations: asset management system integration, space/occupancy data, energy monitoring, maintenance planning, digital twin/IoT connectivity, performance analytics, and compliance reporting. Specify expected structured data deliverables (e.g., COBie/asset properties) and how requirements extend beyond project delivery. Maximum 150 words.',
      style: 'operational focus, structured categories, lifecycle language, concise and specific'
    },

    relatedFields: ['alphanumericalInfo', 'documentationInfo', 'informationPurposes']
  },

  // ====================================================================
  // STEP 5: INFORMATION DELIVERY PLANNING
  // ====================================================================

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

  responsibilityMatrix: {
    description: `Create a RACI (Responsible, Accountable, Consulted, Informed) matrix defining task/activity responsibilities across the team.`,

    iso19650: `ISO 19650-2:2018 Section 5.1.3 - Roles and Responsibilities

Clear responsibility assignment ensures accountability for information production, validation, approval, and delivery.`,

    bestPractices: [
      'Use RACI format (Responsible, Accountable, Consulted, Informed)',
      'Cover all major information management activities',
      'Include model production, coordination, quality checking, approval',
      'Address CDE management and security responsibilities',
      'Ensure each activity has one Accountable party',
      'Include client and stakeholder roles where relevant'
    ],

    aiPrompt: {
      system: 'You are a project governance specialist focusing on role definition and responsibility assignment per ISO 19650 standards.',
      instructions: 'Generate a RACI (Responsible, Accountable, Consulted, Informed) matrix for BIM project activities. Cover major information management activities including model production, model coordination, quality checking, clash detection, approval workflows, CDE management, security administration, and information delivery. Include roles such as Information Manager, Lead Appointed Party, Task Team Leaders (Architecture, Structure, MEP), BIM Coordinator, Quality Manager, and Client representatives. Ensure each activity has exactly one Accountable party. Use table format with pipe separators. Maximum 180 words.',
      style: 'table format, governance-first, unambiguous roles, concise'
    },

    relatedFields: ['assignedTeamLeaders', 'informationManagementResponsibilities']
  },

  milestoneInformation: {
    description: `Define specific information requirements at each milestone in a detailed table format.`,

    iso19650: `ISO 19650-2:2018 Section 5.4 - Milestone Information Requirements

Each milestone must have clearly defined information requirements including content, format, quality level, and acceptance criteria.`,

    bestPractices: [
      'Be specific about information required at each milestone',
      'Define format requirements (IFC, native, PDF, etc.)',
      'Specify quality level or LOD for each deliverable',
      'Include acceptance criteria',
      'Address both model and non-model information',
      'Reference review and approval requirements'
    ],

    aiPrompt: {
      system: 'You are a BIM information requirements specialist focusing on milestone-based deliverable specification per ISO 19650.',
      instructions: 'Generate a detailed table of specific information requirements at each project milestone. Include 5-6 milestones aligned with RIBA stages (Stage 2, 3, 4, 5, 6, Handover). For each milestone specify: required deliverables (models, drawings, specifications, schedules), file formats (IFC, native Revit/Tekla, PDF, COBie), quality level/LOD (LOD 200-400), acceptance criteria, and approval requirements. Address both geometric model information and non-geometric documentation. Show progressive information development. Use table format with pipe separators. Maximum 180 words.',
      style: 'table format, milestone-led, acceptance criteria explicit, concise'
    },

    relatedFields: ['keyMilestones', 'geometricalInfo', 'alphanumericalInfo']
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
  },

  // ====================================================================
  // STEP 6: COMMON DATA ENVIRONMENT (CDE)
  // ====================================================================

  cdeStrategy: {
    description: `Describe the overall CDE strategy including platform selection, workflow implementation, and governance approach.`,

    iso19650: `ISO 19650-1:2018 Section 5.5 - Common Data Environment

The CDE is the agreed source of information for the project, used to collect, manage, and disseminate information through a managed process.`,

    bestPractices: [
      'Define CDE platform(s) and their specific purposes',
      'Explain workflow states (WIP, Shared, Published, Archived)',
      'Address multi-platform integration if applicable',
      'Include governance and administration approach',
      'Reference security and access control strategy',
      'Address backup and business continuity'
    ],

    aiPrompt: {
      system: 'You are an ISO 19650 information management lead. Define a Common Data Environment (CDE) strategy with governance, workflow, and security controls.',
      instructions: 'Describe the overall CDE strategy. State the selected platform(s) and what each is used for, define the workflow states (WIP, Shared, Published, Archived) and how they are implemented, and explain governance (administration, ownership, audits). Reference access control/security principles and backup/business continuity at a high level. Maximum 140 words.',
      style: 'ISO 19650 tone, governance-first, clear workflow states, concise and actionable'
    },

    relatedFields: ['cdePlatforms', 'workflowStates', 'accessControl']
  },

  cdePlatforms: {
    description: `List and describe CDE platforms in use, their purposes, information types managed, and workflow integration.`,

    iso19650: `ISO 19650-1:2018 Section 5.5 - CDE Implementation

The CDE may consist of multiple integrated platforms serving different purposes while maintaining unified information governance.`,

    bestPractices: [
      'Specify each platform and its primary purpose',
      'Define information types managed by each platform',
      'Map workflow states to each platform',
      'Explain integration between platforms',
      'Include access control per platform',
      'Address cross-platform synchronization'
    ],

    aiPrompt: {
      system: 'You are a CDE administrator. Specify CDE platforms and how they integrate while maintaining ISO 19650 governance and workflow control.',
      instructions: 'List each CDE platform in use and, for each, state: purpose, information types managed, how workflow states map (WIP/Shared/Published/Archived), key user groups/roles, and how the platform integrates with others (sync, links, single source of truth, naming/metadata). Include a brief note on access controls per platform. Maximum 160 words.',
      style: 'structured per-platform bullets, integration clarity, no marketing language, concise'
    },

    relatedFields: ['cdeStrategy', 'workflowStates', 'accessControl']
  },

  workflowStates: {
    description: `Define the CDE workflow states (WIP, Shared, Published, Archived) and transition criteria between states.`,

    iso19650: `ISO 19650-1:2018 Section 5.5.2 - Information States

Workflow states define the status and accessibility of information as it progresses from work-in-progress through to archival.`,

    bestPractices: [
      'Define all four workflow states clearly (WIP, Shared, Published, Archived)',
      'Specify access permissions for each state',
      'Define transition criteria between states',
      'Include approval requirements for state changes',
      'Address quality checking before progression',
      'Implement automated workflows where possible'
    ],

    aiPrompt: {
      system: 'You are an ISO 19650 information manager. Define CDE workflow states and objective transition criteria with clear approvals and quality gates.',
      instructions: 'Define WIP, Shared, Published, and Archived. For each state include: intent/purpose, who can access (read/write), and typical content. Then define transition criteria between states, including required checks (model/document QA), approvals/authorizations, and how status/suitability is recorded. Keep it practical and enforceable. Maximum 170 words.',
      style: 'state-by-state structure, criteria-driven, audit-friendly, concise'
    },

    relatedFields: ['cdeStrategy', 'approvalWorkflows', 'accessControl']
  },

  accessControl: {
    description: `Define access control policies including role-based permissions, authentication, and security protocols.`,

    iso19650: `ISO 19650-1:2018 Section 5.6 - Information Security

Access control ensures only authorized personnel can access, modify, or approve information based on their role and responsibilities.`,

    bestPractices: [
      'Implement role-based access control (RBAC)',
      'Use Single Sign-On (SSO) where possible',
      'Require multi-factor authentication (MFA)',
      'Define read/write permissions by discipline and workflow state',
      'Include guest access protocols with time limits',
      'Regular access audits and permission reviews',
      'Document access request and approval process'
    ],

    aiPrompt: {
      system: 'You are an information security lead for a BIM project. Define role-based access control for a CDE in line with ISO 19650 information management.',
      instructions: 'Specify access control policies for the CDE. Include RBAC roles (e.g., Admin, Information Manager, Discipline Lead, Author, Client, Contractor), authentication (SSO/MFA), permissions by workflow state (WIP/Shared/Published/Archived), and an access request/approval and periodic review process. Include guest/external access time limits and audit logging expectations. Maximum 170 words.',
      style: 'policy-style, least-privilege, role/state matrix mindset, concise'
    },

    relatedFields: ['cdeStrategy', 'workflowStates', 'securityMeasures']
  },

  securityMeasures: {
    description: `Define comprehensive security measures protecting information confidentiality, integrity, and availability.`,

    iso19650: `ISO 19650-1:2018 Section 5.6 - Information Security

Security measures must protect information from unauthorized access, modification, or loss throughout the information lifecycle.`,

    bestPractices: [
      'Implement end-to-end encryption (AES-256)',
      'Use SSL/TLS for all data transmission',
      'Regular security audits and penetration testing',
      'ISO 27001 certified infrastructure where possible',
      'Automated malware scanning',
      'GDPR and data residency compliance',
      'Security incident response procedures'
    ],

    aiPrompt: {
      system: 'You are a project information security specialist. Define proportionate security measures protecting confidentiality, integrity, and availability of BIM information.',
      instructions: 'Describe security measures for the project information environment. Cover encryption in transit (TLS) and at rest (e.g., AES-256), malware scanning, vulnerability management (patching, audits/pen tests), logging/monitoring, secure configuration, and incident response (detection, containment, reporting, lessons learned). Note GDPR/data residency where relevant. Keep it practical and aligned to CDE operations. Maximum 160 words.',
      style: 'risk-based, operational controls, clear bullets, concise'
    },

    relatedFields: ['accessControl', 'backupProcedures', 'encryptionRequirements']
  },

  backupProcedures: {
    description: `Define backup and disaster recovery procedures ensuring information protection and business continuity.`,

    iso19650: `ISO 19650-1:2018 Section 5.6 - Information Protection

Backup procedures must ensure information can be recovered in case of data loss, corruption, or system failure.`,

    bestPractices: [
      'Automated daily backups with 30-day retention',
      'Weekly full system backups with extended retention',
      'Geo-redundant storage across multiple data centers',
      'Define Recovery Point Objective (RPO) and Recovery Time Objective (RTO)',
      'Regular backup integrity testing',
      'Documented restoration procedures',
      'Monthly backup verification reports'
    ],

    aiPrompt: {
      system: 'You are an IT resilience lead supporting ISO 19650 information management. Define backup and disaster recovery procedures for a CDE and project data.',
      instructions: 'Define backup and disaster recovery arrangements. Include backup frequency (daily incremental, weekly full), retention periods, offsite/geo-redundant storage, and RPO/RTO targets. Describe integrity testing, restoration steps and responsibilities, and how backup status is reported (e.g., monthly verification). Mention business continuity considerations for CDE outages. Maximum 170 words.',
      style: 'operational, measurable (RPO/RTO/retention), responsibilities clear, concise'
    },

    relatedFields: ['cdeStrategy', 'securityMeasures', 'contingencyPlans']
  },

  // ====================================================================
  // SECTION 7 - TECHNOLOGY AND SOFTWARE REQUIREMENTS
  // ====================================================================

  hardwareRequirements: {
    description: `Specify the hardware requirements necessary to support BIM activities throughout the project. This includes workstations, servers, mobile devices, and any specialized equipment.

Include:
• Workstation specifications (CPU, RAM, GPU, storage)
• Server requirements for model hosting and collaboration
• Mobile devices for site access and coordination
• Networking infrastructure requirements
• Backup and storage systems
• Virtual/cloud computing resources if applicable`,

    iso19650: `ISO 19650-2:2018 Section 5.1.4 - Mobilization of Resources

The delivery team must have adequate IT infrastructure and hardware capacity to produce, manage, and exchange project information effectively.`,

    bestPractices: [
      'Specify minimum workstation specs: 16GB+ RAM, dedicated GPU for 3D modeling',
      'Include mobile workstations/laptops for site coordination teams',
      'Define server capacity for model hosting and CDE operations',
      'Specify network bandwidth requirements (min 100Mbps for large model transfers)',
      'Include backup storage capacity (3x project data size recommended)',
      'Define graphics card requirements (NVIDIA Quadro or equivalent for Revit/Navisworks)',
      'Mention SSD storage for improved model performance',
      'Include tablet/mobile device specs for site inspections'
    ],

    examples: {
      'Commercial Building': `Hardware requirements for project delivery:

Workstations (Design Team):
• CPU: Intel i7 or AMD Ryzen 7 (8+ cores)
• RAM: 32GB minimum (64GB for complex MEP models)
• GPU: NVIDIA Quadro P2200 or equivalent (6GB VRAM)
• Storage: 1TB NVMe SSD + 2TB HDD
• Displays: Dual 27" monitors (minimum 1920x1080)

Server Infrastructure:
• Model hosting server: Windows Server 2019, 128GB RAM, RAID 10 storage
• CDE server: Cloud-based (BIM 360) + local backup server
• Network: 1Gbps internal network, 100Mbps internet connection

Site Coordination:
• Mobile workstations: 16GB RAM, dedicated GPU, 15" displays
• Tablets: iPad Pro or equivalent for site inspections (Navisworks Freedom)
• Backup: 10TB NAS with RAID 6 configuration`,

      'Infrastructure': `Hardware specifications for infrastructure project:

Engineering Workstations:
• CPU: Intel Xeon or AMD Threadripper (12+ cores for Civil 3D)
• RAM: 64GB (128GB for large corridor models)
• GPU: NVIDIA Quadro RTX 4000 (8GB VRAM)
• Storage: 2TB NVMe SSD for project files
• Network: 10Gbps fiber connection to office network

Mobile Survey Equipment:
• Ruggedized laptops for site surveys (16GB RAM, dedicated GPS)
• Tablets for construction inspections
• Mobile scanning workstations for point cloud processing

Cloud Infrastructure:
• Azure/AWS instances for heavy computational tasks (drainage analysis)
• 50TB cloud storage for point cloud and survey data
• Geo-redundant backup across multiple data centers`
    },

    commonMistakes: [
      'Generic specs like "modern computer" without specific requirements',
      'Insufficient RAM for large federated models (below 16GB)',
      'No dedicated GPU specified - integrated graphics insufficient for BIM',
      'Missing mobile/tablet requirements for site coordination',
      'No server or backup infrastructure mentioned',
      'Inadequate network bandwidth for large model transfers',
      'Not considering storage growth over project lifecycle',
      'Missing cloud computing resources for analysis and rendering'
    ],

    aiPrompt: {
      system: 'You are a BIM IT lead. Specify role-appropriate hardware and compute requirements to reliably deliver BIM workflows and meet ISO 19650 mobilization needs.',
      instructions: 'Specify hardware requirements for BIM delivery. Provide minimum workstation specs (CPU/RAM/GPU/SSD) for authors and coordinators, server/storage needs (capacity, RAID, backups), mobile/site devices, and any specialist equipment. Include any cloud/virtual compute requirements for heavy tasks (point clouds, rendering, analysis). Keep it specific with measurable specs and note scalability for peak periods. Maximum 170 words.',
      style: 'spec-driven, role-based, measurable thresholds, concise'
    },

    relatedFields: ['bimSoftware', 'networkRequirements', 'cdeStrategy']
  },

  networkRequirements: {
    description: `Define network infrastructure and connectivity requirements to support collaborative BIM workflows, model sharing, and CDE access.

Specify:
• Internet bandwidth requirements
• Internal network specifications
• VPN/remote access capabilities
• Latency requirements for real-time collaboration
• Network security protocols
• Redundancy and failover provisions`,

    iso19650: `ISO 19650-2:2018 Section 5.1.4 - Information Technology

Adequate network infrastructure is essential for the timely exchange of information and collaborative working in a CDE environment.`,

    bestPractices: [
      'Minimum 100Mbps dedicated internet for cloud CDE access',
      'Gigabit internal network (1Gbps) for local file transfers',
      'VPN with minimum 50Mbps bandwidth for remote working',
      'Low latency (<50ms) for real-time model collaboration',
      'Redundant internet connections for business continuity',
      'Secure WiFi for site access and mobile coordination',
      'Quality of Service (QoS) policies prioritizing CDE traffic',
      'Define upload/download bandwidth allocation per user'
    ],

    examples: {
      'Commercial Building': `Network infrastructure requirements:

Office Network:
• Internal: 1Gbps wired network, CAT6 cabling throughout
• Internet: 500Mbps fiber with automatic failover to 100Mbps backup
• WiFi: Dual-band 802.11ac for mobile devices and meeting rooms
• Latency: <20ms to CDE cloud servers (BIM 360 UK region)

Remote Access:
• VPN: IPSec VPN with 100Mbps capacity supporting 50 concurrent users
• Cloud Desktop: Citrix/RemoteApp for secure model access
• Two-factor authentication for all remote connections

Site Network:
• Temporary 100Mbps fiber to site office
• 4G backup connection with unlimited data
• Secure WiFi for contractor access to coordination models
• Dedicated VLAN for BIM coordination activities`,

      'Infrastructure': `Network specifications for distributed project team:

Primary Office:
• 1Gbps fiber internet with geo-redundant failover
• 10Gbps internal network for large point cloud transfers
• Network Attached Storage (NAS) with 10Gbps connection
• Site-to-site VPN connecting multiple office locations (100Mbps)

Field Operations:
• Mobile broadband (4G/5G) with 50GB monthly data per device
• Satellite backup for remote survey locations
• Mesh WiFi network across construction sites
• Secure portal for contractor/supplier model access

Cloud Infrastructure:
• Direct cloud connectivity (Azure ExpressRoute) for computational workloads
• Content Delivery Network (CDN) for efficient model distribution
• 99.9% uptime SLA with load balancing across regions`
    },

    commonMistakes: [
      'Insufficient bandwidth for large model uploads/downloads',
      'No redundancy or failover provisions',
      'Missing VPN/remote access specifications',
      'Inadequate site network for construction phase coordination',
      'No latency requirements specified for cloud collaboration',
      'Missing security protocols (firewall, encryption)',
      'Not accounting for multiple concurrent users',
      'No WiFi provision for mobile/tablet access'
    ],

    aiPrompt: {
      system: 'You are an IT infrastructure specialist for BIM collaboration. Define network requirements that enable secure, reliable CDE access and model exchange.',
      instructions: 'Define network requirements: internet bandwidth targets, internal LAN speed, VPN/remote access capacity, latency expectations for cloud collaboration, redundancy/failover, and site connectivity. Include security controls (firewalls, secure WiFi, encryption) and QoS guidance prioritizing CDE traffic. Keep values measurable and sized for concurrent users. Maximum 170 words.',
      style: 'performance + security balanced, measurable targets, structured bullets, concise'
    },

    relatedFields: ['hardwareRequirements', 'cdeStrategy', 'securityMeasures']
  },

  interoperabilityNeeds: {
    description: `Define interoperability requirements ensuring seamless data exchange between different software platforms, disciplines, and project stakeholders.

Address:
• File format standards (IFC, BCF, COBie)
• Data exchange protocols between different authoring tools
• Integration requirements with client systems
• API and automation requirements
• Version compatibility requirements
• Data validation and quality checking`,

    iso19650: `ISO 19650-2:2018 Section 5.3 - Information Standard

Interoperability ensures that information can be exchanged and used effectively across different software applications and platforms throughout the project lifecycle.`,

    bestPractices: [
      'IFC 4 as primary interoperability format for model exchange',
      'BCF 2.1/3.0 for issue management across platforms',
      'Define Model View Definitions (MVD) for IFC exports',
      'Specify COBie format version for FM handover',
      'PDF/A for long-term archival of documentation',
      'API integration for automated data exchange where applicable',
      'Maintain software version compatibility matrix',
      'Define data validation procedures for format conversions'
    ],

    examples: {
      'Commercial Building': `Interoperability strategy:

Model Exchange:
• IFC 4 Coordination View for cross-discipline coordination (weekly federation)
• Native file formats retained for authoring (Revit RVT, Tekla .model)
• DWG exports for 2D coordination with non-BIM contractors
• NWD/NWF for federated coordination models (Navisworks)

Data Exchange:
• BCF 2.1 for clash detection and issue tracking (BIM 360 Issues)
• COBie 2.4 for FM handover (extracted via Revit/Solibri)
• Excel/CSV for schedule and quantity data exchange
• XML/JSON for equipment data integration with CAFM system

Validation:
• Solibri Model Checker for IFC validation and rule-checking
• Pre-export validation in native software (Revit Export Checker)
• Post-export geometry verification (IFC viewer comparison)
• Automated validation workflows triggered on model uploads`,

      'Infrastructure': `Interoperability requirements for infrastructure delivery:

Design Data Exchange:
• IFC 4.1 Infrastructure for bridge and road geometry exchange
• LandXML for road alignment and corridor data
• CityGML for urban context and planning integration
• Industry Foundation Classes for bridge components

GIS Integration:
• Shapefile/GeoJSON for linear asset data export
• Integration with client GIS systems (ArcGIS/QGIS)
• Coordinate reference systems: OSGB36/WGS84 transformation
• Automated data sync from design models to asset management systems

Survey Data:
• LAS/LAZ for point cloud data exchange
• E57 for multi-scanner point cloud consolidation
• Triangulated mesh export (OBJ/FBX) for visualization
• GPS/GNSS data integration for as-built verification`
    },

    commonMistakes: [
      'Relying solely on native file formats (Revit RVT only)',
      'Not specifying IFC Model View Definitions (MVD)',
      'Missing validation procedures for format conversions',
      'No COBie specification for FM handover',
      'Insufficient testing of interoperability workflows',
      'Not addressing coordinate system transformations',
      'Missing API integration opportunities for automation',
      'No fallback strategy when interoperability fails'
    ],

    aiPrompt: {
      system: 'You are a BIM interoperability specialist. Define exchange standards and validation so information can be reliably used across tools and stakeholders.',
      instructions: 'Define interoperability requirements. Specify primary exchange formats (IFC version + intended MVD), issue format (BCF), FM handover dataset (COBie), and any GIS/alignment formats where relevant. Include version compatibility expectations, coordinate system rules, and validation steps before/after export (rule checks, viewer verification, error thresholds). Mention API/automation integration only where it supports controlled exchange. Maximum 180 words.',
      style: 'standards-led, validation-focused, tool-agnostic, concise'
    },

    relatedFields: ['bimSoftware', 'fileFormats', 'federationStrategy', 'projectInformationRequirements']
  },

  federationStrategy: {
    description: `Describe your strategy for federating discipline models into a coordinated whole-project model for clash detection, design coordination, and stakeholder visualization.

Cover:
• Federation frequency and triggers
• Which disciplines/models will be federated
• Federated model hosting and access
• Clash detection workflows
• Version control and model referencing
• Coordination workflows and responsibilities`,

    iso19650: `ISO 19650-2:2018 Section 5.3 - Collaborative Production of Information

Federation enables the integration of information from multiple task teams to create a coordinated information model for validation and exchange.`,

    bestPractices: [
      'Weekly automated federation of all discipline models',
      'Federate architecture, structure, MEP, civil models at minimum',
      'Use Navisworks, Solibri, or similar for federation platform',
      'Establish clash detection tolerance (e.g., 25mm hard clash threshold)',
      'Define clash ownership and resolution responsibilities',
      'Maintain version control - federate only approved/shared models',
      'Create discipline-specific clash matrices (which disciplines clash against which)',
      'Generate automated clash reports distributed to task teams'
    ],

    examples: {
      'Commercial Building': `Federation strategy for coordinated design delivery:

Federation Schedule:
• Weekly federation every Friday 5pm (design phase)
• Daily federation during construction documentation (final 6 weeks)
• Ad-hoc federation for critical coordination reviews

Federated Models:
• Architecture (Revit): external envelope, core, fit-out
• Structure (Revit/Tekla): foundations, frame, connections
• MEP Services (Revit): HVAC, plumbing, electrical, fire protection
• Landscape (Revit/Civil 3D): external works, drainage
• Point cloud (ReCap): existing conditions reference

Federation Platform:
• Navisworks Manage for primary federation and clash detection
• BIM 360 Glue for cloud-based stakeholder reviews
• Solibri Model Checker for quality validation

Clash Detection:
• Hard clashes: 25mm tolerance, resolved within 48 hours
• Soft clashes: 50mm clearance zones, resolved within 1 week
• Clash matrix: MEP vs Structure (priority), MEP vs Architecture, Architecture vs Structure
• Weekly clash report distributed Monday morning with assigned responsibilities`,

      'Infrastructure': `Federation approach for infrastructure coordination:

Model Federation:
• Highway alignment and corridors (Civil 3D)
• Bridge structures (Tekla Structures)
• Drainage networks (Civil 3D/InfoDrainage)
• Utilities diversions (MicroStation/AutoCAD)
• Existing ground survey (point cloud + terrain model)

Coordination Process:
• Fortnightly federation during preliminary/detailed design
• Weekly federation during construction documentation phase
• Clash detection focus: utilities conflicts, structure-drainage clashes, road-bridge interface
• 4D sequencing federation for traffic management planning
• Navisworks for visualization and stakeholder presentations

Quality Checks:
• Vertical/horizontal alignment continuity validation
• Drainage gradient and invert level checking
• Clearance envelopes for road/rail infrastructure
• Utilities depth and separation distance compliance`
    },

    commonMistakes: [
      'Infrequent federation leading to late clash discovery',
      'No clear clash detection tolerance or criteria defined',
      'Missing disciplines from federation (landscape, external works)',
      'No clash ownership or resolution workflow established',
      'Federating work-in-progress models instead of approved versions',
      'No clash matrix defining priority coordination areas',
      'Missing 4D sequencing integration for construction coordination',
      'No stakeholder access to federated coordination models'
    ],

    aiPrompt: {
      system: 'You are a BIM federation and coordination expert specializing in multi-discipline model integration per ISO 19650.',
      instructions: 'Generate a federation strategy for integrating discipline models into a coordinated whole-project model. Include: federation frequency and triggers (weekly automated/ad-hoc), disciplines/models to be federated (Architecture, Structure, MEP, Civil, Landscape), federated model hosting platform (Navisworks, Solibri, BIM 360), clash detection workflows with tolerance thresholds (25mm hard clash), clash ownership matrix and resolution responsibilities, version control ensuring only approved models are federated, coordination meeting schedules, and stakeholder access arrangements. Address both design phase and construction documentation phase approaches. Use structured paragraphs. Maximum 180 words.',
      style: 'ISO 19650 tone, coordination-focused, structured, concise'
    },

    relatedFields: ['volumeStrategy', 'clashDetectionWorkflow', 'modelReferencing3d', 'coordinationMeetings']
  },

  informationBreakdownStrategy: {
    description: `Define how project information will be broken down and organized into manageable components, models, and deliverables. This includes model breakdown by discipline, zone, level, or building, ensuring efficient coordination and file management.

Address:
• Model breakdown approach (by discipline, zone, building, phase)
• Rationale for breakdown strategy
• Model linking and referencing strategy
• How breakdown supports coordination workflows
• Alignment with project phases and delivery milestones`,

    iso19650: `ISO 19650-1:2018 Section 3.3.3 - Information Container

Information should be broken down into logical containers that facilitate management, exchange, and coordination while preventing models from becoming unmanageably large.`,

    bestPractices: [
      'Break models by discipline first (Architecture, Structure, MEP)',
      'Further subdivide large projects by building, zone, or level',
      'Keep individual model file sizes under 500MB for performance',
      'Use linked/referenced models rather than single monolithic models',
      'Align model breakdown with contract packages where possible',
      'Consider phasing requirements (existing, demolition, new construction)',
      'Define clear model boundaries and overlap zones',
      'Create separate models for site, landscape, external works'
    ],

    examples: {
      'Commercial Building': `Information breakdown for multi-building office complex:

Primary Breakdown (by Building):
• Building A (Main Tower - 15 floors)
• Building B (Annex - 5 floors)
• Podium (shared 2-level basement + ground floor retail)
• External Works (landscape, parking, site infrastructure)

Secondary Breakdown (by Discipline per Building):
Building A Models:
• A-ARC-CORE (vertical circulation, cores, structure)
• A-ARC-ENVELOPE (facade, cladding, roofing)
• A-ARC-FITOUT (internal partitions, floors 1-5, 6-10, 11-15 separate models)
• A-STR (structure - foundations, frame, connections)
• A-MEP-HVAC (mechanical services)
• A-MEP-PLUMBING (plumbing, drainage, sprinklers)
• A-MEP-ELECTRICAL (power, lighting, data)

Rationale:
• Building-based breakdown aligns with construction sequencing
• Floor-range breakdown for fit-out prevents large file sizes
• Separate core model enables independent vertical coordination
• Discipline separation allows parallel team working
• Linked model approach enables whole-building federation`,

      'Infrastructure': `Information breakdown for highway improvement scheme:

Geographic Breakdown (by Chainage):
• Ch 0+000 to 2+000 (Junction 1 and approach)
• Ch 2+000 to 5+500 (Main dual carriageway)
• Ch 5+500 to 8+000 (Junction 2 and tie-in)
• Ch 8+000 to 12+000 (Single carriageway section)

Discipline Models (per geographic zone):
• Highway alignment and pavement (Civil 3D corridors)
• Earthworks and drainage (Civil 3D surfaces and networks)
• Structures (Tekla - bridges, retaining walls, culverts per structure)
• Utilities diversions (MicroStation - per utility type)

Phasing Models:
• Existing ground model (survey data)
• Demolition phase (existing infrastructure removal)
• Construction phases 1-4 (aligned with traffic management)
• Final as-built model

Rationale:
• Chainage breakdown aligns with highway stationing conventions
• Structure-specific models enable detailed coordination
• Phasing models support 4D construction sequencing
• Separate utilities models facilitate coordination with statutory undertakers`
    },

    commonMistakes: [
      'Creating single monolithic models that are slow and difficult to coordinate',
      'No clear rationale for breakdown strategy',
      'Model boundaries not aligned with contract packages',
      'Overlapping model zones creating duplicate geometry',
      'Too many small models creating coordination complexity',
      'Not considering file performance and size constraints',
      'Missing phasing models for construction sequencing',
      'No site/external works models (only buildings modeled)'
    ],

    aiPrompt: {
      system: 'You are a BIM information architecture specialist focusing on model breakdown strategies and information organization per ISO 19650.',
      instructions: 'Generate an information breakdown strategy defining how project information will be broken down into manageable models and deliverables. Include: model breakdown approach by discipline (Architecture, Structure, MEP), further subdivision by building/zone/level for large projects, rationale for breakdown strategy (performance, coordination, contract alignment), model linking and referencing approach, file size management (target <500MB per model), phasing requirements (existing, demolition, new construction), clear model boundaries and overlap zones, and alignment with delivery milestones. Address both buildings and external works. Use structured paragraphs. Maximum 180 words.',
      style: 'information containers, performance-aware, ISO 19650 tone, concise'
    },

    relatedFields: ['volumeStrategy', 'federationStrategy', 'fileStructure', 'namingConventions']
  },

  federationProcess: {
    description: `Define the detailed procedures and workflows for creating, validating, and distributing federated coordination models.

Include:
• Step-by-step federation process
• Model preparation and validation before federation
• Federation software and tools
• Quality checking procedures
• Distribution and access to federated models
• Frequency and triggers for federation
• Roles and responsibilities`,

    iso19650: `ISO 19650-2:2018 Section 5.4.4 - Information Model Review

Federated information models must undergo systematic review and validation to ensure they meet quality standards and coordination requirements before being used for decision-making.`,

    bestPractices: [
      'Define pre-federation validation checklist for each discipline',
      'Automated federation triggered by model publication to CDE',
      'Clash detection run automatically on federated model',
      'Produce federation report including clash summary and model metrics',
      'Distribute federated model through CDE with controlled access',
      'Weekly coordination meetings to review federated model and clashes',
      'Document federation versions with change logs',
      'Define escalation process for critical clashes or coordination issues'
    ],

    examples: {
      'Commercial Building': `Detailed federation workflow:

**Week 1-4 (Design Development):**

Monday - Friday:
1. Discipline teams work on individual models
2. Internal team model validation (geometry, parameters, clash checking)
3. Models shared to CDE "Work in Progress" on Wednesday for review

Friday 3pm - Formal Model Publication:
1. Each discipline publishes approved model to CDE "Shared" folder
2. Discipline lead validates model meets publication checklist:
   - Correct coordinate system and levels
   - Proper naming conventions
   - Required parameters populated
   - Internal discipline clashes resolved
   - Model optimized (purge, audit, workset cleanup)

Friday 4pm - Automated Federation:
1. BIM Coordinator initiates federation in Navisworks
2. Load all published discipline models from CDE Shared folder
3. Apply appearance overrides and search sets
4. Run automated clash detection (hard clash <25mm)
5. Generate clash report with screenshots and assignments
6. Publish federated NWD file to CDE

Monday 9am - Coordination Meeting:
1. Review federated model with all discipline leads
2. Distribute clash report with assigned responsibilities
3. Prioritize critical clashes for immediate resolution
4. Review design coordination issues and RFIs
5. Validate previous week's clash resolutions

Monday-Friday - Clash Resolution:
1. Disciplines resolve assigned clashes in native models
2. BCF issues created for complex coordination
3. Revalidate resolved clashes in federated model`,

      'Infrastructure': `Infrastructure federation procedure:

**Fortnightly Coordination Cycle:**

Day 1-10: Design Development
- Highway team updates alignment and pavement models (Civil 3D)
- Structures team models bridge/retaining wall details (Tekla)
- Drainage team updates surface water and foul networks (InfoDrainage)
- Utilities team coordinates diversions with statutory undertakers

Day 11: Model Freeze and Validation
- 5pm deadline for discipline model publication to CDE
- Each team validates:
  * Coordinate system alignment to OS grid
  * Vertical datum consistency
  * IFC export validation
  * Internal clash checking complete

Day 12: Federation and Clash Detection
- BIM Coordinator federates all discipline models
- Automated clash detection focusing on:
  * Utilities vs. drainage conflicts
  * Bridge structure vs. highway profile
  * Retaining walls vs. earthworks
  * Drainage gradients and invert levels
- Generate clash matrix and priority ranking

Day 13: Coordination Workshop
- Half-day workshop with all discipline leads
- Review federated model and critical clashes
- Resolve simple clashes in real-time
- Assign complex clashes with resolution deadlines
- Update coordination register

Day 14-Next Cycle: Iterative Resolution
- Disciplines resolve clashes and update models
- Ad-hoc mini-federations for critical areas if needed`
    },

    commonMistakes: [
      'No pre-federation validation checklist leading to poor quality input models',
      'Manual federation process that is time-consuming and error-prone',
      'Infrequent federation causing late discovery of coordination issues',
      'No defined clash ownership or resolution workflow',
      'Federating draft/work-in-progress models instead of approved versions',
      'No coordination meetings to review federated models collectively',
      'Missing automated clash detection and reporting',
      'No version control or change tracking of federated models'
    ],

    aiPrompt: {
      system: 'You are a BIM coordination workflow specialist focusing on detailed federation procedures and quality validation per ISO 19650.',
      instructions: 'Generate detailed federation process procedures for creating, validating, and distributing federated coordination models. Include step-by-step workflow: model preparation and pre-federation validation checklist (coordinate system, naming conventions, internal clashes resolved), federation software and tools (Navisworks/Solibri), automated federation triggered by CDE publication, automated clash detection execution (25mm tolerance), federation report generation with clash summary and model metrics, quality checking procedures, distribution through CDE with controlled access, coordination meeting schedule (weekly), roles and responsibilities (BIM Coordinator, Discipline Leads), and escalation process for critical issues. Use structured paragraphs with numbered steps. Maximum 180 words.',
      style: 'numbered steps, procedural, ISO 19650 tone, concise'
    },

    relatedFields: ['federationStrategy', 'clashDetectionWorkflow', 'coordinationMeetings', 'modelValidation']
  },

  softwareHardwareInfrastructure: {
    description: `Provide a comprehensive matrix of all software, hardware, and IT infrastructure components required for BIM delivery.

This table should categorize and detail:
• Software applications (authoring, analysis, coordination, FM)
• Hardware specifications (workstations, servers, mobile devices)
• IT infrastructure (network, storage, backup, security)
• Purpose and usage of each component`,

    iso19650: `ISO 19650-2:2018 Section 5.1.4 - Mobilization of Resources

The delivery team must establish and maintain the necessary information technology infrastructure to support information management activities throughout the project.`,

    bestPractices: [
      'Categorize by: Software Applications, Hardware, Network Infrastructure, Security',
      'Include version numbers and license counts for software',
      'Specify minimum hardware specifications for each role',
      'Define storage capacity requirements with growth projections',
      'Include backup and disaster recovery infrastructure',
      'Specify cloud vs. on-premise infrastructure',
      'Define mobile/remote access infrastructure',
      'Include specialized equipment (scanners, VR, etc.) if applicable'
    ],

    examples: {
      'Commercial Building': `Sample infrastructure matrix table entries:

**Category: Software Applications**
| Item | Specification | Purpose |
|------|--------------|---------|
| Autodesk Revit 2024 | 25 licenses | Architectural & MEP modeling |
| Tekla Structures 2024 | 5 licenses | Structural steel detailing |
| Navisworks Manage 2024 | 10 licenses | Model coordination & clash detection |
| Solibri Model Checker | 3 licenses | Quality validation & code checking |
| BIM 360 Design | 50 users | Cloud CDE & collaboration |

**Category: Hardware**
| Item | Specification | Purpose |
|------|--------------|---------|
| Design Workstations | Intel i7, 32GB RAM, Quadro P2200, 1TB SSD | BIM authoring (15 units) |
| Coordination Workstations | Intel i9, 64GB RAM, RTX 4000, 2TB SSD | Federated model review (3 units) |
| Site Tablets | iPad Pro 12.9", 256GB | Mobile site coordination (5 units) |
| Model Server | Windows Server 2022, 128GB RAM, RAID 10 | Model hosting & sharing |

**Category: Network Infrastructure**
| Item | Specification | Purpose |
|------|--------------|---------|
| Office Internet | 500Mbps fiber + 100Mbps backup | CDE access & file transfers |
| Internal Network | 1Gbps switched ethernet | Local file sharing |
| VPN | IPSec VPN, 100Mbps capacity | Remote access (50 users) |
| NAS Storage | 20TB RAID 6 | Project file backup |`,

      'Infrastructure': `Infrastructure project matrix:

**Category: Software**
| Item | Specification | Purpose |
|------|--------------|---------|
| Civil 3D 2024 | 15 licenses | Highway & drainage design |
| 12d Model v15 | 10 licenses | Road design & earthworks |
| Tekla Structures 2024 | 8 licenses | Bridge & structure detailing |
| Navisworks Manage 2024 | 5 licenses | Coordination & 4D sequencing |
| Trimble Connect | 40 users | CDE & field collaboration |

**Category: Hardware**
| Item | Specification | Purpose |
|------|--------------|---------|
| Engineering Workstations | Xeon, 64GB RAM, Quadro RTX 4000 | Design & analysis (12 units) |
| Survey Laptops | Ruggedized, 16GB RAM, GPS | Field surveys (4 units) |
| Point Cloud Workstation | Threadripper, 128GB RAM, RTX 5000 | Point cloud processing |
| Cloud Compute | Azure VMs (scalable) | Heavy computational tasks |

**Category: Infrastructure**
| Item | Specification | Purpose |
|------|--------------|---------|
| Cloud Storage | 50TB Azure/AWS | Point clouds & large datasets |
| Backup System | Geo-redundant, 30TB | Disaster recovery |
| Site Network | 4G/5G mobile broadband | Construction site connectivity |`
    },

    commonMistakes: [
      'No version numbers specified for software',
      'Missing license counts or user allocations',
      'Generic hardware specs without role-specific requirements',
      'No backup or disaster recovery infrastructure listed',
      'Missing mobile/field equipment for construction phase',
      'No cloud infrastructure for collaboration or computation',
      'Incomplete network specifications (bandwidth, redundancy)',
      'Not categorizing items logically (mixing software/hardware)'
    ],

    aiPrompt: {
      system: 'You are a BIM technology mobilization lead. Create a clear infrastructure matrix covering software, hardware, and IT services needed for ISO 19650 delivery.',
      instructions: 'Provide a categorized matrix of required software, hardware, and IT infrastructure. Use categories such as Software Applications, Hardware, Network/Connectivity, Storage/Backup, and Security. For each row include item name, specification (version, license count, key hardware specs, capacity/bandwidth), and purpose/usage. Ensure it supports CDE access, federation/clash workflows, and site/field use where applicable. Maximum 170 words.',
      style: 'table/matrix-oriented, categorized, measurable specs, concise'
    },

    relatedFields: ['bimSoftware', 'hardwareRequirements', 'networkRequirements', 'cdeStrategy']
  },

  documentControlInfo: {
    description: `Define document control procedures ensuring consistent identification, versioning, approval, and distribution of all project information and documentation.

Cover:
• Document numbering and naming conventions
• Revision control procedures
• Approval and authorization workflows
• Status codes and suitability definitions
• Distribution and access control
• Document register maintenance
• Compliance with ISO 19650 naming standards`,

    iso19650: `ISO 19650-2:2018 Section 5.1.6 - Establishment of Information Standard

Document control procedures must ensure that information containers (files, documents, models) are uniquely identifiable, versioned appropriately, and managed in accordance with the project's information standard.`,

    bestPractices: [
      'Use ISO 19650-2 naming convention: Project-Originator-Volume-Level-Type-Role-Number',
      'Define suitability codes (S0-S7 per ISO 19650)',
      'Implement revision codes (P01-P99 for draft, C01-C99 for issued)',
      'Maintain central document register in CDE',
      'Define approval matrix (Author-Checker-Approver)',
      'Automate document numbering where possible',
      'Use metadata for searchability and filtering',
      'Implement audit trails for all document changes'
    ],

    examples: {
      'Commercial Building': `Document control framework:

**Naming Convention:**
Format: [Project]-[Originator]-[Volume]-[Level]-[Type]-[Role]-[Number]

Example: GF-SAA-A-L03-M3-ARC-0001
• GF = Greenfield Project
• SAA = Smith & Associates Architects
• A = Building A
• L03 = Level 03
• M3 = Model (3D)
• ARC = Architecture
• 0001 = Sequential number

**Suitability Codes (ISO 19650-2):**
• S0 = Initial status, work in progress
• S1 = Suitable for Coordination
• S2 = Suitable for Information
• S3 = Suitable for Review & Comment
• S4 = Suitable for Stage Approval
• S6 = Suitable for PIM Authorization (As-built)

**Revision Control:**
• P01-P99 = Work in Progress revisions
• C01-C99 = Client issued revisions
• Version stored with timestamp in CDE
• Previous revisions archived but accessible

**Approval Workflow:**
1. Author creates document (S0 status)
2. Discipline Checker reviews (48-hour SLA)
3. Discipline Lead approves and assigns suitability code
4. Document published to CDE Shared folder
5. Client review and approval for milestone submissions (S4)
6. Final authorization for handover (S6)`,

      'Infrastructure': `Document control for infrastructure delivery:

**File Naming:**
Format: [Project]-[Type]-[Discipline]-[Zone]-[Doc Type]-[Number]-[Revision]

Example: A45JI-DWG-HW-CH2K-GA-0042-C03
• A45JI = A45 Junction Improvement
• DWG = Drawing
• HW = Highway
• CH2K = Chainage 2+000
• GA = General Arrangement
• 0042 = Drawing number
• C03 = Client revision 03

**Document Types:**
• DWG = Drawings
• MOD = 3D Model
• RPT = Reports
• SPEC = Specifications
• CALC = Calculations
• SCHED = Schedules

**Status Codes:**
• WIP = Work in Progress (internal only)
• IFC = Issued for Comment
• IFA = Issued for Approval
• IFI = Issued for Information
• IFC = Issued for Construction
• ABC = As-Built Construction

**Document Register:**
Maintained in CDE with searchable fields:
- Document number
- Title/description
- Originator/author
- Date created/modified
- Current revision and status
- Next planned update
- Related documents/models`
    },

    commonMistakes: [
      'Inconsistent naming conventions across disciplines',
      'No clear revision control procedures',
      'Missing suitability codes or status definitions',
      'No central document register maintained',
      'Approval workflows not defined or enforced',
      'Version control managed manually instead of through CDE',
      'No audit trail of document changes and approvals',
      'Non-compliant with ISO 19650 naming standards'
    ],

    aiPrompt: {
      system: 'You are a document control and information management specialist focusing on ISO 19650-compliant procedures and standards.',
      instructions: 'Generate document control procedures ensuring consistent identification, versioning, approval, and distribution of all project information. Include: ISO 19650-2 naming convention (Project-Originator-Volume-Level-Type-Role-Number with example), suitability codes (S0-S7) with definitions, revision control procedures (P01-P99 for drafts, C01-C99 for issued), approval and authorization workflows (Author-Checker-Approver matrix), status codes for workflow states (WIP, Shared, Published, Archived), central document register maintenance in CDE, distribution and access control procedures, automated document numbering where possible, metadata standards, and audit trail requirements. Use structured paragraphs organized by topic. Maximum 190 words.',
      style: 'professional, ISO 19650 tone, structured by topic, concise'
    },

    relatedFields: ['namingConventions', 'cdeStrategy', 'workflowStates', 'approvalWorkflows']
  },

  // ====================================================================
  // SECTION 8 - INFORMATION PRODUCTION METHODS AND PROCEDURES
  // ====================================================================

  modelingStandards: {
    description: `Define the modeling standards and guidelines that all project team members must follow to ensure consistency, quality, and interoperability of BIM models.

Include standards for:
• Model structure and organization (levels, grids, views)
• Element modeling conventions (LOD, accuracy, detail)
• Parameter and property data standards
• View templates and graphic standards
• Worksets and collaboration workflows
• Quality checking and validation rules`,

    iso19650: `ISO 19650-2:2018 Section 5.3 - Information Standard

Consistent modeling standards ensure that information is produced to a defined quality level and can be effectively coordinated, exchanged, and used throughout the project lifecycle.`,

    bestPractices: [
      'Reference industry standards: ISO 19650, PAS 1192, BS 1192',
      'Define Level of Information Need (LOIN) for each project stage',
      'Specify LOD requirements by element type and project phase',
      'Create template files with pre-configured levels, grids, parameters',
      'Define view templates for consistent drawing production',
      'Establish workset strategy for multi-user collaboration',
      'Define element classification system (Uniclass 2015, Omniclass)',
      'Include quality validation rules and automated checking procedures'
    ],

    examples: {
      'Commercial Building': `Modeling standards for office project:

**LOD Requirements by Stage:**
• RIBA Stage 3 (Developed Design): LOD 300
  - Architectural: Walls, floors, roofs with approximate thickness
  - Structure: Columns, beams with generic sizes
  - MEP: Major equipment and distribution routes
• RIBA Stage 4 (Technical Design): LOD 350
  - Architectural: Detailed assemblies, specified materials
  - Structure: Exact sizes, connection details
  - MEP: Coordinated services, sizes, routing
• Construction/As-Built: LOD 400
  - Fabrication-level detail
  - Shop drawing coordination
  - As-installed conditions

**Template Standards:**
• Project levels: Standardized naming (00_Ground, 01_Level 01, etc.)
• Grid naming: Alphanumeric (A-Z, 1-99)
• Shared parameters: Pre-loaded in template
• View templates: Defined for plans, sections, elevations
• Worksets: Standard structure (Shell, Core, Interior, MEP)

**Element Modeling:**
• Walls: Model to structural face, finishes as separate elements
• Floors: Model structural slab, finishes as separate
• Rooms/Spaces: All spaces bounded and tagged
• Families: Use project family library, no ad-hoc families`,

      'Infrastructure': `Infrastructure modeling standards:

**Level of Detail by Phase:**
• Preliminary Design: LOD 200
  - Alignment geometry and vertical profile
  - Typical cross-sections
  - Major structures (bridges, retaining walls) massing
• Detailed Design: LOD 350
  - Detailed alignment including transitions
  - Structure geometry with reinforcement layout
  - Drainage network with all pipes, manholes, outfalls
• Construction: LOD 400
  - Construction-toleranced geometry
  - Detailed connection and joint details
  - As-built survey integration

**Alignment Standards:**
• Horizontal alignment: DMRB standards, transition curves
• Vertical alignment: K-values per design speed
• Cross-sections: Standardized templates per road type

**Structure Modeling:**
• Bridges: LOD 350 minimum for all elements
• Retaining walls: Include drainage, geogrid if applicable
• Culverts: Full detail including wingwalls, headwalls`
    },

    commonMistakes: [
      'No LOD requirements specified - inconsistent model detail across team',
      'Using generic modeling without project-specific standards',
      'No template files leading to inconsistent model setup',
      'Missing view template standards causing inconsistent drawing appearance',
      'No workset strategy defined for multi-user collaboration',
      'Allowing ad-hoc family creation instead of standardized library',
      'Not defining parameter standards leading to data inconsistency',
      'Missing quality validation rules and automated checking'
    ],

    aiPrompt: {
      system: 'You are an ISO 19650 modeling standards advisor.',
      instructions: `You are assisting with defining modeling standards for a BIM Execution Plan. Help users establish comprehensive modeling guidelines covering model structure, element conventions, LOD requirements by project stage, template standards, view templates, workset strategies, classification systems, and quality validation rules. Provide stage-specific LOD requirements (LOD 200/300/350/400/500), template configuration guidance (levels, grids, parameters, view templates), element modeling conventions (walls to structural face, separate finishes), and quality checking procedures. Reference ISO 19650-2 standards and industry best practices (PAS 1192, BS 1192). Ensure consistency and interoperability across all project teams.`,
      style: 'ISO 19650 tone, practical standards, structured guidance, concise'
    },

    relatedFields: ['geometricalInfo', 'alphanumericalInfo', 'volumeStrategy', 'classificationSystems']
  },

  namingConventions_overview: {
    description: `Provide a high-level overview of your project's naming convention philosophy and approach. This section establishes the strategic foundation for how information will be named and organized throughout the project lifecycle.

Key aspects to address:
• Overall naming philosophy aligned with ISO 19650-2
• Consistency objectives across all project deliverables
• How naming supports information retrieval and management
• Integration with project information management goals
• Stakeholder communication about naming standards`,

    iso19650: `ISO 19650-2:2018 Section 5.1.6 - Information Standard

The overview should demonstrate how your naming approach supports the project information standard and facilitates effective information management across the entire delivery team.`,

    bestPractices: [
      'Reference ISO 19650-2 naming principles as foundation',
      'Explain how naming supports project-specific objectives',
      'Acknowledge client EIR requirements for naming standards',
      'Describe how consistency will be maintained across disciplines',
      'Outline governance approach for naming convention adherence',
      'Reference any industry-specific naming standards being adopted',
      'Explain how naming facilitates automation and data exchange'
    ],

    examples: {
      'Commercial Building': `Example Overview:

"File naming follows ISO 19650-2 convention to ensure consistency, traceability, and efficient information management across all project deliverables. Our approach implements a structured naming format that enables:

• Immediate identification of file origin, purpose, and status
• Automated file sorting and filtering in the CDE
• Clear version control and audit trails
• Seamless integration with project classification systems
• Support for downstream asset management systems

All team members receive naming convention training during project mobilization, and automated validation checks in the CDE ensure compliance before file publication."`,

      'Infrastructure': `Example Overview:

"This project adopts ISO 19650-2 naming conventions adapted for linear infrastructure delivery. The naming strategy supports:

• Geographic reference through chainage/station identifiers
• Multi-disciplinary coordination across highway, structures, and drainage
• Integration with GIS and asset management systems
• Compatibility with construction sequencing and handover requirements

Naming standards are enforced through CDE configuration, project templates, and regular compliance audits throughout delivery phases."`
    },

    commonMistakes: [
      'Generic overview without project-specific context',
      'No reference to ISO 19650-2 or client requirements',
      'Failing to explain how naming supports project objectives',
      'Not addressing governance and compliance mechanisms',
      'Missing explanation of stakeholder training approach'
    ],

    aiPrompt: {
      system: 'You are an ISO 19650 naming conventions advisor.',
      instructions: `You are helping define the strategic overview of file naming conventions for a BIM project. Guide users to articulate their naming philosophy aligned with ISO 19650-2, explaining how the naming approach supports consistency, traceability, information retrieval, automated sorting, version control, and integration with classification and asset management systems. Help them describe governance mechanisms (training, CDE validation, compliance audits) and how naming standards are communicated and enforced across all team members. Encourage project-specific context that addresses client EIR requirements and explains how naming facilitates project objectives including coordination, data exchange, and lifecycle information management.`,
      style: 'strategy-first, governance-aware, ISO 19650 tone, concise'
    },

    relatedFields: ['namingConventions_fields', 'namingConventions_pattern', 'namingConventions_attributes', 'fileStructure', 'cdeStrategy']
  },

  namingConventions_fields: {
    description: `Define each component (field) of your file naming pattern in detail. Each field serves a specific purpose in creating unique, meaningful, and structured file names that support information management.

Common naming fields include:
• Project Code - Unique project identifier
• Originator - Organization/discipline creating information
• Volume/System - Spatial or functional subdivision
• Level/Location - Floor level or geographic reference
• Type - Information container type (model, drawing, document)
• Role - Discipline responsible for content
• Number - Sequential identifier
• Revision - Version and status indicator`,

    iso19650: `ISO 19650-2:2018 Section 5.1.6 - Information Standard

Field definitions should align with ISO 19650 naming structure: [Project]-[Originator]-[Volume]-[Level]-[Type]-[Role]-[Number]-[Revision]

Each field must have clear definitions, allowed values, and examples to ensure consistent application across the delivery team.`,

    bestPractices: [
      'Define 6-8 core naming fields for structured identification',
      'Provide clear examples for each field with multiple scenarios',
      'Specify allowed characters and format (uppercase, length limits)',
      'Include abbreviation glossary for originators and roles',
      'Define "not applicable" convention (e.g., XX, ZZ, 00)',
      'Align volume/system codes with project breakdown structure',
      'Establish revision code scheme (P=Prelim, C=Construction, A=As-built)',
      'Document exceptions and special cases'
    ],

    examples: {
      'Commercial Building': `Example Field Definitions:

**[Project Code]**: GF24
- Format: 4 characters, alphanumeric
- Description: Unique identifier for Greenfield 2024 project
- Example: GF24

**[Originator]**: SAA | EXL | ASG
- Format: 3 characters, uppercase
- Description: Organization code
- Examples: SAA (Smith Architects), EXL (Engineering Excellence), ASG (Advanced Systems Group)

**[Volume/System]**: XX | A | B | C1 | C2
- Format: 1-2 characters
- Description: Building zone or system
- Examples: XX (whole building), A (Tower A), B (Tower B), C1 (Core 1)

**[Level]**: GF | 01-08 | RF | B1
- Format: 2 characters
- Description: Floor level
- Examples: GF (Ground), 01-08 (Floors), RF (Roof), B1 (Basement)

**[Type]**: M3 | DR | SP | SC | RP
- Format: 2 characters
- Description: Information container type
- Examples: M3 (Model), DR (Drawing), SP (Specification), SC (Schedule), RP (Report)

**[Role]**: ARC | STR | MEP | FAC
- Format: 3 characters
- Description: Discipline
- Examples: ARC (Architecture), STR (Structural), MEP (MEP Services), FAC (Facades)

**[Number]**: 0001-9999
- Format: 4 digits with leading zeros
- Description: Sequential file number
- Examples: 0001, 0002, 0125

**[Revision]**: P01 | C01 | A01
- Format: 1 letter + 2 digits
- Description: Status and version
- Examples: P01-P99 (Design), C01-C99 (Construction), A01-A99 (As-built)`
    },

    commonMistakes: [
      'Insufficient field descriptions causing inconsistent interpretation',
      'No examples provided for field usage',
      'Missing abbreviation glossary for codes',
      'Overly complex fields with too many options',
      'No clear guidance on when to use "not applicable" codes',
      'Failing to align fields with project organizational structure'
    ],

    aiPrompt: {
      system: 'You are an ISO 19650 file naming field specialist.',
      instructions: `You are helping users define individual naming fields for ISO 19650-2 file naming conventions. Guide them to define 6-8 core fields: Project Code, Originator, Volume/System, Level/Location, Type, Role, Number, and Revision. For each field, help them specify format (character length, uppercase/lowercase, alphanumeric), provide clear descriptions, include multiple examples covering different scenarios, establish abbreviation glossaries, define "not applicable" conventions (XX, ZZ, 00), and align codes with project breakdown structure and organizational roles. Ensure field definitions support automated validation, enable unique file identification, and facilitate filtering and sorting in the CDE. Provide lookup tables and quick reference guides for team members.`,
      style: 'field-by-field structure, examples included, ISO 19650 tone, concise'
    },

    relatedFields: ['namingConventions_overview', 'namingConventions_pattern', 'volumeStrategy', 'organizationalStructure']
  },

  namingConventions_pattern: {
    description: `Define the complete naming pattern showing how individual fields combine to create file names. This section provides the master template and real-world examples demonstrating correct naming application.

The pattern should:
• Show field order and separator characters
• Provide multiple complete examples across disciplines
• Demonstrate pattern application to different file types
• Include edge cases and special scenarios
• Show how extensions are handled`,

    iso19650: `ISO 19650-2:2018 Section 5.1.6 - Information Standard

The complete naming pattern should follow the ISO 19650 structure with consistent separators (typically hyphens) between fields. Pattern must be documented, communicated, and enforced across all project deliverables.`,

    bestPractices: [
      'Use hyphens (-) as standard field separators for clarity',
      'Show pattern with field labels and example with actual values',
      'Provide 5-10 examples covering different scenarios',
      'Include examples for models, drawings, documents, schedules',
      'Demonstrate revision progression (P01 → P02 → C01)',
      'Show multi-discipline examples',
      'Include edge cases (whole building files, site-wide documents)',
      'Add file extension guidance (.rvt, .dwg, .pdf, .ifc)'
    ],

    examples: {
      'Commercial Building': `Complete Naming Pattern:

**Pattern Format:**
[Project]-[Originator]-[Volume]-[Level]-[Type]-[Role]-[Number]-[Revision].[extension]

**Examples:**

Architecture Model:
• GF24-SAA-XX-GF-M3-ARC-0001-P01.rvt
• GF24-SAA-A-03-M3-ARC-0002-C01.rvt

Structural Model:
• GF24-EXL-XX-00-M3-STR-0001-P01.rvt
• GF24-EXL-B-B1-M3-STR-0002-P03.rvt

MEP Model:
• GF24-ASG-XX-GF-M3-MEP-0001-P01.rvt
• GF24-ASG-C1-05-M3-MEP-0005-C01.rvt

Drawings:
• GF24-SAA-XX-GF-DR-ARC-1001-P01.pdf
• GF24-EXL-XX-RF-DR-STR-2050-C01.pdf

Specifications:
• GF24-SAA-XX-XX-SP-ARC-0001-P01.pdf
• GF24-ASG-XX-XX-SP-MEP-0001-C01.pdf

Schedules:
• GF24-SAA-XX-XX-SC-ARC-0001-P02.xlsx
• GF24-EXL-XX-XX-SC-STR-0001-P01.xlsx

Reports:
• GF24-PMT-XX-XX-RP-PM-0001-P01.pdf (Project Management Report)
• GF24-ASG-XX-XX-RP-MEP-0010-P01.pdf (Energy Analysis Report)`
    },

    commonMistakes: [
      'No visual representation of pattern structure',
      'Insufficient examples covering different scenarios',
      'Inconsistent separator usage (mixing hyphens and underscores)',
      'Missing file extension guidance',
      'Not showing revision progression examples',
      'Failing to demonstrate "not applicable" field usage'
    ],

    aiPrompt: {
      system: 'You are an ISO 19650 naming pattern specialist.',
      instructions: `You are helping users define complete file naming patterns following ISO 19650-2 structure. Guide them to create the master template showing field order and separators (typically hyphens): [Project]-[Originator]-[Volume]-[Level]-[Type]-[Role]-[Number]-[Revision].[extension]. Help them provide 5-10 comprehensive examples covering models (.rvt, .ifc), drawings (.pdf, .dwg), documents (.docx, .pdf), and schedules (.xlsx) across multiple disciplines (architecture, structural, MEP). Show revision progression (P01 → P02 → C01), demonstrate "not applicable" field usage (XX for whole building), and include file extension guidance. Ensure examples illustrate edge cases and real-world scenarios for architecture, structure, MEP, and project management deliverables.`,
      style: 'template + examples, ISO 19650 tone, practical and clear'
    },

    relatedFields: ['namingConventions_overview', 'namingConventions_fields', 'fileFormats', 'deliverableTemplates']
  },

  namingConventions_attributes: {
    description: `Define the metadata attributes and properties that accompany deliverables beyond the file name. These attributes provide additional context, classification, and management information essential for the asset lifecycle.

Key deliverable attributes include:
• File format and software version requirements
• Classification system codes (Uniclass, Omniclass)
• Level of Information Need (LOIN) specifications
• Security classification levels
• Suitability codes (ISO 19650 status indicators)
• Revision codes and version history
• Authorship and approval metadata`,

    iso19650: `ISO 19650-2:2018 Section 5.1.4 - Information Delivery Planning

Deliverable attributes support the project information standard and enable effective filtering, searching, and management within the CDE. Attributes should be captured as metadata to support lifecycle information management and asset handover.`,

    bestPractices: [
      'Define mandatory vs. optional attributes for each deliverable type',
      'Specify controlled vocabularies for attribute values',
      'Align attributes with client asset management requirements',
      'Include suitability codes per ISO 19650 (S0-S8)',
      'Define revision code conventions and progression rules',
      'Specify file format standards and version requirements',
      'Link attributes to classification systems (Uniclass 2015)',
      'Define security classification scheme',
      'Document where attributes are stored (filename, metadata, CDE properties)'
    ],

    examples: {
      'Commercial Building': `Example Deliverable Attributes:

**File Format:**
- Models: .rvt (Revit 2024), .ifc (IFC 4.0)
- Drawings: .pdf (PDF/A-1b for archive)
- Documents: .docx (Office 2019+), .pdf
- Schedules: .xlsx (Office 2019+)

**Classification System:**
- Standard: Uniclass 2015
- Format: Table_Code_Description
- Example: Ss_25_30_20 (Curtain wall systems)

**Level of Information Need:**
- Design Stage 3: LOD 300 (Defined geometry)
- Design Stage 4: LOD 350 (Coordinated geometry)
- Construction: LOD 400 (Fabrication detail)
- As-built: LOD 500 (Verified record)

**Security Classification:**
- Public: General project information
- Internal: Working documents within delivery team
- Confidential: Commercial or sensitive information
- Strictly Confidential: Board-level or contractual

**Suitability Code (ISO 19650):**
- S0: Work in Progress (WIP)
- S1: Suitable for Coordination
- S2: Suitable for Information
- S3: Suitable for Review and Comment
- S4: Suitable for Stage Approval
- A1-A7: Client authorized (various levels)

**Revision Code:**
- P01-P99: Design development (Prelim/Proposal)
- C01-C99: Construction issue
- A01-A99: As-built/As-constructed
- Format: Letter indicates phase, number indicates iteration

**Metadata Properties:**
- Author: Full name of creator
- Checked: Name of quality checker
- Approved: Name of authorizing person
- Issue Date: YYYY-MM-DD format
- Project Phase: RIBA Stage (e.g., "Stage 4")
- Discipline: Architecture/Structure/MEP/etc.
- Keywords: Search tags for CDE filtering`
    },

    commonMistakes: [
      'Attributes not documented or inconsistently applied',
      'No controlled vocabularies leading to data quality issues',
      'Suitability codes not aligned with ISO 19650',
      'Security classification not defined or enforced',
      'Revision codes conflicting with file version numbers',
      'Attributes stored inconsistently (sometimes filename, sometimes metadata)',
      'No link between classification codes and naming conventions',
      'Missing guidance on attribute population and validation'
    ],

    aiPrompt: {
      system: 'You are an ISO 19650 deliverables metadata specialist.',
      instructions: `You are helping define deliverable attributes and metadata for a BIM project. Guide users to specify mandatory vs. optional attributes for each deliverable type including file formats (.rvt, .ifc, .pdf), classification codes (Uniclass 2015), Level of Information Need (LOD 200-500), security classifications (Public/Internal/Confidential), suitability codes (ISO 19650 S0-S8: S0=WIP, S1=Coordination, S2=Information, S3=Review, S4=Approval), revision codes (P=Prelim, C=Construction, A=As-built), and authorship metadata (Author, Checker, Approver). Help establish controlled vocabularies, define where attributes are stored (filename vs. metadata vs. CDE properties), align with client asset management requirements, and document validation procedures. Ensure attributes support lifecycle information management and COBie handover.`,
      style: 'metadata-first, controlled vocabularies, ISO 19650 tone, concise'
    },

    relatedFields: ['namingConventions_overview', 'namingConventions_pattern', 'classificationSystems', 'informationFormats', 'dataClassification']
  },

  namingConventions: {
    description: `Establish comprehensive naming conventions for all project files, models, drawings, views, families, and elements to ensure consistency and facilitate information retrieval.

Define naming formats for:
• Project files and models
• Drawings and sheets
• Views and view templates
• Families and types
• Worksets and design options
• Shared parameters
• Materials and assemblies`,

    iso19650: `ISO 19650-2:2018 Section 5.1.6 - Information Standard

Consistent naming conventions enable effective information management, search, and retrieval while supporting automated processes and data exchange.`,

    bestPractices: [
      'Use ISO 19650 naming convention: Project-Originator-Volume-Level-Type-Role-Number',
      'Avoid special characters, use hyphens or underscores only',
      'Use consistent abbreviations (publish abbreviation glossary)',
      'Keep names concise but descriptive (50 characters max recommended)',
      'Include version/revision indicators in file names',
      'Use leading zeros for sequential numbering (001, 002, not 1, 2)',
      'Establish family naming convention aligned with classification system',
      'Define view naming hierarchy (discipline-level-view type-detail)'
    ],

    examples: {
      'Commercial Building': `Comprehensive naming conventions:

**File/Model Names:**
Format: [Project]-[Originator]-[Volume]-[Level]-[Type]-[Role]-[Number]
• GF-SAA-A-XX-M3-ARC-0001.rvt (Architecture model)
• GF-JEL-A-XX-M3-STR-0001.rvt (Structure model)
• GF-TSS-A-L02-M3-MEP-0001.rvt (MEP Level 2 model)

**Drawing Names:**
Format: [Project]-[Building]-[Level]-[Discipline]-[Type]-[Number]
• GF-A-L02-ARC-GA-101 (Building A, Level 2 Arch General Arrangement)
• GF-A-XX-STR-SD-201 (Building A Structure Details)

**View Names:**
Format: [Discipline]-[Level]-[View Type]-[Detail]
• ARC-L02-FloorPlan-1to100
• STR-L03-FramingPlan-1to50
• MEP-L01-MechServices-Coordination

**Family Names:**
Format: [Classification]-[Manufacturer]-[Product]-[Size/Type]
• Ss_25_30-Kingspan-Insulated Panel-100mm
• Pr_60_10-Roca-WC-WallHung-Compact

**Workset Names:**
Format: [Discipline]-[Category]-[SubCategory]
• ARC-Shell-ExternalWalls
• STR-Frame-Columns
• MEP-HVAC-Ductwork

**Shared Parameters:**
Format: [Discipline]_[Category]_[ParameterName]
• ARC_Walls_ThermalTransmittance
• STR_Structure_DesignLoad
• MEP_Equipment_MaintenanceInterval`,

      'Infrastructure': `Infrastructure naming conventions:

**Project Files:**
Format: [Project]-[Discipline]-[Zone]-[Type]-[Number]
• A45JI-HW-CH2K-ALN-001.dwg (Highway Alignment Ch2000)
• A45JI-STR-BR1-MOD-001.tekla (Bridge 1 Structure Model)
• A45JI-DRN-CH5K-NET-001.iwdm (Drainage Network Ch5000)

**Drawing Numbering:**
Format: [Discipline]-[Type]-[Zone]-[Sequential]
• HW-GA-CH2K-1001 (Highway General Arrangement)
• STR-DET-BR1-2050 (Bridge 1 Detail)
• DRN-LONG-CH3K-3010 (Drainage Longitudinal Section)

**Alignments:**
Format: [Type]-[Route]-[Element]
• ALN-A45-Mainline-CL
• ALN-A45-SlipRoad-North-Edge

**Point Cloud Files:**
Format: [Project]-[Survey Type]-[Zone]-[Date]
• A45JI-TLS-CH2K-20240315.rcp
• A45JI-MobileMap-CH5K-20240320.rcs`
    },

    commonMistakes: [
      'Inconsistent abbreviations or no abbreviation glossary',
      'Using spaces instead of hyphens/underscores',
      'Including special characters (%, #, @) that cause software issues',
      'Excessively long names difficult to read and manage',
      'No versioning convention leading to confusion',
      'Different naming formats across disciplines',
      'Missing sequential numbering structure',
      'Not documenting naming conventions in project standards'
    ],

    aiPrompt: {
      system: 'You are an ISO 19650 naming conventions and information standard specialist.',
      instructions: `You are helping establish comprehensive naming conventions for all BIM project deliverables. Guide users to define ISO 19650-2 compliant naming for files/models, drawings/sheets, views/view templates, families/types, worksets/design options, shared parameters, and materials/assemblies. Help them create naming formats for each category, use consistent separators (hyphens/underscores), avoid special characters, keep names concise (50 characters max), include version/revision indicators, use leading zeros for sequential numbering (001, 002), and align family naming with classification systems (Uniclass). Provide examples across disciplines (architecture, structure, MEP, infrastructure) covering models (.rvt), drawings, view naming hierarchies (discipline-level-view type), and element naming conventions. Ensure consistency enables automated processes and information retrieval.`,
      style: 'standards-led, consistent separators, examples included, concise'
    },

    relatedFields: ['fileStructure', 'documentControlInfo', 'classificationSystems', 'volumeStrategy']
  },

  fileStructure: {
    description: `Define the folder hierarchy and organization structure for the project CDE and local working environments.

Establish structure for:
• Top-level folder organization
• Discipline-specific sub-folders
• Project phase folders (design, construction, handover)
• Template and standard files location
• Archive and superseded information
• Alignment with CDE workflow states (WIP, Shared, Published, Archive)`,

    iso19650: `ISO 19650-1:2018 Section 5.5 - Common Data Environment

A well-organized folder structure enables efficient information retrieval, reduces duplication, and supports the CDE workflow states throughout the project lifecycle.`,

    bestPractices: [
      'Align top-level structure with CDE workflow states (WIP/Shared/Published/Archive)',
      'Organize by discipline or work package below top level',
      'Create separate folders for models, drawings, specifications, reports',
      'Maintain consistent structure across all disciplines',
      'Include Templates folder with standard files and libraries',
      'Define folder naming conventions (no spaces, consistent abbreviations)',
      'Limit folder depth to 4-5 levels maximum for accessibility',
      'Include README files explaining folder structure and purpose'
    ],

    examples: {
      'Commercial Building': `CDE folder structure:

**Top Level (CDE Workflow States):**
• 01_Work-In-Progress (WIP)
• 02_Shared
• 03_Published
• 04_Archive
• 00_Project-Resources

**Within each workflow state:**

01_Work-In-Progress/
├── Architecture/
│   ├── Models/
│   ├── Drawings/
│   └── Specifications/
├── Structure/
│   ├── Models/
│   ├── Calculations/
│   └── Drawings/
├── MEP/
│   ├── Models/
│   ├── Schedules/
│   └── Drawings/
├── Coordination/
│   └── Federated-Models/
└── Cost/
    └── Estimates/

00_Project-Resources/
├── Templates/
│   ├── Revit-Templates/
│   ├── Drawing-Templates/
│   └── Document-Templates/
├── Standards/
│   ├── BEP/
│   ├── Modeling-Standards/
│   └── CAD-Standards/
└── Libraries/
    ├── Families/
    └── Materials/`,

      'Infrastructure': `Infrastructure CDE structure:

**Top Level:**
• WIP/
• Shared/
• Published/
• Archive/
• Project-Standards/

**Discipline Organization:**

WIP/
├── Highway/
│   ├── Alignment-Models/
│   ├── Pavement-Design/
│   └── Drawings/
├── Structures/
│   ├── Bridge-Models/
│   ├── Retaining-Walls/
│   └── Calculations/
├── Drainage/
│   ├── Network-Models/
│   ├── Hydraulic-Analysis/
│   └── Drawings/
├── Utilities/
│   └── Diversions/
└── Geotechnical/
    ├── Survey-Data/
    └── Reports/

Project-Standards/
├── Design-Standards/
├── BIM-Execution-Plan/
└── Drawing-Standards/`
    },

    commonMistakes: [
      'Inconsistent folder structure across different workflow states',
      'Too many nested folder levels making navigation difficult',
      'No clear separation between models, drawings, and documents',
      'Missing Templates or Standards folder for project resources',
      'Using spaces in folder names causing software compatibility issues',
      'No README files explaining folder purpose and usage',
      'Duplicating folder structure instead of using CDE workflow states',
      'Personal/individual folders instead of discipline-based organization'
    ],

    aiPrompt: {
      system: 'You are a CDE information management specialist focusing on ISO 19650 folder structures.',
      instructions: `You are helping define CDE folder structure and organization hierarchy for a BIM project. Guide users to align top-level structure with ISO 19650-1 CDE workflow states (WIP/Shared/Published/Archive), organize by discipline or work package below top level, create separate folders for models, drawings, specifications, and reports, maintain consistent structure across disciplines, include Templates folder with standards and libraries, define folder naming conventions (no spaces, consistent abbreviations), and limit depth to 4-5 levels. Help them create structures for both building projects (Architecture/Structure/MEP/Coordination/Cost) and infrastructure (Highway/Structures/Drainage/Utilities/Geotechnical). Include Project-Resources folder for templates, standards, BEP, and family libraries. Ensure organization supports efficient retrieval and reduces duplication.`,
      style: 'ISO 19650 workflow states, hierarchy clarity, practical and concise'
    },

    relatedFields: ['fileStructureDiagram', 'cdeStrategy', 'namingConventions', 'workflowStates']
  },

  fileStructureDiagram: {
    description: `Create a visual diagram representing the project folder structure within the Common Data Environment (CDE). This diagram should clearly show the hierarchy of folders, workflow states, and organization of different information types.

The diagram should illustrate:
• CDE workflow states (WIP, Shared, Published, Archive)
• Discipline-specific folder organization
• Separation of models, drawings, documents, and data
• Location of templates, standards, and reference materials
• Archive and superseded information structure`,

    iso19650: `ISO 19650-1:2018 Section 5.5 - Information Containers

Visual representation of the information container structure helps all project participants understand where information should be stored, accessed, and managed throughout the project lifecycle.`,

    bestPractices: [
      'Start with CDE workflow states as top-level organization',
      'Show consistent folder structure replicated across each workflow state',
      'Indicate which folders are discipline-specific vs. shared',
      'Use color coding or icons to differentiate information types',
      'Include folder naming examples within the diagram',
      'Show relationships between linked folders (e.g., model links)',
      'Indicate read/write permissions at folder level if applicable',
      'Keep diagram clear and not overly complex (collapse detail where needed)'
    ],

    examples: {
      'Commercial Building': `Use the Folder Structure Diagram builder to create a visual tree showing:

**Root Level:**
📁 Project CDE
  ├─ 🔵 WIP (Work in Progress)
  ├─ 🟢 Shared
  ├─ 🟡 Published
  ├─ 🔴 Archive
  └─ ⚙️ Project-Resources

**Example WIP Structure:**
WIP/
  ├─ Architecture/
  │   ├─ Models/ (*.rvt, *.nwc)
  │   ├─ Drawings/ (*.pdf, *.dwg)
  │   └─ Specs/ (*.docx, *.pdf)
  ├─ Structure/
  │   ├─ Models/ (*.rvt, *.tekla)
  │   └─ Calcs/ (*.xlsx, *.pdf)
  └─ MEP/
      └─ Models/ (*.rvt, *.nwc)

Include color coding:
• Blue = WIP (editable by discipline)
• Green = Shared (coordination)
• Yellow = Published (approved)
• Red = Archive (read-only)`,

      'Infrastructure': `Infrastructure folder diagram structure:

**Visual Hierarchy:**
Project Root
├─ [WIP] - Team Access
│   ├─ Highway (*.dwg, *.xml)
│   ├─ Structures (*.tekla, *.ifc)
│   ├─ Drainage (*.dwg, *.pdf)
│   └─ Geotech (*.las, *.pdf)
├─ [Shared] - Coordination
│   └─ Federated-Models/
├─ [Published] - Client Access
│   └─ Milestone-Deliverables/
└─ [Standards] - Reference Only
    ├─ BEP/
    └─ Templates/

Use diagram builder to show:
• Folder access permissions (icons)
• File type indicators
• Workflow progression arrows
• Model linking relationships`
    },

    commonMistakes: [
      'Diagram too complex with excessive detail making it hard to read',
      'No clear visual distinction between workflow states',
      'Missing folder naming examples within diagram',
      'Not showing file type segregation (models vs drawings vs docs)',
      'Failing to indicate access permissions or restrictions',
      'No color coding or visual hierarchy',
      'Diagram doesn\'t match actual CDE implementation',
      'Missing Templates/Standards folder location'
    ],

    aiPrompt: {
      system: 'You are a BIM information manager helping communicate CDE structures.',
      instructions: `You are helping create a visual CDE folder structure diagram for a BIM project. Guide users to start with CDE workflow states as top level (WIP/Shared/Published/Archive), show consistent folder structure replicated across each workflow state, indicate discipline-specific vs. shared folders, use color coding or icons to differentiate information types (models, drawings, documents), include folder naming examples and file type indicators (*.rvt, *.pdf, *.dwg), show relationships between linked folders, and indicate read/write permissions. Help them create clear, uncluttered diagrams using tree structure notation with visual hierarchy. Use color coding: Blue=WIP (editable), Green=Shared (coordination), Yellow=Published (approved), Red=Archive (read-only). Include Project-Resources folder for templates, standards, and libraries. Keep diagram clear by collapsing detail where needed.`,
      style: 'diagram/tree notation, clear hierarchy, minimal clutter, concise'
    },

    relatedFields: ['fileStructure', 'cdeStrategy', 'workflowStates', 'documentControlInfo']
  },

  volumeStrategy: {
    description: `Define the volume strategy (model breakdown structure) showing how the project is divided into manageable information containers. This mindmap/diagram should illustrate the logical breakdown of the project by building, zone, discipline, level, or other organizing principle.

The volume strategy should show:
• Primary breakdown (by building, zone, phase)
• Secondary breakdown (by discipline, system, level)
• Model boundaries and interfaces
• Rationale for chosen breakdown approach
• How breakdown aligns with contract packages and delivery phases`,

    iso19650: `ISO 19650-1:2018 Section 3.3.3 - Information Container

The volume strategy defines how project information is divided into containers to facilitate efficient production, coordination, and exchange while preventing models from becoming unmanageably large.`,

    bestPractices: [
      'Break down complex projects by building/zone first, then discipline',
      'Keep individual model file sizes under 500MB for performance',
      'Align breakdown with construction phases and contract packages where possible',
      'Create separate containers for existing, demolition, and new construction',
      'Define clear model boundaries with minimal overlap zones',
      'Consider phasing requirements in breakdown structure',
      'Balance granularity - too many small models increases coordination complexity',
      'Document model linking strategy and shared coordinate systems'
    ],

    aiPrompt: {
      system: 'You are a BIM information container strategy specialist.',
      instructions: `You are helping define the volume strategy (model breakdown structure) for a BIM project. Guide users to break down complex projects by building/zone first, then discipline, keeping individual model files under 500MB for performance. Help them align breakdown with construction phases and contract packages, create separate containers for existing/demolition/new construction, define clear model boundaries with minimal overlap, and balance granularity to avoid excessive coordination complexity. For buildings, suggest breakdown by tower/wing/zone then discipline; for infrastructure, by chainage/station/structure then discipline. Document model linking strategy, shared coordinate systems, and how breakdown supports phased delivery. Create visual mindmaps or diagrams showing primary breakdown (building/zone/phase) and secondary breakdown (discipline/system/level) with clear rationale.`,
      style: 'performance-aware, phased breakdown, clear boundaries, concise'
    },

    relatedFields: ['informationBreakdownStrategy', 'federationStrategy', 'fileStructure', 'modelReferencing3d']
  },

  classificationSystems: {
    description: `Define the classification systems and coding frameworks that will be used to organize and categorize project information, elements, spaces, and assets.

Specify classification systems for:
• Building elements and components
• Spaces and rooms
• Systems and assemblies
• Products and materials
• Work results and activities
• Asset and facility management data`,

    iso19650: `ISO 19650-2:2018 Section 5.3 - Information Standard

Consistent classification systems enable structured information organization, facilitate data exchange, support automated processes, and ensure compatibility with asset management systems.`,

    bestPractices: [
      'Use Uniclass 2015 as primary UK classification system',
      'Apply classification codes to all model elements and spaces',
      'Align classification with client FM/asset management systems',
      'Define classification depth required (e.g., Uniclass to 4th level)',
      'Include COBie classification requirements for FM handover',
      'Document classification mapping for different standards (Uniclass/Omniclass)',
      'Train team on classification system usage and importance',
      'Implement automated validation to check classification completeness'
    ],

    examples: {
      'Commercial Building': `Classification framework:

**Primary System: Uniclass 2015**

Elements (Uniclass Ss - Systems):
• Ss_25 = External Walls
• Ss_25_30 = Curtain Walling
• Ss_25_30_20 = Metal Curtain Walling

Spaces (Uniclass SL - Spaces/Locations):
• SL_35 = Office Spaces
• SL_35_10 = Open Plan Office
• SL_35_20 = Cellular Office

Products (Uniclass Pr - Products):
• Pr_60 = Piped Supply Systems
• Pr_60_10 = Sanitary Installations
• Pr_60_10_10 = WC Suites

**Secondary System: COBie Classification**
For FM Handover:
• Type.Category = Uniclass Ss code
• Space.Category = Uniclass SL code
• Component.AssetType = Client asset register code

**Application:**
All modeled elements include shared parameter "Uniclass_Code"
All spaces include "Space_Classification" parameter
Automated validation checks classification completeness before model publication`,

      'Infrastructure': `Infrastructure classification approach:

**Highway Elements:**
Based on Highway Agency DMRB and Uniclass:
• En_80_10 = Road Pavements
• En_80_10_10 = Flexible Pavements
• En_80_20 = Road Markings and Studs

**Structures:**
• Ss_45 = Bridges
• Ss_45_10 = Beam Bridges
• Ss_45_20 = Truss Bridges

**Drainage:**
• Ss_65 = Drainage Systems
• Ss_65_10 = Surface Water Drainage
• Ss_65_20 = Foul Drainage

**Asset Classification:**
Aligned with client asset management system:
• Highway Asset Code (HAC) for pavement/structures
• Drainage Asset Register (DAR) codes
• Utilities Register (UR) codes for diversions

**GIS Integration:**
Feature codes aligned with OS MasterMap:
• Road Centreline (RCL)
• Structure (STR)
• Drainage Network (DRN)`
    },

    commonMistakes: [
      'No classification system defined or applied inconsistently',
      'Using outdated classification (Uniclass 1997 instead of 2015)',
      'Not aligning classification with client FM systems',
      'Insufficient classification depth (only to 2nd level)',
      'Missing COBie classification for FM handover',
      'No validation process to check classification completeness',
      'Team not trained on classification system usage',
      'Different disciplines using incompatible classification approaches'
    ],

    aiPrompt: {
      system: 'You are a BIM classification and information standard specialist.',
      instructions: `You are helping define classification systems for organizing BIM project information. Guide users to use Uniclass 2015 as primary UK classification system covering Elements (Ss - Systems), Spaces (SL - Spaces/Locations), and Products (Pr - Products). Help them apply classification codes to all model elements and spaces, align with client FM/asset management systems, define classification depth required (typically to 4th level: Ss_25_30_20), include COBie classification requirements for FM handover, and implement automated validation. For infrastructure, incorporate DMRB standards and client asset codes. Provide examples mapping common elements to codes (Ss_25_30_20 = Metal Curtain Walling, SL_35_10 = Open Plan Office, Pr_60_10_10 = WC Suites). Train team on classification usage and importance.`,
      style: 'Uniclass-led, examples included, validation-focused, concise'
    },

    relatedFields: ['classificationStandards', 'alphanumericalInfo', 'projectInformationRequirements', 'cobieRequirements']
  },

  classificationStandards: {
    description: `Provide detailed implementation guidelines for applying classification standards to specific element categories, spaces, and assets within the project.

This table should map:
• Element categories to specific classification codes
• Detailed code format and structure
• Example codes with descriptions
• Responsible party for applying classification
• Validation procedures for classification accuracy`,

    iso19650: `ISO 19650-2:2018 Section 5.3 - Information Standard

Detailed classification implementation standards ensure all team members apply classification consistently and completely, enabling effective information retrieval and asset management integration.`,

    bestPractices: [
      'Create lookup tables mapping common elements to classification codes',
      'Provide examples for each major element category',
      'Define required classification depth for different element types',
      'Include space/room classification standards',
      'Specify system/assembly classification approach',
      'Define validation rules and automated checking procedures',
      'Align with BIM execution plan LOD requirements',
      'Provide training materials and quick reference guides'
    ],

    examples: {
      'Commercial Building': `Sample classification standards table:

| Element Category | Classification System | Code Format | Example Code | Description | Responsibility |
|-----------------|---------------------|-------------|--------------|-------------|---------------|
| External Walls | Uniclass 2015 Ss | Ss_25_XX_XX | Ss_25_30_20 | Metal Curtain Walling | Architect |
| Internal Walls | Uniclass 2015 Ss | Ss_25_XX_XX | Ss_25_10_20 | Concrete Block Partitions | Architect |
| Floor Structures | Uniclass 2015 Ss | Ss_15_XX_XX | Ss_15_30_10 | Concrete Floor Slabs | Structural Engineer |
| HVAC Equipment | Uniclass 2015 Pr | Pr_65_XX_XX | Pr_65_52_30 | Air Handling Units | MEP Engineer |
| Office Spaces | Uniclass 2015 SL | SL_35_XX | SL_35_10 | Open Plan Office | Space Planner |
| Meeting Rooms | Uniclass 2015 SL | SL_35_XX | SL_35_30 | Meeting Rooms | Space Planner |
| Fire Doors | Uniclass 2015 Pr | Pr_30_XX_XX | Pr_30_59_64 | Fire Rated Doorsets FD30 | Architect |

**Validation:**
Automated Solibri rule: All elements must have Uniclass code parameter populated to minimum Ss_XX_XX depth`,

      'Infrastructure': `Infrastructure classification table:

| Element Category | Classification System | Code Format | Example Code | Description | Responsibility |
|-----------------|---------------------|-------------|--------------|-------------|---------------|
| Road Pavements | Uniclass 2015 En | En_80_10_XX | En_80_10_10 | Flexible Pavements | Highway Engineer |
| Beam Bridges | Uniclass 2015 Ss | Ss_45_XX | Ss_45_10 | Beam Bridges | Structural Engineer |
| Surface Water Drainage | Uniclass 2015 Ss | Ss_65_XX | Ss_65_10 | Surface Water Drainage | Drainage Engineer |
| Highway Lighting | Uniclass 2015 Pr | Pr_70_XX_XX | Pr_70_85_11 | LED Highway Lighting Columns | Lighting Designer |
| Concrete Barriers | Uniclass 2015 Ss | Ss_40_XX_XX | Ss_40_15_20 | Safety Barriers (Concrete) | Highway Engineer |

**Asset Codes:**
Map Uniclass to client asset register codes for FM handover`
    },

    commonMistakes: [
      'No classification lookup table provided for team reference',
      'Inconsistent classification depth across element types',
      'Missing space/room classification standards',
      'No responsibility assignment for applying classification',
      'Validation procedures not automated or enforced',
      'Classification examples not provided',
      'Not aligned with client asset management codes',
      'Missing training on classification system usage'
    ],

    aiPrompt: {
      system: 'You are a BIM classification implementation specialist.',
      instructions: `You are helping create detailed classification implementation standards for a BIM project. Guide users to create lookup tables mapping element categories to Uniclass 2015 codes with clear examples: External Walls (Ss_25_XX_XX), Floor Structures (Ss_15_XX_XX), HVAC Equipment (Pr_65_XX_XX), Office Spaces (SL_35_XX). Help them define required classification depth for different element types (typically 4th level), specify responsibility for applying classification (Architect/Engineer/Space Planner), include space/room classification, define system/assembly classification approach, and establish automated validation rules (Solibri: all elements must have Uniclass code parameter populated). Provide training materials, quick reference guides, and align with client asset management codes for FM handover. Ensure completeness for COBie deliverables.`,
      style: 'lookup tables, responsibilities, automated validation, concise'
    },

    relatedFields: ['classificationSystems', 'modelingStandards', 'alphanumericalInfo', 'cobieRequirements']
  },

  dataExchangeProtocols: {
    description: `Define protocols and procedures for exchanging information between project team members, disciplines, and external stakeholders.

Specify protocols for:
• Frequency and timing of data exchanges
• File formats for different exchange types
• Delivery methods (CDE upload, email, API, etc.)
• Quality validation before exchange
• Notification and confirmation procedures
• Issue resolution for failed exchanges`,

    iso19650: `ISO 19650-2:2018 Section 5.4 - Information Production and Exchange

Structured data exchange protocols ensure timely, accurate, and complete information transfer between task teams and to the appointing party at defined milestones.`,

    bestPractices: [
      'Define regular exchange cadence (weekly, biweekly, milestone-based)',
      'Specify IFC format and MVD for cross-discipline exchanges',
      'Use BCF format for issue tracking and coordination',
      'Implement automated validation before exchange (geometry, data completeness)',
      'Define notification procedures when information is exchanged',
      'Establish fallback procedures for failed exchanges',
      'Maintain exchange log tracking all information transfers',
      'Define acceptance criteria for received information'
    ],

    examples: {
      'Commercial Building': `Data exchange framework:

**Regular Coordination Exchange (Weekly):**
• Exchange Type: Design Coordination
• Format: Native + IFC 4 Coordination View 2.0
• Frequency: Every Friday 5pm
• Delivery Method: CDE Shared folder
• Validation: Solibri model checker rules
• Notification: Automated email to coordination team

**Clash Detection Exchange (Weekly):**
• Exchange Type: Issue Coordination
• Format: BCF 2.1 for clash reports
• Frequency: Every Monday 9am
• Delivery Method: BIM 360 Issues
• Notification: Assigned to responsible discipline leads

**Client Review Exchange (Monthly):**
• Exchange Type: Design Review
• Format: PDF drawings + Navisworks NWD
• Frequency: Monthly milestone
• Delivery Method: CDE Published folder
• Validation: QA review checklist completed
• Notification: Formal transmittal with review period deadline

**FM Handover Exchange (End of Construction):**
• Exchange Type: Asset Information
• Format: COBie 2.4 spreadsheet + IFC 4
• Frequency: One-time at practical completion
• Delivery Method: Secure data room
• Validation: COBie validator, client acceptance testing`
    },

    commonMistakes: [
      'No defined exchange frequency leading to ad-hoc coordination',
      'Missing file format specifications for exchanges',
      'No validation procedures before information exchange',
      'Unclear delivery methods (email attachments vs. CDE)',
      'No notification system when information is exchanged',
      'Missing exchange log or audit trail',
      'No acceptance criteria for received information',
      'Different disciplines using incompatible exchange formats'
    ],

    aiPrompt: {
      system: 'You are an ISO 19650 information exchange specialist.',
      instructions: `You are helping define data exchange protocols for a BIM project following ISO 19650-2. Guide users to define regular exchange cadence (weekly/biweekly/milestone-based), specify file formats for different exchange types (IFC 4 Coordination View 2.0 for coordination, BCF 2.1 for issues, COBie 2.4 for FM handover), define delivery methods (CDE upload, BIM 360, secure data room), implement automated validation before exchange (Solibri rules, COBie validator), establish notification procedures, maintain exchange logs, and define acceptance criteria. Help them create frameworks for Regular Coordination (weekly native + IFC), Clash Detection (weekly BCF), Client Review (monthly PDF + Navisworks), and FM Handover (COBie + IFC at completion). Include fallback procedures for failed exchanges and quality checks.`,
      style: 'protocol-driven, structured, ISO 19650 tone, concise'
    },

    relatedFields: ['interoperabilityNeeds', 'fileFormats', 'federationProcess', 'taskTeamExchange']
  },

  // ====================================================================
  // SECTION 9 - QUALITY ASSURANCE AND CONTROL
  // ====================================================================

  qaFramework: {
    description: `Define the quality assurance framework including all QA activities, responsible parties, frequency, and tools/methods used to ensure information quality throughout the project.

Cover QA activities for:
• Model geometry and accuracy
• Data completeness and accuracy
• Adherence to standards and conventions
• Coordination and clash detection
• Deliverable completeness
• Compliance with client requirements`,

    iso19650: `ISO 19650-2:2018 Section 5.4.5 - Model Production Delivery Table

Quality assurance processes ensure that information delivered meets the defined information standard and is suitable for its intended purpose.`,

    bestPractices: [
      'Define QA activities at multiple levels: author self-check, peer review, formal QA',
      'Specify frequency for each QA activity (daily, weekly, milestone)',
      'Assign clear responsibilities using RACI matrix',
      'Utilize automated validation tools (Solibri, Navisworks, BIMcollab)',
      'Maintain QA checklist templates for different information types',
      'Document QA results and non-conformances',
      'Establish corrective action procedures for quality issues',
      'Conduct periodic QA audits of processes and deliverables'
    ],

    examples: {
      'Commercial Building': `QA Framework table example:

| QA Activity | Responsibility | Frequency | Tools/Methods |
|------------|---------------|-----------|--------------|
| Author Self-Check | Model Author | Before sharing to WIP | Internal model audit, visual review |
| Peer Review | Team Colleague | Weekly | Cross-check against standards |
| Internal Clash Detection | Discipline Lead | Before publishing to Shared | Navisworks, tolerance 25mm |
| Model Validation | BIM Coordinator | Weekly | Solibri rule-based checking |
| Federated Clash Detection | BIM Coordinator | Weekly | Navisworks automated clash tests |
| Coordinate System Check | BIM Manager | Per model publication | Survey point verification |
| Data Completeness Check | Information Manager | Milestone | Parameter audit, classification check |
| Drawing QA | CAD Manager | Before client submission | Drawing standards compliance |
| IFC Export Validation | BIM Coordinator | Before client delivery | IFC viewer verification, MVD checker |
| Client Deliverable Review | Project Director | Milestone | Deliverable checklist sign-off |

**QA Metrics:**
• Target: <50 clashes per federated model
• Model file health: Zero critical errors
• Classification completeness: 100% of elements
• Parameter population: 95%+ for required fields`,

      'Infrastructure': `Infrastructure QA framework:

| QA Activity | Responsibility | Frequency | Tools/Methods |
|------------|---------------|-----------|--------------|
| Alignment Validation | Highway Lead | Per design iteration | Alignment report, visual check |
| Structure Model Check | Structural Lead | Weekly | Tekla model checker, analysis validation |
| Drainage Network Validation | Drainage Engineer | Per update | Hydraulic analysis, gradient check |
| Clash Detection (Utilities) | Coordination Lead | Fortnightly | Navisworks, statutory undertaker coordination |
| Survey Data Verification | Survey Manager | Per survey delivery | Point cloud registration, accuracy check |
| Design Code Compliance | Technical Director | Milestone | DMRB compliance check, design certificate |
| Drawing Coordination | CAD Lead | Before issue | Cross-reference check, consistency review |
| As-Built Verification | Site Engineer | Monthly | Survey vs model comparison |

**Quality Targets:**
• Alignment accuracy: ±10mm horizontal, ±5mm vertical
• Zero clashes with confirmed utilities
• All structures independently checked
• 100% as-built survey verification`
    },

    commonMistakes: [
      'No multi-level QA defined (only single review)',
      'QA frequency not specified leading to inconsistent checking',
      'Responsibilities not clearly assigned (RACI)',
      'No automated validation tools utilized',
      'QA results not documented or tracked',
      'Missing corrective action procedures',
      'No QA metrics or targets defined',
      'Periodic audits not scheduled or performed'
    ],

    aiPrompt: {
      system: 'You are a BIM quality assurance lead. Define a QA framework that assures information quality, compliance with standards, and suitability for purpose under ISO 19650.',
      instructions: 'Define the QA framework as a short table-like list of QA activities. For each activity specify responsibility (RACI-style), frequency, and tools/methods (e.g., Solibri/Navisworks checks, checklists, audits). Include author self-check, peer review, automated validation, coordination/clash review, and milestone deliverable sign-off. Include how non-conformances are recorded and closed, and 2-3 measurable quality targets. Maximum 180 words.',
      style: 'structured, activity-based, measurable targets, audit-ready, concise'
    },

    relatedFields: ['modelValidation', 'reviewProcesses', 'approvalWorkflows', 'complianceVerification']
  },

  modelValidation: {
    description: `Define comprehensive model validation procedures ensuring models meet quality, accuracy, and completeness standards before coordination and delivery.

Validation should cover:
• Geometric accuracy and modeling standards compliance
• Data completeness (parameters, properties, classification)
• Coordinate system and datum verification
• Model performance and file health
• Interoperability (IFC export validation)
• Clash detection (internal discipline clashes)
• Compliance with LOD/LOIN requirements`,

    iso19650: `ISO 19650-2:2018 Section 5.4.4 - Information Model Review

Information models must undergo systematic validation to verify they meet quality standards, are geometrically coordinated, and contain required information before exchange or approval.`,

    bestPractices: [
      'Implement automated validation using Solibri Model Checker or similar',
      'Define model validation checklist with pass/fail criteria',
      'Validate before publishing to CDE Shared folder',
      'Check coordinate system alignment and shared coordinates',
      'Run internal clash detection before federated coordination',
      'Validate IFC export against MVD requirements',
      'Check parameter and classification completeness',
      'Verify model file health (audit, purge, workset integrity)',
      'Document validation results and maintain validation log'
    ],

    examples: {
      'Commercial Building': `Model validation workflow:

**Pre-Publication Validation Checklist:**

Geometric Validation:
☑ Model aligned to correct coordinate system (OSGB36 origin)
☑ Levels match project datum (±5mm tolerance)
☑ Grid intersections verified against coordination model
☑ No detached elements or elements far from origin (>1km)
☑ Internal discipline clash detection complete (<50 clashes acceptable)

Data Validation:
☑ All elements classified using Uniclass 2015 (minimum Ss_XX_XX)
☑ Required parameters populated (Fire Rating, Acoustic Rating, U-Value)
☑ Space naming and numbering complete per room data sheet
☑ Door/window schedules complete with all required fields
☑ Material assignments appropriate (not Generic/Default)

File Health:
☑ Model audit completed with warnings resolved
☑ Purge unused families, groups, line patterns
☑ Worksets properly organized and minimal overlap
☑ File size reasonable (<500MB, <100K elements)
☑ No corrupt families or errors preventing model opening

Interoperability:
☑ IFC 4 export successful using Coordination View 2.0 MVD
☑ IFC geometry visually verified in viewer (Solibri/BIMcollab)
☑ IFC validation report generated with <10 errors
☑ BCF export capability verified

**Automated Validation (Solibri Rules):**
• Accessibility: Door widths, corridor widths, accessible routes
• Building Code: Stair geometry, guard heights, headroom
• MEP Clearances: Maintenance access, equipment clearances
• Quality: Duplicate elements, overlapping elements, small gaps
• Data: Classification completeness, parameter population`,

      'Infrastructure': `Infrastructure model validation:

**Highway Model Validation:**
☑ Alignment stationing consistent across all disciplines
☑ Vertical alignment matches approved design profile (±10mm)
☑ Cross-sections validate against design templates
☑ Superelevation transitions geometrically correct
☑ Tie-ins to existing road verified against survey
☑ Earthwork volumes within ±5% of estimate

**Structure Model Validation:**
☑ Structural analysis model matches BIM geometry model
☑ Connection details modeled to construction tolerance
☑ Rebar clearances and cover verified
☑ Loadings and design codes documented in model properties
☑ Clash detection with highway and drainage complete

**Drainage Model Validation:**
☑ Pipe gradients meet minimum design standards (1:200)
☑ Invert levels verified against longitudinal sections
☑ Hydraulic analysis results attached to model
☑ Outfall levels verified against watercourse survey
☑ Clash detection with utilities and structures complete`
    },

    commonMistakes: [
      'No systematic validation process, relying on ad-hoc checking',
      'Validation performed too late (after delivery instead of before)',
      'Missing automated validation tools and manual checking only',
      'No validation checklist leading to inconsistent reviews',
      'Internal clash detection skipped before federated coordination',
      'IFC export validation not performed before client delivery',
      'Validation results not documented or tracked',
      'No corrective action process for failed validations'
    ],

    // AI Prompt Configuration for generating field content
    aiPrompt: {
      system: 'You are a BIM model validation expert. Generate concise, practical validation procedures using checklist format.',
      instructions: 'Generate content similar to the examples above. Use checklist format (☑) with specific validation tools (e.g., Solibri Model Checker), quantifiable metrics (e.g., <50 clashes, ±5mm tolerance), and actionable items. Keep it practical and structured. Maximum 150 words.',
      style: 'checklist-based, specific tools mentioned, quantifiable metrics, structured categories'
    },

    relatedFields: ['qaFramework', 'reviewProcesses', 'complianceVerification', 'modelReviewAuthorisation']
  },

  reviewProcesses: {
    description: `Define formal review processes for design coordination, quality assurance, and client approvals at key project milestones.

Establish review processes for:
• Discipline internal reviews (peer review)
• Cross-disciplinary coordination reviews
• Design development milestone reviews
• Client and stakeholder reviews
• Constructability and value engineering reviews
• Pre-tender and pre-construction reviews`,

    iso19650: `ISO 19650-2:2018 Section 5.4.4 - Information Model Review and Authorization

Formal review processes ensure information is validated, coordinated, and approved by appropriate parties before progression to the next project stage.`,

    bestPractices: [
      'Define review frequency aligned with project milestones (RIBA stages)',
      'Establish review team composition and responsibilities',
      'Use federated models for coordination review sessions',
      'Document review comments using BCF or structured comment logs',
      'Define review duration and comment response timeframes',
      'Implement review sign-off procedures before stage progression',
      'Conduct design freeze periods before major milestones',
      'Maintain review meeting minutes and action logs'
    ],

    examples: {
      'Commercial Building': `Review process schedule:

**Weekly Coordination Review (Design Phase):**
• Frequency: Every Monday 10am
• Attendees: All discipline leads, BIM coordinator
• Duration: 2 hours
• Process:
  1. Review federated model (latest Shared versions)
  2. Discuss clash report from previous week
  3. Address coordination issues and design conflicts
  4. Assign actions with owners and deadlines
  5. Document decisions in meeting minutes
• Outputs: Updated clash register, action log, BCF issues

**Milestone Design Review (RIBA Stage Gates):**
• Trigger: End of RIBA Stage 3, 4, 5
• Attendees: Project director, client, all leads, consultants
• Duration: Half-day workshop
• Process:
  1. Design freeze 1 week before review
  2. Pre-review QA validation complete
  3. Presentation of federated model and key deliverables
  4. Client comments captured in structured log
  5. Comment resolution period (2 weeks)
  6. Formal sign-off before progressing to next stage
• Outputs: Review report, client approval, updated models

**Constructability Review (Pre-Construction):**
• Trigger: 4 weeks before tender
• Attendees: Design team, cost consultant, contractor (if early engagement)
• Process:
  1. Review construction sequences in 4D model
  2. Identify buildability issues and risks
  3. Value engineering opportunities
  4. Coordination with procurement strategy
• Outputs: Constructability report, design amendments`,

      'Infrastructure': `Infrastructure review framework:

**Fortnightly Design Coordination (Detailed Design):**
• Disciplines: Highway, Structures, Drainage, Utilities
• Focus: Interface coordination, clashes, design consistency
• Tools: Navisworks federated model review
• Deliverables: Clash resolution log, design change notices

**Statutory Review Meetings:**
• Frequency: Monthly during design
• Attendees: Statutory undertakers, local authority, planning
• Purpose: Coordination of utilities diversions, approvals
• Outputs: Agreed interface drawings, approval milestones

**Stage Gate Reviews (3 stages):**
1. Preliminary Design Review (30% design)
   - Concept approval, major decisions confirmed
2. Detailed Design Review (90% design)
   - Design coordination complete, ready for tender
3. Pre-Construction Review (100% design)
   - Constructability validated, contractor queries addressed

**Design Certification:**
• Independent technical review at each stage gate
• Design compliance with DMRB, Eurocodes verified
• Sign-off by Technical Director before progression`
    },

    commonMistakes: [
      'No defined review schedule aligned with milestones',
      'Review team composition not specified',
      'Not using federated models for coordination reviews',
      'Review comments not documented systematically (BCF)',
      'No timeframes for comment resolution',
      'Missing formal sign-off before stage progression',
      'No design freeze period before major reviews',
      'Review meeting minutes not maintained or distributed'
    ],

    relatedFields: ['approvalWorkflows', 'coordinationMeetings', 'modelReviewAuthorisation', 'issueResolution']
  },

  approvalWorkflows: {
    description: `Define approval workflows and authorization procedures for information deliverables, ensuring appropriate review and sign-off before information is shared or published.

Establish workflows for:
• Internal discipline approvals (author-checker-approver)
• Cross-discipline coordination approvals
• Lead appointed party approvals
• Client/appointing party approvals
• Milestone and stage gate approvals
• As-built and handover approvals`,

    iso19650: `ISO 19650-2:2018 Section 5.4.6 - Information Approval and Authorization

Clear approval workflows ensure information is reviewed and authorized by competent parties before being used for decision-making or construction.`,

    bestPractices: [
      'Implement author-checker-approver workflow for all deliverables',
      'Define approval authority matrix (who can approve what)',
      'Use CDE workflow states to manage approval status',
      'Establish timeframes for approval (e.g., 5 working days)',
      'Implement digital approval workflows within CDE',
      'Require formal sign-off for milestone deliverables',
      'Maintain approval logs and audit trails',
      'Define escalation process for approval delays or disputes'
    ],

    examples: {
      'Commercial Building': `Approval workflow process:

**Level 1: Internal Discipline Approval (Author-Checker-Approver)**
1. Author: Model author creates/updates information (WIP folder)
2. Checker: Peer review by colleague (48-hour SLA)
   - Check against modeling standards
   - Verify parameter completeness
   - Internal clash detection
3. Approver: Discipline lead approval (24-hour SLA)
   - Assign suitability code (S0, S1, S2, etc.)
   - Publish to Shared folder
   - Notify coordination team

**Level 2: Cross-Discipline Coordination Approval**
1. BIM Coordinator: Federate all discipline models
2. Clash Detection: Generate clash report
3. Coordination Review: Weekly meeting to resolve clashes
4. BIM Manager Approval: Coordination sign-off
   - Suitability code S1 (Suitable for Coordination)

**Level 3: Lead Appointed Party Approval (Client Submission)**
1. Information Manager: Collate all deliverables
2. QA Review: Final quality validation
3. Project Director: Internal approval and sign-off
4. Submit to Client: Move to Published folder
   - Suitability code S3 (Suitable for Review & Comment) or S4 (Suitable for Stage Approval)

**Level 4: Client/Appointing Party Approval**
1. Client Review: Comment period (10 working days)
2. Comment Resolution: Address client feedback
3. Client Authorization: Formal approval
   - Suitability code S4 (Stage Approved) or S6 (As-built Authorized)

**Approval Authority Matrix:**
| Information Type | Author | Checker | Discipline Approver | BIM Manager | Project Director | Client |
|-----------------|--------|---------|---------------------|-------------|------------------|--------|
| WIP Models | ✓ | - | - | - | - | - |
| Shared Models | ✓ | ✓ | ✓ | - | - | - |
| Coordinated Models | ✓ | ✓ | ✓ | ✓ | - | - |
| Client Deliverables | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| Stage Approval | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

**Timeframes:**
• Internal checking: 48 hours
• Discipline approval: 24 hours
• BIM Manager coordination approval: 72 hours
• Project Director sign-off: 5 working days
• Client review: 10 working days`,

      'Infrastructure': `Infrastructure approval process:

**Design Approval Workflow:**

**Stage 1: Designer Internal Approval**
• Author → Senior Engineer (technical check) → Discipline Lead (approval)
• Timeframe: 3 working days
• Output: Suitability S1 (Coordination)

**Stage 2: Multi-Discipline Coordination**
• Federated model review → Clash resolution → BIM Manager approval
• Timeframe: 1 week (fortnightly cycle)
• Output: Suitability S2 (Information)

**Stage 3: Design Certification**
• Independent Checker (IC) review
• Technical Director approval
• Compliance with DMRB, Eurocodes certified
• Timeframe: 2 weeks
• Output: Suitability S3 (Review & Comment) for client

**Stage 4: Client Approval**
• Client technical review (Highways England, Network Rail, etc.)
• Approval to proceed to next design stage
• Timeframe: 4 weeks
• Output: Suitability S4 (Stage Approved)

**Stage 5: Construction Approval**
• Contractor buildability review
• Final design freeze
• Issue for Construction authorization
• Output: Suitability S5 (Construction)

**Approval Escalation:**
• Day 1-5: Normal workflow
• Day 6-10: Reminder to approver
• Day 11+: Escalate to Project Manager
• Critical path items: Immediate escalation`
    },

    commonMistakes: [
      'No author-checker-approver workflow defined',
      'Approval authority matrix not documented',
      'CDE workflow states not used to track approvals',
      'No timeframes specified for approvals',
      'Manual approval tracking instead of digital CDE workflows',
      'Missing formal sign-off for milestones',
      'Approval logs not maintained',
      'No escalation process for delayed approvals'
    ],

    relatedFields: ['reviewProcesses', 'workflowStates', 'documentControlInfo', 'modelReviewAuthorisation']
  },

  complianceVerification: {
    description: `Define procedures for verifying compliance with project standards, client requirements, regulatory codes, and ISO 19650 information management protocols.

Verification should cover:
• Compliance with project BIM execution plan
• Adherence to naming and classification standards
• Compliance with LOD/LOIN requirements
• Building regulation and code compliance
• Client EIR and PIR compliance
• ISO 19650 process compliance`,

    iso19650: `ISO 19650-2:2018 Section 5.4.5 - Model Production Delivery Table

Compliance verification ensures delivered information meets all project requirements, standards, and regulatory obligations.`,

    bestPractices: [
      'Implement automated compliance checking using rule-based tools',
      'Conduct periodic compliance audits (monthly or per milestone)',
      'Verify adherence to EIR requirements at each delivery milestone',
      'Check regulatory code compliance (building codes, accessibility)',
      'Validate ISO 19650 process compliance (CDE usage, naming, etc.)',
      'Document compliance status in delivery reports',
      'Establish corrective action procedures for non-compliance',
      'Include compliance verification in QA framework'
    ],

    examples: {
      'Commercial Building': `Compliance verification procedures:

**BIM Execution Plan Compliance:**
• Verification: Monthly audit by Information Manager
• Checks:
  - Models following naming conventions (ISO 19650 format)
  - Classification applied (Uniclass 2015 to required depth)
  - LOD compliance per stage (LOD 300 Stage 3, LOD 350 Stage 4)
  - CDE workflow states used correctly (WIP/Shared/Published)
  - Parameter population completeness (95%+ target)
• Tool: Automated compliance report from Solibri/BIMcollab
• Output: Monthly compliance report with corrective actions

**Building Regulations Compliance:**
• Verification: Milestone review by Building Control Consultant
• Checks:
  - Fire escape routes and travel distances (Approved Document B)
  - Accessibility compliance (Approved Document M)
  - Structural loading compliance (Approved Document A)
  - Energy performance (Part L compliance)
• Tool: Solibri Model Checker with UK Building Regs ruleset
• Output: Compliance certificate for Building Control submission

**Client EIR Compliance:**
• Verification: Stage gate review by Project Director
• Checks:
  - All EIR deliverables provided (models, data, drawings)
  - Information delivery milestones met
  - Data drops in correct format (IFC, COBie, etc.)
  - Security and data classification requirements met
• Output: EIR compliance matrix (RAG status report)

**ISO 19650 Process Compliance:**
• Verification: Quarterly audit by Information Manager
• Checks:
  - CDE structure and workflow compliance
  - Suitability codes applied correctly (S0-S6)
  - Information containers named per standard
  - Approval workflows followed
  - Audit trails maintained
• Tool: CDE audit report
• Output: ISO 19650 compliance certificate`,

      'Infrastructure': `Infrastructure compliance framework:

**Design Standards Compliance (DMRB):**
• Verification: Independent technical review at each stage
• Checks:
  - Geometric design compliance (alignment standards, sight lines)
  - Pavement design per DMRB CD 226
  - Drainage design per DMRB CD 526
  - Structures design per Eurocodes and DMRB BD/CD series
• Tool: Design checker software + manual review
• Output: Technical compliance certificate

**Planning Conditions Compliance:**
• Verification: Monthly by Planning Consultant
• Checks:
  - Environmental mitigation measures modeled
  - Landscape screening provisions
  - Noise barrier heights and locations
  - Ecology protection measures
• Output: Planning compliance report for local authority

**Statutory Approvals Compliance:**
• Verification: Interface coordination meetings
• Checks:
  - Utilities diversions per statutory undertaker agreements
  - Highway authority technical approvals (S278, S38)
  - Environmental permits (watercourse crossings, etc.)
  - CDM compliance and safety file requirements
• Output: Approvals tracker (RAG status)

**Client PIR Compliance:**
• Verification: Stage deliverable reviews
• Checks:
  - Asset data completeness for handover
  - GIS data format and accuracy
  - As-built model accuracy (±25mm tolerance)
  - O&M manual integration with model
• Output: PIR compliance statement`
    },

    commonMistakes: [
      'No automated compliance checking tools used',
      'Compliance audits not scheduled regularly',
      'EIR requirements not tracked systematically',
      'Building code compliance not verified until late stage',
      'ISO 19650 process compliance assumed, not verified',
      'Compliance status not documented in reports',
      'No corrective action process for non-compliance',
      'Compliance verification separate from QA framework'
    ],

    relatedFields: ['qaFramework', 'modelValidation', 'reviewProcesses', 'approvalWorkflows']
  },

  modelReviewAuthorisation: {
    description: `Define the procedures for reviewing and authorizing information models before they are shared, published, or used for construction and asset management.

Include procedures for:
• Model review criteria and checklists
• Authorization levels and responsibilities
• Sign-off procedures for different model purposes
• Documentation of review outcomes
• Non-conformance handling and resubmission
• Final authorization for construction and handover`,

    iso19650: `ISO 19650-2:2018 Section 5.4.6 - Information Approval

Model authorization ensures that information is fit for its intended purpose and has been reviewed and approved by appropriate competent parties.`,

    bestPractices: [
      'Define suitability codes (S0-S7) for different authorization levels',
      'Establish authorization matrix defining who can authorize what',
      'Require formal sign-off for milestone model deliveries',
      'Document authorization with date, authorizer name, and suitability code',
      'Implement digital authorization workflows within CDE',
      'Define resubmission procedures for rejected models',
      'Maintain authorization log tracking all approvals',
      'Final authorization (S6) required before as-built handover'
    ],

    examples: {
      'Commercial Building': `Model authorization process using ISO 19650 suitability codes:

**Suitability Code Framework:**

**S0 - Work in Progress (WIP)**
• Review: Self-check by author only
• Authorization: None required
• Purpose: Internal development
• Location: WIP folder
• Documentation: None

**S1 - Suitable for Coordination**
• Review Criteria:
  - Model meets internal standards
  - Coordinate system correct
  - Internal clash detection complete (<50 clashes)
  - Ready for multi-discipline coordination
• Authorized by: Discipline Lead
• Documentation: Internal review checklist signed
• Location: Shared folder

**S2 - Suitable for Information**
• Review Criteria:
  - Federated coordination complete
  - Cross-discipline clashes resolved (target: <10 clashes)
  - Model validated (Solibri rules passed)
  - Information content verified
• Authorized by: BIM Manager
• Documentation: Coordination review report
• Location: Shared folder

**S3 - Suitable for Review & Comment**
• Review Criteria:
  - Full QA validation passed
  - Client deliverable checklist complete
  - IFC export validated
  - Ready for client review
• Authorized by: Project Director
• Documentation: QA report + sign-off certificate
• Location: Published folder (client access)

**S4 - Suitable for Stage Approval**
• Review Criteria:
  - Client comments addressed
  - Stage deliverables complete per EIR
  - Milestone requirements met
  - Stage gate approval obtained
• Authorized by: Client/Appointing Party
• Documentation: Client approval letter + sign-off
• Location: Published folder (approved)

**S6 - Suitable for PIM Authorization (As-Built)**
• Review Criteria:
  - As-built survey verification complete
  - Asset data validated (COBie)
  - O&M information linked
  - Handover requirements met
• Authorized by: Client Asset Manager
• Documentation: Handover certificate + PIM authorization
• Location: Archive folder (final record)

**Authorization Matrix:**
| Suitability | Reviewer | Authorizer | Criteria | Documentation |
|-------------|----------|------------|----------|---------------|
| S0 | Author | Author | Self-check | None |
| S1 | Peer | Discipline Lead | Internal standards | Review checklist |
| S2 | BIM Coordinator | BIM Manager | Coordination | Clash report |
| S3 | QA Team | Project Director | Client-ready | QA certificate |
| S4 | Client Team | Client Rep | Stage approval | Approval letter |
| S6 | FM Team | Asset Manager | As-built handover | Handover cert |

**Non-Conformance Procedure:**
1. Review identifies non-conformance
2. Model rejected with detailed comments (BCF)
3. Author corrects issues
4. Resubmit for review (same suitability level)
5. Re-authorization if compliant`,

      'Infrastructure': `Infrastructure authorization workflow:

**Design Stage Authorizations:**

**S1 - Coordination (Internal)**
• Authorizer: Discipline Engineer
• Criteria: Design standards met, ready for coordination
• Documentation: Design calculation sign-off

**S2 - Information (Federated)**
• Authorizer: Lead Engineer
• Criteria: Multi-discipline coordination complete
• Documentation: Coordination meeting minutes

**S3 - Review (Client Submission)**
• Authorizer: Technical Director
• Criteria: Independent check complete, design certified
• Documentation: Independent Checker certificate

**S4 - Approval (Stage Gate)**
• Authorizer: Client Representative (Highways England, Network Rail)
• Criteria: Technical approval, compliance verified
• Documentation: Technical Approval Certificate (TAC)

**S5 - Construction**
• Authorizer: Principal Designer (CDM)
• Criteria: Buildability confirmed, contractor accepted
• Documentation: Construction authorization letter

**S6 - As-Built (Handover)**
• Authorizer: Client Asset Manager
• Criteria: As-built verified, asset data complete
• Documentation: Asset Information Model (AIM) acceptance

**Resubmission Process:**
If model fails authorization:
1. Authorizer documents reasons for rejection
2. Design team addresses comments (tracked in register)
3. Updated model resubmitted within defined timeframe
4. Re-review and authorization decision (accept/reject)
5. If critical path: escalation to Project Manager`
    },

    commonMistakes: [
      'Suitability codes (S0-S7) not defined or used',
      'No authorization matrix - unclear who can authorize',
      'Missing formal sign-off procedures for milestones',
      'Authorization not documented (date, name, code)',
      'Manual authorization instead of digital CDE workflows',
      'No resubmission procedures for failed reviews',
      'Authorization log not maintained',
      'S6 (as-built) authorization skipped at handover'
    ],

    relatedFields: ['approvalWorkflows', 'modelValidation', 'reviewProcesses', 'workflowStates']
  },

  // ====================================================================
  // SECTION 10 - INFORMATION SECURITY AND PRIVACY
  // ====================================================================

  dataClassification: {
    description: `Define data classification levels and corresponding security controls to protect sensitive project information.

Establish classification levels such as:
• Public: Information suitable for public release
• Internal: Information for project team use only
• Confidential: Sensitive commercial or proprietary information
• Restricted: Highly sensitive information requiring strict controls

For each level, define access controls, encryption requirements, sharing restrictions, and retention policies.`,

    iso19650: `ISO 19650-5:2020 - Security-Minded Approach to Information Management

Data classification is fundamental to information security, ensuring appropriate protection measures are applied based on information sensitivity.`,

    bestPractices: [
      'Define 3-4 classification levels appropriate to project risk',
      'Apply classification labels to all project information',
      'Align classification with client information security policies',
      'Define handling requirements for each classification level',
      'Implement need-to-know access controls',
      'Establish de-classification procedures for handover',
      'Train team on classification system and responsibilities',
      'Audit classification compliance regularly'
    ],

    examples: {
      'Commercial Building': `Data classification framework:

**PUBLIC**
Description: Non-sensitive information suitable for public release
Examples: Marketing visualizations, project overview, sustainability credentials
Access Controls: Publicly accessible
Encryption: Not required
Sharing: Unrestricted
Retention: Permanent archive

**INTERNAL**
Description: General project information for authorized project team
Examples: Design models, coordination reports, meeting minutes
Access Controls: Project team members only, role-based access
Encryption: In transit (SSL/TLS)
Sharing: Secure CDE sharing only, no email attachments >10MB
Retention: 7 years post-completion

**CONFIDENTIAL**
Description: Sensitive commercial information
Examples: Cost estimates, contractor pricing, commercial negotiations
Access Controls: Named individuals only, multi-factor authentication
Encryption: In transit and at rest (AES-256)
Sharing: Encrypted file transfer only, watermarked documents
Retention: 10 years, secure destruction

**RESTRICTED**
Description: Highly sensitive information requiring maximum protection
Examples: Security systems design, client confidential data, personal information
Access Controls: Explicit authorization required, access logged
Encryption: Military-grade encryption, secure enclaves
Sharing: Prohibited without written authorization
Retention: Defined by legal/contractual requirements`,

      'Infrastructure': `Infrastructure security classification:

**PUBLIC**
Examples: Planning visualizations, community engagement materials

**OFFICIAL**
Description: Routine project information (Government Security Classification)
Examples: General design drawings, non-sensitive correspondence
Access: Vetted project team personnel
Encryption: TLS for transmission

**OFFICIAL-SENSITIVE**
Description: Information requiring protection from unauthorized disclosure
Examples: Detailed infrastructure drawings, utilities diversions
Access: Security-cleared personnel only
Encryption: End-to-end encryption, secure storage
Sharing: Secure government networks (PSN, GSI)
Handling: Controlled print, numbered copies, destruction logs

**SECRET** (if applicable)
Description: National security sensitive information
Examples: Critical national infrastructure details, counter-terrorism measures
Access: SC/DV cleared personnel only
Encryption: CESG-approved encryption
Sharing: Secure government networks only, face-to-face meetings
Handling: Maximum security protocols, secure facilities only`
    },

    commonMistakes: [
      'No classification system defined - all data treated equally',
      'Over-classification making collaboration difficult',
      'Under-classification exposing sensitive information',
      'Classification labels not applied to documents',
      'No enforcement of classification handling requirements',
      'Missing alignment with client security policies',
      'Team not trained on classification system',
      'No audit or monitoring of classification compliance'
    ],

    aiPrompt: {
      system: 'You are an ISO 19650-5 information security specialist. Define data classification levels and handling controls suitable for project information management.',
      instructions: 'Define 3-4 data classification levels and, for each, specify: typical examples, access controls (role/need-to-know), encryption requirements (in transit/at rest), sharing restrictions, and retention/disposal. Include requirements for labelling/metadata, training/awareness, and periodic audits. Keep controls proportionate and aligned to client security policies. Maximum 180 words.',
      style: 'security-minded, policy-style, level-by-level structure, concise'
    },

    relatedFields: ['accessPermissions', 'encryptionRequirements', 'dataTransferProtocols', 'privacyConsiderations']
  },

  accessPermissions: {
    description: `Define access control policies and permissions ensuring information is accessible only to authorized personnel based on role and need-to-know.

Specify:
• Role-based access control (RBAC) framework
• Permission levels (read, write, edit, delete, share)
• Access request and approval procedures
• Access review and recertification processes
• Guest/external party access protocols
• Access revocation procedures (leavers, project completion)`,

    iso19650: `ISO 19650-5:2020 Section 7 - Information Security Management

Access controls ensure that information is only accessible to authorized individuals, preventing unauthorized disclosure, modification, or deletion.`,

    bestPractices: [
      'Implement role-based access control (RBAC) aligned with project roles',
      'Follow principle of least privilege - minimum access needed for role',
      'Define permission levels clearly (view, edit, approve, share)',
      'Require approval workflow for access requests',
      'Implement multi-factor authentication for remote access',
      'Conduct quarterly access reviews and recertification',
      'Revoke access immediately upon personnel departure',
      'Maintain audit logs of access grants and revocations'
    ],

    examples: {
      'Commercial Building': `Access control framework:

**Role-Based Access Control:**

Project Administrator:
• Full access to all project folders and workflow states
• User management and access granting authority
• CDE configuration and security settings
• Audit log access

Discipline Lead:
• Full access to own discipline folders (read/write/delete)
• Read access to other disciplines' Shared/Published models
• Cannot access financial/commercial folders
• Can approve models for own discipline

Design Team Member:
• Read/write access to own discipline WIP folder
• Read-only access to Shared folder (all disciplines)
• Read-only access to Published folder
• Cannot publish or approve models

Client Representative:
• Read-only access to Shared and Published folders
• Comment and markup permissions
• Cannot modify or delete project information
• Access to reports and dashboards

Contractor (Construction Phase):
• Read access to Published construction models
• Write access to site progress/as-built folders
• Cannot access pre-construction commercial data
• Time-limited access (contract duration only)

External Consultant:
• Access limited to specific folders relevant to scope
• Time-limited access (engagement duration)
• Cannot download bulk data
• Activity monitored and logged

**Access Request Workflow:**
1. Submit access request via CDE portal
2. Line manager approval
3. Information Manager verification
4. Access granted with expiry date
5. Welcome email with security guidelines
6. Quarterly access review and revalidation`,

      'Infrastructure': `Government infrastructure access control:

**Security Clearance-Based Access:**

SC Cleared Personnel (Security Check):
• Access to OFFICIAL-SENSITIVE information
• Full design model access
• Critical infrastructure details
• Subject to 5-year reclearance

BPSS Cleared Personnel (Baseline Personnel Security Standard):
• Access to OFFICIAL information only
• General design information
• Non-sensitive project data
• Annual recertification

Guest Access (Uncleared):
• PUBLIC information only
• Visualization models only
• Supervised access required
• Maximum 30-day duration

**Need-to-Know Enforcement:**
Even with appropriate clearance, access granted only for specific project need
Access logged and auditable
Periodic access reviews by security manager
Immediate revocation upon project departure or role change`
    },

    commonMistakes: [
      'No role-based access control - everyone has full access',
      'Excessive permissions granted (more than needed for role)',
      'No access request approval workflow',
      'Access not revoked when personnel leave project',
      'No periodic access reviews leading to permission creep',
      'Guest/external access not time-limited',
      'No audit logs of who accessed what information',
      'Missing multi-factor authentication for remote access'
    ],

    relatedFields: ['dataClassification', 'accessControl', 'securityMeasures', 'workflowStates']
  },

  encryptionRequirements: {
    description: `Define encryption requirements ensuring information confidentiality during transmission, storage, and backup.

Specify encryption for:
• Data in transit (network transmission, file transfers)
• Data at rest (CDE storage, backups, archives)
• End-to-end encryption for sensitive communications
• Encryption key management and rotation
• Compliance with industry standards (AES-256, TLS 1.2+)`,

    iso19650: `ISO 19650-5:2020 Section 8.3 - Cryptographic Controls

Encryption protects information from unauthorized access during transmission and storage, ensuring confidentiality even if physical security is breached.`,

    bestPractices: [
      'AES-256 encryption for data at rest (storage, backups)',
      'TLS 1.2 or higher for data in transit (network communications)',
      'End-to-end encryption for highly sensitive information',
      'Encrypt all mobile devices and removable media',
      'Implement certificate-based encryption for CDE access',
      'Define encryption key management and rotation policies',
      'Ensure cloud storage providers meet encryption standards',
      'Encrypt email attachments containing sensitive information'
    ],

    examples: {
      'Commercial Building': `Encryption framework:

**Data at Rest:**
• CDE cloud storage: AES-256 encryption (Microsoft Azure/AWS standard)
• Local workstation storage: BitLocker full disk encryption
• Backup systems: AES-256 encryption with separate key management
• Archive storage: Encrypted compressed archives (7-Zip AES-256)
• Mobile devices: Device-level encryption (iOS/Android native)
• USB drives: VeraCrypt or BitLocker To Go encryption required

**Data in Transit:**
• CDE access: TLS 1.3 with certificate pinning
• VPN connections: IPSec with AES-256-GCM encryption
• File transfers: SFTP or HTTPS only (no FTP/HTTP)
• Email: TLS encryption for all SMTP traffic
• Large file transfers: Encrypted file transfer services (ShareFile, Citrix)

**Key Management:**
• Encryption keys stored in hardware security modules (HSM)
• Key rotation every 12 months
• Separate keys for different data classification levels
• Key escrow for business continuity (dual control)
• Secure key deletion procedures for decommissioned systems

**Sensitive Communications:**
• Financial information: Encrypted email with read receipts
• Personal data: End-to-end encrypted messaging (Signal, Teams E2E)
• Commercial negotiations: Encrypted virtual data rooms
• Security information: Government-approved encryption (CESG)`,

      'Infrastructure': `Government-grade encryption:

**OFFICIAL-SENSITIVE Data:**
• Encryption: CESG-approved product (TLS 1.2+, AES-256)
• Storage: Government-approved cloud (G-Cloud framework)
• Transmission: Secure government networks (PSN, GSI)
• Key management: Public Key Infrastructure (PKI)

**Physical Media:**
• Encrypted USB drives only (FIPS 140-2 Level 2 certified)
• Encrypted external hard drives for large data transfers
• Secure destruction of encryption keys when media retired

**Email Security:**
• TLS encryption for all external email
• S/MIME or PGP for sensitive attachments
• DLP (Data Loss Prevention) scanning before sending
• Encrypted email gateway for government correspondence`
    },

    commonMistakes: [
      'No encryption for data at rest (unencrypted CDE storage)',
      'Using outdated encryption protocols (TLS 1.0, SSL)',
      'Unencrypted backup systems exposing sensitive data',
      'No encryption for mobile devices or USB drives',
      'Missing encryption key management and rotation procedures',
      'Email attachments sent unencrypted',
      'Cloud storage without encryption verification',
      'No policy for secure key storage and escrow'
    ],

    relatedFields: ['securityMeasures', 'dataClassification', 'dataTransferProtocols', 'backupProcedures']
  },

  dataTransferProtocols: {
    description: `Define secure protocols and procedures for transferring information between project team members, external parties, and client systems.

Specify protocols for:
• Internal file transfers within project team
• External file transfers to client and stakeholders
• Large file transfer procedures
• Secure email communications
• Mobile and remote access
• Third-party data exchange`,

    iso19650: `ISO 19650-5:2020 Section 8.2 - Communications Security

Secure data transfer protocols prevent unauthorized interception, modification, or disclosure of information during exchange.`,

    bestPractices: [
      'Use CDE for primary file sharing (not email attachments)',
      'Implement secure file transfer for large files (SFTP, managed file transfer)',
      'Encrypt all email attachments containing sensitive information',
      'Prohibit use of consumer file-sharing services (Dropbox, WeTransfer personal)',
      'Require VPN for remote access to project systems',
      'Implement data loss prevention (DLP) scanning',
      'Define maximum file size for email attachments (e.g., 10MB)',
      'Maintain transfer logs for audit and compliance'
    ],

    examples: {
      'Commercial Building': `Data transfer protocols:

**Internal Team File Sharing:**
• Primary Method: CDE (BIM 360, Aconex)
  - Automatic encryption in transit (TLS)
  - Version control and audit trails
  - Role-based access control
• Secondary Method: Secure network shares (SMB 3.0 encrypted)
• Prohibited: Email attachments >10MB, personal cloud services

**External File Transfers:**
• Client Deliverables: CDE Published folder with automated notification
• Large Files to External Parties: Citrix ShareFile (encrypted links, expiry dates)
• Email Attachments: Maximum 10MB, encrypted if confidential
• Physical Media: Encrypted USB drives with courier tracking

**Secure Email:**
• Standard Email: TLS encryption automatic (Office 365/Google Workspace)
• Confidential Attachments: Password-protected ZIP or PDF encryption
• Highly Sensitive: S/MIME encrypted email or secure portal
• External Email: Warning banner on classification level

**Remote Access:**
• VPN Required: IPSec VPN with multi-factor authentication
• Cloud CDE Access: Certificate-based authentication + MFA
• Mobile Access: MDM (Mobile Device Management) enrolled devices only
• Public WiFi: VPN mandatory before accessing project data

**Third-Party Data Exchange:**
• Contractors: Dedicated CDE folders with time-limited access
• Consultants: VPN access to specific network shares
• Suppliers: Secure vendor portal for product data
• Regulatory Authorities: Secure government file transfer (Egress, Galaxkey)

**Data Loss Prevention (DLP):**
• Email scanning for sensitive information (cost data, personal info)
• Automatic encryption trigger for keywords (confidential, budget, personal)
• Block unauthorized cloud upload attempts
• Alert for large data exfiltration attempts`,

      'Infrastructure': `Government infrastructure data transfer:

**OFFICIAL Data Transfer:**
• Government Secure Network: PSN (Public Services Network)
• Secure Email: GSI (Government Secure Intranet) email
• File Transfer: Secure FTP to government systems
• Courier: Approved government courier services

**OFFICIAL-SENSITIVE Transfer:**
• Transmission: Encrypted channels only (CESG-approved)
• Email: S/MIME or PGP encryption mandatory
• Physical Media: Encrypted drives with dual-lock courier
• Hand Delivery: Signed receipt required
• Destruction: Certificate of secure destruction

**External Stakeholder Transfer:**
• Planning Authority: Secure planning portal upload
• Statutory Undertakers: Encrypted email or secure web portal
• Local Authorities: Government-approved file sharing (Egress)
• Public Consultation: Redacted documents on public portal (PUBLIC classification only)`
    },

    commonMistakes: [
      'Relying on email attachments for large file transfers',
      'Using consumer file-sharing services without encryption',
      'No restrictions on email attachment size or type',
      'Missing VPN requirement for remote access',
      'Unencrypted physical media for data transfer',
      'No data loss prevention scanning',
      'External parties granted direct CDE access without controls',
      'No audit logging of data transfers'
    ],

    relatedFields: ['encryptionRequirements', 'accessPermissions', 'securityMeasures', 'cdeStrategy']
  },

  privacyConsiderations: {
    description: `Define privacy protection measures ensuring compliance with UK GDPR and Data Protection Act 2018, particularly for personal data captured in project information.

Address:
• Identification of personal data in project information
• Lawful basis for processing personal data
• Data minimization and retention policies
• Individual rights (access, rectification, erasure)
• Data protection impact assessments (DPIA)
• Third-party data processor agreements
• Data breach notification procedures`,

    iso19650: `ISO 19650-5:2020 Section 5.3 - Legal and Regulatory Requirements

Privacy considerations ensure compliance with data protection legislation, protecting individuals' rights and avoiding significant legal and reputational risks.`,

    bestPractices: [
      'Identify and document all personal data in project (staff, clients, residents)',
      'Minimize personal data collection - only what is necessary',
      'Define retention periods and secure deletion procedures',
      'Establish procedures for data subject access requests',
      'Conduct DPIA for projects involving significant personal data',
      'Ensure third-party contracts include data processor clauses',
      'Implement data breach detection and notification procedures',
      'Appoint Data Protection Officer (DPO) or privacy lead',
      'Train team on GDPR obligations and privacy awareness'
    ],

    examples: {
      'Commercial Building': `Privacy protection framework:

**Personal Data Identification:**
• Project Personnel: Names, contact details, signatures, photographs
• Client Representatives: Contact information, site visit records
• Site Workers: Names, CSCS card details, access logs, inductions
• Building Users: Tenant contact details, accessibility requirements
• Visitors: Sign-in sheets, CCTV footage, access card records

**Lawful Basis:**
• Contractual Performance: Processing necessary for project delivery
• Legitimate Interests: Security, health and safety compliance
• Consent: Photographs for marketing (explicit opt-in required)
• Legal Obligation: Health and safety records, building control submissions

**Data Minimization:**
• Collect only name and role (not full personal details) for project contacts
• Anonymize site photographs where possible
• Redact personal data from published documents
• Limit CCTV retention to 30 days unless security incident

**Data Retention:**
• Project Personnel Data: Duration of project + 6 months, then secure deletion
• H&S Records: 7 years from project completion (legal requirement)
• Access Logs: 90 days retention, then automatic deletion
• CCTV: 30 days rolling retention, secure overwrite

**Individual Rights:**
• Data Subject Access Request (DSAR): Respond within 30 days
• Right to Rectification: Correct inaccurate personal data within 5 days
• Right to Erasure: Delete data when no longer needed (unless legal retention)
• Right to Object: Opt-out of marketing photographs

**Data Protection Impact Assessment (DPIA):**
Required for:
• Extensive CCTV monitoring of construction site
• Biometric access control systems (fingerprint, facial recognition)
• Processing of special category data (health data for accessibility)

**Third-Party Processors:**
All subcontractors and suppliers sign Data Processor Agreement:
• Process data only on documented instructions
• Implement appropriate security measures
• Assist with data subject rights requests
• Notify of data breaches within 24 hours
• Delete/return data at end of contract

**Data Breach Procedures:**
1. Detect: Monitoring, incident reports, audit logs
2. Contain: Isolate affected systems, revoke access
3. Assess: Severity, individuals affected, risks
4. Notify: ICO within 72 hours if high risk, affected individuals if severe
5. Remediate: Fix vulnerability, prevent recurrence
6. Document: Breach register, lessons learned`,

      'Infrastructure': `Infrastructure privacy compliance:

**Public Realm Considerations:**
• Highway CCTV: Privacy notices, limited retention, DPIA conducted
• Resident Consultation: Anonymized feedback, consent for attribution
• Land Ownership Data: Treated as confidential, secure handling
• Noise/Air Quality Monitoring: Anonymize property addresses
• Public Inquiry Submissions: Redact personal data before publication

**Utilities and Property Data:**
• Property Owner Information: Confidential, secure storage, limited access
• Utility Customer Data: Third-party NDA, strict access controls
• Compensation Claims: Secure legal hold, extended retention

**Workforce Privacy:**
• Site Worker Records: Secure, access-limited to H&S manager
• Security Clearance Data: Encrypted, restricted access, secure destruction
• Incident Reports: Anonymize where possible, limited distribution

**Data Sharing:**
• Statutory Undertakers: DPA in place, data minimization
• Planning Authority: Public data only, redact private information
• Emergency Services: Lawful basis under public safety`
    },

    commonMistakes: [
      'No identification of personal data in project information',
      'Excessive retention of personal data beyond project needs',
      'Missing lawful basis for processing personal data',
      'No procedures for data subject access requests',
      'CCTV without privacy notices or DPIA',
      'Third-party contracts without data processor clauses',
      'No data breach notification procedures',
      'Publishing documents containing unredacted personal data',
      'No privacy training for project team'
    ],

    relatedFields: ['dataClassification', 'accessPermissions', 'securityMeasures', 'auditTrails']
  },

  changeManagementProcess: {
    description: `Define the formal change management process for handling modifications to project information requirements, BIM strategy, delivery schedules, or technical standards during project execution. This ensures all changes are controlled, documented, and communicated systematically.

Cover:
• **Change Initiation**: How changes are requested (forms, CDE workflows, stakeholder triggers)
• **Impact Assessment**: Evaluation criteria (cost, time, quality, coordination, resources)
• **Approval Authority**: Who approves changes (Change Control Board, client, IM)
• **Implementation Process**: How approved changes are executed (TIDP/MIDP updates, notifications)
• **Documentation**: Change log, audit trails, version control per ISO 19650-2 clause 5.7
• **Communication**: Team notification procedures and stakeholder updates

This prevents uncontrolled scope creep and maintains information integrity throughout the project lifecycle.`,

    iso19650: `ISO 19650-2:2018 Section 5.7 - Information Management During Project Delivery

The standard requires systematic management of changes to information requirements and delivery plans. Changes must be:
• Properly authorized by the appointing party
• Documented with clear audit trails
• Communicated to all affected task teams
• Reflected in updated TIDPs and MIDP

**Post-Appointment Context**: Change management is critical during execution to handle evolving client requirements, design development, and unforeseen challenges whilst maintaining information delivery commitments.

Robust change control prevents coordination failures, missed deliverables, and disputes over scope.`,

    bestPractices: [
      'Establish clear thresholds for minor vs. major changes requiring different approval levels',
      'Define Change Control Board composition (IM, Project Director, Client Rep minimum)',
      'Set response timeframes (e.g., 5 working days for standard changes)',
      'Use CDE-integrated change request forms with mandatory impact assessments',
      'Require changes to trigger automatic TIDP/MIDP review and updates',
      'Maintain comprehensive change log with audit trail per ISO 19650',
      'Implement automated team notifications when changes are approved',
      'Link changes to contract variations when affecting scope/cost',
      'Conduct regular Change Control Board meetings (weekly or fortnightly)',
      'Document rejected changes with rationale for future reference',
      'Include change statistics in project performance reporting'
    ],

    examples: {
      'Commercial Building': `CHANGE MANAGEMENT PROCEDURE

**Change Request Initiation:**
Any stakeholder may submit change request via CDE workflow using standardized form CR-001. Request must include: description, justification, affected deliverables, proposed solution.

**Impact Assessment (Information Manager):**
Within 3 working days, IM evaluates:
• Schedule impact on TIDP/MIDP milestones
• Resource allocation changes required
• Coordination effects across task teams
• Software/technology implications
• Budget impact (if scope change)
• Risk to downstream deliverables

**Approval Process:**
Minor Changes (no milestone impact, <5 days effort): IM approval, 2-day turnaround
Standard Changes (milestone shift, significant effort): Change Control Board (weekly meetings), 5-day decision
Major Changes (scope change, contract variation): CCB + Client Director approval, 10-day process with commercial review

**Implementation:**
Approved changes trigger:
1. TIDP/MIDP schedule updates published to CDE
2. Automated email notifications to all affected task teams
3. Updated Information Delivery Plan issued within 5 days
4. Coordination meeting scheduled if multi-discipline impact
5. Change log updated with approval reference and audit trail

**Documentation:**
All changes recorded in Change Register (CR-LOG-001) per ISO 19650-2 clause 5.7 including: CR number, date, requestor, description, impact assessment, approval decision, implementation date, affected TIDPs.

Monthly change reports presented to client showing: number of changes, categories, schedule impact, lessons learned.`,

      'Infrastructure': `CHANGE CONTROL FRAMEWORK

**Trigger Events:**
• Design development requiring additional information
• Client requirement changes from stakeholder consultation
• Statutory authority feedback (Network Rail, EA, Highways England)
• Ground conditions discoveries requiring design changes
• Third-party coordination issues (utilities, property)

**Change Categories:**

**Category A - Expedited** (non-critical, <2 days):
• Cosmetic model adjustments
• Nomenclature corrections
• Reporting format changes
Approval: Information Manager, 1-day turnaround

**Category B - Standard** (affects deliverables, 2-10 days):
• Design iteration affecting coordination
• Additional analysis requirements
• Software/format changes
Approval: CCB (IM, Lead Designer, Client PM), 5-day decision at weekly meeting

**Category C - Major** (milestone impact, contract variation):
• Scope changes from public inquiry
• Statutory requirements changes
• Major design revisions
Approval: CCB + Client Director + Commercial Manager, 15-day formal review with NEC contract assessment

**Implementation Protocol:**
1. IM updates MIDP with revised milestones
2. Affected TIDPs reissued with change tracking
3. Email notification via CDE to all task teams
4. Coordination workshop if multi-discipline (within 5 days)
5. Change incorporated in next model federation
6. Updated delivery schedules published to client portal

**Audit Trail:**
Change register maintained in CDE with full versioning. Monthly governance reports include change velocity metrics, approval times, and impact on critical path.`,

      'Healthcare': `HEALTHCARE PROJECT CHANGE MANAGEMENT

**Change Initiation:**
Change requests submitted via Aconex workflow using form HBN-CR-001 with mandatory fields:
• Clinical/non-clinical classification
• HBN/HTM compliance impact
• Infection control implications
• Medical equipment coordination effects
• Operational hospital constraints

**Fast-Track for Clinical Safety:**
Changes affecting patient safety, infection control, or HTM compliance processed within 24 hours with Clinical Lead and IM joint approval.

**Standard Process (3-5 days):**
Change Control Board composition:
• Information Manager (chair)
• Clinical Lead (medical planning)
• MEP Coordinator (critical systems)
• Client Estates Director
• Trust Infection Control Advisor (for relevant changes)

Impact assessment includes:
• HBN 04-01 infection control compliance
• Medical gases/critical ventilation impact
• Medical equipment clashes
• Phasing impact on operational hospital
• Clinical workflow effects

**Approval Matrix:**
Minor (cosmetic, no clinical impact): IM approval, 1 day
Standard (design change, technical): CCB, 5 days
Major (clinical space change, HTM): CCB + Trust Medical Director + NHS capital approval if >£50k, 10 days
Emergency (patient safety): Clinical Lead + IM, 24 hours

**Implementation:**
• HBN/HTM compliance re-verified
• Clinical equipment coordination updated
• Infection control advisor sign-off for relevant changes
• Updated room data sheets issued
• Trust Estates team notified
• TIDP/MIDP revised with clinical milestone protection

**Documentation:**
Change log includes clinical impact classification. Monthly reports to Trust include patient safety implications of changes and compliance status.`
    },

    commonMistakes: [
      'No clear change initiation process - informal requests causing confusion',
      'Missing impact assessment requirements - changes approved without understanding effects',
      'Undefined approval authority leading to delays and disputes',
      'No distinction between minor and major changes - everything requires same approval',
      'Failing to update TIDP/MIDP when changes affect schedules',
      'Poor communication - teams unaware of approved changes',
      'No change log or audit trail per ISO 19650 requirements',
      'Not linking BIM changes to contract variations when scope affected',
      'No timeframes for decisions - changes languish indefinitely',
      'Missing Change Control Board meetings leading to bottlenecks'
    ],

    aiPrompt: {
      system: 'You are a BIM project controls expert specializing in change management procedures aligned with ISO 19650-2.',
      instructions: 'Generate a comprehensive change management process description. Include: change initiation procedures, impact assessment criteria, approval authority/matrix (minor/standard/major changes), implementation steps (TIDP/MIDP updates, notifications), documentation requirements (change log per ISO 19650-2 clause 5.7), and communication protocols. Make it specific with timeframes and responsible parties. Structure with clear headings. Maximum 200 words.',
      style: 'systematic, process-oriented, ISO 19650-compliant, clear authority levels, structured'
    },

    relatedFields: ['updateProcesses', 'auditTrails', 'informationManagementResponsibilities', 'mobilizationPlan']
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
};

export default HELP_CONTENT;
