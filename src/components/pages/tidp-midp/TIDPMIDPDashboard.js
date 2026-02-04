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
  Calendar
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
    <div className="min-h-screen bg-gray-50" data-page-uri="/tidp-midp">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => {
                  const returnUrl = sessionStorage.getItem('bep-return-url');
                  if (returnUrl) {
                    sessionStorage.removeItem('bep-return-url');
                    window.location.href = returnUrl;
                  } else {
                    navigate(-1);
                  }
                }}
                className="inline-flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-md p-2 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="h-8 border-l border-gray-300"></div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">TIDP/MIDP Manager</h1>
                <p className="text-gray-600 text-lg mt-1">Information Delivery Planning & Management</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {activeView === 'tidps' && (
                <button
                  onClick={() => setShowImportDialog(true)}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                >
                  <Upload className="w-5 h-5 mr-3" />
                  Import
                </button>
              )}

              <button
                onClick={autoGenerateMIDP}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-md"
              >
                <TrendingUp className="w-5 h-5 mr-3" />
                Auto-Generate MIDP
              </button>

              <button
                onClick={() => setShowHelp(true)}
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
              >
                <FileText className="w-5 h-5 mr-3" />
                Help
              </button>

              <button
                onClick={handleComplianceCheck}
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
              >
                <CheckCircle className="w-5 h-5 mr-3" />
                Compliance Check
              </button>

              <button
                onClick={handleGenerateReport}
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
              >
                <Download className="w-5 h-5 mr-3" />
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-10">
          <nav className="flex space-x-1 bg-gray-100 p-2 rounded-lg">
            {navigationItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveView(id)}
                className={`flex-1 py-3 px-4 rounded-md font-semibold text-base flex items-center justify-center space-x-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  activeView === id
                    ? 'bg-white text-blue-700 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
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
