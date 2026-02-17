import React, { useState } from 'react';
import { Download, FileText, Eye, FileType, Printer, CheckCircle, AlertCircle, Loader2, Settings, RotateCcw, ArrowLeft } from 'lucide-react';
import { generateBEPContent } from '../../services/bepFormatter';
import { generateBEPPDFOnServer } from '../../services/backendPdfService';
import BepPreviewRenderer from '../export/BepPreviewRenderer';
import { captureCustomComponentScreenshots } from '../../services/componentScreenshotCapture';
import toast from 'react-hot-toast';

const PreviewExportPage = ({
  formData,
  bepType,
  exportFormat,
  setExportFormat,
  previewBEP,
  downloadBEP,
  isExporting,
  tidpData = [],
  midpData = [],
  onBack
}) => {
  const [previewError, setPreviewError] = useState(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [pdfQuality, setPdfQuality] = useState('standard'); // 'standard' or 'high'
  const [pdfOrientation, setPdfOrientation] = useState('portrait'); // 'portrait' or 'landscape'

  const exportFormats = [
    {
      value: 'html',
      icon: FileType,
      label: 'HTML',
      description: 'Web-friendly format',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      value: 'pdf',
      icon: Printer,
      label: 'PDF',
      description: 'Print-ready document',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      value: 'word',
      icon: FileText,
      label: 'Word',
      description: 'Editable document',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      value: 'acc-package',
      icon: Download,
      label: 'ACC Package',
      description: 'ISO 19650 folder ZIP',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    }
  ];

  const handleAdvancedExport = async () => {
    try {
      // Show loading toast
      const loadingToast = toast.loading('Generating PDF...');

      // Brief wait for components to render
      await new Promise(resolve => setTimeout(resolve, 300));

      // Capture screenshots of custom components
      let componentScreenshots = {};
      try {
        componentScreenshots = await captureCustomComponentScreenshots(formData);
        console.log('✅ Component screenshots captured:', Object.keys(componentScreenshots).length);
      } catch (screenshotError) {
        console.warn('⚠️  Screenshot capture failed, continuing without images:', screenshotError);
        toast.dismiss(loadingToast);
        toast.error('Warning: Some diagrams may not appear in the PDF');
      }

      // Generate PDF on backend using Puppeteer
      await generateBEPPDFOnServer(
        formData,
        bepType,
        tidpData,
        midpData,
        componentScreenshots,
        {
          orientation: pdfOrientation,
          quality: pdfQuality || 'standard'
        }
      );

      // Success
      toast.dismiss(loadingToast);
      toast.success('PDF generated successfully!');

    } catch (error) {
      console.error('❌ PDF export failed:', error);

      // User-friendly error messages
      let errorMessage = 'PDF export failed';

      if (error.message.includes('timeout')) {
        errorMessage = 'PDF generation timed out. Try using standard quality instead of high quality.';
      } else if (error.message.includes('network') || error.message.includes('connect')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('too large')) {
        errorMessage = 'BEP data too large. Please reduce the number of components.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Preview & Export
          </h1>
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-300 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </button>
          )}
        </div>
        <p className="text-lg text-gray-600 max-w-2xl">
          Review your BIM Execution Plan and export it in your preferred format.
          Choose from professional PDF, editable Word, or web-friendly HTML formats.
        </p>
      </div>

      {/* Export Format Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Choose Export Format
          </h2>
          <p className="text-gray-600">
            Select the format that best suits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {exportFormats.map(format => (
            <label
              key={format.value}
              className={`
                relative flex flex-col p-6 rounded-lg border-2 cursor-pointer transition-all duration-200
                ${exportFormat === format.value
                  ? `border-blue-500 bg-blue-50 shadow-md`
                  : `border-gray-200 ${format.bgColor} hover:border-gray-300 hover:shadow-sm`
                }
              `}
            >
              <div className="flex items-start space-x-4">
                <div className={`
                  flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
                  ${exportFormat === format.value ? 'bg-blue-500' : format.bgColor}
                `}>
                  <format.icon className={`
                    w-6 h-6
                    ${exportFormat === format.value ? 'text-white' : format.color}
                  `} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="radio"
                      value={format.value}
                      checked={exportFormat === format.value}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="sr-only"
                    />
                    <span className={`
                      text-lg font-semibold
                      ${exportFormat === format.value ? 'text-blue-600' : 'text-gray-900'}
                    `}>
                      {format.label}
                    </span>
                    {exportFormat === format.value && (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {format.description}
                  </p>

                  <div className={`
                    inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                    ${exportFormat === format.value
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    {format.value.toUpperCase()}
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <button
            onClick={previewBEP}
            className="
              flex items-center justify-center space-x-3 px-8 py-4 rounded-lg font-semibold text-white
              bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700
              transform hover:scale-105 active:scale-95 transition-all duration-200
              shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300
              min-h-[56px]
            "
          >
            <Eye className="w-6 h-6" />
            <span className="text-lg">Preview BEP</span>
          </button>

          <div className="flex-1 flex flex-col gap-4">
            {/* Advanced Options Toggle */}
            <button
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="
                flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium text-gray-700
                bg-gray-100 hover:bg-gray-200 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-gray-300
              "
            >
              <Settings className="w-4 h-4" />
              <span>Advanced Options</span>
              <RotateCcw className={`w-4 h-4 transition-transform duration-200 ${showAdvancedOptions ? 'rotate-180' : ''}`} />
            </button>

            {/* Advanced Options Panel */}
            {showAdvancedOptions && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PDF Quality
                    </label>
                    <div className="flex space-x-2">
                      {[
                        { value: 'standard', label: 'Standard', desc: 'Fast, good quality' },
                        { value: 'high', label: 'High', desc: 'Slow, best quality' }
                      ].map(option => (
                        <label
                          key={option.value}
                          className={`
                            flex-1 flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all
                            ${pdfQuality === option.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                            }
                          `}
                        >
                          <input
                            type="radio"
                            value={option.value}
                            checked={pdfQuality === option.value}
                            onChange={(e) => setPdfQuality(e.target.value)}
                            className="sr-only"
                          />
                          <span className={`
                            font-medium text-sm
                            ${pdfQuality === option.value ? 'text-blue-600' : 'text-gray-900'}
                          `}>
                            {option.label}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">{option.desc}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Orientation
                    </label>
                    <div className="flex space-x-2">
                      {[
                        { value: 'portrait', label: 'Portrait', icon: '📄' },
                        { value: 'landscape', label: 'Landscape', icon: '📋' }
                      ].map(option => (
                        <label
                          key={option.value}
                          className={`
                            flex-1 flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all
                            ${pdfOrientation === option.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                            }
                          `}
                        >
                          <input
                            type="radio"
                            value={option.value}
                            checked={pdfOrientation === option.value}
                            onChange={(e) => setPdfOrientation(e.target.value)}
                            className="sr-only"
                          />
                          <span className="text-2xl mr-2">{option.icon}</span>
                          <span className={`
                            font-medium text-sm
                            ${pdfOrientation === option.value ? 'text-blue-600' : 'text-gray-900'}
                          `}>
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={exportFormat === 'pdf' ? handleAdvancedExport : downloadBEP}
              disabled={isExporting}
              className="
                flex items-center justify-center space-x-3 px-8 py-4 rounded-lg font-semibold text-white
                bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
                transform hover:scale-105 active:scale-95 disabled:transform-none
                transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none
                focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:focus:ring-0
                min-h-[56px] w-full
              "
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-lg">Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="w-6 h-6" />
                  <span className="text-lg">
                    {exportFormat === 'pdf'
                      ? `Download ${pdfQuality === 'high' ? 'High Quality ' : ''}PDF`
                      : `Download ${exportFormat.toUpperCase()}`
                    }
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Export Status */}
        {isExporting && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <div>
                <p className="font-medium text-blue-900">Generating your BEP...</p>
                <p className="text-sm text-blue-700">This may take a few moments</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Live Preview</h3>
              <p className="text-sm text-gray-600 mt-1">
                See how your BIM Execution Plan will look with all diagrams and components
              </p>
            </div>
            {previewError && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{previewError}</span>
              </div>
            )}
          </div>
        </div>

        <div className="relative overflow-y-auto" style={{ maxHeight: '800px' }}>
          <div className="p-8">
            <BepPreviewRenderer
              formData={formData}
              bepType={bepType}
              tidpData={tidpData}
              midpData={midpData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewExportPage;