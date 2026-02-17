import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, X, Edit2, GripVertical, AlertTriangle } from 'lucide-react';
import FieldHeader from '../base/FieldHeader';
import FieldError from '../base/FieldError';
import { cn } from '../../../utils/cn';

const StandardsTable = React.memo(({ field, value, onChange, error }) => {
  const { name, label, number, required } = field;

  // Default data structure
  const defaultData = {
    columns: ['Category', 'Reference', 'Architecture', 'Structure', 'MEP', 'Sustainability'],
    data: [
      { Category: 'Core Standards', Reference: 'BS EN ISO 19650-1:2018', Architecture: 'M', Structure: 'M', MEP: 'M', Sustainability: 'R' },
      { Category: 'Core Standards', Reference: 'BS EN ISO 19650-2:2018', Architecture: 'M', Structure: 'M', MEP: 'M', Sustainability: 'R' },
      { Category: 'Core Standards', Reference: 'PAS 1192-2:2013', Architecture: 'M', Structure: 'M', MEP: 'M', Sustainability: 'M' },
      { Category: 'Core Standards', Reference: 'PAS 1192-3:2014', Architecture: 'R', Structure: 'R', MEP: 'R', Sustainability: 'M' },
      { Category: 'Enablers', Reference: 'BS EN ISO 16739-1:2018', Architecture: 'R', Structure: 'R', MEP: 'R', Sustainability: '' },
      { Category: 'Enablers', Reference: 'IFC 4.3', Architecture: 'R', Structure: 'R', MEP: 'R', Sustainability: '' },
      { Category: 'Others', Reference: 'BS 1192-4:2014', Architecture: 'R', Structure: 'R', MEP: 'R', Sustainability: 'R' }
    ]
  };

  // Value structure: { columns: [], data: [] }
  const tableValue = value || defaultData;
  const columns = tableValue.columns || defaultData.columns;
  const tableData = Array.isArray(tableValue.data) ? tableValue.data : defaultData.data;

  const [editingColumn, setEditingColumn] = useState(null);
  const [editingColumnName, setEditingColumnName] = useState('');
  const [columnToDelete, setColumnToDelete] = useState(null);
  const [draggedRow, setDraggedRow] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  // Categories for grouping
  const categories = useMemo(() => ['Core Standards', 'Enablers', 'Others'], []);

  // Fixed columns that cannot be removed
  const fixedColumns = ['Category', 'Reference'];

  const updateTableValue = (newColumns, newData) => {
    onChange(name, { columns: newColumns, data: newData });
  };

  // Validation function
  const validateData = useCallback((data) => {
    const errors = [];
    const references = new Set();

    data.forEach((row, index) => {
      // Check for empty reference
      if (!row.Reference || row.Reference.trim() === '') {
        errors.push(`Row ${index + 1}: Reference cannot be empty`);
      }

      // Check for duplicate references
      if (row.Reference && references.has(row.Reference.trim())) {
        errors.push(`Row ${index + 1}: Duplicate reference "${row.Reference.trim()}"`);
      } else if (row.Reference) {
        references.add(row.Reference.trim());
      }

      // Check category is valid
      if (!categories.includes(row.Category)) {
        errors.push(`Row ${index + 1}: Invalid category "${row.Category}"`);
      }
    });

    // Only update validation errors if they have changed to prevent infinite loop
    setValidationErrors(prev => {
      const errorsChanged = prev.length !== errors.length ||
        prev.some((err, idx) => err !== errors[idx]);
      return errorsChanged ? errors : prev;
    });
    return errors.length === 0;
  }, [categories]);

  // Validate on data change
  useEffect(() => {
    validateData(tableData);
  }, [tableData, validateData]);

  const addRow = (category = 'Core Standards') => {
    const newRow = columns.reduce((acc, col) => ({
      ...acc,
      [col]: col === 'Category' ? category : ''
    }), {});
    const newData = [...tableData, newRow];
    updateTableValue(columns, newData);
  };

  const removeRow = (index) => {
    const newData = tableData.filter((_, i) => i !== index);
    updateTableValue(columns, newData);
  };

  const updateCell = (rowIndex, column, cellValue) => {
    const newData = tableData.map((row, index) =>
      index === rowIndex ? { ...row, [column]: cellValue } : row
    );
    updateTableValue(columns, newData);
  };

  const moveRow = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= tableData.length) return;
    const newData = [...tableData];
    const [movedRow] = newData.splice(fromIndex, 1);
    newData.splice(toIndex, 0, movedRow);
    updateTableValue(columns, newData);
  };

  // Column management functions
  const addColumn = () => {
    const newColumnName = `New Area ${columns.length - 1}`;
    const newColumns = [...columns, newColumnName];
    const newData = tableData.map(row => ({ ...row, [newColumnName]: '' }));
    updateTableValue(newColumns, newData);
  };

  const removeColumn = (columnIndex) => {
    const columnToRemove = columns[columnIndex];
    if (fixedColumns.includes(columnToRemove)) {
      alert('Cannot remove fixed columns');
      return;
    }
    const newColumns = columns.filter((_, i) => i !== columnIndex);
    const newData = tableData.map(row => {
      const newRow = { ...row };
      delete newRow[columnToRemove];
      return newRow;
    });
    updateTableValue(newColumns, newData);
    setColumnToDelete(null);
  };

  const renameColumn = (oldName, newName) => {
    if (!newName.trim() || newName === oldName) {
      setEditingColumn(null);
      return;
    }
    if (columns.includes(newName)) {
      alert('A column with this name already exists');
      return;
    }
    if (fixedColumns.includes(oldName)) {
      alert('Cannot rename fixed columns');
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
  };

  const moveColumn = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= columns.length) return;
    const columnToMove = columns[fromIndex];
    if (fixedColumns.includes(columnToMove)) return; // Don't allow moving fixed columns

    const newColumns = [...columns];
    const [movedColumn] = newColumns.splice(fromIndex, 1);
    newColumns.splice(toIndex, 0, movedColumn);
    updateTableValue(newColumns, tableData);
  };

  // Group data by category
  const groupedData = categories.reduce((acc, category) => {
    acc[category] = tableData.filter(row => row.Category === category);
    return acc;
  }, {});

  // Drag and drop handlers
  const handleDragStart = (e, rowIndex) => {
    setDraggedRow(rowIndex);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedRow === null || draggedRow === dropIndex) return;

    moveRow(draggedRow, dropIndex);
    setDraggedRow(null);
  };

  const handleDragEnd = () => {
    setDraggedRow(null);
  };

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

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-4 p-4 bg-ui-muted border border-ui-border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-ui-text">Validation Errors:</span>
          </div>
          <ul className="list-disc list-inside text-sm text-ui-text-muted">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="border border-ui-border rounded-xl overflow-hidden shadow-sm bg-ui-surface">
        <div className="bg-ui-muted px-6 py-4 border-b border-ui-border">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-base font-semibold text-ui-text">
                {tableData.length} Standards
              </span>
              <span className="text-sm text-ui-text-muted">
                Drag rows to reorder • M = Mandatory, R = Recommended
              </span>
            </div>
            <div className="flex gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  type="button"
                  onClick={() => addRow(category)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md border border-ui-border bg-ui-surface text-ui-text-muted hover:bg-ui-muted hover:text-ui-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-primary/30 transition-colors shadow-sm text-sm"
                >
                  <Plus size={14} />
                  <span>Add {category.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {tableData.length === 0 ? (
          <div className="p-12 text-center text-ui-text-muted">
            <div className="w-16 h-16 mx-auto mb-4 text-ui-text-muted bg-ui-muted rounded-full flex items-center justify-center border border-ui-border">
              📋
            </div>
            <p className="text-lg mb-4">No standards defined yet.</p>
            <p className="text-sm">Click "Add Core", "Add Enablers", or "Add Others" to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-ui-surface">
            <table className="w-full min-w-full table-fixed bep-table">
              <thead className="bg-ui-muted border-b border-ui-border">
                <tr>
                  <th className="w-10 px-1 py-3">
                  </th>
                  {columns.map((column, colIndex) => (
                    <th key={column} className={cn('px-4 py-3 text-left text-ui-text border-b border-ui-border',
                      column === 'Category' ? 'w-32' :
                      column === 'Reference' ? 'w-64' :
                      'w-24'
                    )}>
                      <div className="group">
                        {/* Column name (editable for dynamic columns) */}
                        <div className="mb-2">
                          {editingColumn === colIndex ? (
                            <input
                              type="text"
                              value={editingColumnName}
                              onChange={(e) => setEditingColumnName(e.target.value)}
                              onBlur={() => renameColumn(column, editingColumnName)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  renameColumn(column, editingColumnName);
                                } else if (e.key === 'Escape') {
                                  setEditingColumn(null);
                                }
                              }}
                              autoFocus
                              className="w-full px-2 py-1.5 text-sm font-semibold border border-ui-primary rounded-md bg-ui-surface text-ui-text shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ui-primary/30"
                            />
                          ) : (
                            <div
                              onClick={() => {
                                if (!fixedColumns.includes(column)) {
                                  setEditingColumn(colIndex);
                                  setEditingColumnName(column);
                                }
                              }}
                              className={cn('px-2 py-1.5 text-sm font-semibold text-ui-text uppercase tracking-wider rounded-md transition-colors',
                                fixedColumns.includes(column)
                                  ? 'cursor-default'
                                  : 'cursor-pointer hover:bg-ui-surface'
                              )}
                              title={fixedColumns.includes(column) ? 'Fixed column' : 'Click to rename'}
                            >
                              {column}
                            </div>
                          )}
                        </div>

                        {/* Column controls - appear on hover for dynamic columns */}
                        {!fixedColumns.includes(column) && (
                          <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Move left */}
                            <button
                              type="button"
                              onClick={() => moveColumn(colIndex, colIndex - 1)}
                              disabled={colIndex === 0}
                              className="p-1 rounded-md border border-ui-border bg-ui-surface hover:bg-ui-muted text-ui-primary disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-ui-surface shadow-sm transition-colors text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-primary/30"
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
                              className="p-1 rounded-md border border-ui-border bg-ui-surface hover:bg-ui-muted text-ui-text-muted hover:text-ui-text shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-primary/30"
                              title="Rename column"
                            >
                              <Edit2 size={12} />
                            </button>

                            {/* Move right */}
                            <button
                              type="button"
                              onClick={() => moveColumn(colIndex, colIndex + 1)}
                              disabled={colIndex === columns.length - 1}
                              className="p-1 rounded-md border border-ui-border bg-ui-surface hover:bg-ui-muted text-ui-primary disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-ui-surface shadow-sm transition-colors text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-primary/30"
                              title="Move right"
                            >
                              →
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => setColumnToDelete(colIndex)}
                              className="p-1 rounded-md border border-ui-border bg-ui-surface hover:bg-ui-muted text-red-600 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-primary/30"
                              title="Remove column"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="w-12 px-1 py-3 text-center">
                    <button
                      type="button"
                      onClick={addColumn}
                      className="p-1.5 rounded-md border border-ui-border bg-ui-surface hover:bg-ui-muted text-ui-primary shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-primary/30"
                      title="Add application area"
                    >
                      <Plus size={16} />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-ui-surface">
                {categories.map(category => {
                  const categoryData = groupedData[category];
                  if (categoryData.length === 0) return null;

                  return (
                    <React.Fragment key={category}>
                      {/* Category Header */}
                      <tr className="bg-ui-muted border-t border-ui-border">
                        <td colSpan={columns.length + 2} className="px-4 py-3 border-b border-ui-border">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 bg-ui-primary rounded-full"></div>
                            <span className="font-semibold text-ui-text uppercase tracking-wide text-sm">
                              {category}
                            </span>
                            <span className="text-sm text-ui-text-muted">
                              ({categoryData.length} {categoryData.length === 1 ? 'standard' : 'standards'})
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* Category Rows */}
                      {categoryData.map((row, categoryIndex) => {
                        const globalIndex = tableData.findIndex(r => r === row);
                        return (
                          <tr
                            key={globalIndex}
                            className="hover:bg-ui-muted/60 transition-colors border-b border-ui-border"
                            draggable
                            onDragStart={(e) => handleDragStart(e, globalIndex)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, globalIndex)}
                            onDragEnd={handleDragEnd}
                          >
                            <td className="px-1 py-2">
                              <div className="flex items-center justify-center cursor-move">
                                <GripVertical size={14} className="text-ui-text-muted" />
                              </div>
                            </td>
                            {columns.map(column => (
                              <td key={column} className="px-1 py-2">
                                {column === 'Category' ? (
                                  <select
                                    value={row[column] || ''}
                                    onChange={(e) => updateCell(globalIndex, column, e.target.value)}
                                    className="w-full px-2 py-1.5 text-sm border border-ui-border rounded-md bg-ui-surface text-ui-text focus:outline-none focus-visible:ring-2 focus-visible:ring-ui-primary/30"
                                  >
                                    {categories.map(cat => (
                                      <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                  </select>
                                ) : column === 'Reference' ? (
                                  <input
                                    type="text"
                                    value={row[column] || ''}
                                    onChange={(e) => updateCell(globalIndex, column, e.target.value)}
                                    className="w-full px-2 py-1.5 text-sm border border-ui-border rounded-md bg-ui-surface text-ui-text placeholder:text-ui-text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ui-primary/30"
                                    placeholder="e.g., BS EN ISO 19650-1:2018"
                                  />
                                ) : (
                                  <div className="flex gap-1 justify-center">
                                    <button
                                      type="button"
                                      onClick={() => updateCell(globalIndex, column, row[column] === 'M' ? '' : 'M')}
                                      className={cn('w-8 h-8 rounded-md border flex items-center justify-center text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-primary/30',
                                        row[column] === 'M'
                                          ? 'bg-red-50 border-red-300 text-red-700 shadow-sm'
                                          : 'border-ui-border text-ui-text-muted hover:bg-ui-muted hover:text-ui-text'
                                      )}
                                      title="Mandatory"
                                    >
                                      M
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => updateCell(globalIndex, column, row[column] === 'R' ? '' : 'R')}
                                      className={cn('w-8 h-8 rounded-md border flex items-center justify-center text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-primary/30',
                                        row[column] === 'R'
                                          ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm'
                                          : 'border-ui-border text-ui-text-muted hover:bg-ui-muted hover:text-ui-text'
                                      )}
                                      title="Recommended"
                                    >
                                      R
                                    </button>
                                  </div>
                                )}
                              </td>
                            ))}
                            <td className="px-1 py-2">
                              <button
                                type="button"
                                onClick={() => removeRow(globalIndex)}
                                className="w-6 h-6 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-ui-muted rounded-md transition-colors font-medium text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-primary/30"
                                title="Remove standard"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <FieldError error={error} />

      {/* Delete Column Confirmation Modal */}
      {columnToDelete !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setColumnToDelete(null)}>
          <div className="bg-ui-surface border border-ui-border rounded-xl shadow-xl p-6 max-w-md w-full mx-4 transform transition-all" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-red-50 rounded-full border border-red-200">
                <X size={24} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-ui-text mb-1 uppercase tracking-wide">Remove Application Area?</h3>
                <p className="text-ui-text-muted">
                  Are you sure you want to remove the application area <span className="font-semibold text-ui-text">"{columns[columnToDelete]}"</span>?
                </p>
              </div>
            </div>

            {/* Warning message */}
            <div className="bg-ui-muted border border-ui-border rounded-lg p-3 mb-6">
              <p className="text-sm text-ui-text-muted">
                ⚠️ This will permanently delete all applicability data for this area from all standards.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setColumnToDelete(null)}
                className="flex-1 px-4 py-2.5 bg-ui-surface hover:bg-ui-muted text-ui-text-muted hover:text-ui-text font-medium rounded-md border border-ui-border shadow-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => removeColumn(columnToDelete)}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md border border-red-600 shadow-sm transition-colors"
              >
                Remove Area
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default StandardsTable;
