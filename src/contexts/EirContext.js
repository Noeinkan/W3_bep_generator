/**
 * EIR Context
 *
 * Manages the state of EIR document analysis across the BEP wizard.
 * Provides access to extracted analysis data for field suggestions.
 */

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import axios from 'axios';

const EirContext = createContext(null);

/**
 * Field mapping from BEP fields to EIR analysis paths
 */
const FIELD_MAPPING = {
  projectName: 'project_info.name',
  projectDescription: 'project_info.description',
  appointingParty: 'project_info.client',
  projectType: 'project_info.project_type',
  bimGoals: 'bim_objectives',
  bimObjectives: 'bim_objectives',
  primaryObjectives: 'bim_objectives',
  bimUses: 'bim_objectives',
  projectObjectives: 'bim_objectives',
  keyMilestones: 'delivery_milestones',
  informationPurposes: 'information_requirements',
  projectInformationRequirements: 'information_requirements.PIR',
  namingConventions: 'standards_protocols.naming_conventions',
  fileFormats: 'standards_protocols.file_formats',
  informationFormats: 'standards_protocols.file_formats',
  bimSoftware: 'software_requirements',
  softwarePlatforms: 'software_requirements',
  cdeStrategy: 'cde_requirements',
  cdePlatforms: 'cde_requirements.platform',
  workflowStates: 'cde_requirements.workflow_states',
  classificationSystems: 'standards_protocols.classification_systems',
  modelValidation: 'quality_requirements.model_checking',
  qualityAssurance: 'quality_requirements',
  qaFramework: 'quality_requirements',
  clashDetection: 'quality_requirements.clash_detection',
  modelReviewAuthorisation: 'quality_requirements.validation_procedures',
  complianceVerification: 'quality_requirements.validation_procedures',
  cobieRequirements: 'handover_requirements',
  handoverRequirements: 'handover_requirements',
  informationRisks: 'specific_risks',
  // New schema sections
  trainingRequirements: 'training_requirements',
  bimCompetencyLevels: 'training_requirements.bim_competency_standards',
  certificationNeeds: 'training_requirements.required_certifications',
  projectSpecificTraining: 'training_requirements.project_specific_training',
  dataClassification: 'security_requirements',
  accessPermissions: 'security_requirements.access_control_policy',
  coordinationMeetings: 'information_protocols.collaboration_meetings',
  taskTeamExchange: 'information_protocols.exchange_events',
  communicationProtocols: 'information_protocols.coordination_frequency',
  levelOfInformationMatrix: 'loin_requirements',
  // Existing schema fields not previously mapped
  lodRequirements: 'standards_protocols.lod_loi_requirements',
  loiRequirements: 'standards_protocols.lod_loi_requirements',
  geometricalInfo: 'standards_protocols.lod_loi_requirements',
  alphanumericalInfo: 'standards_protocols.lod_loi_requirements',
  cadStandards: 'standards_protocols.cad_standards',
  roleResponsibilities: 'roles_responsibilities',
  plainLanguageQuestions: 'plain_language_questions',
  // Additional BEP fields mappable from existing EirAnalysis paths
  projectContext:                        'project_info.description',
  bimStrategy:                           'bim_objectives',
  keyCommitments:                        'bim_objectives',
  informationManagementResponsibilities: 'roles_responsibilities',
  federationStrategy:                    'cde_requirements',
  accessControl:                         'security_requirements.access_control_policy',
  securityOnExchanges:                   'security_requirements',
  securityOnExchangesFramework:          'security_requirements',
  securityMeasures:                      'security_requirements',
  encryptionRequirements:                'security_requirements',
  dataTransferProtocols:                 'security_requirements',
  privacyConsiderations:                 'security_requirements',
  backupProcedures:                      'cde_requirements',
  networkRequirements:                   'cde_requirements',
  hardwareRequirements:                  'software_requirements',
  softwareHardwareInfrastructure:        'software_requirements',
  interoperabilityNeeds:                 'standards_protocols',
  modelingStandards:                     'standards_protocols',
  classificationStandards:              'standards_protocols.classification_systems',
  dataExchangeProtocols:                 'standards_protocols.file_formats',
  reviewProcesses:                       'quality_requirements.validation_procedures',
  approvalWorkflows:                     'quality_requirements.validation_procedures',
  informationRiskRegister:               'specific_risks',
  technologyRisks:                       'specific_risks',
  riskMitigation:                        'specific_risks',
  contingencyPlans:                      'specific_risks',
  tidpRequirements:                      'information_requirements',
  informationDeliverablesMatrix:         'delivery_milestones',
  issueResolution:                       'information_protocols',
};

