// BIM Goals & Uses Help Content
export const bimGoalsHelp = {
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

    aiPrompt: {
      system: 'You are a BIM goals strategist. Generate SMART BIM goals aligned with client business objectives and measurable project outcomes.',
      instructions: 'Generate content similar to the examples above. Create 3-5 numbered goals covering: design coordination (40% RFI reduction, clash elimination), construction optimization (4D sequencing, 20% schedule compression), cost control (5D integration, ±2% budget variance), sustainability (net-zero carbon, BREEAM/LEED targets), and digital asset delivery (25% operational cost reduction). Each goal should be specific, measurable, and outcome-focused. Maximum 150 words.',
      style: 'numbered goals (3-5), SMART objectives, quantified targets, lifecycle perspective, sustainability integrated'
    },

    relatedFields: ['bimStrategy', 'primaryObjectives', 'bimUses']
  },

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

    aiPrompt: {
      system: 'You are a BIM implementation specialist. Generate specific, actionable primary objectives linked to BIM processes and measurable outcomes.',
      instructions: 'Generate content similar to the examples above. Create 4-5 numbered objectives covering: clash detection protocols (95% clash-free, <24hr resolution), performance modeling (energy analysis, net-zero validation), construction optimization (4D sequencing, quantity extraction), sustainability analysis (embedded carbon, lifecycle assessment), and digital twin delivery (COBie 2.4, asset data). Each objective must be specific, measurable, and tool/process-linked. Maximum 150 words.',
      style: 'numbered objectives (4-5), specific processes, measurable criteria, tool-specific, lifecycle coverage'
    },

    relatedFields: ['bimGoals', 'bimStrategy', 'bimUses']
  },

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

    aiPrompt: {
      system: 'You are a BIM planning expert. Select and describe appropriate BIM uses aligned to project goals and ISO 19650 information requirements.',
      instructions: 'Generate content similar to the examples above. List 6–10 BIM uses using a clear tick format (✓). For each use, include a short description of how it will be applied and the value/outcome (and name typical tools where relevant). Ensure the selection aligns with the stated BIM goals and lifecycle needs (design, construction, operations). Maximum 170 words.',
      style: 'tick-list format, use/value focused, realistic selection, ISO 19650 terminology'
    },

    relatedFields: ['bimGoals', 'primaryObjectives', 'bimStrategy']
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

    aiPrompt: {
      system: 'You are a BIM information management lead. Define collaborative production goals aligned to ISO 19650 workflows and controls.',
      instructions: 'Define concise collaborative production goals for the delivery team. Include unified standards/metadata, federation and coordination cadence, milestone delivery consistency, version control and change management, QA/validation, audit trails/accountability, and ISO 19650 compliance targets. Use bullet points or short paragraphs and keep it actionable. Maximum 140 words.',
      style: 'actionable goals, standardisation and control focus, ISO 19650 terminology, concise'
    },

    relatedFields: ['bimGoals', 'informationManagementResponsibilities', 'alignmentStrategy']
  }
