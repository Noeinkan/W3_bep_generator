import { useState, useCallback } from 'react';
import { Plus, Trash2, FileText } from 'lucide-react';
import Modal from '../../../common/Modal';
import Button from '../../../common/Button';
import { SUITABILITY_CODES, SUITABILITY_MAP } from '../../../../constants/documentHistory';

// ─── helpers ────────────────────────────────────────────────────────────────

const uid = () => crypto.randomUUID();
const today = () => new Date().toISOString().slice(0, 10);

const RACI_OPTIONS = ['R', 'A', 'C', 'I'];

// ─── sub-components ──────────────────────────────────────────────────────────

function SectionHeader({ children }) {
  return (
    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-1 mb-3">
      {children}
    </h3>
  );
}

function EditableCell({ value, onChange, type = 'text', className = '' }) {
  return (
    <input
      type={type}
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      className={`w-full text-sm border-0 bg-transparent focus:ring-1 focus:ring-blue-400 rounded px-1 py-0.5 ${className}`}
    />
  );
}

function SelectCell({ value, onChange, options }) {
  return (
    <select
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      className="w-full text-sm border-0 bg-transparent focus:ring-1 focus:ring-blue-400 rounded px-1 py-0.5"
    >
      {options.map(opt => (
        <option key={opt.value ?? opt} value={opt.value ?? opt}>
          {opt.label ?? opt}
        </option>
      ))}
    </select>
  );
}

function TableWrapper({ headers, children }) {
  return (
    <div className="overflow-x-auto rounded border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {headers.map(h => (
              <th key={h} className="px-2 py-1.5 text-left text-xs font-medium text-gray-600 whitespace-nowrap">
                {h}
              </th>
            ))}
            <th className="w-8" />
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function AddRowButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
    >
      <Plus size={12} /> {label}
    </button>
  );
}