export const EirProvider = ({ children }) => {
  const [analysis, setAnalysis] = useState(null);
  const [summary, setSummary] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Set the EIR analysis data
   */
  const setEirAnalysis = useCallback((data) => {
    if (data) {
      setAnalysis(data.analysisJson || data.analysis_json || data);
      setSummary(data.summaryMarkdown || data.summary_markdown || null);
      setDocumentId(data.documentId || null);
    } else {
      setAnalysis(null);
      setSummary(null);
      setDocumentId(null);
    }
  }, []);

  /**
   * Clear the EIR analysis
   */
  const clearEirAnalysis = useCallback(() => {
    setAnalysis(null);
    setSummary(null);
    setDocumentId(null);
    setError(null);
  }, []);

  /**
   * Get a value from the analysis by path (e.g., "project_info.name")
   */
  const getValueByPath = useCallback((path) => {
    if (!analysis || !path) return null;

    const parts = path.split('.');
    let value = analysis;

    for (const part of parts) {
      if (value === null || value === undefined) return null;
      value = value[part];
    }

    return value;
  }, [analysis]);

  /**
   * Get the relevant EIR value for a BEP field
   */
  const getValueForField = useCallback((fieldName) => {
    const path = FIELD_MAPPING[fieldName];
    if (!path) return null;

    const value = getValueByPath(path);

    // Format the value based on type
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return value;
  }, [getValueByPath]);

  /**
   * Check if a field has EIR data available
   */
  const hasDataForField = useCallback((fieldName) => {
    const path = FIELD_MAPPING[fieldName];
    if (!path) return false;

    const value = getValueByPath(path);
    if (value === null || value === undefined) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  }, [getValueByPath]);

  /**
   * Get an AI suggestion for a field based on EIR analysis
   */
  const getSuggestionForField = useCallback(async (fieldType, partialText = '') => {
    if (!analysis) return null;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/ai/suggest-from-eir', {
        analysis_json: analysis,
        field_type: fieldType,
        partial_text: partialText
      });

      return response.data.suggestion || response.data.text;
    } catch (err) {
      console.error('EIR suggestion error:', err);
      setError(err.message);

      // Fallback to direct extraction
      return getValueForField(fieldType);
    } finally {
      setIsLoading(false);
    }
  }, [analysis, getValueForField]);

  /**
   * Get all fields that have EIR data available
   */
  const getFieldsWithData = useCallback(() => {
    if (!analysis) return [];

    return Object.keys(FIELD_MAPPING).filter(fieldName => hasDataForField(fieldName));
  }, [analysis, hasDataForField]);

  const value = useMemo(() => ({
    // State
    analysis,
    summary,
    documentId,
    isLoading,
    error,
    hasAnalysis: !!analysis,

    // Actions
    setEirAnalysis,
    clearEirAnalysis,
    getValueByPath,
    getValueForField,
    hasDataForField,
    getSuggestionForField,
    getFieldsWithData,

    // Mapping for reference
    fieldMapping: FIELD_MAPPING
  }), [
    analysis,
    summary,
    documentId,
    isLoading,
    error,
    setEirAnalysis,
    clearEirAnalysis,
    getValueByPath,
    getValueForField,
    hasDataForField,
    getSuggestionForField,
    getFieldsWithData
  ]);

  return (
    <EirContext.Provider value={value}>
      {children}
    </EirContext.Provider>
  );
};

/**
 * Default context value for when EirProvider is not available
 */
const defaultContextValue = {
  analysis: null,
  summary: null,
  documentId: null,
  isLoading: false,
  error: null,
  hasAnalysis: false,
  setEirAnalysis: () => {},
  clearEirAnalysis: () => {},
  getValueByPath: () => null,
  getValueForField: () => null,
  hasDataForField: () => false,
  getSuggestionForField: async () => null,
  getFieldsWithData: () => [],
  fieldMapping: FIELD_MAPPING
};

/**
 * Hook to access EIR context
 * Returns default values if used outside EirProvider
 */
export const useEir = () => {
  const context = useContext(EirContext);
  return context || defaultContextValue;
};

/**
 * Hook to check if EIR data is available for a specific field
 */
export const useEirField = (fieldName) => {
  const { hasDataForField, getValueForField, getSuggestionForField, hasAnalysis } = useEir();

  return useMemo(() => ({
    hasData: hasAnalysis && hasDataForField(fieldName),
    getValue: () => getValueForField(fieldName),
    getSuggestion: (partialText) => getSuggestionForField(fieldName, partialText)
  }), [hasAnalysis, hasDataForField, getValueForField, getSuggestionForField, fieldName]);
};

export default EirContext;
