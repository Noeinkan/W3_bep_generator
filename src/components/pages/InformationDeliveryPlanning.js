import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, FileText, Users, Table2 } from 'lucide-react';
import ResponsibilityMatrixManager from '../responsibility-matrix/ResponsibilityMatrixManager';

const InformationDeliveryPlanning = ({ formData, updateFormData, errors, bepType }) => {
  const navigate = useNavigate();
  const [showMatrixManager, setShowMatrixManager] = useState(false);

  const BasicFormInterface = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Section 6.3 - TIDPs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            6.3 Task Information Delivery Plans (TIDPs)
          </label>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Task Information Delivery Plans Management</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Create and manage TIDPs for each project team/discipline. Define deliverables, schedules, and responsibilities for task teams.
                </p>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      sessionStorage.setItem('bep-return-url', window.location.pathname + window.location.search);
                      window.location.href = '/tidp-editor';
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create New TIDP</span>
                  </button>
                  <button
                    onClick={() => {
                      sessionStorage.setItem('bep-return-url', window.location.pathname + window.location.search);
                      window.location.href = '/tidp-midp';
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 font-medium"
                  >
                    <Users className="w-5 h-5" />
                    <span>Open TIDP/MIDP Manager</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6.5 - MIDP Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            6.1.1 Master Information Delivery Plan (MIDP) <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.midpDescription || ''}
            onChange={(e) => updateFormData('midpDescription', e.target.value)}
            className={`w-full p-3 border rounded-lg resize-none ${errors.midpDescription ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            rows={4}
            placeholder="The MIDP establishes a structured schedule for information delivery aligned with RIBA Plan of Work 2020 stages. Key deliverables include: Stage 3 coordinated federated models by Month 8, Stage 4 construction-ready models with full MEP coordination by Month 14..."
          />
          {errors.midpDescription && (
            <p className="text-red-500 text-sm mt-1">{errors.midpDescription}</p>
          )}
        </div>

        {/* Responsibility Matrix Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            6.5 Information Deliverables Responsibility Matrix (IDRM)
          </label>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Table2 className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Comprehensive Responsibility Matrix Management</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Manage both IM Activities (ISO 19650-2 Annex A RACI assignments) and Information Deliverables matrices.
                  Create reusable templates, track responsibilities, and auto-sync with TIDP containers.
                </p>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowMatrixManager(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 font-medium"
                  >
                    <Table2 className="w-5 h-5" />
                    <span>Inline Matrix Manager</span>
                  </button>
                  <button
                    onClick={() => {
                      sessionStorage.setItem('bep-return-url', window.location.pathname + window.location.search);
                      window.location.href = '/idrm-manager';
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 font-medium"
                  >
                    <FileText className="w-5 h-5" />
                    <span>Open IDRM Manager</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  <strong>Tip:</strong> Use the IDRM Manager for centralized matrix management across all projects, or use the inline manager for quick edits specific to this BEP.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            6.1.2 Key Information Delivery Milestones <span className="text-red-500">*</span>
          </label>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Stage/Phase</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Milestone Description</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Deliverables</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {(formData.keyMilestones || []).map((milestone, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={milestone.stage || ''}
                        onChange={(e) => {
                          const newMilestones = [...(formData.keyMilestones || [])];
                          newMilestones[index] = { ...milestone, stage: e.target.value };
                          updateFormData('keyMilestones', newMilestones);
                        }}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Stage 3"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={milestone.description || ''}
                        onChange={(e) => {
                          const newMilestones = [...(formData.keyMilestones || [])];
                          newMilestones[index] = { ...milestone, description: e.target.value };
                          updateFormData('keyMilestones', newMilestones);
                        }}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Coordinated Federated Models"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={milestone.deliverables || ''}
                        onChange={(e) => {
                          const newMilestones = [...(formData.keyMilestones || [])];
                          newMilestones[index] = { ...milestone, deliverables: e.target.value };
                          updateFormData('keyMilestones', newMilestones);
                        }}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Architecture, Structure, MEP Models"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="date"
                        value={milestone.dueDate || ''}
                        onChange={(e) => {
                          const newMilestones = [...(formData.keyMilestones || [])];
                          newMilestones[index] = { ...milestone, dueDate: e.target.value };
                          updateFormData('keyMilestones', newMilestones);
                        }}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              onClick={() => {
                const newMilestones = [...(formData.keyMilestones || []), { stage: '', description: '', deliverables: '', dueDate: '' }];
                updateFormData('keyMilestones', newMilestones);
              }}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Milestone</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Initialize default milestones if none exist
  useEffect(() => {
    if (!formData.keyMilestones || formData.keyMilestones.length === 0) {
      updateFormData('keyMilestones', [
        { stage: 'Stage 3', description: 'Spatial Coordination', deliverables: 'Federated Models', dueDate: '' },
        { stage: 'Stage 4', description: 'Technical Design', deliverables: 'Construction Models', dueDate: '' },
        { stage: 'Stage 5', description: 'Manufacturing & Construction', deliverables: 'As-Built Models', dueDate: '' },
        { stage: 'Stage 6', description: 'Handover', deliverables: 'COBie Data', dueDate: '' }
      ]);
    }
  }, [formData.keyMilestones, updateFormData]);

  return (
    <div className="space-y-6">
      {/* Mark page URI for debugging and testing */}
      <div data-page-uri="/information-delivery-planning" />
      <div className="flex items-center space-x-3 mb-6">
        <Calendar className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Information Delivery Planning</h2>
      </div>

      {showMatrixManager ? (
        <ResponsibilityMatrixManager
          projectId={formData.projectName || 'current'}
          onClose={() => setShowMatrixManager(false)}
        />
      ) : (
        <BasicFormInterface />
      )}
    </div>
  );
};

export default InformationDeliveryPlanning;