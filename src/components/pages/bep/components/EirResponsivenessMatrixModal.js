import React, { useState } from 'react';
import { CheckCircle, AlertCircle, XCircle, ChevronDown, ChevronRight } from 'lucide-react';
import Modal from '../../../common/Modal';

const STATUS_CONFIG = {
  addressed: {
    label: 'Addressed',
    Icon: CheckCircle,
    badgeClass: 'text-green-700 bg-green-50 border-green-200',
    iconClass: 'text-green-600',
    summaryClass: 'text-green-700',
    summaryIconClass: 'text-green-500',
  },
  partial: {
    label: 'Partial',
    Icon: AlertCircle,
    badgeClass: 'text-amber-700 bg-amber-50 border-amber-200',
    iconClass: 'text-amber-500',
    summaryClass: 'text-amber-700',
    summaryIconClass: 'text-amber-500',
  },
  'not-addressed': {
    label: 'Not Addressed',
    Icon: XCircle,
    badgeClass: 'text-red-700 bg-red-50 border-red-200',
    iconClass: 'text-red-500',
    summaryClass: 'text-red-700',
    summaryIconClass: 'text-red-500',
  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  const { Icon, badgeClass, iconClass, label } = cfg;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${badgeClass}`}
    >
      <Icon className={`w-3 h-3 ${iconClass}`} />
      {label}
    </span>
  );
}

function CategoryGroup({ category, rows }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-3">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
          )}
          <span className="font-semibold text-gray-800 text-sm">{category}</span>
          <span className="text-xs text-gray-400">
            ({rows.length} {rows.length === 1 ? 'clause' : 'clauses'})
          </span>
        </div>

        {/* Mini status chips */}
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          {['addressed', 'partial', 'not-addressed'].map((s) => {
            const count = rows.filter((r) => r.status === s).length;
            if (!count) return null;
            const cfg = STATUS_CONFIG[s];
            const { Icon } = cfg;
            return (
              <span
                key={s}
                className={`flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded border ${cfg.badgeClass}`}
              >
                <Icon className={`w-3 h-3 ${cfg.iconClass}`} />
                {count}
              </span>
            );
          })}
        </div>
      </button>

      {expanded && (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-white">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 w-8">#</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                EIR Requirement
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 w-44">
                BEP Section
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 w-32">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.id}
                className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
              >
                <td className="px-4 py-2.5 text-gray-400 text-xs align-top">{i + 1}</td>
                <td className="px-4 py-2.5 text-gray-700 leading-snug align-top">
                  {row.requirement}
                </td>
                <td className="px-4 py-2.5 text-gray-500 text-xs font-mono align-top">
                  {row.bepSectionRef}
                </td>
                <td className="px-4 py-2.5 align-top">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/**
 * Modal that displays the EIR Responsiveness Matrix.
 *
 * @param {object}  props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {import('../../../../utils/eirResponsivenessMatrix').MatrixRow[]} props.rows
 * @param {{ total: number, addressed: number, partial: number, notAddressed: number, percentAddressed: number }|null} props.summary
 * @param {string} [props.projectName]
 */
const EirResponsivenessMatrixModal = ({ isOpen, onClose, rows, summary, projectName }) => {
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Group rows by category, preserving sorted order
  const categories = [];
  const grouped = {};
  for (const row of rows) {
    if (!grouped[row.eirCategory]) {
      categories.push(row.eirCategory);
      grouped[row.eirCategory] = [];
    }
    grouped[row.eirCategory].push(row);
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="EIR Responsiveness Matrix"
      size="xl"
      className="max-h-[85vh] flex flex-col"
      footer={
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      }
    >
      {/* Meta */}
      <p className="text-sm text-gray-500 mb-4">
        {projectName && (
          <span className="font-medium text-gray-700">{projectName} · </span>
        )}
        Generated {today}
      </p>

      {/* Summary bar */}
      {summary && summary.total > 0 && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 mb-5 flex-wrap">
          {[
            { key: 'addressed', count: summary.addressed, label: 'addressed' },
            { key: 'partial', count: summary.partial, label: 'partial' },
            { key: 'not-addressed', count: summary.notAddressed, label: 'not addressed' },
          ].map(({ key, count, label }, idx) => {
            const cfg = STATUS_CONFIG[key];
            const { Icon } = cfg;
            return (
              <React.Fragment key={key}>
                {idx > 0 && <div className="w-px h-4 bg-gray-300 hidden sm:block" />}
                <div className={`flex items-center gap-1.5 text-sm ${cfg.summaryClass}`}>
                  <Icon className={`w-4 h-4 ${cfg.summaryIconClass}`} />
                  <span className="font-semibold">{count}</span>
                  <span>{label}</span>
                </div>
              </React.Fragment>
            );
          })}

          {/* Progress bar */}
          <div className="ml-auto flex items-center gap-2 flex-shrink-0">
            <div className="h-2 bg-gray-200 rounded-full w-24 overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${summary.percentAddressed}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {summary.percentAddressed}%
            </span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {rows.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <AlertCircle className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No EIR clauses found</p>
          <p className="text-sm mt-1">
            Upload and analyse an EIR document in the BEP wizard first.
          </p>
        </div>
      )}

      {/* Category groups — scrollable */}
      {rows.length > 0 && (
        <div className="overflow-y-auto flex-1 min-h-0 pr-1">
          {categories.map((cat) => (
            <CategoryGroup key={cat} category={cat} rows={grouped[cat]} />
          ))}
        </div>
      )}
    </Modal>
  );
};

export default EirResponsivenessMatrixModal;
