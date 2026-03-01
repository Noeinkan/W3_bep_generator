import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const DISCIPLINES = [
  'Architecture', 'Structure', 'MEP', 'Civil', 'Landscape',
  'Interiors', 'Fire Protection', 'Acoustics', 'Other',
];

const STAGES = [
  'Project Brief', 'Concept Design', 'Developed Design',
  'Technical Design', 'Construction', 'Handover', 'In Use',
];

const EMPTY = { discipline: '', stage: '', element: '', geometry: '', alphanumeric: '', documentation: '', notes: '' };

/**
 * Modal form for adding or editing a LOIN row.
 * Props:
 *   row      — existing row object (edit mode) or null (create mode)
 *   onSave   — called with form data; parent handles API call
 *   onClose  — close without saving
 */
const LoinRowForm = ({ row, onSave, onClose }) => {
  const [form, setForm] = useState(EMPTY);
  const [customDiscipline, setCustomDiscipline] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (row) {
      const isCustom = row.discipline && !DISCIPLINES.includes(row.discipline);
      setForm({
        discipline: isCustom ? 'Other' : (row.discipline || ''),
        stage: row.stage || '',
        element: row.element || '',
        geometry: row.geometry || '',
        alphanumeric: row.alphanumeric || '',
        documentation: row.documentation || '',
        notes: row.notes || '',
      });
      if (isCustom) setCustomDiscipline(row.discipline);
    } else {
      setForm(EMPTY);
      setCustomDiscipline('');
    }
    setErrors({});
  }, [row]);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const validate = () => {
    const e = {};
    const disc = form.discipline === 'Other' ? customDiscipline.trim() : form.discipline;
    if (!disc) e.discipline = 'Discipline is required';
    if (!form.stage) e.stage = 'Stage is required';
    if (!form.element.trim()) e.element = 'Element is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const discipline = form.discipline === 'Other' ? customDiscipline.trim() : form.discipline;
    await onSave({ ...form, discipline });
    setSaving(false);
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 ${errors[field] ? 'border-red-400' : 'border-gray-300'}`;

  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {row ? 'Edit LOIN Row' : 'Add LOIN Row'}
          </h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {/* Discipline + Stage row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Discipline <span className="text-red-500">*</span></label>
              <select value={form.discipline} onChange={e => set('discipline', e.target.value)} className={inputClass('discipline')}>
                <option value="">Select discipline…</option>
                {DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {form.discipline === 'Other' && (
                <input
                  type="text"
                  value={customDiscipline}
                  onChange={e => setCustomDiscipline(e.target.value)}
                  placeholder="Enter discipline name"
                  className="mt-2 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              )}
              {errors.discipline && <p className="mt-1 text-xs text-red-500">{errors.discipline}</p>}
            </div>
            <div>
              <label className={labelClass}>Stage <span className="text-red-500">*</span></label>
              <select value={form.stage} onChange={e => set('stage', e.target.value)} className={inputClass('stage')}>
                <option value="">Select stage…</option>
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.stage && <p className="mt-1 text-xs text-red-500">{errors.stage}</p>}
            </div>
          </div>

          {/* Element */}
          <div>
            <label className={labelClass}>Element / System <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.element}
              onChange={e => set('element', e.target.value)}
              placeholder="e.g. Walls, Slabs, HVAC ducts, Fire doors…"
              className={inputClass('element')}
            />
            {errors.element && <p className="mt-1 text-xs text-red-500">{errors.element}</p>}
          </div>

          {/* ISO 19650 three categories */}
          <div className="bg-teal-50 rounded-lg p-4 space-y-3">
            <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide">ISO 19650 — Information Requirements</p>

            <div>
              <label className={labelClass}>Geometry</label>
              <textarea
                rows={2}
                value={form.geometry}
                onChange={e => set('geometry', e.target.value)}
                placeholder="e.g. 3D solid model, LOD 200; location, orientation, and overall dimensions"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 resize-none"
              />
            </div>

            <div>
              <label className={labelClass}>Alphanumeric (Data / Properties)</label>
              <textarea
                rows={2}
                value={form.alphanumeric}
                onChange={e => set('alphanumeric', e.target.value)}
                placeholder="e.g. Material, load-bearing capacity, fire rating, manufacturer, cost codes"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 resize-none"
              />
            </div>

            <div>
              <label className={labelClass}>Documentation</label>
              <textarea
                rows={2}
                value={form.documentation}
                onChange={e => set('documentation', e.target.value)}
                placeholder="e.g. Product data sheets, specifications, as-built drawings, O&M manuals"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 resize-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Optional — additional context or special conditions"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : row ? 'Save Changes' : 'Add Row'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoinRowForm;
