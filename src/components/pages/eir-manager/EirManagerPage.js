import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSearch, ArrowLeft } from 'lucide-react';

/**
 * EIR Manager — placeholder page for managing Exchange Information Requirements per project.
 * The BEP references this module (e.g. section 1.1a) for client EIR documents and requirements.
 */
const EirManagerPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-50" data-page-uri="/eir-manager">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
            <FileSearch className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">EIR Manager</h1>
            <p className="text-sm text-gray-600">Exchange Information Requirements</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <p className="text-gray-700 mb-4">
            Manage client Exchange Information Requirements (EIR) for this project. The EIR defines how information is shared between parties (ISO 19650) and covers managerial, technical, and operational requirements. Your BEP is the delivery team&apos;s response to the EIR.
          </p>
          <p className="text-amber-700 font-medium">Coming soon.</p>
          <p className="text-sm text-gray-500 mt-2">
            You can reference this module from the BEP editor (Step 1 — EIR Reference). Document upload and analysis remain available in the BEP pre-step flow.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/bep-generator')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to BEP Generator
        </button>
      </div>
    </div>
  );
};

export default EirManagerPage;
