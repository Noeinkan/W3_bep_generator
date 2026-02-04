import React from 'react';
import { Users, Plus } from 'lucide-react';

// Safe date formatting helper
const safeFormatDate = (dateValue, fallback = 'N/A') => {
  if (!dateValue) return fallback;
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return fallback;
    return date.toLocaleDateString();
  } catch {
    return fallback;
  }
};

const RecentTIDPs = ({ tidps, onCreateNew }) => {
  if (tidps.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-5">Recent TIDPs</h2>
        <div className="text-center py-10">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7 text-slate-400" />
          </div>
          <p className="text-base font-semibold text-slate-900 mb-1">No TIDPs created yet</p>
          <p className="text-slate-500 text-sm mb-5">Get started by creating your first Team Information Delivery Plan</p>
          <button
            onClick={onCreateNew}
            className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create your first TIDP
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-5">Recent TIDPs</h2>
      <div className="space-y-3">
        {tidps.slice(0, 5).map((tidp, index) => (
          <div
            key={tidp.id || index}
            className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md hover:bg-blue-50/30 transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">{tidp.teamName || `TIDP ${index + 1}`}</h3>
                <p className="text-slate-500 text-xs capitalize">{tidp.discipline} • {tidp.containers?.length || 0} deliverables</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-slate-700">
                {safeFormatDate(tidp.updatedAt)}
              </div>
              <div className="text-xs text-slate-400">Last updated</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTIDPs;
