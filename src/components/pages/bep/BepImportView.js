import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImportBepDialog from './ImportBepDialog';
import { useBepForm } from '../../../contexts/BepFormContext';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * View component for BEP import
 */
const BepImportView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loadFormData } = useBepForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleImportFile = useCallback(async (file) => {
    setIsLoading(true);
    try {
      const fileContent = await file.text();
      const importedData = JSON.parse(fileContent);

      // Validate imported data structure
      if (!importedData.bepType || !importedData.formData) {
        throw new Error('Invalid BEP file format');
      }

      // Load imported data into form context
      loadFormData(importedData.formData, importedData.bepType, null);

      // Navigate to form with imported data
      navigate('/bep-generator/imported-bep/step/0');
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import BEP file: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [navigate, loadFormData]);

  const handleCancel = useCallback(() => {
    navigate('/bep-generator');
  }, [navigate]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 lg:py-6">
      <ImportBepDialog
        show={true}
        onImport={handleImportFile}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
};

export default BepImportView;
