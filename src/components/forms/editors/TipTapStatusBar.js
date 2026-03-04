import React from 'react';

const TipTapStatusBar = ({ editor, compactMode = false }) => {
  if (!editor) return null;

  const charCount = editor.storage.characterCount?.characters() ?? 0;
  const wordCount = editor.storage.characterCount?.words() ?? 0;
  const readingMinutes = Math.max(1, Math.round(wordCount / 200));

  if (compactMode) {
    return (
      <div className="tiptap-status-bar px-3 py-1 border border-t-0 border-ui-border rounded-b-lg bg-ui-canvas flex items-center gap-3 text-xs text-ui-text-muted">
        <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
        <span className="text-ui-border">|</span>
        <span>{charCount} {charCount === 1 ? 'char' : 'chars'}</span>
      </div>
    );
  }

  return (
    <div className="tiptap-status-bar px-3 py-1.5 border border-t-0 border-ui-border rounded-b-lg bg-ui-canvas flex items-center gap-3 text-xs text-ui-text-muted select-none">
      <span>
        <span className="font-medium text-ui-text-soft">{wordCount}</span>{' '}
        {wordCount === 1 ? 'word' : 'words'}
      </span>
      <span className="text-ui-border" aria-hidden>|</span>
      <span>
        <span className="font-medium text-ui-text-soft">{charCount}</span>{' '}
        {charCount === 1 ? 'character' : 'characters'}
      </span>
      <span className="text-ui-border" aria-hidden>|</span>
      <span>~{readingMinutes} min read</span>
    </div>
  );
};

export default TipTapStatusBar;
