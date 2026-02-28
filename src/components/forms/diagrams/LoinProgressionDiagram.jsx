/**
 * Static read-only diagram: LOIN progression by project stage.
 * Shows typical Level of Information Need progression from concept through as-built.
 * Used by Step 5 Level of Information Need (field type: static-diagram, diagramKey: loinProgression).
 */
import React from 'react';

const BOX = 'rounded border border-slate-600 bg-white px-2.5 py-1.5 text-center text-sm font-medium text-slate-800 shadow-sm';

const LoinProgressionDiagram = () => (
  <div className="rounded-lg border border-ui-border bg-ui-surface p-4 overflow-x-auto min-w-0">
    <p className="text-[10px] font-semibold uppercase tracking-wide text-ui-text-muted mb-3 text-center">
      Typical LOIN / LOD progression by project stage
    </p>
    <div className="flex flex-wrap items-stretch justify-center gap-2 min-w-[320px]">
      <div className="flex flex-col rounded-lg border border-amber-200 bg-amber-50/80 p-2 min-w-[72px]">
        <span className="text-[10px] font-semibold text-amber-800 uppercase">Concept</span>
        <div className={BOX}>LOD 200</div>
        <span className="text-[10px] text-amber-700 mt-1">Approximate</span>
      </div>
      <span className="flex items-center text-slate-400 text-lg" aria-hidden="true">→</span>
      <div className="flex flex-col rounded-lg border border-blue-200 bg-blue-50/80 p-2 min-w-[72px]">
        <span className="text-[10px] font-semibold text-blue-800 uppercase">Design</span>
        <div className={BOX}>LOD 300</div>
        <span className="text-[10px] text-blue-700 mt-1">Defined</span>
      </div>
      <span className="flex items-center text-slate-400 text-lg" aria-hidden="true">→</span>
      <div className="flex flex-col rounded-lg border border-indigo-200 bg-indigo-50/80 p-2 min-w-[72px]">
        <span className="text-[10px] font-semibold text-indigo-800 uppercase">Coordination</span>
        <div className={BOX}>LOD 350</div>
        <span className="text-[10px] text-indigo-700 mt-1">Coordinated</span>
      </div>
      <span className="flex items-center text-slate-400 text-lg" aria-hidden="true">→</span>
      <div className="flex flex-col rounded-lg border border-emerald-200 bg-emerald-50/80 p-2 min-w-[72px]">
        <span className="text-[10px] font-semibold text-emerald-800 uppercase">Construction</span>
        <div className={BOX}>LOD 400</div>
        <span className="text-[10px] text-emerald-700 mt-1">Fabrication</span>
      </div>
      <span className="flex items-center text-slate-400 text-lg" aria-hidden="true">→</span>
      <div className="flex flex-col rounded-lg border border-slate-200 bg-slate-50/80 p-2 min-w-[72px]">
        <span className="text-[10px] font-semibold text-slate-700 uppercase">As-built</span>
        <div className={BOX}>LOD 500</div>
        <span className="text-[10px] text-slate-600 mt-1">Verified</span>
      </div>
    </div>
    <p className="mt-3 text-xs text-ui-text-muted border-t border-ui-border pt-3">
      Specify exact requirements per element and stage in the Level of Information Need Matrix table above.
    </p>
  </div>
);

export default LoinProgressionDiagram;
