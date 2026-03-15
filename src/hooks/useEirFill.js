import { useState, useCallback } from 'react';
import CONFIG from '../config/bepConfig';

// Display labels for EIR fields shown in the fill summary modal
const EIR_FIELD_LABELS = {
  projectName: 'Project Name',
  projectDescription: 'Project Description',
  appointingParty: 'Appointing Party',
  bimGoals: 'BIM Goals',
  primaryObjectives: 'Primary Objectives',
  bimObjectives: 'BIM Objectives',
  projectInformationRequirements: 'Project Information Requirements',
  modelValidation: 'Model Validation',
  qualityAssurance: 'Quality Assurance',
  informationRisks: 'Information Risks',
  projectType: 'Project Type',
  fileFormats: 'File Formats',
  informationFormats: 'Information Formats',
  bimSoftware: 'BIM Software',
  bimUses: 'BIM Uses',
  informationPurposes: 'Information Purposes',
  // New fields
  trainingRequirements: 'Training Requirements',
  bimCompetencyLevels: 'BIM Competency Levels',
  dataClassification: 'Data Classification',
  accessPermissions: 'Access Permissions',
  coordinationMeetings: 'Coordination Meetings',
  taskTeamExchange: 'Task Team Exchange Protocols',
  communicationProtocols: 'Communication Protocols',
  modelReviewAuthorisation: 'Model Review & Authorisation',
  complianceVerification: 'Compliance Verification',
  lodRequirements: 'LOD / LOI Requirements',
  cdeStrategy: 'CDE Strategy',
  namingConventions: 'Naming Conventions',
  projectContext:                        'Project Context',
  bimStrategy:                           'BIM Strategy',
  keyCommitments:                        'Key Commitments',
  informationManagementResponsibilities: 'Information Management Responsibilities',
  federationStrategy:                    'Federation Strategy',
  accessControl:                         'Access Control',
  securityOnExchanges:                   'Security on Exchanges',
  securityOnExchangesFramework:          'Security Framework',
  securityMeasures:                      'Security Measures',
  encryptionRequirements:                'Encryption Requirements',
  dataTransferProtocols:                 'Data Transfer Protocols',
  privacyConsiderations:                 'Privacy Considerations',
  backupProcedures:                      'Backup Procedures',
  networkRequirements:                   'Network Requirements',
  hardwareRequirements:                  'Hardware Requirements',
  softwareHardwareInfrastructure:        'Software & Hardware Infrastructure',
  interoperabilityNeeds:                 'Interoperability Needs',
  modelingStandards:                     'Modelling Standards',
  classificationStandards:              'Classification Standards',
  dataExchangeProtocols:                 'Data Exchange Protocols',
  reviewProcesses:                       'Review Processes',
  approvalWorkflows:                     'Approval Workflows',
  informationRiskRegister:               'Information Risk Register',
  technologyRisks:                       'Technology Risks',
  riskMitigation:                        'Risk Mitigation',
  contingencyPlans:                      'Contingency Plans',
  tidpRequirements:                      'TIDP Requirements',
  informationDeliverablesMatrix:         'Information Deliverables Matrix',
  issueResolution:                       'Issue Resolution',
};

const TEXT_FIELDS = [
  'projectName', 'projectDescription', 'appointingParty',
  'bimGoals', 'primaryObjectives', 'bimObjectives',
  'projectInformationRequirements', 'modelValidation',
  'qualityAssurance', 'informationRisks',
  // New text fields from extended schema
  'trainingRequirements', 'bimCompetencyLevels',
  'dataClassification', 'accessPermissions',
  'coordinationMeetings', 'taskTeamExchange', 'communicationProtocols',
  'modelReviewAuthorisation', 'complianceVerification',
  'lodRequirements', 'cdeStrategy', 'namingConventions',
  // Additional mappable fields
  'projectContext', 'bimStrategy', 'keyCommitments',
  'informationManagementResponsibilities', 'federationStrategy',
  'accessControl', 'securityOnExchanges', 'securityOnExchangesFramework',
  'securityMeasures', 'encryptionRequirements', 'dataTransferProtocols',
  'privacyConsiderations', 'backupProcedures', 'networkRequirements',
  'hardwareRequirements', 'softwareHardwareInfrastructure',
  'interoperabilityNeeds', 'modelingStandards', 'classificationStandards',
  'dataExchangeProtocols', 'reviewProcesses', 'approvalWorkflows',
  'informationRiskRegister', 'technologyRisks', 'riskMitigation',
  'contingencyPlans', 'tidpRequirements', 'informationDeliverablesMatrix',
  'issueResolution',
];

