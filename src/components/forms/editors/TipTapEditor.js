import React, { useEffect, useRef, useState } from 'react';
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
import './tiptap.css';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

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
  fieldName,
  compactMode = false,
  onFocus,
  onBlur,
  onMouseDown,
}) => {
  const [zoom, setZoom] = useState(100);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [helpContent, setHelpContent] = useState(null);

  // Keep callback refs current so stale closures in useEditor config always
  // call the latest prop values without needing to rebuild the editor.
  const onChangeRef = useRef(onChange);
  const onFocusRef  = useRef(onFocus);
  const onBlurRef   = useRef(onBlur);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => { onFocusRef.current  = onFocus;  }, [onFocus]);
  useEffect(() => { onBlurRef.current   = onBlur;   }, [onBlur]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: {
          depth: 100,
        },
        link: false,
        underline: false,
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
        class: 'tiptap-editor prose prose-sm max-w-none focus:outline-none',
        id: id || undefined,
        'aria-required': ariaRequired || undefined,
        'aria-label': 'Rich text editor',
        'aria-multiline': 'true',
        spellcheck: 'true',
      },
      handleDOMEvents: {
        focus: (_view, event) => {
          onFocusRef.current?.(event);
          return false;
        },
        blur: (_view, event) => {
          onBlurRef.current?.(event);
          return false;
        },
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find(item => item.type.indexOf('image') === 0);

        if (imageItem) {
          const file = imageItem.getAsFile();
          if (!file || file.size > MAX_IMAGE_BYTES) return true; // suppress default, reject oversized

          event.preventDefault();
          const reader = new FileReader();

          reader.onload = (e) => {
            const { schema } = view.state;
            const node = schema.nodes.resizableImage.create({ src: e.target.result });
            const transaction = view.state.tr.replaceSelectionWith(node);
            view.dispatch(transaction);
          };

          reader.readAsDataURL(file);
          return true;
        }
        return false;
      },
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];

          if (file.type.indexOf('image') === 0) {
            if (file.size > MAX_IMAGE_BYTES) return true; // reject oversized, suppress default

            event.preventDefault();
            const reader = new FileReader();

            reader.onload = (e) => {
              const { schema } = view.state;
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });

              if (coordinates) {
                const node = schema.nodes.resizableImage.create({ src: e.target.result });
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

          const isInTable = state.schema.nodes.table &&
                           selection.$anchor.node(-3) &&
                           selection.$anchor.node(-3).type.name === 'table';

          if (isInTable) {
            event.preventDefault();

            if (event.shiftKey) {
              return view.state.schema.nodes.tableCell
                ? editor?.commands.goToPreviousCell()
                : false;
            } else {
              return view.state.schema.nodes.tableCell
                ? editor?.commands.goToNextCell()
                : false;
            }
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      onChangeRef.current(editor.getHTML());
    },
  });

  // Auto-save to localStorage with debouncing
  useEffect(() => {
    if (!editor || !autoSaveKey) return;

    const timeoutId = setTimeout(() => {
      localStorage.setItem(autoSaveKey, editor.getHTML());
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [editor, value, autoSaveKey]);

  // Restore from localStorage on mount
  useEffect(() => {
    if (!editor || !autoSaveKey) return;

    const saved = localStorage.getItem(autoSaveKey);
    const editorIsBlank = editor.isEmpty || !value || value === '<p></p>';
    if (saved && saved !== value && editorIsBlank) {
      editor.commands.setContent(saved);
    }
    // eslint-disable-next-line
  }, [editor, autoSaveKey]);

  // Update editor content when value prop changes externally.
  // setContent with emitUpdate=false prevents onUpdate from firing, which
  // breaks the value → setContent → onUpdate → onChange → value loop.
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  // Word and character count
  const text = editor?.getText() ?? '';
  const stats = { // eslint-disable-line no-unused-vars
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    characters: editor?.storage.characterCount?.characters() ?? text.length,
  };

  useEffect(() => {
    let isMounted = true;

    if (!fieldName) {
      setHelpContent(null);
      return () => { isMounted = false; };
    }

    getHelpContent(fieldName)
      .then((content) => {
        if (isMounted) setHelpContent(content || null);
      })
      .catch(() => {
        if (isMounted) setHelpContent(null);
      });

    return () => { isMounted = false; };
  }, [fieldName]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={`tiptap-wrapper ${className}`}
      style={{
        '--tiptap-padding': compactMode ? '0.375rem 0.5rem' : '0.75rem',
        '--tiptap-min-height': minHeight,
      }}
    >
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
        className={`tiptap-content-wrapper border border-ui-border ${showToolbar ? 'rounded-b-lg' : 'rounded-lg'} bg-ui-surface text-ui-text overflow-auto`}
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
    </div>
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
// This is critical for performance in tables where many editors exist
export default React.memo(TipTapEditor);
