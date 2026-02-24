import React, { useState, useEffect, useRef } from 'react';
import {
  Table as TableIcon,
  Plus,
  Minus,
  Trash2,
  Merge,
  Split,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Type,
} from 'lucide-react';

const ButtonGroup = ({ children, label }) => (
  <div className="flex flex-col gap-1">
    {label && <span className="text-xs text-gray-500 px-2">{label}</span>}
    <div className="flex gap-1">{children}</div>
  </div>
);

const MenuButton = ({ onClick, disabled, children, title }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded hover:bg-gray-100 transition-colors ${
      disabled ? 'opacity-30 cursor-not-allowed' : 'text-gray-700'
    }`}
    type="button"
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-8 bg-gray-300 mx-1" />;

const TableBubbleMenu = ({ editor }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showCaptionInput, setShowCaptionInput] = useState(false);
  const [caption, setCaption] = useState('');
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

  useEffect(() => {
    if (!editor) return;

    const updateMenu = () => {
      try {
        const isInTableCell = editor.isActive('tableCell') || editor.isActive('tableHeader');

        if (isInTableCell) {
          const { from } = editor.state.selection;
          const start = editor.view.coordsAtPos(from);

          if (!start) {
            setShowMenu(false);
            return;
          }

          setPosition({
            top: start.top - 60,
            left: start.left,
          });
          setShowMenu(true);
        } else {
          setShowMenu(false);
          setShowCaptionInput(false);
        }
      } catch {
        setShowMenu(false);
      }
    };

    editor.on('selectionUpdate', updateMenu);
    editor.on('transaction', updateMenu);

    return () => {
      editor.off('selectionUpdate', updateMenu);
      editor.off('transaction', updateMenu);
    };
  }, [editor]);

  if (!editor || !showMenu) return null;

  return (
    <div
      ref={menuRef}
      className="bg-white border border-gray-300 rounded-lg shadow-lg p-2 flex gap-2 items-start"
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 1000,
        animation: 'fadeIn 0.15s ease-in-out',
      }}
    >
      {/* Row Operations */}
      <ButtonGroup label="Rows">
        <MenuButton
          onClick={() => editor.chain().focus().addRowBefore().run()}
          title="Add row above"
        >
          <div className="flex flex-col items-center">
            <ArrowUp size={14} />
            <Plus size={12} />
          </div>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().addRowAfter().run()}
          title="Add row below"
        >
          <div className="flex flex-col items-center">
            <Plus size={12} />
            <ArrowDown size={14} />
          </div>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().deleteRow().run()}
          title="Delete row"
        >
          <Minus size={16} />
        </MenuButton>
      </ButtonGroup>

      <Divider />

      {/* Column Operations */}
      <ButtonGroup label="Columns">
        <MenuButton
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          title="Add column left"
        >
          <div className="flex items-center">
            <ArrowLeft size={14} />
            <Plus size={12} />
          </div>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          title="Add column right"
        >
          <div className="flex items-center">
            <Plus size={12} />
            <ArrowRight size={14} />
          </div>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().deleteColumn().run()}
          title="Delete column"
        >
          <Minus size={16} />
        </MenuButton>
      </ButtonGroup>

      <Divider />

      {/* Cell Operations */}
      <ButtonGroup label="Cells">
        <MenuButton
          onClick={() => editor.chain().focus().mergeCells().run()}
          disabled={!editor.can().mergeCells()}
          title="Merge cells"
        >
          <Merge size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().splitCell().run()}
          disabled={!editor.can().splitCell()}
          title="Split cell"
        >
          <Split size={16} />
        </MenuButton>
      </ButtonGroup>

      <Divider />

      {/* Table Operations */}
      <ButtonGroup label="Table">
        <MenuButton
          onClick={() => setShowCaptionInput(!showCaptionInput)}
          title="Add caption"
        >
          <Type size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().deleteTable().run()}
          title="Delete table"
        >
          <Trash2 size={16} className="text-red-600" />
        </MenuButton>
      </ButtonGroup>

      {/* Caption Input */}
      {showCaptionInput && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-30 min-w-[300px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Table Caption (appears above table):
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Enter table caption..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                // Insert caption before the table
                const { state } = editor;
                const { $anchor } = state.selection;
                const tablePos = $anchor.before($anchor.depth - 2);

                editor.chain()
                  .focus()
                  .insertContentAt(tablePos, {
                    type: 'paragraph',
                    content: [{ type: 'text', text: caption, marks: [{ type: 'bold' }] }],
                  })
                  .run();

                setCaption('');
                setShowCaptionInput(false);
              } else if (e.key === 'Escape') {
                setShowCaptionInput(false);
              }
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                const { state } = editor;
                const { $anchor } = state.selection;
                const tablePos = $anchor.before($anchor.depth - 2);

                editor.chain()
                  .focus()
                  .insertContentAt(tablePos, {
                    type: 'paragraph',
                    content: [{ type: 'text', text: caption, marks: [{ type: 'bold' }] }],
                  })
                  .run();

                setCaption('');
                setShowCaptionInput(false);
              }}
              className="flex-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Add Caption
            </button>
            <button
              onClick={() => setShowCaptionInput(false)}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableBubbleMenu;