const CHECKBOX_FIELDS = [
  { fieldName: 'fileFormats',         path: 'standards_protocols.file_formats', options: CONFIG.options.fileFormats },
  { fieldName: 'informationFormats',  path: 'standards_protocols.file_formats', options: CONFIG.options.fileFormats },
  { fieldName: 'bimSoftware',         path: 'software_requirements',            options: CONFIG.options.software },
  { fieldName: 'bimUses',             path: 'bim_objectives',                   options: CONFIG.options.bimUses },
  { fieldName: 'informationPurposes', path: 'information_requirements',         options: CONFIG.options.informationPurposes },
];

function normaliseForMatch(str) {
  return str.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

function matchOptions(rawEirValue, predefinedOptions) {
  if (!rawEirValue) return [];
  const eirText = Array.isArray(rawEirValue)
    ? rawEirValue.join(' ')
    : String(rawEirValue);
  const eirValues = Array.isArray(rawEirValue) ? rawEirValue.map(String) : [];
  const eirNorm = normaliseForMatch(eirText);
  const eirWords = new Set(eirNorm.split(' ').filter((w) => w.length > 3));

  return predefinedOptions.filter((option) => {
    const optNorm = normaliseForMatch(option);
    // Exact substring match (forward and reverse)
    if (eirNorm.includes(optNorm)) return true;
    if (eirValues.some((v) => {
      const vn = normaliseForMatch(v);
      return optNorm.includes(vn) || vn.includes(optNorm);
    })) return true;
    // Word-overlap: ≥2 significant words of the option appear in EIR text
    const optWords = optNorm.split(' ').filter((w) => w.length > 3);
    if (optWords.length >= 2 && optWords.filter((w) => eirWords.has(w)).length >= 2) return true;
    return false;
  });
}

/**
 * Encapsulates the EIR → BEP form auto-fill logic.
 *
 * @param {object} params
 * @param {object} params.methods         - RHF form methods from useBepForm()
 * @param {Function} params.getValueForField  - From useEir()
 * @param {Function} params.hasDataForField   - From useEir()
 * @param {Function} params.getValueByPath    - From useEir()
 * @param {Function} params.navigate          - React Router navigate
 * @param {object}  params.location           - React Router location
 *
 * @returns {{ filledSummary, handleUseInBep, handleConfirmApply }}
 */
export function useEirFill({ methods, getValueForField, hasDataForField, getValueByPath, navigate, location }) {
  const [filledSummary, setFilledSummary] = useState(null);

  const handleUseInBep = useCallback(() => {
    const details = [];

    // 1. Text / Textarea fields
    TEXT_FIELDS.forEach((fieldName) => {
      if (hasDataForField(fieldName)) {
        const value = getValueForField(fieldName);
        if (value) {
          methods.setValue(fieldName, value, { shouldDirty: true });
          const preview = String(value).length > 60 ? String(value).slice(0, 60) + '…' : String(value);
          details.push({ label: EIR_FIELD_LABELS[fieldName] ?? fieldName, preview });
        }
      }
    });

    // 2. Select field: projectType
    const eirProjectType = getValueByPath('project_info.project_type');
    if (eirProjectType) {
      const match =
        CONFIG.options.projectTypes.find(
          (opt) => opt.toLowerCase() === String(eirProjectType).toLowerCase()
        ) ||
        CONFIG.options.projectTypes.find((opt) =>
          opt.toLowerCase().includes(String(eirProjectType).toLowerCase())
        );
      if (match) {
        methods.setValue('projectType', match, { shouldDirty: true });
        details.push({ label: EIR_FIELD_LABELS.projectType, preview: match });
      }
    }

    // 3. Checkbox / Array fields
    CHECKBOX_FIELDS.forEach(({ fieldName, path, options }) => {
      const raw = getValueByPath(path);
      const matched = matchOptions(raw, options);
      if (matched.length > 0) {
        methods.setValue(fieldName, matched, { shouldDirty: true });
        details.push({ label: EIR_FIELD_LABELS[fieldName] ?? fieldName, preview: matched.join(', ') });
      }
    });

    if (details.length > 0) {
      setFilledSummary(details);
    } else {
      const basePath = location.pathname.split('/step/')[0];
      navigate(`${basePath}/step/0`);
    }
  }, [hasDataForField, getValueForField, getValueByPath, methods, navigate, location.pathname]);

  const handleConfirmApply = useCallback(() => {
    setFilledSummary(null);
    const basePath = location.pathname.split('/step/')[0];
    navigate(`${basePath}/step/0`);
  }, [navigate, location.pathname]);

  return { filledSummary, handleUseInBep, handleConfirmApply };
}
