import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BepTypeSelector from './BepTypeSelector';
import { useBepForm } from '../../../contexts/BepFormContext';
import { getEmptyBepData } from '../../../data/templateRegistry';

/**
 * View component for BEP type selection
 */
const BepSelectTypeView = () => {
  const navigate = useNavigate();
  const { bepType, setBepType, loadFormData, setCurrentDraft } = useBepForm();

  const handleTypeSelect = useCallback((selectedType) => {
    // Load empty form data for the selected type
    loadFormData(getEmptyBepData(), selectedType, null);
    setCurrentDraft(null);
    // Navigate to first step with new-document slug
    navigate('/bep-generator/new-document/step/0');
  }, [navigate, loadFormData, setCurrentDraft]);

  return (
    <BepTypeSelector
      bepType={bepType}
      setBepType={setBepType}
      onProceed={handleTypeSelect}
    />
  );
};

export default BepSelectTypeView;
