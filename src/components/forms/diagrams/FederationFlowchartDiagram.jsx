/**
 * Static read-only federation process flowchart (benchmark Figure 5-1).
 * Swimlane diagram: BIM Coordinator | SBIM / Coordination tool | Coordination review.
 * Displays the 8 federation process steps distributed across the three lanes.
 * Used inside FederationStrategyBuilder (Section 5.1.5).
 */
import React from 'react';

const LANE_HEADER_STYLE = 'text-[10px] font-semibold uppercase tracking-wide py-2 px-3 border-b border-gray-300';
const STEP_BOX_STYLE = 'rounded border border-gray-400 bg-white px-2 py-1.5 text-left text-xs text-gray-800 shadow-sm';

/** Map step index to lane (0 = BIM Coordinator, 1 = SBIM, 2 = Coordination review) */
const stepToLane = (idx) => {
  if (idx <= 1) return 0;
  if (idx <= 4) return 1;
  return 2;
};

const LANE_LABELS = ['BIM Coordinator', 'SBIM / Coordination tool', 'Coordination review'];

const FederationFlowchartDiagram = ({ steps = [] }) => {
  const stepsWithLane = (steps.length ? steps : [
    { title: 'Model submission to CDE' },
    { title: 'Federation build' },
    { title: 'Clash detection run' },
    { title: 'Clash report generation' },
    { title: 'Coordination review meeting' },
    { title: 'Issue assignment and resolution' },
    { title: 'Re-federation and verification' },
    { title: 'Sign-off and release' }
  ]).map((step, idx) => ({ ...step, lane: stepToLane(idx), stepNumber: idx + 1 }));

  const lanes = [0, 1, 2].map((laneIndex) => ({
    label: LANE_LABELS[laneIndex],
    steps: stepsWithLane.filter((s) => s.lane === laneIndex)
  }));

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 overflow-x-auto min-w-0">
      <p className="text-xs font-medium text-gray-600 mb-3">Figure 5-1 — Federation process flowchart (swimlane)</p>
      <div className="min-w-[480px] w-full max-w-4xl mx-auto space-y-0 border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
        {lanes.map((lane, laneIdx) => (
          <div
            key={laneIdx}
            className={`flex flex-col ${laneIdx < lanes.length - 1 ? 'border-b border-gray-300' : ''}`}
          >
            <div className={`${LANE_HEADER_STYLE} ${laneIdx === 0 ? 'bg-blue-50 text-blue-800' : laneIdx === 1 ? 'bg-amber-50 text-amber-800' : 'bg-green-50 text-green-800'}`}>
              {lane.label}
            </div>
            <div className="flex flex-wrap gap-2 p-3 items-center">
              {lane.steps.map((s, i) => (
                <React.Fragment key={s.stepNumber}>
                  {i > 0 && <span className="text-gray-400 text-sm" aria-hidden="true">→</span>}
                  <div className={STEP_BOX_STYLE}>
                    <span className="text-gray-500 font-medium">{s.stepNumber}.</span> {s.title || `Step ${s.stepNumber}`}
                  </div>
                </React.Fragment>
              ))}
              {lane.steps.length === 0 && (
                <span className="text-gray-400 text-xs italic">—</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FederationFlowchartDiagram;
