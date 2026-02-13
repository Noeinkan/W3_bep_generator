import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Settings, Info } from 'lucide-react';
import useResponsibilityMatrix from '../../hooks/useResponsibilityMatrix';
import { createDefaultActivitiesForProject } from '../../constants/iso19650ActivitiesTemplate';
import ApiService from '../../services/apiService';
import { useProject } from '../../contexts/ProjectContext';

// Import all child components
import MatrixSelector from './MatrixSelector';
import IMActivitiesMatrix from './IMActivitiesMatrix';
import DeliverablesMatrix from './DeliverablesMatrix';
import IMActivitiesForm from './IMActivitiesForm';
import DeliverableForm from './DeliverableForm';
import TIDPSyncPanel from './TIDPSyncPanel';
import MatrixExportPanel from './MatrixExportPanel';

/**
 * Responsibility Matrix Manager
 * Main container for managing both ISO 19650 responsibility matrices
 */
const ResponsibilityMatrixManager = ({ projectId: projectIdProp, onClose }) => {
  const { currentProject } = useProject();
  const projectId = projectIdProp || currentProject?.id || null;

  // State management
  const [activeMatrix, setActiveMatrix] = useState('im-activities');
  const [showImActivitiesForm, setShowImActivitiesForm] = useState(false);
  const [showDeliverableForm, setShowDeliverableForm] = useState(false);
  const [showSyncPanel, setShowSyncPanel] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editingDeliverable, setEditingDeliverable] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', type: 'info' });
  const [initialized, setInitialized] = useState(false);

  // Use custom hook for data management
  const {
    imActivities,
    imActivitiesLoading,
    loadImActivities,
    createImActivity,
    updateImActivity,
    deleteImActivity,
    bulkCreateImActivities,
    deliverables,
    deliverablesLoading,
    loadDeliverables,
    createDeliverable,
    updateDeliverable,
    deleteDeliverable,
    syncStatus,
    syncStatusLoading,
    loadSyncStatus,
    syncAllTIDPs,
    syncSingleTIDP,
    unsyncTIDP
  } = useResponsibilityMatrix(projectId);

  // Initialize with default ISO 19650 activities if none exist
  useEffect(() => {
    if (!imActivitiesLoading && imActivities.length === 0 && projectId && !initialized) {
      initializeDefaultActivities();
    }
  }, [imActivities, imActivitiesLoading, projectId, initialized]);

  const initializeDefaultActivities = async () => {
    try {
      const defaultActivities = createDefaultActivitiesForProject(projectId);
      await bulkCreateImActivities(defaultActivities);
      showToast('ISO 19650-2 standard activities initialized successfully', 'success');
      setInitialized(true);
    } catch (error) {
      console.error('Failed to initialize default activities:', error);
      showToast('Failed to initialize default activities', 'error');
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ open: true, message, type });
    setTimeout(() => setToast({ open: false, message: '', type: 'info' }), 4000);
  };

  // IM Activities handlers
  const handleAddCustomActivity = () => {
    setEditingActivity(null);
    setShowImActivitiesForm(true);
  };

  const handleEditActivity = (activityId) => {
    const activity = imActivities.find(a => a.id === activityId);
    if (activity) {
      setEditingActivity(activity);
      setShowImActivitiesForm(true);
    }
  };

  const handleSaveActivity = async (activityData) => {
    try {
      if (editingActivity) {
        await updateImActivity(editingActivity.id, activityData);
        showToast('Activity updated successfully', 'success');
      } else {
        await createImActivity({
          ...activityData,
          projectId,
          isCustom: true
        });
        showToast('Custom activity added successfully', 'success');
      }
      setShowImActivitiesForm(false);
      setEditingActivity(null);
    } catch (error) {
      showToast(`Failed to save activity: ${error.message}`, 'error');
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await deleteImActivity(activityId);
        showToast('Activity deleted successfully', 'success');
      } catch (error) {
        showToast(`Failed to delete activity: ${error.message}`, 'error');
      }
    }
  };

  // Deliverables handlers
  const handleAddManualDeliverable = () => {
    setEditingDeliverable(null);
    setShowDeliverableForm(true);
  };

  const handleEditDeliverable = (deliverable) => {
    setEditingDeliverable(deliverable);
    setShowDeliverableForm(true);
  };

  const handleSaveDeliverable = async (deliverableData) => {
    try {
      if (editingDeliverable) {
        await updateDeliverable(editingDeliverable.id, deliverableData);
        showToast('Deliverable updated successfully', 'success');
      } else {
        await createDeliverable({
          ...deliverableData,
          projectId,
          isAutoPopulated: false
        });
        showToast('Deliverable added successfully', 'success');
      }
      setShowDeliverableForm(false);
      setEditingDeliverable(null);
    } catch (error) {
      showToast(`Failed to save deliverable: ${error.message}`, 'error');
    }
  };

  const handleDeleteDeliverable = async (deliverableId) => {
    if (window.confirm('Are you sure you want to delete this deliverable?')) {
      try {
        await deleteDeliverable(deliverableId);
        showToast('Deliverable deleted successfully', 'success');
      } catch (error) {
        showToast(`Failed to delete deliverable: ${error.message}`, 'error');
      }
    }
  };

  // Sync handlers
  const handleSyncAll = async (overwriteManual) => {
    try {
      const results = await syncAllTIDPs(overwriteManual);
      showToast(
        `Sync complete: ${results.created} created, ${results.updated} updated, ${results.skipped} skipped`,
        'success'
      );
      setShowSyncPanel(false);
    } catch (error) {
      showToast(`Sync failed: ${error.message}`, 'error');
    }
  };

  const handleSyncSingle = async (tidpId, overwriteManual) => {
    try {
      const results = await syncSingleTIDP(tidpId, overwriteManual);
      showToast(
        `TIDP synced: ${results.created} created, ${results.updated} updated`,
        'success'
      );
    } catch (error) {
      showToast(`Sync failed: ${error.message}`, 'error');
    }
  };

  const handleUnsync = async (tidpId) => {
    try {
      const results = await unsyncTIDP(tidpId);
      showToast(`${results.deleted} auto-populated deliverables removed`, 'success');
    } catch (error) {
      showToast(`Unsync failed: ${error.message}`, 'error');
    }
  };

  const handleExport = async (exportOptions) => {
    try {
      const { format, matrices, details } = exportOptions;

      const options = {
        matrices: {
          imActivities: matrices.imActivities,
          deliverables: matrices.deliverables
        },
        details: {
          descriptions: details.descriptions,
          isoReferences: details.isoReferences,
          syncStatus: details.syncStatus
        },
        summary: details.summary
      };

      if (format === 'excel') {
        await ApiService.exportResponsibilityMatricesExcel(
          projectId,
          'BEP Project', // TODO: Get real project name
          options
        );
        showToast('Excel export downloaded successfully', 'success');
      } else if (format === 'pdf') {
        await ApiService.exportResponsibilityMatricesPDF(
          projectId,
          'BEP Project', // TODO: Get real project name
          options
        );
        showToast('PDF export downloaded successfully', 'success');
      }

      setShowExportPanel(false);
    } catch (error) {
      showToast(`Export failed: ${error.message}`, 'error');
    }
  };

  // Get unique teams from deliverables for form
  const availableTeams = React.useMemo(() => {
    const teams = new Set(deliverables.map(d => d.responsible_task_team).filter(Boolean));
    return Array.from(teams).sort();
  }, [deliverables]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                ISO 19650 Responsibility Matrices
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage information management activities and deliverables per ISO 19650-2
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>

          {/* Matrix Selector */}
          <div className="flex items-center justify-between">
            <MatrixSelector
              activeMatrix={activeMatrix}
              onMatrixChange={setActiveMatrix}
              imActivitiesCount={imActivities.length}
              deliverablesCount={deliverables.length}
            />

            <div className="flex items-center gap-2">
              {activeMatrix === 'deliverables' && (
                <button
                  onClick={() => setShowSyncPanel(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Settings size={18} />
                  TIDP Sync
                </button>
              )}
              <button
                onClick={() => setShowExportPanel(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            {activeMatrix === 'im-activities' ? (
              <>
                <p className="font-medium mb-1">Information Management Activities Matrix</p>
                <p className="text-blue-800">
                  Define responsibility assignments (RACI) for information management activities based on ISO 19650-2 Annex A.
                  Pre-populated with 25 standard activities, you can add custom activities as needed.
                </p>
              </>
            ) : (
              <>
                <p className="font-medium mb-1">Information Deliverables Matrix</p>
                <p className="text-blue-800">
                  Track all information deliverables from TIDPs. Auto-sync from existing TIDPs or add manual deliverables.
                  Shows responsibility, schedule, format, and status for each deliverable.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Matrix Content */}
        {activeMatrix === 'im-activities' ? (
          <IMActivitiesMatrix
            activities={imActivities}
            onEdit={handleEditActivity}
            onDelete={handleDeleteActivity}
            onAddCustom={handleAddCustomActivity}
            onExport={() => setShowExportPanel(true)}
            loading={imActivitiesLoading}
          />
        ) : (
          <DeliverablesMatrix
            deliverables={deliverables}
            syncStatus={syncStatus}
            onEdit={handleEditDeliverable}
            onDelete={handleDeleteDeliverable}
            onAddManual={handleAddManualDeliverable}
            onSync={() => setShowSyncPanel(true)}
            onExport={() => setShowExportPanel(true)}
            loading={deliverablesLoading}
          />
        )}
      </div>

      {/* Modal Dialogs */}
      {showImActivitiesForm && (
        <IMActivitiesForm
          activity={editingActivity}
          onSave={handleSaveActivity}
          onCancel={() => {
            setShowImActivitiesForm(false);
            setEditingActivity(null);
          }}
        />
      )}

      {showDeliverableForm && (
        <DeliverableForm
          deliverable={editingDeliverable}
          teams={availableTeams}
          onSave={handleSaveDeliverable}
          onCancel={() => {
            setShowDeliverableForm(false);
            setEditingDeliverable(null);
          }}
        />
      )}

      {showSyncPanel && (
        <TIDPSyncPanel
          syncStatus={syncStatus}
          onSyncAll={handleSyncAll}
          onSyncSingle={handleSyncSingle}
          onUnsync={handleUnsync}
          loading={syncStatusLoading}
          onClose={() => setShowSyncPanel(false)}
        />
      )}

      {showExportPanel && (
        <MatrixExportPanel
          onExport={handleExport}
          onClose={() => setShowExportPanel(false)}
        />
      )}

      {/* Toast Notification */}
      {toast.open && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${
              toast.type === 'success'
                ? 'bg-green-600 text-white'
                : toast.type === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            {toast.type === 'success' && <CheckCircle size={20} />}
            {toast.type === 'error' && <AlertCircle size={20} />}
            {toast.type === 'info' && <Info size={20} />}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsibilityMatrixManager;
