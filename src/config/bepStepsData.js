/**
 * Step list data only (no React/lucide icons).
 * Used by the server to load BEP structure without pulling in lucide-react.
 * bepSteps.js imports this and adds icons for the frontend.
 */

export const STEP_CATEGORIES = {
  Commercial: { name: 'COMMERCIAL ASPECTS', bg: 'bg-blue-100 text-blue-800' },
  Management: { name: 'MANAGEMENT ASPECTS', bg: 'bg-green-100 text-green-800' },
  Technical: { name: 'TECHNICAL ASPECTS', bg: 'bg-purple-100 text-purple-800' }
};

export const BEP_STEPS_DATA = [
  { number: 1, title: 'BEP Type & Project Info', description: 'Define BEP type and basic project information', category: 'Commercial' },
  { number: 2, title: 'Executive Summary', description: 'High-level overview and key commitments', category: 'Commercial' },
  { number: 3, title: 'Stakeholders & Roles', description: 'Define project stakeholders and responsibilities', category: 'Commercial' },
  { number: 4, title: 'BIM Goals & Uses', description: 'Define BIM objectives and applications', category: 'Commercial' },
  { number: 5, title: 'Level of Information Need', description: 'Specify LOIN requirements and content', category: 'Management' },
  { number: 6, title: 'Information Delivery Planning', description: 'MIDP, TIDPs and delivery schedules', category: 'Management' },
  { number: 7, title: 'Common Data Environment', description: 'CDE specification and workflows', category: 'Technical' },
  { number: 8, title: 'Technology Requirements', description: 'Software, hardware and technical specs', category: 'Technical' },
  { number: 9, title: 'Information Production', description: 'Methods, standards and procedures', category: 'Management' },
  { number: 10, title: 'Quality Assurance', description: 'QA framework and validation processes', category: 'Management' },
  { number: 11, title: 'Security & Privacy', description: 'Information security and privacy measures', category: 'Management' },
  { number: 12, title: 'Training & Competency', description: 'Training requirements and competency levels', category: 'Management' },
  { number: 13, title: 'Coordination & Risk', description: 'Collaboration procedures and risk management', category: 'Management' },
  { number: 14, title: 'Appendices', description: 'Supporting materials and templates', category: 'Management' }
];
