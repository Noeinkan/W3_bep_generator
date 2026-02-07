import React, { useState, useRef, useEffect, useCallback } from 'react';
import FormattingToolbar from './FormattingToolbar';
import DOMPurify from 'dompurify';

const FormattedTextEditor = ({
  value = '',
  onChange,
  placeholder = '',
  rows = 3,
  className = '',
  id,
  'aria-required': ariaRequired,
  showToolbar = true,
  autoGrow = false,
  autoSaveKey = 'formattedTextEditor-autosave', // optional prop for custom key
}) => {

  // State and refs (must be at the very top before any function uses them)
  const [currentFont, setCurrentFont] = useState('default');
  const [currentFontSize, setCurrentFontSize] = useState('16');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [history, setHistory] = useState([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  // Keyboard shortcuts for formatting and undo/redo
  const handleFormat = useCallback((type, formatValue) => {
    switch (type) {
      case 'bold':
        wrapSelection('**', '**');
        break;
      case 'italic':
        wrapSelection('*', '*');
        break;
      case 'underline':
        wrapSelection('<u>', '</u>');
        break;
      case 'align': {
        const alignTag = formatValue === 'center' ? '<center>' :
                        formatValue === 'right' ? '<div style="text-align: right;">' :
                        '<div style="text-align: left;">';
        const alignEndTag = formatValue === 'center' ? '</center>' : '</div>';
        wrapSelection(alignTag, alignEndTag);
        break;
      }
      case 'list':
        handleListFormat(formatValue);
        break;
      case 'font':
        setCurrentFont(formatValue);
        break;
      case 'fontSize':
        setCurrentFontSize(formatValue);
        break;
      case 'heading':
        wrapSelection('# ', '');
        break;
      case 'link': {
        const url = prompt('Enter URL:');
        if (url) wrapSelection('[', `](${url})`);
        break;
      }
      case 'code':
        wrapSelection('`', '`');
        break;
      case 'blockquote':
        wrapSelection('> ', '');
        break;
      case 'image':
        setShowImageDialog(true);
        break;
      default:
        break;
    }
    // eslint-disable-next-line
  }, [value, currentFont, currentFontSize]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      onChange(history[historyIndex - 1]);
    }
  }, [history, historyIndex, onChange]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      onChange(history[historyIndex + 1]);
    }
  }, [history, historyIndex, onChange]);

  const handlePreviewToggle = useCallback(() => setIsPreviewMode((prev) => !prev), []);

  // Keyboard event handler
  const handleKeyDown = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          handleFormat('bold');
          break;
        case 'i':
          e.preventDefault();
          handleFormat('italic');
          break;
        case 'u':
          e.preventDefault();
          handleFormat('underline');
          break;
        case 'z':
          e.preventDefault();
          handleUndo();
          break;
        case 'y':
          e.preventDefault();
          handleRedo();
          break;
        default:
          break;
      }
    }
  }, [handleFormat, handleUndo, handleRedo]);

  // Update history for undo/redo
  useEffect(() => {
    if (history[historyIndex] !== value) {
      const newHistory = history.slice(0, historyIndex + 1);
      setHistory([...newHistory, value]);
      setHistoryIndex(newHistory.length);
    }
    // eslint-disable-next-line
  }, [value]);

  // Word and character count
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  // Image URL dialog
  const handleImageInsert = () => {
    if (imageUrl) {
      wrapSelection('![](', `${imageUrl})`);
      setImageUrl('');
      setShowImageDialog(false);
    }
  };

  // Persistent auto-save to localStorage
  useEffect(() => {
    if (autoSaveKey) {
      localStorage.setItem(autoSaveKey, value);
    }
  }, [value, autoSaveKey]);

  // Restore from localStorage on mount
  useEffect(() => {
    if (autoSaveKey) {
      const saved = localStorage.getItem(autoSaveKey);
      if (saved && saved !== value) {
        onChange(saved);
      }
    }
    // eslint-disable-next-line
  }, []);
  const getFontClass = (fontValue) => {
    const fontMap = {
      'arial': 'font-sans',
      'times': 'font-serif',
      'courier': 'font-mono',
      'georgia': 'font-serif',
      'verdana': 'font-sans',
      'default': ''
    };
    return fontMap[fontValue] || '';
  };

  const calculateRows = () => {
    if (!autoGrow) return rows;

    const text = value || '';
    const lineCount = text.split('\n').length;

    // Se non c'è testo, mostra almeno il minimo (rows)
    if (!text.trim()) return rows;

    // Altrimenti, numero di righe del testo + 2
    return Math.max(lineCount + 2, rows);
  };

  const dynamicRows = calculateRows();


  const wrapSelection = (startTag, endTag) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);

    const newValue = beforeText + startTag + selectedText + endTag + afterText;
    onChange(newValue);

    // Use requestAnimationFrame instead of setTimeout for better performance
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + startTag.length,
        end + startTag.length
      );
    });
  };



  const handleListFormat = (listType) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Get selected text or current line if no selection
    let selectedText;
    let newStart, newEnd;

    if (start === end) {
      // No selection - format current line
      const lines = value.split('\n');
      const beforeCursor = value.substring(0, start);
      const currentLineIndex = beforeCursor.split('\n').length - 1;
      const currentLine = lines[currentLineIndex];

      const lineStart = beforeCursor.lastIndexOf('\n') + 1;
      const lineEnd = lineStart + currentLine.length;

      selectedText = currentLine;
      newStart = lineStart;
      newEnd = lineEnd;
    } else {
      // Format selected text
      selectedText = value.substring(start, end);
      newStart = start;
      newEnd = end;
    }

    const lines = selectedText.split('\n');
    const formattedLines = lines.map((line, index) => {
      if (!line.trim()) return line;

      // Remove existing list markers
      const cleanLine = line.replace(/^(\s*)(•|\d+\.)\s*/, '$1');

      if (listType === 'bullet') {
        return cleanLine.replace(/^(\s*)/, '$1• ');
      } else {
        return cleanLine.replace(/^(\s*)/, `$1${index + 1}. `);
      }
    });

    const beforeText = value.substring(0, newStart);
    const afterText = value.substring(newEnd);
    const newValue = beforeText + formattedLines.join('\n') + afterText;

    onChange(newValue);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(newStart, newStart + formattedLines.join('\n').length);
    });
  };

  const processDisplayValue = (text) => {
    // Se non c'è testo reale, non mostrare niente nel preview
    if (!text || !text.trim()) {
      return '';
    }

    // Enhanced markdown-like processing for display
    return DOMPurify.sanitize(
      text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
        .replace(/^• (.+)$/gm, '<li style="list-style-type: disc; margin-left: 20px;">$1</li>')
        .replace(/^\d+\. (.+)$/gm, '<li style="list-style-type: decimal; margin-left: 20px;">$1</li>')
        .replace(/\n/g, '<br/>')
    );
  };

  const baseClasses = `w-full p-3 border border-gray-300 ${showToolbar ? 'rounded-b-lg' : 'rounded-lg'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y ${getFontClass(currentFont)}`;
  const fontSizeStyle = { fontSize: `${currentFontSize}px` };

  return (
    <div ref={containerRef} className="relative">
      {/* Compact Toolbar - only show if showToolbar is true */}
      {showToolbar && (
        <FormattingToolbar
          onFormat={handleFormat}
          currentFont={currentFont}
          compact={true}
          onPreviewToggle={handlePreviewToggle}
          isPreviewMode={isPreviewMode}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />
      )}

      {/* Rich Text Editor */}
      <div className="relative">
        {isPreviewMode && value && value.trim() ? (
          <div
            className={`${baseClasses} ${className} min-h-[120px] overflow-y-auto bg-gray-50 cursor-pointer`}
            style={{ minHeight: `${dynamicRows * 24}px`, ...fontSizeStyle }}
            dangerouslySetInnerHTML={{ __html: processDisplayValue(value) }}
            onClick={() => {
              setIsPreviewMode(false);
              setTimeout(() => textareaRef.current?.focus(), 0);
            }}
          />
        ) : (
          <>
            <textarea
              ref={textareaRef}
              id={id}
              aria-required={ariaRequired}
              aria-label="Formatted text editor"
              aria-multiline="true"
              aria-describedby={id ? `${id}-desc` : undefined}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={dynamicRows}
              className={`${baseClasses} ${className}`}
              placeholder={placeholder}
              style={{ minHeight: `${dynamicRows * 24}px`, ...fontSizeStyle }}
              onBlur={() => {
                setTimeout(() => setIsPreviewMode(true), 150);
              }}
              onKeyDown={handleKeyDown}
            />
            {/* Image URL Dialog */}
            {showImageDialog && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
                  <h3 className="text-lg font-semibold mb-2">Insert Image</h3>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-2 py-1 mb-3"
                    placeholder="Image URL"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    aria-label="Image URL"
                    autoFocus
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                      onClick={() => { setShowImageDialog(false); setImageUrl(''); }}
                      type="button"
                    >Cancel</button>
                    <button
                      className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                      onClick={handleImageInsert}
                      type="button"
                      disabled={!imageUrl.trim()}
                    >Insert</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FormattedTextEditor;