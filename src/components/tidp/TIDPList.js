import React, { useRef } from 'react';
import { Users, Download, Upload, Plus } from 'lucide-react';
import { exportTidpCsvTemplate, importTidpFromCsv } from '../../utils/csvHelpers';
import apiService from '../../services/apiService';

const TIDPList = ({
  tidps,
  templates,
  selectedTemplate,
  onTemplateChange,
  exportLoading,
  onExportPdf,
  onExportExcel,
  onViewDetails,
  onShowTidpForm,
  onShowImportDialog,
  onImportCsv,
  onExportAllPdfs,
  onExportConsolidated,
  bulkExportRunning,
  bulkProgress,
  midps,
  onToast,
  onBulkUpdate
}) => {
  const csvInputRef = useRef(null);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [showBulkEdit, setShowBulkEdit] = React.useState(false);
  const [bulkValues, setBulkValues] = React.useState({ taskTeam: '', discipline: '', teamLeader: '' });

  const handleCsvImport = (event) => {
    const file = event.target.files[0];
    importTidpFromCsv(
      file,
      (containers) => {
        onImportCsv(containers);
        onToast({ open: true, message: `Imported ${containers.length} deliverables from CSV. Please fill in TIDP details and save.`, type: 'success' });
      },
      (error) => {
        onToast({ open: true, message: 'Failed to import CSV: ' + error.message, type: 'error' });
      }
    );
    event.target.value = '';
  };

  const handleExportTemplate = () => {
    try {
      exportTidpCsvTemplate();
      onToast({ open: true, message: 'TIDP CSV template downloaded successfully!', type: 'success' });
    } catch (error) {
      console.error('Download failed:', error);
      onToast({ open: true, message: 'Failed to download CSV template', type: 'error' });
    }
  };

  const handleExportAllPdfs = async () => {
    try {
      await onExportAllPdfs();
    } catch (error) {
      onToast({ open: true, message: error.message, type: 'info' });
    }
  };

  const handleExportConsolidated = async () => {
    if (midps.length === 0) {
      onToast({ open: true, message: 'No MIDP available to consolidate', type: 'info' });
      return;
    }
    try {
      await onExportConsolidated('project-1', midps[0].id);
      onToast({ open: true, message: 'Consolidated project export downloaded', type: 'success' });
    } catch (err) {
      console.error(err);
      onToast({ open: true, message: 'Failed consolidated export: ' + (err.message || err), type: 'error' });
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const clearSelection = () => setSelectedIds([]);

  const applyBulkEdit = async () => {
    if (selectedIds.length === 0) {
      onToast({ open: true, message: 'No TIDPs selected for bulk edit', type: 'info' });
      return;
    }

    // Build updates array: only include fields that have a non-empty value in bulkValues
    const fields = {};
    Object.keys(bulkValues).forEach((k) => {
      if (bulkValues[k] && String(bulkValues[k]).trim() !== '') fields[k] = bulkValues[k];
    });
    if (Object.keys(fields).length === 0) {
      onToast({ open: true, message: 'No bulk changes provided', type: 'info' });
      return;
    }

    try {
      // call parent via onBulkUpdate if provided, else try to call ApiService directly as fallback
      if (typeof onBulkUpdate === 'function') {
        await onBulkUpdate(selectedIds.map((id) => ({ id, update: fields })));
      } else {
        await apiService.updateTIDPBatch(selectedIds.map((id) => ({ id, update: fields })));
      }
      onToast({ open: true, message: `Updated ${selectedIds.length} TIDPs`, type: 'success' });
      setShowBulkEdit(false);
      clearSelection();
      setBulkValues({ taskTeam: '', discipline: '', teamLeader: '' });
    } catch (err) {
      console.error('Bulk update failed', err);
      onToast({ open: true, message: 'Bulk update failed: ' + (err.message || err), type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        {/* Template selector */}
        <div className="mb-4 flex items-center space-x-3">
          <label className="text-sm">Export template:</label>
          <select
            value={selectedTemplate || ''}
            onChange={(e) => onTemplateChange(e.target.value || null)}
            className="border p-2 rounded"
          >
            <option value="">Default</option>
            {templates.map((t) => (
              <option key={t.id || t.name} value={t.id || t.name}>
                {t.name || t.id}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Task Information Delivery Plans</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onShowImportDialog}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Import TIDPs</span>
            </button>
            <button
              onClick={onShowTidpForm}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New TIDP</span>
            </button>
            <button
              onClick={handleExportTemplate}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
              title="Download a CSV template with sample TIDP deliverables to fill and import"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV Template</span>
            </button>
            <div className="relative">
              <input
                ref={csvInputRef}
                type="file"
                accept=".csv"
                onChange={handleCsvImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="csv-import-tidp"
              />
              <label
                htmlFor="csv-import-tidp"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Import CSV</span>
              </label>
            </div>
          </div>
        </div>

        {/* Bulk Export Section */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Bulk Operations</h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportAllPdfs}
              disabled={bulkExportRunning}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {bulkExportRunning
                ? `${bulkProgress.done}/${bulkProgress.total} exporting...`
                : 'Export all TIDP PDFs'}
            </button>

            <button
              onClick={handleExportConsolidated}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Export consolidated project
            </button>
          </div>
        </div>

        {tidps.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">No TIDPs created yet</p>
            <p className="text-sm">Create your first Task Information Delivery Plan</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <button
                  onClick={() => setShowBulkEdit(true)}
                  className="bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                  disabled={selectedIds.length === 0}
                >
                  Bulk edit ({selectedIds.length})
                </button>
                <button onClick={clearSelection} className="bg-gray-200 px-3 py-1 rounded text-sm">
                  Clear selection
                </button>
              </div>
            </div>

            {showBulkEdit && (
              <div className="bg-white border rounded p-4 mb-4">
                <h4 className="font-semibold mb-2">Bulk edit {selectedIds.length} TIDPs</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <input
                    placeholder="Task Team"
                    value={bulkValues.taskTeam}
                    onChange={(e) => setBulkValues((b) => ({ ...b, taskTeam: e.target.value }))}
                    className="p-2 border rounded"
                  />
                  <input
                    placeholder="Discipline"
                    value={bulkValues.discipline}
                    onChange={(e) => setBulkValues((b) => ({ ...b, discipline: e.target.value }))}
                    className="p-2 border rounded"
                  />
                  <input
                    placeholder="Team Leader"
                    value={bulkValues.teamLeader}
                    onChange={(e) => setBulkValues((b) => ({ ...b, teamLeader: e.target.value }))}
                    className="p-2 border rounded"
                  />
                </div>
                <div className="flex space-x-2">
                  <button onClick={applyBulkEdit} className="bg-blue-600 text-white px-3 py-1 rounded">Apply</button>
                  <button onClick={() => setShowBulkEdit(false)} className="bg-gray-200 px-3 py-1 rounded">Cancel</button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tidps.map((tidp, index) => (
                <div
                  key={tidp.id || index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="mb-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(tidp.id)}
                      onChange={() => toggleSelect(tidp.id)}
                      className="mr-2"
                      aria-label={`Select TIDP ${tidp.taskTeam || tidp.id}`}
                    />
                    <span className="font-semibold">{tidp.taskTeam || `TIDP ${index + 1}`}</span>
                  </div>
                  
                {/* Status badge */}
                {tidp.status === 'Active' && (
                  <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full mb-3">
                    Attivo
                  </div>
                )}
                  <p className="text-gray-600 text-sm mb-3">{tidp.description || tidp.discipline || 'Task information delivery plan'}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewDetails(tidp)}
                      className="flex-1 bg-blue-50 text-blue-700 py-2 px-3 rounded text-sm hover:bg-blue-100 transition-colors"
                    >
                      View
                    </button>
                    <button
                      disabled={!!exportLoading[tidp.id]}
                      onClick={() => onExportPdf(tidp.id)}
                      className="bg-gray-50 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-100 transition-colors"
                    >
                      {exportLoading[tidp.id] ? '...' : <Download className="w-4 h-4" />}
                    </button>
                    <button
                      disabled={!!exportLoading[tidp.id]}
                      onClick={() => onExportExcel(tidp.id)}
                      className="bg-gray-50 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-100 transition-colors"
                    >
                      {exportLoading[tidp.id] ? '...' : 'XLSX'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TIDPList;