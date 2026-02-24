

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, FolderOpen, ArrowLeft, Filter } from 'lucide-react';
import DraftListItem from './DraftListItem';
import SaveDraftDialog from './SaveDraftDialog';
import SearchAndFilters from './SearchAndFilters';
import { useDrafts } from '../../../hooks/useDrafts';
import { useDraftFilters } from '../../../hooks/useDraftFilters';
import { useDraftOperations } from '../../../hooks/useDraftOperations';
import { validateDraftName } from '../../../utils/validationUtils';
import { useProject } from '../../../contexts/ProjectContext';
import ConfirmDialog from '../../common/ConfirmDialog';
import toast, { Toaster } from 'react-hot-toast';

const DraftManager = ({ user, currentFormData, onLoadDraft, onClose, bepType }) => {
  const navigate = useNavigate();
  const { currentProject } = useProject();
  const activeProjectId = currentProject?.id || null;
  // Load ALL drafts for the user — no server-side project filter here.
  // Drafts saved from BepFormView have project_id = null and would be hidden
  // if filtered by activeProjectId. useDraftOperations still stamps activeProjectId
  // on any new saves initiated from this view.
  const { rawDrafts, isLoading: loadingDrafts, error: draftsError, isValidComponent, refreshDrafts } = useDrafts(user, currentFormData, onLoadDraft, onClose, null);
  // Filtering, searching, sorting
  const filterHook = useDraftFilters(rawDrafts);
  // Draft operations (stamps projectId on saved drafts)
  const operations = useDraftOperations(user, currentFormData, bepType, onLoadDraft, onClose, activeProjectId);

  // State for dialogs and editing
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newDraftName, setNewDraftName] = useState('');
  const [debouncedNewDraftName, setDebouncedNewDraftName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [debouncedEditingName, setDebouncedEditingName] = useState('');
  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });

  // Debounce effects
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedNewDraftName(newDraftName), 300);
    return () => clearTimeout(timer);
  }, [newDraftName]);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedEditingName(editingName), 300);
    return () => clearTimeout(timer);
  }, [editingName]);

  // Validation
  const newDraftNameValidation = useMemo(() => {
    if (!debouncedNewDraftName) return { isValid: false, error: null, sanitized: '' };
    return validateDraftName(debouncedNewDraftName);
  }, [debouncedNewDraftName]);
  const editingNameValidation = useMemo(() => {
    if (!debouncedEditingName) return { isValid: false, error: null, sanitized: '' };
    return validateDraftName(debouncedEditingName);
  }, [debouncedEditingName]);

  // Enhanced operation handlers using ConfirmDialog and Toast
  const handleSaveDraft = async () => {
    const success = await operations.saveDraft(debouncedNewDraftName);
    if (success) {
      setShowSaveDialog(false);
      setNewDraftName('');
      setDebouncedNewDraftName('');
      refreshDrafts();
      toast.success('Draft saved successfully!');
    } else {
      toast.error(operations.error || 'Failed to save draft.');
    }
  };

  // Confirm before deleting a draft
  const handleDeleteDraft = (draftId) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Draft',
      message: 'Are you sure you want to delete this draft? This action cannot be undone.',
      onConfirm: async () => {
        setConfirmDialog((d) => ({ ...d, open: false }));
        const success = await operations.deleteDraft(draftId);
        if (success) {
          refreshDrafts();
          toast.success('Draft deleted.');
        } else {
          toast.error(operations.error || 'Failed to delete draft.');
        }
      }
    });
  };

  // Confirm before renaming a draft if the name is changing
  const handleRenameDraft = (draftId, newName) => {
    setConfirmDialog({
      open: true,
      title: 'Rename Draft',
      message: `Rename draft to "${newName}"?`,
      onConfirm: async () => {
        setConfirmDialog((d) => ({ ...d, open: false }));
        const success = await operations.renameDraft(draftId, newName);
        if (success) {
          setEditingId(null);
          setEditingName('');
          setDebouncedEditingName('');
          refreshDrafts();
          toast.success('Draft renamed.');
        } else {
          toast.error(operations.error || 'Failed to rename draft.');
        }
      }
    });
  };

  // Confirm before loading a draft (optional, for destructive loads)
  const handleLoadDraft = (draft) => {
    setConfirmDialog({
      open: true,
      title: 'Load Draft',
      message: 'Loading this draft will overwrite your current work. Continue?',
      onConfirm: () => {
        setConfirmDialog((d) => ({ ...d, open: false }));
        const success = operations.loadDraft(draft);
        if (!success) {
          toast.error(operations.error || 'Failed to load draft.');
        }
        // If successful, onLoadDraft callback will handle closing and navigation
        // No need to show toast or do anything else here
      }
    });
  };

  // Error and loading states
  const isLoading = loadingDrafts || operations.isLoading;
  const error = draftsError || operations.error;
  const setError = operations.setError;

  // Early return for invalid component state
  if (!isValidComponent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Component Error</h2>
          <p className="text-gray-600 mb-4">
            The Draft Manager component cannot be loaded due to invalid configuration.
          </p>
          <button
            onClick={onClose}
            className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  if (window.history.length > 1) {
                    window.history.back();
                    setTimeout(() => {
                      try { navigate('/home'); } catch (e) { /* noop */ }
                    }, 200);
                  } else if (onClose) {
                    onClose();
                  } else {
                    try { navigate('/home'); } catch (e) { /* noop */ }
                  }
                }}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to BEP</span>
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">BEP Draft Manager</h1>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">{user.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">Processing...</p>
              </div>
            </div>
          </div>
        )}

        {/* Save Current Work Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Save Current Work</h2>
            <button
              onClick={() => setShowSaveDialog(true)}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Draft</span>
            </button>
          </div>
          <p className="text-gray-600">
            Save your current work as a named draft so you can return to it later.
          </p>
        </div>

        {/* Save Dialog */}
        <SaveDraftDialog
          show={showSaveDialog}
          newDraftName={newDraftName}
          isNewDraftNameValid={newDraftNameValidation.isValid}
          newDraftNameValidation={newDraftNameValidation}
          onNewDraftNameChange={setNewDraftName}
          onSave={handleSaveDraft}
          onCancel={() => {
            setShowSaveDialog(false);
            setNewDraftName('');
            setDebouncedNewDraftName('');
          }}
        />

        {/* Drafts List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Saved Drafts ({filterHook.draftStats.filtered}{filterHook.draftStats.total !== filterHook.draftStats.filtered ? ` of ${filterHook.draftStats.total}` : ''})
                </h2>
                <p className="text-gray-600 mt-1">Manage your saved drafts</p>
              </div>
              {filterHook.draftStats.total > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => filterHook.setShowFilters(!filterHook.showFilters)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      filterHook.showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                    {filterHook.hasActiveFilters && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Search and Filter Controls */}
            {filterHook.draftStats.total > 0 && (
              <SearchAndFilters
                searchQuery={filterHook.searchQuery}
                onSearchQueryChange={filterHook.setSearchQuery}
                showFilters={filterHook.showFilters}
                onToggleFilters={() => filterHook.setShowFilters(!filterHook.showFilters)}
                selectedBepTypeFilter={filterHook.selectedBepTypeFilter}
                onBepTypeFilterChange={filterHook.setSelectedBepTypeFilter}
                dateFilter={filterHook.dateFilter}
                onDateFilterChange={filterHook.setDateFilter}
                sortBy={filterHook.sortBy}
                onSortByChange={filterHook.setSortBy}
                sortOrder={filterHook.sortOrder}
                onSortOrderChange={filterHook.setSortOrder}
                hasActiveFilters={filterHook.hasActiveFilters}
                onClearAllFilters={filterHook.clearAllFilters}
                draftStats={filterHook.draftStats.filtered}
                totalDrafts={filterHook.draftStats.total}
              />
            )}
          </div>

          {filterHook.filteredAndSortedDrafts.length === 0 ? (
            <div className="p-12 text-center">
              <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              {filterHook.draftStats.total === 0 ? (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No drafts saved</h3>
                  <p className="text-gray-600">Save your first draft to start managing your BEP drafts.</p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No drafts match the filters</h3>
                  <p className="text-gray-600 mb-4">
                    Try modifying your search criteria or filters to find the drafts you're looking for.
                  </p>
                  <button
                    onClick={filterHook.clearAllFilters}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Clear all filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filterHook.filteredAndSortedDrafts.map((draft) => (
                <DraftListItem
                  key={draft.id}
                  draft={draft}
                  editingId={editingId}
                  editingName={editingName}
                  isEditingNameValid={editingNameValidation.isValid}
                  editingNameValidation={editingNameValidation}
                  debouncedSearchQuery={filterHook.debouncedSearchQuery}
                  onEditingNameChange={setEditingName}
                  onStartEdit={(id, name) => {
                    setEditingId(id);
                    setEditingName(name);
                  }}
                  onCancelEdit={() => {
                    setEditingId(null);
                    setEditingName('');
                    setDebouncedEditingName('');
                  }}
                  onRenameDraft={handleRenameDraft}
                  onLoadDraft={handleLoadDraft}
                  onExportDraft={operations.exportDraft}
                  onDeleteDraft={handleDeleteDraft}
                  formatDate={filterHook.formatDate}
                  highlightSearchTerm={filterHook.highlightSearchTerm}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((d) => ({ ...d, open: false }))}
      />
      {/* Toast Notification */}
      <Toaster position="top-right" />
    </div>
  );
};

export default DraftManager;