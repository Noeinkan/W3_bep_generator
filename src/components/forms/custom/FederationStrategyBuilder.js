import React, { useEffect } from 'react';
import { Info, Upload, Download, Plus, Trash2 } from 'lucide-react';
import TipTapEditor from '../editors/TipTapEditor';
import ClashMatrixHeatmap from './ClashMatrixHeatmap';
import FieldHeader from '../base/FieldHeader';
import FieldError from '../base/FieldError';
import EditableTable from '../base/EditableTable';
import FederationFlowchartDiagram from '../diagrams/FederationFlowchartDiagram';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/** Default 8-step federation process (benchmark 5.1.5) */
const defaultFederationProcessSteps = [
  { title: 'Model submission to CDE', description: 'Discipline models published to Shared area per naming convention' },
  { title: 'Federation build', description: 'BIM Coordinator creates federated model (NWD/IFC) in coordination tool' },
  { title: 'Clash detection run', description: 'Automated clash detection using predefined rulesets' },
  { title: 'Clash report generation', description: 'BCF/issue export for coordination review' },
  { title: 'Coordination review meeting', description: 'Scheduled review with responsible parties' },
  { title: 'Issue assignment and resolution', description: 'Clashes assigned; resolution within agreed timeframe' },
  { title: 'Re-federation and verification', description: 'Updated models federated; clash closure verified' },
  { title: 'Sign-off and release', description: 'Federated model approved for next stage; see IPMP' }
];

/** Default issue creation requirements (benchmark 5.1.5) */
const defaultIssueCreationRequirements = [
  'Issue ID and source clash reference',
  'Discipline pair and location',
  'Description and severity',
  'Responsible party and due date',
  'BCF format for tool interoperability'
];

/**
 * FederationStrategyBuilder
 * Component for Section 9.7 / Section 5.1: Federation Strategy
 *
 * Provides structured interface for:
 * 5.1 Definition and purposes; 5.1.1 Model Breakdown Structure; 5.1.2 Model Register;
 * 5.1.3 Model Coordination Baseline; 5.1.4 Model Federation Process; 5.1.5 Federation Process Steps;
 * 9.7.1 Overview; 9.7.2 Clash Matrix; 9.7.3 Configuration; 9.7.4 Coordination Procedures;
 * Federation Schedule; Coordination by Stage; Clash rulesets A/B/C; Clash responsibilities.
 */
