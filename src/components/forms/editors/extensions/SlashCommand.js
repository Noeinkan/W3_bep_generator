import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import {
  Heading1, Heading2, Heading3,
  List, ListOrdered, Table as TableIcon,
  Quote, Minus, Code, Image as ImageIcon,
} from 'lucide-react';

// ─── Command definitions ───────────────────────────────────────────────────────

const COMMANDS = [
  {
    title: 'Heading 1',
    description: 'Large section heading',
    icon: Heading1,
    keywords: ['h1', 'heading', 'title', 'large'],
    action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    icon: Heading2,
    keywords: ['h2', 'heading', 'subtitle', 'medium'],
    action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    icon: Heading3,
    keywords: ['h3', 'heading', 'small'],
    action: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    title: 'Bullet List',
    description: 'Unordered list of items',
    icon: List,
    keywords: ['ul', 'bullet', 'list', 'unordered'],
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    title: 'Numbered List',
    description: 'Ordered list of items',
    icon: ListOrdered,
    keywords: ['ol', 'number', 'numbered', 'ordered', 'list'],
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    title: 'Table',
    description: 'Insert a 3×3 table',
    icon: TableIcon,
    keywords: ['table', 'grid', 'spreadsheet'],
    action: (editor) =>
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
  {
    title: 'Blockquote',
    description: 'Emphasise a quote or note',
    icon: Quote,
    keywords: ['quote', 'blockquote', 'callout'],
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    title: 'Code Block',
    description: 'Monospaced code block',
    icon: Code,
    keywords: ['code', 'codeblock', 'pre', 'mono'],
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    title: 'Divider',
    description: 'Horizontal separator line',
    icon: Minus,
    keywords: ['hr', 'divider', 'rule', 'separator', 'line'],
    action: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
  {
    title: 'Image',
    description: 'Upload an image from your device',
    icon: ImageIcon,
    keywords: ['image', 'img', 'photo', 'picture', 'upload'],
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

// ─── Dropdown component ────────────────────────────────────────────────────────

const SlashCommandList = forwardRef(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => setSelectedIndex(0), [items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((i) => (i - 1 + items.length) % items.length);
        return true;
      }
      if (event.key === 'ArrowDown') {
        setSelectedIndex((i) => (i + 1) % items.length);
        return true;
      }
      if (event.key === 'Enter') {
        const item = items[selectedIndex];
        if (item) command(item);
        return true;
      }
      return false;
    },
  }));

  if (!items.length) return null;

  return (
    <div className="slash-command-menu bg-ui-surface border border-ui-border rounded-lg shadow-lg py-1 min-w-[14rem] max-h-72 overflow-y-auto">
      <p className="px-3 pt-1 pb-1.5 text-xs font-medium text-ui-text-muted uppercase tracking-wide border-b border-ui-border mb-1">
        Insert block
      </p>
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={item.title}
            type="button"
            className={`w-full text-left px-3 py-2 flex items-start gap-2.5 transition-colors ${
              index === selectedIndex ? 'bg-ui-muted text-ui-primary' : 'text-ui-text hover:bg-ui-muted'
            }`}
            onClick={() => command(item)}
          >
            <Icon size={16} className="mt-0.5 flex-shrink-0 text-ui-text-muted" />
            <span>
              <span className="block text-sm font-medium leading-tight">{item.title}</span>
              <span className="block text-xs text-ui-text-muted leading-tight">{item.description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
});

SlashCommandList.displayName = 'SlashCommandList';

// ─── Suggestion renderer ───────────────────────────────────────────────────────

const renderSuggestion = () => {
  let component;
  let popup;

  return {
    onStart: (props) => {
      component = new ReactRenderer(SlashCommandList, {
        props,
        editor: props.editor,
      });

      popup = tippy('body', {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
      });
    },

    onUpdate: (props) => {
      component.updateProps(props);
      popup[0].setProps({ getReferenceClientRect: props.clientRect });
    },

    onKeyDown: (props) => {
      if (props.event.key === 'Escape') {
        popup[0].hide();
        return true;
      }
      return component.ref?.onKeyDown(props);
    },

    onExit: () => {
      popup[0].destroy();
      component.destroy();
    },
  };
};

// ─── TipTap Extension ─────────────────────────────────────────────────────────

const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }) => {
          props.action(editor);
          editor.chain().focus().deleteRange(range).run();
        },
        items: ({ query }) => {
          const q = query.toLowerCase().trim();
          if (!q) return COMMANDS;
          return COMMANDS.filter(
            (item) =>
              item.title.toLowerCase().includes(q) ||
              item.keywords.some((kw) => kw.includes(q))
          );
        },
        render: renderSuggestion,
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

export default SlashCommand;
