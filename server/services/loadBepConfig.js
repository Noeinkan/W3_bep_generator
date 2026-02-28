/**
 * Shared BEP config loader for server-side use.
 * Loads src/config/bepConfig.js (ESM) via dynamic import() so both
 * htmlTemplateService and bepStructureService use the same CONFIG source.
 */

const path = require('path');
const { pathToFileURL } = require('url');

const DEFAULT_CONFIG = {
  bepTypeDefinitions: {
    'pre-appointment': { title: 'Pre-Appointment BEP', subtitle: 'Tender Phase Document', description: '' },
    'post-appointment': { title: 'Post-Appointment BEP', subtitle: 'Project Execution Document', description: '' }
  },
  steps: [],
  formFields: {},
  sharedFormFields: {},
  getFormFields: () => null
};

let cachedConfig = null;
let lastLoadResult = { success: false };

/**
 * Load BEP config from ESM (src/config/bepConfig.js). Uses dynamic import()
 * because the file uses import/export; require() cannot load it.
 * @returns {Promise<{ success: boolean, config: object }>}
 */
async function loadBepConfigAsync() {
  const result = { success: false, config: { ...DEFAULT_CONFIG } };

  try {
    // Load server-safe config first (no lucide-react); fallback to full bepConfig if missing
    const serverConfigPath = path.join(__dirname, '..', '..', 'src', 'config', 'bepConfigForServer.js');
    const fileUrl = pathToFileURL(serverConfigPath).href;
    const loaded = await import(fileUrl);

    let configData = loaded.default ?? loaded.CONFIG ?? (typeof loaded === 'object' && loaded !== null ? loaded : null);
    if (!configData) {
      throw new Error('Config file loaded but no valid configuration object found');
    }

    if (!configData.steps || !Array.isArray(configData.steps)) {
      console.warn('⚠️  Loaded config missing steps array, using defaults');
      configData.steps = DEFAULT_CONFIG.steps;
    }
    if (!configData.getFormFields || typeof configData.getFormFields !== 'function') {
      console.warn('⚠️  Loaded config missing getFormFields, using defaults');
      configData.getFormFields = DEFAULT_CONFIG.getFormFields;
    }

    result.config = { ...DEFAULT_CONFIG, ...configData };
    result.success = true;
    cachedConfig = result.config;
    lastLoadResult = result;
    return result;
  } catch (error) {
    const attemptedPath = path.join(__dirname, '..', '..', 'src', 'config', 'bepConfigForServer.js');
    console.warn('⚠️  Could not load BEP config:', error.message);
    console.warn('   Code:', error.code || 'none', '| Path:', attemptedPath);
    if (error.code === 'ERR_MODULE_NOT_FOUND' || error.code === 'MODULE_NOT_FOUND') {
      console.warn('   Tip: Ensure src/config/bepConfigForServer.js and its deps (bepStepsData.js, bepFormFieldsData.js, bepOptions.js) exist.');
    }
    if (error.cause) {
      console.warn('   Cause:', error.cause.message || error.cause);
    }
    lastLoadResult = result;
    return result;
  }
}

/**
 * Sync loader for environments where ESM is not used (e.g. some tests).
 * Tries require() first; if it fails, returns last async load cache or default.
 * @returns {{ success: boolean, config: object }}
 */
function loadBepConfig() {
  if (cachedConfig) {
    return { success: true, config: cachedConfig };
  }
  try {
    const configPath = require.resolve(path.join(__dirname, '..', '..', 'src', 'config', 'bepConfig.js'));
    delete require.cache[configPath];
    const loaded = require(configPath);
    const configData = loaded.default ?? loaded.CONFIG ?? loaded;
    if (configData && configData.steps && configData.getFormFields) {
      cachedConfig = { ...DEFAULT_CONFIG, ...configData };
      lastLoadResult = { success: true, config: cachedConfig };
      return lastLoadResult;
    }
  } catch (_) {
    // ignore; use cache or default
  }
  return lastLoadResult.success ? lastLoadResult : { success: false, config: { ...DEFAULT_CONFIG } };
}

/**
 * Return the cached config from the last successful loadBepConfigAsync() (or loadBepConfig).
 * Returns default config if never loaded, so callers can avoid null checks.
 * @returns {object}
 */
function getConfig() {
  return cachedConfig || { ...DEFAULT_CONFIG };
}

/**
 * Whether config was successfully loaded (has steps and getFormFields).
 * @returns {boolean}
 */
function isConfigLoaded() {
  const c = cachedConfig || lastLoadResult.config;
  return !!(c && Array.isArray(c.steps) && c.steps.length && typeof c.getFormFields === 'function');
}

module.exports = {
  loadBepConfigAsync,
  loadBepConfig,
  getConfig,
  isConfigLoaded,
  get lastLoadResult() { return lastLoadResult; }
};
