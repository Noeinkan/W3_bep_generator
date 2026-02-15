// Information Production Methods and Procedures Help Content
export const informationProductionHelp = {
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
  }

,

  // === Migrated from legacy helpContentData.js ===
  documentControlInfo: {
      "description": "Define document control procedures ensuring consistent identification, versioning, approval, and distribution of all project information and documentation.\n\nCover:\n• Document numbering and naming conventions\n• Revision control procedures\n• Approval and authorization workflows\n• Status codes and suitability definitions\n• Distribution and access control\n• Document register maintenance\n• Compliance with ISO 19650 naming standards",
      "iso19650": "ISO 19650-2:2018 Section 5.1.6 - Establishment of Information Standard\n\nDocument control procedures must ensure that information containers (files, documents, models) are uniquely identifiable, versioned appropriately, and managed in accordance with the project's information standard.",
      "bestPractices": [
          "Use ISO 19650-2 naming convention: Project-Originator-Volume-Level-Type-Role-Number",
          "Define suitability codes (S0-S7 per ISO 19650)",
          "Implement revision codes (P01-P99 for draft, C01-C99 for issued)",
          "Maintain central document register in CDE",
          "Define approval matrix (Author-Checker-Approver)",
          "Automate document numbering where possible",
          "Use metadata for searchability and filtering",
          "Implement audit trails for all document changes"
      ],
      "examples": {
          "Commercial Building": "Document control framework:\n\n**Naming Convention:**\nFormat: [Project]-[Originator]-[Volume]-[Level]-[Type]-[Role]-[Number]\n\nExample: GF-SAA-A-L03-M3-ARC-0001\n• GF = Greenfield Project\n• SAA = Smith & Associates Architects\n• A = Building A\n• L03 = Level 03\n• M3 = Model (3D)\n• ARC = Architecture\n• 0001 = Sequential number\n\n**Suitability Codes (ISO 19650-2):**\n• S0 = Initial status, work in progress\n• S1 = Suitable for Coordination\n• S2 = Suitable for Information\n• S3 = Suitable for Review & Comment\n• S4 = Suitable for Stage Approval\n• S6 = Suitable for PIM Authorization (As-built)\n\n**Revision Control:**\n• P01-P99 = Work in Progress revisions\n• C01-C99 = Client issued revisions\n• Version stored with timestamp in CDE\n• Previous revisions archived but accessible\n\n**Approval Workflow:**\n1. Author creates document (S0 status)\n2. Discipline Checker reviews (48-hour SLA)\n3. Discipline Lead approves and assigns suitability code\n4. Document published to CDE Shared folder\n5. Client review and approval for milestone submissions (S4)\n6. Final authorization for handover (S6)",
          "Infrastructure": "Document control for infrastructure delivery:\n\n**File Naming:**\nFormat: [Project]-[Type]-[Discipline]-[Zone]-[Doc Type]-[Number]-[Revision]\n\nExample: A45JI-DWG-HW-CH2K-GA-0042-C03\n• A45JI = A45 Junction Improvement\n• DWG = Drawing\n• HW = Highway\n• CH2K = Chainage 2+000\n• GA = General Arrangement\n• 0042 = Drawing number\n• C03 = Client revision 03\n\n**Document Types:**\n• DWG = Drawings\n• MOD = 3D Model\n• RPT = Reports\n• SPEC = Specifications\n• CALC = Calculations\n• SCHED = Schedules\n\n**Status Codes:**\n• WIP = Work in Progress (internal only)\n• IFC = Issued for Comment\n• IFA = Issued for Approval\n• IFI = Issued for Information\n• IFC = Issued for Construction\n• ABC = As-Built Construction\n\n**Document Register:**\nMaintained in CDE with searchable fields:\n- Document number\n- Title/description\n- Originator/author\n- Date created/modified\n- Current revision and status\n- Next planned update\n- Related documents/models"
      },
      "commonMistakes": [
          "Inconsistent naming conventions across disciplines",
          "No clear revision control procedures",
          "Missing suitability codes or status definitions",
          "No central document register maintained",
          "Approval workflows not defined or enforced",
          "Version control managed manually instead of through CDE",
          "No audit trail of document changes and approvals",
          "Non-compliant with ISO 19650 naming standards"
      ],
      "aiPrompt": {
          "system": "You are a document control and information management specialist focusing on ISO 19650-compliant procedures and standards.",
          "instructions": "Generate document control procedures ensuring consistent identification, versioning, approval, and distribution of all project information. Include: ISO 19650-2 naming convention (Project-Originator-Volume-Level-Type-Role-Number with example), suitability codes (S0-S7) with definitions, revision control procedures (P01-P99 for drafts, C01-C99 for issued), approval and authorization workflows (Author-Checker-Approver matrix), status codes for workflow states (WIP, Shared, Published, Archived), central document register maintenance in CDE, distribution and access control procedures, automated document numbering where possible, metadata standards, and audit trail requirements. Use structured paragraphs organized by topic. Maximum 190 words.",
          "style": "professional, ISO 19650 tone, structured by topic, concise"
      },
      "relatedFields": [
          "namingConventions",
          "cdeStrategy",
          "workflowStates",
          "approvalWorkflows"
      ]
  },

  namingConventions_overview: {
      "description": "Provide a high-level overview of your project's naming convention philosophy and approach. This section establishes the strategic foundation for how information will be named and organized throughout the project lifecycle.\n\nKey aspects to address:\n• Overall naming philosophy aligned with ISO 19650-2\n• Consistency objectives across all project deliverables\n• How naming supports information retrieval and management\n• Integration with project information management goals\n• Stakeholder communication about naming standards",
      "iso19650": "ISO 19650-2:2018 Section 5.1.6 - Information Standard\n\nThe overview should demonstrate how your naming approach supports the project information standard and facilitates effective information management across the entire delivery team.",
      "bestPractices": [
          "Reference ISO 19650-2 naming principles as foundation",
          "Explain how naming supports project-specific objectives",
          "Acknowledge client EIR requirements for naming standards",
          "Describe how consistency will be maintained across disciplines",
          "Outline governance approach for naming convention adherence",
          "Reference any industry-specific naming standards being adopted",
          "Explain how naming facilitates automation and data exchange"
      ],
      "examples": {
          "Commercial Building": "Example Overview:\n\n\"File naming follows ISO 19650-2 convention to ensure consistency, traceability, and efficient information management across all project deliverables. Our approach implements a structured naming format that enables:\n\n• Immediate identification of file origin, purpose, and status\n• Automated file sorting and filtering in the CDE\n• Clear version control and audit trails\n• Seamless integration with project classification systems\n• Support for downstream asset management systems\n\nAll team members receive naming convention training during project mobilization, and automated validation checks in the CDE ensure compliance before file publication.\"",
          "Infrastructure": "Example Overview:\n\n\"This project adopts ISO 19650-2 naming conventions adapted for linear infrastructure delivery. The naming strategy supports:\n\n• Geographic reference through chainage/station identifiers\n• Multi-disciplinary coordination across highway, structures, and drainage\n• Integration with GIS and asset management systems\n• Compatibility with construction sequencing and handover requirements\n\nNaming standards are enforced through CDE configuration, project templates, and regular compliance audits throughout delivery phases.\""
      },
      "commonMistakes": [
          "Generic overview without project-specific context",
          "No reference to ISO 19650-2 or client requirements",
          "Failing to explain how naming supports project objectives",
          "Not addressing governance and compliance mechanisms",
          "Missing explanation of stakeholder training approach"
      ],
      "aiPrompt": {
          "system": "You are an ISO 19650 naming conventions advisor.",
          "instructions": "You are helping define the strategic overview of file naming conventions for a BIM project. Guide users to articulate their naming philosophy aligned with ISO 19650-2, explaining how the naming approach supports consistency, traceability, information retrieval, automated sorting, version control, and integration with classification and asset management systems. Help them describe governance mechanisms (training, CDE validation, compliance audits) and how naming standards are communicated and enforced across all team members. Encourage project-specific context that addresses client EIR requirements and explains how naming facilitates project objectives including coordination, data exchange, and lifecycle information management.",
          "style": "strategy-first, governance-aware, ISO 19650 tone, concise"
      },
      "relatedFields": [
          "namingConventions_fields",
          "namingConventions_pattern",
          "namingConventions_attributes",
          "fileStructure",
          "cdeStrategy"
      ]
  },

  namingConventions_fields: {
      "description": "Define each component (field) of your file naming pattern in detail. Each field serves a specific purpose in creating unique, meaningful, and structured file names that support information management.\n\nCommon naming fields include:\n• Project Code - Unique project identifier\n• Originator - Organization/discipline creating information\n• Volume/System - Spatial or functional subdivision\n• Level/Location - Floor level or geographic reference\n• Type - Information container type (model, drawing, document)\n• Role - Discipline responsible for content\n• Number - Sequential identifier\n• Revision - Version and status indicator",
      "iso19650": "ISO 19650-2:2018 Section 5.1.6 - Information Standard\n\nField definitions should align with ISO 19650 naming structure: [Project]-[Originator]-[Volume]-[Level]-[Type]-[Role]-[Number]-[Revision]\n\nEach field must have clear definitions, allowed values, and examples to ensure consistent application across the delivery team.",
      "bestPractices": [
          "Define 6-8 core naming fields for structured identification",
          "Provide clear examples for each field with multiple scenarios",
          "Specify allowed characters and format (uppercase, length limits)",
          "Include abbreviation glossary for originators and roles",
          "Define \"not applicable\" convention (e.g., XX, ZZ, 00)",
          "Align volume/system codes with project breakdown structure",
          "Establish revision code scheme (P=Prelim, C=Construction, A=As-built)",
          "Document exceptions and special cases"
      ],
      "examples": {
          "Commercial Building": "Example Field Definitions:\n\n**[Project Code]**: GF24\n- Format: 4 characters, alphanumeric\n- Description: Unique identifier for Greenfield 2024 project\n- Example: GF24\n\n**[Originator]**: SAA | EXL | ASG\n- Format: 3 characters, uppercase\n- Description: Organization code\n- Examples: SAA (Smith Architects), EXL (Engineering Excellence), ASG (Advanced Systems Group)\n\n**[Volume/System]**: XX | A | B | C1 | C2\n- Format: 1-2 characters\n- Description: Building zone or system\n- Examples: XX (whole building), A (Tower A), B (Tower B), C1 (Core 1)\n\n**[Level]**: GF | 01-08 | RF | B1\n- Format: 2 characters\n- Description: Floor level\n- Examples: GF (Ground), 01-08 (Floors), RF (Roof), B1 (Basement)\n\n**[Type]**: M3 | DR | SP | SC | RP\n- Format: 2 characters\n- Description: Information container type\n- Examples: M3 (Model), DR (Drawing), SP (Specification), SC (Schedule), RP (Report)\n\n**[Role]**: ARC | STR | MEP | FAC\n- Format: 3 characters\n- Description: Discipline\n- Examples: ARC (Architecture), STR (Structural), MEP (MEP Services), FAC (Facades)\n\n**[Number]**: 0001-9999\n- Format: 4 digits with leading zeros\n- Description: Sequential file number\n- Examples: 0001, 0002, 0125\n\n**[Revision]**: P01 | C01 | A01\n- Format: 1 letter + 2 digits\n- Description: Status and version\n- Examples: P01-P99 (Design), C01-C99 (Construction), A01-A99 (As-built)"
      },
      "commonMistakes": [
          "Insufficient field descriptions causing inconsistent interpretation",
          "No examples provided for field usage",
          "Missing abbreviation glossary for codes",
          "Overly complex fields with too many options",
          "No clear guidance on when to use \"not applicable\" codes",
          "Failing to align fields with project organizational structure"
      ],
      "aiPrompt": {
          "system": "You are an ISO 19650 file naming field specialist.",
          "instructions": "You are helping users define individual naming fields for ISO 19650-2 file naming conventions. Guide them to define 6-8 core fields: Project Code, Originator, Volume/System, Level/Location, Type, Role, Number, and Revision. For each field, help them specify format (character length, uppercase/lowercase, alphanumeric), provide clear descriptions, include multiple examples covering different scenarios, establish abbreviation glossaries, define \"not applicable\" conventions (XX, ZZ, 00), and align codes with project breakdown structure and organizational roles. Ensure field definitions support automated validation, enable unique file identification, and facilitate filtering and sorting in the CDE. Provide lookup tables and quick reference guides for team members.",
          "style": "field-by-field structure, examples included, ISO 19650 tone, concise"
      },
      "relatedFields": [
          "namingConventions_overview",
          "namingConventions_pattern",
          "volumeStrategy",
          "organizationalStructure"
      ]
  },

  namingConventions_pattern: {
      "description": "Define the complete naming pattern showing how individual fields combine to create file names. This section provides the master template and real-world examples demonstrating correct naming application.\n\nThe pattern should:\n• Show field order and separator characters\n• Provide multiple complete examples across disciplines\n• Demonstrate pattern application to different file types\n• Include edge cases and special scenarios\n• Show how extensions are handled",
      "iso19650": "ISO 19650-2:2018 Section 5.1.6 - Information Standard\n\nThe complete naming pattern should follow the ISO 19650 structure with consistent separators (typically hyphens) between fields. Pattern must be documented, communicated, and enforced across all project deliverables.",
      "bestPractices": [
          "Use hyphens (-) as standard field separators for clarity",
          "Show pattern with field labels and example with actual values",
          "Provide 5-10 examples covering different scenarios",
          "Include examples for models, drawings, documents, schedules",
          "Demonstrate revision progression (P01 → P02 → C01)",
          "Show multi-discipline examples",
          "Include edge cases (whole building files, site-wide documents)",
          "Add file extension guidance (.rvt, .dwg, .pdf, .ifc)"
      ],
      "examples": {
          "Commercial Building": "Complete Naming Pattern:\n\n**Pattern Format:**\n[Project]-[Originator]-[Volume]-[Level]-[Type]-[Role]-[Number]-[Revision].[extension]\n\n**Examples:**\n\nArchitecture Model:\n• GF24-SAA-XX-GF-M3-ARC-0001-P01.rvt\n• GF24-SAA-A-03-M3-ARC-0002-C01.rvt\n\nStructural Model:\n• GF24-EXL-XX-00-M3-STR-0001-P01.rvt\n• GF24-EXL-B-B1-M3-STR-0002-P03.rvt\n\nMEP Model:\n• GF24-ASG-XX-GF-M3-MEP-0001-P01.rvt\n• GF24-ASG-C1-05-M3-MEP-0005-C01.rvt\n\nDrawings:\n• GF24-SAA-XX-GF-DR-ARC-1001-P01.pdf\n• GF24-EXL-XX-RF-DR-STR-2050-C01.pdf\n\nSpecifications:\n• GF24-SAA-XX-XX-SP-ARC-0001-P01.pdf\n• GF24-ASG-XX-XX-SP-MEP-0001-C01.pdf\n\nSchedules:\n• GF24-SAA-XX-XX-SC-ARC-0001-P02.xlsx\n• GF24-EXL-XX-XX-SC-STR-0001-P01.xlsx\n\nReports:\n• GF24-PMT-XX-XX-RP-PM-0001-P01.pdf (Project Management Report)\n• GF24-ASG-XX-XX-RP-MEP-0010-P01.pdf (Energy Analysis Report)"
      },
      "commonMistakes": [
          "No visual representation of pattern structure",
          "Insufficient examples covering different scenarios",
          "Inconsistent separator usage (mixing hyphens and underscores)",
          "Missing file extension guidance",
          "Not showing revision progression examples",
          "Failing to demonstrate \"not applicable\" field usage"
      ],
      "aiPrompt": {
          "system": "You are an ISO 19650 naming pattern specialist.",
          "instructions": "You are helping users define complete file naming patterns following ISO 19650-2 structure. Guide them to create the master template showing field order and separators (typically hyphens): [Project]-[Originator]-[Volume]-[Level]-[Type]-[Role]-[Number]-[Revision].[extension]. Help them provide 5-10 comprehensive examples covering models (.rvt, .ifc), drawings (.pdf, .dwg), documents (.docx, .pdf), and schedules (.xlsx) across multiple disciplines (architecture, structural, MEP). Show revision progression (P01 → P02 → C01), demonstrate \"not applicable\" field usage (XX for whole building), and include file extension guidance. Ensure examples illustrate edge cases and real-world scenarios for architecture, structure, MEP, and project management deliverables.",
          "style": "template + examples, ISO 19650 tone, practical and clear"
      },
      "relatedFields": [
          "namingConventions_overview",
          "namingConventions_fields",
          "fileFormats",
          "deliverableTemplates"
      ]
  },

  namingConventions_attributes: {
      "description": "Define the metadata attributes and properties that accompany deliverables beyond the file name. These attributes provide additional context, classification, and management information essential for the asset lifecycle.\n\nKey deliverable attributes include:\n• File format and software version requirements\n• Classification system codes (Uniclass, Omniclass)\n• Level of Information Need (LOIN) specifications\n• Security classification levels\n• Suitability codes (ISO 19650 status indicators)\n• Revision codes and version history\n• Authorship and approval metadata",
      "iso19650": "ISO 19650-2:2018 Section 5.1.4 - Information Delivery Planning\n\nDeliverable attributes support the project information standard and enable effective filtering, searching, and management within the CDE. Attributes should be captured as metadata to support lifecycle information management and asset handover.",
      "bestPractices": [
          "Define mandatory vs. optional attributes for each deliverable type",
          "Specify controlled vocabularies for attribute values",
          "Align attributes with client asset management requirements",
          "Include suitability codes per ISO 19650 (S0-S8)",
          "Define revision code conventions and progression rules",
          "Specify file format standards and version requirements",
          "Link attributes to classification systems (Uniclass 2015)",
          "Define security classification scheme",
          "Document where attributes are stored (filename, metadata, CDE properties)"
      ],
      "examples": {
          "Commercial Building": "Example Deliverable Attributes:\n\n**File Format:**\n- Models: .rvt (Revit 2024), .ifc (IFC 4.0)\n- Drawings: .pdf (PDF/A-1b for archive)\n- Documents: .docx (Office 2019+), .pdf\n- Schedules: .xlsx (Office 2019+)\n\n**Classification System:**\n- Standard: Uniclass 2015\n- Format: Table_Code_Description\n- Example: Ss_25_30_20 (Curtain wall systems)\n\n**Level of Information Need:**\n- Design Stage 3: LOD 300 (Defined geometry)\n- Design Stage 4: LOD 350 (Coordinated geometry)\n- Construction: LOD 400 (Fabrication detail)\n- As-built: LOD 500 (Verified record)\n\n**Security Classification:**\n- Public: General project information\n- Internal: Working documents within delivery team\n- Confidential: Commercial or sensitive information\n- Strictly Confidential: Board-level or contractual\n\n**Suitability Code (ISO 19650):**\n- S0: Work in Progress (WIP)\n- S1: Suitable for Coordination\n- S2: Suitable for Information\n- S3: Suitable for Review and Comment\n- S4: Suitable for Stage Approval\n- A1-A7: Client authorized (various levels)\n\n**Revision Code:**\n- P01-P99: Design development (Prelim/Proposal)\n- C01-C99: Construction issue\n- A01-A99: As-built/As-constructed\n- Format: Letter indicates phase, number indicates iteration\n\n**Metadata Properties:**\n- Author: Full name of creator\n- Checked: Name of quality checker\n- Approved: Name of authorizing person\n- Issue Date: YYYY-MM-DD format\n- Project Phase: RIBA Stage (e.g., \"Stage 4\")\n- Discipline: Architecture/Structure/MEP/etc.\n- Keywords: Search tags for CDE filtering"
      },
      "commonMistakes": [
          "Attributes not documented or inconsistently applied",
          "No controlled vocabularies leading to data quality issues",
          "Suitability codes not aligned with ISO 19650",
          "Security classification not defined or enforced",
          "Revision codes conflicting with file version numbers",
          "Attributes stored inconsistently (sometimes filename, sometimes metadata)",
          "No link between classification codes and naming conventions",
          "Missing guidance on attribute population and validation"
      ],
      "aiPrompt": {
          "system": "You are an ISO 19650 deliverables metadata specialist.",
          "instructions": "You are helping define deliverable attributes and metadata for a BIM project. Guide users to specify mandatory vs. optional attributes for each deliverable type including file formats (.rvt, .ifc, .pdf), classification codes (Uniclass 2015), Level of Information Need (LOD 200-500), security classifications (Public/Internal/Confidential), suitability codes (ISO 19650 S0-S8: S0=WIP, S1=Coordination, S2=Information, S3=Review, S4=Approval), revision codes (P=Prelim, C=Construction, A=As-built), and authorship metadata (Author, Checker, Approver). Help establish controlled vocabularies, define where attributes are stored (filename vs. metadata vs. CDE properties), align with client asset management requirements, and document validation procedures. Ensure attributes support lifecycle information management and COBie handover.",
          "style": "metadata-first, controlled vocabularies, ISO 19650 tone, concise"
      },
      "relatedFields": [
          "namingConventions_overview",
          "namingConventions_pattern",
          "classificationSystems",
          "informationFormats",
          "dataClassification"
      ]
  },
};
