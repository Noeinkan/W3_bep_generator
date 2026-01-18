import React from 'react';
import { Plus, Table2, Edit, Trash2 } from 'lucide-react';

const IMActivitiesView = ({ activities, loading, onCreateNew, onRefresh }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading IM Activities...</p>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Table2 className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No IM Activities Yet</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Create your first Information Management Activity matrix based on ISO 19650-2 Annex A.
        </p>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create First IM Activity Matrix
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Information Management Activities</h2>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          New IM Activity
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {activity.activityName || activity.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Project: {activity.projectId || 'N/A'} • Phase: {activity.phase || 'All Phases'}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-500">
                    Responsible: {activity.responsible || 'Not assigned'}
                  </span>
                  <span className="text-gray-500">
                    Accountable: {activity.accountable || 'Not assigned'}
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

export default IMActivitiesView;
