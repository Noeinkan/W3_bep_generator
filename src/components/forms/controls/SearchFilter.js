import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { getNodeTypeOptions } from '../../../utils/nodeTypes';
import BaseTextInput from '../base/BaseTextInput';

const SearchFilter = ({
  searchTerm,
  onSearchChange,
  selectedTypes,
  onTypeFilterChange,
  onClearFilters,
  matchingNodes,
  onNavigateToNode
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const nodeTypes = getNodeTypeOptions();

  const handleTypeToggle = (typeValue) => {
    const newSelectedTypes = selectedTypes.includes(typeValue)
      ? selectedTypes.filter(t => t !== typeValue)
      : [...selectedTypes, typeValue];
    onTypeFilterChange(newSelectedTypes);
  };

  const hasActiveFilters = searchTerm || selectedTypes.length > 0;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center space-x-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <BaseTextInput
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10 py-2 border-gray-300 text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg border ${
            showFilters || selectedTypes.length > 0
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
          title="Filter by type"
        >
          <Filter className="w-4 h-4" />
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
          >
            Clear
          </button>
        )}

        {/* Results Count */}
        {searchTerm && (
          <span className="text-sm text-gray-500">
            {matchingNodes.length} result{matchingNodes.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Type Filters */}
      {showFilters && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Filter by type:</h4>
          <div className="flex flex-wrap gap-2">
            {nodeTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => handleTypeToggle(type.value)}
                className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm border ${
                  selectedTypes.includes(type.value)
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: type.color }}
                />
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchTerm && matchingNodes.length > 0 && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Results:</h4>
          <div className="space-y-1">
            {matchingNodes.map((node) => (
              <button
                key={node.id}
                onClick={() => onNavigateToNode(node.id)}
                className="w-full text-left px-2 py-1 text-sm text-gray-600 hover:bg-white hover:text-gray-900 rounded flex items-center space-x-2"
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getNodeTypeOptions().find(t => t.value === node.type)?.color || '#6B7280' }}
                />
                <span className="truncate">{node.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;