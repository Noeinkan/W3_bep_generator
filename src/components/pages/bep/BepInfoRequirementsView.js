import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSearch, ArrowRight, Info, Building2, Layers, Briefcase, FileText } from 'lucide-react';

/**
 * View to ask for information requirements documents (ISO 19650)
 * before entering the BEP editor.
 */
const BepInfoRequirementsView = () => {
  const navigate = useNavigate();

  const goToUpload = useCallback(() => {
    navigate('/bep-generator/new-document/step/eir');
  }, [navigate]);

  const goToBep = useCallback(() => {
    navigate('/bep-generator/new-document/step/0');
  }, [navigate]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-50 mb-4">
            <FileSearch className="w-7 h-7 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Do you have EIR or other information requirements?
          </h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Under ISO 19650, the information requirements hierarchy runs from appointing party documents (OIR, PIR, AIR/EIR) to delivery team responses (pre- and post-appointment BEP). OIR and AIR sit upstream of PIR and feed into it; the EIR you receive typically reflects these. We can analyze your documents with AI to suggest content for your BEP.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Building2 className="w-4 h-4 text-purple-600" />
              OIR (Organisational Information Requirements)
            </div>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Appointing party.</strong> Organisation-level information requirements tied to strategic objectives; in ISO 19650-1 they sit upstream of PIR and feed into it.
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Layers className="w-4 h-4 text-purple-600" />
              AIR (Asset Information Requirements)
            </div>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Appointing party.</strong> Information needed to operate and maintain the asset; like OIR, they feed into the PIR and are often reflected in the EIR.
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Briefcase className="w-4 h-4 text-purple-600" />
              PIR (Project Information Requirements)
            </div>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Appointing party.</strong> Project-specific information requirements for delivery, informed by OIR and AIR where applicable.
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <FileText className="w-4 h-4 text-purple-600" />
              EIR (Exchange Information Requirements)
            </div>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Appointing party.</strong> Appointment-level requirements governing information exchange; delivery teams respond via the BEP (pre- and post-appointment).
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-purple-700">
              Upload PDF or DOCX. We analyse them to extract objectives, requirements, and standards so you can respond clearly in your BEP. For multi-partner setups (e.g. GGP), each delivery team typically produces its own BEP in response to the same appointing party requirements.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={goToBep}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            No, go to the BEP
          </button>

          <button
            onClick={goToUpload}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
          >
            Yes, upload documents
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BepInfoRequirementsView;
