/**
 * SharedEirPage — public, no-auth page for a shared EIR document.
 *
 * Flow:
 *   Appointing party shares a link (/eir/shared/:token).
 *   LAP opens the link, views the EIR read-only, downloads PDF or
 *   clicks "Analyse EIR" to run ML analysis → result stored in
 *   sessionStorage → LAP proceeds to BEP generator.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileSearch, Download, Loader2, AlertTriangle, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import apiService from '../../services/apiService';
import EirAnalysisView from '../eir/EirAnalysisView';

const SharedEirPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState('loading'); // 'loading' | 'ready' | 'error' | 'analysing'
  const [eirData, setEirData] = useState(null); // { title, analysis_json, summary_markdown }
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) { setState('error'); setErrorMsg('Invalid link.'); return; }
    apiService.getSharedEir(token)
      .then((res) => {
        if (res?.success && res.analysis_json) {
          setEirData(res);
          setState('ready');
        } else {
          setState('error');
          setErrorMsg('This EIR is no longer available.');
        }
      })
      .catch(() => {
        setState('error');
        setErrorMsg('This EIR is no longer available or the link has expired.');
      });
  }, [token]);

  const handleDownloadPdf = async () => {
    if (!eirData) return;
    try {
      const blob = await apiService.exportEirDocumentPdf(eirData.analysis_json, eirData.title);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${eirData.title || 'EIR'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('PDF export failed — please try again.');
    }
  };

  const handleAnalyse = async () => {
    setState('analysing');
    try {
      const res = await apiService.analyzeSharedEir(token);
      if (res?.analysis_json) {
        sessionStorage.setItem('pendingEirAnalysis', JSON.stringify({
          analysis_json: res.analysis_json,
          summary_markdown: res.summary_markdown || '',
        }));
        toast.success('EIR analysis complete — open or create a BEP to use it.');
        navigate('/bep-generator');
      } else {
        throw new Error('No analysis returned');
      }
    } catch (err) {
      toast.error('Analysis failed. The ML service may be unavailable — try again or download the PDF and upload it manually.');
      setState('ready');
    }
  };

  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-amber-50/30">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          <p>Loading shared EIR…</p>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-amber-50/30">
        <div className="max-w-md text-center p-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mb-4">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">EIR not available</h2>
          <p className="text-gray-600">{errorMsg}</p>
          <p className="text-sm text-gray-400 mt-4">
            The appointing party may have unpublished this EIR, or the link may be incorrect.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center shrink-0">
              <FileSearch className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{eirData?.title || 'Exchange Information Requirements'}</h1>
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
                Shared document — read only
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              type="button"
              onClick={handleAnalyse}
              disabled={state === 'analysing'}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {state === 'analysing' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              {state === 'analysing' ? 'Analysing…' : 'Analyse EIR'}
            </button>
          </div>
        </div>

        {/* Info banner */}
        <div className="mb-6 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <strong>Appointed party:</strong> click <strong>Analyse EIR</strong> to run AI analysis on this document.
          The result will be loaded into your BEP session so AI suggestions and the Responsiveness Matrix are available automatically.
          Alternatively, download the PDF and upload it manually in the BEP wizard.
        </div>

        {/* EIR analysis view — read-only (no Use in BEP / Reanalyze buttons) */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <EirAnalysisView
            analysis={eirData?.analysis_json}
            summary={eirData?.summary_markdown}
            onUseInBep={null}
            onReanalyze={null}
            loading={state === 'analysing'}
          />
        </div>
      </div>
    </div>
  );
};

export default SharedEirPage;
