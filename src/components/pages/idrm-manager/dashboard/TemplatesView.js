import React from 'react';
import { Plus, CheckCircle, Edit, Trash2, Copy } from 'lucide-react';

const TemplatesView = ({ templates, loading, onCreateNew, onRefresh }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Templates...</p>
        </div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Templates Yet</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Create reusable IDRM templates for common project types to accelerate setup.
        </p>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create First Template
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">IDRM Templates</h2>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {template.name || template.templateName}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {template.description || 'No description'}
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                {template.itemsCount || 0} items
              </span>
              <span className="text-gray-500">
                {template.projectType || 'General'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesView;
