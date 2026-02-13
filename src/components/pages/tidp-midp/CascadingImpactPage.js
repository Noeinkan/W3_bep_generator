import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, ChevronDown, ChevronRight, Zap, Clock, Users } from 'lucide-react';
import ApiService from '../../../services/apiService';
import toast from 'react-hot-toast';

const SEVERITY_COLORS = {
  Critical: 'bg-red-100 text-red-800 border-red-200',
  High: 'bg-orange-100 text-orange-800 border-orange-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Low: 'bg-green-100 text-green-800 border-green-200'
};

const CascadingImpactPage = () => {
  const { midpId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedImpacts, setExpandedImpacts] = useState(new Set());

  useEffect(() => {
    loadCascadingImpact();
  }, [midpId]);

  const loadCascadingImpact = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getMIDPCascadingImpact(midpId);
      setData(response.data);
    } catch (error) {
      console.error('Failed to load cascading impact:', error);
      toast.error('Failed to load cascading impact analysis');
    } finally {
      setLoading(false);
    }
  };

  const toggleImpact = (index) => {
    setExpandedImpacts(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const impacts = data?.impacts || [];
  const overallSeverity = data?.overallSeverity || 'Low';

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
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center shadow-md">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Cascading Impact Analysis</h1>
              <p className="text-sm text-gray-600">
                {data?.lateContainerCount || 0} late deliverable{data?.lateContainerCount !== 1 ? 's' : ''} affecting {data?.totalAffected || 0} downstream container{data?.totalAffected !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Late Deliverables</p>
            <p className="text-2xl font-bold text-red-700">{data?.lateContainerCount || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Affected Downstream</p>
            <p className="text-2xl font-bold text-orange-700">{data?.totalAffected || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Overall Severity</p>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${SEVERITY_COLORS[overallSeverity]}`}>
              {overallSeverity}
            </span>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Analysis Date</p>
            <p className="text-sm font-medium text-gray-700">{data?.analysisDate ? new Date(data.analysisDate).toLocaleDateString() : '-'}</p>
          </div>
        </div>

        {/* No late deliverables */}
        {impacts.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-green-100 p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Late Deliverables</h3>
            <p className="text-sm text-gray-500">All containers are on schedule. No cascading impact detected.</p>
          </div>
        )}

        {/* Impact Cards */}
        {impacts.map((impact, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Late Container Header */}
            <button
              onClick={() => toggleImpact(index)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {expandedImpacts.has(index) ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{impact.lateContainer.name}</h3>
                  <p className="text-sm text-gray-500">
                    {impact.lateContainer.tidpName} &middot; {impact.lateContainer.discipline} &middot;
                    <span className="text-red-600 font-medium ml-1">{impact.lateContainer.delayDays} days overdue</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${SEVERITY_COLORS[impact.severity]}`}>
                  {impact.severity}
                </span>
                <span className="text-sm text-gray-500">{impact.affectedContainers} affected</span>
              </div>
            </button>

            {expandedImpacts.has(index) && (
              <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
                {/* Cascade Tree */}
                {impact.cascade.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Downstream Impact Chain</h4>
                    <div className="space-y-2">
                      {impact.cascade.map((item, i) => (
                        <div key={i} className="flex items-center space-x-3 ml-4 p-2 rounded-lg bg-gray-50">
                          <div className="flex items-center space-x-1 text-gray-400">
                            {[...Array(item.depth)].map((_, d) => (
                              <span key={d} className="w-2 h-px bg-gray-300 inline-block" />
                            ))}
                            <span className="text-gray-300">→</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-gray-900">{item.containerName}</span>
                            <span className="text-xs text-gray-500 ml-2">({item.tidpName})</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 flex-shrink-0">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-0.5" />
                              {item.propagatedDelay}d delay
                            </span>
                            <span className="flex items-center">
                              <Users className="w-3 h-3 mr-0.5" />
                              {item.discipline}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Affected Disciplines */}
                {impact.affectedDisciplines?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Affected Disciplines</h4>
                    <div className="flex flex-wrap gap-2">
                      {impact.affectedDisciplines.map((disc, i) => (
                        <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {disc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recovery Suggestions */}
                {impact.suggestions?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recovery Actions</h4>
                    <ul className="space-y-1.5">
                      {impact.suggestions.map((suggestion, i) => (
                        <li key={i} className="flex items-start space-x-2 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                          <span className="text-gray-700">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CascadingImpactPage;
