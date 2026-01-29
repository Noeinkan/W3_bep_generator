import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, FolderOpen, ExternalLink, Upload, Sparkles, CheckCircle } from 'lucide-react';
import ProgressSidebar from '../../../forms/controls/ProgressSidebar';
import { FormBuilderContext, DynamicProgressSidebar } from '../../../form-builder';
import CONFIG from '../../../../config/bepConfig';
import { ROUTES } from '../../../../constants/routes';
import { useEir } from '../../../../contexts/EirContext';

/**
 * BEP Form sidebar component with navigation and progress
 * Supports both static mode (ProgressSidebar) and dynamic mode (DynamicProgressSidebar)
 *
 * @param {Object} props
 * @param {string} props.bepType - Current BEP type
 * @param {Object} props.currentDraft - Current draft info
 * @param {number} props.currentStep - Current step index
 * @param {Set} props.completedSections - Set of completed section indices
 * @param {Function} props.onStepClick - Handler for step click
 * @param {Function} props.validateStep - Function to validate a step
 * @param {Array} props.tidpData - TIDP data
 * @param {Array} props.midpData - MIDP data
 * @param {Object} props.user - Current user object
 */
const BepSidebar = ({
  bepType,
  currentDraft,
  currentStep,
  completedSections,
  onStepClick,
  validateStep,
  tidpData,
  midpData,
  user,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're in FormBuilder context (dynamic mode)
  const formBuilderContext = useContext(FormBuilderContext);
  const isDynamicMode = formBuilderContext !== null;

  // Get EIR context (returns defaults if provider not available)
  const { hasAnalysis } = useEir();

  const goToTidpManager = () => navigate(ROUTES.TIDP_MIDP);

  // Navigate to EIR step
  const goToEirStep = () => {
    const basePath = location.pathname.split('/step/')[0];
    navigate(`${basePath}/step/eir`);
  };

  return (
    <div className="w-80 bg-white shadow-xl border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <Zap className="w-5 h-5 text-blue-600 mr-2" />
              BEP Generator
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {CONFIG.bepTypeDefinitions[bepType]?.title}
            </p>
            {currentDraft && (
              <p className="text-xs text-blue-600 mt-1 font-medium flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                  <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
                {currentDraft.name}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={goToTidpManager}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="TIDP/MIDP Manager"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate(ROUTES.BEP_DRAFTS)}
          disabled={!user}
          className="w-full inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <FolderOpen className="w-4 h-4 mr-2" />
          Drafts
        </button>

        {/* EIR Upload Button */}
        <button
          onClick={goToEirStep}
          className={`w-full mt-2 inline-flex items-center justify-center px-3 py-2 border shadow-sm text-sm font-medium rounded-lg transition-all duration-200 ${
            hasAnalysis
              ? 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
              : 'border-purple-300 text-purple-700 bg-purple-50 hover:bg-purple-100'
          }`}
        >
          {hasAnalysis ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              EIR Analyzed
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload EIR
            </>
          )}
        </button>

        {/* EIR Analysis Indicator */}
        {hasAnalysis && (
          <div className="mt-2 p-2 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 text-xs text-purple-700">
              <Sparkles className="w-3 h-3" />
              <span>AI suggestions active</span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Sidebar - Dynamic or Static */}
      <div className="flex-1 overflow-y-auto">
        {isDynamicMode ? (
          <DynamicProgressSidebar
            currentStep={currentStep}
            completedSections={completedSections}
            onStepClick={onStepClick}
            validateStep={validateStep}
            tidpData={tidpData}
            midpData={midpData}
          />
        ) : (
          <ProgressSidebar
            steps={CONFIG.steps || []}
            currentStep={currentStep}
            completedSections={completedSections}
            onStepClick={onStepClick}
            validateStep={validateStep}
            tidpData={tidpData}
            midpData={midpData}
          />
        )}
      </div>
    </div>
  );
};

export default BepSidebar;
