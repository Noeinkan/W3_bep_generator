import React from 'react';
import FieldHeader from '../base/FieldHeader';
import FieldError from '../base/FieldError';
import BaseTextInput from '../base/BaseTextInput';
import { Plus } from 'lucide-react';

const MilestonesTableField = ({ field, value, onChange, error }) => {
  const { name, label, number, required } = field;
  const milestones = value || [];

  const addMilestone = () => {
    onChange(name, [...milestones, { stage: '', description: '', deliverables: '', dueDate: '', gate: '', programmeVersion: '' }]);
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
        <table className="min-w-full border border-ui-border rounded-lg overflow-hidden bep-table bg-ui-surface">
          <thead className="bg-ui-muted border-b border-ui-border">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-ui-text border-b border-ui-border">Stage/Phase</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-ui-text border-b border-ui-border">Milestone Description</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-ui-text border-b border-ui-border">Deliverables</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-ui-text border-b border-ui-border">Due Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-ui-text border-b border-ui-border">Gate</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-ui-text border-b border-ui-border">Programme version</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-ui-text border-b border-ui-border">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-ui-surface">
            {milestones.map((milestone, index) => (
              <tr key={index} className="border-b border-ui-border hover:bg-ui-muted/60 transition-colors">
                <td className="px-4 py-2">
                  <BaseTextInput
                    type="text"
                    value={milestone.stage || ''}
                    onChange={(e) => updateMilestone(index, 'stage', e.target.value)}
                    className="p-2 border-ui-border rounded-md bg-ui-surface text-ui-text placeholder:text-ui-text-muted focus-visible:ring-2 focus-visible:ring-ui-primary/30"
                    placeholder="Stage 3"
                  />
                </td>
                <td className="px-4 py-2">
                  <BaseTextInput
                    type="text"
                    value={milestone.description || ''}
                    onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                    className="p-2 border-ui-border rounded-md bg-ui-surface text-ui-text placeholder:text-ui-text-muted focus-visible:ring-2 focus-visible:ring-ui-primary/30"
                    placeholder="Coordinated Federated Models"
                  />
                </td>
                <td className="px-4 py-2">
                  <BaseTextInput
                    type="text"
                    value={milestone.deliverables || ''}
                    onChange={(e) => updateMilestone(index, 'deliverables', e.target.value)}
                    className="p-2 border-ui-border rounded-md bg-ui-surface text-ui-text placeholder:text-ui-text-muted focus-visible:ring-2 focus-visible:ring-ui-primary/30"
                    placeholder="Architecture, Structure, MEP Models"
                  />
                </td>
                <td className="px-4 py-2">
                  <BaseTextInput
                    type="date"
                    value={milestone.dueDate || ''}
                    onChange={(e) => updateMilestone(index, 'dueDate', e.target.value)}
                    className="p-2 border-ui-border rounded-md bg-ui-surface text-ui-text focus-visible:ring-2 focus-visible:ring-ui-primary/30"
                  />
                </td>
                <td className="px-4 py-2">
                  <BaseTextInput
                    type="text"
                    value={milestone.gate || ''}
                    onChange={(e) => updateMilestone(index, 'gate', e.target.value)}
                    className="p-2 border-ui-border rounded-md bg-ui-surface text-ui-text placeholder:text-ui-text-muted focus-visible:ring-2 focus-visible:ring-ui-primary/30"
                    placeholder="Y/N"
                  />
                </td>
                <td className="px-4 py-2">
                  <BaseTextInput
                    type="text"
                    value={milestone.programmeVersion || ''}
                    onChange={(e) => updateMilestone(index, 'programmeVersion', e.target.value)}
                    className="p-2 border-ui-border rounded-md bg-ui-surface text-ui-text placeholder:text-ui-text-muted focus-visible:ring-2 focus-visible:ring-ui-primary/30"
                    placeholder="e.g. v1.0"
                  />
                </td>
                <td className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => removeMilestone(index)}
                    className="inline-flex items-center px-2.5 py-1.5 rounded-md border border-ui-border bg-ui-surface text-red-600 hover:bg-ui-muted hover:text-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-primary/30"
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
          className="mt-3 px-4 py-2 rounded-md border border-ui-border bg-ui-surface text-ui-text-muted hover:bg-ui-muted hover:text-ui-text transition-colors flex items-center space-x-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-primary/30"
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
