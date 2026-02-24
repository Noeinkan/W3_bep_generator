import { useState } from 'react';
import { Table as TableIcon, ChevronDown } from 'lucide-react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';

const GRID_ROWS = 8;
const GRID_COLS = 8;

const TableInsertDialog = ({ onInsert, onClose }) => {
  const [hovered, setHovered] = useState({ rows: 0, cols: 0 });
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [withHeaderRow, setWithHeaderRow] = useState(true);
  const [showCustom, setShowCustom] = useState(false);

  // While hovering, show hover dims; otherwise show committed selection
  const displayRows = hovered.rows > 0 ? hovered.rows : rows;
  const displayCols = hovered.cols > 0 ? hovered.cols : cols;

  const handleGridClick = (r, c) => {
    onInsert({ rows: r, cols: c, withHeaderRow });
    onClose();
  };

  const handleInsert = () => {
    onInsert({ rows, cols, withHeaderRow });
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleInsert(); }
    else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
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
          <Button onClick={handleInsert} icon={TableIcon}>
            Insert {rows} × {cols}
          </Button>
        </>
      }
    >
      <div onKeyDown={handleKeyDown}>

        {/* Visual grid picker */}
        <div className="mb-5">
          <p className="text-xs text-gray-500 mb-2">Click to select table size</p>
          <div
            style={{
              display: 'inline-grid',
              gridTemplateColumns: `repeat(${GRID_COLS}, 1.5rem)`,
              gap: '0.125rem',
              padding: '0.25rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '0.5rem',
            }}
            onMouseLeave={() => setHovered({ rows: 0, cols: 0 })}
          >
            {Array.from({ length: GRID_ROWS * GRID_COLS }).map((_, idx) => {
              const r = Math.floor(idx / GRID_COLS) + 1;
              const c = (idx % GRID_COLS) + 1;
              const isActive = r <= displayRows && c <= displayCols;
              return (
                <div
                  key={idx}
                  className={`w-6 h-6 rounded-sm cursor-pointer transition-colors duration-75 ${
                    isActive
                      ? 'bg-blue-500 border border-blue-600'
                      : 'bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  onMouseEnter={() => setHovered({ rows: r, cols: c })}
                  onClick={() => handleGridClick(r, c)}
                />
              );
            })}
          </div>
          <p className="mt-2 text-sm font-semibold text-gray-800">
            {displayRows} × {displayCols}{' '}
            <span className="font-normal text-gray-500">table</span>
          </p>
        </div>

        <hr className="border-gray-200 mb-4" />

        {/* Header row */}
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={withHeaderRow}
              onChange={(e) => setWithHeaderRow(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Include header row</span>
          </label>
        </div>

        {/* Custom / larger size */}
        <div>
          <button
            type="button"
            onClick={() => setShowCustom(!showCustom)}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Need a larger table?
            <ChevronDown
              size={14}
              className={`transition-transform duration-150 ${showCustom ? 'rotate-180' : ''}`}
            />
          </button>

          {showCustom && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Rows (1–30)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={rows}
                  onChange={(e) => setRows(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Columns (1–15)</label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={cols}
                  onChange={(e) => setCols(Math.max(1, Math.min(15, parseInt(e.target.value) || 1)))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </Modal>
  );
};

export default TableInsertDialog;
