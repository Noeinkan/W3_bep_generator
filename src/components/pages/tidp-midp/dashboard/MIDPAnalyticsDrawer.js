import React, { useState, useMemo } from 'react';
import {
  X,
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

// Safe date parsing for sorting
const safeParseDateForSort = (dateValue) => {
  if (!dateValue) return new Date('9999-12-31');
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return new Date('9999-12-31');
    return date;
  } catch {
    return new Date('9999-12-31');
  }
};

// Helper to parse time strings to hours
function parseTimeToHours(timeString) {
  if (!timeString) return 0;
  const str = timeString.toString().toLowerCase();
  if (str.includes('week')) return parseFloat(str) * 40;
  if (str.includes('day')) return parseFloat(str) * 8;
  if (str.includes('hour')) return parseFloat(str);
  return 0;
}

const MIDPAnalyticsDrawer = ({
  isOpen,
  onClose,
  midps,
  onRefreshMIDP,
  onDownloadCSV
}) => {
  const [expandedMilestones, setExpandedMilestones] = useState({});

  // Get the most recent MIDP
  const activeMidp = midps.length > 0 ? midps[midps.length - 1] : null;

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
        const dateA = safeParseDateForSort(a.dueDate);
        const dateB = safeParseDateForSort(b.dueDate);
        return dateA - dateB;
      });
    });

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
    return 'bg-slate-100 text-gray-800';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel - slides from right */}
      <div className="absolute right-0 top-0 h-full w-full max-w-6xl bg-white shadow-2xl overflow-auto animate-slide-in-right">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {activeMidp?.projectName || 'Master Information Delivery Plan'}
              </h2>
              <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                <span>Version: {activeMidp?.version || '1.0'}</span>
                <span>Updated: {safeFormatDate(activeMidp?.updatedAt)}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${activeMidp?.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-gray-800'}`}>
                  {activeMidp?.status || 'Active'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onRefreshMIDP}
                className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border-2 border-blue-200 p-5">
              <div className="flex items-center">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-slate-900">{summaryStats.totalTidps}</p>
                  <p className="text-sm text-slate-600">TIDPs Included</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border-2 border-purple-200 p-5">
              <div className="flex items-center">
                <div className="p-3 bg-purple-50 rounded-xl">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-slate-900">{summaryStats.totalDeliverables}</p>
                  <p className="text-sm text-slate-600">Total Deliverables</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border-2 border-orange-200 p-5">
              <div className="flex items-center">
                <div className="p-3 bg-orange-50 rounded-xl">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-slate-900">{summaryStats.distinctMilestones}</p>
                  <p className="text-sm text-slate-600">Milestones</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border-2 border-green-200 p-5">
              <div className="flex items-center">
                <div className="p-3 bg-green-50 rounded-xl">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-slate-900">{summaryStats.totalHours.toLocaleString()}</p>
                  <p className="text-sm text-slate-600">Estimated Hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Master Deliverables Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Master Deliverables Schedule</h3>
              <p className="text-sm text-slate-600 mt-1">All information containers grouped by milestone</p>
            </div>

            <div className="overflow-x-auto">
              {Object.keys(groupedContainers).length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No deliverables found in this MIDP.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Container ID</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Task Team</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Discipline</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Responsible</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">LOIN</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Format</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Due Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Est. Time</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
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
                            className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-b border-slate-300 cursor-pointer hover:bg-slate-100"
                            onClick={() => toggleMilestone(milestone)}
                          >
                            <td colSpan={10} className="px-4 py-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {isExpanded ? (
                                    <ChevronDown className="w-5 h-5 text-slate-500" />
                                  ) : (
                                    <ChevronRight className="w-5 h-5 text-slate-500" />
                                  )}
                                  <span className="font-bold text-slate-900">{milestone}</span>
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    {stats.count} deliverable{stats.count !== 1 ? 's' : ''}
                                  </span>
                                </div>
                                <span className="text-sm text-slate-600">
                                  {stats.hours.toLocaleString()} hrs estimated
                                </span>
                              </div>
                            </td>
                          </tr>

                          {/* Container Rows */}
                          {isExpanded && containers.map((container, idx) => (
                            <tr
                              key={container.id || idx}
                              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                            >
                              <td className="px-4 py-3 font-mono text-xs text-slate-600">{container.id?.slice(0, 8) || '-'}</td>
                              <td className="px-4 py-3 font-medium text-slate-900 max-w-xs truncate">{container.name || '-'}</td>
                              <td className="px-4 py-3 text-slate-700">{container.tidpSource?.teamName || '-'}</td>
                              <td className="px-4 py-3 text-slate-700 capitalize">{container.tidpSource?.discipline || '-'}</td>
                              <td className="px-4 py-3 text-slate-700">{container.author || '-'}</td>
                              <td className="px-4 py-3 text-slate-700">{container.loiLevel || '-'}</td>
                              <td className="px-4 py-3 text-slate-700">{container.format || '-'}</td>
                              <td className="px-4 py-3 text-slate-700">{safeFormatDate(container.dueDate, '-')}</td>
                              <td className="px-4 py-3 text-slate-700">{container.estimatedTime || '-'}</td>
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
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-slate-900">By Discipline</h3>
              </div>
              <div className="p-4">
                {Object.keys(disciplineBreakdown).length === 0 ? (
                  <p className="text-slate-500 text-center py-4">No discipline data available</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(disciplineBreakdown)
                      .sort((a, b) => b[1].count - a[1].count)
                      .map(([discipline, stats]) => (
                        <div key={discipline} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <span className="font-medium text-slate-900 capitalize">{discipline}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-slate-600">{stats.count} deliverable{stats.count !== 1 ? 's' : ''}</span>
                            <span className="font-semibold text-slate-900">{stats.hours.toLocaleString()} hrs</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* By Team */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">By Team</h3>
              </div>
              <div className="p-4">
                {Object.keys(teamBreakdown).length === 0 ? (
                  <p className="text-slate-500 text-center py-4">No team data available</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(teamBreakdown)
                      .sort((a, b) => b[1].count - a[1].count)
                      .map(([team, stats]) => (
                        <div key={team} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="font-medium text-slate-900">{team}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-slate-600">{stats.count} deliverable{stats.count !== 1 ? 's' : ''}</span>
                            <span className="font-semibold text-slate-900">{stats.hours.toLocaleString()} hrs</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MIDPAnalyticsDrawer;
