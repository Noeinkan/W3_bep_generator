import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FileText, BarChart3, Home, Grid3x3 } from 'lucide-react';
import Sidebar from './Sidebar';
import UserDropdown from './UserDropdown';

const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Hide sidebar on home page
  const isHomePage = location.pathname === '/home';

  const navigation = [
    {
      name: 'Home',
      href: '/home',
      icon: Home
    },
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
      {/* Sidebar - Hidden on home page */}
      {!isHomePage && (
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
        className={`flex-1 transition-all duration-300 ${!isHomePage ? (isCollapsed ? 'ml-16' : 'ml-64') : ''}`}
        role="main"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;