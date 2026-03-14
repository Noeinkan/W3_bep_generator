import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, FileText, Trash2, ArrowLeft, Send } from 'lucide-react';
import { useProject } from '../../../contexts/ProjectContext';
import apiService from '../../../services/apiService';
import ConfirmDialog from '../../common/ConfirmDialog';
import toast from 'react-hot-toast';

const OirDraftsView = () => {
  const navigate = useNavigate();
  const { currentProject } = useProject();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const projectId = currentProject?.id ?? null;

  const loadDrafts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiService.getOirDrafts(projectId);
      if (res?.success && Array.isArray(res.drafts)) {
        setDrafts(res.drafts);
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to load OIR drafts');
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  const handleOpen = (draft) => {
    navigate(`/oir-manager/${draft.id}/edit`);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeleteTarget(null);
    try {
      await apiService.deleteOirDraft(id);
      toast.success('OIR deleted');
      loadDrafts();
    } catch (err) {
      toast.error(err?.message || 'Failed to delete OIR');
    }
  };

  const handlePublish = async (draft) => {
    try {
      await apiService.publishOirDraft(draft.id);
      toast.success('OIR published — it is now the active organizational reference for this project.');
      loadDrafts();
    } catch (err) {
      toast.error(err?.message || 'Failed to publish OIR');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50" data-page-uri="/oir-manager/drafts">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => navigate('/oir-manager')}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Back to OIR Manager"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My OIR Drafts</h1>
              <p className="text-sm text-gray-600">Organizational Information Requirements (ISO 19650)</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-900 px-6 py-4 border-b border-gray-200">Your OIR documents</h2>
          {loading ? (
            <div className="px-6 py-12 text-center text-gray-500">Loading…</div>
          ) : drafts.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No OIR documents yet. <button type="button" onClick={() => navigate('/oir-manager')} className="text-indigo-700 font-medium hover:underline">Create one</button>.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {drafts.map((draft) => (
                <li key={draft.id} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-gray-900 truncate">{draft.title || 'Untitled OIR'}</p>
                        {draft.status === 'published' && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Published
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{formatDate(draft.updated_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {draft.status !== 'published' && (
                      <button
                        type="button"
                        onClick={() => handlePublish(draft)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                        title="Set as the active OIR for this project"
                      >
                        <Send className="w-4 h-4" />
                        Publish
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleOpen(draft)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
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
        title="Delete OIR"
        message={deleteTarget ? `Delete "${deleteTarget.title || 'Untitled OIR'}"? This cannot be undone.` : ''}
        confirmText="Delete"
        confirmVariant="danger"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default OirDraftsView;
