/**
 * Application route constants
 */
export const ROUTES = {
  HOME: '/home',
  BEP_GENERATOR: '/bep-generator',
  BEP_DRAFTS: '/bep-generator/drafts',
  TIDP_MIDP: '/tidp-midp',
};

/**
 * Generate BEP step route
 * @param {string} slug - Document slug
 * @param {number} step - Step index
 * @returns {string} Route path
 */
export const getBepStepRoute = (slug, step) => `/bep-generator/${slug}/step/${step}`;

/**
 * Generate BEP preview route
 * @param {string} slug - Document slug
 * @returns {string} Route path
 */
export const getBepPreviewRoute = (slug) => `/bep-generator/${slug}/preview`;
