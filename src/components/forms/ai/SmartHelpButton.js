import React, { useState } from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';
import SmartHelpDialog from './SmartHelpDialog';

/**
 * SmartHelpButton - Context-aware unified help button
 *
 * Replaces the 3 separate buttons (Field Guidance, Example Text, AI Suggestion)
 * with a single intelligent button that adapts to field content state.
 *
 * Behavior:
 * - Empty field: Prioritizes Examples → AI Generate → Guidelines
 * - Field with content: Prioritizes AI Improve → Guidelines → Examples
 * - Text selected: Focus on improving selection
 */
const SmartHelpButton = ({
  editor,
  fieldName,
  fieldType,
  helpContent,
  className = ''
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Determine field state
  const getFieldState = () => {
    if (!editor) return 'empty';

    const text = editor.getText().trim();
    const { from, to } = editor.state.selection;
    const hasSelection = from !== to;

    if (hasSelection) return 'hasSelection';
    if (text.length > 0) return 'hasContent';
    return 'empty';
  };

  const fieldState = getFieldState();

  // Count available resources for badge
  const getResourceCount = () => {
    let count = 1; // AI is always available
    if (helpContent) count++; // Guidelines available
    if (fieldName) count++; // Examples available (from FIELD_EXAMPLES)
    return count;
  };

  const resourceCount = getResourceCount();

  return (
    <>
      {/* Smart Help Button */}
      <div className={`relative inline-flex items-center ${className}`}>
        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="
            relative
            px-4 py-2
            bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500
            text-white
            rounded-lg
            hover:from-purple-600 hover:via-blue-600 hover:to-indigo-600
            transition-all duration-200
            shadow-md hover:shadow-lg
            flex items-center gap-2
            font-medium
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
            group
          "
          title="Get smart help for this field"
        >
          {/* Combined Icon */}
          <div className="relative">
            <Sparkles className="w-5 h-5" />
            <HelpCircle className="w-3 h-3 absolute -bottom-0.5 -right-0.5 bg-purple-500 rounded-full" />
          </div>

          <span className="text-sm">Smart Help</span>

          {/* Resource Count Badge */}
          {resourceCount > 0 && (
            <span className="
              absolute -top-1 -right-1
              w-5 h-5
              bg-yellow-400 text-purple-900
              rounded-full
              text-xs font-bold
              flex items-center justify-center
              shadow-md
              group-hover:scale-110 transition-transform
            ">
              {resourceCount}
            </span>
          )}

          {/* Pulse animation for empty fields - only on hover */}
          {fieldState === 'empty' && (
            <span className="absolute inset-0 rounded-lg bg-purple-400 animate-ping opacity-0 group-hover:opacity-20"></span>
          )}
        </button>
      </div>

      {/* Smart Help Dialog */}
      {isDialogOpen && (
        <SmartHelpDialog
          editor={editor}
          fieldName={fieldName}
          fieldType={fieldType}
          fieldState={fieldState}
          helpContent={helpContent}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </>
  );
};

export default SmartHelpButton;
