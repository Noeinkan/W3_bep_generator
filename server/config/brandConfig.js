/**
 * brandConfig.js (server-safe) — Single source of truth for brand/product identity.
 * No React, no lucide imports. CJS module for Node.js server.
 * To rename the product, edit ONLY this file and src/config/brandConfig.js (frontend).
 */
module.exports = {
  appName: 'Moliari',
  appNameLong: 'Moliari — The IM Suite for ISO 19650',
  email: {
    verificationSubject: 'Verify your Moliari email address',
    verificationBody: 'Click the button below to verify your email address for Moliari.',
    resetSubject: 'Moliari password reset',
  },
  export: {
    creator: 'Moliari',
  },
};
