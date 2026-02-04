import React, { useState, useMemo } from 'react';
import {
  Plus,
  Download,
  RefreshCw,
  Calendar,
  Users,
  FileText,
  Clock,
  ChevronDown,
  ChevronRight,
  Building2,
  Layers
} from 'lucide-react';

const MIDPsView = ({
  midps,
  loading,
  searchTerm,
  onAutoGenerate,
  onViewDetails,
  onViewEvolution,
  onDownloadMidp
}) => {
  // For the reporting dashboard, we show the most recent MIDP
  const activeMidp = midps.length > 0 ? midps[midps.length - 1] : null;

  // Collapsible milestone groups state
  const [expandedMilestones, setExpandedMilestones] = useState({});

  // Toggle milestone group expansion
  const toggleMilestone = (milestone) => {
    setExpandedMilestones(prev => ({
      ...prev,
      [milestone]: !prev[milestone]
    }));
  };

  // Process aggregated data for the master table
  const { groupedContainers, milestoneStats, disciplineBreakdown, teamBreakdown, summaryStats } = useMemo(() => {
    if (!activeMidp?.aggregatedData) {
      return {
        groupedContainers: {},
        milestoneStats: {},
        disciplineBreakdown: {},
        teamBreakdown: {},
        summaryStats: { totalTidps: 0, totalDeliverables: 0, distinctMilestones: 0, totalHours: 0 }
      };
    }

    const containers = activeMidp.aggregatedData.containers || [];
    const grouped = {};
    const milestones = {};
    const disciplines = {};
    const teams = {};

    containers.forEach(container => {
      const milestone = container.milestone || 'Unassigned';

      // Group by milestone
      if (!grouped[milestone]) {
        grouped[milestone] = [];
        milestones[milestone] = { count: 0, hours: 0 };
      }
      grouped[milestone].push(container);
      milestones[milestone].count++;

      // Parse estimated time to hours
      const hours = parseTimeToHours(container.estimatedTime);
      milestones[milestone].hours += hours;

      // Discipline breakdown
      const discipline = container.tidpSource?.discipline || 'Unknown';
      if (!disciplines[discipline]) {
        disciplines[discipline] = { count: 0, hours: 0 };
      }
      disciplines[discipline].count++;
      disciplines[discipline].hours += hours;

      // Team breakdown
      const team = container.tidpSource?.teamName || 'Unknown';
      if (!teams[team]) {
        teams[team] = { count: 0, hours: 0 };
      }
      teams[team].count++;
      teams[team].hours += hours;
    });

    // Sort containers within each milestone by due date
    Object.keys(grouped).forEach(milestone => {
      grouped[milestone].sort((a, b) => {
        const dateA = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
        const dateB = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
        return dateA - dateB;
      });
    });

    // Initialize all milestones as expanded by default
    const milestoneKeys = Object.keys(grouped);

    return {
      groupedContainers: grouped,
      milestoneStats: milestones,
      disciplineBreakdown: disciplines,
      teamBreakdown: teams,
      summaryStats: {
        totalTidps: activeMidp.includedTIDPs?.length || 0,
        totalDeliverables: containers.length,
        distinctMilestones: milestoneKeys.length,
        totalHours: activeMidp.aggregatedData.totalEstimatedHours || 0
      }
    };
  }, [activeMidp]);

  // Helper to parse time strings to hours
  function parseTimeToHours(timeString) {
    if (!timeString) return 0;
    const str = timeString.toString().toLowerCase();
    if (str.includes('week')) return parseFloat(str) * 40;
    if (str.includes('day')) return parseFloat(str) * 8;
    if (str.includes('hour')) return parseFloat(str);
    return 0;
  }

  // Export to CSV function
  const handleExportCSV = () => {
    if (!activeMidp) return;

    const containers = activeMidp.aggregatedData?.containers || [];
    const headers = [
      'Container ID',
      'Name',
      'Task Team',
      'Discipline',
      'Responsible Party',
      'LOIN',
      'Format',
      'Milestone',
      'Due Date',
      'Est. Time',
      'Status'
    ];

    const rows = containers.map(c => [
      c.id || '',
      c.name || '',
      c.tidpSource?.teamName || '',
      c.tidpSource?.discipline || '',
      c.author || '',
      c.loiLevel || '',
      c.format || '',
      c.milestone || '',
      c.dueDate || '',
      c.estimatedTime || '',
      c.status || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MIDP_${activeMidp.projectName || 'Export'}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower.includes('complete')) return 'bg-green-100 text-green-800';
    if (statusLower.includes('progress')) return 'bg-blue-100 text-blue-800';
    if (statusLower.includes('delay')) return 'bg-red-100 text-red-800';
    if (statusLower.includes('review')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  // STATE A: No MIDP exists
  if (!activeMidp && !loading) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-lg p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Master Information Delivery Plan</h2>
              <p className="text-gray-700 text-lg font-medium">ISO 19650 compliant project-wide deliverables report</p>
            </div>
          </div>
        </div>

        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No MIDP Generated Yet</h3>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            Generate your Master Information Delivery Plan by compiling all TIDPs into a unified project view.
          </p>
          <button
            onClick={onAutoGenerate}
            className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold text-lg rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-lg"
          >
            <Plus className="w-6 h-6 mr-3" />
            Generate MIDP
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border-2 border-gray-200 p-6 animate-pulse">
              <div className="h-12 bg-gray-200 rounded mb-3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // STATE B: MIDP exists - Reporting Dashboard
  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{activeMidp.projectName || 'Master Information Delivery Plan'}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <span className="font-medium">Version:</span> {activeMidp.version || '1.0'}
              </span>
              <span className="flex items-center gap-1">
                <span className="font-medium">Updated:</span> {new Date(activeMidp.updatedAt).toLocaleDateString()}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${activeMidp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {activeMidp.status || 'Active'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onAutoGenerate}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh MIDP
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border-2 border-blue-200 hover:border-blue-400 shadow-md hover:shadow-xl transition-all duration-300 p-6">
          <div className="flex items-center">
            <div className="p-4 bg-blue-50 rounded-xl shadow-sm">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-5">
              <p className="text-3xl font-bold text-gray-900">{summaryStats.totalTidps}</p>
              <p className="text-base text-gray-600 font-semibold mt-1">TIDPs Included</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-purple-200 hover:border-purple-400 shadow-md hover:shadow-xl transition-all duration-300 p-6">
          <div className="flex items-center">
            <div className="p-4 bg-purple-50 rounded-xl shadow-sm">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <div className="ml-5">
              <p className="text-3xl font-bold text-gray-900">{summaryStats.totalDeliverables}</p>
              <p className="text-base text-gray-600 font-semibold mt-1">Total Deliverables</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-orange-200 hover:border-orange-400 shadow-md hover:shadow-xl transition-all duration-300 p-6">
          <div className="flex items-center">
            <div className="p-4 bg-orange-50 rounded-xl shadow-sm">
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
            <div className="ml-5">
              <p className="text-3xl font-bold text-gray-900">{summaryStats.distinctMilestones}</p>
              <p className="text-base text-gray-600 font-semibold mt-1">Milestones</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-green-200 hover:border-green-400 shadow-md hover:shadow-xl transition-all duration-300 p-6">
          <div className="flex items-center">
            <div className="p-4 bg-green-50 rounded-xl shadow-sm">
              <Clock className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-5">
              <p className="text-3xl font-bold text-gray-900">{summaryStats.totalHours.toLocaleString()}</p>
              <p className="text-base text-gray-600 font-semibold mt-1">Estimated Hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Master Deliverables Table */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Master Deliverables Schedule</h3>
          <p className="text-sm text-gray-600 mt-1">All information containers from all TIDPs, grouped by milestone</p>
        </div>

        <div className="overflow-x-auto">
          {Object.keys(groupedContainers).length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No deliverables found in this MIDP.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Container ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Task Team</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Discipline</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Responsible</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">LOIN</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Format</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Due Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Est. Time</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedContainers).map(([milestone, containers]) => {
                  const isExpanded = expandedMilestones[milestone] !== false; // Default to expanded
                  const stats = milestoneStats[milestone] || { count: 0, hours: 0 };

                  return (
                    <React.Fragment key={milestone}>
                      {/* Milestone Header Row */}
                      <tr
                        className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-b border-gray-300 cursor-pointer hover:bg-gray-100"
                        onClick={() => toggleMilestone(milestone)}
                      >
                        <td colSpan={10} className="px-4 py-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {isExpanded ? (
                                <ChevronDown className="w-5 h-5 text-gray-500" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-gray-500" />
                              )}
                              <span className="font-bold text-gray-900">{milestone}</span>
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {stats.count} deliverable{stats.count !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <span className="text-sm text-gray-600">
                              {stats.hours.toLocaleString()} hrs estimated
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* Container Rows */}
                      {isExpanded && containers.map((container, idx) => (
                        <tr
                          key={container.id || idx}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 font-mono text-xs text-gray-600">{container.id?.slice(0, 8) || '-'}</td>
                          <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{container.name || '-'}</td>
                          <td className="px-4 py-3 text-gray-700">{container.tidpSource?.teamName || '-'}</td>
                          <td className="px-4 py-3 text-gray-700 capitalize">{container.tidpSource?.discipline || '-'}</td>
                          <td className="px-4 py-3 text-gray-700">{container.author || '-'}</td>
                          <td className="px-4 py-3 text-gray-700">{container.loiLevel || '-'}</td>
                          <td className="px-4 py-3 text-gray-700">{container.format || '-'}</td>
                          <td className="px-4 py-3 text-gray-700">
                            {container.dueDate ? new Date(container.dueDate).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-4 py-3 text-gray-700">{container.estimatedTime || '-'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(container.status)}`}>
                              {container.status || 'Planned'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Discipline */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">By Discipline</h3>
          </div>
          <div className="p-4">
            {Object.keys(disciplineBreakdown).length === 0 ? (
              <p className="text-gray-500 text-center py-4">No discipline data available</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(disciplineBreakdown)
                  .sort((a, b) => b[1].count - a[1].count)
                  .map(([discipline, stats]) => (
                    <div key={discipline} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="font-medium text-gray-900 capitalize">{discipline}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">{stats.count} deliverable{stats.count !== 1 ? 's' : ''}</span>
                        <span className="font-semibold text-gray-900">{stats.hours.toLocaleString()} hrs</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* By Team */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">By Team</h3>
          </div>
          <div className="p-4">
            {Object.keys(teamBreakdown).length === 0 ? (
              <p className="text-gray-500 text-center py-4">No team data available</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(teamBreakdown)
                  .sort((a, b) => b[1].count - a[1].count)
                  .map(([team, stats]) => (
                    <div key={team} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="font-medium text-gray-900">{team}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">{stats.count} deliverable{stats.count !== 1 ? 's' : ''}</span>
                        <span className="font-semibold text-gray-900">{stats.hours.toLocaleString()} hrs</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MIDPsView;
