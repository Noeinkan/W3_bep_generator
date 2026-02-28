/**
 * Static read-only diagram: ISO 19650-2 party interfaces
 * Appointing Party ↔ Lead Appointed Party ↔ Task Teams, with IPDT spanning all.
 * No user input. Used by Step 1 Introduction (field type: static-diagram, diagramKey: partyInterface).
 */
import React from 'react';

const PartyInterfaceDiagram = () => {
  return (
    <div className="rounded-lg border border-ui-border bg-ui-surface p-4 overflow-x-auto">
      <div className="flex flex-wrap items-center justify-center gap-3 min-w-max">
        <div className="px-4 py-2.5 rounded-md bg-ui-muted border border-ui-border text-sm font-medium text-ui-text text-center whitespace-nowrap">
          Appointing Party
        </div>
        <span className="text-ui-text-muted font-mono" aria-hidden="true">↔</span>
        <div className="px-4 py-2.5 rounded-md bg-ui-muted border border-ui-border text-sm font-medium text-ui-text text-center whitespace-nowrap">
          Lead Appointed Party (LAP)
        </div>
        <span className="text-ui-text-muted font-mono" aria-hidden="true">↔</span>
        <div className="px-4 py-2.5 rounded-md bg-ui-muted border border-ui-border text-sm font-medium text-ui-text text-center whitespace-nowrap">
          Task Teams
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-ui-border border-dashed">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-medium text-ui-text-muted uppercase tracking-wide">IPDT (Integrated Project Delivery Team) spans all parties</span>
        </div>
      </div>
      <p className="mt-3 text-xs text-ui-text-muted">
        ISO 19650-2:2018 — Interfaces between Appointing Party, Lead Appointed Party and Task Teams
      </p>
    </div>
  );
};

export default PartyInterfaceDiagram;
