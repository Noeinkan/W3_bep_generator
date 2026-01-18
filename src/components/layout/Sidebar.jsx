import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed, navigation }) => {
  return (
    <aside
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out fixed left-0 top-0 h-screen z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo Section with Toggle Button */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!isCollapsed ? (
          <>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 whitespace-nowrap">BEP Suite</span>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
              aria-label="Collapse sidebar"
              aria-expanded={!isCollapsed}
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-2 w-full">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
              aria-label="Expand sidebar"
              aria-expanded={!isCollapsed}
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4" aria-label="Main navigation">
        <div className="space-y-1 px-2">
          {navigation.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
                title={isCollapsed ? item.name : undefined}
                aria-label={item.name}
              >
                <IconComponent className={`flex-shrink-0 ${isCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'} ${({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
              </NavLink>
            );
          })}
        </div>
      </nav>

    </aside>
  );
};

export default Sidebar;
