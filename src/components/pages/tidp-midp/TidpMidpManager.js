import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTidpData } from '../../../hooks/useTidpData';
import { useMidpData } from '../../../hooks/useMidpData';
import { useExport } from '../../../hooks/useExport';
import { useProject } from '../../../contexts/ProjectContext';
import { getDefaultContainer } from '../../../utils/csvHelpers';
import toast, { Toaster } from 'react-hot-toast';
import TIDPImportDialog from '../../tidp/TIDPImportDialog';
import MIDPEvolutionDashboard from '../../midp/MIDPEvolutionDashboard';
import TIDPList from '../../tidp/TIDPList';
import TIDPForm from '../../tidp/TIDPForm';
import TIDPDetailsPanel from '../../tidp/TIDPDetailsPanel';
import TIDPDashboard from '../../tidp/TIDPDashboard';
import MIDPList from '../../midp/MIDPList';
import MIDPForm from '../../midp/MIDPForm';

const TidpMidpManager = ({ onClose, initialShowTidpForm = false, initialShowMidpForm = false, initialTidpId = null }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTidpForm, setShowTidpForm] = useState(initialShowTidpForm);
  const [showMidpForm, setShowMidpForm] = useState(initialShowMidpForm);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showEvolutionDashboard, setShowEvolutionDashboard] = useState(null);
  const [detailsItem, setDetailsItem] = useState(null);
  const [detailsForm, setDetailsForm] = useState({ taskTeam: '', description: '', containers: [] });

  // Helper to convert setToast-style calls to react-hot-toast for child components
  const showToast = (toastData) => {
    if (typeof toastData === 'string') {
      toast(toastData);
    } else if (toastData.type === 'success') {
      toast.success(toastData.message);
    } else if (toastData.type === 'error') {
      toast.error(toastData.message);
    } else {
      toast(toastData.message);
    }
  };

  // Custom hooks
  const { currentProject } = useProject();
  const { tidps, loading: tidpLoading, loadTidps, createTidp, updateTidp, deleteTidp, bulkUpdateTidps } = useTidpData(currentProject?.id);
  const { midps, loading: midpLoading, loadMidps, createMidp } = useMidpData();
  const {
    templates,
    selectedTemplate,
    setSelectedTemplate,
    exportLoading,
    bulkExportRunning,
    bulkProgress,
    exportTidpExcel,
    exportTidpPdf,
    exportMidpExcel,
    exportMidpPdf,
    exportAllTidpPdfs,
    exportConsolidatedProject
  } = useExport();

  // Form states
  const [tidpForm, setTidpForm] = useState({
    taskTeam: '',
    discipline: '',
    teamLeader: '',
    description: '',
    containers: [
      {
        ...getDefaultContainer(),
        'Information Container Name/Title': 'Initial deliverable',
        'Due Date': new Date().toISOString().slice(0, 10)
      }
    ]
  });
  const [createLoading, setCreateLoading] = useState(false);

  const [midpForm, setMidpForm] = useState({ projectName: '', description: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([loadTidps(), loadMidps()]);
        // If an initial TIDP id was provided (e.g. via /tidp-editor/:id), load it into the form
        if (initialTidpId) {
          try {
            // initialTidpId may include a slug (id-slug); extract the id portion
            // If initialTidpId was provided as 'id--slug', split on the double-dash separator to get the id
            const rawParts = String(initialTidpId).split('--');
            const idOnly = rawParts[0];
            const t = await (async () => {
              const ApiService = require('../../../services/apiService').default || require('../../../services/apiService');
              const resp = await ApiService.getTIDP(idOnly);
              return resp.data || resp;
            })();

            if (t) {
              // Populate tidpForm and detailsForm, and show the tidp form for editing
              setTidpForm((prev) => ({
                ...prev,
                taskTeam: t.teamName || t.taskTeam || prev.taskTeam,
                discipline: t.discipline || prev.discipline,
                teamLeader: t.leader || t.teamLeader || prev.teamLeader,
                description: t.responsibilities || t.description || prev.description,
                containers: t.containers && t.containers.length > 0 ? t.containers : prev.containers
              }));

              setDetailsItem({ type: 'tidp', data: t });
              setDetailsForm({ taskTeam: t.teamName || t.taskTeam, description: t.description || t.responsibilities, containers: t.containers || [] });
              setShowTidpForm(true);
            }
          } catch (err) {
            console.warn('Failed to load initial TIDP by id:', initialTidpId, err);
          }
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
        toast.error('Failed to load data. Please ensure the backend server is running.');
      }
    };
    loadData();
  }, [loadTidps, loadMidps, initialTidpId]);

  // TIDP handlers
  const handleCreateTidp = async () => {
    console.log('handleCreateTidp invoked', tidpForm);
    if (!tidpForm.taskTeam || tidpForm.taskTeam.trim().length < 2) {
      toast.error('Task team is required');
      return;
    }
    if (!tidpForm.discipline) {
      toast.error('Discipline is required');
      return;
    }
    if (!tidpForm.teamLeader || tidpForm.teamLeader.trim().length < 2) {
      toast.error('Team leader is required');
      return;
    }

    try {
      setCreateLoading(true);
      const created = await createTidp(tidpForm);
      console.log('createTidp result', created);
      toast.success('TIDP created');
      setShowTidpForm(false);
      resetTidpForm();

      if (created) {
        const t = created.data ? created.data : created;
        // Switch to the TIDPs tab and reload the list so the newly created item is visible
        try {
          setActiveTab('tidps');
          await loadTidps();
        } catch (loadErr) {
          console.warn('Failed to reload TIDPs after create:', loadErr);
        }

        // Show details for the newly created TIDP
        setDetailsItem({ type: 'tidp', data: t });
        setDetailsForm({
          taskTeam: t.taskTeam || '',
          description: t.description || '',
          containers: t.containers || []
        });
        // Update URL to include id
        try {
          navigate(`/tidp-editor/${t.id}`);
        } catch (e) { /* noop */ }
      }
    } catch (err) {
      console.error('Create TIDP failed', err);
      toast.error(err.message || 'Failed to create TIDP');
    }
    finally {
      setCreateLoading(false);
    }
  };

  const handleUpdateTidp = async (id, update) => {
    try {
      setCreateLoading(true);
      await updateTidp(id, update);
      toast.success('TIDP updated');
      setDetailsItem(null);
      setShowTidpForm(false);
      resetTidpForm();
      // Reload TIDPs to reflect the update
      await loadTidps();
      // Navigate back to the TIDP list
      try { navigate('/tidp-midp'); } catch (e) { /* noop */ }
    } catch (err) {
      console.error('Update TIDP failed', err);
      toast.error(err.message || 'Failed to update TIDP');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteTidp = async (id) => {
    if (!window.confirm('Delete this TIDP?')) return;
    try {
      await deleteTidp(id);
      toast.success('TIDP deleted');
      setDetailsItem(null);
    } catch (err) {
      console.error('Delete TIDP failed', err);
      toast.error(err.message || 'Failed to delete TIDP');
    }
  };

  // MIDP handlers
  const handleCreateMidp = async () => {
    if (!midpForm.projectName || midpForm.projectName.trim().length < 2) {
      toast.error('Project name is required');
      return;
    }
    try {
      const result = await createMidp(midpForm);
      const message = result.autoGenerated
        ? 'MIDP auto-generated from existing TIDPs'
        : 'MIDP created (add TIDPs to populate)';
      toast.success(message);
      setShowMidpForm(false);
      setMidpForm({ projectName: '', description: '' });
    } catch (err) {
      console.error('Create MIDP failed', err);
      toast.error(err.message || 'Failed to create MIDP');
    }
  };

  const handleImportComplete = async (importResults) => {
    toast.success(`Imported ${importResults.successful.length} TIDPs successfully`);
    setShowImportDialog(false);
    await Promise.all([loadTidps(), loadMidps()]);
  };

  const handleImportCsv = (containers) => {
    setTidpForm((prev) => ({
      ...prev,
      containers: containers
    }));
    setShowTidpForm(true);
  };

  // Centralized open editor function: open a new or existing TIDP and update URL
  const openTidpEditor = (tidp = null) => {
    if (tidp) {
      setDetailsItem({ type: 'tidp', data: tidp });
      setDetailsForm({
        taskTeam: tidp.taskTeam || '',
        description: tidp.description || '',
        containers: tidp.containers || []
      });
      setShowTidpForm(true);
      try {
        navigate(`/tidp-editor/${tidp.id}`);
      } catch (e) { /* noop */ }
    } else {
      // New TIDP
      setTidpForm((prev) => ({ ...prev }));
      setShowTidpForm(true);
      try { navigate('/tidp-editor'); } catch (e) { /* noop */ }
    }
  };

  // Export handlers
  const handleExportTidpPdf = async (id) => {
    try {
      await exportTidpPdf(id);
      toast.success('TIDP PDF export downloaded');
    } catch (err) {
      toast.error('Failed to export TIDP to PDF: ' + (err.message || err));
    }
  };

  const handleExportTidpExcel = async (id) => {
    try {
      await exportTidpExcel(id);
      toast.success('TIDP Excel export downloaded');
    } catch (err) {
      toast.error('Failed to export TIDP to Excel: ' + (err.message || err));
    }
  };

  const handleExportMidpPdf = async (id) => {
    try {
      await exportMidpPdf(id);
      toast.success('MIDP PDF export downloaded');
    } catch (err) {
      toast.error('Failed to export MIDP to PDF: ' + (err.message || err));
    }
  };

  const handleExportMidpExcel = async (id) => {
    try {
      await exportMidpExcel(id);
      toast.success('MIDP Excel export downloaded');
    } catch (err) {
      toast.error('Failed to export MIDP to Excel: ' + (err.message || err));
    }
  };

  const handleExportAllPdfs = async () => {
    try {
      const result = await exportAllTidpPdfs(tidps, 3);
      if (result && result.errors && result.errors.length > 0) {
        toast.error(`Completed with ${result.errors.length} failures`);
      } else {
        toast.success(`All TIDP exports completed (${tidps.length})`);
      }
    } catch (err) {
      toast.error('Some TIDP exports failed');
    }
  };

  const resetTidpForm = () => {
    setTidpForm({
      taskTeam: '',
      discipline: '',
      teamLeader: '',
      description: '',
      containers: [
        {
          ...getDefaultContainer(),
          'Information Container Name/Title': 'Initial deliverable',
          'Due Date': new Date().toISOString().slice(0, 10)
        }
      ]
    });
  };

  const loading = tidpLoading || midpLoading;

  const handleCloseTidpForm = () => {
    // Always hide the form and reset local state
    setShowTidpForm(false);
    resetTidpForm();

    // If this manager was mounted via the /tidp-editor URL (direct open),
    // navigating back to a known page is preferable to leaving the app at a
    // stray URL like /tidp-editor (without id) or other unexpected path.
    const path = window.location.pathname || '';

    // If an external onClose handler was provided (parent embedded context), call it
    if (typeof onClose === 'function') {
      try { onClose(); } catch (e) { /* noop */ }
      return;
    }

    if (path.startsWith('/tidp-editor')) {
      try { navigate('/tidp-midp'); } catch (e) { /* noop */ }
    }
  };

  const isEditing = !!detailsItem?.data?.id;
  const tidpId = detailsItem?.data?.id || null;

  if (showTidpForm) {
    const handleSubmit = isEditing
      ? () => handleUpdateTidp(tidpId, {
          teamName: tidpForm.taskTeam,
          discipline: tidpForm.discipline,
          leader: tidpForm.teamLeader,
          responsibilities: tidpForm.description,
          containers: tidpForm.containers
        })
      : handleCreateTidp;

    return (
      <TIDPForm
        tidpForm={tidpForm}
        onTidpFormChange={setTidpForm}
        onSubmit={handleSubmit}
        createLoading={createLoading}
        onCancel={handleCloseTidpForm}
        isEditing={isEditing}
        tidpId={tidpId}
      />
    );
  }

  if (showMidpForm) {
    return (
      <MIDPForm
        midpForm={midpForm}
        onMidpFormChange={setMidpForm}
        onSubmit={handleCreateMidp}
        onCancel={() => {
          setShowMidpForm(false);
          setMidpForm({ projectName: '', description: '' });
        }}
      />
    );
  }

  return (
    <>
      <div className="min-h-full" data-page-uri="/tidp-midp">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              {onClose ? (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">TIDP/MIDP Manager</h1>
                  <p className="text-gray-600">Manage Task and Master Information Delivery Plans</p>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      const returnUrl = sessionStorage.getItem('bep-return-url');
                      if (returnUrl) {
                        sessionStorage.removeItem('bep-return-url');
                        window.location.href = returnUrl;
                      } else if (window.history.length > 1) {
                        window.history.back();
                        setTimeout(() => {
                          try { navigate('/tidp-midp'); } catch (e) { /* noop */ }
                        }, 200);
                      } else {
                        // Fallback to explicit navigation
                        try { navigate('/tidp-midp'); } catch (e) { /* noop */ }
                        try { navigate('/tidp-midp-dashboard'); } catch (e) { /* noop */ }
                      }
                    }}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Dashboard
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">TIDP Editor</h1>
                    <p className="text-gray-600">Create and edit Task Information Delivery Plans</p>
                  </div>
                </div>
              )}
              <button
                onClick={handleCreateTidp}
                className="bg-blue-500 text-white py-2 px-4 rounded"
                aria-label="Create TIDP"
              >
                Create TIDP
              </button>
            </div>
            {onClose && (
              <div className="flex items-center space-x-3">
                <button onClick={onClose} className="text-sm text-gray-600 hover:text-gray-800 underline">
                  Back to BEP
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <nav className="flex space-x-8">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'tidps', label: 'TIDPs' },
                { id: 'midps', label: 'MIDP' }
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>


          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <TIDPDashboard
                  tidps={tidps}
                  midps={midps}
                  onShowTidpForm={() => openTidpEditor(null)}
                  onShowMidpForm={() => setShowMidpForm(true)}
                  onImportCsv={handleImportCsv}
                  onToast={showToast}
                />
              )}
              {activeTab === 'tidps' && (
                <TIDPList
                  tidps={tidps}
                  templates={templates}
                  selectedTemplate={selectedTemplate}
                  onTemplateChange={setSelectedTemplate}
                  exportLoading={exportLoading}
                  onExportPdf={handleExportTidpPdf}
                  onExportExcel={handleExportTidpExcel}
                  onViewDetails={(tidp) => openTidpEditor(tidp)}
                  onShowTidpForm={() => openTidpEditor(null)}
                  onShowImportDialog={() => setShowImportDialog(true)}
                  onImportCsv={handleImportCsv}
                  onExportAllPdfs={handleExportAllPdfs}
                  onExportConsolidated={exportConsolidatedProject}
                  bulkExportRunning={bulkExportRunning}
                  bulkProgress={bulkProgress}
                  midps={midps}
                  onToast={showToast}
                  onBulkUpdate={async (updates) => {
                    try {
                      await bulkUpdateTidps(updates);
                      toast.success(`Bulk update applied to ${updates.length} items`);
                    } catch (err) {
                      console.error('Bulk update failed', err);
                      toast.error('Bulk update failed: ' + (err.message || err));
                    }
                  }}
                />
              )}
              {activeTab === 'midps' && (
                <MIDPList
                  midps={midps}
                  templates={templates}
                  selectedTemplate={selectedTemplate}
                  onTemplateChange={setSelectedTemplate}
                  exportLoading={exportLoading}
                  onExportPdf={handleExportMidpPdf}
                  onExportExcel={handleExportMidpExcel}
                  onViewDetails={(midp) => setDetailsItem({ type: 'midp', data: midp })}
                  onShowMidpForm={() => setShowMidpForm(true)}
                  onShowEvolutionDashboard={setShowEvolutionDashboard}
                />
              )}
            </>
          )}
        </div>

        {/* Details panel */}
        {detailsItem && detailsItem.type === 'tidp' && (
          <TIDPDetailsPanel
            tidp={detailsItem.data}
            detailsForm={detailsForm}
            onDetailsFormChange={setDetailsForm}
            onSave={handleUpdateTidp}
            onDelete={handleDeleteTidp}
            onClose={() => setDetailsItem(null)}
          />
        )}

        {/* MIDP Details panel (simple) */}
        {detailsItem && detailsItem.type === 'midp' && (
          <div className="fixed right-6 top-20 w-96 bg-white border rounded-lg shadow-lg p-4 z-50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">MIDP Details</h4>
              <button type="button" onClick={() => setDetailsItem(null)} className="text-sm text-gray-600">
                Close
              </button>
            </div>
            <div className="text-sm text-gray-700">
              <h5 className="font-medium mb-2">{detailsItem.data.projectName}</h5>
              <p className="text-xs text-gray-600 mb-3">{detailsItem.data.description}</p>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setDetailsItem(null)}
                  className="bg-gray-200 px-3 py-1 rounded text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <Toaster position="top-right" />

      {/* Import Dialog */}
      <TIDPImportDialog
        open={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImportComplete={handleImportComplete}
      />

      {/* Evolution Dashboard */}
      {showEvolutionDashboard && (
        <MIDPEvolutionDashboard
          midpId={showEvolutionDashboard}
          onClose={() => setShowEvolutionDashboard(null)}
        />
      )}
    </>
  );
};

export default TidpMidpManager;