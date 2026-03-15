/**
 * eirFormAnalysisMapper.js
 *
 * Maps authored EIR form data (as stored in eir_drafts.data) into the
 * canonical EIR analysis JSON shape used by:
 * - ml-service/eir_analyzer.EirAnalysis (Python)
 * - EirContext / useEirFill / eirResponsivenessMatrix (frontend)
 *
 * This allows authored EIRs to drive the same BEP suggestion and
 * responsiveness-matrix flows as uploaded/analyzed EIR documents.
 */

/**
 * Normalise a free-text field into a list of non-empty strings.
 * Splits primarily on newlines; if there is only one line, returns it
 * as a single-item array.
 */
function textToList(value) {
  if (!value || typeof value !== 'string') return [];
  const trimmed = value.trim();
  if (!trimmed) return [];
  const lines = trimmed
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.length > 1 ? lines : [trimmed];
}

function safeString(value) {
  if (value == null) return null;
  const str = String(value).trim();
  return str || null;
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

/**
 * Extract delivery milestones from the EIR milestones-table field.
 *
 * The authored EIR uses a milestones-table with columns:
 * ['Stage/Phase', 'Milestone Description', 'Deliverables', 'Due Date', 'Gate', 'Notes']
 *
 * The EirAnalysis model expects:
 *   { phase: string, description: string, date?: string }
 */
function mapDeliveryMilestones(rows) {
  const arr = safeArray(rows);
  if (arr.length === 0) return [];

  return arr
    .map((row) => {
      const phase = safeString(row['Stage/Phase'] || row.Stage || row.Phase);
      const description = safeString(row['Milestone Description'] || row.Description || row.Milestone);
      const date = safeString(row['Due Date'] || row.Date);
      if (!phase && !description && !date) return null;
      return {
        phase: phase || 'N/A',
        description: description || '',
        date: date || null,
      };
    })
    .filter(Boolean);
}

/**
 * Flatten a generic table field into a list of human-readable strings.
 * Used for classification systems, LOD/LOI matrices, data exchange formats, etc.
 */
function tableRowsToList(rows, columns) {
  const arr = safeArray(rows);
  if (arr.length === 0) return [];

  const cols = Array.isArray(columns) && columns.length > 0
    ? columns
    : Object.keys(arr[0] || {});

  return arr
    .map((row) => {
      const parts = cols
        .map((col) => {
          const val = row[col];
          if (val == null || val === '') return null;
          return `${col}: ${String(val).trim()}`;
        })
        .filter(Boolean);
      return parts.length ? parts.join(' — ') : null;
    })
    .filter(Boolean);
}

/**
 * Extract a list of formats from a table with a known "Format" / "Formats" column.
 */
function extractFormatsFromTable(rows, formatColumn) {
  const arr = safeArray(rows);
  const results = [];
  const colName = formatColumn || 'Format';

  for (const row of arr) {
    const raw = row[colName] || row.Formats || row.format || row.formats;
    if (!raw) continue;
    const bits = String(raw)
      .split(/[,;/]/)
      .map((v) => v.trim())
      .filter(Boolean);
    for (const b of bits) {
      if (!results.includes(b)) {
        results.push(b);
      }
    }
  }

  return results;
}

/**
 * Extract software / platforms list from the EIR tables.
 */
function extractSoftwareList(data) {
  const result = [];

  // Step 3.1.5: softwarePlatforms table
  const softwareTable = safeArray(data.softwarePlatforms);
  for (const row of softwareTable) {
    const name = safeString(row['Platform/Tool'] || row.Platform || row.Software || row.Name);
    if (name && !result.includes(name)) {
      result.push(name);
    }
  }

  // Step A.4: appendixSoftwareSchedule table
  const scheduleTable = safeArray(data.appendixSoftwareSchedule);
  for (const row of scheduleTable) {
    const name = safeString(row.Software || row['Software'] || row['Platform']);
    if (name && !result.includes(name)) {
      result.push(name);
    }
  }

  return result;
}

/**
 * Extract classification systems from appendixClassificationSystem.
 */
function extractClassificationSystems(data) {
  const table = safeArray(data.appendixClassificationSystem);
  if (table.length === 0) return [];

  const result = [];
  for (const row of table) {
    const classification = safeString(row.Classification || row['Classification']);
    if (classification && !result.includes(classification)) {
      result.push(classification);
    }
  }
  return result;
}

/**
 * Build the standards_protocols object from relevant EIR fields.
 */
function buildStandardsProtocols(data) {
  const classificationSystems = extractClassificationSystems(data);

  const fileFormats = [
    // From 3.1.4.1 dataExchangeFormats table
    ...extractFormatsFromTable(data.dataExchangeFormats, 'Format'),
    // From A.4 appendixSoftwareSchedule (Formats column)
    ...extractFormatsFromTable(data.appendixSoftwareSchedule, 'Formats'),
  ].filter((v, idx, arr) => arr.indexOf(v) === idx);

  const namingObj = data.informationContainerIdentification || {};
  const namingParts = [];
  if (namingObj.overview) namingParts.push(String(namingObj.overview).trim());
  if (namingObj.namingPattern) namingParts.push(String(namingObj.namingPattern).trim());
  const namingConventions = namingParts.length ? namingParts.join('\n\n') : null;

  const lodLoiEntries = tableRowsToList(
    data.lodLoiMatrix,
    ['Element Category / Discipline', 'Project Stage', 'LOD', 'LoI', 'Format', 'Responsible', 'Notes'],
  );
  const lodLoiRequirements = lodLoiEntries.length
    ? lodLoiEntries.join('\n')
    : null;

  return {
    classification_systems: classificationSystems,
    naming_conventions: namingConventions,
    file_formats: fileFormats,
    lod_loi_requirements: lodLoiRequirements,
    cad_standards: null,
  };
}

/**
 * Build the cde_requirements object from relevant EIR fields.
 */
function buildCdeRequirements(data) {
  const workflowText = safeString(data.cdeWorkflow);
  const workflowStates = workflowText
    ? textToList(workflowText).map((s) => s.replace(/^[\-•]\s*/, ''))
    : [];

  // Prefer explicit CDE spec if present; fall back to workflow
  const platform = safeString(data.appendixCdeSpec);

  const accessControl = safeString(data.informationSecurityRequirements);
  const folderStructure = safeString(data.informationContainerBreakdownStructure);

  return {
    platform: platform || null,
    workflow_states: workflowStates,
    access_control: accessControl || null,
    folder_structure: folderStructure || null,
  };
}

/**
 * Extract roles & responsibilities from the responsibilityMatrix / appendixResponsibilityMatrix.
 * These fields are stored as tables; here we create coarse-grained RoleResponsibility entries.
 */
function extractRolesResponsibilities(data) {
  const roles = [];

  const primaryMatrix = safeArray(data.responsibilityMatrix);
  const appendixMatrix = safeArray(data.appendixResponsibilityMatrix);
  const allRows = [...primaryMatrix, ...appendixMatrix];

  for (const row of allRows) {
    const roleName =
      safeString(row.Role || row['Role'] || row['Responsible'] || row['Information Manager']) ||
      null;
    if (!roleName) continue;

    const responsibilities = [];
    const activity = safeString(row.Activity || row['Activity']);
    if (activity) responsibilities.push(activity);

    // Capture any textual notes as responsibilities as well
    const notes = safeString(row.Notes || row['Notes']);
    if (notes) responsibilities.push(notes);

    roles.push({
      role: roleName,
      responsibilities,
    });
  }

  return roles;
}

/**
 * Extract risk-related strings (H&S, information delivery risk, etc.).
 */
function extractSpecificRisks(data) {
  const risks = [
    ...textToList(data.informationDeliveryRiskAssessment),
    ...textToList(data.healthSafetyRiskManagement),
  ];
  return risks.filter(Boolean);
}

/**
 * Build the information_requirements object.
 */
function buildInformationRequirements(data) {
  const oir = textToList(data.informationRequirementsHierarchy);
  const air = textToList(data.aimRequirements);

  // Treat PIM requirements + information purpose as PIR-style project requirements
  const pir = [
    ...textToList(data.pimRequirements),
    ...textToList(data.informationPurpose),
  ];

  const specifics = [
    ...textToList(data.preBepRequirement),
    ...textToList(data.supplementaryDocuments),
    ...textToList(data.supplierCapabilityAssessment),
    ...textToList(data.mobilisationPlanRequirement),
    ...textToList(data.deliveryTeamBepRequirement),
  ];

  return {
    OIR: oir,
    AIR: air,
    PIR: pir,
    EIR_specifics: specifics,
  };
}

/**
 * Build training requirements from EIR form data.
 */
function buildTrainingRequirements(data) {
  return {
    bim_competency_standards: safeString(data.trainingRequirements),
    required_certifications: textToList(data.trainingRequirements),
    project_specific_training: [],
  };
}

/**
 * Build security requirements from EIR form data.
 */
function buildSecurityRequirements(data) {
  const securityMetaRows = safeArray(data.appendixSecurityMetadata);
  const accessPolicyParts = securityMetaRows
    .map((row) => {
      const cols = ['Classification', 'Description', 'Controls'];
      return cols.map((c) => safeString(row[c])).filter(Boolean).join(' — ');
    })
    .filter(Boolean);

  return {
    classification_scheme: null,
    data_handling_requirements: safeString(data.informationSecurityRequirements),
    access_control_policy: accessPolicyParts.length > 0 ? accessPolicyParts.join('; ') : null,
  };
}

/**
 * Build information protocols from EIR form data.
 */
function buildInformationProtocols(data) {
  const meetings = textToList(data.informationExchangeFrequency);
  return {
    exchange_events: [],
    coordination_frequency: safeString(data.informationExchangeFrequency),
    bcf_workflow_required: false,
    collaboration_meetings: meetings,
  };
}

/**
 * Build LOIN/LOD/LOI requirements from EIR lodLoiMatrix table rows.
 */
function buildLoinRequirements(data) {
  const rows = safeArray(data.lodLoiMatrix);
  return rows
    .map((row) => {
      const stage = safeString(row['Project Stage'] || row.Stage || row['RIBA Stage']);
      const discipline = safeString(row['Element Category / Discipline'] || row.Discipline || row.Element);
      if (!stage && !discipline) return null;
      return {
        stage,
        discipline,
        lod: safeString(row.LOD || row['Level of Detail']),
        loi: safeString(row.LoI || row.LOI || row['Level of Information']),
        notes: safeString(row.Notes || row.Note),
      };
    })
    .filter(Boolean);
}

/**
 * Map authored EIR form data into the canonical EIR analysis JSON shape.
 *
 * @param {object} formData - EIR form data from eir_drafts.data (EMPTY_EIR_DATA shape)
 * @returns {object} analysis JSON compatible with EirAnalysis
 */
function mapEirFormDataToAnalysis(formData) {
  const data = formData || {};

  // Project info is usually defined elsewhere; here we only surface high-level context.
  const project_info = {
    name: null,
    description: safeString(data.executiveSummary || data.eirPurpose) || null,
    location: null,
    client: null,
    project_type: null,
    estimated_value: null,
  };

  const bim_objectives = [
    ...textToList(data.goals),
    ...textToList(data.objectives),
  ];

  const information_requirements = buildInformationRequirements(data);

  const delivery_milestones = mapDeliveryMilestones(data.informationDeliveryMilestones);

  const standards_protocols = buildStandardsProtocols(data);

  const cde_requirements = buildCdeRequirements(data);

  const roles_responsibilities = extractRolesResponsibilities(data);

  const software_requirements = extractSoftwareList(data);

  const quality_requirements = {
    model_checking: safeString(data.informationModelQuality),
    clash_detection: null,
    validation_procedures: null,
  };

  const handover_requirements = {
    cobie_required: false,
    asset_data: safeString(data.aimRequirements),
    documentation: [],
  };

  const specific_risks = extractSpecificRisks(data);

  const other_requirements = [
    ...textToList(data.projectSpecificStandards),
    ...textToList(data.informationExchangeFrequency),
    ...textToList(data.legacyInformationRequirements),
    ...textToList(data.captureExistingAssetInformation),
    ...textToList(data.lessonsLearnt),
  ];

  const plain_language_questions = [];

  return {
    project_info,
    bim_objectives,
    information_requirements,
    delivery_milestones,
    standards_protocols,
    cde_requirements,
    roles_responsibilities,
    software_requirements,
    plain_language_questions,
    quality_requirements,
    handover_requirements,
    specific_risks,
    other_requirements,
    training_requirements: buildTrainingRequirements(data),
    security_requirements: buildSecurityRequirements(data),
    information_protocols: buildInformationProtocols(data),
    loin_requirements: buildLoinRequirements(data),
  };
}

/**
 * Build a lightweight markdown summary for authored EIRs.
 * This is used when no ML-generated summary is available.
 */
function buildBasicEirSummaryMarkdown(analysis) {
  if (!analysis) return '';

  const lines = [];
  const pi = analysis.project_info || {};

  lines.push('## Project Overview');
  if (pi.description) {
    lines.push(pi.description);
  } else {
    lines.push('Exchange Information Requirements authored in Arcquio.');
  }

  if (analysis.bim_objectives && analysis.bim_objectives.length > 0) {
    lines.push('\n## BIM Objectives');
    for (const obj of analysis.bim_objectives.slice(0, 10)) {
      lines.push(`- ${obj}`);
    }
  }

  if (analysis.delivery_milestones && analysis.delivery_milestones.length > 0) {
    lines.push('\n## Delivery Milestones');
    for (const ms of analysis.delivery_milestones.slice(0, 10)) {
      const phase = ms.phase || 'Phase';
      const desc = ms.description || '';
      const date = ms.date || '';
      lines.push(`- ${phase}${date ? ` (${date})` : ''}: ${desc}`);
    }
  }

  if (analysis.standards_protocols) {
    const sp = analysis.standards_protocols;
    const hasStandards =
      (sp.classification_systems && sp.classification_systems.length > 0) ||
      (sp.file_formats && sp.file_formats.length > 0) ||
      sp.naming_conventions ||
      sp.lod_loi_requirements;
    if (hasStandards) {
      lines.push('\n## Standards & Protocols');
      if (sp.classification_systems && sp.classification_systems.length > 0) {
        lines.push(`- Classification systems: ${sp.classification_systems.join(', ')}`);
      }
      if (sp.file_formats && sp.file_formats.length > 0) {
        lines.push(`- File formats: ${sp.file_formats.join(', ')}`);
      }
      if (sp.naming_conventions) {
        lines.push('- Naming conventions defined in EIR.');
      }
      if (sp.lod_loi_requirements) {
        lines.push('- LOD/LOI matrix defined in EIR.');
      }
    }
  }

  if (analysis.software_requirements && analysis.software_requirements.length > 0) {
    lines.push('\n## Technical Requirements');
    lines.push(`- Software / platforms: ${analysis.software_requirements.join(', ')}`);
  }

  if (analysis.specific_risks && analysis.specific_risks.length > 0) {
    lines.push('\n## Risks & Specific Requirements');
    for (const risk of analysis.specific_risks.slice(0, 10)) {
      lines.push(`- ${risk}`);
    }
  }

  return lines.join('\n');
}

module.exports = {
  mapEirFormDataToAnalysis,
  buildBasicEirSummaryMarkdown,
};

