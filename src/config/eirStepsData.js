/**
 * EIR step list data only (no React/lucide icons).
 * ISO 19650 compliant Exchange Information Requirements — UK BIM Framework / CDBB-style ToC.
 */

export const EIR_STEP_CATEGORIES = {
  Introduction: { name: 'INTRODUCTION', bg: 'bg-blue-100 text-blue-800' },
  Requirements: { name: 'INFORMATION REQUIREMENTS', bg: 'bg-green-100 text-green-800' },
  Standards: { name: 'STANDARDS & PROCEDURES', bg: 'bg-purple-100 text-purple-800' },
  Appendices: { name: 'APPENDICES', bg: 'bg-amber-100 text-amber-800' }
};

export const EIR_STEPS_DATA = [
  { number: 'P', title: 'Project Information', description: 'Project metadata, key contacts, contract and phasing context', category: 'Introduction' },
  { number: 0, title: 'Executive Summary', description: 'High-level overview of the EIR', category: 'Introduction' },
  { number: 1, title: 'Introduction', description: 'EIR purpose, goals, objectives, and response requirements', category: 'Introduction' },
  { number: 2, title: 'Information Requirements', description: 'BIM uses, plan of work, milestones, security, PIM/AIM, KPIs, H&S', category: 'Requirements' },
  { number: 3, title: 'Information Standards', description: 'Project standards, naming, CDE metadata, LOD/LOI, data authoring, software, quality', category: 'Standards' },
  { number: 4, title: 'Information Production Methods', description: 'Responsibility matrix, CDE workflow, federation strategy, authorisation, spatial strategy, lessons learnt', category: 'Standards' },
  { number: 5, title: 'Appendices', description: 'RACI, milestones table, LOD/LOI matrix, software schedule, CDE spec, classification', category: 'Appendices' }
];
