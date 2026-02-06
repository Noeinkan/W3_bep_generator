import React from 'react';
import { Info, ExternalLink } from 'lucide-react';
import EditableTable from '../base/EditableTable';
import TipTapEditor from '../editors/TipTapEditor';
import FieldError from '../base/FieldError';

/**
 * RACIReferenceBuilder
 * Component for Section 4.8 RACI Responsibility Matrices subsection
 * 
 * This component doesn't duplicate the full RACI matrices (those are in sections 6.6 and 6.7)
 * Instead, it provides:
 * - Reference to the detailed matrices
 * - Key decision points extracted from those matrices
 * - Quick overview of critical accountabilities
 */
const RACIReferenceBuilder = ({ field, value = {}, onChange, error, disabled = false }) => {
  // Safety check
  if (!field) {
    return <div className="text-red-600">Error: Field configuration is missing</div>;
  }

  const { name } = field;

  // Initialize with default structure if empty
  const defaultValue = {
    referenceText: 'Detailed RACI (Responsible, Accountable, Consulted, Informed) matrices are defined in Section 6.6 (Information Deliverables Responsibility Matrix) and Section 6.7 (Information Management Activities Responsibility Matrix per ISO 19650-2 Annex A). These matrices establish clear accountability for all information production, coordination, approval, and delivery activities throughout the project lifecycle.',
    keyDecisionPoints: {
      columns: ['Key Decision/Activity', 'Accountable', 'Responsible', 'Consulted', 'Informed'],
      data: [
        {
          'Key Decision/Activity': 'Model Federation Approval',
          'Accountable': 'Lead BIM Coordinator',
          'Responsible': 'Discipline Coordinators',
          'Consulted': 'Design Team',
          'Informed': 'Client'
        },
        {
          'Key Decision/Activity': 'Design Coordination Sign-off',
          'Accountable': 'Design Manager',
          'Responsible': 'Discipline Leads',
          'Consulted': 'BIM Manager',
          'Informed': 'Project Director'
        },
        {
          'Key Decision/Activity': 'Information Delivery Approval',
          'Accountable': 'Information Manager',
          'Responsible': 'BIM Manager',
          'Consulted': 'Task Team',
          'Informed': 'Client Representative'
        },
        {
          'Key Decision/Activity': 'CDE Access Management',
          'Accountable': 'Information Manager',
          'Responsible': 'CDE Administrator',
          'Consulted': 'IT Security',
          'Informed': 'Project Team'
        },
        {
          'Key Decision/Activity': 'Change Request Processing',
          'Accountable': 'Project Manager',
          'Responsible': 'Design Manager',
          'Consulted': 'Affected Disciplines',
          'Informed': 'All Stakeholders'
        }
      ]
    }
  };

  // Handle different value types (could be undefined, empty string, or object)
  let currentValue = defaultValue;
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    currentValue = {
      referenceText: value.referenceText || '',
      keyDecisionPoints: value.keyDecisionPoints || defaultValue.keyDecisionPoints
    };
  }

  // Handle changes to the reference text
  const handleReferenceTextChange = (newText) => {
    onChange(name, {
      ...currentValue,
      referenceText: newText
    });
  };

  // Handle changes to key decision points table
  const handleKeyDecisionPointsChange = (fieldName, newData) => {
    onChange(name, {
      ...currentValue,
      keyDecisionPoints: {
        ...currentValue.keyDecisionPoints,
        data: newData
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-1">
              RACI Responsibility Matrices Reference
            </h4>
            <p className="text-sm text-blue-800 mb-2">
              Full RACI (Responsible, Accountable, Consulted, Informed) matrices are detailed in:
            </p>
            <ul className="text-sm text-blue-800 space-y-1 ml-4">
              <li className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                <span><strong>Section 6.6:</strong> Information Deliverables Responsibility Matrix</span>
              </li>
              <li className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                <span><strong>Section 6.7:</strong> Information Management Activities Responsibility Matrix (ISO 19650-2 Annex A)</span>
              </li>
            </ul>
            <p className="text-sm text-blue-800 mt-2">
              Use this section to provide a summary reference and highlight key decision points.
            </p>
          </div>
        </div>
      </div>

      {/* Reference Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reference to Detailed Matrices
        </label>
        <TipTapEditor
          id="raci-reference-text"
          value={currentValue.referenceText || ''}
          onChange={handleReferenceTextChange}
          placeholder="Example: Detailed RACI matrices are defined in Section 6.6 (Information Deliverables) and Section 6.7 (Information Management Activities per ISO 19650-2 Annex A). These matrices establish clear accountability for all information production, coordination, approval, and delivery activities throughout the project lifecycle."
          minHeight="72px"
          autoSaveKey="raci-reference-text"
          fieldName="raciReferenceText"
          className=""
        />
      </div>

      {/* Key Decision Points Table */}
      <div>
        <div className="mb-2">
          <h4 className="text-sm font-medium text-gray-700 mb-1">
            Key Decision Points Summary
          </h4>
          <p className="text-xs text-gray-500">
            Extract and highlight critical decision points from the detailed matrices above. 
            Focus on high-impact activities like model approvals, design sign-offs, and information delivery.
          </p>
        </div>
        
        <EditableTable
          field={{
            name: 'keyDecisionPoints',
            label: 'Key Decision Points',
            columns: currentValue.keyDecisionPoints.columns
          }}
          value={currentValue.keyDecisionPoints.data || []}
          onChange={handleKeyDecisionPointsChange}
          error={null}
          disabled={disabled}
        />
        
        {/* Helper text */}
        <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-3 rounded border border-gray-200">
          <strong>Example entries:</strong>
          <ul className="mt-1 ml-4 space-y-1">
            <li>• Model Federation Approval → A: Lead BIM Coordinator, R: Discipline Coordinators, C: Design Team, I: Client</li>
            <li>• Design Coordination Sign-off → A: Design Manager, R: Discipline Leads, C: BIM Manager, I: Project Director</li>
            <li>• Information Delivery Approval → A: Information Manager, R: BIM Manager, C: Task Team, I: Client Representative</li>
          </ul>
        </div>
      </div>

      <FieldError error={error} />
    </div>
  );
};

export default RACIReferenceBuilder;
