import React from 'react';
import { Plus, FileText, Edit, Trash2, Calendar } from 'lucide-react';

const DeliverablesView = ({ deliverables, loading, onCreateNew, onRefresh }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Deliverables...</p>
        </div>
      </div>
    );
  }

  if (deliverables.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Deliverables Yet</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Create your first information deliverable with responsibilities, due dates, and LOIN requirements.
        </p>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create First Deliverable
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Information Deliverables</h2>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Deliverable
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {deliverables.map((deliverable) => (
          <div
            key={deliverable.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {deliverable.name || deliverable.deliverableName}
                  </h3>
                  {deliverable.isAutoPopulated && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                      Auto-synced
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {deliverable.description || 'No description'}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {deliverable.dueDate ? new Date(deliverable.dueDate).toLocaleDateString() : 'No due date'}
                  </span>
                  <span className="text-gray-500">
                    LOD: {deliverable.lod || 'Not specified'}
                  </span>
                  <span className="text-gray-500">
                    Format: {deliverable.format || 'Not specified'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliverablesView;
