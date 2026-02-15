// Team and Roles Help Content
export const teamAndRolesHelp = {
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

    aiPrompt: {
      system: 'You are a BIM team capability consultant. Generate compelling team credentials with quantified experience, certifications, and proven track records.',
      instructions: 'Generate content similar to the examples above. Include years of experience, total project value (£M+), team size (coordinators, modellers), certifications (ISO 19650, RICS), software competencies (Revit, Navisworks, Solibri), and 2-3 recent projects with measurable outcomes (% clash reduction, time/cost savings). Use bullet points for capabilities and project examples. Maximum 150 words.',
      style: 'quantified experience, certifications prominent, software expertise, proven outcomes, project examples with metrics'
    },

    relatedFields: ['proposedInfoManager', 'informationManager', 'proposedResourceAllocation', 'proposedMobilizationPlan', 'trackRecordProjects']
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

    aiPrompt: {
      system: 'You are a BIM mobilization planning expert. Generate detailed, phased mobilization plans demonstrating readiness and capability verification.',
      instructions: 'Generate content similar to the examples above. Use 3-week phased structure: Week 1 (onboarding, ISO 19650 training), Week 2 (IT setup, software licensing, BIM 360/CDE configuration), Week 3 (pilot models, capability verification, IFC testing). Include risk mitigation with specific contingencies. Use structured format with clear phases and actionable items. Maximum 150 words.',
      style: 'phased timeline (3 weeks), structured approach, capability verification, risk mitigation, actionable steps'
    },

    relatedFields: ['proposedResourceAllocation', 'teamCapabilities', 'proposedBimGoals']
  },

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
  }
};
