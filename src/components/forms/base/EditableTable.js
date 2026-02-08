import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Users, X, Edit2, Sparkles, Maximize2, Plus } from 'lucide-react';
import TipTapEditor from '../editors/TipTapEditor';
import FieldHeader from './FieldHeader';
import FieldError from './FieldError';
import FullscreenTableModal from './FullscreenTableModal';
import COMMERCIAL_OFFICE_TEMPLATE from '../../../data/templates/commercialOfficeTemplate';

const EditableTable = React.memo(({ field, value, onChange, error }) => {
  const { name, label, number, required, columns: presetColumns = ['Role/Discipline', 'Name/Company', 'Experience/Notes'] } = field;

  // Value structure: { columns: [], data: [] } or legacy format (just array)
  const isLegacyFormat = Array.isArray(value);
  const tableValue = isLegacyFormat
    ? { columns: presetColumns, data: value }
    : (value || { columns: presetColumns, data: [] });

  const columns = tableValue.columns || presetColumns;
  const tableData = Array.isArray(tableValue.data) ? tableValue.data : [];

  const [editingColumn, setEditingColumn] = useState(null);
  const [editingColumnName, setEditingColumnName] = useState('');
  const [columnToDelete, setColumnToDelete] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [buttonPosition, setButtonPosition] = useState(null);
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const activeEditorRef = useRef(null); // Track active editor { rowIndex, column } - using ref to avoid re-renders
  const rowRefs = useRef({});
  const scrollContainerRef = useRef(null);
  const editInputRef = useRef(null);
  const previousEditingColumn = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Check if example data exists for this field
  const hasExampleData = COMMERCIAL_OFFICE_TEMPLATE[name] &&
    typeof COMMERCIAL_OFFICE_TEMPLATE[name] === 'object' &&
    COMMERCIAL_OFFICE_TEMPLATE[name].data &&
    Array.isArray(COMMERCIAL_OFFICE_TEMPLATE[name].data) &&
    COMMERCIAL_OFFICE_TEMPLATE[name].data.length > 0;

  // Ensure at least one empty row exists for new tables
  useEffect(() => {
    if (tableData.length === 0) {
      const emptyRow = columns.reduce((acc, col) => ({ ...acc, [col]: '' }), {});
      onChange(name, { columns, data: [emptyRow] });
    }
  }, [tableData.length, columns, name, onChange]);

  // Focus the edit input when editing column starts (only when it changes)
  useEffect(() => {
    if (editingColumn !== null && editingColumn !== previousEditingColumn.current && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
      previousEditingColumn.current = editingColumn;
    } else if (editingColumn === null) {
      previousEditingColumn.current = null;
    }
  }, [editingColumn]);

  // Update button position when hovering over a row
  useEffect(() => {
    // Don't update button position while user is typing or editing
    if (isUserTyping || activeEditorRef.current !== null) return;

    if (hoveredRow !== null && rowRefs.current[hoveredRow]) {
      const updatePosition = () => {
        const rowElement = rowRefs.current[hoveredRow];
        const scrollContainer = scrollContainerRef.current;

        if (rowElement && scrollContainer) {
          const rowRect = rowElement.getBoundingClientRect();
          const containerRect = scrollContainer.getBoundingClientRect();

          // In fullscreen mode, we need to find the actual scrollable parent
          // which is the FullscreenTableModal's content area
          let rightEdge = containerRect.right;

          if (isFullscreen) {
            // When in fullscreen, the visible area is the viewport width
            // Position buttons at the right edge of the viewport minus some padding
            rightEdge = window.innerWidth - 60; // 60px padding from edge to keep buttons fully visible
          }

          // Always position buttons at the right edge of the visible container
          // regardless of horizontal scroll position
          setButtonPosition({
            top: rowRect.top + (rowRect.height / 2),
            left: rightEdge,
            rowIndex: hoveredRow,
          });
        }
      };

      updatePosition();

      // Update on scroll or resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    } else if (buttonPosition === null || hoveredRow === null) {
      // Only clear if not hovering buttons
      setButtonPosition(null);
    }
  }, [hoveredRow, isFullscreen, isUserTyping]);

  const loadExampleData = useCallback(() => {
    if (hasExampleData) {
      const exampleData = COMMERCIAL_OFFICE_TEMPLATE[name];
      onChange(name, exampleData);
    }
  }, [hasExampleData, name, onChange]);

  const updateTableValue = useCallback((newColumns, newData) => {
    onChange(name, { columns: newColumns, data: newData });
  }, [name, onChange]);

  const addRow = useCallback(() => {
    const newRow = columns.reduce((acc, col) => ({ ...acc, [col]: '' }), {});
    updateTableValue(columns, [...tableData, newRow]);
  }, [columns, tableData, updateTableValue]);

  const addRowAfter = useCallback((index) => {
    const newRow = columns.reduce((acc, col) => ({ ...acc, [col]: '' }), {});
    const newData = [...tableData];
    newData.splice(index + 1, 0, newRow);
    updateTableValue(columns, newData);

    // Highlight the newly added row
    setHighlightedRow(index + 1);
    setTimeout(() => setHighlightedRow(null), 1500);
  }, [columns, tableData, updateTableValue]);

  const removeRow = useCallback((index) => {
    // Prevent removing the last row - always keep at least one
    if (tableData.length === 1) {
      // Clear the row instead of removing it
      const emptyRow = columns.reduce((acc, col) => ({ ...acc, [col]: '' }), {});
      updateTableValue(columns, [emptyRow]);
      return;
    }

    // Highlight the row being removed with a different color
    setHighlightedRow(`remove-${index}`);

    setTimeout(() => {
      const newData = tableData.filter((_, i) => i !== index);
      updateTableValue(columns, newData);
      setHighlightedRow(null);
    }, 300);
  }, [columns, tableData, updateTableValue]);

  const updateCell = useCallback((rowIndex, column, cellValue) => {
    // Mark user as typing to prevent hover state updates
    setIsUserTyping(true);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to reset typing state after user stops
    typingTimeoutRef.current = setTimeout(() => {
      setIsUserTyping(false);
    }, 500);

    const newData = tableData.map((row, index) =>
      index === rowIndex ? { ...row, [column]: cellValue } : row
    );
    updateTableValue(columns, newData);
  }, [tableData, columns, updateTableValue]);

  const moveRow = useCallback((fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= tableData.length) return;
    const newData = [...tableData];
    const [movedRow] = newData.splice(fromIndex, 1);
    newData.splice(toIndex, 0, movedRow);
    updateTableValue(columns, newData);
  }, [columns, tableData, updateTableValue]);

  // Column management functions
  const addColumn = useCallback(() => {
    const newColumnName = `Column ${columns.length + 1}`;
    const newColumns = [...columns, newColumnName];
    const newData = tableData.map(row => ({ ...row, [newColumnName]: '' }));
    updateTableValue(newColumns, newData);
  }, [columns, tableData, updateTableValue]);

  const removeColumn = useCallback((columnIndex) => {
    if (columns.length <= 1) {
      alert('Cannot remove the last column');
      return;
    }
    const columnToRemove = columns[columnIndex];
    const newColumns = columns.filter((_, i) => i !== columnIndex);
    const newData = tableData.map(row => {
      const newRow = { ...row };
      delete newRow[columnToRemove];
      return newRow;
    });
    updateTableValue(newColumns, newData);
    setColumnToDelete(null);
  }, [columns, tableData, updateTableValue]);

  const renameColumn = useCallback((oldName, newName) => {
    if (!newName.trim() || newName === oldName) {
      setEditingColumn(null);
      return;
    }
    if (columns.includes(newName)) {
      alert('A column with this name already exists');
      return;
    }
    const newColumns = columns.map(col => col === oldName ? newName : col);
    const newData = tableData.map(row => {
      const newRow = { ...row };
      newRow[newName] = newRow[oldName];
      delete newRow[oldName];
      return newRow;
    });
    updateTableValue(newColumns, newData);
    setEditingColumn(null);
  }, [columns, tableData, updateTableValue]);

  const moveColumn = useCallback((fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= columns.length) return;
    const newColumns = [...columns];
    const [movedColumn] = newColumns.splice(fromIndex, 1);
    newColumns.splice(toIndex, 0, movedColumn);
    updateTableValue(newColumns, tableData);
  }, [columns, tableData, updateTableValue]);

  // Portal-rendered floating buttons
  const renderFloatingButtons = () => {
    if (!buttonPosition) return null;

    const currentRowIndex = buttonPosition.rowIndex;

    const buttons = (
      <div
        style={{
          position: 'fixed',
          top: `${buttonPosition.top}px`,
          left: `${buttonPosition.left}px`,
          transform: 'translateY(-50%)',
          zIndex: 10000,
          pointerEvents: 'auto',
          paddingLeft: '8px', // Visual spacing without gap
        }}
        className="flex flex-col gap-1"
        onMouseEnter={() => setHoveredRow(currentRowIndex)}
        onMouseLeave={() => setHoveredRow(null)}
      >
        <button
          type="button"
          onClick={() => addRowAfter(currentRowIndex)}
          className="w-6 h-6 flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 rounded shadow-lg transition-all hover:scale-110"
          title="Add row below"
        >
          <Plus size={14} />
        </button>
        <button
          type="button"
          onClick={() => removeRow(currentRowIndex)}
          className="w-6 h-6 flex items-center justify-center text-white bg-red-600 hover:bg-red-700 rounded shadow-lg transition-all hover:scale-110"
          title="Remove row"
        >
          <X size={14} />
        </button>
      </div>
    );

    return createPortal(buttons, document.body);
  };

  // Render table content (used both in normal view and fullscreen)
  // Memoized to prevent unnecessary re-renders that cause typing issues
  const renderTableContent = useMemo(() => (
    <div className="border rounded-xl shadow-sm bg-white">
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
            max-height: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            max-height: 500px;
          }
        }

        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateY(0);
            max-height: 500px;
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
            max-height: 0;
          }
        }

        .row-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }

        .row-slide-out {
          animation: slideOut 0.3s ease-out forwards;
        }
      `}</style>
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
              {tableData.length} {tableData.length === 1 ? 'Entry' : 'Entries'}
            </span>
            {tableData.length > 0 && (
              <span className="text-xs text-gray-500 truncate hidden sm:inline">
                Hover over rows to add/remove • Click and drag to reorder
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {hasExampleData && tableData.length === 0 && (
              <button
                type="button"
                onClick={loadExampleData}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-3 py-1.5 rounded-lg transition-all hover:scale-105 shadow-sm text-sm font-medium"
              >
                <Sparkles size={16} />
                <span className="hidden sm:inline">Load Example</span>
              </button>
            )}
            {!isFullscreen && (
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="flex items-center space-x-1.5 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg transition-all hover:scale-105 shadow-sm text-sm font-medium"
                title="Expand to fullscreen"
              >
                <Maximize2 size={16} />
                <span className="hidden md:inline">Expand</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {tableData.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg mb-2">No entries yet.</p>
          <p className="text-sm">
            {hasExampleData
              ? 'Click "Load Example Data" to see a sample, or hover over this area to add your first row.'
              : 'Hover over this area to add your first row.'}
          </p>
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          className="bg-white overflow-x-auto"
          onScroll={() => {
            // Update button position on horizontal scroll
            if (hoveredRow !== null) {
              setHoveredRow(hoveredRow);
            }
          }}
        >
          <table className="w-full min-w-full table-auto">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="w-10 px-1 py-3">
                </th>
                {columns.map((column, colIndex) => (
                  <th key={column} className="px-2 py-3 text-left min-w-[100px] max-w-[280px]">
                    <div className="group">
                      {/* Column name (editable) */}
                      <div className="mb-2">
                        {editingColumn === colIndex ? (
                          <input
                            ref={editInputRef}
                            type="text"
                            value={editingColumnName}
                            onChange={(e) => setEditingColumnName(e.target.value)}
                            onBlur={(e) => {
                              // Only rename if we're actually leaving the input
                              // (not just a re-render)
                              if (document.activeElement !== e.target) {
                                renameColumn(column, editingColumnName);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                renameColumn(column, editingColumnName);
                              } else if (e.key === 'Escape') {
                                setEditingColumn(null);
                              }
                            }}
                            className="w-full px-1.5 py-1 text-sm font-semibold border-2 border-blue-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                        ) : (
                          <div
                            onClick={() => {
                              setEditingColumn(colIndex);
                              setEditingColumnName(column);
                            }}
                            className="px-1.5 py-1 text-sm font-semibold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-white hover:shadow-sm rounded-lg transition-all break-words hyphens-auto leading-tight"
                            title={column}
                            style={{
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                              hyphens: 'auto'
                            }}
                          >
                            {column}
                          </div>
                        )}
                      </div>

                      {/* Column controls - appear on hover (always visible in fullscreen) */}
                      <div className={`flex items-center justify-center gap-1 ${isFullscreen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity relative z-10`}>
                        {/* Move left */}
                        <button
                          type="button"
                          onClick={() => moveColumn(colIndex, colIndex - 1)}
                          disabled={colIndex === 0}
                          className="p-1 rounded-md bg-white hover:bg-blue-50 text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white shadow-sm border border-gray-200 transition-all hover:scale-110 text-xs"
                          title="Move left"
                        >
                          ←
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingColumn(colIndex);
                            setEditingColumnName(column);
                          }}
                          className="p-1 rounded-md bg-white hover:bg-green-50 text-green-600 shadow-sm border border-gray-200 transition-all hover:scale-110"
                          title="Rename column"
                        >
                          <Edit2 size={12} />
                        </button>

                        {/* Move right */}
                        <button
                          type="button"
                          onClick={() => moveColumn(colIndex, colIndex + 1)}
                          disabled={colIndex === columns.length - 1}
                          className="p-1 rounded-md bg-white hover:bg-blue-50 text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white shadow-sm border border-gray-200 transition-all hover:scale-110 text-xs"
                          title="Move right"
                        >
                          →
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => setColumnToDelete(colIndex)}
                          className="p-1 rounded-md bg-white hover:bg-red-50 text-red-500 shadow-sm border border-gray-200 transition-all hover:scale-110"
                          title="Remove column"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
                <th className="w-12 px-1 py-3 text-center">
                  <button
                    type="button"
                    onClick={addColumn}
                    className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all hover:scale-110"
                    title="Add column"
                  >
                    <Plus size={16} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableData.map((row, rowIndex) => {
                const isNewRow = highlightedRow === rowIndex;
                const isRemoving = highlightedRow === `remove-${rowIndex}`;

                return (
                  <tr
                    key={rowIndex}
                    ref={el => rowRefs.current[rowIndex] = el}
                    className={`transition-colors duration-300 ${
                      isNewRow
                        ? 'bg-green-50 row-slide-in'
                        : isRemoving
                        ? 'bg-red-50 row-slide-out'
                        : 'hover:bg-gray-50'
                    }`}
                    onMouseEnter={() => !activeEditorRef.current && setHoveredRow(rowIndex)}
                    onMouseLeave={() => !activeEditorRef.current && setHoveredRow(null)}
                  >

                  <td className="px-1 py-2">
                    <div className="flex flex-col items-center space-y-0.5">
                      <button
                        type="button"
                        onClick={() => moveRow(rowIndex, rowIndex - 1)}
                        disabled={rowIndex === 0}
                        className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-1 rounded">{rowIndex + 1}</span>
                      <button
                        type="button"
                        onClick={() => moveRow(rowIndex, rowIndex + 1)}
                        disabled={rowIndex === tableData.length - 1}
                        className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
                        title="Move down"
                      >
                        ↓
                      </button>
                    </div>
                  </td>
                  {columns.map(column => (
                    <td key={column} className="px-0.5 py-2">
                      <TipTapEditor
                        value={row[column] || ''}
                        onChange={(newValue) => updateCell(rowIndex, column, newValue)}
                        onFocus={() => {
                          activeEditorRef.current = { rowIndex, column };
                        }}
                        onBlur={() => {
                          // Delay slightly to allow for toolbar clicks if present
                          setTimeout(() => {
                            const current = activeEditorRef.current;
                            // Only clear if this editor is still the active one
                            if (current?.rowIndex === rowIndex && current?.column === column) {
                              activeEditorRef.current = null;
                            }
                          }, 100);
                        }}
                        onMouseDown={(e) => {
                          // Prevent event from bubbling to avoid losing focus
                          e.stopPropagation();
                        }}
                        className="text-sm"
                        placeholder={`Enter ${column.toLowerCase()}...`}
                        minHeight="48px"
                        showToolbar={false}
                        autoSaveKey={`table-${name}-${rowIndex}-${column}`}
                        compactMode={true}
                      />
                    </td>
                  ))}
                  <td className="px-1 py-2">
                    {/* Empty cell - buttons are now rendered via Portal */}
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  ), [
    tableData,
    columns,
    hasExampleData,
    isFullscreen,
    editingColumn,
    editingColumnName,
    highlightedRow,
    loadExampleData,
    addColumn,
    moveColumn,
    renameColumn,
    updateCell,
    moveRow,
    name
  ]);

  return (
    <div className="mb-8">
      {label && (
        <FieldHeader
          fieldName={name}
          label={label}
          number={number}
          required={required}
        />
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <FullscreenTableModal
          key="fullscreen-table-modal"
          isOpen={isFullscreen}
          onClose={() => setIsFullscreen(false)}
          title={label || 'Table View'}
        >
          {renderTableContent}
        </FullscreenTableModal>
      )}

      {/* Normal View */}
      {!isFullscreen && renderTableContent}

      {/* Floating row action buttons - rendered via Portal (available in both normal and fullscreen) */}
      {renderFloatingButtons()}

      <FieldError error={error} />

      {/* Delete Column Confirmation Modal */}
      {columnToDelete !== null && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 10001 }} onClick={() => setColumnToDelete(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <X size={24} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Remove Column?</h3>
                <p className="text-gray-600">
                  Are you sure you want to remove the column <span className="font-semibold text-gray-900">"{columns[columnToDelete]}"</span>?
                </p>
              </div>
            </div>

            {/* Warning message */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-amber-800">
                ⚠️ This will permanently delete all data in this column from all rows.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setColumnToDelete(null)}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => removeColumn(columnToDelete)}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-lg"
              >
                Remove Column
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
});

export default EditableTable;
