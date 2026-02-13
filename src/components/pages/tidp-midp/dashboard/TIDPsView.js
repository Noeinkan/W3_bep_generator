import React from 'react';
import { Plus, Download, Search, Users, Calendar } from 'lucide-react';

const TIDPsView = ({
  tidps,
  loading,
  searchTerm,
  onSearchChange,
  filterDiscipline,
  onFilterChange,
  filterStatus,
  onFilterStatusChange,
  filterMilestone,
  onFilterMilestoneChange,
  filterDateFrom,
  onFilterDateFromChange,
  filterDateTo,
  onFilterDateToChange,
  disciplines,
  statuses,
  milestones,
  onCreateNew,
  onDownloadTemplate,
  onViewDetails,
  onDownloadTidp
}) => {
  const filteredTidps = tidps.filter(tidp => {
    const matchesSearch = !searchTerm ||
      tidp.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tidp.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tidp.discipline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tidp.leader?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tidp.company?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDiscipline = filterDiscipline === 'all' || tidp.discipline === filterDiscipline;

    const matchesStatus = !filterStatus || filterStatus === 'all' || tidp.status === filterStatus;

    const matchesMilestone = !filterMilestone || filterMilestone === 'all' || tidp.containers?.some(c => {
      const m = c.Milestone || c.deliveryMilestone || c['Delivery Milestone'];
      return m === filterMilestone;
    });

    let matchesDateRange = true;
    if (filterDateFrom || filterDateTo) {
      const containerDates = tidp.containers?.map(c => c['Due Date'] || c.dueDate).filter(Boolean) || [];
      if (containerDates.length > 0) {
        const from = filterDateFrom ? new Date(filterDateFrom) : new Date('1900-01-01');
        const to = filterDateTo ? new Date(filterDateTo) : new Date('9999-12-31');
        matchesDateRange = containerDates.some(d => {
          const date = new Date(d);
          return !isNaN(date.getTime()) && date >= from && date <= to;
        });
      }
    }

    return matchesSearch && matchesDiscipline && matchesStatus && matchesMilestone && matchesDateRange;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Task Information Delivery Plans</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {filteredTidps.length} of {tidps.length} TIDP{tidps.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="p-5 space-y-6">
      {/* Filters and Search */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Search TIDPs</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by team name, description..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                aria-label="Search TIDPs"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-sm transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Discipline</label>
              <select
                value={filterDiscipline}
                onChange={(e) => onFilterChange(e.target.value)}
                className="border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-sm min-w-40 transition-all duration-200"
              >
                <option value="all">All Disciplines</option>
                {disciplines.map(discipline => (
                  <option key={discipline} value={discipline}>{discipline}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
              <select
                value={filterStatus || 'all'}
                onChange={(e) => onFilterStatusChange?.(e.target.value)}
                className="border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-sm min-w-32 transition-all duration-200"
              >
                <option value="all">All Statuses</option>
                {(statuses || []).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Milestone</label>
              <select
                value={filterMilestone || 'all'}
                onChange={(e) => onFilterMilestoneChange?.(e.target.value)}
                className="border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-sm min-w-36 transition-all duration-200"
              >
                <option value="all">All Milestones</option>
                {(milestones || []).map(milestone => (
                  <option key={milestone} value={milestone}>{milestone}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Due Date Range</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  value={filterDateFrom || ''}
                  onChange={(e) => onFilterDateFromChange?.(e.target.value)}
                  className="border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-sm transition-all duration-200"
                  aria-label="Due date from"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <input
                  type="date"
                  value={filterDateTo || ''}
                  onChange={(e) => onFilterDateToChange?.(e.target.value)}
                  className="border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-sm transition-all duration-200"
                  aria-label="Due date to"
                />
              </div>
            </div>

            <button
              onClick={onCreateNew}
              className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 hover:shadow-md transition-all duration-200"
              aria-label="Create new TIDP"
            >
              <Plus className="w-4 h-4 mr-2" />
              New TIDP
            </button>

            <button
              onClick={onDownloadTemplate}
              className="inline-flex items-center px-4 py-2.5 border border-purple-300 rounded-lg shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 hover:border-purple-400 transition-all duration-200"
              title="Download CSV template"
            >
              <Download className="w-4 h-4 mr-2" />
              Template
            </button>
          </div>
        </div>
      </div>

      {/* TIDPs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-slate-200 rounded-full w-16"></div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1 h-10 bg-slate-200 rounded-lg"></div>
                <div className="h-10 w-10 bg-slate-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTidps.map((tidp, index) => (
            <div
              key={tidp.id || index}
              role="button"
              tabIndex="0"
              aria-label={`Open details for ${tidp.teamName || `TIDP ${index + 1}`}`}
              onClick={() => onViewDetails(tidp.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onViewDetails(tidp.id); }}
              className="group bg-white rounded-xl border-2 border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
                      {tidp.teamName || `TIDP ${index + 1}`}
                    </h3>
                    <p className="text-sm text-slate-600 font-medium capitalize">{tidp.discipline}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 ml-2 shrink-0">
                    {tidp.status || 'Draft'}
                  </span>
                </div>

                <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {tidp.description || tidp.responsibilities || 'Task information delivery plan for team coordination.'}
                </p>

                <div className="space-y-2 mb-4 bg-slate-50 rounded-lg p-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Deliverables:</span>
                    <span className="font-semibold text-slate-900">{tidp.containers?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Team Leader:</span>
                    <span className="font-semibold text-slate-900 truncate ml-2">{tidp.leader || 'TBD'}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); onViewDetails(tidp.id); }}
                    className="flex-1 bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm"
                    aria-label={`Select TIDP ${tidp.teamName || index + 1}`}
                  >
                    Open
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDownloadTidp(tidp); }}
                    className="bg-slate-100 text-slate-600 p-2.5 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
                    title="Download TIDP as CSV"
                    aria-label={`Download ${tidp.teamName || `TIDP ${index + 1}`}`}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredTidps.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No TIDPs found</h3>
          <p className="text-slate-600 text-sm mb-6 max-w-sm mx-auto">
            Try adjusting your search or create a new TIDP to get started.
          </p>
          <button
            onClick={onCreateNew}
            className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-all duration-200"
            aria-label="Create new TIDP"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New TIDP
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default TIDPsView;
