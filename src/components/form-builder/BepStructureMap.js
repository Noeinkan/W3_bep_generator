import React, { useContext, useMemo, useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff, Settings2, Pencil } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import FormBuilderContext from './FormBuilderContext';
import { useBepStructure } from './useBepStructure';
import { StepStructureEditor } from './step-editor';
import FieldStructureEditor from './field-editor/FieldStructureEditor';
import { getFieldNumber } from './utils/fieldNumberUtils';

const CATEGORY_ORDER = ['Management', 'Commercial', 'Technical'];

const CATEGORY_COLORS = {
  Commercial: { bg: 'bg-blue-100', text: 'text-blue-800', accent: 'bg-blue-500' },
  Management: { bg: 'bg-green-100', text: 'text-green-800', accent: 'bg-green-500' },
  Technical:  { bg: 'bg-purple-100', text: 'text-purple-800', accent: 'bg-purple-500' },
};
const getCategoryColors = (cat) => CATEGORY_COLORS[cat] || { bg: 'bg-gray-100', text: 'text-gray-800', accent: 'bg-gray-500' };

const getIcon = (iconName) => {
  if (!iconName) return LucideIcons.FileText;
  const Icon = LucideIcons[iconName];
  return Icon || LucideIcons.FileText;
};

const getCategoryOrderIndex = (category) => {
  const index = CATEGORY_ORDER.indexOf(category);
  return index === -1 ? CATEGORY_ORDER.length : index;
};

const getDisplayCategory = (category) => category || 'Other';

