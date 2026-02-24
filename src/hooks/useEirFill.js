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
};

const TEXT_FIELDS = [
  'projectName', 'projectDescription', 'appointingParty',
  'bimGoals', 'primaryObjectives', 'bimObjectives',
  'projectInformationRequirements', 'modelValidation',
  'qualityAssurance', 'informationRisks',
];

const CHECKBOX_FIELDS = [
  { fieldName: 'fileFormats',         path: 'standards_protocols.file_formats', options: CONFIG.options.fileFormats },
  { fieldName: 'informationFormats',  path: 'standards_protocols.file_formats', options: CONFIG.options.fileFormats },
  { fieldName: 'bimSoftware',         path: 'software_requirements',            options: CONFIG.options.software },
  { fieldName: 'bimUses',             path: 'bim_objectives',                   options: CONFIG.options.bimUses },
  { fieldName: 'informationPurposes', path: 'information_requirements',         options: CONFIG.options.informationPurposes },
];

function matchOptions(rawEirValue, predefinedOptions) {
  if (!rawEirValue) return [];
  const eirText = Array.isArray(rawEirValue)
    ? rawEirValue.join(' ')
    : String(rawEirValue);
  const eirValues = Array.isArray(rawEirValue) ? rawEirValue.map(String) : [];
  return predefinedOptions.filter((option) => {
    const optLower = option.toLowerCase();
    const eirLower = eirText.toLowerCase();
    if (eirLower.includes(optLower)) return true;
    return eirValues.some(
      (v) => optLower.includes(v.toLowerCase()) || v.toLowerCase().includes(optLower)
    );
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
