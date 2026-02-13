import { useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { FileText, BarChart3, Grid3x3 } from 'lucide-react';
import Sidebar from './Sidebar';
import UserDropdown from './UserDropdown';
import { useProject } from '../../contexts/ProjectContext';

const UNGUARDED_PATHS = ['/home', '/projects', '/profile', '/settings'];

const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { currentProject, loading } = useProject();

  // Hide sidebar on home page and projects page
  const isChromelessPage = location.pathname === '/home' || location.pathname === '/projects';

  // Redirect to /projects if no active project on guarded routes
  const isGuarded = !UNGUARDED_PATHS.some(p => location.pathname.startsWith(p));
  if (!loading && !currentProject && isGuarded) {
    return <Navigate to="/projects" replace />;
  }

  const navigation = [
    {
      name: 'BEP Generator',
      href: '/bep-generator',
      icon: FileText
    },
    {
      name: 'TIDP/MIDP Manager',
      href: '/tidp-midp',
      icon: BarChart3
    },
    {
      name: 'Responsibility Matrix',
      href: '/responsibility-matrix',
      icon: Grid3x3
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Hidden on chromeless pages */}
      {!isChromelessPage && (
        <>
          <Sidebar
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            navigation={navigation}
          />

          {/* User Dropdown in Sidebar */}
          <div className={`fixed bottom-0 left-0 bg-white border-r border-gray-200 transition-all duration-300 z-40 ${isCollapsed ? 'w-16' : 'w-64'}`}>
            <UserDropdown isCollapsed={isCollapsed} />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <main
        className={`flex-1 transition-all duration-300 ${!isChromelessPage ? (isCollapsed ? 'ml-16' : 'ml-64') : ''}`}
        role="main"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