const StructureMap = ({
  steps,
  fields,
  isLoading,
  error,
  isEditMode,
  toggleEditMode,
  onStepClick,
  currentStepIndex,
  showHeader,
  showEditToggle,
  hideEditors = false,
  onSelectedStepChange = null,
  controlledSelectedStepId
}) => {
  const [expandedSteps, setExpandedSteps] = useState(new Set());
  const [showHidden, setShowHidden] = useState(false);
  const [selectedStepId, setSelectedStepId] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      setShowHidden(true);
    }
  }, [isEditMode]);

  const stepsSorted = useMemo(() => {
    return [...(steps || [])].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
  }, [steps]);

  const visibleSteps = useMemo(() => {
    return stepsSorted.filter((step) => step.is_visible);
  }, [stepsSorted]);

  const visibleIndexById = useMemo(() => {
    return new Map(visibleSteps.map((step, index) => [step.id, index]));
  }, [visibleSteps]);

  const hiddenSteps = useMemo(() => {
    return stepsSorted.filter((step) => !step.is_visible);
  }, [stepsSorted]);

  const displaySteps = useMemo(() => {
    if (showHidden || isEditMode) return stepsSorted;
    return visibleSteps;
  }, [showHidden, isEditMode, stepsSorted, visibleSteps]);

  const fieldsByStepId = useMemo(() => {
    const map = new Map();
    (fields || []).forEach((field) => {
      if (!map.has(field.step_id)) {
        map.set(field.step_id, []);
      }
      map.get(field.step_id).push(field);
    });
    return map;
  }, [fields]);

  const selectedStep = useMemo(() => {
    if (!selectedStepId) return null;
    return stepsSorted.find((step) => step.id === selectedStepId) || null;
  }, [selectedStepId, stepsSorted]);

  const orderedSteps = useMemo(() => {
    return [...displaySteps].sort((a, b) => {
      const aNum = Number(a.step_number);
      const bNum = Number(b.step_number);
      if (!Number.isNaN(aNum) && !Number.isNaN(bNum) && aNum !== bNum) {
        return aNum - bNum;
      }
      return (a.order_index ?? 0) - (b.order_index ?? 0);
    });
  }, [displaySteps]);

  const groupedByCategory = useMemo(() => {
    const map = new Map();
    orderedSteps.forEach((step) => {
      const cat = getDisplayCategory(step.category);
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat).push(step);
    });
    return [...map.entries()].map(([category, steps]) => ({ category, steps }));
  }, [orderedSteps]);

  useEffect(() => {
    if (!isEditMode || selectedStepId || orderedSteps.length === 0) return;
    setSelectedStepId(orderedSteps[0].id);
  }, [isEditMode, orderedSteps, selectedStepId]);

  useEffect(() => {
    if (onSelectedStepChange) onSelectedStepChange(selectedStepId);
  }, [selectedStepId, onSelectedStepChange]);

  useEffect(() => {
    if (controlledSelectedStepId !== undefined && controlledSelectedStepId !== selectedStepId) {
      setSelectedStepId(controlledSelectedStepId);
    }
  }, [controlledSelectedStepId]);

  const toggleExpanded = (stepId) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  const handleStepClick = (step) => {
    setSelectedStepId(step.id);
    if (!onStepClick || isEditMode) return;
    const targetIndex = visibleIndexById.get(step.id);
    if (targetIndex === undefined) return;
    onStepClick(targetIndex);
  };

  if (!isLoading && (!steps || steps.length === 0)) {
    return (
      <div className="text-sm text-gray-500">
        No structure available yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Structure Map</h3>
            <p className="text-sm text-gray-500">Visual overview of steps and sections.</p>
          </div>
          {showEditToggle && toggleEditMode && (
            <button
              onClick={toggleEditMode}
              className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors shadow-sm ${
                isEditMode
                  ? 'bg-gray-700 text-white hover:bg-gray-800'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Settings2 className="w-4 h-4 mr-2" />
              {isEditMode ? 'Done' : 'Edit structure'}
            </button>
          )}
        </div>
      )}

      {isLoading && (
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-28 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      )}

      {!isLoading && error && (
        <div className="text-sm text-red-500">
          Failed to load structure: {error}
        </div>
      )}

      {!isLoading && !error && (
        <>
          {hiddenSteps.length > 0 && (
            <button
              onClick={() => setShowHidden((prev) => !prev)}
              className="inline-flex items-center text-xs text-gray-500 hover:text-gray-700"
            >
              {showHidden ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
              {showHidden ? 'Hide hidden steps' : `Show hidden steps (${hiddenSteps.length})`}
            </button>
          )}

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                BEP
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">BEP Structure</div>
                <div className="text-xs text-gray-500">Categories and steps</div>
              </div>
            </div>

            <div className="mt-4 space-y-1">
              {groupedByCategory.map((group, gi) => {
                const isLastGroup = gi === groupedByCategory.length - 1;
                const colors = getCategoryColors(group.category);

                return (
                  <div key={group.category} className="relative">
                    <div className="absolute left-0 top-0 w-px bg-gray-300" style={{ height: isLastGroup ? '1.25rem' : '100%' }} />
                    <div className="absolute left-0 top-5 h-px w-4 bg-gray-300" />
                    <div className="ml-4">
                      <div className="flex items-center gap-2 py-2">
                        <div className={`h-5 w-1 rounded-full ${colors.accent}`} />
                        <span className={`text-xs font-semibold ${colors.text}`}>{group.category}</span>
                        <span className="text-xs text-gray-400">({group.steps.length} step{group.steps.length !== 1 ? 's' : ''})</span>
                      </div>
                      <div className="space-y-2">
                        {group.steps.map((step, si) => {
                          const isLastStep = si === group.steps.length - 1;
                          const Icon = getIcon(step.icon);
                          const isCurrent = currentStepIndex !== null && visibleIndexById.get(step.id) === currentStepIndex;
                          const isExpanded = expandedSteps.has(step.id);
                          const stepFields = fieldsByStepId.get(step.id) || [];
                          const isClickable = onStepClick && visibleIndexById.has(step.id) && !isEditMode;
                          const isSelected = selectedStepId === step.id;
                          const category = getDisplayCategory(step.category);

                          return (
                            <div key={step.id} className="relative">
                              <div className="absolute left-0 top-0 w-px bg-gray-300" style={{ height: isLastStep ? '1.25rem' : '100%' }} />
                              <div className="absolute left-0 top-5 h-px w-4 bg-gray-300" />
                              <div className="ml-4">
                                <div
                                  className={`border rounded-lg p-3 bg-white transition-colors ${
                                    isCurrent || isSelected ? 'border-blue-400 ring-1 ring-blue-200' : 'border-gray-200 hover:border-blue-200'
                                  } ${step.is_visible ? '' : 'opacity-60'} ${isClickable ? 'cursor-pointer' : ''}`}
                                  onClick={() => isClickable && handleStepClick(step)}
                                  role={isClickable ? 'button' : 'article'}
                                  tabIndex={isClickable ? 0 : -1}
                                  onKeyDown={(event) => {
                                    if (!isClickable) return;
                                    if (event.key === 'Enter' || event.key === ' ') {
                                      event.preventDefault();
                                      handleStepClick(step);
                                    }
                                  }}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-2">
                                      <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700">
                                        {step.step_number}
                                      </span>
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">
                                          {step.title}
                                        </div>
                                        {step.description && !isEditMode && (
                                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                            {step.description}
                                          </div>
                                        )}
                                        <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                                          {category}
                                        </div>
                                        {!step.is_visible && (
                                          <div className="text-xs text-gray-400 mt-1">Hidden</div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="mt-1 text-gray-400">
                                      <Icon className="w-4 h-4" />
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-xs text-gray-500">
                                    <span>{stepFields.length} fields</span>
                                    <div className="flex items-center gap-2">
                                      {stepFields.length > 0 && (
                                        <button
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            toggleExpanded(step.id);
                                          }}
                                          className="inline-flex items-center text-blue-600 hover:text-blue-700"
                                        >
                                          {isExpanded ? (
                                            <>
                                              <ChevronUp className="w-3 h-3 mr-1" />
                                              Hide fields
                                            </>
                                          ) : (
                                            <>
                                              <ChevronDown className="w-3 h-3 mr-1" />
                                              Show fields
                                            </>
                                          )}
                                        </button>
                                      )}
                                      {isEditMode && (
                                        <button
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedStepId(step.id);
                                          }}
                                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md border transition-colors ${
                                            isSelected
                                              ? 'bg-blue-600 text-white border-blue-600'
                                              : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-400'
                                          }`}
                                        >
                                          <Pencil className="w-3 h-3" />
                                          Edit fields
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {isExpanded && (
                                    <div className="mt-2 border-t border-gray-100 pt-3">
                                      <div className="border-l border-gray-200 pl-4 space-y-2">
                                        {stepFields.length > 0 ? (
                                          stepFields.map((field, fieldIndex) => (
                                            <div key={field.id} className="relative">
                                              <div className="absolute left-[-17px] top-3 h-px w-4 bg-gray-200" />
                                              <div className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-3 py-2">
                                                <div className="min-w-0">
                                                  <div className="text-xs font-medium text-gray-700 truncate">
                                                    {field.label || field.name || field.type}
                                                  </div>
                                                  <div className="text-[11px] text-gray-500">
                                                    {field.type}{field.is_required ? ' • required' : ''}
                                                  </div>
                                                </div>
                                                <span className="ml-3 inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-gray-500 border border-gray-200">
                                                  {getFieldNumber(step.step_number, fieldIndex)}
                                                </span>
                                              </div>
                                            </div>
                                          ))
                                        ) : (
                                          <div className="text-xs text-gray-500">No fields in this step.</div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {!hideEditors && isEditMode && selectedStep && (
            <div className="border-t border-gray-200 pt-4">
              <FieldStructureEditor
                stepId={selectedStep.id}
                stepTitle={selectedStep.title}
                stepNumber={selectedStep.step_number}
              />
            </div>
          )}

          {!hideEditors && isEditMode && (
            <div className="border-t border-gray-200 pt-4">
              <StepStructureEditor
                selectedStepId={selectedStepId}
                onSelectStep={(step) => setSelectedStepId(step?.id || null)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

const StructureMapWithContext = ({
  onStepClick,
  currentStepIndex,
  showHeader,
  showEditToggle,
  hideEditors,
  onSelectedStepChange,
  controlledSelectedStepId
}) => {
  const {
    steps,
    fields,
    isLoading,
    error,
    isEditMode,
    toggleEditMode
  } = useContext(FormBuilderContext);

  return (
    <StructureMap
      steps={steps}
      fields={fields}
      isLoading={isLoading}
      error={error}
      isEditMode={isEditMode}
      toggleEditMode={toggleEditMode}
      onStepClick={onStepClick}
      currentStepIndex={currentStepIndex}
      showHeader={showHeader}
      showEditToggle={showEditToggle}
      hideEditors={hideEditors}
      onSelectedStepChange={onSelectedStepChange}
      controlledSelectedStepId={controlledSelectedStepId}
    />
  );
};

const StructureMapWithFetch = ({
  projectId,
  draftId,
  bepType,
  onStepClick,
  currentStepIndex,
  showHeader,
  showEditToggle
}) => {
  const {
    steps,
    fields,
    isLoading,
    error
  } = useBepStructure({ projectId, draftId, bepType });

  return (
    <StructureMap
      steps={steps}
      fields={fields}
      isLoading={isLoading}
      error={error}
      isEditMode={false}
      toggleEditMode={null}
      onStepClick={onStepClick}
      currentStepIndex={currentStepIndex}
      showHeader={showHeader}
      showEditToggle={showEditToggle}
    />
  );
};

export default function BepStructureMap({
  projectId = null,
  bepType = null,
  onStepClick,
  currentStepIndex = null,
  showHeader = true,
  showEditToggle = true,
  hideEditors = false,
  onSelectedStepChange = null,
  controlledSelectedStepId
}) {
  const formBuilderContext = useContext(FormBuilderContext);

  if (!formBuilderContext && !bepType) {
    return (
      <div className="text-sm text-gray-500">
        Select a BEP type to load the structure map.
      </div>
    );
  }

  if (formBuilderContext) {
    return (
      <StructureMapWithContext
        onStepClick={onStepClick}
        currentStepIndex={currentStepIndex}
        showHeader={showHeader}
        showEditToggle={showEditToggle}
        hideEditors={hideEditors}
        onSelectedStepChange={onSelectedStepChange}
        controlledSelectedStepId={controlledSelectedStepId}
      />
    );
  }

  return (
    <StructureMapWithFetch
      projectId={projectId}
      bepType={bepType}
      onStepClick={onStepClick}
      currentStepIndex={currentStepIndex}
      showHeader={showHeader}
      showEditToggle={showEditToggle}
    />
  );
}
