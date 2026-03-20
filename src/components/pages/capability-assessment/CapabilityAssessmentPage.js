import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ArrowLeft, Plus, RefreshCw, Users, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';
import { useProject } from '../../../contexts/ProjectContext';
import apiService from '../../../services/apiService';
import { ConfirmDialog } from '../../common';
import toast from 'react-hot-toast';

const TRAINING_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'aware', label: 'Awareness' },
  { value: 'trained', label: 'Trained' },
  { value: 'certified', label: 'Certified' },
];

const COMPLIANCE_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'partially-compliant', label: 'Partially Compliant' },
  { value: 'compliant', label: 'Compliant' },
  { value: 'non-compliant', label: 'Non-Compliant' },
];

const PROFICIENCY_OPTIONS = ['expert', 'proficient', 'aware'];

const COMPLIANCE_BADGE = {
  'compliant': 'bg-green-100 text-green-800',
  'non-compliant': 'bg-red-100 text-red-800',
  'partially-compliant': 'bg-yellow-100 text-yellow-800',
  'draft': 'bg-gray-100 text-gray-600',
};

function emptyAssessment(projectId) {
  return {
    project_id: projectId,
    team_name: '',
    team_role: '',
    organisation: '',
    fte_available: '',
    fte_required: '',
    key_personnel: [],
    software_platforms: [],
    iso19650_training: 'none',
    other_certifications: [],
    training_plan: '',
    similar_projects: '',
    capability_gaps: '',
    mitigation_actions: '',
    compliance_status: 'draft',
  };
}

function InlinePersonnelTable({ rows, onChange }) {
  const add = () => onChange([...rows, { name: '', role: '', experience_years: '' }]);
  const remove = (i) => onChange(rows.filter((_, idx) => idx !== i));
  const update = (i, field, value) => {
    const next = rows.map((r, idx) => idx === i ? { ...r, [field]: value } : r);
    onChange(next);
  };
  return (
    <div>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left p-2 border border-gray-200 font-medium text-gray-700">Name</th>
            <th className="text-left p-2 border border-gray-200 font-medium text-gray-700">Role</th>
            <th className="text-left p-2 border border-gray-200 font-medium text-gray-700 w-24">Years exp.</th>
            <th className="p-2 border border-gray-200 w-10"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="p-1 border border-gray-200">
                <input className="w-full px-2 py-1 text-sm focus:outline-none" value={row.name || ''} onChange={e => update(i, 'name', e.target.value)} placeholder="Name" />
              </td>
              <td className="p-1 border border-gray-200">
                <input className="w-full px-2 py-1 text-sm focus:outline-none" value={row.role || ''} onChange={e => update(i, 'role', e.target.value)} placeholder="Role" />
              </td>
              <td className="p-1 border border-gray-200">
                <input type="number" min="0" className="w-full px-2 py-1 text-sm focus:outline-none" value={row.experience_years || ''} onChange={e => update(i, 'experience_years', e.target.value)} placeholder="0" />
              </td>
              <td className="p-1 border border-gray-200 text-center">
                <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-xs font-bold px-1">✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={add} className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium">+ Add person</button>
    </div>
  );
}

