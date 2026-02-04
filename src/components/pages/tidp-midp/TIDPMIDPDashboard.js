import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Upload,
  TrendingUp,
  ArrowLeft,
  FileText,
  CheckCircle,
  Download,
  BarChart3,
  Users,
  Calendar,
  Layers
} from 'lucide-react';
import ApiService from '../../../services/apiService';
import Toast from '../../common/Toast';
import TIDPImportDialog from '../../tidp/TIDPImportDialog';
import MIDPEvolutionDashboard from '../../midp/MIDPEvolutionDashboard';
import { useTIDPFilters } from '../../../hooks/useTIDPFilters';
import { exportTidpCsvTemplate, exportTidpToCSV, exportMidpToCSV } from '../../../utils/tidpExport';
import { checkMIDPCompliance, generateComplianceReport } from '../../../utils/complianceCheck';

// Sub-components
import StatisticsCards from './dashboard/StatisticsCards';
import QuickActions from './dashboard/QuickActions';
import RecentTIDPs from './dashboard/RecentTIDPs';
import TIDPsView from './dashboard/TIDPsView';
import MIDPsView from './dashboard/MIDPsView';
import ImportView from './dashboard/ImportView';
import HelpModal from './dashboard/HelpModal';

const TIDPMIDPDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Parse current view from URL
  const getCurrentView = () => {
    const path = location.pathname;
    if (path.includes('/tidps')) return 'tidps';
    if (path.includes('/midps')) return 'midps';
    if (path.includes('/import')) return 'import';
    return 'dashboard';
  };

  const [activeView, setActiveView] = useState(getCurrentView());
  const [tidps, setTidps] = useState([]);
  const [midps, setMidps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showEvolutionDashboard, setShowEvolutionDashboard] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  // Use custom hook for TIDP filtering
  const {
    searchTerm,
    setSearchTerm,
    filterDiscipline,
    setFilterDiscipline,
    disciplines
  } = useTIDPFilters(tidps);

  // Toast state
  const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

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
  }, []);

  useEffect(() => {
    // Update URL when view changes using React Router
    const newPath = activeView === 'dashboard' ? '/tidp-midp' : `/tidp-midp/${activeView}`;
    if (location.pathname !== newPath) {
      navigate(newPath, { replace: true });
    }
  }, [activeView, location.pathname, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tidpData, midpData] = await Promise.all([
        ApiService.getAllTIDPs(),
        ApiService.getAllMIDPs()
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
        setToast({ open: true, message: 'Failed to load data', type: 'error' });
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const handleExportTidpCsvTemplate = () => {
    const result = exportTidpCsvTemplate();
    setToast({
      open: true,
      message: result.success ? 'TIDP CSV template downloaded successfully!' : 'Failed to download CSV template',
      type: result.success ? 'success' : 'error'
    });
  };

  const handleImportComplete = async (importResults) => {
    setToast({
      open: true,
      message: `Imported ${importResults.successful.length} TIDPs successfully`,
      type: 'success'
    });
    setShowImportDialog(false);
    await loadData();
  };

  const handleViewTidpDetails = (tidpId) => {
    try {
      // fetch tidp to build a readable slug if available
      const ApiService = require('../../../services/apiService').default || require('../../../services/apiService');
      ApiService.getTIDP(tidpId).then((resp) => {
        const t = resp && resp.data ? resp.data : resp;
        const slugify = require('../../../utils/slugify').default || require('../../../utils/slugify');
  const slug = slugify(t?.taskTeam || t?.name || t?.title || 'tidp');
  navigate(`/tidp-editor/${tidpId}${slug ? '--' + slug : ''}`);
      }).catch(() => {
  navigate(`/tidp-editor/${tidpId}`);
      });
    } catch (e) {
      navigate(`/tidp-editor/${tidpId}`);
    }
  };

  const handleDownloadTidp = async (tidp) => {
    const result = exportTidpToCSV(tidp);
    setToast({
      open: true,
      message: result.success ? 'TIDP downloaded successfully!' : 'Failed to download TIDP',
      type: result.success ? 'success' : 'error'
    });
  };

  const handleViewMidpDetails = (midpId) => {
    setShowEvolutionDashboard(midpId);
  };

  const handleDownloadMidp = async (midp) => {
    setToast({ open: true, message: 'Downloading MIDP report...', type: 'info' });
    const result = exportMidpToCSV(midp);
    setToast({
      open: true,
      message: result.success ? 'MIDP report downloaded successfully!' : 'Failed to download MIDP report',
      type: result.success ? 'success' : 'error'
    });
  };

  const autoGenerateMIDP = async () => {
    setLoading(true);
    try {
      await ApiService.autoGenerateMIDPAll({
        projectName: `Auto-generated MIDP ${new Date().toLocaleDateString()}`,
        description: 'Master Information Delivery Plan compiled from all TIDPs'
      });

      setToast({ open: true, message: 'MIDP auto-generated successfully', type: 'success' });
      await loadData();
    } catch (err) {
      console.error('Auto-generate MIDP failed', err);
      setToast({ open: true, message: err.message || 'Failed to auto-generate MIDP', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleComplianceCheck = async () => {
    const result = checkMIDPCompliance(midps);
    setToast({
      open: true,
      message: result.message,
      type: result.compliant ? 'success' : 'warning'
    });
  };

  const handleGenerateReport = async () => {
    const result = await generateComplianceReport(midps);
    setToast({
      open: true,
      message: result.success ? 'Report generated successfully' : 'Failed to generate report',
      type: result.success ? 'success' : 'error'
    });
  };

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'tidps', label: 'TIDPs', icon: Users },
    { id: 'midps', label: 'MIDPs', icon: Calendar },
    { id: 'import', label: 'Import', icon: Upload }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" data-page-uri="/tidp-midp">
      {/* Header - BEP-aligned styling */}
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
            {activeView === 'tidps' && (
              <button
                onClick={() => setShowImportDialog(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-300 transition-all duration-200"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </button>
            )}

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

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation Tabs - BEP card style */}
        <div className="mb-8">
          <nav className="flex space-x-2 bg-white/60 backdrop-blur-sm p-1.5 rounded-xl border border-slate-200/50 shadow-sm">
            {navigationItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveView(id)}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center space-x-2 transition-all duration-200 ${
                  activeView === id
                    ? 'bg-white text-blue-600 shadow-md border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div className="space-y-8">
            <StatisticsCards stats={stats} loading={loading} />
            <QuickActions
              onViewTIDPs={() => setActiveView('tidps')}
              onViewMIDPs={() => setActiveView('midps')}
              // On the dashboard the Import Data quick action should take the user
              // to the Manage TIDPs page where the Import button is available.
              onImport={() => setActiveView('tidps')}
              showImport={false}
            />
            <RecentTIDPs
              tidps={tidps}
              onCreateNew={() => setActiveView('tidps')}
            />
          </div>
        )}

        {/* TIDPs View */}
        {activeView === 'tidps' && (
          <TIDPsView
            tidps={tidps}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterDiscipline={filterDiscipline}
            onFilterChange={setFilterDiscipline}
            disciplines={disciplines}
            onCreateNew={() => navigate('/tidp-editor')}
            onDownloadTemplate={handleExportTidpCsvTemplate}
            onViewDetails={handleViewTidpDetails}
            onDownloadTidp={handleDownloadTidp}
          />
        )}

        {/* MIDPs View */}
        {activeView === 'midps' && (
          <MIDPsView
            midps={midps}
            loading={loading}
            searchTerm={searchTerm}
            onAutoGenerate={autoGenerateMIDP}
            onViewDetails={handleViewMidpDetails}
            onViewEvolution={setShowEvolutionDashboard}
            onDownloadMidp={handleDownloadMidp}
          />
        )}

        {/* Import View */}
        {activeView === 'import' && (
          <ImportView onImport={() => setShowImportDialog(true)} />
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

      <HelpModal show={showHelp} onClose={() => setShowHelp(false)} />

      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </div>
  );
};

export default TIDPMIDPDashboard;
