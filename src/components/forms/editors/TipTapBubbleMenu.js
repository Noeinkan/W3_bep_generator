import React, { useState, useCallback } from 'react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, Link as LinkIcon, ChevronDown } from 'lucide-react';

const BubbleButton = ({ onClick, active, children, title }) => (
  <button
    onClick={onClick}
    title={title}
    aria-label={title}
    type="button"
    className={`p-1.5 rounded transition-colors ${
      active ? 'bg-ui-primary text-white' : 'text-ui-text hover:bg-ui-muted'
    }`}
  >
    {children}
  </button>
);

const BUBBLE_COLORS = [
  '#000000', '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#2563eb', '#7c3aed', '#db2777',
  '#ffffff', '#fca5a5', '#fdba74', '#fde047', '#86efac', '#93c5fd', '#c4b5fd', '#f9a8d4',
];

const TipTapBubbleMenu = ({ editor }) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const applyLink = useCallback(() => {
    if (!editor || !linkUrl) return;
    const { from, to } = editor.state.selection;
    if (from === to) {
      editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkUrl}</a>`).run();
    } else {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }
    setLinkUrl('');
    setShowLinkInput(false);
  }, [editor, linkUrl]);

  const setColor = useCallback((color) => {
    if (editor) {
      editor.chain().focus().setColor(color).run();
      setShowColorPicker(false);
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100, placement: 'top' }}
      shouldShow={({ editor: ed, state }) => {
        // Only show for text selections, not when inside a table cell
        const { selection } = state;
        const { empty } = selection;
        if (empty) return false;
        // Don't show if the table bubble menu would show
        if (ed.isActive('table')) return false;
        return true;
      }}
    >
      <div className="tiptap-bubble-menu flex items-center gap-0.5 px-1.5 py-1 bg-ui-text rounded-lg shadow-lg border border-ui-border-strong">
        <BubbleButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold size={14} />
        </BubbleButton>

        <BubbleButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic size={14} />
        </BubbleButton>

        <BubbleButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon size={14} />
        </BubbleButton>

        <BubbleButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Strikethrough (Ctrl+Shift+X)"
        >
          <Strikethrough size={14} />
        </BubbleButton>

        <div className="w-px h-4 bg-white/20 mx-0.5" />

        {/* Link */}
        <div className="relative">
          <BubbleButton
            onClick={() => {
              setShowColorPicker(false);
              setShowLinkInput((v) => !v);
            }}
            active={editor.isActive('link')}
            title="Link (Ctrl+K)"
          >
            <LinkIcon size={14} />
          </BubbleButton>
          {showLinkInput && (
            <div className="absolute bottom-full mb-2 left-0 bg-ui-surface border border-ui-border rounded-lg shadow-lg p-2 w-56 z-30">
              <input
                type="url"
                className="w-full px-2 py-1 border border-ui-border rounded text-xs bg-ui-surface text-ui-text mb-1.5"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); applyLink(); }
                  if (e.key === 'Escape') setShowLinkInput(false);
                }}
                autoFocus
              />
              <div className="flex gap-1.5">
                <button
                  onClick={applyLink}
                  className="flex-1 py-1 text-xs bg-ui-primary text-white rounded hover:bg-ui-primary-hover"
                  type="button"
                >
                  Apply
                </button>
                <button
                  onClick={() => { editor.chain().focus().unsetLink().run(); setShowLinkInput(false); }}
                  className="flex-1 py-1 text-xs bg-ui-muted hover:bg-ui-border rounded text-ui-text"
                  type="button"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-4 bg-white/20 mx-0.5" />

        {/* Color picker */}
        <div className="relative">
          <button
            onClick={() => { setShowLinkInput(false); setShowColorPicker((v) => !v); }}
            title="Text Color"
            aria-label="Text Color"
            type="button"
            className="p-1.5 rounded flex items-center gap-0.5 text-ui-surface hover:bg-white/10 transition-colors"
          >
            <span className="text-xs font-bold leading-none" style={{ textDecoration: 'underline 2px' }}>A</span>
            <ChevronDown size={10} />
          </button>
          {showColorPicker && (
            <div className="absolute bottom-full mb-2 left-0 bg-ui-surface border border-ui-border rounded-lg shadow-lg p-2 z-30">
              <div className="grid grid-cols-8 gap-1">
                {BUBBLE_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setColor(color)}
                    className="w-5 h-5 rounded border border-ui-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                    type="button"
                  />
                ))}
              </div>
              <button
                onClick={() => { editor.chain().focus().unsetColor().run(); setShowColorPicker(false); }}
                className="mt-1.5 w-full py-0.5 text-xs bg-ui-muted hover:bg-ui-border rounded text-ui-text"
                type="button"
              >
                Default
              </button>
            </div>
          )}
        </div>
      </div>
    </BubbleMenu>
  );
};

export default TipTapBubbleMenu;
