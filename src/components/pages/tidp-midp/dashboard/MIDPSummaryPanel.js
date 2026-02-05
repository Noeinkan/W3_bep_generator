import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Users,
  FileText,
  Clock,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Download,
  ExternalLink,
  Plus,
  Layers
} from 'lucide-react';

const MIDPSummaryPanel = ({
  midps,
  loading,
  onRefreshMIDP,
  onDownloadCSV,
  onViewFullAnalytics
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Get the most recent MIDP
  const activeMidp = midps.length > 0 ? midps[midps.length - 1] : null;

  // Process summary stats from MIDP data
  const { summaryStats, disciplineBreakdown, nextMilestone } = useMemo(() => {
    if (!activeMidp?.aggregatedData) {
      return {
        summaryStats: { totalTidps: 0, totalDeliverables: 0, distinctMilestones: 0, totalHours: 0 },
        disciplineBreakdown: [],
        nextMilestone: null
      };
    }

    const containers = activeMidp.aggregatedData.containers || [];
    const disciplines = {};
    const milestones = {};

    containers.forEach(container => {
      // Discipline breakdown
      const discipline = container.tidpSource?.discipline || 'Unknown';
      if (!disciplines[discipline]) {
        disciplines[discipline] = 0;
      }
      disciplines[discipline]++;

      // Milestone tracking
      const milestone = container.milestone || 'Unassigned';
      if (!milestones[milestone]) {
        milestones[milestone] = { count: 0, dueDate: null };
      }
      milestones[milestone].count++;

      // Track earliest due date for milestone
      if (container.dueDate) {
        const dueDate = new Date(container.dueDate);
        if (!isNaN(dueDate.getTime())) {
          if (!milestones[milestone].dueDate || dueDate < milestones[milestone].dueDate) {
            milestones[milestone].dueDate = dueDate;
          }
        }
      }
    });

    // Find next upcoming milestone
    const now = new Date();
    let nextMilestoneData = null;
    Object.entries(milestones).forEach(([name, data]) => {
      if (data.dueDate && data.dueDate > now) {
        if (!nextMilestoneData || data.dueDate < nextMilestoneData.dueDate) {
          nextMilestoneData = { name, ...data };
        }
      }
    });

    // Convert discipline breakdown to sorted array
    const disciplineArray = Object.entries(disciplines)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Top 5 disciplines

    return {
      summaryStats: {
        totalTidps: activeMidp.includedTIDPs?.length || 0,
        totalDeliverables: containers.length,
        distinctMilestones: Object.keys(milestones).length,
        totalHours: activeMidp.aggregatedData.totalEstimatedHours || 0
      },
      disciplineBreakdown: disciplineArray,
      nextMilestone: nextMilestoneData
    };
  }, [activeMidp]);

  // Format date safely
  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return date.toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  // No MIDP exists - show compact generate prompt
  if (!activeMidp && !loading) {
    return (
      <div className="bg-gradient-to-r from-slate-50 to-green-50 rounded-xl border-2 border-dashed border-slate-300 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-xl">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">No MIDP Generated</h3>
              <p className="text-sm text-slate-600">
                Generate a Master Information Delivery Plan from your TIDPs
              </p>
            </div>
          </div>
          <button
            onClick={onRefreshMIDP}
            className="inline-flex items-center px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Generate MIDP
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header with expand/collapse */}
      <div
        className="px-5 py-4 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-500" />
          )}
          <h2 className="text-lg font-bold text-slate-900">
            Master Information Delivery Plan
          </h2>
          <span className="px-2.5 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
            {activeMidp.status || 'Active'}
          </span>
        </div>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onRefreshMIDP}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            title="Refresh MIDP"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Refresh
          </button>
          <button
            onClick={onDownloadCSV}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            title="Export CSV"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export
          </button>
          <button
            onClick={onViewFullAnalytics}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Full Analytics
            <ExternalLink className="w-4 h-4 ml-1.5" />
          </button>
        </div>
      </div>

      {/* Collapsible content */}
      {isExpanded && (
        <div className="p-5 space-y-5">
          {/* Quick stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xl font-bold text-slate-900">{summaryStats.totalTidps}</p>
                <p className="text-xs text-slate-600">TIDPs</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-xl font-bold text-slate-900">{summaryStats.totalDeliverables}</p>
                <p className="text-xs text-slate-600">Deliverables</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-xl font-bold text-slate-900">{summaryStats.distinctMilestones}</p>
                <p className="text-xs text-slate-600">Milestones</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-xl font-bold text-slate-900">{summaryStats.totalHours.toLocaleString()}</p>
                <p className="text-xs text-slate-600">Est. Hours</p>
              </div>
            </div>
          </div>

          {/* Discipline breakdown + Next milestone */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Discipline chips */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-slate-700">By Discipline</span>
              </div>
              {disciplineBreakdown.length === 0 ? (
                <p className="text-sm text-slate-500">No discipline data</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {disciplineBreakdown.map(([discipline, count]) => (
                    <span
                      key={discipline}
                      className="inline-flex items-center px-2.5 py-1 bg-white border border-slate-200 rounded-full text-sm"
                    >
                      <span className="font-medium text-slate-900 capitalize">{discipline}</span>
                      <span className="ml-1.5 text-slate-500">({count})</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Next milestone */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-slate-700">Next Milestone</span>
              </div>
              {nextMilestone ? (
                <div>
                  <p className="font-medium text-slate-900">{nextMilestone.name}</p>
                  <p className="text-sm text-slate-600">
                    {formatDate(nextMilestone.dueDate)} · {nextMilestone.count} deliverable{nextMilestone.count !== 1 ? 's' : ''}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-slate-500">No upcoming milestones</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MIDPSummaryPanel;
