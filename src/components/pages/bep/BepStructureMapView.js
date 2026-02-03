import { useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LayoutGrid } from 'lucide-react';
import { useBepForm } from '../../../contexts/BepFormContext';
import { FormBuilderProvider, BepStructureMap, useFormBuilder } from '../../form-builder';
import { FieldStructureEditor } from '../../form-builder/field-editor';
import { StepStructureEditor } from '../../form-builder/step-editor';

/**
 * Inner layout component — lives inside FormBuilderProvider so it can read context.
 * Renders single-column in view mode, two-panel in edit mode.
 */
const StructureMapEditLayout = ({ onStepSelect }) => {
  const { isEditMode, steps } = useFormBuilder();
  const [selectedStepId, setSelectedStepId] = useState(null);

  const selectedStep = useMemo(
    () => (selectedStepId ? steps.find((s) => s.id === selectedStepId) || null : null),
    [selectedStepId, steps]
  );

  if (!isEditMode) {
    return (
      <div
        className="bg-gray-50 border border-gray-200 rounded-xl p-4 overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 260px)' }}
      >
        <BepStructureMap
          onStepClick={onStepSelect}
          showHeader={true}
          showEditToggle={true}
        />
      </div>
    );
  }

  // Edit mode: two-panel layout
  return (
    <div className="flex gap-4" style={{ height: 'calc(100vh - 260px)' }}>
      {/* Left panel: structure tree */}
      <div className="w-[55%] overflow-y-auto bg-gray-50 border border-gray-200 rounded-xl p-4">
        <BepStructureMap
          showHeader={true}
          showEditToggle={true}
          hideEditors={true}
          onSelectedStepChange={setSelectedStepId}
          controlledSelectedStepId={selectedStepId}
        />
      </div>

      {/* Right panel: editors for selected step */}
      <div className="w-[45%] overflow-y-auto flex flex-col gap-4">
        {selectedStep && (
          <FieldStructureEditor
            stepId={selectedStep.id}
            stepTitle={selectedStep.title}
          />
        )}
        <StepStructureEditor
          selectedStepId={selectedStepId}
          onSelectStep={(step) => setSelectedStepId(step?.id || null)}
        />
      </div>
    </div>
  );
};

/**
 * View to preview and edit the BEP structure
 * before the information requirements step.
 */
const BepStructureMapView = () => {
  const navigate = useNavigate();
  const { bepType } = useBepForm();

  const goToInfoRequirements = useCallback(() => {
    navigate('/bep-generator/info-requirements');
  }, [navigate]);

  const goBackToSelectType = useCallback(() => {
    navigate('/bep-generator/select-type');
  }, [navigate]);

  const handleStepSelect = useCallback((stepIndex) => {
    navigate(`/bep-generator/new-document/step/${stepIndex}`);
  }, [navigate]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50">
            <LayoutGrid className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">BEP Structure Map</h2>
            <p className="text-sm text-gray-600">
              Review and edit the structure before continuing to information requirements.
            </p>
          </div>
        </div>

        {bepType ? (
          <FormBuilderProvider projectId={null} bepType={bepType}>
            <StructureMapEditLayout onStepSelect={handleStepSelect} />
          </FormBuilderProvider>
        ) : (
          <div className="text-sm text-gray-500">
            Select a BEP type first to load the structure map.
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={goBackToSelectType}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Back to type selection
          </button>
          <button
            onClick={goToInfoRequirements}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Continue to information requirements
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BepStructureMapView;
