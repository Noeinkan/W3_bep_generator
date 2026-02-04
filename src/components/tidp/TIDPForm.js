import React from 'react';
import { Plus } from 'lucide-react';

const TIDPForm = ({ tidpForm, onTidpFormChange, onSubmit, onCancel, createLoading = false, isEditing = false, tidpId = null }) => {
  const addContainer = () => {
    const newContainer = {
      id: `IC-${Date.now()}`,
      'Information Container ID': `IC-${Date.now()}`,
      'Information Container Name/Title': '',
      'Description': '',
      'Task Name': '',
      'Responsible Task Team/Party': '',
      'Author': '',
      'Dependencies/Predecessors': '',
      'Level of Information Need (LOIN)': 'LOD 200',
      'Classification': '',
      'Estimated Production Time': '1 day',
      'Delivery Milestone': '',
      'Due Date': '',
      'Format/Type': 'IFC 4.0',
      'Purpose': '',
      'Acceptance Criteria': '',
      'Review and Authorization Process': 'S1 - Work in progress',
      'Status': 'Planned'
    };
    onTidpFormChange({
      ...tidpForm,
      containers: [...tidpForm.containers, newContainer]
    });
  };

  const updateContainer = (index, field, value) => {
    const updatedContainers = tidpForm.containers.map((container, i) =>
      i === index ? { ...container, [field]: value } : container
    );
    onTidpFormChange({ ...tidpForm, containers: updatedContainers });
  };

  const removeContainer = (index) => {
    if (tidpForm.containers.length > 1) {
      const updatedContainers = tidpForm.containers.filter((_, i) => i !== index);
      onTidpFormChange({ ...tidpForm, containers: updatedContainers });
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow px-4 py-3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit TIDP' : 'Create New TIDP'}</h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-lg"
          >
            ✕
          </button>
        </div>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Task Team</label>
              <input
                value={tidpForm.taskTeam}
                onChange={(e) => onTidpFormChange({ ...tidpForm, taskTeam: e.target.value })}
                type="text"
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                placeholder="Architecture Team"
                data-testid="create-tidp-form-taskTeam"
                aria-label="TIDP Task Team"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Discipline</label>
              <select
                value={tidpForm.discipline}
                onChange={(e) => onTidpFormChange({ ...tidpForm, discipline: e.target.value })}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                data-testid="create-tidp-form-discipline"
                aria-label="TIDP Discipline"
              >
                <option value="">Select Discipline</option>
                <option value="architecture">Architecture</option>
                <option value="structural">Structural Engineering</option>
                <option value="mep">MEP Engineering</option>
                <option value="civil">Civil Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Team Leader</label>
              <input
                value={tidpForm.teamLeader}
                onChange={(e) => onTidpFormChange({ ...tidpForm, teamLeader: e.target.value })}
                type="text"
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                placeholder="John Smith"
                data-testid="create-tidp-form-teamLeader"
                aria-label="TIDP Team Leader"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <input
                value={tidpForm.description}
                onChange={(e) => onTidpFormChange({ ...tidpForm, description: e.target.value })}
                type="text"
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                placeholder="TIDP description"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-semibold text-gray-900">Information Containers</h3>
              <button
                type="button"
                onClick={addContainer}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Container</span>
              </button>
            </div>

            <div className="max-h-96 overflow-auto border border-gray-300 rounded-lg">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 border-b border-gray-300 sticky top-0 z-10">
                  <tr>
                    <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 border-r border-gray-300 min-w-[120px]">Information Container ID</th>
                    <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 border-r border-gray-300 min-w-[140px]">Information Container Name/Title</th>
                    <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 border-r border-gray-300 min-w-[140px]">Description</th>
                    <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 border-r border-gray-300 min-w-[120px]">Task Name</th>
                    <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 border-r border-gray-300 min-w-[140px]">Responsible Task Team/Party</th>
                    <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 border-r border-gray-300 min-w-[100px]">Author</th>
                    <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 border-r border-gray-300 min-w-[140px]">Dependencies/Predecessors</th>
                    <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 border-r border-gray-300 min-w-[140px]">Level of Information Need (LOIN)</th>
                    <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 border-r border-gray-300 min-w-[120px]">Classification</th>
                    <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 border-r border-gray-300 min-w-[120px]">Estimated Production Time</th>
                    <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 border-r border-gray-300 min-w-[120px]">Delivery Milestone</th>
                    <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 border-r border-gray-300 min-w-[100px]">Due Date</th>
                    <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 border-r border-gray-300 min-w-[100px]">Format/Type</th>
                    <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 border-r border-gray-300 min-w-[120px]">Purpose</th>
                    <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 border-r border-gray-300 min-w-[140px]">Acceptance Criteria</th>
                    <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 border-r border-gray-300 min-w-[140px]">Review and Authorization Process</th>
                    <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 border-r border-gray-300 min-w-[80px]">Status</th>
                    <th className="px-1 py-1 text-center text-xs font-semibold text-gray-700 min-w-[80px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tidpForm.containers.map((container, index) => (
                    <tr key={container.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-1 py-1 border-r border-gray-300">
                        <input
                          type="text"
                          value={container['Information Container ID']}
                          onChange={(e) => updateContainer(index, 'Information Container ID', e.target.value)}
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded"
                          placeholder="IC-ARCH-001"
                        />
                      </td>
                      <td className="px-1 py-1 border-r border-gray-300">
                        <input
                          type="text"
                          value={container['Information Container Name/Title']}
                          onChange={(e) => updateContainer(index, 'Information Container Name/Title', e.target.value)}
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded"
                          placeholder="Federated Architectural Model"
                        />
                      </td>
                      <td className="px-1 py-1 border-r border-gray-300">
                        <input
                          type="text"
                          value={container['Description']}
                          onChange={(e) => updateContainer(index, 'Description', e.target.value)}
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded"
                          placeholder="Complete architectural model including all building elements"
                        />
                      </td>
                      <td className="px-1 py-1 border-r border-gray-300">
                        <input
                          type="text"
                          value={container['Task Name']}
                          onChange={(e) => updateContainer(index, 'Task Name', e.target.value)}
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded"
                          placeholder="Architectural Modeling"
                        />
                      </td>
                      <td className="px-1 py-1 border-r border-gray-300">
                        <input
                          type="text"
                          value={container['Responsible Task Team/Party']}
                          onChange={(e) => updateContainer(index, 'Responsible Task Team/Party', e.target.value)}
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded"
                          placeholder="Architecture Team"
                        />
                      </td>
                      <td className="px-1 py-1 border-r border-gray-300">
                        <input
                          type="text"
                          value={container['Author']}
                          onChange={(e) => updateContainer(index, 'Author', e.target.value)}
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded"
                          placeholder="John Smith"
                        />
                      </td>
                      <td className="px-1 py-1 border-r border-gray-300">
                        <input
                          type="text"
                          value={container['Dependencies/Predecessors']}
                          onChange={(e) => updateContainer(index, 'Dependencies/Predecessors', e.target.value)}
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded"
                          placeholder="Site Survey, Structural Grid"
                        />
                      </td>
                      <td className="px-1 py-1 border-r border-gray-300">
                        <select
                          value={container['Level of Information Need (LOIN)']}
                          onChange={(e) => updateContainer(index, 'Level of Information Need (LOIN)', e.target.value)}
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded"
                        >
                          <option value="LOD 100">LOD 100</option>
                          <option value="LOD 200">LOD 200</option>
                          <option value="LOD 300">LOD 300</option>
                          <option value="LOD 350">LOD 350</option>
                          <option value="LOD 400">LOD 400</option>
                          <option value="LOD 500">LOD 500</option>
                          <option value="As-Built">As-Built</option>
                        </select>
                      </td>
                      <td className="px-1 py-1 border-r border-gray-300">
                        <select
                          value={container['Classification']}
                          onChange={(e) => updateContainer(index, 'Classification', e.target.value)}
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded"
                        >
                          <option value="">Select Classification</option>
                          <option value="Pr_20_30_60 - Building model">Pr_20_30_60 - Building model</option>
                          <option value="Pr_20_30_70 - Space model">Pr_20_30_70 - Space model</option>
                          <option value="Pr_20_30_80 - Zone model">Pr_20_30_80 - Zone model</option>
                          <option value="Pr_30_10 - Element">Pr_30_10 - Element</option>
                          <option value="Pr_30_20 - Component">Pr_30_20 - Component</option>
                          <option value="Pr_30_30 - Assembly">Pr_30_30 - Assembly</option>
                        </select>
                      </td>
                      <td className="px-1 py-1 border-r border-gray-300">
                        <input
                          type="text"
                          value={container['Estimated Production Time']}
                          onChange={(e) => updateContainer(index, 'Estimated Production Time', e.target.value)}
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded"
                          placeholder="3 days"
                        />
                      </td>
                      <td className="px-1 py-1 border-r border-gray-300">
                        <select
                          value={container['Delivery Milestone']}
                          onChange={(e) => updateContainer(index, 'Delivery Milestone', e.target.value)}
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded"
                        >
                          <option value="">Select Milestone</option>
                          <option value="Stage 1 - Preparation">Stage 1 - Preparation</option>
                          <option value="Stage 2 - Concept Design">Stage 2 - Concept Design</option>
                          <option value="Stage 3 - Developed Design">Stage 3 - Developed Design</option>
                          <option value="Stage 4 - Technical Design">Stage 4 - Technical Design</option>
                          <option value="Stage 5 - Manufacturing & Construction">Stage 5 - Manufacturing & Construction</option>
                          <option value="Stage 6 - Handover & Close Out">Stage 6 - Handover & Close Out</option>
                          <option value="Stage 7 - In Use">Stage 7 - In Use</option>
                        </select>
                      </td>
                      <td className="px-1 py-1 border-r border-gray-300">
                        <input
                          type="date"
                          value={container['Due Date']}
                          onChange={(e) => updateContainer(index, 'Due Date', e.target.value)}
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-1 py-1 border-r border-gray-300">
                        <select
                          value={container['Format/Type']}
                          onChange={(e) => updateContainer(index, 'Format/Type', e.target.value)}
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded"
                        >
                          <option value="IFC 2x3">IFC 2x3</option>
                          <option value="IFC 4.0">IFC 4.0</option>
                          <option value="DWG">DWG</option>
                          <option value="PDF">PDF</option>
                          <option value="XLSX">XLSX</option>
                          <option value="DOCX">DOCX</option>
                          <option value="RVT">RVT</option>
                          <option value="NWD">NWD</option>
                        </select>
                      </td>
                      <td className="px-1 py-1 border-r border-gray-300">
                        <input
                          type="text"
                          value={container['Purpose']}
                          onChange={(e) => updateContainer(index, 'Purpose', e.target.value)}
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded"
                          placeholder="Coordination and visualization"
                        />
                      </td>
                      <td className="px-1 py-1 border-r border-gray-300">
                        <input
                          type="text"
                          value={container['Acceptance Criteria']}
                          onChange={(e) => updateContainer(index, 'Acceptance Criteria', e.target.value)}
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded"
                          placeholder="Model validation passed, no clashes"
                        />
                      </td>
                      <td className="px-1 py-1 border-r border-gray-300">
                        <select
                          value={container['Review and Authorization Process']}
                          onChange={(e) => updateContainer(index, 'Review and Authorization Process', e.target.value)}
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded"
                        >
                          <option value="S1 - Work in progress">S1 - Work in progress</option>
                          <option value="S2 - Shared for coordination">S2 - Shared for coordination</option>
                          <option value="S3 - Issue for comment">S3 - Issue for comment</option>
                          <option value="S4 - Issue for approval">S4 - Issue for approval</option>
                          <option value="S5 - Issue for construction">S5 - Issue for construction</option>
                        </select>
                      </td>
                      <td className="px-1 py-1 border-r border-gray-300">
                        <select
                          value={container['Status']}
                          onChange={(e) => updateContainer(index, 'Status', e.target.value)}
                          className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded"
                        >
                          <option value="Planned">Planned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Approved">Approved</option>
                          <option value="Completed">Completed</option>
                          <option value="Delayed">Delayed</option>
                        </select>
                      </td>
                      <td className="px-1 py-1 text-center">
                        <button
                          type="button"
                          onClick={() => removeContainer(index)}
                          className="text-red-600 hover:text-red-800 text-xs"
                          disabled={tidpForm.containers.length === 1}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              id="create-tidp-form"
              data-testid="create-tidp-form"
              aria-label={isEditing ? "Update TIDP (form submit)" : "Create TIDP (form submit)"}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm disabled:opacity-60"
              disabled={createLoading}
            >
              {createLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update TIDP' : 'Create TIDP')}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TIDPForm;