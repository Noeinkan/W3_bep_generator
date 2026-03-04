import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { X } from 'lucide-react';

// ─── React chip component ──────────────────────────────────────────────────────

const SnippetChipView = ({ node, deleteNode, selected }) => {
  const { snippetKey } = node.attrs;

  return (
    <NodeViewWrapper
      as="span"
      className={`snippet-chip inline-flex items-center gap-1 mx-0.5 px-2 py-0.5 rounded-full text-xs font-mono font-medium border transition-colors select-none ${
        selected
          ? 'bg-ui-primary text-white border-ui-primary'
          : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
      }`}
      title={`Snippet: {{snippet:${snippetKey}}} — resolved at export time`}
      contentEditable={false}
    >
      <span className="opacity-60 text-[10px]">{'{'}</span>
      <span>{snippetKey}</span>
      <span className="opacity-60 text-[10px]">{'}'}</span>
      <button
        type="button"
        onClick={deleteNode}
        className={`ml-0.5 rounded-full p-0.5 transition-colors ${
          selected ? 'text-white/70 hover:text-white' : 'text-blue-400 hover:text-blue-700'
        }`}
        title="Remove snippet"
        aria-label={`Remove snippet ${snippetKey}`}
      >
        <X size={10} />
      </button>
    </NodeViewWrapper>
  );
};

// ─── TipTap Node extension ─────────────────────────────────────────────────────

const SnippetChip = Node.create({
  name: 'snippetChip',
  group: 'inline',
  inline: true,
  atom: true, // treat as single indivisible unit

  addAttributes() {
    return {
      snippetKey: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-snippet-key'),
        renderHTML: (attributes) => ({
          'data-snippet-key': attributes.snippetKey,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-snippet-chip]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, { 'data-snippet-chip': '' }),
      `{{snippet:${HTMLAttributes['data-snippet-key']}}}`,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(SnippetChipView);
  },

  // Insert command: editor.commands.insertSnippetChip('key')
  addCommands() {
    return {
      insertSnippetChip:
        (snippetKey) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { snippetKey },
          }),
    };
  },
});

export default SnippetChip;
