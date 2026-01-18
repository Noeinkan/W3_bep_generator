# BEP Generator Refactoring Guide

## Overview

This document describes the refactoring of `BEPGeneratorWrapper` to use:
1. **React Hook Form + Zod** for form management and validation
2. **Nested Routes (React Router v6)** for better route organization
3. **Form Context** for centralized state management

## Architecture Changes

### Before (Old Implementation)
- **File**: `src/components/pages/BEPGeneratorWrapper.js`
- Monolithic component with all routing logic inline
- Manual form state management with `useState`
- Custom validation functions
- Props drilling for form data
- URL-based routing but all logic in one component

### After (New Implementation)
- **File**: `src/components/pages/BEPGeneratorWrapperNew.js`
- Modular nested routes with dedicated view components
- React Hook Form for automatic form state management
- Zod schemas for declarative validation
- Form context provider for centralized state
- Clean separation of concerns

## New File Structure

```
src/
├── components/
│   ├── pages/
│   │   ├── BEPGeneratorWrapperNew.js      # Main router component
│   │   └── bep/
│   │       ├── BepLayout.js                # Layout wrapper with header
│   │       ├── BepStartMenuView.js         # Start menu view
│   │       ├── BepSelectTypeView.js        # Type selection view
│   │       ├── BepTemplatesView.js         # Template gallery view
│   │       ├── BepDraftsView.js            # Draft manager view
│   │       ├── BepImportView.js            # Import dialog view
│   │       ├── BepFormView.js              # Main form view with sidebar
│   │       └── BepPreviewView.js           # Preview & export view
│   ├── steps/
│   │   └── FormStepRHF.js                  # Form step using React Hook Form
│   └── forms/
│       └── base/
│           └── InputFieldRHF.js            # Input field wrapper for RHF
├── contexts/
│   └── BepFormContext.js                   # Form context provider
└── schemas/
    └── bepValidationSchemas.js             # Zod validation schemas (14 steps)
```

## Key Components

### 1. BepFormContext (`src/contexts/BepFormContext.js`)

Centralized form state management using React Hook Form.

**Features:**
- Initializes `useForm` with Zod validation
- Manages form data, validation, and completed sections
- Provides session storage persistence
- Exposes form methods through context

**Usage:**
```jsx
import { useBepForm } from '../../../contexts/BepFormContext';

function MyComponent() {
  const {
    methods,           // React Hook Form methods
    errors,            // Validation errors
    validateStep,      // Validate specific step
    markStepCompleted, // Mark step as done
    updateField,       // Update field value
    loadFormData,      // Load draft/template
    getFormData,       // Get all form data
    completedSections, // Set of completed step indices
    bepType,           // Current BEP type
    currentDraft,      // Current draft info { id, name }
  } = useBepForm();
}
```

### 2. Zod Validation Schemas (`src/schemas/bepValidationSchemas.js`)

Declarative validation for all 14 steps (0-13).

**Available Schemas:**
- `projectInfoSchema` (Step 0)
- `teamStructureSchema` (Step 1)
- `bimUsesSchema` (Step 2)
- `softwareTechnologySchema` (Step 3)
- `modelDevelopmentSchema` (Step 4)
- `informationDeliverySchema` (Step 5)
- `qualityAssuranceSchema` (Step 6)
- `collaborationSchema` (Step 7)
- `informationProductionSchema` (Step 8)
- `qualityAssuranceControlSchema` (Step 9)
- `informationSecuritySchema` (Step 10)
- `trainingCompetencySchema` (Step 11)
- `coordinationRiskSchema` (Step 12)
- `appendicesSchema` (Step 13)

**Example:**
```javascript
import { z } from 'zod';

export const projectInfoSchema = z.object({
  projectName: z.string().min(3, 'Project name must be at least 3 characters'),
  projectNumber: z.string().min(1, 'This field is required'),
  // ... more fields
});
```

### 3. Nested Routes Structure

**Route Hierarchy:**
```
/bep-generator
├── /                              → Start Menu (BepStartMenuView)
├── /select-type                   → Type Selector (BepSelectTypeView)
├── /templates                     → Template Gallery (BepTemplatesView)
├── /drafts                        → Draft Manager (BepDraftsView)
├── /import                        → Import Dialog (BepImportView)
├── /:slug/step/:step              → Form Steps (BepFormView)
└── /:slug/preview                 → Preview & Export (BepPreviewView)
```

### 4. FormStepRHF Component

React Hook Form integration for form steps.

