import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSearch, Plus, FileText, Trash2, ArrowLeft } from 'lucide-react';
import { useProject } from '../../../contexts/ProjectContext';
import apiService from '../../../services/apiService';
import ConfirmDialog from '../../common/ConfirmDialog';
import toast from 'react-hot-toast';

/**
 * EIR Manager — list EIR drafts for the current project, create new, open editor, delete.
 * ISO 19650 Exchange Information Requirements (EIR) authoring hub.
 */
const EirManagerPage = () => {
  const navigate = useNavigate();
  const { currentProject } = useProject();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const projectId = currentProject?.id ?? null;

  const loadDrafts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiService.getEirDrafts(projectId);
      if (res?.success && Array.isArray(res.drafts)) {
        setDrafts(res.drafts);
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to load EIR drafts');
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  const handleNewEir = async () => {
    try {
      const title = 'Untitled EIR';
      const res = await apiService.createEirDraft({ projectId, title, data: {} });
      if (res?.success && res?.draft?.id) {
        toast.success('EIR created');
        navigate(`/eir-manager/${res.draft.id}/edit`);
      } else {
        toast.error('Failed to create EIR');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to create EIR');
    }
  };

  const handleOpen = (draft) => {
    navigate(`/eir-manager/${draft.id}/edit`);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeleteTarget(null);
    try {
      await apiService.deleteEirDraft(id);
      toast.success('EIR deleted');
      loadDrafts();
    } catch (err) {
      toast.error(err?.message || 'Failed to delete EIR');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { dateStyle: 'short' }) + ' ' + d.toLocaleTimeString(undefined, { timeStyle: 'short' });
    } catch (_) {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-50" data-page-uri="/eir-manager">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
              <FileSearch className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">EIR Manager</h1>
              <p className="text-sm text-gray-600">Exchange Information Requirements (ISO 19650)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleNewEir}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            New EIR
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <p className="text-gray-700 mb-4">
            Create and manage Exchange Information Requirements (EIR) for this project. The EIR defines what, when, how, and in what format information must be exchanged. Your BEP is the delivery team&apos;s response to the EIR.
          </p>
          <button
            type="button"
            onClick={() => navigate('/bep-generator')}
            className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Open BEP Generator
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-900 px-6 py-4 border-b border-gray-200">Your EIR documents</h2>
          {loading ? (
            <div className="px-6 py-12 text-center text-gray-500">Loading…</div>
          ) : drafts.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No EIR documents yet. Click <strong>New EIR</strong> to create one.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {drafts.map((draft) => (
                <li key={draft.id} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FileText className="w-5 h-5 text-amber-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{draft.title || 'Untitled EIR'}</p>
                      <p className="text-sm text-gray-500">{formatDate(draft.updated_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpen(draft)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(draft)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete EIR"
        message={deleteTarget ? `Delete "${deleteTarget.title || 'Untitled EIR'}"? This cannot be undone.` : ''}
        confirmText="Delete"
        confirmVariant="danger"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default EirManagerPage;
