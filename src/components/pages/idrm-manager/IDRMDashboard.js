import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Table2,
  FileText,
  ArrowLeft,
  Download,
  Users,
  CheckCircle,
  Upload,
  Plus
} from 'lucide-react';
import ApiService from '../../../services/apiService';
import Toast from '../../common/Toast';

// Sub-components
import StatisticsCards from './dashboard/StatisticsCards';
import QuickActions from './dashboard/QuickActions';
import IMActivitiesView from './dashboard/IMActivitiesView';
import DeliverablesView from './dashboard/DeliverablesView';
import TemplatesView from './dashboard/TemplatesView';
import HelpModal from './dashboard/HelpModal';

const IDRMDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Parse current view from URL
  const getCurrentView = () => {
    const path = location.pathname;
    if (path.includes('/im-activities')) return 'im-activities';
    if (path.includes('/deliverables')) return 'deliverables';
    if (path.includes('/templates')) return 'templates';
    return 'dashboard';
  };

  const [activeView, setActiveView] = useState(getCurrentView());
  const [imActivities, setImActivities] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

  // Statistics
  const [stats, setStats] = useState({
    totalIMActivities: 0,
    totalDeliverables: 0,
    totalTemplates: 0,
    activeProjects: 0
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    loadData();
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    // Update URL when view changes using React Router
    const newPath = activeView === 'dashboard' ? '/idrm-manager' : `/idrm-manager/${activeView}`;
    if (location.pathname !== newPath) {
      navigate(newPath, { replace: true });
    }
  }, [activeView, location.pathname, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [imActivitiesData, deliverablesData, templatesData] = await Promise.all([
        ApiService.getAllIMActivities(),
        ApiService.getAllDeliverables(),
        ApiService.getAllIDRMTemplates()
      ]);

      if (!mountedRef.current) return;

      const imActivitiesList = imActivitiesData.data || [];
      const deliverablesList = deliverablesData.data || [];
      const templatesList = templatesData.data || [];

      setImActivities(imActivitiesList);
      setDeliverables(deliverablesList);
      setTemplates(templatesList);

      // Calculate statistics
      const uniqueProjects = new Set([
        ...imActivitiesList.map(a => a.projectId),
        ...deliverablesList.map(d => d.projectId)
      ].filter(Boolean));

      setStats({
        totalIMActivities: imActivitiesList.length,
        totalDeliverables: deliverablesList.length,
        totalTemplates: templatesList.length,
        activeProjects: uniqueProjects.size
      });

    } catch (error) {
      if (mountedRef.current) {
        console.error('Failed to load IDRM data:', error);
        setToast({ open: true, message: 'Failed to load data', type: 'error' });
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const handleCreateIMActivity = () => {
    navigate('/idrm-manager/im-activities/new');
  };

  const handleCreateDeliverable = () => {
    navigate('/idrm-manager/deliverables/new');
  };

  const handleCreateTemplate = () => {
    navigate('/idrm-manager/templates/new');
  };

  const handleExportMatrix = async (type) => {
    setToast({ open: true, message: `Exporting ${type} matrix...`, type: 'info' });
    try {
      const result = await ApiService.exportIDRMMatrix(type);
      setToast({
        open: true,
        message: 'Matrix exported successfully!',
        type: 'success'
      });
    } catch (error) {
      setToast({
        open: true,
        message: 'Failed to export matrix',
        type: 'error'
      });
    }
  };

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Table2 },
    { id: 'im-activities', label: 'IM Activities', icon: Users },
    { id: 'deliverables', label: 'Deliverables', icon: FileText },
    { id: 'templates', label: 'Templates', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50" data-page-uri="/idrm-manager">
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
                    navigate('/home');
                  }
                }}
                className="inline-flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-md p-2 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="h-8 border-l border-gray-300"></div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">IDRM Manager</h1>
                <p className="text-gray-600 text-lg mt-1">Information Deliverables Responsibility Matrix</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowHelp(true)}
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
              >
                <FileText className="w-5 h-5 mr-3" />
                Help
              </button>

              <button
                onClick={() => handleExportMatrix('all')}
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
              >
                <Download className="w-5 h-5 mr-3" />
                Export All
              </button>

              {activeView === 'im-activities' && (
                <button
                  onClick={handleCreateIMActivity}
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-md"
                >
                  <Plus className="w-5 h-5 mr-3" />
                  New IM Activity
                </button>
              )}

              {activeView === 'deliverables' && (
                <button
                  onClick={handleCreateDeliverable}
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-md"
                >
                  <Plus className="w-5 h-5 mr-3" />
                  New Deliverable
                </button>
              )}

              {activeView === 'templates' && (
                <button
                  onClick={handleCreateTemplate}
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-md"
                >
                  <Plus className="w-5 h-5 mr-3" />
                  New Template
                </button>
              )}
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
                className={`flex-1 py-3 px-4 rounded-md font-semibold text-base flex items-center justify-center space-x-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  activeView === id
                    ? 'bg-white text-purple-700 shadow-sm border border-gray-200'
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
              onViewIMActivities={() => setActiveView('im-activities')}
              onViewDeliverables={() => setActiveView('deliverables')}
              onViewTemplates={() => setActiveView('templates')}
            />
          </div>
        )}

        {/* IM Activities View */}
        {activeView === 'im-activities' && (
          <IMActivitiesView
            activities={imActivities}
            loading={loading}
            onCreateNew={handleCreateIMActivity}
            onRefresh={loadData}
          />
        )}

        {/* Deliverables View */}
        {activeView === 'deliverables' && (
          <DeliverablesView
            deliverables={deliverables}
            loading={loading}
            onCreateNew={handleCreateDeliverable}
            onRefresh={loadData}
          />
        )}

        {/* Templates View */}
        {activeView === 'templates' && (
          <TemplatesView
            templates={templates}
            loading={loading}
            onCreateNew={handleCreateTemplate}
            onRefresh={loadData}
          />
        )}
      </div>

      {/* Help Modal */}
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

export default IDRMDashboard;
