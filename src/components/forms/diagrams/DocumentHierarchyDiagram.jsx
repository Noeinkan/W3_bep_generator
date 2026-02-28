/**
 * Static read-only diagram: Information Requirements Document Hierarchy
 * Renders PIR → EIR → BEP → Information Standard → IPMP → { Mobilisation Plan | Risk Register | IDP }
 * No user input. Used by Step 1 Introduction (field type: static-diagram, diagramKey: documentHierarchy).
 */
import React from 'react';

const DocumentHierarchyDiagram = () => {
  const nodes = [
    'PIR',
    'EIR',
    'BEP',
    'Information Standard',
    'IPMP'
  ];
  const branchLabels = ['Mobilisation Plan', 'Risk Register', 'Information Delivery Plan'];

  return (
    <div className="rounded-lg border border-ui-border bg-ui-surface p-4 overflow-x-auto">
      <div className="flex flex-wrap items-center gap-2 min-w-max">
        {nodes.map((label, i) => (
          <React.Fragment key={label}>
            <div className="px-3 py-2 rounded-md bg-ui-muted border border-ui-border text-sm font-medium text-ui-text whitespace-nowrap">
              {label}
            </div>
            {i < nodes.length - 1 && (
              <span className="text-ui-text-muted font-mono" aria-hidden="true">→</span>
            )}
          </React.Fragment>
        ))}
        <span className="text-ui-text-muted font-mono" aria-hidden="true">→</span>
        <div className="flex flex-col gap-1.5">
          {branchLabels.map((l) => (
            <div
              key={l}
              className="px-3 py-2 rounded-md bg-ui-muted border border-ui-border text-sm font-medium text-ui-text whitespace-nowrap"
            >
              {l}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-xs text-ui-text-muted">
        PIR = Project Information Requirements · EIR = Exchange Information Requirements · BEP = BIM Execution Plan · IPMP = Information Production Methods and Procedures
      </p>
    </div>
  );
};

export default DocumentHierarchyDiagram;
