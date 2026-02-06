import React from 'react';
import { Search, X, SortAsc, SortDesc } from 'lucide-react';
import Select from '../../common/Select';

const SearchAndFilters = ({
  searchQuery,
  onSearchQueryChange,
  showFilters,
  onToggleFilters,
  selectedBepTypeFilter,
  onBepTypeFilterChange,
  dateFilter,
  onDateFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  hasActiveFilters,
  onClearAllFilters,
  draftStats,
  totalDrafts
}) => {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Search by draft name or project..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchQueryChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Filter Controls */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* BEP Type Filter */}
            <Select
              label="BEP Type"
              value={selectedBepTypeFilter}
              onChange={(e) => onBepTypeFilterChange(e.target.value)}
              placeholder={null}
              options={[
                { value: 'all', label: 'All types' },
                { value: 'pre-appointment', label: 'Pre-Appointment' },
                { value: 'post-appointment', label: 'Post-Appointment' },
              ]}
            />

            {/* Date Filter */}
            <Select
              label="Modified"
              value={dateFilter}
              onChange={(e) => onDateFilterChange(e.target.value)}
              placeholder={null}
              options={[
                { value: 'all', label: 'All dates' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'Last week' },
                { value: 'month', label: 'Last month' },
              ]}
            />

            {/* Sort Controls */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort by
              </label>
              <div className="flex space-x-2">
                <Select
                  value={sortBy}
                  onChange={(e) => onSortByChange(e.target.value)}
                  placeholder={null}
                  className="flex-1"
                  options={[
                    { value: 'lastModified', label: 'Modified date' },
                    { value: 'name', label: 'Draft name' },
                    { value: 'projectName', label: 'Project name' },
                    { value: 'bepType', label: 'BEP type' },
                  ]}
                />
                <button
                  onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                >
                  {sortOrder === 'asc' ? (
                    <SortAsc className="w-4 h-4" />
                  ) : (
                    <SortDesc className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {hasActiveFilters && (
                <span>
                  Active filters: {draftStats} of {totalDrafts} drafts
                </span>
              )}
            </div>
            {hasActiveFilters && (
              <button
                onClick={onClearAllFilters}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filter Summary */}
      {hasActiveFilters && !showFilters && (
        <div className="flex items-center justify-between text-sm text-gray-600 bg-blue-50 rounded-lg p-3">
          <span>
            Active filters: {draftStats} of {totalDrafts} drafts shown
          </span>
          <button
            onClick={onClearAllFilters}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;