import React, { useState, useMemo } from 'react';
import { X, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import BaseTextInput from '../base/BaseTextInput';
import BaseTextArea from '../base/BaseTextArea';

/**
 * ClashMatrixHeatmap - Enhanced Version
 * Visual square matrix for clash detection with industry best practices
 *
 * Features:
 * - Hard/Soft clash separation (structural interference vs clearance requirements)
 * - Discipline priority system (automatic ordering by construction hierarchy)
 * - Directional priority indicators (who yields to whom)
 * - Enhanced visual feedback with standard BIM color codes
 * - Statistics counter and filtering
 * - Rotated headers for better readability
 * - Rich tooltips and accessibility improvements
 */

// Discipline priority mapping (lower = higher priority in construction)
const DISCIPLINE_PRIORITIES = {
  'Structure': 1,
  'Structural': 1,
  'Architecture': 2,
  'Architectural': 2,
  'MEP': 3,
  'Mechanical': 3,
  'Electrical': 4,
  'Plumbing': 5,
  'HVAC': 6,
  'Fire Protection': 7,
  'Landscape': 8,
  'Interior': 9,
  'Default': 99
};

const ClashMatrixHeatmap = ({ disciplines, clashes, onChange, disabled = false }) => {
  const [editingClash, setEditingClash] = useState(null);
  const [editForm, setEditForm] = useState({
    hardTolerance: '',
    softTolerance: '',
    responsibleParty: '',
    priority: 'medium',
    notes: ''
  });
  const [filterPriority, setFilterPriority] = useState('all'); // 'all', 'high', 'medium', 'low'
  const [showStats, setShowStats] = useState(true);

  // Get discipline priority
  const getDisciplinePriority = (discipline) => {
    for (const [key, priority] of Object.entries(DISCIPLINE_PRIORITIES)) {
      if (discipline.toLowerCase().includes(key.toLowerCase())) {
        return priority;
      }
    }
    return DISCIPLINE_PRIORITIES.Default;
  };

  // Sort disciplines by priority
  const sortedDisciplines = useMemo(() => {
    return [...disciplines].sort((a, b) => {
      return getDisciplinePriority(a) - getDisciplinePriority(b);
    });
  }, [disciplines]);

  // Map original indices to sorted indices
  const getOriginalIndex = (sortedIndex) => {
    return disciplines.indexOf(sortedDisciplines[sortedIndex]);
  };

  // Helper: Get clash for a discipline pair
  const getClash = (indexA, indexB) => {
    if (indexA === indexB) return null;

    return clashes.find(c =>
      (c.disciplineA === indexA && c.disciplineB === indexB) ||
      (c.disciplineA === indexB && c.disciplineB === indexA)
    );
  };

  // Helper: Get color class based on tolerances
  const getColorClass = (clash) => {
    if (!clash) return 'bg-white hover:bg-gray-50';

    const hardTol = clash.hardTolerance || 0;

    // Color based on hard tolerance severity
    if (hardTol <= 10) return 'bg-green-100 hover:bg-green-200 border-l-4 border-green-500';
    if (hardTol <= 25) return 'bg-green-50 hover:bg-green-100 border-l-4 border-green-400';
    if (hardTol <= 50) return 'bg-yellow-50 hover:bg-yellow-100 border-l-4 border-yellow-400';
    if (hardTol <= 75) return 'bg-orange-50 hover:bg-orange-100 border-l-4 border-orange-400';
    return 'bg-red-50 hover:bg-red-100 border-l-4 border-red-400';
  };

  // Helper: Get priority badge color
  const getPriorityBadgeColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // Helper: Get tolerance indicators
  const getToleranceIndicators = (clash) => {
    if (!clash) return null;

    const hardTol = clash.hardTolerance || 0;
    const softTol = clash.softTolerance || 0;

    const getHardIcon = (val) => {
      if (val <= 10) return '🟢';
      if (val <= 25) return '🟡';
      if (val <= 50) return '🟠';
      return '🔴';
    };

    const getSoftIcon = (val) => {
      if (val <= 50) return '🔵';
      if (val <= 100) return '⚪';
      return '⚫';
    };

    return (
      <div className="flex items-center gap-0.5">
        <span title={`Hard: ${hardTol}mm`}>{getHardIcon(hardTol)}</span>
        <span title={`Soft: ${softTol}mm`} className="text-xs">{getSoftIcon(softTol)}</span>
      </div>
    );
  };

  // Helper: Get directional arrow based on priority
  const getDirectionalIndicator = (rowIdx, colIdx) => {
    const rowDisc = sortedDisciplines[rowIdx];
    const colDisc = sortedDisciplines[colIdx];

    const rowPriority = getDisciplinePriority(rowDisc);
    const colPriority = getDisciplinePriority(colDisc);

    if (rowPriority < colPriority) {
      return <span className="text-blue-600 text-xs ml-1" title={`${colDisc} yields to ${rowDisc}`}>→</span>;
    } else if (rowPriority > colPriority) {
      return <span className="text-blue-600 text-xs ml-1" title={`${rowDisc} yields to ${colDisc}`}>←</span>;
    }
    return null;
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalPossible = (disciplines.length * (disciplines.length - 1)) / 2;
    const activeClashes = clashes.length;
    const byPriority = {
      high: clashes.filter(c => c.priority === 'high').length,
      medium: clashes.filter(c => c.priority === 'medium').length,
      low: clashes.filter(c => c.priority === 'low').length
    };
    const avgHardTolerance = clashes.length > 0
      ? (clashes.reduce((sum, c) => sum + (c.hardTolerance || 0), 0) / clashes.length).toFixed(1)
      : 0;

    return {
      totalPossible,
      activeClashes,
      byPriority,
      avgHardTolerance,
      coverage: ((activeClashes / totalPossible) * 100).toFixed(0)
    };
  }, [clashes, disciplines]);

  // Toggle clash detection for a cell
  const toggleClash = (indexA, indexB) => {
    if (disabled || indexA === indexB) return;

    const existing = getClash(indexA, indexB);

    if (existing) {
      // Remove clash
      const updated = clashes.filter(c =>
        !((c.disciplineA === indexA && c.disciplineB === indexB) ||
          (c.disciplineA === indexB && c.disciplineB === indexA))
      );
      onChange(updated);
    } else {
      // Add new clash with default values
      const newClash = {
        disciplineA: indexA,
        disciplineB: indexB,
        enabled: true,
        hardTolerance: 25, // Default: tight coordination
        softTolerance: 100, // Default: standard clearance
        responsibleParty: 'BIM Coordinator',
        priority: 'medium',
        notes: ''
      };
      onChange([...clashes, newClash]);
    }
  };

  // Open edit modal for a clash
  const openEditModal = (indexA, indexB, e) => {
    e.stopPropagation();
    const clash = getClash(indexA, indexB);
    if (!clash || disabled) return;

    setEditingClash({ disciplineA: indexA, disciplineB: indexB });
    setEditForm({
      hardTolerance: clash.hardTolerance || '',
      softTolerance: clash.softTolerance || '',
      responsibleParty: clash.responsibleParty || '',
      priority: clash.priority || 'medium',
      notes: clash.notes || ''
    });
  };

  // Save edited clash
  const saveEditedClash = () => {
    const updated = clashes.map(c => {
      const isTargetClash =
        (c.disciplineA === editingClash.disciplineA && c.disciplineB === editingClash.disciplineB) ||
        (c.disciplineA === editingClash.disciplineB && c.disciplineB === editingClash.disciplineA);

      if (isTargetClash) {
        return {
          ...c,
          hardTolerance: parseInt(editForm.hardTolerance) || 25,
          softTolerance: parseInt(editForm.softTolerance) || 100,
          responsibleParty: editForm.responsibleParty,
          priority: editForm.priority,
          notes: editForm.notes
        };
      }
      return c;
    });

    onChange(updated);
    setEditingClash(null);
    setEditForm({ hardTolerance: '', softTolerance: '', responsibleParty: '', priority: 'medium', notes: '' });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingClash(null);
    setEditForm({ hardTolerance: '', softTolerance: '', responsibleParty: '', priority: 'medium', notes: '' });
  };

  // Filter clashes by priority
  const shouldShowCell = (clash) => {
    if (filterPriority === 'all') return true;
    return clash && clash.priority === filterPriority;
  };

  return (
    <div className="relative space-y-4">
      {/* Statistics Panel */}
      {showStats && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              Clash Detection Matrix Statistics
            </h4>
            <button
              onClick={() => setShowStats(false)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            <div className="bg-white rounded-md p-2 border border-gray-200">
              <div className="text-gray-500 mb-1">Active Pairs</div>
              <div className="text-lg font-bold text-gray-900">{stats.activeClashes}/{stats.totalPossible}</div>
              <div className="text-gray-400">({stats.coverage}% coverage)</div>
            </div>

            <div className="bg-white rounded-md p-2 border border-red-200">
              <div className="text-gray-500 mb-1">High Priority</div>
              <div className="text-lg font-bold text-red-600">{stats.byPriority.high}</div>
            </div>

            <div className="bg-white rounded-md p-2 border border-yellow-200">
              <div className="text-gray-500 mb-1">Medium Priority</div>
              <div className="text-lg font-bold text-yellow-600">{stats.byPriority.medium}</div>
            </div>

            <div className="bg-white rounded-md p-2 border border-green-200">
              <div className="text-gray-500 mb-1">Low Priority</div>
              <div className="text-lg font-bold text-green-600">{stats.byPriority.low}</div>
            </div>

            <div className="bg-white rounded-md p-2 border border-gray-200">
              <div className="text-gray-500 mb-1">Avg Hard Tolerance</div>
              <div className="text-lg font-bold text-gray-900">{stats.avgHardTolerance}mm</div>
            </div>
          </div>
        </div>
      )}

      {!showStats && (
        <button
          onClick={() => setShowStats(true)}
          className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <ChevronDown className="w-4 h-4" />
          Show Statistics
        </button>
      )}

      {/* Filter Controls */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Filter by Priority:</label>
        <div className="flex gap-2">
          {['all', 'high', 'medium', 'low'].map(priority => (
            <button
              key={priority}
              onClick={() => setFilterPriority(priority)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                filterPriority === priority
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="border-collapse w-full text-sm">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 p-2 font-semibold text-xs sticky left-0 z-10"></th>
              {sortedDisciplines.map((disc, idx) => (
                <th
                  key={idx}
                  className="border border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 p-2 font-semibold text-xs text-center min-w-[80px] relative group"
                  title={`${disc} (Priority: ${getDisciplinePriority(disc)})`}
                >
                  <div className="rotate-header" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', whiteSpace: 'nowrap' }}>
                    {disc}
                  </div>
                  <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                    {getDisciplinePriority(disc)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedDisciplines.map((rowDisc, sortedRowIdx) => {
              const rowIdx = getOriginalIndex(sortedRowIdx);

              return (
                <tr key={sortedRowIdx}>
                  <td className="border border-gray-300 bg-gradient-to-r from-gray-100 to-gray-50 p-2 font-semibold text-xs sticky left-0 z-10 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                        {getDisciplinePriority(rowDisc)}
                      </span>
                      {rowDisc}
                    </div>
                  </td>
                  {sortedDisciplines.map((colDisc, sortedColIdx) => {
                    const colIdx = getOriginalIndex(sortedColIdx);
                    const clash = getClash(rowIdx, colIdx);
                    const isDiagonal = rowIdx === colIdx;
                    const isChecked = !!clash;
                    const showCell = !clash || shouldShowCell(clash);

                    return (
                      <td
                        key={sortedColIdx}
                        className={`border border-gray-300 p-2 text-center transition-all ${
                          isDiagonal
                            ? 'bg-gray-200 cursor-not-allowed'
                            : isChecked
                            ? getColorClass(clash)
                            : 'bg-white hover:bg-blue-50 cursor-pointer'
                        } ${!showCell && !isDiagonal ? 'opacity-20' : ''}`}
                        onClick={() => !isDiagonal && (isChecked ? openEditModal(rowIdx, colIdx, { stopPropagation: () => {} }) : toggleClash(rowIdx, colIdx))}
                        title={
                          isDiagonal
                            ? 'Same discipline'
                            : isChecked
                            ? `${rowDisc} ↔ ${colDisc}\nHard Tolerance: ${clash?.hardTolerance}mm\nSoft Clearance: ${clash?.softTolerance}mm\nPriority: ${clash?.priority?.toUpperCase()}\nResponsible: ${clash?.responsibleParty}\n\nClick to edit details`
                            : `Click to enable clash detection\n${rowDisc} ↔ ${colDisc}`
                        }
                      >
                        {isDiagonal ? (
                          <span className="text-gray-400">—</span>
                        ) : isChecked ? (
                          <div className="flex flex-col items-center justify-center gap-1">
                            <div className="flex items-center">
                              {getToleranceIndicators(clash)}
                              {getDirectionalIndicator(sortedRowIdx, sortedColIdx)}
                            </div>
                            <div className={`text-[9px] px-1.5 py-0.5 rounded-full border ${getPriorityBadgeColor(clash.priority)}`}>
                              {clash.priority?.charAt(0).toUpperCase()}
                            </div>
                          </div>
                        ) : (
                          <div className="group-hover:scale-110 transition-transform text-gray-400 hover:text-blue-600">
                            <span className="text-lg">+</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Enhanced Legend */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Hard Clash Legend */}
          <div>
            <div className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              Hard Clash Tolerance (Structural Interference)
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span>🟢</span>
                <span className="text-gray-600">0-25mm: Tight coordination (critical areas)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🟡</span>
                <span className="text-gray-600">26-50mm: Standard coordination</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🟠</span>
                <span className="text-gray-600">51-75mm: Relaxed tolerance</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔴</span>
                <span className="text-gray-600">75mm+: Low priority zones</span>
              </div>
            </div>
          </div>

          {/* Soft Clash Legend */}
          <div>
            <div className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              Soft Clearance Requirements (Maintenance/Access)
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span>🔵</span>
                <span className="text-gray-600">0-50mm: Minimal clearance</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⚪</span>
                <span className="text-gray-600">51-100mm: Standard clearance</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⚫</span>
                <span className="text-gray-600">100mm+: Extended clearance</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-3">
          <div className="font-semibold text-gray-700 mb-2 text-xs">Directional Priority</div>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <span className="text-blue-600">→</span> Higher priority yields (lower number wins)
            </span>
            <span className="flex items-center gap-1">
              <span className="text-blue-600">←</span> Lower priority yields (higher number adjusts)
            </span>
          </div>
        </div>
      </div>

      {/* Edit Modal - Enhanced */}
      {editingClash && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit Clash Detection Parameters
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Configure hard clash tolerance and soft clearance requirements
                </p>
              </div>
              <button
                onClick={cancelEdit}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <strong>Disciplines:</strong> {disciplines[editingClash.disciplineA]} ↔ {disciplines[editingClash.disciplineB]}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Priority: {disciplines[editingClash.disciplineA]} ({getDisciplinePriority(disciplines[editingClash.disciplineA])})
                {' '}{getDisciplinePriority(disciplines[editingClash.disciplineA]) < getDisciplinePriority(disciplines[editingClash.disciplineB]) ? '→' : '←'}{' '}
                {disciplines[editingClash.disciplineB]} ({getDisciplinePriority(disciplines[editingClash.disciplineB])})
              </p>
            </div>

            <div className="space-y-5">
              {/* Hard vs Soft Tolerance */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hard Clash Tolerance (mm) <span className="text-red-500">*</span>
                  </label>
                  <BaseTextInput
                    type="number"
                    value={editForm.hardTolerance}
                    onChange={(e) => setEditForm({ ...editForm, hardTolerance: e.target.value })}
                    placeholder="e.g., 25"
                    className="px-3 py-2 border-gray-300 focus:ring-red-500 focus:border-red-500"
                    min="0"
                    step="5"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Physical interference between elements
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    🟢 0-25mm | 🟡 26-50mm | 🟠 51-75mm | 🔴 75mm+
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Soft Clearance (mm) <span className="text-red-500">*</span>
                  </label>
                  <BaseTextInput
                    type="number"
                    value={editForm.softTolerance}
                    onChange={(e) => setEditForm({ ...editForm, softTolerance: e.target.value })}
                    placeholder="e.g., 100"
                    className="px-3 py-2 border-gray-300"
                    min="0"
                    step="10"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Minimum space for maintenance/access
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    🔵 0-50mm | ⚪ 51-100mm | ⚫ 100mm+
                  </p>
                </div>
              </div>

              {/* Priority Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clash Priority <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['high', 'medium', 'low'].map(priority => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, priority })}
                      className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        editForm.priority === priority
                          ? priority === 'high'
                            ? 'bg-red-100 border-red-500 text-red-700'
                            : priority === 'medium'
                            ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
                            : 'bg-green-100 border-green-500 text-green-700'
                          : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  High: Critical path items | Medium: Standard coordination | Low: Non-critical zones
                </p>
              </div>

              {/* Responsible Party */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsible Party <span className="text-red-500">*</span>
                </label>
                <select
                  value={editForm.responsibleParty}
                  onChange={(e) => setEditForm({ ...editForm, responsibleParty: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select responsible party</option>
                  <option value="BIM Coordinator">BIM Coordinator</option>
                  <option value="MEP Coordinator">MEP Coordinator</option>
                  <option value="Structural Engineer">Structural Engineer</option>
                  <option value="Architect">Architect</option>
                  <option value="General Contractor">General Contractor</option>
                  <option value="Trade Contractor">Trade Contractor</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coordination Notes
                </label>
                <BaseTextArea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="Additional coordination notes, resolution strategy, or special requirements..."
                  rows={3}
                  className="px-3 py-2 border-gray-300"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={cancelEdit}
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedClash}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!editForm.hardTolerance || !editForm.softTolerance || !editForm.responsibleParty}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClashMatrixHeatmap;