function InlineSoftwareTable({ rows, onChange }) {
  const add = () => onChange([...rows, { name: '', version: '', proficiency: 'aware' }]);
  const remove = (i) => onChange(rows.filter((_, idx) => idx !== i));
  const update = (i, field, value) => {
    const next = rows.map((r, idx) => idx === i ? { ...r, [field]: value } : r);
    onChange(next);
  };
  return (
    <div>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left p-2 border border-gray-200 font-medium text-gray-700">Software</th>
            <th className="text-left p-2 border border-gray-200 font-medium text-gray-700 w-28">Version</th>
            <th className="text-left p-2 border border-gray-200 font-medium text-gray-700 w-32">Proficiency</th>
            <th className="p-2 border border-gray-200 w-10"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="p-1 border border-gray-200">
                <input className="w-full px-2 py-1 text-sm focus:outline-none" value={row.name || ''} onChange={e => update(i, 'name', e.target.value)} placeholder="e.g. Revit" />
              </td>
              <td className="p-1 border border-gray-200">
                <input className="w-full px-2 py-1 text-sm focus:outline-none" value={row.version || ''} onChange={e => update(i, 'version', e.target.value)} placeholder="2024" />
              </td>
              <td className="p-1 border border-gray-200">
                <select className="w-full px-2 py-1 text-sm focus:outline-none bg-transparent" value={row.proficiency || 'aware'} onChange={e => update(i, 'proficiency', e.target.value)}>
                  {PROFICIENCY_OPTIONS.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                </select>
              </td>
              <td className="p-1 border border-gray-200 text-center">
                <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-xs font-bold px-1">✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={add} className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium">+ Add software</button>
    </div>
  );
}

function SectionHeading({ children }) {
  return <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 border-b border-gray-100 pb-1">{children}</h3>;
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputClass = 'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300';
const textareaClass = `${inputClass} resize-y min-h-[72px]`;

function DetailForm({ assessment, onSave, onCancel, saving }) {
  const [form, setForm] = useState({ ...assessment });

  useEffect(() => { setForm({ ...assessment }); }, [assessment]);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.team_name?.trim()) { toast.error('Team name is required'); return; }
    onSave(form);
  };

  const fteCoverage = form.fte_required > 0 && form.fte_available != null
    ? Math.round((parseFloat(form.fte_available) / parseFloat(form.fte_required)) * 100)
    : null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Team Identity */}
        <div>
          <SectionHeading>Team Identity</SectionHeading>
          <div className="grid grid-cols-1 gap-3">
            <Field label="Team Name *">
              <input required className={inputClass} value={form.team_name || ''} onChange={e => set('team_name', e.target.value)} placeholder="e.g. Structural Task Team" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Role / Discipline">
                <input className={inputClass} value={form.team_role || ''} onChange={e => set('team_role', e.target.value)} placeholder="e.g. Structural" />
              </Field>
              <Field label="Organisation">
                <input className={inputClass} value={form.organisation || ''} onChange={e => set('organisation', e.target.value)} placeholder="Company name" />
              </Field>
            </div>
          </div>
        </div>

        {/* Capacity */}
        <div>
          <SectionHeading>Capacity (FTE)</SectionHeading>
          <div className="grid grid-cols-2 gap-3">
            <Field label="FTE Available">
              <input type="number" min="0" step="0.5" className={inputClass} value={form.fte_available ?? ''} onChange={e => set('fte_available', e.target.value === '' ? null : parseFloat(e.target.value))} placeholder="e.g. 2.5" />
            </Field>
            <Field label="FTE Required">
              <input type="number" min="0" step="0.5" className={inputClass} value={form.fte_required ?? ''} onChange={e => set('fte_required', e.target.value === '' ? null : parseFloat(e.target.value))} placeholder="e.g. 3.0" />
            </Field>
          </div>
          {fteCoverage !== null && (
            <p className={`mt-2 text-xs font-medium ${fteCoverage >= 100 ? 'text-green-600' : fteCoverage >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
              FTE coverage: {fteCoverage}%
            </p>
          )}
        </div>

        {/* Key Personnel */}
        <div>
          <SectionHeading>Key Personnel</SectionHeading>
          <InlinePersonnelTable
            rows={Array.isArray(form.key_personnel) ? form.key_personnel : []}
            onChange={v => set('key_personnel', v)}
          />
        </div>

        {/* Software Competency */}
        <div>
          <SectionHeading>Software Competency</SectionHeading>
          <InlineSoftwareTable
            rows={Array.isArray(form.software_platforms) ? form.software_platforms : []}
            onChange={v => set('software_platforms', v)}
          />
        </div>

        {/* Standards & Training */}
        <div>
          <SectionHeading>Standards &amp; Training</SectionHeading>
          <div className="space-y-3">
            <Field label="ISO 19650 Training Level">
              <select className={inputClass} value={form.iso19650_training || 'none'} onChange={e => set('iso19650_training', e.target.value)}>
                {TRAINING_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field label="Training Plan">
              <textarea className={textareaClass} value={form.training_plan || ''} onChange={e => set('training_plan', e.target.value)} placeholder="Describe planned or completed training activities…" />
            </Field>
          </div>
        </div>

        {/* Experience */}
        <div>
          <SectionHeading>Experience</SectionHeading>
          <Field label="Similar Projects">
            <textarea className={textareaClass} value={form.similar_projects || ''} onChange={e => set('similar_projects', e.target.value)} placeholder="Describe relevant project experience…" />
          </Field>
        </div>

        {/* Gap Analysis */}
        <div>
          <SectionHeading>Gap Analysis</SectionHeading>
          <div className="space-y-3">
            <Field label="Capability Gaps">
              <textarea className={textareaClass} value={form.capability_gaps || ''} onChange={e => set('capability_gaps', e.target.value)} placeholder="Identify any capability gaps…" />
            </Field>
            <Field label="Mitigation Actions">
              <textarea className={textareaClass} value={form.mitigation_actions || ''} onChange={e => set('mitigation_actions', e.target.value)} placeholder="Describe actions to address gaps…" />
            </Field>
          </div>
        </div>

        {/* Compliance */}
        <div>
          <SectionHeading>Compliance Status</SectionHeading>
          <Field label="Status">
            <select className={inputClass} value={form.compliance_status || 'draft'} onChange={e => set('compliance_status', e.target.value)}>
              {COMPLIANCE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
        </div>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-white flex-shrink-0">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}

function KpiCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value ?? '—'}</p>
      </div>
    </div>
  );
}

const CapabilityAssessmentPage = () => {
  const navigate = useNavigate();
  const { currentProject, projects, selectProject } = useProject();

  const [assessments, setAssessments] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [summary, setSummary] = useState(null);

  const handleBack = () => {
    const returnUrl = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('bep-return-url') : null;
    if (returnUrl) { sessionStorage.removeItem('bep-return-url'); navigate(returnUrl); }
    else navigate('/bep-generator');
  };

  const loadData = useCallback(async (projectId) => {
    if (!projectId) { setAssessments([]); setSummary(null); setSelectedId(null); setIsNew(false); return; }
    setLoading(true);
    try {
      const [listRes, summaryRes] = await Promise.all([
        apiService.getCapabilityAssessments(projectId),
        apiService.getCapabilityAssessmentSummary(projectId),
      ]);
      setAssessments(listRes?.data ?? []);
      setSummary(summaryRes?.data ?? null);
    } catch {
      toast.error('Failed to load capability assessments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(currentProject?.id);
  }, [currentProject?.id, loadData]);

  const handleProjectChange = (e) => {
    const proj = projects.find(p => p.id === e.target.value);
    if (proj) selectProject(proj);
  };

  const selectedAssessment = isNew
    ? emptyAssessment(currentProject?.id)
    : assessments.find(a => a.id === selectedId) ?? null;

  const openNew = () => { setIsNew(true); setSelectedId(null); };
  const openExisting = (id) => { setSelectedId(id); setIsNew(false); };
  const closeDetail = () => { setSelectedId(null); setIsNew(false); };

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (isNew) {
        const res = await apiService.createCapabilityAssessment({ ...formData, projectId: currentProject.id });
        setAssessments(prev => [...prev, res.data]);
        setIsNew(false);
        setSelectedId(res.data.id);
        toast.success('Assessment created');
      } else {
        const res = await apiService.updateCapabilityAssessment(selectedId, formData);
        setAssessments(prev => prev.map(a => a.id === selectedId ? res.data : a));
        toast.success('Assessment saved');
      }
      // Refresh summary
      const summaryRes = await apiService.getCapabilityAssessmentSummary(currentProject.id);
      setSummary(summaryRes?.data ?? null);
    } catch {
      toast.error('Failed to save assessment');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await apiService.deleteCapabilityAssessment(deleteTarget.id);
      setAssessments(prev => prev.filter(a => a.id !== deleteTarget.id));
      if (selectedId === deleteTarget.id) closeDetail();
      toast.success('Assessment deleted');
      const summaryRes = await apiService.getCapabilityAssessmentSummary(currentProject.id);
      setSummary(summaryRes?.data ?? null);
    } catch {
      toast.error('Failed to delete assessment');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleGenerateFromTidps = async () => {
    if (!currentProject?.id) return;
    setGenerating(true);
    try {
      const res = await apiService.generateCapabilityFromTidps(currentProject.id);
      const created = res?.data ?? [];
      if (created.length === 0) {
        toast('No new TIDPs to generate from — all teams already have assessments.');
      } else {
        toast.success(`${created.length} assessment${created.length > 1 ? 's' : ''} generated`);
        await loadData(currentProject.id);
      }
    } catch {
      toast.error('Failed to generate from TIDPs');
    } finally {
      setGenerating(false);
    }
  };

  const showDetail = isNew || selectedId != null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50" data-page-uri="/capability-assessment">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Capability Assessment</h1>
              <p className="text-sm text-gray-500">Supply chain capability per task team — ISO 19650-2 Clause 5.3</p>
            </div>
          </div>
          <button type="button" onClick={handleBack} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Project selector + toolbar */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4 flex items-center gap-4 flex-wrap">
          <label className="text-sm font-medium text-gray-700 flex-shrink-0">Project:</label>
          {projects.length === 0 ? (
            <span className="text-sm text-gray-400 italic">No projects found</span>
          ) : (
            <select
              value={currentProject?.id || ''}
              onChange={handleProjectChange}
              className="flex-1 min-w-48 max-w-xs px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="">Select a project…</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          )}

          {currentProject && (
            <div className="flex items-center gap-2 ml-auto flex-wrap">
              <button type="button" onClick={() => loadData(currentProject.id)} title="Refresh" className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                type="button"
                onClick={handleGenerateFromTidps}
                disabled={generating}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <Activity className="w-4 h-4" />
                {generating ? 'Generating…' : 'Auto-generate from TIDPs'}
              </button>
              <button
                type="button"
                onClick={openNew}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Team
              </button>
            </div>
          )}
        </div>

        {/* KPI summary cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <KpiCard icon={Users} label="Total Teams" value={summary.total} color="bg-indigo-500" />
            <KpiCard icon={CheckCircle2} label="Compliant" value={summary.compliant} color="bg-green-500" />
            <KpiCard icon={AlertTriangle} label="Open Gaps" value={summary.openGaps} color="bg-yellow-500" />
            <KpiCard icon={Activity} label="Avg FTE Coverage" value={summary.avgFteCoverage != null ? `${summary.avgFteCoverage}%` : '—'} color="bg-blue-500" />
          </div>
        )}

        {/* Main content area */}
        {!currentProject ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center text-gray-400">
            <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Select a project to view capability assessments.</p>
          </div>
        ) : loading ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center text-gray-400">
            <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin opacity-50" />
            <p className="text-sm">Loading…</p>
          </div>
        ) : (
          <div className="flex gap-4 items-start">
            {/* Team list */}
            <div className="w-72 flex-shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {assessments.length === 0 && !isNew ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                  <p>No assessments yet.</p>
                  <button type="button" onClick={openNew} className="mt-3 text-indigo-600 hover:underline text-sm font-medium">Add the first one</button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {isNew && (
                    <li className="px-4 py-3 bg-indigo-50 border-l-4 border-indigo-500">
                      <p className="text-sm font-medium text-indigo-700">New assessment</p>
                    </li>
                  )}
                  {assessments.map(a => (
                    <li
                      key={a.id}
                      className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors flex items-start justify-between gap-2 ${selectedId === a.id && !isNew ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''}`}
                      onClick={() => openExisting(a.id)}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{a.team_name}</p>
                        {a.team_role && <p className="text-xs text-gray-500 truncate">{a.team_role}</p>}
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${COMPLIANCE_BADGE[a.compliance_status] || COMPLIANCE_BADGE.draft}`}>
                          {COMPLIANCE_OPTIONS.find(o => o.value === a.compliance_status)?.label ?? a.compliance_status}
                        </span>
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); setDeleteTarget(a); }}
                          className="text-xs text-red-400 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Detail form */}
            {showDetail && selectedAssessment ? (
              <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                <DetailForm
                  key={isNew ? 'new' : selectedId}
                  assessment={selectedAssessment}
                  onSave={handleSave}
                  onCancel={closeDetail}
                  saving={saving}
                />
              </div>
            ) : (
              <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center text-gray-400">
                <p className="text-sm">Select a team from the list to view or edit its assessment.</p>
              </div>
            )}
          </div>
        )}

      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Assessment"
        message={`Delete the capability assessment for "${deleteTarget?.team_name}"? This cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
};

export default CapabilityAssessmentPage;
