import { useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { FileText, BarChart3, Grid3x3, FileSearch, Layers, Building2, FolderInput, Package, FileUp, ClipboardList } from 'lucide-react';
import Sidebar from './Sidebar';
import UserDropdown from './UserDropdown';
import { useProject } from '../../contexts/ProjectContext';
import { usePartyRole, PARTY_ROLE } from '../../contexts/PartyRoleContext';

const UNGUARDED_PATHS = ['/home', '/projects', '/profile', '/settings', '/role-choice'];

/** Routes that require a party role to be set (otherwise redirect to role-choice) */
const WORK_ROUTE_PREFIXES = [
  '/bep-generator',
  '/eir-manager',
  '/oir-manager',
  '/tidp-midp',
  '/responsibility-matrix',
  '/ifc-import',
  '/loin-tables',
  '/capability-assessment',
  '/idrm-manager',
  '/tidp-editor'
];

/** LAP-only: Appointing Party cannot access these */
const LAP_ONLY_PREFIXES = [
  '/bep-generator',
  '/tidp-midp',
  '/responsibility-matrix',
  '/ifc-import',
  '/loin-tables',
  '/capability-assessment',
  '/idrm-manager',
  '/tidp-editor'
];

const isWorkRoute = (pathname) =>
  WORK_ROUTE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));

const isLapOnlyRoute = (pathname) =>
  LAP_ONLY_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));

const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { currentProject, loading } = useProject();
  const { partyRole } = usePartyRole();

  const isChromelessPage =
    location.pathname === '/home' ||
    location.pathname === '/projects' ||
    location.pathname === '/role-choice';

  const isGuarded = !UNGUARDED_PATHS.some((p) => location.pathname.startsWith(p));
  if (!loading && !currentProject && isGuarded) {
    return <Navigate to="/projects" replace />;
  }

  // Work routes require a role; missing role → role-choice
  if (isWorkRoute(location.pathname) && !partyRole) {
    return <Navigate to="/role-choice" replace />;
  }

  // Appointing Party cannot access LAP-only routes
  if (partyRole === PARTY_ROLE.APPOINTING_PARTY && isLapOnlyRoute(location.pathname)) {
    return <Navigate to="/eir-manager" replace />;
  }

  const navigation =
    partyRole === PARTY_ROLE.APPOINTING_PARTY
      ? [
          { name: 'EIR Manager', href: '/eir-manager', icon: FileSearch },
          { name: 'OIR Manager', href: '/oir-manager', icon: Building2 },
          { name: 'PIR (coming soon)', href: '#', icon: FolderInput, disabled: true },
          { name: 'AIR (coming soon)', href: '#', icon: Package, disabled: true }
        ]
      : [
          { name: 'BEP Manager', href: '/bep-generator', icon: FileText },
          { name: 'TIDP/MIDP Manager', href: '/tidp-midp', icon: BarChart3 },
          { name: 'Responsibility Matrix', href: '/responsibility-matrix', icon: Grid3x3 },
          { name: 'IFC Import', href: '/ifc-import', icon: FileUp },
          { name: 'EIR Manager', href: '/eir-manager', icon: FileSearch },
          { name: 'LOIN Tables', href: '/loin-tables', icon: Layers },
          { name: 'Capability Assessment', href: '/capability-assessment', icon: ClipboardList }
        ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {!isChromelessPage && (
        <>
          <Sidebar
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            navigation={navigation}
          />

          <div
            className={`fixed bottom-0 left-0 bg-white border-r border-gray-200 transition-all duration-300 z-40 ${isCollapsed ? 'w-16' : 'w-64'}`}
          >
            <UserDropdown isCollapsed={isCollapsed} />
          </div>
        </>
      )}

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
