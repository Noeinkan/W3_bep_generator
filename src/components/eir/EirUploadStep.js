/**
 * EIR Upload Step Component
 *
 * Allows users to upload EIR (Exchange Information Requirements) documents
 * for analysis before filling out the BEP form.
 */

import { useState, useCallback, useRef } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle, Loader2, Sparkles, Trash2, FileSearch, ArrowRight, Info } from 'lucide-react';
import { uploadDocuments, getDocuments, deleteDocument, extractAndAnalyze } from '../../services/documentService';
import { useAuth } from '../../contexts/AuthContext';

const ACCEPTED_TYPES = {
  'application/pdf': '.pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
};

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const EirUploadStep = ({ draftId, onAnalysisComplete, onSkip }) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const userId = user?.id || 'anonymous';

  // Load existing documents on mount
  const loadDocuments = useCallback(async () => {
    try {
      const result = await getDocuments(userId, draftId);
      if (result.success) {
        setDocuments(result.documents);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  }, [userId, draftId]);

  // Handle file selection
  const handleFiles = async (files) => {
    setError(null);

    const validFiles = [];
    for (const file of files) {
      if (!Object.keys(ACCEPTED_TYPES).includes(file.type)) {
        setError(`File "${file.name}" not supported. Use PDF or DOCX.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`File "${file.name}" too large. Maximum 20MB.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadDocuments(
        validFiles,
        userId,
        draftId,
        (progress) => setUploadProgress(progress)
      );

      if (result.success) {
        setDocuments(prev => [...result.documents, ...prev]);
      } else {
        setError(result.message || 'Upload failed');
      }
    } catch (err) {
      setError(err.message || 'Error during upload');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleDelete = async (docId) => {
    try {
      await deleteDocument(docId, userId);
      setDocuments(prev => prev.filter(d => d.id !== docId));
    } catch (err) {
      setError('Error during deletion');
    }
  };

  const handleAnalyze = async (doc) => {
    setAnalyzing(doc.id);
    setError(null);

    try {
      const result = await extractAndAnalyze(doc.id, userId);

      if (result.success) {
        setDocuments(prev => prev.map(d =>
          d.id === doc.id
            ? { ...d, status: 'analyzed', analysisJson: result.data.analysisJson }
            : d
        ));

        if (onAnalysisComplete) {
          onAnalysisComplete(result.data);
        }
      } else {
        setError(result.message || 'Analysis failed');
      }
    } catch (err) {
      setError(err.message || 'Error during analysis');
    } finally {
      setAnalyzing(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'analyzed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'analyzing':
      case 'extracting':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'analyzed':
        return 'Analyzed';
      case 'analyzing':
        return 'Analyzing...';
      case 'extracting':
        return 'Extracting text...';
      case 'extracted':
        return 'Text extracted';
      case 'error':
        return 'Error';
      default:
        return 'Uploaded';
    }
  };

  const hasAnalyzedDocument = documents.some(d => d.status === 'analyzed');

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 mb-4">
          <FileSearch className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Upload EIR Document
        </h2>
        <p className="mt-2 text-gray-500 max-w-md mx-auto">
          Upload your Exchange Information Requirements to get AI-powered suggestions while filling out the BEP.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="flex-1 text-sm">{error}</span>
          <button
            onClick={() => setError(null)}
            className="p-1 hover:bg-red-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative rounded-2xl p-8 transition-all duration-200 cursor-pointer
          ${dragActive
            ? 'bg-purple-50 border-2 border-purple-400 shadow-lg shadow-purple-100'
            : 'bg-gray-50 border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
          }
          ${uploading ? 'pointer-events-none opacity-60' : ''}
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center text-center">
          {uploading ? (
            <>
              <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
              <p className="font-medium text-gray-700">Uploading... {uploadProgress}%</p>
              <div className="w-48 h-1.5 bg-gray-200 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-purple-500" />
              </div>
              <p className="font-medium text-gray-700">
                Drop your EIR document here
              </p>
              <p className="text-sm text-gray-400 mt-1">
                or click to browse
              </p>
              <div className="flex items-center gap-2 mt-4">
                <span className="px-2 py-1 bg-white rounded text-xs font-medium text-gray-500 border border-gray-100">PDF</span>
                <span className="px-2 py-1 bg-white rounded text-xs font-medium text-gray-500 border border-gray-100">DOCX</span>
                <span className="text-xs text-gray-400">up to 20MB</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Document list */}
      {documents.length > 0 && (
        <div className="mt-6 space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm"
            >
              <div className="flex-shrink-0">
                {getStatusIcon(doc.status)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate text-sm">
                  {doc.original_filename || doc.originalFilename}
                </p>
                <p className="text-xs text-gray-400">
                  {getStatusText(doc.status)}
                  {doc.file_size && ` \u00b7 ${(doc.file_size / 1024).toFixed(0)} KB`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {(doc.status === 'uploaded' || doc.status === 'extracted') && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAnalyze(doc); }}
                    disabled={analyzing === doc.id}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {analyzing === doc.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Analyze
                  </button>
                )}

                {doc.status === 'analyzed' && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Ready
                  </span>
                )}

                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info box */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-purple-900 text-sm">
              How it works
            </h4>
            <p className="text-sm text-purple-700/80 mt-1">
              Your document will be analyzed using AI to extract BIM objectives, requirements, milestones, and standards according to ISO 19650. These will appear as suggestions while filling out the BEP.
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
        <button
          onClick={onSkip}
          className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Skip this step
        </button>

        {hasAnalyzedDocument && onAnalysisComplete && (
          <button
            onClick={() => {
              const analyzed = documents.find(d => d.status === 'analyzed');
              if (analyzed && analyzed.analysisJson) {
                onAnalysisComplete({
                  analysisJson: analyzed.analysisJson,
                  summaryMarkdown: analyzed.summary_markdown
                });
              }
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            Continue with suggestions
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default EirUploadStep;
