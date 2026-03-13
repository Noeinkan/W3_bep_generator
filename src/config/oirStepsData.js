/**
 * OIR step list data only (no React/lucide icons).
 * ISO 19650 compliant Organizational Information Requirements.
 */

export const OIR_STEP_CATEGORIES = {
  Strategic: { name: 'STRATEGIC CONTEXT', bg: 'bg-indigo-100 text-indigo-800' },
  Maturity: { name: 'MATURITY & FRAMEWORK', bg: 'bg-violet-100 text-violet-800' },
  Governance: { name: 'GOVERNANCE & STRATEGY', bg: 'bg-blue-100 text-blue-800' },
  Roadmap: { name: 'ROADMAP', bg: 'bg-teal-100 text-teal-800' }
};

export const OIR_STEPS_DATA = [
  { number: 0, title: 'Executive Summary', description: 'High-level organizational statement of information need', category: 'Strategic' },
  { number: 1, title: 'Organizational Objectives & Asset Portfolio', description: 'Strategic context, business drivers, and asset portfolio overview', category: 'Strategic' },
  { number: 2, title: 'Information Management Maturity', description: 'Current and target maturity levels, gap analysis, and improvement roadmap', category: 'Maturity' },
  { number: 3, title: 'Asset Information Framework', description: 'Classification approach, metadata standards, and AIM requirements', category: 'Maturity' },
  { number: 4, title: 'Regulatory, Compliance & Reporting', description: 'Legal obligations, audit needs, KPIs, and reporting cycles', category: 'Governance' },
  { number: 5, title: 'Digital Strategy & Data Governance', description: 'BIM strategy, software platforms, data ownership, and lifecycle policy', category: 'Governance' },
  { number: 6, title: 'Capacity, Capability & Implementation Roadmap', description: 'Workforce skills, training strategy, and phased implementation plan', category: 'Roadmap' }
];
