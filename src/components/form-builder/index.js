/**
 * Form Builder Module
 *
 * Exports all components, hooks, and utilities for the dynamic form builder.
 */

// Context and Provider
export { FormBuilderProvider, useFormBuilder } from './FormBuilderContext';
export { default as FormBuilderContext } from './FormBuilderContext';

// Hooks
export { useBepStructure } from './useBepStructure';

// Components
export { default as DynamicFieldRenderer } from './DynamicFieldRenderer';
export { default as DynamicFormStepRHF } from './DynamicFormStepRHF';
export { default as DynamicProgressSidebar } from './DynamicProgressSidebar';
export { default as BepStructureMap } from './BepStructureMap';

// Step Editor Components
export {
  StepCard,
  StepListDraggable,
  StepEditorModal,
  StepStructureEditor
} from './step-editor';

// Field Editor Components
export {
  FieldCard,
  FieldListDraggable,
  FieldEditorModal,
  FieldTypeSelector,
  FieldStructureEditor
} from './field-editor';

// Field Type Registry
export {
  FIELD_TYPE_REGISTRY,
  FIELD_CATEGORIES,
  getFieldType,
  getFieldTypesByCategory,
  getAllFieldTypes,
  isValidFieldType,
  getFullWidthFieldTypes,
  getFormFieldTypes
} from './FieldTypeRegistry';
