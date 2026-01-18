import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const UserDropdown = ({ isCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user?.name) return 'NC';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (isCollapsed) {
    return (
      <div className="border-t border-gray-200 p-2 relative" ref={userMenuRef}>
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="User menu"
          aria-haspopup="true"
          aria-expanded={showUserMenu}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">{getUserInitials()}</span>
          </div>
        </button>

        {/* Dropdown menu - positioned to the right and above */}
        {showUserMenu && (
          <div className="absolute bottom-full left-full ml-2 mb-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1" role="menu">
              {/* User info header */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Nome Cognome'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'nome.cognome@libero.it'}</p>
              </div>

              {/* Menu items */}
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/profile');
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors"
                role="menuitem"
              >
                <User className="w-4 h-4 mr-3 text-gray-400" />
                Your Profile
              </button>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/settings');
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors"
                role="menuitem"
              >
                <Settings className="w-4 h-4 mr-3 text-gray-400" />
                Settings
              </button>

              <div className="border-t border-gray-100"></div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                role="menuitem"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 p-3 relative" ref={userMenuRef}>
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="w-full flex items-center space-x-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
        aria-label="User menu"
        aria-haspopup="true"
        aria-expanded={showUserMenu}
      >
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-medium text-white">{getUserInitials()}</span>
        </div>
        <div className="flex-1 text-left min-w-0">
          <div className="text-sm font-medium text-gray-700 truncate">{user?.name || 'Nome Cognome'}</div>
          <div className="text-xs text-gray-500 truncate">{user?.email || 'nome.cognome@libero.it'}</div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${showUserMenu ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown menu - positioned above the button */}
      {showUserMenu && (
        <div className="absolute bottom-full left-3 right-3 mb-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu">
            {/* Menu items */}
            <button
              onClick={() => {
                setShowUserMenu(false);
                navigate('/profile');
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors"
              role="menuitem"
            >
              <User className="w-4 h-4 mr-3 text-gray-400" />
              Your Profile
            </button>

            <button
              onClick={() => {
                setShowUserMenu(false);
                navigate('/settings');
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors"
              role="menuitem"
            >
              <Settings className="w-4 h-4 mr-3 text-gray-400" />
              Settings
            </button>

            <div className="border-t border-gray-100"></div>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
              role="menuitem"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
