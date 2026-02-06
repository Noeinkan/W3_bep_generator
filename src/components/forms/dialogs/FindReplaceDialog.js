import React, { useState, useCallback } from 'react';
import { Search, Replace, ChevronDown, ChevronUp } from 'lucide-react';
import BaseTextInput from '../base/BaseTextInput';
import Modal from '../../common/Modal';
import Button from '../../common/Button';

const FindReplaceDialog = ({ editor, onClose }) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);

  const highlightMatches = useCallback((searchTerm) => {
    if (!editor || !searchTerm) {
      setMatchCount(0);
      setCurrentMatch(0);
      return [];
    }

    const text = editor.getText();
    const flags = matchCase ? 'g' : 'gi';
    const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    const matches = [...text.matchAll(regex)];

    setMatchCount(matches.length);
    return matches;
  }, [editor, matchCase]);

  const findNext = useCallback(() => {
    const matches = highlightMatches(findText);
    if (matches.length === 0) return;

    const nextIndex = (currentMatch + 1) % matches.length;
    setCurrentMatch(nextIndex);

    // Scroll to match (simplified - would need more work for actual positioning)
    // In a full implementation, you'd use ProseMirror's selection API
  }, [findText, currentMatch, highlightMatches]);

  const findPrevious = useCallback(() => {
    const matches = highlightMatches(findText);
    if (matches.length === 0) return;

    const prevIndex = currentMatch === 0 ? matches.length - 1 : currentMatch - 1;
    setCurrentMatch(prevIndex);
  }, [findText, currentMatch, highlightMatches]);

  const replaceOne = useCallback(() => {
    if (!editor || !findText) return;

    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);

    const textMatches = matchCase
      ? selectedText === findText
      : selectedText.toLowerCase() === findText.toLowerCase();

    if (textMatches) {
      editor.chain().focus().insertContentAt({ from, to }, replaceText).run();
      findNext();
    } else {
      findNext();
    }
  }, [editor, findText, replaceText, matchCase, findNext]);

  const replaceAll = useCallback(() => {
    if (!editor || !findText) return;

    const content = editor.getHTML();
    const flags = matchCase ? 'g' : 'gi';
    const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    const newContent = content.replace(regex, replaceText);

    editor.commands.setContent(newContent);
    setMatchCount(0);
    setCurrentMatch(0);
  }, [editor, findText, replaceText, matchCase]);

  const handleFindChange = (e) => {
    const value = e.target.value;
    setFindText(value);
    highlightMatches(value);
  };

  return (
    <Modal open={true} onClose={onClose} title="Find & Replace" size="sm">
        <div className="space-y-4">
          {/* Find Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Find</label>
            <div className="relative">
              <BaseTextInput
                type="text"
                value={findText}
                onChange={handleFindChange}
                className="px-3 py-2 border-gray-300"
                placeholder="Enter text to find..."
                autoFocus
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  onClick={findPrevious}
                  disabled={matchCount === 0}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                  title="Previous"
                  type="button"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  onClick={findNext}
                  disabled={matchCount === 0}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                  title="Next"
                  type="button"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
            {findText && (
              <p className="text-xs text-gray-500 mt-1">
                {matchCount === 0 ? 'No matches found' : `${currentMatch + 1} of ${matchCount} matches`}
              </p>
            )}
          </div>

          {/* Replace Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Replace with</label>
            <BaseTextInput
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              className="px-3 py-2 border-gray-300"
              placeholder="Enter replacement text..."
            />
          </div>

          {/* Options */}
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={matchCase}
                onChange={(e) => {
                  setMatchCase(e.target.checked);
                  if (findText) highlightMatches(findText);
                }}
                className="rounded mr-2"
              />
              <span className="text-sm text-gray-700">Match case</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={findNext}
              disabled={!findText || matchCount === 0}
              icon={Search}
              className="flex-1"
            >
              Find Next
            </Button>
            <Button
              variant="success"
              onClick={replaceOne}
              disabled={!findText || !replaceText || matchCount === 0}
              icon={Replace}
              className="flex-1"
            >
              Replace
            </Button>
          </div>
          <Button
            variant="danger"
            onClick={replaceAll}
            disabled={!findText || !replaceText || matchCount === 0}
            fullWidth
          >
            Replace All ({matchCount})
          </Button>
        </div>
    </Modal>
  );
};

export default FindReplaceDialog;
