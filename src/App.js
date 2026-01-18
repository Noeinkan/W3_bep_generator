import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import layout and page components
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/layout/MainLayout';
import HomePage from './components/pages/HomePage';
import BEPGeneratorWrapper from './components/pages/BEPGeneratorWrapper';
import TIDPMIDPDashboard from './components/pages/tidp-midp/TIDPMIDPDashboard';
import IDRMDashboard from './components/pages/idrm-manager/IDRMDashboard';
import TidpEditorPage from './components/pages/TidpEditorPage';
import ProfilePage from './components/pages/ProfilePage';
import SettingsPage from './components/pages/SettingsPage';
import ResponsibilityMatrixManager from './components/responsibility-matrix/ResponsibilityMatrixManager';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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

          {/* Main layout wrapper with nested routes */}
          <Route element={<MainLayout />}>
            <Route path="/home" element={<HomePage />} />

            {/* BEP Generator with nested routes */}
            <Route path="/bep-generator/*" element={<BEPGeneratorWrapper />} />

            {/* TIDP/MIDP Dashboard with sub-routes */}
            <Route path="/tidp-midp">
              <Route index element={<TIDPMIDPDashboard />} />
              <Route path="tidps" element={<TIDPMIDPDashboard />} />
              <Route path="midps" element={<TIDPMIDPDashboard />} />
              <Route path="import" element={<TIDPMIDPDashboard />} />
            </Route>

            {/* IDRM Manager with sub-routes */}
            <Route path="/idrm-manager">
              <Route index element={<IDRMDashboard />} />
              <Route path="im-activities" element={<IDRMDashboard />} />
              <Route path="deliverables" element={<IDRMDashboard />} />
              <Route path="templates" element={<IDRMDashboard />} />
            </Route>

            {/* TIDP Editor routes */}
            <Route path="/tidp-editor" element={<TidpEditorPage />} />
            <Route path="/tidp-editor/:id" element={<TidpEditorPage />} />

            {/* Responsibility Matrix Manager */}
            <Route path="/responsibility-matrix" element={<ResponsibilityMatrixManager />} />

            {/* User Profile & Settings */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all redirect for 404 */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;