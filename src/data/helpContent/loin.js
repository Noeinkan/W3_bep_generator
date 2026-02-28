// Level of Information Need (LOIN) Help Content
export const loinHelp = {
  informationPurposes: {
    description: `Select the purposes for which information will be used throughout the project lifecycle. This defines what the information needs to support.`,

    iso19650: `ISO 19650-1:2018 - Information purposes define why information is needed and guide the level of information need (LOIN) specification.`,

    bestPractices: [
      'Select purposes that align with project objectives and client requirements',
      'Include both design/construction and operational purposes',
      'Cover all major disciplines and use cases',
      'Ensure consistency with EIR and PIR'
    ],

    aiPrompt: {
      system: 'You are an ISO 19650 information requirements specialist. Define clear information purposes that drive the Level of Information Need (LOIN).',
      instructions: 'List the key purposes for project information across the lifecycle (design development, coordination, construction planning, procurement, handover/operations). Use a short bullet list and align to the EIR/PIR and BIM uses. Keep it concise and project-focused. Maximum 120 words.',
      style: 'bullet list, lifecycle coverage, purpose-led, ISO 19650 language'
    },

    relatedFields: ['levelOfInformationMatrix', 'geometricalInfo', 'alphanumericalInfo', 'projectInformationRequirements']
  },

  levelOfInformationMatrix: {
    description: `The Level of Information Need Matrix (Model Element Table) defines LOD, LoI, format, and responsibility per element category and project stage. Use it to specify what is required for each discipline and stage; the narrative fields below explain the rationale and exceptions.`,

    iso19650: `ISO 19650-1 and NBIMS-US BEP §5.07 - A Model Element Table documents Level of Development (LOD), Level of Information (LoI), Level of Accuracy (LoA), information format, and author per element category.`,

    bestPractices: [
      'Add one row per element category or discipline and stage',
      'Use consistent LOD/LOI codes (e.g. LOD 300, 350, 400)',
      'Specify Information Format (2D/3D/data or file type)',
      'Assign Author/Responsible party per row',
      'Keep the narrative fields (Geometrical, Alphanumerical, Documentation) aligned with this table'
    ],

    relatedFields: ['informationPurposes', 'geometricalInfo', 'alphanumericalInfo', 'informationFormats']
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
      'Align with project complexity and information uses',
      'Detail per element/stage can be recorded in the Level of Information Need Matrix table above'
    ],

    aiPrompt: {
      system: 'You are a BIM geometric information specialist. Specify geometrical requirements aligned to ISO 19650 Level of Information Need.',
      instructions: 'Define geometrical information requirements by stage and discipline. Include LOD/LOIN progression, key tolerances/accuracy (with example values), coordination requirements (e.g., critical interfaces), and survey/as-built verification expectations. Keep it practical and measurable. Maximum 140 words.',
      style: 'requirements-focused, stage-based, quantifiable tolerances, ISO 19650/LOIN terminology'
    },

    relatedFields: ['levelOfInformationMatrix', 'alphanumericalInfo', 'informationPurposes', 'volumeStrategy']
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

    aiPrompt: {
      system: 'You are a BIM data requirements specialist. Specify alphanumerical information needs for models and asset data delivery.',
      instructions: 'Define required properties/attributes aligned to information purposes and PIR. Cover identification/classification, specifications/performance, manufacturer/product data, quantities/cost (where applicable), COBie/FM asset data, maintenance/warranty fields, and any required property sets/parameter naming conventions. Keep it structured and concise. Maximum 150 words.',
      style: 'structured categories, asset-data oriented, consistent naming, ISO 19650/COBie-aware'
    },

    relatedFields: ['levelOfInformationMatrix', 'geometricalInfo', 'documentationInfo', 'projectInformationRequirements']
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

    aiPrompt: {
      system: 'You are a BIM documentation deliverables specialist. Define required supporting documentation alongside models.',
      instructions: 'List the required documentation deliverables (specifications, schedules, certificates, commissioning reports, O&M manuals, H&S file, warranties, training materials). Indicate expected formats (PDF/native) and note that documentation should be linked to model elements/asset data where applicable. Keep it concise. Maximum 120 words.',
      style: 'deliverable list, format-aware, compliance-focused, concise'
    },

    relatedFields: ['levelOfInformationMatrix', 'alphanumericalInfo', 'projectInformationRequirements']
  },

  informationFormats: {
    description: `Select the default information formats (file types and exchange formats) required for LOIN deliverables. These apply across the Level of Information Need unless overridden per row in the LOIN Matrix table (e.g. 2D/3D/data per element).`,

    iso19650: `ISO 19650-2 - Information formats (e.g. IFC, native, PDF) are specified in the EIR and confirmed in the BEP; they support interoperability and suitability for each information exchange.`,

    bestPractices: [
      'Select formats that match client and CDE requirements',
      'Use IFC for coordination and handover where required',
      'Specify PDF/PDF-A for documentation deliverables',
      'Include BCF for issue exchange if using clash coordination',
      'Detail format per element/stage in the LOIN Matrix if needed'
    ],

    relatedFields: ['levelOfInformationMatrix', 'geometricalInfo', 'documentationInfo']
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

    aiPrompt: {
      system: 'You are an ISO 19650 PIR specialist. Define operational information requirements that support asset management and the whole-life value of the asset.',
      instructions: 'Describe the PIR for operations: asset management system integration, space/occupancy data, energy monitoring, maintenance planning, digital twin/IoT connectivity, performance analytics, and compliance reporting. Specify expected structured data deliverables (e.g., COBie/asset properties) and how requirements extend beyond project delivery. Maximum 150 words.',
      style: 'operational focus, structured categories, lifecycle language, concise and specific'
    },

    relatedFields: ['levelOfInformationMatrix', 'alphanumericalInfo', 'documentationInfo', 'informationPurposes']
  }
};
