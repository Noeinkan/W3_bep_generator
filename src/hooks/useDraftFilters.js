import { useState, useEffect, useMemo, useCallback } from 'react';
import { sanitizeText, formatDate } from '../utils/validationUtils';

export const useDraftFilters = (rawDrafts) => {
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedBepTypeFilter, setSelectedBepTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('lastModified');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter functions
  const filterDraftsBySearch = useCallback((drafts, query) => {
    if (!query.trim()) return drafts;

    const sanitizedQuery = sanitizeText(query).toLowerCase();
    return drafts.filter(draft => {
      const draftName = sanitizeText(draft.name).toLowerCase();
      const projectName = sanitizeText(draft.projectName || '').toLowerCase();

      return draftName.includes(sanitizedQuery) ||
             projectName.includes(sanitizedQuery);
    });
  }, []);

  const filterDraftsByBepType = useCallback((drafts, bepTypeFilter) => {
    if (bepTypeFilter === 'all') return drafts;
    return drafts.filter(draft => draft.bepType === bepTypeFilter);
  }, []);

  const filterDraftsByDate = useCallback((drafts, dateFilter) => {
    if (dateFilter === 'all') return drafts;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return drafts.filter(draft => {
      const draftDate = new Date(draft.lastModified);

      switch (dateFilter) {
        case 'today':
          return draftDate >= today;
        case 'week':
          return draftDate >= weekAgo;
        case 'month':
          return draftDate >= monthAgo;
        default:
          return true;
      }
    });
  }, []);

  const sortDrafts = useCallback((drafts, sortBy, sortOrder) => {
    return [...drafts].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = sanitizeText(a.name).toLowerCase();
          bValue = sanitizeText(b.name).toLowerCase();
          break;
        case 'projectName':
          aValue = sanitizeText(a.projectName || '').toLowerCase();
          bValue = sanitizeText(b.projectName || '').toLowerCase();
          break;
        case 'bepType':
          aValue = a.bepType;
          bValue = b.bepType;
          break;
        case 'lastModified':
        default:
          aValue = new Date(a.lastModified);
          bValue = new Date(b.lastModified);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, []);

  // Memoize the filtered and sorted drafts array
  const filteredAndSortedDrafts = useMemo(() => {
    let result = Object.values(rawDrafts);

    // Apply search filter
    result = filterDraftsBySearch(result, debouncedSearchQuery);

    // Apply BEP type filter
    result = filterDraftsByBepType(result, selectedBepTypeFilter);

    // Apply date filter
    result = filterDraftsByDate(result, dateFilter);

    // Apply sorting
    result = sortDrafts(result, sortBy, sortOrder);

    return result;
  }, [rawDrafts, debouncedSearchQuery, selectedBepTypeFilter, dateFilter, sortBy, sortOrder, filterDraftsBySearch, filterDraftsByBepType, filterDraftsByDate, sortDrafts]);

  // Helper function to clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setSelectedBepTypeFilter('all');
    setDateFilter('all');
    setSortBy('lastModified');
    setSortOrder('desc');
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return searchQuery.trim() !== '' ||
           selectedBepTypeFilter !== 'all' ||
           dateFilter !== 'all' ||
           sortBy !== 'lastModified' ||
           sortOrder !== 'desc';
  }, [searchQuery, selectedBepTypeFilter, dateFilter, sortBy, sortOrder]);

  // Statistics for the filtered results
  const draftStats = useMemo(() => {
    const allDrafts = Object.values(rawDrafts);
    const preAppointmentCount = allDrafts.filter(d => d.bepType === 'pre-appointment').length;
    const postAppointmentCount = allDrafts.filter(d => d.bepType === 'post-appointment').length;

    return {
      total: allDrafts.length,
      filtered: filteredAndSortedDrafts.length,
      preAppointment: preAppointmentCount,
      postAppointment: postAppointmentCount
    };
  }, [rawDrafts, filteredAndSortedDrafts.length]);

  // Helper function to highlight search terms
  const highlightSearchTerm = useCallback((text, searchTerm) => {
    if (!searchTerm.trim() || !text) return text;

    const sanitizedSearchTerm = sanitizeText(searchTerm).toLowerCase();
    const sanitizedText = sanitizeText(text);

    if (!sanitizedSearchTerm) return sanitizedText;

    const regex = new RegExp(`(${sanitizedSearchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = sanitizedText.split(regex);

    return parts.map((part, index) => {
      if (part.toLowerCase() === sanitizedSearchTerm.toLowerCase()) {
        return (
          <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
            {part}
          </mark>
        );
      }
      return part;
    });
  }, []);

  return {
    // State
    searchQuery,
    debouncedSearchQuery,
    selectedBepTypeFilter,
    dateFilter,
    sortBy,
    sortOrder,
    showFilters,

    // State setters
    setSearchQuery,
    setSelectedBepTypeFilter,
    setDateFilter,
    setSortBy,
    setSortOrder,
    setShowFilters,

    // Computed values
    filteredAndSortedDrafts,
    hasActiveFilters,
    draftStats,

    // Functions
    clearAllFilters,
    highlightSearchTerm,
    formatDate
  };
};