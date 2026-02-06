import React from 'react';
import FieldHeader from '../base/FieldHeader';
import FieldError from '../base/FieldError';
import BaseTextInput from '../base/BaseTextInput';
import { Plus } from 'lucide-react';

const MilestonesTableField = ({ field, value, onChange, error }) => {
  const { name, label, number, required } = field;
  const milestones = value || [];

  const addMilestone = () => {
    onChange(name, [...milestones, { stage: '', description: '', deliverables: '', dueDate: '' }]);
  };

  const updateMilestone = (index, key, newValue) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [key]: newValue };
    onChange(name, updated);
  };

  const removeMilestone = (index) => {
    onChange(name, milestones.filter((_, i) => i !== index));
  };

  return (
    <div>
      <FieldHeader 
        fieldName={name}
        label={label}
        number={number}
        required={required}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Stage/Phase</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Milestone Description</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Deliverables</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Due Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {milestones.map((milestone, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">
                  <BaseTextInput
                    type="text"
                    value={milestone.stage || ''}
                    onChange={(e) => updateMilestone(index, 'stage', e.target.value)}
                    className="p-2 border-gray-300 rounded"
                    placeholder="Stage 3"
                  />
                </td>
                <td className="px-4 py-2">
                  <BaseTextInput
                    type="text"
                    value={milestone.description || ''}
                    onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                    className="p-2 border-gray-300 rounded"
                    placeholder="Coordinated Federated Models"
                  />
                </td>
                <td className="px-4 py-2">
                  <BaseTextInput
                    type="text"
                    value={milestone.deliverables || ''}
                    onChange={(e) => updateMilestone(index, 'deliverables', e.target.value)}
                    className="p-2 border-gray-300 rounded"
                    placeholder="Architecture, Structure, MEP Models"
                  />
                </td>
                <td className="px-4 py-2">
                  <BaseTextInput
                    type="date"
                    value={milestone.dueDate || ''}
                    onChange={(e) => updateMilestone(index, 'dueDate', e.target.value)}
                    className="p-2 border-gray-300 rounded"
                  />
                </td>
                <td className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => removeMilestone(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          onClick={addMilestone}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Milestone</span>
        </button>
      </div>
      <FieldError error={error} />
    </div>
  );
};

export default MilestonesTableField;
