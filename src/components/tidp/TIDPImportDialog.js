import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import ApiService from '../../services/apiService';
import { Modal, Button } from '../common';

const TIDPImportDialog = ({ open, onClose, onImportComplete }) => {
  const [importType, setImportType] = useState('excel');
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState(null);
  const [importResults, setImportResults] = useState(null);
  const [projectId, setProjectId] = useState('imported-project');
  const fileInputRef = useRef(null);

  const loadTemplate = async () => {
    try {
      const templateData = await ApiService.getTIDPImportTemplate();
      setTemplate(templateData.data);
    } catch (error) {
      console.error('Failed to load template:', error);
    }
  };

  React.useEffect(() => {
    if (open && !template) {
      loadTemplate();
    }
  }, [open, template]);

  const downloadTemplate = () => {
    if (!template) return;

    const csvContent = [
      template.headers.join(','),
      template.sampleData.map(row =>
        template.headers.map(header => `"${row[header] || ''}"`).join(',')
      ).join('\n')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tidp_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setImportResults(null);

    try {
      // Quick health check to ensure backend is reachable and provide clearer error to the user
      try {
        await ApiService.healthCheck();
      } catch (healthErr) {
        throw new Error('Unable to reach backend server: ' + (healthErr.message || healthErr));
      }
      // Use Papa Parse for CSV files
      if (file.name.endsWith('.csv') || importType === 'csv') {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            try {
              if (!results.data || results.data.length === 0) {
                throw new Error('No data found in CSV file');
              }

              // Import the data
              const apiResults = await ApiService.importTIDPsFromCSV(results.data, projectId);
              setImportResults(apiResults.data);

              if (onImportComplete) {
                onImportComplete(apiResults.data);
              }
            } catch (error) {
              console.error('Import failed:', error);
              setImportResults({
                successful: [],
                failed: [{ error: error.message || 'Import failed' }],
                total: 0
              });
            } finally {
              setLoading(false);
            }
          },
          error: (error) => {
            console.error('CSV parsing error:', error);
            setImportResults({
              successful: [],
              failed: [{ error: 'Failed to parse CSV file: ' + error.message }],
              total: 0
            });
            setLoading(false);
          }
        });
      } else {
        // For Excel files, parse using xlsx library
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Get the first worksheet
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            // Convert to JSON with header row
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            if (jsonData.length === 0) {
              throw new Error('No data found in Excel file');
            }
            
            // Convert array of arrays to array of objects (first row as headers)
            const headers = jsonData[0];
            const rows = jsonData.slice(1);
            
            const excelData = rows.map(row => {
              const obj = {};
              headers.forEach((header, index) => {
                obj[header] = row[index] || '';
              });
              return obj;
            });
            
            // Import the data using Excel endpoint
            const apiResults = await ApiService.importTIDPsFromExcel(excelData, projectId);
            setImportResults(apiResults.data);

            if (onImportComplete) {
              onImportComplete(apiResults.data);
            }
          } catch (error) {
            console.error('Excel parsing error:', error);
            setImportResults({
              successful: [],
              failed: [{ error: 'Failed to parse Excel file: ' + error.message }],
              total: 0
            });
          } finally {
            setLoading(false);
          }
        };
        
        reader.onerror = () => {
          setImportResults({
            successful: [],
            failed: [{ error: 'Failed to read Excel file' }],
            total: 0
          });
          setLoading(false);
        };
        
        reader.readAsArrayBuffer(file);
      }
    } catch (error) {
      console.error('Import failed:', error);
      setImportResults({
        successful: [],
        failed: [{ error: error.message || 'Import failed' }],
        total: 0
      });
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Import TIDPs"
      size="lg"
      className="max-h-[90vh] overflow-y-auto"
    >

          {!importResults ? (
            <div className="space-y-6">
              {/* Project ID Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project ID
                </label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter project ID"
                />
              </div>

              {/* Import Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Import Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="excel"
                      checked={importType === 'excel'}
                      onChange={(e) => setImportType(e.target.value)}
                      className="mr-2"
                    />
                    Excel (.xlsx)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="csv"
                      checked={importType === 'csv'}
                      onChange={(e) => setImportType(e.target.value)}
                      className="mr-2"
                    />
                    CSV (.csv)
                  </label>
                </div>
              </div>

              {/* Template Download */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-blue-900">Download Template</h3>
                    <p className="text-sm text-blue-700">
                      Download the import template to ensure your data is in the correct format
                    </p>
                  </div>
                  <Button
                    onClick={downloadTemplate}
                    disabled={!template}
                    variant="secondary"
                    icon={<Download className="w-4 h-4" />}
                  >
                    Template
                  </Button>
                </div>

                {template && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Expected columns:</p>
                    <div className="flex flex-wrap gap-2">
                      {template.headers.map((header, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          {header}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-2">
                    Click to upload or drag and drop your {importType.toUpperCase()} file
                  </p>
                  <p className="text-sm text-gray-500">
                    Supported formats: .{importType === 'excel' ? 'xlsx, .xls' : 'csv'}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={importType === 'excel' ? '.xlsx,.xls' : '.csv'}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {loading && (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Importing TIDPs...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Import Results */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Import Results</h3>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <p className="text-2xl font-bold text-green-900">{importResults.successful.length}</p>
                    <p className="text-sm text-green-700">Successful</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
                    <p className="text-2xl font-bold text-red-900">{importResults.failed.length}</p>
                    <p className="text-sm text-red-700">Failed</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    <p className="text-2xl font-bold text-gray-900">{importResults.total}</p>
                    <p className="text-sm text-gray-700">Total</p>
                  </div>
                </div>

                {importResults.failed.length > 0 && (
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 mb-2">Failed Imports:</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {importResults.failed.map((failure, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium">Row {failure.row || index + 1}:</span>
                          <span className="text-red-700 ml-2">{failure.error}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {importResults.successful.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">Successfully Imported:</h4>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {importResults.successful.slice(0, 10).map((tidp, index) => (
                        <div key={index} className="text-sm text-green-700">
                          {tidp.teamName} ({tidp.discipline})
                        </div>
                      ))}
                      {importResults.successful.length > 10 && (
                        <div className="text-sm text-green-600">
                          ... and {importResults.successful.length - 10} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setImportResults(null);
                    setLoading(false);
                  }}
                  className="flex-1"
                >
                  Import More
                </Button>
                <Button
                  onClick={onClose}
                  className="flex-1"
                >
                  Done
                </Button>
              </div>
            </div>
          )}
    </Modal>
  );
};

export default TIDPImportDialog;