/**
 * brandConfig.js — Single source of truth for all brand/product identity.
 * To rename the product, edit ONLY this file (frontend) and server/config/brandConfig.js (backend).
 */
export const BRAND = {
  appName: 'Capsar.io',
  appNameLong: 'Capsar.io — The IM Suite for ISO 19650',
  tagline: 'AI-powered BIM Execution Plans',
  keywords: 'Capsar.io, BIM Execution Plan, ISO 19650, EIR, OIR, TIDP, MIDP, RACI Matrix, BIM workflow, construction technology, information management',
  url: 'https://capsar.io/',
  year: '2024',
  version: 'v2.0.0',
  logo: {
    light: { ring: '#ffffff', arch: '#818cf8' },
    dark:  { ring: '#2563eb', arch: '#6366f1' },
  },
};

export default BRAND;
