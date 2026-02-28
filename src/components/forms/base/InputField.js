/**
 * InputField — Unified field renderer.
 *
 * Resolves the field type via FieldTypeRegistry and renders the
 * appropriate component wrapped in Suspense.  Only text, select,
 * textarea, section-header, info-banner, and static-diagram are handled
 * inline; everything else delegates to the registry's lazy-loaded component.
 */

import React, { Suspense } from 'react';
import CONFIG from '../../../config/bepConfig';
import { getFieldType } from '../../form-builder/FieldTypeRegistry';
import FieldHeader from './FieldHeader';
import FieldError from './FieldError';
import BaseTextInput from './BaseTextInput';
import SearchableSelect from './SearchableSelect';

// Lazy-loaded static diagram components (display-only, keyed by diagramKey)
const DocumentHierarchyDiagram = React.lazy(() => import('../diagrams/DocumentHierarchyDiagram'));
const PartyInterfaceDiagram = React.lazy(() => import('../diagrams/PartyInterfaceDiagram'));
const LoinProgressionDiagram = React.lazy(() => import('../diagrams/LoinProgressionDiagram'));

const DIAGRAM_COMPONENTS = {
  documentHierarchy: DocumentHierarchyDiagram,
  partyInterface: PartyInterfaceDiagram,
  loinProgression: LoinProgressionDiagram
};

// Shared loading fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
    <span className="ml-2 text-gray-500">Loading…</span>
  </div>
);

// Types that need a data-* wrapper div for diagram components
const DIAGRAM_WRAPPER_TYPES = new Set([
  'orgchart', 'fileStructure', 'cdeDiagram', 'mindmap',
  'naming-conventions', 'federation-strategy',
]);

const InputField = React.memo(({ field, value, onChange, error, formData = {} }) => {
  const { name, label, number, type, required, rows, placeholder, options: fieldOptions } = field;

  const baseClasses = 'w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  // ── Inline types (no lazy component needed) ────────────────

  if (type === 'section-header') {
    return (
      <FieldHeader
        fieldName={name}
        label={label}
        number={number}
        required={required}
        asSectionHeader
      />
    );
  }

  if (type === 'info-banner') {
    return (
      <div className="rounded-lg border border-ui-primary/30 bg-ui-primary/5 p-4 text-ui-text">
        {label && <p className="text-sm font-medium text-ui-text">{label}</p>}
      </div>
    );
  }

  if (type === 'static-diagram') {
    const diagramKey = field.diagramKey || 'documentHierarchy';
    const DiagramComponent = DIAGRAM_COMPONENTS[diagramKey];
    if (!DiagramComponent) return null;
    return (
      <div>
        {label && (
          <FieldHeader fieldName={field.name || `diagram-${diagramKey}`} label={label} number={number} required={false} />
        )}
        <Suspense fallback={<LoadingSpinner />}>
          <DiagramComponent />
        </Suspense>
      </div>
    );
  }

  if (type === 'text' || type === 'email' || type === 'number' || type === 'password') {
    return (
      <div>
        <FieldHeader fieldName={name} label={label} number={number} required={required} htmlFor={name} />
        <BaseTextInput
          id={name}
          aria-required={required}
          type={type}
          value={value || ''}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        />
        <FieldError error={error} />
      </div>
    );
  }

  if (type === 'select') {
    const optionsList = Array.isArray(fieldOptions)
      ? fieldOptions
      : (fieldOptions ? CONFIG.options[fieldOptions] : null);
    return (
      <div>
        <FieldHeader fieldName={name} label={label} number={number} required={required} htmlFor={name} />
        <SearchableSelect
          id={name}
          name={name}
          value={value || ''}
          onChange={onChange}
          options={optionsList || []}
          placeholder={`Select ${label.toLowerCase()}`}
        />
        <FieldError error={error} />
      </div>
    );
  }

  if (type === 'textarea') {
    // TipTapEditor is loaded from the registry but needs special props
    const typeDef = getFieldType(type);
    const TipTapEditor = typeDef?.component;
    if (!TipTapEditor) return null;

    return (
      <div>
        <FieldHeader fieldName={name} label={label} number={number} required={required} htmlFor={name} />
        <Suspense fallback={<LoadingSpinner />}>
          <TipTapEditor
            id={name}
            aria-required={required}
            value={value || ''}
            onChange={(newValue) => onChange(name, newValue)}
            className=""
            placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
            minHeight={`${(rows || 3) * 24}px`}
            autoSaveKey={`tiptap-${name}`}
            fieldName={name}
          />
        </Suspense>
        <FieldError error={error} />
      </div>
    );
  }

  // ── Registry-driven component rendering ────────────────────

  const typeDef = getFieldType(type);

  if (!typeDef || !typeDef.component) {
    // Unknown type — fall back to plain text input
    return (
      <div>
        <FieldHeader fieldName={name} label={label} number={number} required={required} htmlFor={name} />
        <BaseTextInput
          id={name}
          aria-required={required}
          type="text"
          value={value || ''}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        />
        <FieldError error={error} />
      </div>
    );
  }

  const Component = typeDef.component;

  // Special handling: orgchart syncs related fields
  if (type === 'orgchart') {
    return (
      <div data-field-name={name} data-component-type="orgchart">
        <Suspense fallback={<LoadingSpinner />}>
          <Component
            field={field}
            value={value}
            onChange={(v) => {
              if (v && typeof v === 'object') {
                const treeData = v.tree || v;
                onChange(name, treeData);
                if (v.leadAppointedParty !== undefined) onChange('leadAppointedParty', v.leadAppointedParty);
                if (v.finalizedParties !== undefined) onChange('finalizedParties', v.finalizedParties);
              } else {
                onChange(name, v);
              }
            }}
            formData={formData}
          />
        </Suspense>
      </div>
    );
  }

  // Special handling: orgstructure-data-table is read-only
  if (type === 'orgstructure-data-table') {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Component field={field} value={value} formData={formData} />
      </Suspense>
    );
  }

  // Diagram wrapper types get a data-* div
  if (DIAGRAM_WRAPPER_TYPES.has(type)) {
    return (
      <div data-field-name={name} data-component-type={type}>
        <Suspense fallback={<LoadingSpinner />}>
          <Component field={field} value={value} onChange={onChange} error={error} />
        </Suspense>
      </div>
    );
  }

  // Standard component rendering
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Component field={field} value={value} onChange={onChange} error={error} formData={formData} />
    </Suspense>
  );
});

InputField.displayName = 'InputField';

export default InputField;