**Before:**
```jsx
<FormStep
  stepIndex={currentStep}
  formData={formData}
  updateFormData={updateFormData}
  errors={validationErrors}
  bepType={bepType}
/>
```

**After:**
```jsx
<FormStepRHF
  stepIndex={currentStep}
  bepType={bepType}
/>
```

Form data and validation are automatically handled by React Hook Form context.

## Migration Steps

### Step 1: Install Dependencies

```bash
npm install react-hook-form @hookform/resolvers zod
```

### Step 2: Update Router Configuration

In your main `App.js` or router configuration:

**Before:**
```jsx
<Route path="/bep-generator/*" element={<BEPGeneratorWrapper />} />
```

**After:**
```jsx
<Route path="/bep-generator/*" element={<BEPGeneratorWrapperNew />} />
```

### Step 3: Test All Routes

Test each route to ensure navigation works:

1. **Start Menu**: `/bep-generator`
2. **Type Selection**: `/bep-generator/select-type`
3. **Templates**: `/bep-generator/templates`
4. **Drafts**: `/bep-generator/drafts`
5. **Import**: `/bep-generator/import`
6. **Form Steps**: `/bep-generator/new-document/step/0`
7. **Preview**: `/bep-generator/new-document/preview`

### Step 4: Verify Features

- ✅ Form validation (Zod schemas)
- ✅ Session storage persistence
- ✅ Draft save/load
- ✅ Template loading
- ✅ BEP import
- ✅ Step navigation
- ✅ Preview & export
- ✅ URL state management

## Benefits

### 1. Better Separation of Concerns
- Each route has its own view component
- Form logic separated from routing logic
- Reusable form context

### 2. Improved Validation
- Declarative Zod schemas (easier to maintain)
- Automatic validation with React Hook Form
- Type-safe validation rules

### 3. Enhanced Developer Experience
- Cleaner code structure
- Easier to add new steps
- Better error messages
- Automatic form state management

### 4. Better Performance
- React Hook Form optimizes re-renders
- Form context prevents unnecessary updates
- Modular components load only when needed

### 5. Maintainability
- Easier to test individual components
- Clear file organization
- Centralized validation logic

## Backward Compatibility

The old `BEPGeneratorWrapper` component remains untouched. You can:

1. **Test the new implementation** by routing to `BEPGeneratorWrapperNew`
2. **Keep the old implementation** as fallback during transition
3. **Switch routes** when ready to fully migrate

## Form Data Structure

Both implementations use the same form data structure from `getEmptyBepData()`. This ensures:
- Drafts created with old implementation work with new one
- Templates remain compatible
- No database migration needed

## Session Storage

Session storage key remains the same (`bep-temp-state`) with identical structure:
```javascript
{
  formData: {...},
  bepType: 'pre-appointment' | 'post-appointment',
  completedSections: [0, 1, 2, ...],
  currentDraft: { id, name },
  timestamp: Date.now()
}
```

## URL Structure

URL structure remains unchanged:
- `/bep-generator/:slug/step/:step` (where slug is document name)
- Step indices: 0-13 (14 steps total)

## Troubleshooting

### Issue: Form doesn't validate
**Solution**: Check that field names in Zod schemas match field names in CONFIG

### Issue: sessionStorage not persisting
**Solution**: Verify BepFormProvider wraps all routes

### Issue: Navigation not working
**Solution**: Ensure all routes use `navigate` from `useNavigate`

### Issue: Draft doesn't load
**Solution**: Check that `loadFormData` is called with correct parameters

## Future Enhancements

Potential improvements to consider:
1. **TypeScript**: Add type safety for form data
2. **Field-level validation**: Add onChange validation for immediate feedback
3. **Optimistic updates**: Update UI before API confirms save
4. **Undo/redo**: Add form history management
5. **Auto-save**: Automatic draft saving every N seconds

## Testing Checklist

- [ ] Create new BEP (pre-appointment)
- [ ] Create new BEP (post-appointment)
- [ ] Save draft
- [ ] Load draft
- [ ] Load template
- [ ] Import BEP from JSON
- [ ] Navigate through all 14 steps
- [ ] Validate required fields
- [ ] Preview BEP
- [ ] Export as PDF
- [ ] Export as DOCX
- [ ] Export as HTML
- [ ] Session recovery after page reload
- [ ] URL navigation (back/forward)
- [ ] Direct URL access to specific step

## Contact & Support

For questions or issues with the refactoring:
1. Check this guide first
2. Review the code comments in new files
3. Compare with old implementation for reference
4. Test in isolation before full migration
