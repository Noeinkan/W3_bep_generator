import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  TrendingUp,
  ArrowLeft,
  FileText,
  CheckCircle,
  Download,
  Layers,
  Shield,
  Users,
  ShieldCheck,
  GitBranch,
  AlertTriangle
} from 'lucide-react';
import ApiService from '../../../services/apiService';
import toast, { Toaster } from 'react-hot-toast';
import TIDPImportDialog from '../../tidp/TIDPImportDialog';
import MIDPEvolutionDashboard from '../../midp/MIDPEvolutionDashboard';
import { useTIDPFilters } from '../../../hooks/useTIDPFilters';
import { exportTidpCsvTemplate, exportTidpToCSV, exportMidpToCSV } from '../../../utils/tidpExport';
import { checkMIDPCompliance, generateComplianceReport } from '../../../utils/complianceCheck';

import { useProject } from '../../../contexts/ProjectContext';

// Sub-components
import StatisticsCards from './dashboard/StatisticsCards';
import TIDPsView from './dashboard/TIDPsView';
import MIDPSummaryPanel from './dashboard/MIDPSummaryPanel';
import MIDPAnalyticsDrawer from './dashboard/MIDPAnalyticsDrawer';
import HelpModal from './dashboard/HelpModal';

const TIDPMIDPDashboard = () => {
  const navigate = useNavigate();
  const { currentProject } = useProject();

  const [tidps, setTidps] = useState([]);
  const [midps, setMidps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showEvolutionDashboard, setShowEvolutionDashboard] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showMIDPDrawer, setShowMIDPDrawer] = useState(false);
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [complianceResult, setComplianceResult] = useState(null);

  // Use custom hook for TIDP filtering
  const {
    searchTerm,
    setSearchTerm,
    filterDiscipline,
    setFilterDiscipline,
    filterStatus,
    setFilterStatus,
    filterMilestone,
    setFilterMilestone,
    filterDateFrom,
    setFilterDateFrom,
    filterDateTo,
    setFilterDateTo,
    disciplines,
    statuses,
    milestones
  } = useTIDPFilters(tidps);

  // Statistics
  const [stats, setStats] = useState({
    totalTidps: 0,
    totalMidps: 0,
    totalDeliverables: 0,
    activeMilestones: 0
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    loadData();
    return () => { mountedRef.current = false; };
  }, [currentProject?.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const projectId = currentProject?.id || null;
      const [tidpData, midpData] = await Promise.all([
        ApiService.getAllTIDPs(projectId),
        ApiService.getAllMIDPs(projectId)
      ]);

      if (!mountedRef.current) return;

      const tidpList = tidpData.data || [];
      const midpList = midpData.data || [];

      setTidps(tidpList);
      setMidps(midpList);

      // Calculate statistics
      const totalDeliverables = tidpList.reduce((sum, tidp) =>
        sum + (tidp.containers?.length || 0), 0
      );

      const allMilestones = new Set();
      tidpList.forEach(tidp => {
        tidp.containers?.forEach(container => {
          const milestone = container.Milestone || container.deliveryMilestone;
          if (milestone) allMilestones.add(milestone);
        });
      });

      setStats({
        totalTidps: tidpList.length,
        totalMidps: midpList.length,
        totalDeliverables,
        activeMilestones: allMilestones.size
      });

    } catch (error) {
      if (mountedRef.current) {
        console.error('Failed to load TIDP/MIDP data:', error);
        toast.error('Failed to load data');
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const handleExportTidpCsvTemplate = () => {
    const result = exportTidpCsvTemplate();
    if (result.success) {
      toast.success('TIDP CSV template downloaded successfully!');
    } else {
      toast.error('Failed to download CSV template');
    }
  };

  const handleImportComplete = async (importResults) => {
    toast.success(`Imported ${importResults.successful.length} TIDPs successfully`);
    setShowImportDialog(false);
    await loadData();
  };

  const handleViewTidpDetails = (tidpId) => {
    navigate(`/tidp-editor/${tidpId}`);
  };

  const handleDownloadTidp = async (tidp) => {
    const result = exportTidpToCSV(tidp);
    if (result.success) {
      toast.success('TIDP downloaded successfully!');
    } else {
      toast.error('Failed to download TIDP');
    }
  };

  const handleDownloadMidp = async (midp) => {
    toast('Downloading MIDP report...');
    const result = exportMidpToCSV(midp);
    if (result.success) {
      toast.success('MIDP report downloaded successfully!');
    } else {
      toast.error('Failed to download MIDP report');
    }
  };

  const autoGenerateMIDP = async () => {
    setLoading(true);
    try {
      const projectId = currentProject?.id;
      if (projectId) {
        await ApiService.autoGenerateMIDP(projectId, {
          projectName: `Auto-generated MIDP ${new Date().toLocaleDateString()}`,
          description: 'Master Information Delivery Plan compiled from project TIDPs'
        });
      } else {
        await ApiService.autoGenerateMIDPAll({
          projectName: `Auto-generated MIDP ${new Date().toLocaleDateString()}`,
          description: 'Master Information Delivery Plan compiled from all TIDPs'
        });
      }

      toast.success('MIDP auto-generated successfully');
      await loadData();
    } catch (err) {
      console.error('Auto-generate MIDP failed', err);
      toast.error(err.message || 'Failed to auto-generate MIDP');
    } finally {
      setLoading(false);
    }
  };

  const handleComplianceCheck = async () => {
    const result = checkMIDPCompliance(midps);
    setComplianceResult(result);
    setShowComplianceModal(true);
  };

  const handleGenerateReport = async () => {
    const result = await generateComplianceReport(midps);
    if (result.success) {
      toast.success('Report generated successfully');
    } else {
      toast.error('Failed to generate report');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" data-page-uri="/tidp-midp">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                const returnUrl = sessionStorage.getItem('bep-return-url');
                if (returnUrl) {
                  sessionStorage.removeItem('bep-return-url');
                  window.location.href = returnUrl;
                } else {
                  navigate('/');
                }
              }}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">TIDP/MIDP Manager</h1>
              <p className="text-sm text-gray-600">Information Delivery Planning</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowImportDialog(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-300 transition-all duration-200"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </button>

            <button
              onClick={autoGenerateMIDP}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 hover:shadow-md transition-all duration-200"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Generate MIDP
            </button>

            <div className="w-px h-8 bg-gray-300 mx-1 hidden lg:block" />

            <button
              onClick={() => setShowHelp(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-300 transition-all duration-200"
              title="Help"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden xl:inline ml-2">Help</span>
            </button>

            <button
              onClick={handleComplianceCheck}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-green-50 hover:border-green-300 transition-all duration-200"
              title="Compliance Check"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="hidden xl:inline ml-2">Compliance</span>
            </button>

            <button
              onClick={handleGenerateReport}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
              title="Generate Report"
            >
              <Download className="w-4 h-4" />
              <span className="hidden xl:inline ml-2">Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Unified Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Statistics Cards */}
        <StatisticsCards stats={stats} loading={loading} />

        {/* TIDPs Management Section */}
        <TIDPsView
          tidps={tidps}
          loading={loading}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterDiscipline={filterDiscipline}
          onFilterChange={setFilterDiscipline}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          filterMilestone={filterMilestone}
          onFilterMilestoneChange={setFilterMilestone}
          filterDateFrom={filterDateFrom}
          onFilterDateFromChange={setFilterDateFrom}
          filterDateTo={filterDateTo}
          onFilterDateToChange={setFilterDateTo}
          disciplines={disciplines}
          statuses={statuses}
          milestones={milestones}
          onCreateNew={() => navigate('/tidp-editor')}
          onDownloadTemplate={handleExportTidpCsvTemplate}
          onViewDetails={handleViewTidpDetails}
          onDownloadTidp={handleDownloadTidp}
        />

        {/* MIDP Summary Panel */}
        <MIDPSummaryPanel
          midps={midps}
          loading={loading}
          onRefreshMIDP={autoGenerateMIDP}
          onDownloadCSV={() => {
            const activeMidp = midps.length > 0 ? midps[midps.length - 1] : null;
            if (activeMidp) handleDownloadMidp(activeMidp);
          }}
          onViewFullAnalytics={() => setShowMIDPDrawer(true)}
        />

        {/* MIDP Analysis Quick Links */}
        {midps.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">MIDP Analysis</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <button
                onClick={() => navigate(`/tidp-midp/risk-register/${midps[midps.length - 1].id}`)}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-red-200 transition-all text-left group"
              >
                <Shield className="w-6 h-6 text-red-500 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-gray-900 text-sm">Risk Register</p>
                <p className="text-xs text-gray-500 mt-0.5">View identified risks & mitigations</p>
              </button>

              <button
                onClick={() => navigate(`/tidp-midp/resource-plan/${midps[midps.length - 1].id}`)}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all text-left group"
              >
                <Users className="w-6 h-6 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-gray-900 text-sm">Resource Plan</p>
                <p className="text-xs text-gray-500 mt-0.5">Discipline allocation & utilization</p>
              </button>

              <button
                onClick={() => navigate(`/tidp-midp/quality-gates/${midps[midps.length - 1].id}`)}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-violet-200 transition-all text-left group"
              >
                <ShieldCheck className="w-6 h-6 text-violet-500 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-gray-900 text-sm">Quality Gates</p>
                <p className="text-xs text-gray-500 mt-0.5">Milestone criteria & approvers</p>
              </button>

              <button
                onClick={() => navigate(`/tidp-midp/dependency-matrix/${midps[midps.length - 1].id}`)}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-cyan-200 transition-all text-left group"
              >
                <GitBranch className="w-6 h-6 text-cyan-500 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-gray-900 text-sm">Dependencies</p>
                <p className="text-xs text-gray-500 mt-0.5">Cross-team dependency matrix</p>
              </button>

              <button
                onClick={() => navigate(`/tidp-midp/cascading-impact/${midps[midps.length - 1].id}`)}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-rose-200 transition-all text-left group"
              >
                <AlertTriangle className="w-6 h-6 text-rose-500 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-gray-900 text-sm">Cascading Impact</p>
                <p className="text-xs text-gray-500 mt-0.5">Late deliverable downstream analysis</p>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs and Modals */}
      <TIDPImportDialog
        open={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImportComplete={handleImportComplete}
      />

      {showEvolutionDashboard && (
        <MIDPEvolutionDashboard
          midpId={showEvolutionDashboard}
          onClose={() => setShowEvolutionDashboard(null)}
        />
      )}

      {/* MIDP Analytics Drawer */}
      <MIDPAnalyticsDrawer
        isOpen={showMIDPDrawer}
        onClose={() => setShowMIDPDrawer(false)}
        midps={midps}
        onRefreshMIDP={autoGenerateMIDP}
        onDownloadCSV={() => {
          const activeMidp = midps.length > 0 ? midps[midps.length - 1] : null;
          if (activeMidp) handleDownloadMidp(activeMidp);
        }}
      />

      <HelpModal show={showHelp} onClose={() => setShowHelp(false)} />

      {/* Compliance Results Modal */}
      {showComplianceModal && complianceResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden">
            <div className={`px-6 py-4 border-b ${complianceResult.compliant ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">ISO 19650 Compliance Check</h2>
                  <p className={`text-sm mt-0.5 ${complianceResult.compliant ? 'text-green-700' : 'text-red-700'}`}>
                    {complianceResult.message}
                  </p>
                </div>
                <button onClick={() => setShowComplianceModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[65vh] space-y-4">
              {/* Score and Summary */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-700">{complianceResult.score}%</p>
                  <p className="text-xs text-blue-600">Score</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-red-700">{complianceResult.summary.errors}</p>
                  <p className="text-xs text-red-600">Errors</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-700">{complianceResult.summary.warnings}</p>
                  <p className="text-xs text-yellow-600">Warnings</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-700">{complianceResult.summary.info}</p>
                  <p className="text-xs text-blue-600">Info</p>
                </div>
              </div>

              {/* Findings */}
              {complianceResult.findings.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700">Findings</h3>
                  {complianceResult.findings.map((finding, i) => (
                    <div key={i} className={`p-3 rounded-lg border text-sm ${
                      finding.severity === 'error' ? 'bg-red-50 border-red-200' :
                      finding.severity === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{finding.rule}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          finding.severity === 'error' ? 'bg-red-100 text-red-700' :
                          finding.severity === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>{finding.severity}</span>
                      </div>
                      <p className="text-gray-700">{finding.message}</p>
                      {finding.container && (
                        <p className="text-gray-500 text-xs mt-1">Container: {finding.container}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-green-600">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                  <p className="font-medium">All checks passed!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default TIDPMIDPDashboard;
