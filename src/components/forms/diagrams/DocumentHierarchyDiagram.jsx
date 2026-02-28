/**
 * Static read-only diagram: ISO 19650 information requirements hierarchy.
 * Three columns: Interested parties' information requirements (OIR, PIR) →
 * Appointment information requirements (AIR, EIR) → Information deliverables (AIM, PIM).
 * Relationship labels: contributes to, encapsulates, specifies.
 * Used by Step 1 Introduction (field type: static-diagram, diagramKey: documentHierarchy).
 */
import React from 'react';

const BOX_STYLE = 'rounded border-2 border-slate-700 bg-white px-3 py-2 text-center shadow-sm';

const DocumentHierarchyDiagram = () => (
  <div className="rounded-lg border border-ui-border bg-ui-surface p-4 overflow-x-auto min-w-0">
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-0 min-w-[560px] w-fit mx-auto">
      {/* Column 1: Interested parties' information requirements */}
      <div className="flex flex-col gap-2 bg-sky-100 rounded-l-lg p-3 border border-sky-200">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-800 text-center">
          Interested parties&apos; information requirements
        </p>
        <div className={BOX_STYLE}>
          <p className="font-semibold text-slate-900 text-sm">Organizational Information Requirements (OIR)</p>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-slate-500 text-lg" aria-hidden="true">↓</span>
          <span className="text-[10px] font-medium text-slate-600">contributes to</span>
        </div>
        <div className={BOX_STYLE}>
          <p className="font-semibold text-slate-900 text-sm">Project Information Requirements (PIR)</p>
        </div>
      </div>

      {/* Arrow 1: OIR→AIR (encapsulates), PIR→EIR (contributes to) */}
      <div className="flex flex-col justify-around items-center px-2 bg-slate-50/80 min-h-[180px]">
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] font-medium text-slate-600">encapsulates</span>
          <span className="text-slate-400 text-xl" aria-hidden="true">→</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] font-medium text-slate-600">contributes to</span>
          <span className="text-slate-400 text-xl" aria-hidden="true">→</span>
        </div>
      </div>

      {/* Column 2: Appointment information requirements */}
      <div className="flex flex-col gap-2 bg-sky-200 rounded p-3 border border-sky-300">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-900 text-center">
          Appointment information requirements
        </p>
        <div className={BOX_STYLE}>
          <p className="font-semibold text-slate-900 text-sm">Asset Information Requirements (AIR)</p>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-slate-500 text-lg" aria-hidden="true">↓</span>
          <span className="text-[10px] font-medium text-slate-600">contributes to</span>
        </div>
        <div className={BOX_STYLE}>
          <p className="font-semibold text-slate-900 text-sm">Exchange Information Requirements (EIR)</p>
        </div>
      </div>

      {/* Arrow 2: AIR→AIM (specifies), EIR→PIM (specifies) */}
      <div className="flex flex-col justify-around items-center px-2 bg-slate-50/80">
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] font-medium text-slate-600">specifies</span>
          <span className="text-slate-400 text-xl" aria-hidden="true">→</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] font-medium text-slate-600">specifies</span>
          <span className="text-slate-400 text-xl" aria-hidden="true">→</span>
        </div>
      </div>

      {/* Column 3: Information deliverables */}
      <div className="flex flex-col gap-2 bg-sky-300 rounded-r-lg p-3 border border-sky-400">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-950 text-center">
          Information deliverables
        </p>
        <div className={BOX_STYLE}>
          <p className="font-semibold text-slate-900 text-sm">Asset Information Model (AIM)</p>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-slate-500 text-lg" aria-hidden="true">↑</span>
          <span className="text-[10px] font-medium text-slate-600">contributes to</span>
        </div>
        <div className={BOX_STYLE}>
          <p className="font-semibold text-slate-900 text-sm">Project Information Model (PIM)</p>
        </div>
      </div>
    </div>

    <div className="mt-3 pt-3 border-t border-ui-border">
      <p className="text-xs font-semibold text-ui-text-muted mb-1.5">Relationships</p>
      <p className="text-[11px] text-ui-text-muted">
        OIR contributes to PIR; OIR encapsulates AIR; AIR and PIR contribute to EIR; EIR specifies PIM; AIR specifies AIM; PIM contributes to AIM.
      </p>
    </div>
  </div>
);

export default DocumentHierarchyDiagram;
