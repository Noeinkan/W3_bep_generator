import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, BarChart3, Lightbulb } from 'lucide-react';
import ApiService from '../../../services/apiService';
import toast from 'react-hot-toast';

const ResourcePlanPage = () => {
  const { midpId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResourcePlan();
  }, [midpId]);

  const loadResourcePlan = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getMIDPResourcePlan(midpId);
      setData(response.data);
    } catch (error) {
      console.error('Failed to load resource plan:', error);
      toast.error('Failed to load resource plan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const plan = data?.resourcePlan || data || {};
  const byDiscipline = plan.byDiscipline || {};
  const byTimePeriod = plan.byTimePeriod || {};
  const peak = plan.peakUtilization || {};
  const recommendations = plan.recommendations || [];

  // Find max hours for bar scaling
  const disciplineEntries = Object.entries(byDiscipline);
  const maxHours = Math.max(...disciplineEntries.map(([, d]) => d.totalHours), 1);

  const periodEntries = Object.entries(byTimePeriod).sort(([a], [b]) => a.localeCompare(b));
  const maxPeriodHours = Math.max(...periodEntries.map(([, d]) => d.totalHours), 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/tidp-midp')}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Resource Plan</h1>
              <p className="text-sm text-gray-600">Discipline allocation & utilization</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Peak Utilization Card */}
        {peak.period && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-amber-600" />
              <div>
                <h3 className="font-semibold text-amber-900">Peak Utilization</h3>
                <p className="text-sm text-amber-700">
                  {peak.period}: {peak.hours} hours across {peak.disciplines} discipline{peak.disciplines !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Discipline Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hours by Discipline</h2>
          {disciplineEntries.length === 0 ? (
            <p className="text-gray-500 text-sm">No discipline data available</p>
          ) : (
            <div className="space-y-4">
              {disciplineEntries.map(([discipline, info]) => (
                <div key={discipline}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">{discipline}</span>
                    <span className="text-sm text-gray-500">
                      {info.totalHours}h / {info.teams} team{info.teams !== 1 ? 's' : ''} / {info.containers} container{info.containers !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${Math.max((info.totalHours / maxHours) * 100, 2)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Timeline Heatmap */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hours by Period</h2>
          {periodEntries.length === 0 ? (
            <p className="text-gray-500 text-sm">No period data available</p>
          ) : (
            <div className="space-y-3">
              {periodEntries.map(([period, info]) => {
                const intensity = info.totalHours / maxPeriodHours;
                const bgColor = intensity > 0.8 ? 'from-red-500 to-red-600'
                  : intensity > 0.5 ? 'from-amber-500 to-orange-500'
                  : 'from-emerald-500 to-teal-500';

                return (
                  <div key={period}>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-sm font-medium text-gray-700">{period}</span>
                      <span className="text-sm text-gray-500">
                        {info.totalHours}h / {info.containers} containers / {(info.disciplines || []).length} disciplines
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full bg-gradient-to-r ${bgColor} transition-all duration-500`}
                        style={{ width: `${Math.max((info.totalHours / maxPeriodHours) * 100, 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span>Recommendations</span>
            </h2>
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <div key={i} className={`p-4 rounded-lg border ${
                  rec.priority === 'High' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{rec.message}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      rec.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>{rec.priority}</span>
                  </div>
                  <p className="text-sm text-gray-600">{rec.action}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcePlanPage;
