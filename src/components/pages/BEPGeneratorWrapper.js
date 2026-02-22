import { Routes, Route, Navigate } from 'react-router-dom';
import { BepFormProvider } from '../../contexts/BepFormContext';
import { EirProvider } from '../../contexts/EirContext';
import BepLayout from './bep/BepLayout';
import BepStartMenuView from './bep/BepStartMenuView';
import BepSelectTypeView from './bep/BepSelectTypeView';
import BepInfoRequirementsView from './bep/BepInfoRequirementsView';
import BepStructureMapView from './bep/BepStructureMapView';
import BepTemplatesView from './bep/BepTemplatesView';
import BepDraftsView from './bep/BepDraftsView';
import BepImportView from './bep/BepImportView';
import BepFormView from './bep/BepFormView';
import BepPreviewView from './bep/BepPreviewView';
import { useAuth } from '../../contexts/AuthContext';

/**
 * BEP Generator Wrapper using nested routes and React Hook Form
 *
 * Route structure:
 * - /bep-generator                           -> Start menu
 * - /bep-generator/select-type               -> Type selector
 * - /bep-generator/structure-map             -> Structure map preview
 * - /bep-generator/info-requirements         -> EIR/AIR/PIR/OIR choice
 * - /bep-generator/templates                 -> Template gallery
 * - /bep-generator/drafts                    -> Draft manager
 * - /bep-generator/import                    -> Import BEP
 * - /bep-generator/:slug/step/:step          -> Form steps
 * - /bep-generator/:slug/preview             -> Preview & export
 */
const BEPGeneratorWrapper = () => {
  const { user, loading: authLoading } = useAuth();

  return (
    <EirProvider>
    <BepFormProvider>
      <Routes>
        {/* Layout wrapper for all BEP routes */}
        <Route element={<BepLayout />}>
          {/* Start menu - root route */}
          <Route index element={
            authLoading ? (
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading...</p>
                </div>
              </div>
            ) : (
              <BepStartMenuView user={user} />
            )
          } />

          {/* Type selection */}
          <Route path="select-type" element={<BepSelectTypeView />} />
          <Route path="structure-map" element={<BepStructureMapView />} />
          <Route path="info-requirements" element={<BepInfoRequirementsView />} />

          {/* Template gallery */}
          <Route path="templates" element={<BepTemplatesView />} />

          {/* Draft manager */}
          <Route path="drafts" element={<BepDraftsView />} />

          {/* Import BEP */}
          <Route path="import" element={<BepImportView />} />
        </Route>

        {/* Form routes (no layout wrapper - custom layout in BepFormView) */}
        <Route path=":slug/step/:step" element={<BepFormView />} />
        <Route path=":slug/preview" element={<BepPreviewView />} />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/bep-generator" replace />} />
      </Routes>
    </BepFormProvider>
    </EirProvider>
  );
};

export default BEPGeneratorWrapper;
