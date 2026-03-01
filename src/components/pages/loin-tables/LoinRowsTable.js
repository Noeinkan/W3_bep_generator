import React from 'react';
import { Pencil, Trash2, Layers } from 'lucide-react';

const COLS = [
  { key: 'discipline', label: 'Discipline', width: 'w-28' },
  { key: 'stage', label: 'Stage', width: 'w-32' },
  { key: 'element', label: 'Element / System', width: 'w-36' },
  { key: 'geometry', label: 'Geometry', width: '' },
  { key: 'alphanumeric', label: 'Alphanumeric', width: '' },
  { key: 'documentation', label: 'Documentation', width: '' },
  { key: 'notes', label: 'Notes', width: 'w-28' },
];

const Cell = ({ value }) => (
  <td className="px-3 py-2 text-sm text-gray-700 align-top">
    <span className="block whitespace-pre-wrap break-words">{value || <span className="text-gray-400 italic">—</span>}</span>
  </td>
);

/**
 * Table of LOIN rows for a project.
 * Props:
 *   rows      — array of LOIN row objects
 *   onEdit    — (row) => void
 *   onDelete  — (row) => void
 */
const LoinRowsTable = ({ rows, onEdit, onDelete }) => {
  if (!rows || rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <Layers className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm font-medium">No LOIN rows yet</p>
        <p className="text-xs mt-1">Click "Add Row" to define your first Level of Information Need entry.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-teal-50">
          <tr>
            {COLS.map(col => (
              <th
                key={col.key}
                className={`px-3 py-2 text-left text-xs font-semibold text-teal-800 uppercase tracking-wide ${col.width}`}
              >
                {col.label}
              </th>
            ))}
            <th className="px-3 py-2 text-left text-xs font-semibold text-teal-800 uppercase tracking-wide w-20">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((row, i) => (
            <tr key={row.id} className={i % 2 === 0 ? '' : 'bg-gray-50'}>
              {COLS.map(col => <Cell key={col.key} value={row[col.key]} />)}
              <td className="px-3 py-2 align-top">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(row)}
                    title="Edit"
                    className="p-1.5 rounded-md text-gray-500 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(row)}
                    title="Delete"
                    className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoinRowsTable;