function DeleteRowBtn({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-1 text-gray-300 hover:text-red-500 transition-colors"
    >
      <Trash2 size={12} />
    </button>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

const DocumentHistoryModal = ({ open, onClose, documentHistory, onSave }) => {
  const [local, setLocal] = useState(() => ({
    documentNumber:    documentHistory?.documentNumber    ?? '',
    revisions:         documentHistory?.revisions         ?? [],
    contributors:      documentHistory?.contributors      ?? [],
    governanceTriggers:documentHistory?.governanceTriggers ?? [],
    raciReviewRecord:  documentHistory?.raciReviewRecord  ?? [],
  }));

  const update = useCallback((key, value) => setLocal(prev => ({ ...prev, [key]: value })), []);

  // ── revisions ──────────────────────────────────────────────────────────────
  const setRevision = (id, field, value) => {
    update('revisions', local.revisions.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, [field]: value };
      if (field === 'statusCode') {
        updated.statusLabel = SUITABILITY_MAP[value]?.label ?? value;
      }
      return updated;
    }));
  };

  const addRevision = () => {
    const last = local.revisions[local.revisions.length - 1];
    // Auto-increment P-series revision code
    let nextCode = 'P01';
    if (last?.revisionCode) {
      const m = last.revisionCode.match(/^([A-Z]+)(\d+)$/);
      if (m) nextCode = m[1] + String(Number(m[2]) + 1).padStart(m[2].length, '0');
    }
    update('revisions', [
      ...local.revisions,
      { id: uid(), revisionCode: nextCode, date: today(), statusCode: 'S0', statusLabel: 'Work in Progress', author: '', checkedBy: '', description: '' },
    ]);
  };

  const removeRevision = id => update('revisions', local.revisions.filter(r => r.id !== id));

  // ── contributors ────────────────────────────────────────────────────────────
  const setContributor = (id, field, value) =>
    update('contributors', local.contributors.map(c => c.id === id ? { ...c, [field]: value } : c));
  const addContributor  = () => update('contributors', [...local.contributors, { id: uid(), name: '', company: '', role: '' }]);
  const removeContributor = id => update('contributors', local.contributors.filter(c => c.id !== id));

  // ── governance triggers ─────────────────────────────────────────────────────
  const setTrigger = (id, field, value) =>
    update('governanceTriggers', local.governanceTriggers.map(t => t.id === id ? { ...t, [field]: value } : t));
  const addTrigger    = () => update('governanceTriggers', [...local.governanceTriggers, { id: uid(), trigger: '', accountableParty: '' }]);
  const removeTrigger = id => update('governanceTriggers', local.governanceTriggers.filter(t => t.id !== id));

  // ── RACI ────────────────────────────────────────────────────────────────────
  const setRaci = (id, field, value) =>
    update('raciReviewRecord', local.raciReviewRecord.map(r => r.id === id ? { ...r, [field]: value } : r));
  const addRaci    = () => update('raciReviewRecord', [...local.raciReviewRecord, { id: uid(), function: '', individual: '', raci: 'R', date: today(), comments: '' }]);
  const removeRaci = id => update('raciReviewRecord', local.raciReviewRecord.filter(r => r.id !== id));

  // ── save ────────────────────────────────────────────────────────────────────
  const handleSave = () => {
    onSave(local);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title={
        <span className="flex items-center gap-2">
          <FileText size={16} className="text-blue-600" />
          Section 0 — Document History &amp; Governance
        </span>
      }
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      }
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">

        {/* Document Number */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Document Number</label>
          <input
            type="text"
            value={local.documentNumber}
            onChange={e => update('documentNumber', e.target.value)}
            className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="e.g. ACME-BEP-001"
          />
          <p className="text-xs text-gray-400 mt-0.5">Auto-generated from project name. You can override it.</p>
        </div>

        {/* 0.1 Revision Table */}
        <div>
          <SectionHeader>0.1 — Revision History</SectionHeader>
          <TableWrapper headers={['Rev.', 'Date', 'Status', 'Author', 'Checked By', 'Description of Change']}>
            {local.revisions.map(r => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-2 py-1 w-16">
                  <EditableCell value={r.revisionCode} onChange={v => setRevision(r.id, 'revisionCode', v)} />
                </td>
                <td className="px-2 py-1 w-28 text-xs text-gray-500">{r.date}</td>
                <td className="px-2 py-1 w-48">
                  <SelectCell
                    value={r.statusCode}
                    onChange={v => setRevision(r.id, 'statusCode', v)}
                    options={SUITABILITY_CODES.map(s => ({ value: s.code, label: `${s.code} — ${s.label}` }))}
                  />
                </td>
                <td className="px-2 py-1">
                  <EditableCell value={r.author} onChange={v => setRevision(r.id, 'author', v)} />
                </td>
                <td className="px-2 py-1">
                  <EditableCell value={r.checkedBy} onChange={v => setRevision(r.id, 'checkedBy', v)} />
                </td>
                <td className="px-2 py-1">
                  <EditableCell value={r.description} onChange={v => setRevision(r.id, 'description', v)} />
                </td>
                <td className="px-2 py-1">
                  <DeleteRowBtn onClick={() => removeRevision(r.id)} />
                </td>
              </tr>
            ))}
          </TableWrapper>
          <AddRowButton onClick={addRevision} label="Add Revision" />
        </div>

        {/* 0.2 Contributors */}
        <div>
          <SectionHeader>0.2 — Contributors</SectionHeader>
          <TableWrapper headers={['Name', 'Company', 'Role']}>
            {local.contributors.map(c => (
              <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-2 py-1"><EditableCell value={c.name}    onChange={v => setContributor(c.id, 'name', v)} /></td>
                <td className="px-2 py-1"><EditableCell value={c.company} onChange={v => setContributor(c.id, 'company', v)} /></td>
                <td className="px-2 py-1"><EditableCell value={c.role}    onChange={v => setContributor(c.id, 'role', v)} /></td>
                <td className="px-2 py-1"><DeleteRowBtn onClick={() => removeContributor(c.id)} /></td>
              </tr>
            ))}
          </TableWrapper>
          <AddRowButton onClick={addContributor} label="Add Contributor" />
        </div>

        {/* 0.3 Governance Triggers */}
        <div>
          <SectionHeader>0.3 — Governance Triggers (ISO 19650-2 §5.1.3)</SectionHeader>
          <p className="text-xs text-gray-400 mb-2">Events that require this BEP to be reviewed and updated.</p>
          <TableWrapper headers={['Trigger Event', 'Accountable Party']}>
            {local.governanceTriggers.map(t => (
              <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-2 py-1"><EditableCell value={t.trigger}         onChange={v => setTrigger(t.id, 'trigger', v)} /></td>
                <td className="px-2 py-1"><EditableCell value={t.accountableParty} onChange={v => setTrigger(t.id, 'accountableParty', v)} /></td>
                <td className="px-2 py-1"><DeleteRowBtn onClick={() => removeTrigger(t.id)} /></td>
              </tr>
            ))}
          </TableWrapper>
          <AddRowButton onClick={addTrigger} label="Add Trigger" />
        </div>

        {/* 0.4 RACI Review Record */}
        <div>
          <SectionHeader>0.4 — RACI Review Record</SectionHeader>
          <p className="text-xs text-gray-400 mb-2">Stakeholder sign-off on this BEP document.</p>
          <TableWrapper headers={['Function / Role', 'Individual', 'RACI', 'Date', 'Comments']}>
            {local.raciReviewRecord.map(r => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-2 py-1"><EditableCell value={r.function}   onChange={v => setRaci(r.id, 'function', v)} /></td>
                <td className="px-2 py-1"><EditableCell value={r.individual} onChange={v => setRaci(r.id, 'individual', v)} /></td>
                <td className="px-2 py-1 w-20">
                  <SelectCell value={r.raci} onChange={v => setRaci(r.id, 'raci', v)} options={RACI_OPTIONS} />
                </td>
                <td className="px-2 py-1 w-28 text-xs text-gray-500">{r.date}</td>
                <td className="px-2 py-1"><EditableCell value={r.comments} onChange={v => setRaci(r.id, 'comments', v)} /></td>
                <td className="px-2 py-1"><DeleteRowBtn onClick={() => removeRaci(r.id)} /></td>
              </tr>
            ))}
          </TableWrapper>
          <AddRowButton onClick={addRaci} label="Add Reviewer" />
        </div>

      </div>
    </Modal>
  );
};

export default DocumentHistoryModal;
