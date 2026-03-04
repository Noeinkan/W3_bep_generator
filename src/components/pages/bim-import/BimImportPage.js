import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft, CheckCircle, AlertCircle, FileBox } from 'lucide-react';
import toast from 'react-hot-toast';
import { parseIfcFile } from '../../../services/bimService';
import ApiService from '../../../services/apiService';
import { useProject } from '../../../contexts/ProjectContext';

const MAX_SIZE_MB = 50;
const DISCIPLINE_COLORS = {
  structural: 'bg-amber-100 text-amber-800',
  architectural: 'bg-sky-100 text-sky-800',
  mep: 'bg-emerald-100 text-emerald-800',
  civil: 'bg-violet-100 text-violet-800'
};

export default function BimImportPage() {
  const navigate = useNavigate();
  const { currentProject } = useProject();
  const projectId = currentProject?.id || null;

  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [parseError, setParseError] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const [rows, setRows] = useState([]);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });
  const [importErrors, setImportErrors] = useState([]);

  const onFileSelect = useCallback((selectedFile) => {
    setParseError('');
    if (!selectedFile) {
      setFile(null);
      return;
    }
    const ext = selectedFile.name.toLowerCase().endsWith('.ifc');
    if (!ext) {
      setParseError('Only .ifc files are allowed.');
      setFile(null);
      return;
    }
    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      setParseError(`File must be under ${MAX_SIZE_MB} MB.`);
      setFile(null);
      return;
    }
    setFile(selectedFile);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const f = e.dataTransfer?.files?.[0];
      if (f) onFileSelect(f);
    },
    [onFileSelect]
  );
  const handleDragOver = useCallback((e) => e.preventDefault(), []);
  const handleFileInput = useCallback(
    (e) => {
      const f = e.target?.files?.[0];
      onFileSelect(f || null);
    },
    [onFileSelect]
  );

  const handleParse = useCallback(async () => {
    if (!file) return;
    setParsing(true);
    setParseError('');
    try {
      const result = await parseIfcFile(file);
      setParseResult(result);
      setRows(
        (result.suggestedDeliverables || []).map((d) => ({
          ...d,
          included: true,
          exchangeStage: d.exchangeStage || '',
          responsibleTaskTeam: d.responsibleTaskTeam || ''
        }))
      );
      setStep(2);
    } catch (err) {
      setParseError(err.response?.data?.error || err.message || 'Failed to parse IFC file.');
    } finally {
      setParsing(false);
    }
  }, [file]);

  const setRow = useCallback((index, updates) => {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  }, []);

  const selectedCount = rows.filter((r) => r.included).length;

  const handleImport = useCallback(async () => {
    if (!projectId) {
      toast.error('No project selected.');
      return;
    }
    const toImport = rows.filter((r) => r.included);
    if (toImport.length === 0) {
      toast.error('Select at least one deliverable.');
      return;
    }
    setStep(3);
    setImporting(true);
    setImportProgress({ current: 0, total: toImport.length });
    setImportErrors([]);
    const errors = [];
    for (let i = 0; i < toImport.length; i++) {
      setImportProgress({ current: i + 1, total: toImport.length });
      const row = toImport[i];
      try {
        await ApiService.createDeliverable({
          projectId,
          deliverableName: row.deliverableName,
          description: row.description || '',
          format: row.format || 'IFC',
          loinLod: row.loinLod || 'LOD 300',
          status: row.status || 'Planned',
          exchangeStage: row.exchangeStage || '',
          responsibleTaskTeam: row.responsibleTaskTeam || '',
          isAutoPopulated: false
        });
      } catch (err) {
        errors.push({ name: row.deliverableName, error: err.response?.data?.error || err.message });
      }
    }
    setImportErrors(errors);
    setImporting(false);
    if (errors.length === 0) {
      toast.success(`${toImport.length} deliverable(s) added to Responsibility Matrix.`);
      navigate('/responsibility-matrix', { replace: true });
    } else {
      toast.error(`${errors.length} of ${toImport.length} failed. See list below.`);
    }
  }, [projectId, rows, navigate]);

  if (!projectId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-ui-text-muted">Select a project first to use IFC Import.</p>
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="mt-4 px-4 py-2 bg-ui-primary text-white rounded-lg hover:bg-ui-primary-hover"
        >
          Go to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-ui-text">IFC Import</h1>
          <p className="text-sm text-ui-text-muted mt-1">
            Upload an IFC file to auto-suggest deliverables for the Responsibility Matrix.
          </p>
        </div>

        {/* Step 1 — Upload */}
        {step === 1 && (
          <div className="space-y-4">
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && document.getElementById('bim-ifc-input')?.click()}
              onClick={() => document.getElementById('bim-ifc-input')?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="rounded-xl border-2 border-dashed border-ui-border bg-ui-surface p-8 text-center transition-colors hover:border-ui-primary/50"
            >
              <input
                id="bim-ifc-input"
                type="file"
                accept=".ifc"
                onChange={handleFileInput}
                className="hidden"
              />
              <Upload className="mx-auto h-12 w-12 text-ui-text-muted" />
              <p className="mt-3 text-sm font-medium text-ui-text">
                {file ? file.name : 'Drag and drop an .ifc file or click to select'}
              </p>
              <p className="mt-1 text-xs text-ui-text-muted">.ifc only, max {MAX_SIZE_MB} MB</p>
            </div>
            {file && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleParse}
                  disabled={parsing}
                  className="px-4 py-2 bg-ui-primary text-white rounded-lg hover:bg-ui-primary-hover disabled:opacity-60"
                >
                  {parsing ? 'Parsing…' : 'Parse File'}
                </button>
              </div>
            )}
            {parseError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                {parseError}
              </div>
            )}
          </div>
        )}

        {/* Step 2 — Preview */}
        {step === 2 && parseResult && (
          <div className="space-y-6">
            <div className="rounded-xl border border-ui-border bg-ui-surface p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-ui-text mb-3 flex items-center gap-2">
                <FileBox className="h-5 w-5" />
                Model info
              </h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <dt className="text-ui-text-muted">Project</dt>
                <dd className="font-medium text-ui-text">{parseResult.projectName || '—'}</dd>
                <dt className="text-ui-text-muted">Author</dt>
                <dd className="text-ui-text">{parseResult.author || '—'}</dd>
                <dt className="text-ui-text-muted">Organization</dt>
                <dd className="text-ui-text">{parseResult.organization || '—'}</dd>
                <dt className="text-ui-text-muted">IFC schema</dt>
                <dd className="text-ui-text">{parseResult.ifcSchema || '—'}</dd>
                <dt className="text-ui-text-muted">File date</dt>
                <dd className="text-ui-text">{parseResult.fileDate || '—'}</dd>
                <dt className="text-ui-text-muted">Disciplines</dt>
                <dd className="flex flex-wrap gap-1">
                  {(parseResult.disciplinesFound || []).length
                    ? parseResult.disciplinesFound.map((d) => (
                        <span
                          key={d}
                          className={`px-2 py-0.5 rounded text-xs font-medium ${DISCIPLINE_COLORS[d] || 'bg-ui-muted text-ui-text'}`}
                        >
                          {d}
                        </span>
                      ))
                    : '—'}
                </dd>
              </dl>
            </div>

            <div className="rounded-xl border border-ui-border bg-ui-surface shadow-sm overflow-hidden">
              <div className="border-b border-ui-border bg-ui-muted px-4 py-3">
                <h2 className="text-lg font-semibold text-ui-text">Suggested deliverables</h2>
                <p className="text-xs text-ui-text-muted mt-0.5">
                  Toggle rows and edit Name / Stage, then import.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ui-border bg-ui-muted">
                      <th className="text-left px-3 py-2 w-10">Include</th>
                      <th className="text-left px-3 py-2">Name</th>
                      <th className="text-left px-3 py-2">Format</th>
                      <th className="text-left px-3 py-2">LOD</th>
                      <th className="text-left px-3 py-2">Stage</th>
                      <th className="text-left px-3 py-2">Team</th>
                      <th className="text-left px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ui-border">
                    {rows.map((row, i) => (
                      <tr key={i} className="bg-ui-surface hover:bg-ui-muted/50">
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={row.included !== false}
                            onChange={(e) => setRow(i, { included: e.target.checked })}
                            className="rounded border-ui-border"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={row.deliverableName || ''}
                            onChange={(e) => setRow(i, { deliverableName: e.target.value })}
                            className="w-full px-2 py-1 border border-ui-border rounded bg-ui-surface text-ui-text"
                          />
                        </td>
                        <td className="px-3 py-2 text-ui-text">{row.format || 'IFC'}</td>
                        <td className="px-3 py-2 text-ui-text">{row.loinLod || 'LOD 300'}</td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={row.exchangeStage || ''}
                            onChange={(e) => setRow(i, { exchangeStage: e.target.value })}
                            placeholder="Stage"
                            className="w-full min-w-[6rem] px-2 py-1 border border-ui-border rounded bg-ui-surface text-ui-text"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={row.responsibleTaskTeam || ''}
                            onChange={(e) => setRow(i, { responsibleTaskTeam: e.target.value })}
                            placeholder="Team"
                            className="w-full min-w-[6rem] px-2 py-1 border border-ui-border rounded bg-ui-surface text-ui-text"
                          />
                        </td>
                        <td className="px-3 py-2 text-ui-text">{row.status || 'Planned'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-4 py-2 border border-ui-border rounded-lg text-ui-text hover:bg-ui-muted"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="button"
                onClick={handleImport}
                disabled={selectedCount === 0}
                className="px-4 py-2 bg-ui-primary text-white rounded-lg hover:bg-ui-primary-hover disabled:opacity-50"
              >
                Import {selectedCount} Deliverable{selectedCount !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Confirm / progress */}
        {step === 3 && (
          <div className="space-y-6">
            {importing ? (
              <div className="rounded-xl border border-ui-border bg-ui-surface p-6 text-center">
                <p className="text-ui-text font-medium">Importing deliverables…</p>
                <p className="text-sm text-ui-text-muted mt-1">
                  {importProgress.current} of {importProgress.total} done
                </p>
                <div className="mt-4 h-2 bg-ui-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-ui-primary transition-all duration-300"
                    style={{
                      width: `${importProgress.total ? (100 * importProgress.current) / importProgress.total : 0}%`
                    }}
                  />
                </div>
              </div>
            ) : (
              <>
                {importErrors.length > 0 ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <h3 className="font-semibold text-red-800 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Some imports failed
                    </h3>
                    <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                      {importErrors.map((e, i) => (
                        <li key={i}>
                          <strong>{e.name}</strong>: {e.error}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-4 py-2 border border-ui-border rounded-lg text-ui-text hover:bg-ui-muted"
                      >
                        Back to preview
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/responsibility-matrix')}
                        className="px-4 py-2 bg-ui-primary text-white rounded-lg hover:bg-ui-primary-hover"
                      >
                        Go to Responsibility Matrix
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-ui-border bg-ui-surface p-6 text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                    <p className="mt-3 font-medium text-ui-text">All deliverables imported.</p>
                    <button
                      type="button"
                      onClick={() => navigate('/responsibility-matrix')}
                      className="mt-4 px-4 py-2 bg-ui-primary text-white rounded-lg hover:bg-ui-primary-hover"
                    >
                      Go to Responsibility Matrix
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
