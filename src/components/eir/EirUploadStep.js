/**
 * EIR Upload Step Component
 *
 * Allows users to upload EIR (Exchange Information Requirements) documents
 * for analysis before filling out the BEP form.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle, Loader2, Sparkles, Trash2, FileSearch, ArrowRight, Info } from 'lucide-react';
import { uploadDocuments, getDocuments, getDocument, deleteDocument, extractAndAnalyze } from '../../services/documentService';
import ApiService from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';
import AnalysisProgressOverlay from './AnalysisProgressOverlay';

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
  const [uploadStalled, setUploadStalled] = useState(false);
  const [analyzing, setAnalyzing] = useState(null);
  const [error, setError] = useState(null);
  const [detailedError, setDetailedError] = useState(null);
  const [failedDocId, setFailedDocId] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);
  const uploadAbortRef = useRef(null);
  const uploadWatchdogRef = useRef(null);
  const lastProgressRef = useRef({ value: 0, ts: 0 });
  const uploadAbortedRef = useRef(false);

  // Progress overlay state
  const [showProgressOverlay, setShowProgressOverlay] = useState(false);
  const [isBackgrounded, setIsBackgrounded] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('extracting');
  const [analyzingDocName, setAnalyzingDocName] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const statusPollRef = useRef(null);
  const elapsedTimerRef = useRef(null);
  const pollStartRef = useRef(null);
  const isPollingRef = useRef(false);

  const userId = user?.id || 'anonymous';

  const getUploadErrorDetails = (message, status, errorCode = null) => {
    const normalizedMessage = message || 'Upload failed';
    const lowerMessage = (message || '').toLowerCase();

    if (errorCode === 'ERR_NETWORK' || lowerMessage.includes('network error')) {
      return {
        error: 'Network error during upload',
        detailed: 'Cannot reach the server. Check that the backend is running and the /api endpoint is reachable.'
      };
    }

    if (status === 413) {
      return {
        error: 'Upload failed',
        detailed: 'File too large for upload. Try compressing the PDF or splitting it into smaller sections.'
      };
    }

    if (status === 415) {
      return {
        error: 'Upload failed',
        detailed: 'Unsupported file type. Please upload a PDF or DOCX document.'
      };
    }

    return {
      error: normalizedMessage,
      detailed: status ? `Error ${status}: ${normalizedMessage}` : null
    };
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (statusPollRef.current) clearTimeout(statusPollRef.current);
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
      if (uploadWatchdogRef.current) clearInterval(uploadWatchdogRef.current);
      if (uploadAbortRef.current) uploadAbortRef.current.abort();
    };
  }, []);

  // Load existing documents on mount
  const loadDocuments = useCallback(async () => {
    try {
      const result = await getDocuments(userId, draftId);
      if (result.success) {
        setDocuments(result.documents || []);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  }, [userId, draftId]);

  // CRITICAL: Load documents when component mounts
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // Handle file selection
  const handleFiles = async (files) => {
    setError(null);
    setDetailedError(null);

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

    try {
      await ApiService.healthCheck();
    } catch (healthErr) {
      const message = healthErr?.message || 'Unable to reach backend server';
      setError('Network error during upload');
      setDetailedError(`Cannot reach the server. ${message}`);
      return;
    }

    if (uploadAbortRef.current) {
      uploadAbortRef.current.abort();
      uploadAbortRef.current = null;
    }
    if (uploadWatchdogRef.current) {
      clearInterval(uploadWatchdogRef.current);
      uploadWatchdogRef.current = null;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadStalled(false);
    uploadAbortedRef.current = false;

    const controller = new AbortController();
    uploadAbortRef.current = controller;
    lastProgressRef.current = { value: 0, ts: Date.now() };

    uploadWatchdogRef.current = setInterval(() => {
      if (!uploadAbortRef.current) {
        clearInterval(uploadWatchdogRef.current);
        uploadWatchdogRef.current = null;
        return;
      }

      const secondsSinceProgress = (Date.now() - lastProgressRef.current.ts) / 1000;
      if (secondsSinceProgress > 15) {
        setUploadStalled(true);
      }
      if (secondsSinceProgress > 60 && !uploadAbortedRef.current) {
        uploadAbortedRef.current = true;
        uploadAbortRef.current.abort();
        setError('Upload stalled. Please try again.');
        setDetailedError('No upload progress detected for over 60 seconds. Check your connection and retry.');
      }
    }, 2000);

    try {
      const result = await uploadDocuments(
        validFiles,
        userId,
        draftId,
        (progress) => {
          if (progress > lastProgressRef.current.value) {
            lastProgressRef.current = { value: progress, ts: Date.now() };
            setUploadStalled(false);
          }
          setUploadProgress(progress);
        },
        controller.signal
      );

      if (result.success) {
        // Optimistic UI update
        setDocuments(prev => [...prev, ...(result.documents || [])]);

        // Do not auto-analyze; let the user choose when to analyze
      } else {
        if (!uploadAbortedRef.current) {
          const { error: uploadError, detailed } = getUploadErrorDetails(result.message, result.status);
          setError(uploadError);
          if (detailed) {
            setDetailedError(detailed);
          }
        }
      }
    } catch (err) {
      if (!uploadAbortedRef.current) {
        if (err?.code === 'ERR_CANCELED') {
          return;
        }
        const { error: uploadError, detailed } = getUploadErrorDetails(
          err?.message,
          err?.response?.status,
          err?.code
        );
        setError(uploadError);
        setDetailedError(detailed || err?.message || 'Network error during upload');
        console.error('Upload error:', err);
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setUploadStalled(false);
      if (uploadWatchdogRef.current) {
        clearInterval(uploadWatchdogRef.current);
        uploadWatchdogRef.current = null;
      }
      uploadAbortRef.current = null;
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (dragCounter.current > 0) setDragActive(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
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
      const result = await deleteDocument(docId, userId);
      if (result.success) {
        // Optimistic UI update
        setDocuments(prev => prev.filter(d => d.id !== docId));
        setError(null);
        setDetailedError(null);
        if (failedDocId === docId) {
          setFailedDocId(null);
        }
      } else {
        setError(result.message || 'Failed to delete document');
      }
    } catch (err) {
      setError('Failed to delete document. Please try again.');
      console.error('Delete error:', err);
      // Reload on error to ensure consistency
      await loadDocuments();
    }
  };

  // Start polling for status updates
  const startStatusPolling = (docId) => {
    if (statusPollRef.current) {
      clearTimeout(statusPollRef.current);
    }

    isPollingRef.current = true;
    pollStartRef.current = Date.now();

    const getPollInterval = (elapsedSeconds) => {
      if (elapsedSeconds < 20) return 2000;
      if (elapsedSeconds < 60) return 4000;
      if (elapsedSeconds < 180) return 7000;
      return 10000;
    };

    const pollStatus = async () => {
      if (!isPollingRef.current) return;

      try {
        const result = await getDocument(docId, userId);
        if (result.success && result.document) {
          const status = result.document.status;
          setAnalysisStatus(status);

          // Update document in list with full data
          setDocuments(prev => prev.map(d =>
            d.id === docId ? { ...d, ...result.document, status } : d
          ));

          // Handle completion
          if (status === 'analyzed') {
            stopPolling();

            // Small delay to show completion state
            setTimeout(() => {
              closeOverlay();
              if (onAnalysisComplete && result.document.analysis_json) {
                onAnalysisComplete({
                  analysisJson: result.document.analysis_json,
                  summaryMarkdown: result.document.summary_markdown
                });
              }
            }, 1000);
          } else if (status === 'error') {
            stopPolling();
            closeOverlay();
            setFailedDocId(docId);

            // Provide detailed error message
            const errorMsg = result.document.error_message || 'Analysis failed';
            setError(errorMsg);

            // Provide helpful context based on error type
            if (errorMsg.includes('Text extraction failed') || errorMsg.includes('No text could be extracted')) {
              setDetailedError('Could not extract text from the document. Common causes:\n• Scanned/image-based PDF (needs OCR)\n• Password-protected or encrypted file\n• Corrupted document\n• Try converting to DOCX or use a text-based PDF');
            } else if (errorMsg.includes('timeout') || errorMsg.includes('timed out')) {
              setDetailedError('Processing timed out. The document may be:\n• Too large or complex for analysis\n• Try simplifying the document\n• Split into smaller sections\n• Ensure ML service is responsive');
            } else if (errorMsg.includes('AI service') || errorMsg.includes('not available') || errorMsg.includes('ECONNREFUSED')) {
              setDetailedError('AI service is not available. Please:\n• Ensure the ML service is running\n• Check that Ollama is active (ollama serve)\n• Verify the model is loaded\n• Contact support if the issue persists');
            } else if (errorMsg.includes('AI analysis encountered an error')) {
              setDetailedError('AI analysis failed. Common causes:\n• Document content doesn\'t match EIR format\n• Unexpected document structure\n• Model processing error\n• Try a different document or contact support');
            } else {
              setDetailedError(errorMsg);
            }
          }
        } else if (!result.success) {
          // API call failed
          console.error('Failed to get document status:', result.message);
        }
      } catch (err) {
        console.error('Status poll error:', err);
      }

      if (!isPollingRef.current) return;
      const elapsedSeconds = Math.floor((Date.now() - (pollStartRef.current || Date.now())) / 1000);
      const nextDelay = getPollInterval(elapsedSeconds);
      statusPollRef.current = setTimeout(pollStatus, nextDelay);
    };

    pollStatus();
  };

  // Stop polling and timers
  const stopPolling = () => {
    isPollingRef.current = false;
    if (statusPollRef.current) {
      clearTimeout(statusPollRef.current);
      statusPollRef.current = null;
    }
    if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
  };

  const closeOverlay = useCallback(() => {
    setShowProgressOverlay(false);
    setIsBackgrounded(false);
  }, []);

  // Start elapsed time counter
  const startElapsedTimer = () => {
    setElapsedTime(0);
    elapsedTimerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
  };

  const handleAnalyzeAll = async () => {
    const pending = documents.filter(d => ['uploaded', 'extracted'].includes(d.status));
    for (const doc of pending) {
      // Only analyze if not already analyzing
      if (analyzing !== doc.id) {
        await handleAnalyze(doc);
      }
    }
  };

  const handleAnalyze = async (doc) => {
    setAnalyzing(doc.id);
    setError(null);
    setDetailedError(null);
    setFailedDocId(null);

    // Show progress overlay
    setShowProgressOverlay(true);
    setIsBackgrounded(false);
    setAnalysisStatus('extracting');
    setAnalyzingDocName(doc.original_filename || doc.originalFilename || 'Document');
    startElapsedTimer();
    startStatusPolling(doc.id);

    try {
      const result = await extractAndAnalyze(doc.id, userId);

      stopPolling();

      if (result.success) {
        setAnalysisStatus('analyzed');

        // Auto-delete previously analyzed documents (keep only the latest)
        const previouslyAnalyzed = documents.filter(d => d.status === 'analyzed' && d.id !== doc.id);
        for (const oldDoc of previouslyAnalyzed) {
          try {
            await deleteDocument(oldDoc.id, userId);
          } catch (err) {
            console.error('Failed to delete old analyzed document:', err);
          }
        }

        // Update state with optimistic UI
        setDocuments(prev => prev
          .filter(d => !(d.status === 'analyzed' && d.id !== doc.id))
          .map(d =>
            d.id === doc.id
              ? { ...d, status: 'analyzed', analysisJson: result.data.analysisJson, analysis_json: result.data.analysisJson, summary_markdown: result.data.summaryMarkdown }
              : d
          )
        );

        // Small delay to show completion state
        setTimeout(() => {
          closeOverlay();
          if (onAnalysisComplete) {
            onAnalysisComplete(result.data);
          }
        }, 1000);
      } else {
        closeOverlay();
        setFailedDocId(doc.id);
        const errorMessage = result.message || 'Analysis failed';
        setError(errorMessage);

        // Provide more context based on the error and stage
        const stage = result.stage;

        if (stage === 'extraction') {
          setDetailedError('Text extraction failed. Common causes:\n• Scanned/image-based PDF (needs OCR)\n• Password-protected or encrypted file\n• Corrupted document\n• Try converting to DOCX or use a text-based PDF');
        } else if (stage === 'analysis') {
          if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
            setDetailedError('Analysis timed out. The document may be:\n• Too large or complex\n• Try simplifying the document\n• Split into smaller sections');
          } else if (errorMessage.includes('AI service') || errorMessage.includes('not available')) {
            setDetailedError('AI service is unavailable. Please:\n• Ensure the ML service is running\n• Check that Ollama is active\n• Contact support if the issue persists');
          } else {
            setDetailedError(`AI analysis error: ${errorMessage}\n\nTry:\n• Using a different document format\n• Simplifying the content\n• Ensuring proper EIR structure`);
          }
        } else if (result.status === 500) {
          setDetailedError('Server error occurred. Possible causes:\n• Document too complex or poorly formatted\n• AI service temporarily unavailable\n• Try simplifying the document or waiting a moment');
        } else if (result.status === 413) {
          setDetailedError('Document exceeds size limit. Try:\n• Compressing the PDF\n• Removing images if not essential\n• Splitting into smaller sections');
        } else {
          setDetailedError(errorMessage);
        }
      }
    } catch (err) {
      // Check if it's a timeout error - the backend might still be processing
      const isTimeout = err.code === 'ECONNABORTED' || err.message?.includes('timeout');

      if (isTimeout) {
        // Continue polling - backend may still complete the analysis
        console.log('Request timed out, continuing to poll for status...');
        // Don't stop polling, let it continue checking status
        // The polling will detect when analysis is complete or errors
      } else {
        stopPolling();
        closeOverlay();
        setFailedDocId(doc.id);
        setError('Analysis failed unexpectedly');
        setDetailedError(`Network error: ${err.message || 'Could not connect to the analysis service'}`);
        console.error('Analysis error:', err);
      }
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

  const getFileTypeBadge = (filename) => {
    if (!filename) return null;
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'pdf') {
      return <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">PDF</span>;
    } else if (ext === 'docx') {
      return <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">DOCX</span>;
    }
    return null;
  };

  const hasAnalyzedDocument = documents.some(d => d.status === 'analyzed');
  const pendingDocs = documents.filter(d => ['uploaded', 'extracted'].includes(d.status));

  return (
    <div className="max-w-2xl mx-auto">
      {/* Analysis Progress Overlay */}
      <AnalysisProgressOverlay
        isOpen={showProgressOverlay && !isBackgrounded}
        currentStatus={analysisStatus}
        documentName={analyzingDocName}
        elapsedTime={elapsedTime}
        canClose={showProgressOverlay}
        onClose={() => setIsBackgrounded(true)}
        showBackgroundHint={!isBackgrounded}
      />

      <div className="pb-24">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 mb-3">
            <FileSearch className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Upload Information Requirements (EIR/AIR/PIR/OIR)
          </h2>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            Upload your ISO 19650 information requirements to get AI-powered suggestions while filling out the BEP.
          </p>
        </div>

        {/* Background mode banner */}
        {showProgressOverlay && isBackgrounded && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3">
            <div className="flex items-center gap-3 text-sm text-purple-700">
              <Loader2 className="w-4 h-4 animate-spin" />
              Analysis is running in the background. You can keep working here.
            </div>
            <button
              type="button"
              onClick={() => setIsBackgrounded(false)}
              className="px-3 py-1.5 text-xs font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Reopen
            </button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div role="alert" aria-live="assertive" className="mb-5 bg-red-50 border border-red-200 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 p-4 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">{error}</p>
                {detailedError && (
                  <p className="text-xs text-red-600 mt-1">{detailedError}</p>
                )}
              </div>
              <button
                onClick={() => {
                  setError(null);
                  setDetailedError(null);
                }}
                className="p-1 hover:bg-red-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {failedDocId && (
              <div className="px-4 pb-3 flex items-center gap-2 text-xs">
                <button
                  onClick={() => {
                    const failedDoc = documents.find(d => d.id === failedDocId);
                    if (failedDoc) {
                      handleAnalyze(failedDoc);
                    }
                  }}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Retry Analysis
                </button>
                <span className="text-red-600">or delete the document and upload a different version</span>
              </div>
            )}
          </div>
        )}

        {/* Dropzone */}
        <div
          role="button"
          aria-label="Upload EIR documents - click to browse or drag and drop PDF or DOCX files"
          aria-busy={uploading || analyzing !== null}
          tabIndex={0}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={`
            relative rounded-2xl p-6 transition-all duration-200 cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
            ${dragActive
              ? 'bg-purple-50 border-2 border-purple-400 shadow-lg shadow-purple-100'
              : 'bg-gray-50 border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
            }
            ${uploading || analyzing ? 'pointer-events-none opacity-60' : ''}
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
                <p className="font-medium text-gray-700" role="status" aria-live="polite">Uploading... {uploadProgress}%</p>
                <div className="w-48 h-1.5 bg-gray-200 rounded-full mt-3 overflow-hidden" role="progressbar" aria-valuenow={uploadProgress} aria-valuemin="0" aria-valuemax="100">
                  <div
                    className="h-full bg-purple-500 transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                {uploadStalled && (
                  <p className="text-xs text-gray-500 mt-2">
                    Upload is taking longer than expected. We are still trying...
                  </p>
                )}
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 text-purple-500" />
                </div>
                <p className="font-medium text-gray-700">
                  Drop your information requirements document here
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  or click to browse
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="px-2 py-1 bg-white rounded text-xs font-medium text-gray-500 border border-gray-100">PDF</span>
                  <span className="px-2 py-1 bg-white rounded text-xs font-medium text-gray-500 border border-gray-100">DOCX</span>
                  <span className="text-xs text-gray-400">up to 20MB</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Analyze All Pending Button */}
        {pendingDocs.length > 0 && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAnalyzeAll}
              disabled={analyzing !== null}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              Analyze All Pending ({pendingDocs.length})
            </button>
          </div>
        )}

        {/* Document list */}
        {documents.length > 0 ? (
          <div role="list" className={`${pendingDocs.length > 0 ? 'mt-3' : 'mt-5'} space-y-3`}>
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm"
                role="listitem"
                aria-label={`${doc.original_filename || doc.originalFilename} - ${getStatusText(doc.status)}`}
              >
                <div className="flex-shrink-0" aria-hidden="true">
                  {getStatusIcon(doc.status)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 truncate text-sm">
                      {doc.original_filename || doc.originalFilename || 'Unknown file'}
                    </p>
                    {getFileTypeBadge(doc.original_filename || doc.originalFilename)}
                  </div>
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

                  {doc.status === 'error' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAnalyze(doc); }}
                      disabled={analyzing === doc.id}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {analyzing === doc.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                      Retry
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
        ) : (
          !uploading && (
            <div className="mt-5 p-6 bg-gray-50 border border-gray-200 rounded-xl text-center">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No documents uploaded yet</p>
            </div>
          )
        )}

        {/* Info box */}
        <div className="mt-5 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-purple-900 text-sm">
                How it works
              </h4>
              <p className="text-sm text-purple-700/80 mt-1">
                Your document will be analyzed using AI to extract objectives, requirements, milestones, and standards from EIR/AIR/PIR/OIR according to ISO 19650. These will appear as suggestions while filling out the BEP.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="sticky bottom-0 -mx-2 px-2 pt-4 pb-2 bg-white/95 backdrop-blur border-t border-gray-100">
        <div className="flex items-center justify-between">
          <button
            onClick={onSkip}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Skip this step
          </button>

          {hasAnalyzedDocument && onAnalysisComplete && (
            <button
              onClick={() => {
                // Get the most recently created analyzed document
                const analyzedDocs = documents.filter(d => d.status === 'analyzed');
                const latestAnalyzed = analyzedDocs.length > 0
                  ? analyzedDocs.reduce((latest, doc) =>
                      new Date(doc.created_at || 0) > new Date(latest.created_at || 0) ? doc : latest
                    )
                  : null;

                if (latestAnalyzed) {
                  onAnalysisComplete({
                    analysisJson: latestAnalyzed.analysisJson || latestAnalyzed.analysis_json,
                    summaryMarkdown: latestAnalyzed.summary_markdown
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
    </div>
  );
};

export default EirUploadStep;
