import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ArrowLeft, Plus, RefreshCw } from 'lucide-react';
import { useProject } from '../../../contexts/ProjectContext';
import apiService from '../../../services/apiService';
import LoinRowsTable from './LoinRowsTable';
import LoinRowForm from './LoinRowForm';
import { ConfirmDialog } from '../../common';
import toast from 'react-hot-toast';

/**
 * LOIN Tables manager — real CRUD UI for Level of Information Need rows per project.
 * Replaces the "Coming soon" placeholder. One table per project; rows are
 * (discipline, stage, element) triplets with geometry/alphanumeric/documentation values.
 */
const LoinTablesPage = () => {
  const navigate = useNavigate();
  const { currentProject, projects, selectProject } = useProject();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null); // null = create mode
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Back navigation: return to BEP editor step if navigated from there
  const handleBack = () => {
    const returnUrl = typeof sessionStorage !== 'undefined'
      ? sessionStorage.getItem('bep-return-url')
      : null;
    if (returnUrl) {
      sessionStorage.removeItem('bep-return-url');
      navigate(returnUrl);
    } else {
      navigate('/bep-generator');
    }
  };

  const loadRows = useCallback(async (projectId) => {
    if (!projectId) { setRows([]); return; }
    setLoading(true);
    try {
      const res = await apiService.getLoinRows(projectId);
      setRows(res?.data ?? []);
    } catch {
      toast.error('Failed to load LOIN rows');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRows(currentProject?.id);
  }, [currentProject?.id, loadRows]);

  const handleProjectChange = (e) => {
    const proj = projects.find(p => p.id === e.target.value);
    if (proj) selectProject(proj);
  };

  // Open form
  const openCreate = () => { setEditingRow(null); setFormOpen(true); };
  const openEdit = (row) => { setEditingRow(row); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditingRow(null); };

  const handleSave = async (formData) => {
    try {
      if (editingRow) {
        const res = await apiService.updateLoinRow(editingRow.id, formData);
        setRows(prev => prev.map(r => r.id === editingRow.id ? res.data : r));
        toast.success('Row updated');
      } else {
        const res = await apiService.createLoinRow({ ...formData, projectId: currentProject.id });
        setRows(prev => [...prev, res.data]);
        toast.success('Row added');
      }
      closeForm();
    } catch {
      toast.error('Failed to save row');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await apiService.deleteLoinRow(deleteTarget.id);
      setRows(prev => prev.filter(r => r.id !== deleteTarget.id));
      toast.success('Row deleted');
    } catch {
      toast.error('Failed to delete row');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-50" data-page-uri="/loin-tables">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">LOIN Tables</h1>
              <p className="text-sm text-gray-500">Level of Information Need — ISO 19650</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Project selector */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4 flex items-center gap-4 flex-wrap">
          <label className="text-sm font-medium text-gray-700 flex-shrink-0">Project:</label>
          {projects.length === 0 ? (
            <span className="text-sm text-gray-400 italic">No projects found</span>
          ) : (
            <select
              value={currentProject?.id || ''}
              onChange={handleProjectChange}
              className="flex-1 min-w-48 max-w-xs px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              <option value="">Select a project…</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}

          {currentProject && (
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => loadRows(currentProject.id)}
                title="Refresh"
                className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                type="button"
                onClick={openCreate}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Row
              </button>
            </div>
          )}
        </div>

        {/* Info blurb */}
        {!currentProject && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-4">
            <p className="text-sm text-gray-600">
              Select a project above to view and manage its LOIN table. Each row defines the Level of Information Need
              for a specific <strong>discipline + stage + element</strong> combination, across three ISO 19650 categories:
              geometry, alphanumeric data, and documentation.
            </p>
          </div>
        )}

        {/* Table */}
        {currentProject && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-gray-400">
                <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                <span className="text-sm">Loading…</span>
              </div>
            ) : (
              <LoinRowsTable
                rows={rows}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
            )}
            {!loading && rows.length > 0 && (
              <p className="text-xs text-gray-400 mt-3 text-right">{rows.length} row{rows.length !== 1 ? 's' : ''}</p>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit form modal */}
      {formOpen && (
        <LoinRowForm
          row={editingRow}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete LOIN Row"
        message={
          deleteTarget
            ? `Delete the row for "${deleteTarget.discipline} / ${deleteTarget.stage} / ${deleteTarget.element}"? This cannot be undone.`
            : ''
        }
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default LoinTablesPage;
