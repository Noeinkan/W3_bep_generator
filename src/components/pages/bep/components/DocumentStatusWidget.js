import { useState } from 'react';
import { Pencil, FileText } from 'lucide-react';
import { SUITABILITY_COLORS } from '../../../../constants/documentHistory';
import DocumentHistoryModal from './DocumentHistoryModal';

/**
 * Compact sidebar widget showing the current revision code and ISO 19650
 * suitability status of this BEP information container.
 * Clicking the pencil icon opens the full DocumentHistoryModal.
 */
const DocumentStatusWidget = ({ documentHistory, onSave }) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (!documentHistory) return null;

  const revisions = documentHistory.revisions ?? [];
  const latest    = revisions[revisions.length - 1];
  const revCode   = latest?.revisionCode ?? '—';
  const statusCode = latest?.statusCode  ?? 'S0';
  const statusLabel = latest?.statusLabel ?? '';
  const colorCls  = SUITABILITY_COLORS[statusCode] ?? SUITABILITY_COLORS.S0;

  return (
    <>
      <div className="mx-4 mb-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <FileText size={12} className="text-gray-400 shrink-0" />
            <span className="text-xs text-gray-500 truncate" title={documentHistory.documentNumber}>
              {documentHistory.documentNumber || 'BEP Document'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            title="Edit document history & governance"
            className="shrink-0 p-0.5 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Pencil size={11} />
          </button>
        </div>

        <div className="flex items-center gap-1.5 mt-1.5">
          {/* Revision badge */}
          <span className="text-xs font-mono font-semibold bg-white border border-gray-300 text-gray-700 rounded px-1.5 py-0.5">
            {revCode}
          </span>
          {/* Status badge */}
          <span
            className={`text-xs font-medium rounded px-1.5 py-0.5 border ${colorCls}`}
            title={statusLabel}
          >
            {statusCode}
          </span>
          <span className="text-xs text-gray-400 truncate" title={statusLabel}>
            {statusLabel}
          </span>
        </div>
      </div>

      {modalOpen && (
        <DocumentHistoryModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          documentHistory={documentHistory}
          onSave={onSave}
        />
      )}
    </>
  );
};

export default DocumentStatusWidget;
