import { CheckCircle } from 'lucide-react';

/**
 * Modal shown after EIR auto-fill, listing which BEP fields were populated.
 */
const EirFillSummaryModal = ({ filledFields, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
        <h2 className="text-base font-semibold text-gray-900 flex-1">
          {filledFields.length} field{filledFields.length !== 1 ? 's' : ''} auto-filled from EIR
        </h2>
      </div>

      <ul className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
        {filledFields.map(({ label, preview }) => (
          <li key={label} className="flex items-start gap-3 px-6 py-3">
            <span className="w-40 flex-shrink-0 text-xs font-semibold uppercase tracking-wider text-gray-400 pt-0.5">
              {label}
            </span>
            <span className="text-sm text-gray-700 truncate">{preview}</span>
          </li>
        ))}
      </ul>

      <div className="px-6 py-4 bg-gray-50 flex justify-end">
        <button
          onClick={onConfirm}
          className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to BEP →
        </button>
      </div>
    </div>
  </div>
);

export default EirFillSummaryModal;
