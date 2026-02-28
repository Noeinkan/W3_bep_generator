import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, ChevronLeft, ChevronRight, FolderOpen, ArrowLeftRight } from 'lucide-react';
import { useProject } from '../../contexts/ProjectContext';
import { SIDEBAR_TOGGLE } from '../../constants/sidebarUi';

const Sidebar = ({ isCollapsed, setIsCollapsed, navigation }) => {
  const { currentProject } = useProject();
  const navigate = useNavigate();

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
            <NavLink
              to="/home"
              className="flex items-center space-x-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Go to Home"
              title="Home"
            >
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 whitespace-nowrap">BEP Suite</span>
            </NavLink>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={SIDEBAR_TOGGLE.buttonExpanded}
              aria-label="Collapse sidebar"
              aria-expanded={!isCollapsed}
              title="Collapse sidebar"
            >
              <ChevronLeft className={SIDEBAR_TOGGLE.iconCollapse} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-2 w-full">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={SIDEBAR_TOGGLE.buttonCollapsed}
              aria-label="Expand sidebar"
              aria-expanded={!isCollapsed}
              title="Expand sidebar"
            >
              <ChevronRight className={SIDEBAR_TOGGLE.iconExpand} />
            </button>
          </div>
        )}
      </div>

      {/* Active Project Indicator */}
      {currentProject && (
        <div className="border-b border-gray-200">
          {!isCollapsed ? (
            <button
              onClick={() => navigate('/projects')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
              title="Switch project"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FolderOpen className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Project</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{currentProject.name}</p>
              </div>
              <ArrowLeftRight className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </button>
          ) : (
            <button
              onClick={() => navigate('/projects')}
              className="w-full flex justify-center py-3 hover:bg-gray-50 transition-colors"
              title={`Project: ${currentProject.name} — Click to switch`}
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-4 h-4 text-blue-600" />
              </div>
            </button>
          )}
        </div>
      )}

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
