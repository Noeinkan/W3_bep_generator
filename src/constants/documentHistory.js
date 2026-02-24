// ISO 19650-2 suitability status codes for information containers
export const SUITABILITY_CODES = [
  { code: 'S0', label: 'Work in Progress',              color: 'gray'   },
  { code: 'S1', label: 'Suitable for Coordination',     color: 'blue'   },
  { code: 'S2', label: 'Suitable for Information',      color: 'teal'   },
  { code: 'S3', label: 'Suitable for Review & Comment', color: 'amber'  },
  { code: 'S4', label: 'Suitable for Stage Approval',   color: 'violet' },
  { code: 'S5', label: 'Suitable for Authorization',    color: 'green'  },
  { code: 'D1', label: 'Preliminary',                   color: 'purple' },
  { code: 'D2', label: 'Coordinated',                   color: 'purple' },
];

export const SUITABILITY_MAP = Object.fromEntries(
  SUITABILITY_CODES.map(s => [s.code, s])
);

// Tailwind color classes per suitability code (badge bg + text)
export const SUITABILITY_COLORS = {
  S0: 'bg-gray-100   text-gray-700   border-gray-300',
  S1: 'bg-blue-100   text-blue-700   border-blue-300',
  S2: 'bg-teal-100   text-teal-700   border-teal-300',
  S3: 'bg-amber-100  text-amber-700  border-amber-300',
  S4: 'bg-violet-100 text-violet-700 border-violet-300',
  S5: 'bg-green-100  text-green-700  border-green-300',
  D1: 'bg-purple-100 text-purple-700 border-purple-300',
  D2: 'bg-purple-100 text-purple-700 border-purple-300',
};

// ISO 19650-2 §5.1.3 default governance triggers for BEP change management
export const DEFAULT_GOVERNANCE_TRIGGERS = [
  { trigger: 'Appointment of a new task team',                     accountableParty: 'Lead Information Manager' },
  { trigger: 'Change to project information requirements (EIR/PIR)', accountableParty: 'Lead Information Manager' },
  { trigger: 'Change to project scope or programme',               accountableParty: 'Project Manager' },
  { trigger: 'Change to project information standards',            accountableParty: 'Lead Information Manager' },
  { trigger: 'Change to key personnel (Lead IM or Lead Author)',   accountableParty: 'Lead Information Manager' },
  { trigger: 'Stage gate transition',                              accountableParty: 'Project Director' },
];

// Build a fresh documentHistory object for a new draft
// projectName is used to auto-derive a default document number
export function createDefaultDocumentHistory(projectName = '') {
  const today = new Date().toISOString().slice(0, 10);
  const prefix = projectName
    ? projectName.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 6)
    : 'BEP';
  return {
    documentNumber: `${prefix}-BEP-001`,
    revisions: [
      {
        id:          crypto.randomUUID(),
        revisionCode: 'P01',
        date:         today,
        statusCode:   'S0',
        statusLabel:  'Work in Progress',
        author:       '',
        checkedBy:    '',
        description:  'Initial draft',
      },
    ],
    contributors:      [],
    governanceTriggers: DEFAULT_GOVERNANCE_TRIGGERS.map(t => ({ ...t, id: crypto.randomUUID() })),
    raciReviewRecord:  [],
  };
}