const FederationStrategyBuilder = ({ field, value = {}, onChange, error, disabled = false }) => {

  // Default 8 clash relationships based on ISO 19650 best practices
  const defaultClashes = [
    {
      disciplineA: 0, // Architecture
      disciplineB: 1, // Structure
      enabled: true,
      tolerance: 25,
      responsibleParty: 'Lead BIM Coordinator',
      notes: 'Critical interfaces: walls, columns, beams, slabs'
    },
    {
      disciplineA: 2, // MEP (HVAC)
      disciplineB: 1, // Structure
      enabled: true,
      tolerance: 50,
      responsibleParty: 'MEP Coordinator',
      notes: 'Services penetrations through structural elements'
    },
    {
      disciplineA: 2, // MEP (HVAC)
      disciplineB: 0, // Architecture
      enabled: true,
      tolerance: 50,
      responsibleParty: 'MEP Coordinator',
      notes: 'Services routing within architectural spaces'
    },
    {
      disciplineA: 2, // MEP (HVAC)
      disciplineB: 3, // MEP (Electrical)
      enabled: true,
      tolerance: 100,
      responsibleParty: 'MEP Coordinator',
      notes: 'Service-to-service: ducts vs. cable trays'
    },
    {
      disciplineA: 2, // MEP (HVAC)
      disciplineB: 4, // MEP (Plumbing)
      enabled: true,
      tolerance: 75,
      responsibleParty: 'MEP Coordinator',
      notes: 'Ducts vs. pipes in vertical and horizontal runs'
    },
    {
      disciplineA: 5, // Facades
      disciplineB: 1, // Structure
      enabled: true,
      tolerance: 10,
      responsibleParty: 'Facade Engineer',
      notes: 'Curtain wall interfaces - high precision required'
    },
    {
      disciplineA: 6, // Site/Civil
      disciplineB: 0, // Architecture (represents "Building")
      enabled: true,
      tolerance: 100,
      responsibleParty: 'Civil Engineer',
      notes: 'Site levels, drainage, utilities entry points'
    },
    {
      disciplineA: 7, // Fire Protection
      disciplineB: 0, // All Disciplines (using Architecture as representative)
      enabled: true,
      tolerance: 50,
      responsibleParty: 'MEP Coordinator',
      notes: 'Sprinkler system coordination across disciplines'
    }
  ];

  const defaultModelRegisterColumns = ['Model ID', 'Model Name', 'Discipline', 'Design Package', 'Format', 'Owner', 'Maintenance Responsibility', 'ACC Location', 'Status', 'Notes'];
  const defaultScheduleColumns = ['Activity', 'Frequency', 'Day/Time', 'Location', 'Responsible'];
  const defaultCoordinationByStageColumns = ['Stage', 'Federation Frequency', 'Submission Day', 'Review Day', 'Notes'];
  const defaultClashRespColumns = ['Name', 'Role', 'Run Clash', 'Review', 'Resolve', 'Sign-off', 'Escalate'];

  // Default structure (backward compatible: new fields optional)
  const defaultValue = {
    definitionAndPurposes: {
      definition: 'Federation is the process of combining discipline-specific information models into a single coordinated model for spatial coordination, clash detection, and integrated review in accordance with ISO 19650-2.',
      purposes: [
        'Spatial coordination across disciplines',
        'Clash detection and resolution',
        'Integrated model delivery at milestones',
        'Single source for coordination review'
      ]
    },
    modelBreakdownStructure: {
      hierarchyLevels: [
        { level: 'Asset', description: 'Top-level asset or project' },
        { level: 'Design Package', description: 'Contract or package boundary' },
        { level: 'Discipline', description: 'Architecture, Structure, MEP, etc.' }
      ],
      principles: {
        uniclassAlignment: 'Model breakdown aligns with Uniclass 2015 where applicable',
        maxFileSize: 'Single model file size limits to be agreed (e.g. 500 MB)',
        ownership: 'Each model has a single responsible task team and originator'
      }
    },
    modelRegister: {
      columns: defaultModelRegisterColumns,
      data: []
    },
    coordinationBaseline: {
      sharedLevelsGrids: 'A Shared Levels and Grids model is maintained as the spatial baseline; all discipline models align to this baseline.',
      geolocationVerification: [
        'Project base point and shared coordinates verified at project start',
        'Survey control points documented and shared',
        'Grid and level consistency checked at each federation',
        'Coordinate system cross-referenced to Information Standard'
      ],
      coordinateSystemRef: 'See Information Standard Section 8.3 (Coordinates)'
    },
    federationResponsibility: 'Lead BIM Coordinator',
    singleFileFormat: 'NWD',
    federationProcessSteps: defaultFederationProcessSteps,
    issueCreationRequirements: defaultIssueCreationRequirements,
    ipmpReference: 'See Information Production Methods and Procedures (IPMP) for detailed workflows',
    federationSchedule: { columns: defaultScheduleColumns, data: [] },
    coordinationByStage: { columns: defaultCoordinationByStageColumns, data: [] },
    clashResponsibilities: { columns: defaultClashRespColumns, data: [] },
    clashRulesets: { categoryA: [], categoryB: [], categoryC: [] },
    overview: '<p>Federation strategy establishes the framework for coordinating multi-discipline BIM models in compliance with <strong>ISO 19650-2:2018</strong> clause 5.3.2. The approach ensures spatial coordination, clash detection, and integrated model delivery throughout all project phases.</p><p><strong>Key principles:</strong></p><ul><li>Discipline-based federation with clear model ownership</li><li>Weekly federation cycles aligned with project milestones</li><li>Automated clash detection with predefined tolerance matrices</li><li>Structured coordination workflow following ISO 19650-2 protocols</li></ul>',
    clashMatrix: {
      disciplines: [
        'Architecture',
        'Structure',
        'MEP (HVAC)',
        'MEP (Electrical)',
        'MEP (Plumbing)',
        'Facades',
        'Site/Civil',
        'Fire Protection'
      ],
      clashes: defaultClashes
    },
    configuration: {
      approach: 'discipline',
      frequency: 'weekly',
      tools: ['Navisworks', 'Solibri'],
      modelBreakdown: ['discipline']
    },
    coordinationProcedures: '<h4>Clash Detection Workflow</h4><ol><li><strong>Model Submission:</strong> Discipline teams submit models to CDE by Tuesday 17:00</li><li><strong>Federation:</strong> BIM Coordinator federates models and runs clash detection by Wednesday 09:00</li><li><strong>Clash Review:</strong> Weekly coordination meeting Wednesday 10:00</li><li><strong>Resolution:</strong> Responsible parties resolve clashes within 5 working days</li><li><strong>Verification:</strong> BIM Coordinator verifies resolution in next cycle</li></ol><h4>Quality Control</h4><ul><li>Model validation using Solibri against project-specific rulesets</li><li>Clash tolerance matrix enforcement per Section 8.6.2</li><li>BCF issue tracking for clash management</li><li>Sign-off required from Task Team Leaders before progression</li></ul>'
  };

  // Initialize with default values
  useEffect(() => {
    if (field && field.name && onChange) {
      // Only initialize if value is empty or missing clashes
      if (!value || typeof value === 'string' || !value.clashMatrix || !value.clashMatrix.clashes || value.clashMatrix.clashes.length === 0) {
        // Migration: if value is string (old format), preserve in overview
        const migratedValue = typeof value === 'string'
          ? { ...defaultValue, overview: value }
          : defaultValue;

        onChange(field.name, migratedValue);
      }
    }
  }, []); // Run only once on mount

  // Safety check
  if (!field) {
    return <div className="text-red-600">Error: Field configuration is missing</div>;
  }

  const { name } = field;

  // Handle different value types (backward compatible: merge new fields from defaultValue)
  let currentValue = defaultValue;
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    currentValue = {
      definitionAndPurposes: value.definitionAndPurposes ?? defaultValue.definitionAndPurposes,
      modelBreakdownStructure: value.modelBreakdownStructure ?? defaultValue.modelBreakdownStructure,
      modelRegister: value.modelRegister ?? defaultValue.modelRegister,
      coordinationBaseline: value.coordinationBaseline ?? defaultValue.coordinationBaseline,
      federationResponsibility: value.federationResponsibility ?? defaultValue.federationResponsibility,
      singleFileFormat: value.singleFileFormat ?? defaultValue.singleFileFormat,
      federationProcessSteps: value.federationProcessSteps ?? defaultValue.federationProcessSteps,
      issueCreationRequirements: value.issueCreationRequirements ?? defaultValue.issueCreationRequirements,
      ipmpReference: value.ipmpReference ?? defaultValue.ipmpReference,
      federationSchedule: value.federationSchedule ?? defaultValue.federationSchedule,
      coordinationByStage: value.coordinationByStage ?? defaultValue.coordinationByStage,
      clashResponsibilities: value.clashResponsibilities ?? defaultValue.clashResponsibilities,
      clashRulesets: value.clashRulesets ?? defaultValue.clashRulesets,
      overview: value.overview ?? defaultValue.overview,
      clashMatrix: value.clashMatrix ?? defaultValue.clashMatrix,
      configuration: value.configuration ?? defaultValue.configuration,
      coordinationProcedures: value.coordinationProcedures ?? defaultValue.coordinationProcedures
    };
  }

  const update = (key, val) => onChange(name, { ...currentValue, [key]: val });

  const handleDefinitionChange = (v) => update('definitionAndPurposes', { ...currentValue.definitionAndPurposes, definition: v });
  const handlePurposesChange = (purposes) => update('definitionAndPurposes', { ...currentValue.definitionAndPurposes, purposes });
  const addPurpose = () => handlePurposesChange([...(currentValue.definitionAndPurposes.purposes || []), '']);
  const removePurpose = (i) => handlePurposesChange(currentValue.definitionAndPurposes.purposes.filter((_, idx) => idx !== i));
  const setPurpose = (i, text) => {
    const p = [...(currentValue.definitionAndPurposes.purposes || [])];
    p[i] = text;
    handlePurposesChange(p);
  };

  const handleModelBreakdownChange = (key, val) => update('modelBreakdownStructure', { ...currentValue.modelBreakdownStructure, [key]: val });
  const setHierarchyLevel = (idx, field, text) => {
    const levels = [...(currentValue.modelBreakdownStructure.hierarchyLevels || [])];
    levels[idx] = { ...levels[idx], [field]: text };
    handleModelBreakdownChange('hierarchyLevels', levels);
  };
  const setPrinciple = (key, text) => handleModelBreakdownChange('principles', { ...currentValue.modelBreakdownStructure.principles, [key]: text });

  const handleModelRegisterChange = (_, val) => update('modelRegister', val && val.data !== undefined ? val : { ...currentValue.modelRegister, ...val });
  const handleCoordinationBaselineChange = (key, val) => update('coordinationBaseline', { ...currentValue.coordinationBaseline, [key]: val });
  const setGeolocationItem = (idx, text) => {
    const list = [...(currentValue.coordinationBaseline.geolocationVerification || [])];
    list[idx] = text;
    handleCoordinationBaselineChange('geolocationVerification', list);
  };
  const addGeolocationItem = () => handleCoordinationBaselineChange('geolocationVerification', [...(currentValue.coordinationBaseline.geolocationVerification || []), '']);
  const removeGeolocationItem = (i) => handleCoordinationBaselineChange('geolocationVerification', currentValue.coordinationBaseline.geolocationVerification.filter((_, idx) => idx !== i));

  const handleFederationProcessStepChange = (idx, field, val) => {
    const steps = [...(currentValue.federationProcessSteps || [])];
    steps[idx] = { ...(steps[idx] || {}), [field]: val };
    update('federationProcessSteps', steps);
  };
  const handleIssueCreationChange = (idx, text) => {
    const list = [...(currentValue.issueCreationRequirements || [])];
    list[idx] = text;
    update('issueCreationRequirements', list);
  };

  // Handler: Overview change
  const handleOverviewChange = (newValue) => {
    onChange(name, {
      ...currentValue,
      overview: newValue
    });
  };

  // Handler: Clash matrix change
  const handleClashMatrixChange = (newClashes) => {
    onChange(name, {
      ...currentValue,
      clashMatrix: {
        ...currentValue.clashMatrix,
        clashes: newClashes
      }
    });
  };

  // Handler: Configuration changes
  const handleConfigChange = (configField, newValue) => {
    onChange(name, {
      ...currentValue,
      configuration: {
        ...currentValue.configuration,
        [configField]: newValue
      }
    });
  };

  // Handler: Coordination procedures change
  const handleProceduresChange = (newValue) => {
    onChange(name, {
      ...currentValue,
      coordinationProcedures: newValue
    });
  };

  // Handler: CSV Import
  const handleCsvImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const { disciplines } = currentValue.clashMatrix;

        // Convert CSV to clash objects
        const importedClashes = results.data
          .filter(row => row['Discipline A']?.trim() && row['Discipline B']?.trim())
          .map(row => {
            const indexA = disciplines.findIndex(d => d.toLowerCase().includes(row['Discipline A'].toLowerCase()));
            const indexB = disciplines.findIndex(d => d.toLowerCase().includes(row['Discipline B'].toLowerCase()));

            if (indexA === -1 || indexB === -1) return null;

            return {
              disciplineA: indexA,
              disciplineB: indexB,
              enabled: true,
              tolerance: parseInt(row['Tolerance (mm)'] || row['Tolerance'] || '50'),
              responsibleParty: row['Responsible Party'] || row['Responsible'] || 'BIM Coordinator',
              notes: row['Notes'] || ''
            };
          })
          .filter(clash => clash !== null);

        if (importedClashes.length > 0) {
          handleClashMatrixChange(importedClashes);
          alert(`Imported ${importedClashes.length} clash detection rules successfully.`);
        } else {
          alert('No valid clash data found in CSV. Please check the format.');
        }
      },
      error: (error) => {
        alert(`Error importing CSV: ${error.message}`);
      }
    });

    // Reset input
    event.target.value = '';
  };

  // Handler: Excel Export
  const handleExcelExport = () => {
    const { disciplines, clashes } = currentValue.clashMatrix;

    // Convert clashes to Excel-friendly format
    const exportData = clashes.map(clash => ({
      'Discipline A': disciplines[clash.disciplineA] || '',
      'Discipline B': disciplines[clash.disciplineB] || '',
      'Tolerance (mm)': clash.tolerance || '',
      'Responsible Party': clash.responsibleParty || '',
      'Notes': clash.notes || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 20 }, // Discipline A
      { wch: 20 }, // Discipline B
      { wch: 15 }, // Tolerance
      { wch: 25 }, // Responsible Party
      { wch: 50 }  // Notes
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clash Detection Matrix');

    const filename = `Clash_Detection_Matrix_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  // Handler: Tools checkbox change
  const handleToolsChange = (tool) => {
    const { tools } = currentValue.configuration;
    const updated = tools.includes(tool)
      ? tools.filter(t => t !== tool)
      : [...tools, tool];
    handleConfigChange('tools', updated);
  };

  // Handler: Model breakdown checkbox change
  const handleBreakdownChange = (breakdown) => {
    const { modelBreakdown } = currentValue.configuration;
    const updated = modelBreakdown.includes(breakdown)
      ? modelBreakdown.filter(b => b !== breakdown)
      : [...modelBreakdown, breakdown];
    handleConfigChange('modelBreakdown', updated);
  };

  return (
    <div className="space-y-4">
      {/* Main Header */}
      <FieldHeader
        fieldName={name}
        label={field.label}
        number={field.number}
        required={field.required}
      />

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-1">
              Federation Strategy - ISO 19650-2
            </h4>
            <p className="text-sm text-blue-800">
              Define how discipline models are federated, clash detection matrix, and coordination workflows according to ISO 19650-2 clause 5.3.2.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 5.1 Definition and purposes */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <FieldHeader fieldName="federationStrategy_definition" label="Definition and Purposes of Federation" number="5.1" asSectionHeader={true} />
          <p className="text-sm text-gray-600 mb-3">Define federation and its purposes (benchmark Section 5)</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Definition</label>
              <textarea
                value={currentValue.definitionAndPurposes?.definition ?? ''}
                onChange={(e) => handleDefinitionChange(e.target.value)}
                disabled={disabled}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Federation is the process of combining discipline-specific models..."
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Purposes</label>
                {!disabled && (
                  <button type="button" onClick={addPurpose} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                    <Plus className="w-4 h-4" /> Add purpose
                  </button>
                )}
              </div>
              <ul className="space-y-2">
                {(currentValue.definitionAndPurposes?.purposes || []).map((p, i) => (
                  <li key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={p}
                      onChange={(e) => setPurpose(i, e.target.value)}
                      disabled={disabled}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Spatial coordination across disciplines"
                    />
                    {!disabled && (
                      <button type="button" onClick={() => removePurpose(i)} className="p-2 text-red-600 hover:bg-red-50 rounded" aria-label="Remove"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 9.7.1 Overview */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <FieldHeader
            fieldName="federationStrategy_overview"
            label="Federation Overview"
            number="9.7.1"
            asSectionHeader={true}
          />
          <p className="text-sm text-gray-600 mb-3">Strategic approach to model federation</p>
          <TipTapEditor
            id="federation-overview"
            value={currentValue.overview || ''}
            onChange={handleOverviewChange}
            placeholder="Describe the overall federation strategy and approach..."
            minHeight="120px"
            autoSaveKey="federation-overview"
            fieldName="federationOverview"
          />
        </div>

        {/* 5.1.1 Model Breakdown Structure */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <FieldHeader fieldName="federationStrategy_modelBreakdown" label="Model Breakdown Structure" number="5.1.1" asSectionHeader={true} />
          <p className="text-sm text-gray-600 mb-4">3-level hierarchy and principles (Uniclass, file size, ownership)</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hierarchy (Asset → Design Package → Discipline)</label>
              <div className="space-y-2">
                {(currentValue.modelBreakdownStructure?.hierarchyLevels || []).map((row, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <span className="text-sm text-gray-500 w-32">{row.level}</span>
                    <input
                      type="text"
                      value={row.description || ''}
                      onChange={(e) => setHierarchyLevel(idx, 'description', e.target.value)}
                      disabled={disabled}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Description"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              <label className="block text-sm font-medium text-gray-700">Principles</label>
              <input type="text" value={currentValue.modelBreakdownStructure?.principles?.uniclassAlignment ?? ''} onChange={(e) => setPrinciple('uniclassAlignment', e.target.value)} disabled={disabled} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Uniclass alignment" />
              <input type="text" value={currentValue.modelBreakdownStructure?.principles?.maxFileSize ?? ''} onChange={(e) => setPrinciple('maxFileSize', e.target.value)} disabled={disabled} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Max file size" />
              <input type="text" value={currentValue.modelBreakdownStructure?.principles?.ownership ?? ''} onChange={(e) => setPrinciple('ownership', e.target.value)} disabled={disabled} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Ownership" />
            </div>
          </div>
        </div>

        {/* 5.1.2 Model Register (Federated Model Breakdown) */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <FieldHeader fieldName="federationStrategy_modelRegister" label="Federated Model Breakdown (Model Register)" number="5.1.2" asSectionHeader={true} />
          <p className="text-sm text-gray-600 mb-4">10-field Model Register; maintenance responsibility; ACC location</p>
          <EditableTable
            field={{ name: 'fs_modelRegister', columns: currentValue.modelRegister?.columns || defaultModelRegisterColumns }}
            value={currentValue.modelRegister}
            onChange={(_, val) => handleModelRegisterChange(_, val)}
            error={null}
          />
        </div>

        {/* 5.1.3 Model Coordination Baseline */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <FieldHeader fieldName="federationStrategy_coordinationBaseline" label="Model Coordination Baseline" number="5.1.3" asSectionHeader={true} />
          <p className="text-sm text-gray-600 mb-4">Shared Levels and Grids model; geolocation verification; coordinate system cross-reference</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shared Levels and Grids model</label>
              <textarea value={currentValue.coordinationBaseline?.sharedLevelsGrids ?? ''} onChange={(e) => handleCoordinationBaselineChange('sharedLevelsGrids', e.target.value)} disabled={disabled} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Describe the shared spatial baseline..." />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Geolocation verification requirements</label>
                {!disabled && (
                  <button type="button" onClick={addGeolocationItem} className="flex items-center gap-1 text-sm text-blue-600 hover:underline"><Plus className="w-4 h-4" /> Add</button>
                )}
              </div>
              <ul className="space-y-2">
                {(currentValue.coordinationBaseline?.geolocationVerification || []).map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <input type="text" value={item} onChange={(e) => setGeolocationItem(i, e.target.value)} disabled={disabled} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Verification requirement" />
                    {!disabled && <button type="button" onClick={() => removeGeolocationItem(i)} className="p-2 text-red-600 hover:bg-red-50 rounded" aria-label="Remove"><Trash2 className="w-4 h-4" /></button>}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coordinate system cross-reference</label>
              <input type="text" value={currentValue.coordinationBaseline?.coordinateSystemRef ?? ''} onChange={(e) => handleCoordinationBaselineChange('coordinateSystemRef', e.target.value)} disabled={disabled} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. See Information Standard Section 8.3" />
            </div>
          </div>
        </div>

        {/* 5.1.4 Model Federation Process */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <FieldHeader fieldName="federationStrategy_federationProcess" label="Model Federation Process" number="5.1.4" asSectionHeader={true} />
          <p className="text-sm text-gray-600 mb-4">Federation responsibility assignment; single-file-per-federation policy (e.g. NWD/IFC2x3)</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Federation responsibility</label>
              <input type="text" value={currentValue.federationResponsibility ?? ''} onChange={(e) => update('federationResponsibility', e.target.value)} disabled={disabled} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. Lead BIM Coordinator" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Single-file-per-federation format</label>
              <select value={currentValue.singleFileFormat ?? 'NWD'} onChange={(e) => update('singleFileFormat', e.target.value)} disabled={disabled} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="NWD">NWD (Navisworks)</option>
                <option value="IFC2x3">IFC 2x3</option>
                <option value="IFC4">IFC 4</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* 5.1.5 Federation Process Steps */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <FieldHeader fieldName="federationStrategy_processSteps" label="Federation Process Steps" number="5.1.5" asSectionHeader={true} />
          <p className="text-sm text-gray-600 mb-4">8-step process; ACC/Navisworks; issue creation requirements; IPMP cross-reference</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Process steps</label>
              <ol className="list-decimal list-inside space-y-2">
                {(currentValue.federationProcessSteps || []).map((step, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-gray-500 w-6">{idx + 1}.</span>
                    <input type="text" value={step.title ?? ''} onChange={(e) => handleFederationProcessStepChange(idx, 'title', e.target.value)} disabled={disabled} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Step title" />
                    <input type="text" value={step.description ?? ''} onChange={(e) => handleFederationProcessStepChange(idx, 'description', e.target.value)} disabled={disabled} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Description" />
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Issue creation requirements (5 items)</label>
              <ul className="space-y-2">
                {(currentValue.issueCreationRequirements || []).map((item, idx) => (
                  <li key={idx}>
                    <input type="text" value={item} onChange={(e) => handleIssueCreationChange(idx, e.target.value)} disabled={disabled} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Requirement" />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IPMP cross-reference</label>
              <input type="text" value={currentValue.ipmpReference ?? ''} onChange={(e) => update('ipmpReference', e.target.value)} disabled={disabled} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="See Information Production Methods and Procedures (IPMP)..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Figure 5-1 — Federation flowchart</label>
              <FederationFlowchartDiagram steps={currentValue.federationProcessSteps || []} />
            </div>
          </div>
        </div>

        {/* 8.6.2 Clash Detection Matrix Heatmap */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <FieldHeader
            fieldName="federationStrategy_clashMatrix"
            label="Clash Detection Matrix Heatmap"
            number="9.7.2"
            asSectionHeader={true}
          />
          <p className="text-sm text-gray-600 mb-3">
            Visual matrix of clash detection relationships between disciplines
          </p>

          {/* Import/Export Buttons */}
          <div className="flex gap-2 mb-4">
            <label className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <Upload className="w-4 h-4" />
              Import CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvImport}
                className="hidden"
                disabled={disabled}
              />
            </label>
            <button
              onClick={handleExcelExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={disabled}
            >
              <Download className="w-4 h-4" />
              Export Excel
            </button>
          </div>

          {/* Heatmap */}
          <ClashMatrixHeatmap
            disciplines={currentValue.clashMatrix.disciplines}
            clashes={currentValue.clashMatrix.clashes}
            onChange={handleClashMatrixChange}
            disabled={disabled}
          />
        </div>

        {/* 8.6.3 Federation Configuration */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <FieldHeader
            fieldName="federationStrategy_configuration"
            label="Federation Configuration"
            number="9.7.3"
            asSectionHeader={true}
          />
          <p className="text-sm text-gray-600 mb-4">
            Configuration settings for federation approach and tools
          </p>

          <div className="space-y-4">
            {/* Federation Approach */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Federation Approach
              </label>
              <div className="flex flex-wrap gap-4">
                {['discipline', 'zone', 'phase', 'hybrid'].map(approach => (
                  <label key={approach} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="federationApproach"
                      value={approach}
                      checked={currentValue.configuration.approach === approach}
                      onChange={(e) => handleConfigChange('approach', e.target.value)}
                      disabled={disabled}
                      className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{approach}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Federation Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Federation Frequency
              </label>
              <select
                value={currentValue.configuration.frequency}
                onChange={(e) => handleConfigChange('frequency', e.target.value)}
                disabled={disabled}
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="milestone">At Milestones</option>
              </select>
            </div>

            {/* Clash Detection Tools */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clash Detection Tools
              </label>
              <div className="flex flex-wrap gap-3">
                {['Navisworks', 'Solibri', 'BIMcollab', 'Trimble Connect', 'BIM 360 Coordinate', 'Synchro Pro'].map(tool => (
                  <label key={tool} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentValue.configuration.tools.includes(tool)}
                      onChange={() => handleToolsChange(tool)}
                      disabled={disabled}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{tool}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Model Breakdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model Breakdown Strategy
              </label>
              <div className="flex flex-wrap gap-3">
                {['discipline', 'zone', 'level', 'phase', 'system'].map(breakdown => (
                  <label key={breakdown} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentValue.configuration.modelBreakdown.includes(breakdown)}
                      onChange={() => handleBreakdownChange(breakdown)}
                      disabled={disabled}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">By {breakdown}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 8.6.4 Coordination Procedures */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <FieldHeader
            fieldName="federationStrategy_procedures"
            label="Coordination Procedures"
            number="9.7.4"
            asSectionHeader={true}
          />
          <p className="text-sm text-gray-600 mb-3">Clash resolution workflow and quality control processes</p>
          <TipTapEditor
            id="coordination-procedures"
            value={currentValue.coordinationProcedures || ''}
            onChange={handleProceduresChange}
            placeholder="Describe the clash detection workflow, resolution process, and quality control procedures..."
            minHeight="120px"
            autoSaveKey="coordination-procedures"
            fieldName="coordinationProcedures"
          />
        </div>

        {/* Section 9: Federation Schedule */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <FieldHeader fieldName="federationStrategy_schedule" label="Federation Schedule" number="9.1" asSectionHeader={true} />
          <p className="text-sm text-gray-600 mb-4">Activity, frequency, day/time, location (benchmark Table 9-3)</p>
          <EditableTable
            field={{ name: 'fs_schedule', columns: currentValue.federationSchedule?.columns || defaultScheduleColumns }}
            value={currentValue.federationSchedule}
            onChange={(_, val) => update('federationSchedule', val && val.data !== undefined ? val : { ...currentValue.federationSchedule, ...val })}
            error={null}
          />
        </div>

        {/* Coordination by Project Stage */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <FieldHeader fieldName="federationStrategy_coordinationByStage" label="Coordination by Project Stage" number="9.2" asSectionHeader={true} />
          <p className="text-sm text-gray-600 mb-4">Stage, federation frequency, submission day, review day (benchmark Table 9-4)</p>
          <EditableTable
            field={{ name: 'fs_coordinationByStage', columns: currentValue.coordinationByStage?.columns || defaultCoordinationByStageColumns }}
            value={currentValue.coordinationByStage}
            onChange={(_, val) => update('coordinationByStage', val && val.data !== undefined ? val : { ...currentValue.coordinationByStage, ...val })}
            error={null}
          />
        </div>

        {/* Clash Detection Responsibilities (Table 9-6) */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <FieldHeader fieldName="federationStrategy_clashResponsibilities" label="Clash Detection Responsibilities" number="9.3" asSectionHeader={true} />
          <p className="text-sm text-gray-600 mb-4">Named individuals with role and responsibility columns</p>
          <EditableTable
            field={{ name: 'fs_clashResponsibilities', columns: currentValue.clashResponsibilities?.columns || defaultClashRespColumns }}
            value={currentValue.clashResponsibilities}
            onChange={(_, val) => update('clashResponsibilities', val && val.data !== undefined ? val : { ...currentValue.clashResponsibilities, ...val })}
            error={null}
          />
        </div>

        {/* Tiered Clash Rulesets (Category A/B/C) */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <FieldHeader fieldName="federationStrategy_rulesets" label="Clash Detection Rulesets by Severity" number="9.2.3" asSectionHeader={true} />
          <p className="text-sm text-gray-600 mb-4">Category A (Critical), B (Significant), C (Minor) — ID, discipline pair, description, tolerance</p>
          <div className="space-y-6">
            {[
              { key: 'categoryA', label: 'Category A — Critical', rules: currentValue.clashRulesets?.categoryA || [] },
              { key: 'categoryB', label: 'Category B — Significant', rules: currentValue.clashRulesets?.categoryB || [] },
              { key: 'categoryC', label: 'Category C — Minor', rules: currentValue.clashRulesets?.categoryC || [] }
            ].map(({ key, label, rules }) => (
              <div key={key}>
                <h5 className="text-sm font-medium text-gray-700 mb-2">{label}</h5>
                <div className="space-y-2">
                  {(rules || []).map((rule, idx) => (
                    <div key={idx} className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <input type="text" value={rule.id ?? ''} onChange={(e) => { const r = [...(currentValue.clashRulesets?.[key] || [])]; r[idx] = { ...r[idx], id: e.target.value }; update('clashRulesets', { ...currentValue.clashRulesets, [key]: r }); }} disabled={disabled} placeholder="ID" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      <input type="text" value={rule.disciplinePair ?? ''} onChange={(e) => { const r = [...(currentValue.clashRulesets?.[key] || [])]; r[idx] = { ...r[idx], disciplinePair: e.target.value }; update('clashRulesets', { ...currentValue.clashRulesets, [key]: r }); }} disabled={disabled} placeholder="Discipline pair" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      <input type="text" value={rule.description ?? ''} onChange={(e) => { const r = [...(currentValue.clashRulesets?.[key] || [])]; r[idx] = { ...r[idx], description: e.target.value }; update('clashRulesets', { ...currentValue.clashRulesets, [key]: r }); }} disabled={disabled} placeholder="Description" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      <input type="text" value={rule.tolerance ?? ''} onChange={(e) => { const r = [...(currentValue.clashRulesets?.[key] || [])]; r[idx] = { ...r[idx], tolerance: e.target.value }; update('clashRulesets', { ...currentValue.clashRulesets, [key]: r }); }} disabled={disabled} placeholder="Tolerance (mm)" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      {!disabled && (
                        <button type="button" onClick={() => update('clashRulesets', { ...currentValue.clashRulesets, [key]: (currentValue.clashRulesets?.[key] || []).filter((_, i) => i !== idx) })} className="p-2 text-red-600 hover:bg-red-50 rounded" aria-label="Remove"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  ))}
                  {!disabled && (
                    <button type="button" onClick={() => update('clashRulesets', { ...currentValue.clashRulesets, [key]: [...(currentValue.clashRulesets?.[key] || []), { id: '', disciplinePair: '', description: '', tolerance: '' }] })} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                      <Plus className="w-4 h-4" /> Add ruleset
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FieldError error={error} />
    </div>
  );
};

export default FederationStrategyBuilder;
