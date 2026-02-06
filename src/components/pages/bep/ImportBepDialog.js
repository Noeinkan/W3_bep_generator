import React, { useRef, useState } from 'react';
import { Upload, FileJson, AlertCircle, CheckCircle } from 'lucide-react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';

const ImportBepDialog = ({ show, onImport, onCancel, isLoading }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  if (!show) return null;

  const handleFileSelect = (file) => {
    setError(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!file.name.endsWith('.json')) {
      setError('Please select a valid JSON file');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleImportClick = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    try {
      await onImport(selectedFile);
      // Reset state on success
      setSelectedFile(null);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to import BEP');
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setError(null);
    onCancel();
  };

  return (
    <Modal
      open={show}
      onClose={handleCancel}
      title="Import BEP"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={handleCancel} disabled={isLoading}>Cancel</Button>
          <Button
            onClick={handleImportClick}
            disabled={!selectedFile || isLoading}
            loading={isLoading}
            icon={Upload}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isLoading ? 'Importing...' : 'Import BEP'}
          </Button>
        </>
      }
    >

        {/* File Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all mb-6 ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="hidden"
          />

          {!selectedFile ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto">
                <FileJson className="w-8 h-8 text-slate-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900 mb-2">
                  Drop your JSON file here
                </p>
                <p className="text-sm text-slate-600 mb-4">
                  or click to browse
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  disabled={isLoading}
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Select File
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Supports BEP draft JSON files exported from this application
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900 mb-1">
                  File Selected
                </p>
                <p className="text-sm text-slate-600 font-mono bg-slate-100 px-4 py-2 rounded-lg inline-block">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setError(null);
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                disabled={isLoading}
              >
                Choose different file
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900">Import Failed</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">What happens when you import?</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>Your current work will be replaced with the imported data</li>
                <li>The BEP type will be auto-detected from the file</li>
                <li>You can continue editing and save as a new draft</li>
              </ul>
            </div>
          </div>
        </div>
    </Modal>
  );
};

export default ImportBepDialog;
