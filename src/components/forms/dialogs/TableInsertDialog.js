import React, { useState } from 'react';
import { Table as TableIcon } from 'lucide-react';
import BaseTextInput from '../base/BaseTextInput';
import Modal from '../../common/Modal';
import Button from '../../common/Button';

const TableInsertDialog = ({ onInsert, onClose }) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [withHeaderRow, setWithHeaderRow] = useState(true);

  const presets = [
    { label: '2×2', rows: 2, cols: 2, header: false },
    { label: '3×3', rows: 3, cols: 3, header: true },
    { label: '4×4', rows: 4, cols: 4, header: true },
    { label: '5×3', rows: 5, cols: 3, header: true },
    { label: '3×5', rows: 3, cols: 5, header: true },
  ];

  const handleInsert = () => {
    onInsert({ rows, cols, withHeaderRow });
    onClose();
  };

  const handlePreset = (preset) => {
    setRows(preset.rows);
    setCols(preset.cols);
    setWithHeaderRow(preset.header);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInsert();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="Insert Table"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleInsert} icon={TableIcon}>Insert Table</Button>
        </>
      }
    >
      <div onKeyDown={handleKeyDown}>
        {/* Presets */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preset Sizes:
          </label>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePreset(preset)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  rows === preset.rows && cols === preset.cols && withHeaderRow === preset.header
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
                type="button"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom dimensions */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Dimensions:
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Rows</label>
              <BaseTextInput
                type="number"
                min="1"
                max="20"
                value={rows}
                onChange={(e) => setRows(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                className="px-3 py-2 border-gray-300"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Columns</label>
              <BaseTextInput
                type="number"
                min="1"
                max="10"
                value={cols}
                onChange={(e) => setCols(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                className="px-3 py-2 border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Header row option */}
        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={withHeaderRow}
              onChange={(e) => setWithHeaderRow(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Include header row</span>
          </label>
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preview:</label>
          <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 overflow-auto">
            <table className="w-full border-collapse text-xs">
              <tbody>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {Array.from({ length: cols }).map((_, colIndex) => {
                      const isHeader = withHeaderRow && rowIndex === 0;
                      const CellTag = isHeader ? 'th' : 'td';
                      return (
                        <CellTag
                          key={colIndex}
                          className={`border border-gray-300 px-2 py-1 ${
                            isHeader ? 'bg-gray-200 font-semibold' : 'bg-white'
                          }`}
                        >
                          {isHeader ? 'Header' : 'Cell'}
                        </CellTag>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TableInsertDialog;
