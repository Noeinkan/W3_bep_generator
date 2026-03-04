import React, { useState } from 'react';
import { FloatingMenu } from '@tiptap/react/menus';
import {
  Plus,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Table as TableIcon,
  Quote,
  Minus,
  Image as ImageIcon,
} from 'lucide-react';

const MENU_ITEMS = [
  {
    label: 'Heading 1',
    icon: Heading1,
    shortcut: 'H1',
    action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    label: 'Heading 2',
    icon: Heading2,
    shortcut: 'H2',
    action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    label: 'Heading 3',
    icon: Heading3,
    shortcut: 'H3',
    action: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    label: 'Bullet List',
    icon: List,
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    label: 'Numbered List',
    icon: ListOrdered,
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    label: 'Table',
    icon: TableIcon,
    action: (editor) =>
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
  {
    label: 'Blockquote',
    icon: Quote,
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    label: 'Divider',
    icon: Minus,
    action: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
  {
    label: 'Image',
    icon: ImageIcon,
    action: (editor) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target.result) editor.chain().focus().setImage({ src: ev.target.result }).run();
        };
        reader.readAsDataURL(file);
      };
      input.click();
    },
  },
];

const TipTapFloatingMenu = ({ editor }) => {
  const [open, setOpen] = useState(false);

  if (!editor) return null;

  return (
    <FloatingMenu
      editor={editor}
      tippyOptions={{ duration: 100, placement: 'left' }}
      shouldShow={({ state }) => {
        const { selection } = state;
        const { $anchor, empty } = selection;
        const isRootDepth = $anchor.depth === 1;
        const isEmptyTextBlock =
          $anchor.parent.isTextblock &&
          !$anchor.parent.type.spec.code &&
          !$anchor.parent.textContent;
        return empty && isRootDepth && isEmptyTextBlock;
      }}
    >
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          title="Insert block (or type / for commands)"
          aria-label="Insert block"
          className="w-6 h-6 flex items-center justify-center rounded-full border border-ui-border bg-ui-surface text-ui-text-muted hover:bg-ui-muted hover:text-ui-primary hover:border-ui-primary transition-colors shadow-sm"
        >
          <Plus size={14} />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" aria-hidden onClick={() => setOpen(false)} />
            <div className="absolute left-8 top-0 z-20 bg-ui-surface border border-ui-border rounded-lg shadow-lg py-1 min-w-[10rem]">
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    className="w-full text-left px-3 py-1.5 flex items-center gap-2.5 text-sm text-ui-text hover:bg-ui-muted transition-colors"
                    onClick={() => {
                      item.action(editor);
                      setOpen(false);
                    }}
                  >
                    <Icon size={15} className="text-ui-text-muted flex-shrink-0" />
                    <span>{item.label}</span>
                    {item.shortcut && (
                      <span className="ml-auto text-xs text-ui-text-muted font-mono">{item.shortcut}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </FloatingMenu>
  );
};

export default TipTapFloatingMenu;
