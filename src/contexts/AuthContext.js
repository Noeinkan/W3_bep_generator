import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { runDraftMigrationOnAppLoad } from '../utils/draftMigration';

// TEMPORARY: set to false to re-enable login/auth
const AUTH_DISABLED = true;
const MOCK_USER = { id: 1, email: 'dev@local.test', name: 'Dev User' };

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (AUTH_DISABLED) {
        setUser(MOCK_USER);
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          return;
        }

        // Verify token with backend
        const response = await apiService.getCurrentUser();
        if (response.user) {
          setUser(response.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Token is invalid or expired
        localStorage.removeItem('authToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const runMigration = async () => {
      if (!user?.id) return;
      const migration = await runDraftMigrationOnAppLoad(user.id);

      if (migration?.migrated) {
        console.log(
          `Draft migration complete: ${migration?.meta?.migratedCount || 0} migrated, ` +
          `${migration?.meta?.skippedCount || 0} skipped, ${migration?.meta?.failedCount || 0} failed.`
        );
      }
    };

    runMigration();
  }, [user?.id]);

  const register = async (userData) => {
    try {
      const { email, password, name } = userData;
      const response = await apiService.register(email, password, name);

      // Server no longer returns a token — verification required
      return { success: true, verificationRequired: true, email };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (credentials) => {
    try {
      const { email, password } = credentials;
      const response = await apiService.login(email, password);

      if (response.user) {
        setUser(response.user);
      }

      return { success: true, user: response.user };
    } catch (error) {
      // Surface "Email not verified" distinctly so LoginPage can react
      const msg = error.message || '';
      return { success: false, error: msg, emailNotVerified: msg === 'Email not verified', email: credentials.email };
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await apiService.forgotPassword(email);
      return {
        success: true,
        message: response.message,
        resetUrl: response.resetUrl,
        emailDebug: response.emailDebug
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const response = await apiService.resetPassword(token, password);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};