,

  // === Migrated from legacy helpContentData.js ===
  alignmentStrategy: {
      "description": "Define your comprehensive approach to facilitating information management goals and maintaining alignment throughout the project. This structured strategy covers 7 key aspects required by ISO 19650-2.\n\nThe Information Management Strategy Builder provides an interactive interface to document:\n1. **Coordination Meeting Schedule** - Regular meetings for information management oversight\n2. **RACI Responsibility Matrices** - Clear accountability for information production and approval\n3. **Naming and Folder Structure Standards** - Standardized conventions ensuring consistency\n4. **Quality Checking Tools** - Automated validation processes for compliance\n5. **Training and Competency Requirements** - Ensuring team capability\n6. **Performance Monitoring and KPIs** - Measurable indicators of effectiveness\n7. **Ongoing Alignment Maintenance** - Strategy for continuous improvement\n\nEach section can be completed independently and includes structured fields appropriate to the content type (tables for schedules/tools, text for strategies/standards).",
      "iso19650": "**ISO 19650-2:2018 Key Clauses:**\n\n**Section 5.2 - Mobilization and Collaboration**\nRequires establishing information management processes, responsibilities, and communication protocols. The alignment strategy demonstrates how these will be implemented and maintained.\n\n**Section 5.4.1 - Collaborative Production of Information**\nMandates coordination procedures, quality assurance processes, and competency requirements. Your strategy must show how information will be produced, checked, and approved consistently.\n\n**Section 5.6 - Information Delivery Milestones**\nRequires performance monitoring against agreed milestones. KPIs demonstrate measurable compliance with information requirements.\n\n**Section 5.3.4 - Mobilization**\nAddresses team competency verification, training requirements, and capacity assessment. Training plans ensure compliance.\n\nThe strategy must demonstrate continuous alignment between appointing party requirements (EIR) and delivery team processes throughout the project lifecycle.",
      "bestPractices": [
          "**Coordination Meetings:** Schedule regular meetings at appropriate frequencies (weekly BIM coordination, bi-weekly design reviews, monthly IM reviews). Define clear participants and agenda items.",
          "**RACI Matrices:** Reference detailed responsibility matrices (typically in Section 3.3). Highlight key decision points: model approvals, information delivery, change management, CDE access.",
          "**Naming Standards:** Follow ISO 19650-2 file naming convention structure. Document folder hierarchies (WIP/Shared/Published/Archive). Provide specific examples for your project.",
          "**Quality Tools:** List specific software tools (Navisworks for clash detection, Solibri for IFC validation). Define check frequencies, responsible roles, and failure actions.",
          "**Training Plan:** Identify training needs by role. Include ISO 19650 awareness, project-specific workflows, tool competency. Define verification methods (certificates, practical tests).",
          "**KPIs:** Set measurable targets for key areas: model coordination quality, delivery timeliness, data quality, RFI reduction. Assign owners and monitoring frequency.",
          "**Ongoing Alignment:** Establish review cycles (monthly stakeholder reviews, quarterly BEP reviews). Implement change management for scope variations. Maintain open communication channels with appointing party."
      ],
      "examples": [
          {
              "title": "Comprehensive IM Strategy (Large Commercial Project)",
              "content": "**Meeting Schedule:** Weekly BIM coordination (90 min), bi-weekly design workshops (2 hours), monthly IM reviews (60 min), monthly client progress reviews (90 min). All with defined participants and standard agendas.\n\n**RACI Reference:** Section 3.3 defines full matrices. Key decisions: Model federation approval (Accountable: Lead BIM Coordinator), Design sign-off (Accountable: Design Manager), Information delivery (Accountable: Information Manager).\n\n**Naming Convention:** [Project Code]-[Originator]-[Volume]-[Level]-[Type]-[Role]-[Number]-[Revision]\nExample: PRJ01-ARC-XX-01-M3-ARC-0001-P01.rvt\nFolder structure: 00_WIP / 01_SHARED / 02_PUBLISHED / 03_ARCHIVE\n\n**Quality Tools:** \n- Navisworks: Weekly clash detection, BIM Coordinator, 48hr resolution\n- Solibri: Milestone IFC validation, Information Manager, model rejection on failure\n- Custom scripts: Daily naming checks, CDE Admin, automated rejection\n\n**Training:** \n- All team: ISO 19650 workshop (Week 1), 80% pass quiz\n- BIM Authors: Naming conventions training (Week 1-2), practical test\n- Coordinators: Navisworks certification (pre-project/refresher)\n\n**KPIs:** \n- Clash density <5/1000 elements (weekly)\n- 95% on-time delivery (per milestone)\n- 90% first-time validation pass (per data drop)\n- 40% RFI reduction vs baseline (monthly cumulative)\n\n**Alignment Maintenance:** Monthly client workshops validating EIR alignment. Continuous KPI monitoring with >10% deviation triggering corrective actions. Quarterly BEP reviews with stakeholders. Change management integration for scope variations."
          },
          {
              "title": "Essential IM Strategy (Medium Residential Project)",
              "content": "**Meetings:** Bi-weekly coordination (60 min): BIM Manager + Coordinators. Monthly design review (90 min): All leads + client.\n\n**RACI:** See Section 3.3. Key accountability: Model approval - BIM Manager; Design sign-off - Project Architect; Information delivery - Information Manager.\n\n**Naming:** Standard ISO 19650 format: RES24-[Disc]-[Zone]-[Level]-[Type]-[Role]-[Num]-[Rev]\nFolders: WIP / Shared / Published / Archive\n\n**Quality Tools:** Navisworks clash detection (bi-weekly), Revit health checks (before milestones).\n\n**Training:** Team ISO 19650 overview (Project start), tool-specific as needed.\n\n**KPIs:** <10 critical clashes per coordination session, 90% milestone delivery on-time.\n\n**Alignment:** Monthly client review of deliverables against EIR checklist. Quarterly BEP effectiveness review."
          },
          {
              "title": "Lean IM Strategy (Small Extension Project)",
              "content": "**Meetings:** Weekly 30-minute virtual coordination check-ins. Monthly client review meeting.\n\n**RACI:** Project Lead accountable for all information delivery. Discipline leads responsible for their models.\n\n**Naming:** Project standard format with simplified zones. Cloud folder structure: Draft / Review / Approved.\n\n**Quality Tools:** Basic Revit warnings check before sharing. Simple coordination review in viewer.\n\n**Training:** Brief project BIM requirements session at kickoff. Reference materials on shared drive.\n\n**KPIs:** All models clash-free before client review. Deliverables submitted on agreed dates.\n\n**Alignment:** Direct client communication. Informal monthly check that deliverables meet expectations."
          }
      ],
      "commonMistakes": [
          "❌ **Generic statements without specifics:** \"We will have regular meetings and use quality tools\" - Define exactly what, when, who, how often.",
          "❌ **Missing measurement criteria:** Strategy describes processes but no KPIs to measure effectiveness. Must include measurable targets.",
          "❌ **No responsibility assignment:** Processes defined but unclear who owns each activity. Must reference RACI or assign explicit accountability.",
          "❌ **Ignoring training needs:** Assumes team knows all processes and tools. Must address competency verification and training plans.",
          "❌ **Static approach:** No provision for reviews, updates, or continuous improvement. Must show how alignment will be maintained throughout lifecycle.",
          "❌ **Disconnected from project specifics:** Generic IM strategy not tailored to project type, size, complexity. Must align with actual project needs.",
          "❌ **No integration with appointing party requirements:** Strategy doesn't demonstrate how it delivers against specific EIR requirements."
      ],
      "aiPrompt": {
          "system": "You are an ISO 19650 information management strategist. Generate practical alignment strategies that remain consistent with the EIR throughout delivery.",
          "instructions": "Generate content similar to the examples above. Cover the 7 aspects: meeting schedule, RACI reference, naming/folder standards (include one naming example), quality tools and check cadence, training/competency verification, KPIs with measurable targets, and ongoing alignment maintenance (review cycle and change management). Use short headings and concise paragraphs/bullets. Maximum 180 words.",
          "style": "structured headings, measurable KPIs, specific tools/cadence, ISO 19650-2 aligned"
      },
      "relatedFields": [
          "coordinationMeetings",
          "informationManagementResponsibilities",
          "qaFramework",
          "responsibilityMatrix",
          "trainingPlan"
      ]
  },
};
