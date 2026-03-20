/**
 * brandConfig.js (server-safe) — Single source of truth for brand/product identity.
 * No React, no lucide imports. CJS module for Node.js server.
 * To rename the product, edit ONLY this file and src/config/brandConfig.js (frontend).
 */
module.exports = {
  appName: 'Capsar.io',
  appNameLong: 'Capsar.io — The IM Suite for ISO 19650',
  email: {
    verificationSubject: 'Verify your Capsar.io email address',
    verificationBody: 'Click the button below to verify your email address for Capsar.io.',
    resetSubject: 'Capsar.io password reset',
  },
  export: {
    creator: 'Capsar.io',
  },
};
