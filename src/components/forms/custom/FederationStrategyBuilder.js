import React, { useEffect } from 'react';
import { Info, Upload, Download } from 'lucide-react';
import TipTapEditor from '../editors/TipTapEditor';
import ClashMatrixHeatmap from './ClashMatrixHeatmap';
import FieldHeader from '../base/FieldHeader';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * FederationStrategyBuilder
 * Component for Section 9.7: Federation Strategy
 *
 * Provides a structured interface for defining:
 * 9.7.1 Overview - Strategic approach to model federation
 * 9.7.2 Clash Detection Matrix Heatmap - Visual matrix of discipline clash relationships
 * 9.7.3 Federation Configuration - Approach, frequency, tools, model breakdown
 * 9.7.4 Coordination Procedures - Clash resolution workflow
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

  // Default structure
  const defaultValue = {
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

  // Handle different value types
  let currentValue = defaultValue;
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    currentValue = {
      overview: value.overview || defaultValue.overview,
      clashMatrix: value.clashMatrix || defaultValue.clashMatrix,
      configuration: value.configuration || defaultValue.configuration,
      coordinationProcedures: value.coordinationProcedures || defaultValue.coordinationProcedures
    };
  }

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
        {/* 8.6.1 Overview */}
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
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FederationStrategyBuilder;
