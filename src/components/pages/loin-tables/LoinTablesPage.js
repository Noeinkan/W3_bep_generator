import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ArrowLeft } from 'lucide-react';

/**
 * LOIN Tables — placeholder page for managing Level of Information Need tables by discipline, stage, and element.
 * The BEP references this module (e.g. section 5.2a) for LOIN specifications aligned with ISO 19650.
 */
const LoinTablesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-50" data-page-uri="/loin-tables">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">LOIN Tables</h1>
            <p className="text-sm text-gray-600">Level of Information Need</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <p className="text-gray-700 mb-4">
            Manage Level of Information Need (LOIN) tables by project stage, discipline, and element. LOIN defines the quality, quantity, and granularity of information (geometry, alphanumeric, documentation) per ISO 19650. These tables can feed into TIDP containers and deliverables.
          </p>
          <p className="text-teal-700 font-medium">Coming soon.</p>
          <p className="text-sm text-gray-500 mt-2">
            You can reference this module from the BEP editor (Step 5 — Level of Information Need). An inline LOIN matrix remains available in the same step.
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

export default LoinTablesPage;
