// Project Information Help Content
export const projectInfoHelp = {
  projectName: {
    description: `The official name of the project as it will be referenced throughout all project documentation and correspondence.

Include:
• Clear, descriptive name that identifies the project
• Location if not obvious from the name
• Phase number if part of a larger development
• Avoid abbreviations that stakeholders may not understand

The project name should be consistent across all documentation including contracts, drawings, models, and correspondence.`,

    iso19650: `ISO 19650-2:2018 Section 5.1.2 - Project Information Requirements

The project name is a fundamental identifier that must be consistently used across all information containers and project deliverables. It forms part of the metadata structure that enables information management throughout the project lifecycle.`,

    bestPractices: [
      'Use a clear, descriptive name that stakeholders will immediately recognize',
      'Include location if managing multiple similar projects',
      'Add phase number if part of multi-phase development',
      'Avoid special characters that may cause issues in file systems',
      'Keep it concise but descriptive (typically 3-8 words)',
      'Establish naming convention early and document it',
      'Ensure consistency with contract documents',
      'Consider how the name will appear in file paths and databases'
    ],

    examples: {
      'Commercial': 'Manchester City Centre Office Tower Phase 2',
      'Residential': 'Greenwich Riverside Apartments Block A',
      'Infrastructure': 'M25 Junction 15 Improvement Scheme',
      'Healthcare': 'St Mary\'s Hospital Emergency Department Extension',
      'Education': 'Westfield Academy Sports Complex',
      'Mixed Use': 'Canary Wharf Station Quarter Development'
    },

    commonMistakes: [
      'Using project codes instead of meaningful names',
      'Including dates that will become outdated',
      'Too generic - "Office Building Project"',
      'Inconsistent naming across different documents',
      'Using internal codenames not understood by all stakeholders',
      'Too long or complex names that are difficult to reference'
    ],

    relatedFields: ['projectNumber', 'projectDescription', 'appointingParty']
  },

  projectNumber: {
    description: `A unique identifier or reference code assigned to the project for tracking and administrative purposes.

The project number should:
• Be unique within your organization's project portfolio
• Follow your organization's numbering convention
• Be easily referenced in databases and filing systems
• Remain consistent throughout the project lifecycle
• Be included in all official documentation

This number is used for financial tracking, document control, and project management systems.`,

    iso19650: `ISO 19650-2:2018 Section 5.3.1 - Information Container Identification

The project number forms part of the information container naming convention and is essential for organizing and retrieving project information. It should be incorporated into the file naming structure defined in the BEP.`,

    bestPractices: [
      'Follow your organization\'s established numbering system',
      'Include year if it helps with chronological organization',
      'Use leading zeros for numeric sequences (e.g., 001 instead of 1)',
      'Keep the format consistent across all projects',
      'Document the numbering convention in your BEP',
      'Ensure the number is assigned early and communicated to all parties',
      'Include the project number in all file naming conventions',
      'Register the project number in your PMO or central database'
    ],

    examples: {
      'Year-based': 'PRJ-2024-017',
      'Client-based': 'ABC-COM-024',
      'Location-based': 'LON-RES-15',
      'Sequential': '24-1547',
      'Department-based': 'ARCH-2024-32',
      'Combined': 'GLA-EDU-2024-05'
    },

    commonMistakes: [
      'Not assigning a project number early enough',
      'Using duplicate numbers across projects',
      'Changing the number mid-project',
      'Not communicating the number to all team members',
      'Using overly complex numbering that\'s hard to remember',
      'Not including the number in file naming conventions'
    ],

    relatedFields: ['projectName', 'fileNamingConvention']
  },

  projectType: {
    description: `Classification of the project by its primary use or sector. This helps set appropriate expectations for BIM requirements, standards, and complexity levels.

The project type influences:
• Applicable standards and regulations
• Level of detail requirements
• Typical BIM uses and applications
• Stakeholder expectations
• Delivery complexity
• Information requirements

Select the type that best represents the primary use or highest complexity aspect of the project.`,

    iso19650: `ISO 19650-2:2018 Section 5.1.2 - Appointing Party's Information Requirements

Project classification helps determine appropriate information requirements, level of information need, and delivery standards. Different project types may require specific industry standards (e.g., COBie for facilities management).`,

    bestPractices: [
      'Choose the primary project type if it\'s mixed-use',
      'Consider the dominant use by area or complexity',
      'Reference industry-specific standards for that project type',
      'Align LOIN requirements with typical sector expectations',
      'Consider regulatory requirements specific to the project type',
      'Use consistent classification across all project documentation',
      'Understand client\'s strategic objectives for that asset type',
      'Research benchmark BIM requirements for similar project types'
    ],

    examples: {
      'Commercial Building': 'Office towers, retail centers, hotels, warehouses',
      'Residential': 'Apartments, houses, student accommodation, senior living',
      'Infrastructure': 'Roads, bridges, tunnels, railways, utilities',
      'Healthcare': 'Hospitals, clinics, medical centers, care homes',
      'Education': 'Schools, universities, training centers, libraries',
      'Industrial': 'Factories, manufacturing plants, distribution centers',
      'Mixed Use': 'Combined residential/commercial, transit-oriented development',
      'Renovation/Retrofit': 'Building upgrades, heritage restoration, adaptive reuse'
    },

    commonMistakes: [
      'Selecting multiple types when one primary type should be chosen',
      'Not considering the complexity implications of the type',
      'Ignoring sector-specific BIM requirements',
      'Not aligning LOIN with industry expectations for that type',
      'Missing regulatory or compliance requirements specific to the type'
    ],

    relatedFields: ['projectDescription', 'bimUses', 'applicableStandards']
  },

  appointingParty: {
    description: `The organization or individual appointing the delivery team and receiving the information deliverables. This is typically the client or project owner who has issued the Exchange Information Requirements (EIR).

The appointing party:
• Sets the information requirements (EIR)
• Receives all project deliverables
• Makes key project decisions
• Provides access to project information
• Defines acceptance criteria
• Approves information delivery`,

    iso19650: `ISO 19650-2:2018 Section 3.2.1 - Appointing Party Definition

The appointing party is the receiver of information and is responsible for establishing the exchange information requirements (EIR), appointing the lead appointed party, and accepting information deliverables at project milestones.`,

    bestPractices: [
      'Use the full legal entity name as it appears in contracts',
      'Include department or division if applicable',
      'Confirm the name with contract documentation',
      'Identify the specific entity within larger organizations',
      'Document the appointing party\'s information manager contact',
      'Clarify decision-making authority levels',
      'Reference the EIR issued by this party',
      'Maintain consistency across all project documentation'
    ],

    examples: {
      'Private Developer': 'Greenfield Development Corporation Ltd',
      'Public Authority': 'Greater Manchester Combined Authority',
      'Government Department': 'Department for Education - Infrastructure Division',
      'Corporate Client': 'HSBC Bank PLC - UK Property Services',
      'Healthcare Trust': 'NHS Greater London Trust - Capital Projects',
      'University': 'University of Cambridge - Estates Management'
    },

    commonMistakes: [
      'Using informal names instead of legal entity names',
      'Not matching the name with contract documents',
      'Confusion between appointing party and end client',
      'Not identifying the specific division in large organizations',
      'Missing contact information for their information manager'
    ],

    relatedFields: ['projectName', 'leadAppointedParty', 'informationManager']
  },

  proposedTimeline: {
    description: `For Pre-Appointment BEP: Your proposed project schedule showing key phases, milestones, and anticipated information delivery dates.

The timeline should show:
• Major project phases (Design, Procurement, Construction, Handover)
• Key decision points and approvals
• Information delivery milestones
• BIM coordination events
• Critical path activities
• Review and approval periods`,

    iso19650: `ISO 19650-2:2018 Section 5.1.3 - Delivery Milestones

The timeline must align with information delivery milestones defined in the Master Information Delivery Plan (MIDP). It should demonstrate understanding of when information is needed to support project decisions.`,

    bestPractices: [
      'Use standard industry phase terminology (RIBA Plan of Work, etc.)',
      'Include buffer time for reviews and approvals',
      'Align with the client\'s strategic milestones',
      'Show coordination points between disciplines',
      'Include time for clash detection and resolution cycles',
      'Reference TIDP submission dates',
      'Consider procurement and long-lead items',
      'Build in contingency for complex coordination'
    ],

    examples: {
      'Office Building': 'Phase 1 Design (6 months), Phase 2 Tender (2 months), Phase 3 Construction (18 months), Phase 4 Handover (2 months)',
      'Infrastructure': 'Design Development (12 months), Procurement (4 months), Construction Phase 1 (24 months), Construction Phase 2 (18 months)',
      'Fast-track Project': 'Design-Build Overlap: Design (months 1-8), Early Works (months 4-6), Main Construction (months 6-20)'
    },

    commonMistakes: [
      'Overly optimistic timelines with no contingency',
      'Not aligning with client\'s strategic dates',
      'Missing key coordination milestones',
      'No time allocated for approval cycles',
      'Not considering design freeze dates',
      'Ignoring procurement lead times'
    ],

    relatedFields: ['confirmedTimeline', 'keyMilestones', 'informationDeliveryDates']
  },

  confirmedTimeline: {
    description: `For Post-Appointment BEP: The confirmed, agreed project schedule with actual dates for all phases, milestones, and information delivery requirements.

This timeline includes:
• Agreed start and completion dates
• Confirmed phase boundaries
• Contractual milestones and dates
• Information delivery schedule aligned with MIDP
• Coordination meeting schedule
• Review and approval periods with actual dates`,

    iso19650: `ISO 19650-2:2018 Section 5.4.2 - Delivery Team Mobilization Plan

The confirmed timeline forms part of the mobilization plan and establishes when the delivery team will produce information. It must align with the Master Information Delivery Plan and contract dates.`,

    bestPractices: [
      'Ensure alignment with contract documents',
      'Lock down key milestone dates as fixed',
      'Include actual calendar dates, not just durations',
      'Coordinate with all appointed parties on their submission dates',
      'Build in realistic review periods',
      'Allow float for complex coordination activities',
      'Reference specific TIDP submission dates',
      'Document assumptions and dependencies',
      'Plan for regular updates as project progresses'
    ],

    examples: {
      'Detailed Schedule': 'Stage 3 Complete: 15/03/2025; Stage 4 Complete: 30/06/2025; Construction Start: 15/08/2025; Practical Completion: 30/11/2026',
      'Phased Delivery': 'Phase 1A (Blocks 1-3): Complete Q2 2025; Phase 1B (Block 4-6): Complete Q4 2025; Phase 2: Complete Q3 2026'
    },

    commonMistakes: [
      'Not updating the timeline as the project progresses',
      'Dates that don\'t align with contract milestones',
      'Missing dependencies between tasks',
      'No contingency for delays or changes',
      'Information delivery dates that aren\'t realistic',
      'Not coordinating dates across all appointed parties'
    ],

    relatedFields: ['proposedTimeline', 'keyMilestones', 'midpDates', 'tidpDates']
  },

  estimatedBudget: {
    description: `For Pre-Appointment BEP: The anticipated or target project budget that will influence BIM implementation costs, resource allocation, and value engineering opportunities.

Consider including:
• Total project value or construction cost
• Budget range if exact figure is not available
• Currency and basis (e.g., Q1 2024 prices)
• Whether the budget includes professional fees
• BIM-specific budget allocation if known
• Technology investment budget`,

    iso19650: `ISO 19650-2:2018 Section 5.1.5 - Resource Allocation

Budget information helps demonstrate that appropriate resources will be allocated for information management. The BEP should show how BIM investment delivers value relative to project scale.`,

    bestPractices: [
      'Use ranges if exact figures are commercially sensitive',
      'Specify the currency and price base',
      'Clarify what\'s included (construction only vs. total project cost)',
      'Mention budget for BIM/technology if separately allocated',
      'Reference budget for specific BIM uses (clash detection, 4D, etc.)',
      'Show how BIM will support value engineering within budget',
      'Consider budget for staff training and upskilling',
      'Account for CDE and software licensing costs'
    ],

    examples: {
      'Range Format': '£45-50 million (Construction Cost, Q2 2024 prices, excluding VAT)',
      'Detailed': '£125 million total project value including £95M construction, £18M professional fees, £12M client costs',
      'With BIM Budget': '£67M project value with £350K allocated for BIM coordination and technology'
    },

    commonMistakes: [
      'Being too vague - "large budget"',
      'Not specifying currency or price base',
      'Unclear what\'s included in the figure',
      'No consideration of BIM-specific costs',
      'Not showing how BIM delivers value at this budget level',
      'Budget figures that don\'t align with project scope'
    ],

    relatedFields: ['confirmedBudget', 'projectDescription', 'bimUses', 'valueProposition']
  },

  confirmedBudget: {
    description: `For Post-Appointment BEP: The contractually agreed project budget with confirmed allocation for BIM activities, technology, and resources.

Document:
• Total confirmed project budget
• Budget allocated for information management
• Technology and software costs
• Training and competency development budget
• CDE and collaboration platform costs
• Contingency for BIM coordination activities
• Resource allocation for information management roles`,

    iso19650: `ISO 19650-2:2018 Section 5.4.3 - Mobilization of Resources and Systems

The confirmed budget must demonstrate adequate resource allocation for the information management function, including personnel, technology, and training required to meet the appointing party's requirements.`,

    bestPractices: [
      'Show clear breakdown of BIM-related costs',
      'Demonstrate value-for-money in BIM investment',
      'Include costs for all required software licenses',
      'Budget for information manager time allocation',
      'Include costs for coordination meetings and workshops',
      'Allow contingency for additional coordination needs',
      'Document cost-benefit analysis for major BIM uses',
      'Show how budget supports quality information delivery',
      'Include costs for model validation and checking tools'
    ],

    examples: {
      'Detailed Breakdown': '£82M Total Budget: £75M construction, £5.2M professional fees, £1.2M BIM coordination (software, CDE, training, IM time), £600K contingency',
      'BIM Investment': 'Information management budget: £450K (0.6% of project value) covering software (£120K), CDE (£80K), coordination (£150K), training (£50K), contingency (£50K)'
    },

    commonMistakes: [
      'No specific allocation shown for BIM activities',
      'Underestimating software and license costs',
      'Not budgeting for training and competency development',
      'Missing CDE subscription or hosting costs',
      'No contingency for coordination challenges',
      'Not showing cost-benefit justification for BIM investment'
    ],

    relatedFields: ['estimatedBudget', 'valueProposition', 'softwareTools', 'trainingRequirements']
  },

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

    aiPrompt: {
      system: 'You are a BIM project planning expert. Generate comprehensive project descriptions that establish clear context for BIM execution.',
      instructions: 'Generate content similar to the examples above. Include project type, quantified metrics (area in m², budget, timeline), sustainability targets (BREEAM/LEED), key technical challenges, and site constraints. Use structured paragraphs covering scope, scale, complexity, and stakeholder requirements. Maximum 150 words.',
      style: 'comprehensive, quantified metrics, sustainability-focused, structured paragraphs, specific technical challenges'
    },

    relatedFields: ['projectType', 'estimatedBudget', 'confirmedBudget', 'proposedTimeline', 'confirmedTimeline']
  },

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

    aiPrompt: {
      system: 'You are a BIM delivery strategy consultant. Generate compelling tender proposals that differentiate the team\'s approach and demonstrate value.',
      instructions: 'Generate content similar to the examples above. Include delivery philosophy, phased strategy (RIBA stages), BIM-enabled value engineering, early stakeholder engagement, risk management through clash detection, and quality assurance. Use structured paragraphs with specific methodologies. Maximum 150 words.',
      style: 'strategic, value-focused, differentiated approach, structured methodology, client-benefit emphasis'
    },

    relatedFields: ['bimStrategy', 'deliveryApproach', 'keyCommitments']
  },

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

    aiPrompt: {
      system: 'You are a BIM execution planning expert. Generate confident, execution-focused delivery plans with confirmed processes and timelines.',
      instructions: 'Generate content similar to the examples above. Use confident language ("We will..."). Include phased delivery (RIBA stages), specific coordination schedules (weekly/bi-weekly), CDE implementation timeline, quality gates, clash resolution SLAs, and ISO 19650 compliance. Use structured paragraphs with actionable commitments. Maximum 150 words.',
      style: 'confident tone, execution-focused, specific schedules, quality gates, actionable commitments'
    },

    relatedFields: ['bimStrategy', 'tenderApproach', 'keyCommitments', 'informationManagementResponsibilities']
  }
};
