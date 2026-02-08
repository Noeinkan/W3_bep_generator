import React, { useEffect, useCallback, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { FontFamily } from '@tiptap/extension-font-family';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import FontSize from './extensions/FontSize';
import ResizableImage from './extensions/ResizableImage';
import TipTapToolbar from './TipTapToolbar';
import FindReplaceDialog from '../dialogs/FindReplaceDialog';
import TableBubbleMenu from '../tables/TableBubbleMenu';
import { getHelpContent } from '../../../data/helpContent';

const TipTapEditor = ({
  value = '',
  onChange,
  placeholder = 'Start typing...',
  className = '',
  id,
  'aria-required': ariaRequired,
  showToolbar = true,
  autoSaveKey = 'tiptap-autosave',
  minHeight = '200px',
  fieldName, // Add fieldName prop
  compactMode = false, // Add compact mode for tables
  onFocus, // Add focus handler
  onBlur, // Add blur handler
  onMouseDown, // Add mousedown handler
}) => {
  const [zoom, setZoom] = useState(100);
  const [showFindReplace, setShowFindReplace] = useState(false);

  const editor = useEditor({
    immediatelyRender: false, // Prevent duplicate extension warnings in React Strict Mode
    extensions: [
      StarterKit.configure({
        history: {
          depth: 100, // Robust undo/redo history
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      FontSize.configure({
        types: ['textStyle'],
      }),
      Table.configure({
        resizable: true,
        handleWidth: 5,
        cellMinWidth: 50,
        HTMLAttributes: {
          class: 'tiptap-table',
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
      ResizableImage.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'tiptap-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'tiptap-link',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'tiptap-editor prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
        id: id || undefined,
        'aria-required': ariaRequired || undefined,
        'aria-label': 'Rich text editor',
        'aria-multiline': 'true',
        spellcheck: 'true',
      },
      // Handle focus/blur events
      handleDOMEvents: {
        focus: (_view, event) => {
          if (onFocus) {
            onFocus(event);
          }
          return false;
        },
        blur: (_view, event) => {
          if (onBlur) {
            onBlur(event);
          }
          return false;
        },
      },
      // Handle paste with images
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find(item => item.type.indexOf('image') === 0);

        if (imageItem) {
          event.preventDefault();
          const file = imageItem.getAsFile();
          const reader = new FileReader();

          reader.onload = (e) => {
            const { schema } = view.state;
            const node = schema.nodes.resizableImage.create({
              src: e.target.result,
            });
            const transaction = view.state.tr.replaceSelectionWith(node);
            view.dispatch(transaction);
          };

          if (file) {
            reader.readAsDataURL(file);
          }
          return true;
        }
        return false;
      },
      // Handle drag and drop images
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          const fileType = file.type;

          if (fileType.indexOf('image') === 0) {
            event.preventDefault();
            const reader = new FileReader();

            reader.onload = (e) => {
              const { schema } = view.state;
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });

              if (coordinates) {
                const node = schema.nodes.resizableImage.create({
                  src: e.target.result,
                });
                const transaction = view.state.tr.insert(coordinates.pos, node);
                view.dispatch(transaction);
              }
            };

            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      },
      // Handle Tab key for table navigation
      handleKeyDown: (view, event) => {
        if (event.key === 'Tab') {
          const { state } = view;
          const { selection } = state;

          // Check if we're in a table
          const isInTable = state.schema.nodes.table &&
                           selection.$anchor.node(-3) &&
                           selection.$anchor.node(-3).type.name === 'table';

          if (isInTable) {
            event.preventDefault();

            if (event.shiftKey) {
              // Shift+Tab: go to previous cell
              return view.state.schema.nodes.tableCell
                ? editor.commands.goToPreviousCell()
                : false;
            } else {
              // Tab: go to next cell
              return view.state.schema.nodes.tableCell
                ? editor.commands.goToNextCell()
                : false;
            }
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Auto-save to localStorage with debouncing
  useEffect(() => {
    if (!editor || !autoSaveKey) return;

    const timeoutId = setTimeout(() => {
      const content = editor.getHTML();
      localStorage.setItem(autoSaveKey, content);
    }, 1000); // Debounce 1 second

    return () => clearTimeout(timeoutId);
  }, [editor, value, autoSaveKey]);

  // Restore from localStorage on mount
  useEffect(() => {
    if (!editor || !autoSaveKey) return;

    const saved = localStorage.getItem(autoSaveKey);
    if (saved && saved !== value && editor.isEmpty) {
      editor.commands.setContent(saved);
    }
    // eslint-disable-next-line
  }, [editor, autoSaveKey]);

  // Update editor content when value prop changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      // Preserve focus and cursor position when updating content
      const { from, to } = editor.state.selection;
      const wasFocused = editor.isFocused;

      editor.commands.setContent(value);

      // Restore focus and cursor position if editor was focused
      if (wasFocused) {
        editor.commands.focus();
        // Try to restore cursor position if still valid
        try {
          editor.commands.setTextSelection({ from, to });
        } catch (e) {
          // Position no longer valid, just focus at end
          editor.commands.focus('end');
        }
      }
    }
  }, [editor, value]);

  // Word and character count
  const getStats = useCallback(() => {
    if (!editor) return { words: 0, characters: 0 };

    const text = editor.getText();
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = editor.storage.characterCount?.characters() || text.length;

    return { words, characters };
  }, [editor]);

  const stats = getStats();
  const helpContent = fieldName ? getHelpContent(fieldName) : null;

  if (!editor) {
    return null;
  }

  return (
    <div className={`tiptap-wrapper ${className}`}>
      {/* Toolbar */}
      {showToolbar && (
        <TipTapToolbar
          editor={editor}
          zoom={zoom}
          onZoomChange={setZoom}
          onFindReplace={() => setShowFindReplace(true)}
          fieldName={fieldName}
          helpContent={helpContent}
        />
      )}

      {/* Editor Content with Zoom */}
      <div
        className={`tiptap-content-wrapper border border-gray-300 ${showToolbar ? 'rounded-b-lg' : 'rounded-lg'} bg-white overflow-auto`}
        style={{
          minHeight,
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top left',
          width: `${10000 / zoom}%`,
        }}
        onMouseDown={onMouseDown}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Find & Replace Dialog */}
      {showFindReplace && (
        <FindReplaceDialog
          editor={editor}
          onClose={() => setShowFindReplace(false)}
        />
      )}

      {/* Table Bubble Menu */}
      <TableBubbleMenu editor={editor} />


      {/* Custom Styles */}
      <style>{`
        .tiptap-editor {
          padding: ${compactMode ? '0.375rem 0.5rem' : '0.75rem'};
          min-height: ${minHeight};
          outline: none;
        }

        .tiptap-editor:focus {
          outline: none;
          border: none;
        }

        .tiptap-editor p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        /* Smooth caret animation */
        .tiptap-editor .ProseMirror-focused {
          caret-color: #3b82f6;
        }

        /* Table styles */
        .tiptap-editor table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 1rem 0;
          overflow: hidden;
        }

        .tiptap-editor table td,
        .tiptap-editor table th {
          border: 1px solid #000000;
          box-sizing: border-box;
          min-width: 3em;
          padding: 0.5rem;
          position: relative;
          vertical-align: top;
        }

        .tiptap-editor table th {
          background-color: #f3f4f6;
          font-weight: 600;
          text-align: left;
        }

        .tiptap-editor table .selectedCell {
          background-color: #dbeafe !important;
          border-color: #3b82f6 !important;
          box-shadow: inset 0 0 0 1px #3b82f6;
        }

        /* Column resize handle */
        .tiptap-editor .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: #3b82f6;
          pointer-events: none;
          z-index: 20;
        }

        .tiptap-editor .resize-cursor {
          cursor: col-resize;
        }

        /* ProseMirror table resize handle visibility */
        .tiptap-editor .ProseMirror-table-handle {
          position: absolute;
          background-color: #3b82f6;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .tiptap-editor .ProseMirror-table-handle:hover {
          opacity: 1;
        }

        .tiptap-editor table:hover .ProseMirror-table-handle {
          opacity: 0.5;
        }

        /* Image styles */
        .tiptap-image {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
          margin: 0.5rem 0;
        }

        .tiptap-image.ProseMirror-selectednode {
          outline: 3px solid #3b82f6;
        }

        /* Link styles */
        .tiptap-link {
          color: #3b82f6;
          text-decoration: underline;
          cursor: pointer;
        }

        .tiptap-link:hover {
          color: #2563eb;
        }

        /* List styles */
        .tiptap-editor ul,
        .tiptap-editor ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }

        .tiptap-editor ul {
          list-style-type: disc;
        }

        .tiptap-editor ol {
          list-style-type: decimal;
        }

        .tiptap-editor li {
          margin: 0.25rem 0;
          display: list-item;
        }

        /* Heading styles */
        .tiptap-editor h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; }
        .tiptap-editor h2 { font-size: 1.5em; font-weight: bold; margin: 0.75em 0; }
        .tiptap-editor h3 { font-size: 1.17em; font-weight: bold; margin: 0.83em 0; }
        .tiptap-editor h4 { font-size: 1em; font-weight: bold; margin: 1.12em 0; }
        .tiptap-editor h5 { font-size: 0.83em; font-weight: bold; margin: 1.5em 0; }
        .tiptap-editor h6 { font-size: 0.75em; font-weight: bold; margin: 1.67em 0; }

        /* Code and blockquote */
        .tiptap-editor code {
          background-color: #f3f4f6;
          border-radius: 0.25rem;
          padding: 0.125rem 0.25rem;
          font-family: 'Courier New', monospace;
        }

        .tiptap-editor pre {
          background-color: #1f2937;
          color: #f9fafb;
          border-radius: 0.5rem;
          padding: 1rem;
          overflow-x: auto;
        }

        .tiptap-editor blockquote {
          border-left: 4px solid #d1d5db;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }

        /* Highlight styles */
        .tiptap-editor mark {
          border-radius: 0.125rem;
          padding: 0.125rem 0.25rem;
        }

        /* Smooth typing animation */
        @keyframes smooth-typing {
          from { opacity: 0.7; }
          to { opacity: 1; }
        }

        .tiptap-editor * {
          animation: smooth-typing 0.05s ease-in-out;
        }
      `}</style>
    </div>
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
// This is critical for performance in tables where many editors exist
export default React.memo(TipTapEditor);
