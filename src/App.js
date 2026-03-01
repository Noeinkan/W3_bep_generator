import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import layout and page components
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import MainLayout from './components/layout/MainLayout';
import HomePage from './components/pages/HomePage';
import ProjectsPage from './components/pages/ProjectsPage';
import BEPGeneratorWrapper from './components/pages/BEPGeneratorWrapper';
import TIDPMIDPDashboard from './components/pages/tidp-midp/TIDPMIDPDashboard';
import RiskRegisterPage from './components/pages/tidp-midp/RiskRegisterPage';
import ResourcePlanPage from './components/pages/tidp-midp/ResourcePlanPage';
import QualityGatesPage from './components/pages/tidp-midp/QualityGatesPage';
import DependencyMatrixPage from './components/pages/tidp-midp/DependencyMatrixPage';
import CascadingImpactPage from './components/pages/tidp-midp/CascadingImpactPage';
import IDRMDashboard from './components/pages/idrm-manager/IDRMDashboard';
import TidpEditorPage from './components/pages/TidpEditorPage';
import ProfilePage from './components/pages/ProfilePage';
import SettingsPage from './components/pages/SettingsPage';
import ResponsibilityMatrixManager from './components/responsibility-matrix/ResponsibilityMatrixManager';
import EirManagerPage from './components/pages/eir-manager/EirManagerPage';
import LoinTablesPage from './components/pages/loin-tables/LoinTablesPage';

// Auth components
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/pages/auth/LoginPage';
import RegisterPage from './components/pages/auth/RegisterPage';
import ForgotPasswordPage from './components/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './components/pages/auth/ResetPasswordPage';
import VerifyEmailPage from './components/pages/auth/VerifyEmailPage';
import VerificationPendingPage from './components/pages/auth/VerificationPendingPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <ProjectProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          {/* Root redirect to /home */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Public auth routes (outside MainLayout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/verification-pending" element={<VerificationPendingPage />} />

          {/* Main layout wrapper with nested routes */}
          <Route element={<MainLayout />}>
            {/* Public route */}
            <Route path="/home" element={<HomePage />} />

            {/* Protected routes */}
            <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />

            {/* BEP Generator with nested routes */}
            <Route path="/bep-generator/*" element={<ProtectedRoute><BEPGeneratorWrapper /></ProtectedRoute>} />

            {/* TIDP/MIDP Dashboard with sub-routes */}
            <Route path="/tidp-midp">
              <Route index element={<ProtectedRoute><TIDPMIDPDashboard /></ProtectedRoute>} />
              <Route path="tidps" element={<ProtectedRoute><TIDPMIDPDashboard /></ProtectedRoute>} />
              <Route path="midps" element={<ProtectedRoute><TIDPMIDPDashboard /></ProtectedRoute>} />
              <Route path="import" element={<ProtectedRoute><TIDPMIDPDashboard /></ProtectedRoute>} />
              <Route path="risk-register/:midpId" element={<ProtectedRoute><RiskRegisterPage /></ProtectedRoute>} />
              <Route path="resource-plan/:midpId" element={<ProtectedRoute><ResourcePlanPage /></ProtectedRoute>} />
              <Route path="quality-gates/:midpId" element={<ProtectedRoute><QualityGatesPage /></ProtectedRoute>} />
              <Route path="dependency-matrix/:midpId" element={<ProtectedRoute><DependencyMatrixPage /></ProtectedRoute>} />
              <Route path="cascading-impact/:midpId" element={<ProtectedRoute><CascadingImpactPage /></ProtectedRoute>} />
            </Route>

            {/* IDRM Manager with sub-routes */}
            <Route path="/idrm-manager">
              <Route index element={<ProtectedRoute><IDRMDashboard /></ProtectedRoute>} />
              <Route path="im-activities" element={<ProtectedRoute><IDRMDashboard /></ProtectedRoute>} />
              <Route path="deliverables" element={<ProtectedRoute><IDRMDashboard /></ProtectedRoute>} />
              <Route path="templates" element={<ProtectedRoute><IDRMDashboard /></ProtectedRoute>} />
            </Route>

            {/* TIDP Editor routes */}
            <Route path="/tidp-editor" element={<ProtectedRoute><TidpEditorPage /></ProtectedRoute>} />
            <Route path="/tidp-editor/:id" element={<ProtectedRoute><TidpEditorPage /></ProtectedRoute>} />

            {/* Responsibility Matrix Manager */}
            <Route path="/responsibility-matrix" element={<ProtectedRoute><ResponsibilityMatrixManager /></ProtectedRoute>} />

            {/* EIR Manager */}
            <Route path="/eir-manager" element={<ProtectedRoute><EirManagerPage /></ProtectedRoute>} />

            {/* LOIN Tables */}
            <Route path="/loin-tables" element={<ProtectedRoute><LoinTablesPage /></ProtectedRoute>} />

            {/* User Profile & Settings */}
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          </Route>

          {/* Catch-all redirect for 404 */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </ProjectProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;