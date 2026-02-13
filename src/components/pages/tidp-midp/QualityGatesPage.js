import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, CheckCircle2, Clock, Users } from 'lucide-react';
import ApiService from '../../../services/apiService';
import toast from 'react-hot-toast';

const QualityGatesPage = () => {
  const { midpId } = useParams();
  const navigate = useNavigate();
  const [gates, setGates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQualityGates();
  }, [midpId]);

  const loadQualityGates = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getMIDPQualityGates(midpId);
      const gatesData = response.data?.qualityGates || response.data || [];
      setGates(Array.isArray(gatesData) ? gatesData : []);
    } catch (error) {
      console.error('Failed to load quality gates:', error);
      toast.error('Failed to load quality gates');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/tidp-midp')}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Quality Gates</h1>
              <p className="text-sm text-gray-600">{gates.length} gate{gates.length !== 1 ? 's' : ''} defined</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {gates.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Quality Gates Defined</h3>
            <p className="text-sm text-gray-500">Quality gates will be auto-generated when an MIDP is created from TIDPs with milestones.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gates.map((gate) => (
              <div key={gate.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Gate Header */}
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-5 py-4 border-b border-purple-100">
                  <h3 className="font-semibold text-gray-900">{gate.name}</h3>
                  <p className="text-sm text-purple-700 mt-0.5">Milestone: {gate.milestone}</p>
                </div>

                <div className="p-5 space-y-4">
                  {/* Criteria Checklist */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Criteria</span>
                    </h4>
                    <ul className="space-y-1.5">
                      {(gate.criteria || []).map((criterion, i) => (
                        <li key={i} className="flex items-start space-x-2 text-sm">
                          <span className="w-4 h-4 mt-0.5 rounded border border-gray-300 flex-shrink-0" />
                          <span className="text-gray-700">{criterion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Approvers */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>Approvers</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(gate.approvers || []).map((approver, i) => (
                        <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {approver}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Duration & Dependencies */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-1.5 text-sm text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{gate.estimatedDuration}</span>
                    </div>
                    {gate.dependencies && gate.dependencies.length > 0 && (
                      <span className="text-xs text-gray-400">
                        {gate.dependencies.length} dependenc{gate.dependencies.length !== 1 ? 'ies' : 'y'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QualityGatesPage;
