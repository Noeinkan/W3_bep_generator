import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBepForm } from '../../../contexts/BepFormContext';
import { useProject } from '../../../contexts/ProjectContext';
import { useTidpData } from '../../../hooks/useTidpData';
import { useMidpData } from '../../../hooks/useMidpData';
import PreviewExportPage from '../PreviewExportPage';
import { generateBEPContent } from '../../../services/bepFormatter';
import { generateBEPPDFOnServer } from '../../../services/backendPdfService';
import { generateDocx } from '../../../services/docxGenerator';
import { captureCustomComponentScreenshots } from '../../../services/componentScreenshotCapture';
import apiService from '../../../services/apiService';
import HiddenComponentsRenderer from '../../export/HiddenComponentsRenderer';
import toast from 'react-hot-toast';

/**
 * View component for BEP preview and export
 */
const BepPreviewView = () => {
  const navigate = useNavigate();
  const { bepType, getFormData } = useBepForm();
  const { currentProject } = useProject();
  const { tidps } = useTidpData();
  const { midps } = useMidpData();

  const [isGenerating, setIsGenerating] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const formData = getFormData();

  const downloadBlob = useCallback((blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handlePreviewBEP = useCallback(() => {
    const content = generateBEPContent(formData, bepType, { tidpData: tidps, midpData: midps });
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(content);
      newWindow.document.close();
      newWindow.focus();
    } else {
      setError('Preview popup was blocked. Please allow popups and try again.');
    }
  }, [formData, bepType, tidps, midps]);

  const handleExport = useCallback(async () => {
    try {
      setError(null);
      setIsGenerating(true);
      setStatusMessage(`Generating ${exportFormat.toUpperCase()} document, please wait...`);

      if (exportFormat === 'pdf') {
        // Wait for components to render
        setStatusMessage('Waiting for components to render...');
        console.log('🎬 Starting PDF export...');
        console.log('FormData available:', Object.keys(formData));
        console.log('FormData:', formData);

        // Give components time to fully render (especially SVG/Canvas)
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Capture screenshots from hidden components
        setStatusMessage('Capturing component diagrams...');
        console.log('⏳ About to call captureCustomComponentScreenshots...');

        let componentScreenshots = {};
        try {
          componentScreenshots = await captureCustomComponentScreenshots(formData);
          console.log('✅ Screenshots captured:', Object.keys(componentScreenshots));
          console.log('📊 Screenshot details:', componentScreenshots);
        } catch (error) {
          console.error('❌ Error capturing screenshots:', error);
          toast.error('Warning: Some diagrams may not appear in the PDF');
        }

        // Generate PDF on backend using Puppeteer
        setStatusMessage('Generating PDF document on server...');
        const result = await generateBEPPDFOnServer(
          formData,
          bepType,
          tidps,
          midps,
          componentScreenshots,
          {
            orientation: 'portrait',
            quality: 'standard'
          }
        );

        if (result.success) {
          console.log(`✓ PDF generated successfully: ${result.filename}`);
          setStatusMessage(`Document exported successfully as ${exportFormat.toUpperCase()}.`);
          toast.success('PDF generated successfully!');
        }
      } else if (exportFormat === 'word') {
        // Wait for components to render
        setStatusMessage('Waiting for components to render...');
        console.log('📝 Starting DOCX export...');

        // Give components time to fully render (especially SVG/Canvas)
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Capture screenshots from hidden components
        setStatusMessage('Capturing component diagrams...');
        console.log('⏳ About to call captureCustomComponentScreenshots for DOCX...');

        let componentScreenshots = {};
        try {
          componentScreenshots = await captureCustomComponentScreenshots(formData);
          console.log('✅ Screenshots captured for DOCX:', Object.keys(componentScreenshots));
        } catch (error) {
          console.error('❌ Error capturing screenshots for DOCX:', error);
          toast.error('Warning: Some diagrams may not appear in the DOCX');
        }

        // Generate DOCX with component images
        setStatusMessage('Generating Word document...');
        const docxBlob = await generateDocx(formData, bepType, {
          tidpData: tidps,
          midpData: midps,
          componentImages: componentScreenshots
        });
        downloadBlob(docxBlob, `BEP_${bepType}_${new Date().toISOString().split('T')[0]}.docx`);
        setStatusMessage(`Document exported successfully as ${exportFormat.toUpperCase()}.`);
        toast.success('Word document generated successfully!');
      } else if (exportFormat === 'html') {
        const content = generateBEPContent(formData, bepType, { tidpData: tidps, midpData: midps });
        const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
        downloadBlob(blob, `BEP_${bepType}_${new Date().toISOString().split('T')[0]}.html`);
        setStatusMessage(`Document exported successfully as ${exportFormat.toUpperCase()}.`);
      } else if (exportFormat === 'acc-package') {
        setStatusMessage('Capturing component diagrams for ACC package...');

        let componentScreenshots = {};
        try {
          componentScreenshots = await captureCustomComponentScreenshots(formData);
        } catch (captureError) {
          console.error('Error capturing screenshots for ACC package:', captureError);
          toast.error('Warning: Some diagrams may not appear in the ACC package');
        }

        setStatusMessage('Building ACC folder package...');

        await apiService.exportACCFolderPackage({
          projectId: currentProject?.id,
          projectName: formData?.projectName || currentProject?.name || 'Project',
          formData,
          bepType,
          componentImages: componentScreenshots,
          options: {
            orientation: 'portrait'
          }
        });

        setStatusMessage('ACC folder package exported successfully.');
        toast.success('ACC folder package generated successfully!');
      }
    } catch (error) {
      setStatusMessage(`Export failed: ${error.message}`);
      toast.error(error.message || 'Export failed');
    } finally {
      setIsGenerating(false);
      if (statusMessage.includes('successfully') || statusMessage.includes('failed')) {
        setTimeout(() => setStatusMessage(''), 5000);
      }
      setStatusMessage('');
    }
  }, [exportFormat, formData, bepType, tidps, midps, downloadBlob, statusMessage, currentProject?.id, currentProject?.name]);

  const handleBack = useCallback(() => {
    navigate(-1); // Go back to previous step
  }, [navigate]);

  if (!bepType) {
    navigate('/bep-generator');
    return null;
  }

  return (
    <>
      <div
        aria-live="polite"
        aria-atomic="true"
        role="status"
        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
      >
        {statusMessage}
      </div>

      {/* Hidden components for screenshot capture */}
      <HiddenComponentsRenderer formData={formData} bepType={bepType} />

      <main aria-busy={isGenerating}>
        <PreviewExportPage
          formData={formData}
          bepType={bepType}
          onBack={handleBack}
          onExport={handleExport}
          isGenerating={isGenerating}
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          previewBEP={handlePreviewBEP}
          downloadBEP={handleExport}
          isExporting={isGenerating}
          tidpData={tidps}
          midpData={midps}
          error={error}
        />
      </main>
    </>
  );
};

export default BepPreviewView;
