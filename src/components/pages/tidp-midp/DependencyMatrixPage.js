import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, GitBranch, ChevronDown, ChevronRight, Zap } from 'lucide-react';
import ApiService from '../../../services/apiService';
import toast from 'react-hot-toast';

const DependencyMatrixPage = () => {
  const { midpId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedTeams, setExpandedTeams] = useState(new Set());

  useEffect(() => {
    loadDependencyMatrix();
  }, [midpId]);

  const loadDependencyMatrix = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getMIDPDependencyMatrix(midpId);
      setData(response.data);
    } catch (error) {
      console.error('Failed to load dependency matrix:', error);
      toast.error('Failed to load dependency matrix');
    } finally {
      setLoading(false);
    }
  };

  const toggleTeam = (teamName) => {
    setExpandedTeams(prev => {
      const next = new Set(prev);
      if (next.has(teamName)) next.delete(teamName);
      else next.add(teamName);
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

  const depMatrix = data?.dependencyMatrix || data || {};
  const matrix = depMatrix.matrix || [];
  const summary = depMatrix.summary || { totalDependencies: 0, criticalDependencies: 0, teamsInvolved: 0 };

  // Group dependencies by target TIDP
  const groupedByTarget = {};
  matrix.forEach(dep => {
    const targetTeam = dep.to?.tidpName || 'Unknown';
    if (!groupedByTarget[targetTeam]) {
      groupedByTarget[targetTeam] = [];
    }
    groupedByTarget[targetTeam].push(dep);
  });

  // Build unique team list for the grid header
  const allTeams = [...new Set(matrix.flatMap(d => [d.from?.tidpName, d.to?.tidpName]).filter(Boolean))];

  // Build a grid: rows = target teams, cols = source teams, cell = dependency count
  const gridData = {};
  allTeams.forEach(target => {
    gridData[target] = {};
    allTeams.forEach(source => {
      gridData[target][source] = 0;
    });
  });
  matrix.forEach(dep => {
    const source = dep.from?.tidpName;
    const target = dep.to?.tidpName;
    if (source && target && gridData[target]) {
      gridData[target][source] = (gridData[target][source] || 0) + 1;
    }
  });

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
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dependency Matrix</h1>
              <p className="text-sm text-gray-600">{summary.totalDependencies} dependencies across {summary.teamsInvolved} teams</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Dependencies</p>
            <p className="text-2xl font-bold text-gray-900">{summary.totalDependencies}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-cyan-100">
            <p className="text-sm text-cyan-600">Critical Path</p>
            <p className="text-2xl font-bold text-cyan-700">{summary.criticalDependencies}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
            <p className="text-sm text-blue-600">Teams Involved</p>
            <p className="text-2xl font-bold text-blue-700">{summary.teamsInvolved}</p>
          </div>
        </div>

        {/* Cross-Team Grid */}
        {allTeams.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-x-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cross-Team Dependency Grid</h2>
            <p className="text-xs text-gray-500 mb-3">Rows depend on columns. Cell value = number of container dependencies.</p>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 bg-gray-50 rounded-tl-lg">Depends On →</th>
                  {allTeams.map(team => (
                    <th key={team} className="px-3 py-2 text-center text-xs font-semibold text-gray-500 bg-gray-50 whitespace-nowrap">
                      {team}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allTeams.map(target => (
                  <tr key={target} className="border-t border-gray-100">
                    <td className="px-3 py-2 text-sm font-medium text-gray-700 whitespace-nowrap">{target}</td>
                    {allTeams.map(source => {
                      const count = gridData[target]?.[source] || 0;
                      const isSelf = target === source;
                      return (
                        <td key={source} className={`px-3 py-2 text-center text-sm ${isSelf ? 'bg-gray-50' : ''}`}>
                          {isSelf ? (
                            <span className="text-gray-300">-</span>
                          ) : count > 0 ? (
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                              count >= 3 ? 'bg-red-100 text-red-700' :
                              count >= 2 ? 'bg-amber-100 text-amber-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {count}
                            </span>
                          ) : (
                            <span className="text-gray-200">0</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Detailed Dependency List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Dependency Details</h2>
          </div>

          {matrix.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <GitBranch className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No dependencies found between containers</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {Object.entries(groupedByTarget).map(([teamName, deps]) => (
                <div key={teamName}>
                  <button
                    onClick={() => toggleTeam(teamName)}
                    className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      {expandedTeams.has(teamName) ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="font-medium text-gray-900">{teamName}</span>
                      <span className="text-xs text-gray-400">({deps.length} dependencies)</span>
                    </div>
                    {deps.some(d => d.criticalPath) && (
                      <span className="flex items-center space-x-1 text-xs text-amber-600">
                        <Zap className="w-3 h-3" />
                        <span>Critical Path</span>
                      </span>
                    )}
                  </button>

                  {expandedTeams.has(teamName) && (
                    <div className="px-5 pb-3 pl-11 space-y-2">
                      {deps.map((dep, i) => (
                        <div key={i} className={`flex items-center text-sm space-x-2 p-2 rounded-lg ${
                          dep.criticalPath ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50'
                        }`}>
                          <span className="text-gray-500">{dep.from?.containerName || dep.from?.containerId}</span>
                          <span className="text-gray-300">→</span>
                          <span className="text-gray-700 font-medium">{dep.to?.containerName || dep.to?.containerId}</span>
                          <span className="text-xs text-gray-400">({dep.from?.tidpName})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DependencyMatrixPage;
