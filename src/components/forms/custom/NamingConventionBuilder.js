import React, { useEffect } from 'react';
import { Plus, Trash2, Info } from 'lucide-react';
import TipTapEditor from '../editors/TipTapEditor';
import FieldHeader from '../base/FieldHeader';
import FieldError from '../base/FieldError';
import BaseTextInput from '../base/BaseTextInput';
import NamingPatternVisualizer from './NamingPatternVisualizer';
import DeliverableAttributesVisualizer from './DeliverableAttributesVisualizer';

/**
 * NamingConventionBuilder
 * Component for Section 9.2: Naming Conventions
 *
 * Provides a structured interface for defining:
 * 9.2.1 Overview - General approach to naming conventions
 * 9.2.2 Naming Convention Fields - Components of the file naming pattern
 * 9.2.3 Naming Pattern & Example - Complete pattern and example filename
 * 9.2.4 Deliverable Attributes - Metadata and properties associated with deliverables
 */
const NamingConventionBuilder = ({ field, value = {}, onChange, error, disabled = false }) => {

  // Initialize with default structure
  const defaultValue = {
    overview: '<p>File naming follows <strong>ISO 19650-2</strong> convention to ensure consistency, traceability, and efficient information management across all project deliverables.</p>',
    namingFields: [
      {
        fieldName: '[Project Code]',
        exampleValue: 'PRJ001',
        description: 'Unique project identifier assigned by the appointing party'
      },
      {
        fieldName: '[Originator]',
        exampleValue: 'ARC',
        description: 'Organization/discipline creating the information (e.g., ARC=Architecture, STR=Structural, MEP=MEP)'
      },
      {
        fieldName: '[Volume/System]',
        exampleValue: 'XX',
        description: 'Building zone, system, or spatial reference (XX if not applicable)'
      },
      {
        fieldName: '[Level/Location]',
        exampleValue: 'GF',
        description: 'Floor level or location code (e.g., GF=Ground Floor, B1=Basement 1)'
      },
      {
        fieldName: '[Type]',
        exampleValue: 'M3',
        description: 'Information type (e.g., M3=Model, DR=Drawing, SP=Specification, SC=Schedule)'
      },
      {
        fieldName: '[Role]',
        exampleValue: 'ARC',
        description: 'Discipline or role responsible for the content'
      },
      {
        fieldName: '[Number]',
        exampleValue: '0001',
        description: 'Sequential number for the deliverable'
      },
      {
        fieldName: '[Revision]',
        exampleValue: 'P01',
        description: 'Revision status (e.g., P01=First Issue, C01=First Construction Issue)'
      }
    ],
    namingPattern: '<p><strong>Pattern:</strong> [Project Code]-[Originator]-[Volume/System]-[Level/Location]-[Type]-[Role]-[Number]-[Revision]</p><p><strong>Example:</strong> <code>PRJ001-ARC-XX-GF-M3-ARC-0001-P01.rvt</code></p>',
    deliverableAttributes: [
      {
        attributeName: 'File Format',
        exampleValue: '.rvt, .dwg, .pdf, .ifc',
        description: 'Acceptable file formats for each deliverable type'
      },
      {
        attributeName: 'Classification System',
        exampleValue: 'Uniclass 2015',
        description: 'Classification framework for organizing information'
      },
      {
        attributeName: 'Level of Information Need',
        exampleValue: 'LOD 300',
        description: 'Required level of detail/information for the deliverable'
      },
      {
        attributeName: 'Security Classification',
        exampleValue: 'Confidential',
        description: 'Information security level (e.g., Public, Internal, Confidential)'
      },
      {
        attributeName: 'Suitability Code',
        exampleValue: 'S2 - Suitable for Information',
        description: 'Document status/suitability per ISO 19650'
      },
      {
        attributeName: 'Revision Code',
        exampleValue: 'P01',
        description: 'Revision code indicating version and status: P=First Production (P01-P99), C=Construction (C01-C99), A=As-Built (A01-A99), S=Spatial Coordination (S1-S4), D=Developed Design (D1-D9)'
      }
    ]
  };

  // Initialize with default values if the value is empty or missing namingFields
  useEffect(() => {
    if (field && field.name && onChange) {
      if (!value || !value.namingFields || value.namingFields.length === 0) {
        onChange(field.name, defaultValue);
      }
    }
  }, []); // Run only once on mount

  // Safety check (after all hooks)
  if (!field) {
    return <div className="text-red-600">Error: Field configuration is missing</div>;
  }

  const { name } = field;

  // Handle different value types
  let currentValue = defaultValue;
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    currentValue = {
      overview: value.overview || defaultValue.overview,
      namingFields: value.namingFields || defaultValue.namingFields,
      namingPattern: value.namingPattern || defaultValue.namingPattern,
      deliverableAttributes: value.deliverableAttributes || defaultValue.deliverableAttributes
    };
  }

  // Handle overview change
  const handleOverviewChange = (newValue) => {
    onChange(name, {
      ...currentValue,
      overview: newValue
    });
  };

  // Handle naming pattern change
  const handlePatternChange = (newValue) => {
    onChange(name, {
      ...currentValue,
      namingPattern: newValue
    });
  };

  // Add new naming field
  const addNamingField = () => {
    onChange(name, {
      ...currentValue,
      namingFields: [
        ...currentValue.namingFields,
        { fieldName: '', exampleValue: '', description: '' }
      ]
    });
  };

  // Update naming field
  const updateNamingField = (index, key, value) => {
    const updatedFields = [...currentValue.namingFields];
    updatedFields[index] = { ...updatedFields[index], [key]: value };
    onChange(name, {
      ...currentValue,
      namingFields: updatedFields
    });
  };

  // Remove naming field
  const removeNamingField = (index) => {
    onChange(name, {
      ...currentValue,
      namingFields: currentValue.namingFields.filter((_, i) => i !== index)
    });
  };

  // Add new deliverable attribute
  const addAttribute = () => {
    onChange(name, {
      ...currentValue,
      deliverableAttributes: [
        ...currentValue.deliverableAttributes,
        { attributeName: '', exampleValue: '', description: '' }
      ]
    });
  };

  // Update deliverable attribute
  const updateAttribute = (index, key, value) => {
    const updatedAttrs = [...currentValue.deliverableAttributes];
    updatedAttrs[index] = { ...updatedAttrs[index], [key]: value };
    onChange(name, {
      ...currentValue,
      deliverableAttributes: updatedAttrs
    });
  };

  // Remove deliverable attribute
  const removeAttribute = (index) => {
    onChange(name, {
      ...currentValue,
      deliverableAttributes: currentValue.deliverableAttributes.filter((_, i) => i !== index)
    });
  };


  return (
    <div className="space-y-4">
      {/* Field Header */}
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
              Naming and Folder Structure Standards
            </h4>
            <p className="text-sm text-blue-800">
              Define standardized naming conventions and folder structure to ensure consistency, 
              traceability, and efficient information management per ISO 19650-2.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 9.2.1 Overview Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <FieldHeader
            fieldName="namingConventions_overview"
            label="Overview"
            number="9.2.1"
            required={false}
            asSectionHeader={true}
          />
          <p className="text-sm text-gray-600 mb-3">General approach to naming conventions</p>
          <TipTapEditor
            id="naming-overview"
            value={currentValue.overview || ''}
            onChange={handleOverviewChange}
            placeholder="Describe the overall approach to file naming and structure..."
            minHeight="80px"
            autoSaveKey="naming-overview"
            fieldName="namingOverview"
          />
        </div>

        {/* 9.2.2 Naming Convention Fields Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <FieldHeader
            fieldName="namingConventions_fields"
            label="Naming Convention Fields"
            number="9.2.2"
            required={false}
            asSectionHeader={true}
          />
          <p className="text-sm text-gray-600 mb-3">Define each component of the file naming pattern</p>
          <div className="space-y-3">
            {currentValue.namingFields.map((field, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <h5 className="font-medium text-gray-700">Field {index + 1}</h5>
                  <button
                    type="button"
                    onClick={() => removeNamingField(index)}
                    disabled={disabled}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Field Name
                    </label>
                    <BaseTextInput
                      type="text"
                      value={field.fieldName}
                      onChange={(e) => updateNamingField(index, 'fieldName', e.target.value)}
                      disabled={disabled}
                      placeholder="e.g., Project Code"
                      className="px-3 py-2 border-gray-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Example Value
                    </label>
                    <BaseTextInput
                      type="text"
                      value={field.exampleValue}
                      onChange={(e) => updateNamingField(index, 'exampleValue', e.target.value)}
                      disabled={disabled}
                      placeholder="e.g., PRJ001"
                      className="px-3 py-2 border-gray-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Description
                    </label>
                    <BaseTextInput
                      type="text"
                      value={field.description}
                      onChange={(e) => updateNamingField(index, 'description', e.target.value)}
                      disabled={disabled}
                      placeholder="e.g., Unique project identifier"
                      className="px-3 py-2 border-gray-300 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addNamingField}
              disabled={disabled}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Naming Field</span>
            </button>
          </div>
        </div>

        {/* 9.2.3 Naming Pattern Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <FieldHeader
            fieldName="namingConventions_pattern"
            label="Naming Pattern & Example"
            number="9.2.3"
            required={false}
            asSectionHeader={true}
          />
          <p className="text-sm text-gray-600 mb-3">Complete pattern and example filename</p>
          <NamingPatternVisualizer namingFields={currentValue.namingFields} />
        </div>

        {/* 9.2.4 Deliverable Attributes Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <FieldHeader
            fieldName="namingConventions_attributes"
            label="Deliverable Attributes"
            number="9.2.4"
            required={false}
            asSectionHeader={true}
          />
          <p className="text-sm text-gray-600 mb-3">Metadata and properties associated with deliverables</p>
          <div className="space-y-3">
            {currentValue.deliverableAttributes.map((attr, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <h5 className="font-medium text-gray-700">Attribute {index + 1}</h5>
                  <button
                    type="button"
                    onClick={() => removeAttribute(index)}
                    disabled={disabled}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Attribute Name
                    </label>
                    <BaseTextInput
                      type="text"
                      value={attr.attributeName}
                      onChange={(e) => updateAttribute(index, 'attributeName', e.target.value)}
                      disabled={disabled}
                      placeholder="e.g., File Format"
                      className="px-3 py-2 border-gray-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Example Value
                    </label>
                    <BaseTextInput
                      type="text"
                      value={attr.exampleValue}
                      onChange={(e) => updateAttribute(index, 'exampleValue', e.target.value)}
                      disabled={disabled}
                      placeholder="e.g., .rvt, .dwg, .pdf"
                      className="px-3 py-2 border-gray-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Description
                    </label>
                    <BaseTextInput
                      type="text"
                      value={attr.description}
                      onChange={(e) => updateAttribute(index, 'description', e.target.value)}
                      disabled={disabled}
                      placeholder="e.g., Acceptable file formats"
                      className="px-3 py-2 border-gray-300 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addAttribute}
              disabled={disabled}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Deliverable Attribute</span>
            </button>

            {/* Deliverable Attributes Visualizer */}
            {currentValue.deliverableAttributes && currentValue.deliverableAttributes.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <DeliverableAttributesVisualizer deliverableAttributes={currentValue.deliverableAttributes} />
              </div>
            )}
          </div>
        </div>
      </div>

      <FieldError error={error} />
    </div>
  );
};

export default NamingConventionBuilder;
