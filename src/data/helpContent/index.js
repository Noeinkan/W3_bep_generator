// Help Content Registry - Lazy loading system using bepConfig as source of truth
// Each step's help content is loaded on demand from modular files

import CONFIG from '../../config/bepConfig.js';

const STEP_TO_MODULE_KEYS = {
  1: ['projectInfo'],
  2: ['executiveSummary'],
  3: ['teamAndRoles', 'teamAndRolesPost'],
  4: ['bimGoals'],
  5: ['loin'],
  6: ['deliveryPlanning'],
  7: ['cde'],
  8: ['technology'],
  9: ['informationProduction'],
  10: ['qualityAssurance'],
  11: ['securityPrivacy'],
  12: ['trainingCompetency'],
  13: ['coordinationRisk'],
  14: ['appendices']
};

const HELP_MODULE_LOADERS = {
  projectInfo: async () => {
    const module = await import('./projectInfo.js');
    return module.projectInfoHelp || {};
  },
  executiveSummary: async () => {
    const module = await import('./executiveSummary.js');
    return module.executiveSummaryHelp || {};
  },
  teamAndRoles: async () => {
    const module = await import('./teamAndRoles.js');
    return module.teamAndRolesHelp || {};
  },
  teamAndRolesPost: async () => {
    const module = await import('./teamAndRolesPost.js');
    return module.teamAndRolesPostHelp || {};
  },
  bimGoals: async () => {
    const module = await import('./bimGoals.js');
    return module.bimGoalsHelp || {};
  },
  loin: async () => {
    const module = await import('./loin.js');
    return module.loinHelp || {};
  },
  deliveryPlanning: async () => {
    const module = await import('./deliveryPlanning.js');
    return module.deliveryPlanningHelp || {};
  },
  cde: async () => {
    const module = await import('./cde.js');
    return module.cdeHelp || {};
  },
  technology: async () => {
    const module = await import('./technology.js');
    return module.technologyHelp || {};
  },
  informationProduction: async () => {
    const module = await import('./informationProduction.js');
    return module.informationProductionHelp || {};
  },
  qualityAssurance: async () => {
    const module = await import('./qualityAssurance.js');
    return module.qualityAssuranceHelp || {};
  },
  securityPrivacy: async () => {
    const module = await import('./securityPrivacy.js');
    return module.securityPrivacyHelp || {};
  },
  trainingCompetency: async () => {
    const module = await import('./trainingCompetency.js');
    return module.trainingCompetencyHelp || {};
  },
  coordinationRisk: async () => {
    const module = await import('./coordinationRisk.js');
    return module.coordinationRiskHelp || {};
  },
  appendices: async () => {
    const module = await import('./appendices.js');
    return module.appendicesHelp || {};
  },
};

const loadedModuleContent = new Map();
const moduleLoadPromises = new Map();
const inMemoryFieldCache = new Map();
const inFlightFieldRequests = new Map();

/**
 * Extract all unique field names from bepConfig
 * This is the authoritative list of fields that should have help content
 */
const extractAllFieldsFromConfig = () => {
  const allFields = new Map();

  const addField = (field, step, bepType) => {
    if (!field || !field.name) return;

    const existing = allFields.get(field.name);
    const stepNumber = Number.parseInt(String(step?.number ?? ''), 10) || null;

    if (!existing) {
      allFields.set(field.name, {
        name: field.name,
        label: field.label,
        type: field.type,
        required: field.required || false,
        step: step?.title || 'N/A',
        stepNumber,
        bepType
      });
      return;
    }

    const appearsIn = new Set(existing.appearsIn || [existing.bepType]);
    appearsIn.add(bepType);

    allFields.set(field.name, {
      ...existing,
      bepType: appearsIn.size > 1 ? 'shared' : existing.bepType,
      appearsIn: Array.from(appearsIn)
    });
  };

  if (CONFIG.formFields['pre-appointment']) {
    Object.values(CONFIG.formFields['pre-appointment']).forEach(step => {
      (step.fields || []).forEach(field => addField(field, step, 'pre-appointment'));
    });
  }

  if (CONFIG.formFields['post-appointment']) {
    Object.values(CONFIG.formFields['post-appointment']).forEach(step => {
      (step.fields || []).forEach(field => addField(field, step, 'post-appointment'));
    });
  }

  if (CONFIG.sharedFormFields) {
    Object.values(CONFIG.sharedFormFields).forEach(step => {
      (step.fields || []).forEach(field => addField(field, step, 'shared'));
    });
  }

  return allFields;
};

const FIELD_REGISTRY = extractAllFieldsFromConfig();

const HELP_CONTENT_REGISTRY = new Map();
FIELD_REGISTRY.forEach((fieldInfo, fieldName) => {
  HELP_CONTENT_REGISTRY.set(fieldName, {
    field: fieldInfo,
    helpContent: null,
    hasHelp: false,
    source: 'unknown'
  });
});

const cacheModuleFields = (moduleContent) => {
  Object.entries(moduleContent).forEach(([fieldName, helpContent]) => {
    inMemoryFieldCache.set(fieldName, helpContent);

    const existingEntry = HELP_CONTENT_REGISTRY.get(fieldName);
    if (existingEntry) {
      HELP_CONTENT_REGISTRY.set(fieldName, {
        ...existingEntry,
        helpContent,
        hasHelp: true,
        source: 'modular'
      });
      return;
    }

    HELP_CONTENT_REGISTRY.set(fieldName, {
      field: {
        name: fieldName,
        label: fieldName,
        type: 'virtual',
        required: false,
        step: 'N/A',
        stepNumber: null,
        bepType: 'virtual'
      },
      helpContent,
      hasHelp: true,
      source: 'modular'
    });
  });
};

const loadModuleByKey = async (moduleKey) => {
  if (loadedModuleContent.has(moduleKey)) {
    return loadedModuleContent.get(moduleKey);
  }

  if (!moduleLoadPromises.has(moduleKey)) {
    const modulePromise = HELP_MODULE_LOADERS[moduleKey]()
      .then(moduleContent => {
        loadedModuleContent.set(moduleKey, moduleContent);
        cacheModuleFields(moduleContent);
        return moduleContent;
      })
      .finally(() => {
        moduleLoadPromises.delete(moduleKey);
      });

    moduleLoadPromises.set(moduleKey, modulePromise);
  }

  return moduleLoadPromises.get(moduleKey);
};

const getPreferredModuleKeys = (fieldName) => {
  const entry = HELP_CONTENT_REGISTRY.get(fieldName);
  const stepNumber = entry?.field?.stepNumber;

  if (!stepNumber || !STEP_TO_MODULE_KEYS[stepNumber]) {
    return [];
  }

  return STEP_TO_MODULE_KEYS[stepNumber];
};

const loadAllModularHelpContent = async () => {
  const modularKeys = Object.keys(HELP_MODULE_LOADERS);
  await Promise.all(modularKeys.map((moduleKey) => loadModuleByKey(moduleKey)));
};

/**
 * Get help content for a specific field
 * Returns null if no help exists
 * @param {string} fieldName - The field name from bepConfig
 * @returns {Promise<Object|null>} Help content object or null
 */
export const getHelpContent = async (fieldName) => {
  if (!fieldName) return null;

  if (inMemoryFieldCache.has(fieldName)) {
    return inMemoryFieldCache.get(fieldName);
  }

  if (inFlightFieldRequests.has(fieldName)) {
    return inFlightFieldRequests.get(fieldName);
  }

  const requestPromise = (async () => {
    const preferredModules = getPreferredModuleKeys(fieldName);

    for (const moduleKey of preferredModules) {
      const moduleContent = await loadModuleByKey(moduleKey);
      if (moduleContent[fieldName]) {
        return moduleContent[fieldName];
      }
    }

    return null;
  })().finally(() => {
    inFlightFieldRequests.delete(fieldName);
  });

  inFlightFieldRequests.set(fieldName, requestPromise);
  return requestPromise;
};

/**
 * Check if help content exists for a field
 * @param {string} fieldName - Field name to check
 * @returns {Promise<boolean>} True if help content exists
 */
export const hasHelpContent = async (fieldName) => {
  const content = await getHelpContent(fieldName);
  return !!content;
};

/**
 * Get all field names that exist in bepConfig
 * @returns {string[]} Array of field names
 */
export const getAllBepFields = () => {
  return Array.from(FIELD_REGISTRY.keys());
};

/**
 * Get all fields that have help content
 * @returns {Promise<string[]>} Array of field names with help
 */
export const getFieldsWithHelp = async () => {
  await loadAllModularHelpContent();


  return Array.from(HELP_CONTENT_REGISTRY.entries())
    .filter(([, entry]) => entry.hasHelp)
    .map(([fieldName]) => fieldName);
};

/**
 * Get all fields that are missing help content
 * @returns {Promise<Array>} Array of objects with field info
 */
export const getFieldsWithoutHelp = async () => {
  await loadAllModularHelpContent();


  return Array.from(HELP_CONTENT_REGISTRY.entries())
    .filter(([, entry]) => entry.field?.bepType !== 'virtual' && !entry.hasHelp)
    .map(([fieldName, entry]) => ({
      name: fieldName,
      label: entry.field.label,
      type: entry.field.type,
      step: entry.field.step,
      bepType: entry.field.bepType
    }));
};

/**
 * Get comprehensive statistics about help content coverage
 * @returns {Promise<Object>} Detailed statistics
 */
export const getHelpContentStats = async () => {
  await loadAllModularHelpContent();


  const allFields = Array.from(HELP_CONTENT_REGISTRY.entries());
  const configFields = allFields.filter(([, entry]) => entry.field?.bepType !== 'virtual');
  const withHelp = configFields.filter(([, entry]) => entry.hasHelp);
  const withoutHelp = configFields.filter(([, entry]) => !entry.hasHelp);
  return {
    totalFields: configFields.length,
    withHelp: withHelp.length,
    withoutHelp: withoutHelp.length,
    coveragePercent: configFields.length ? ((withHelp.length / configFields.length) * 100).toFixed(1) : '0.0',
    fieldsWithoutHelp: withoutHelp.map(([name, entry]) => ({
      name,
      label: entry.field.label,
      step: entry.field.step
    }))
  };
};

/**
 * Get detailed information about a specific field
 * @param {string} fieldName - Field name
 * @returns {Promise<Object|null>} Complete field information
 */
export const getFieldInfo = async (fieldName) => {
  const entry = HELP_CONTENT_REGISTRY.get(fieldName);
  if (!entry) return null;

  const helpContent = await getHelpContent(fieldName);
  const refreshedEntry = HELP_CONTENT_REGISTRY.get(fieldName) || entry;

  return {
    name: fieldName,
    ...refreshedEntry.field,
    hasHelp: !!helpContent,
    helpSource: refreshedEntry.source,
    helpContent
  };
};

/**
 * Get all fields for a specific BEP step
 * @param {number} stepNumber - Step number (1-14)
 * @param {string} bepType - 'pre-appointment' or 'post-appointment' or 'shared'
 * @returns {Promise<Array>} Array of field information objects
 */
export const getFieldsByStep = async (stepNumber, bepType = 'shared') => {
  const stepIndex = stepNumber - 1;
  let stepFields = [];

  if (bepType === 'shared' && CONFIG.sharedFormFields[stepIndex]) {
    stepFields = CONFIG.sharedFormFields[stepIndex].fields || [];
  } else if (CONFIG.formFields[bepType] && CONFIG.formFields[bepType][stepIndex]) {
    stepFields = CONFIG.formFields[bepType][stepIndex].fields || [];
  }

  return Promise.all(stepFields.map(async (field) => {
    const helpContent = field.name ? await getHelpContent(field.name) : null;
    return {
      ...field,
      hasHelp: !!helpContent,
      helpContent
    };
  }));
};

/**
 * Preload help content for multiple fields
 * @param {string[]} fieldNames - Array of field names
 * @returns {Promise<Object>} Map of field names to help content
 */
export const preloadHelpContent = async (fieldNames) => {
  const preloaded = {};

  await Promise.all((fieldNames || []).map(async (fieldName) => {
    const content = await getHelpContent(fieldName);
    if (content) {
      preloaded[fieldName] = content;
    }
  }));

  return preloaded;
};

/**
 * Validate that all required fields have help content
 * @returns {Promise<Object>} Validation results
 */
export const validateHelpContentCoverage = async () => {
  await loadAllModularHelpContent();


  const allFields = Array.from(HELP_CONTENT_REGISTRY.entries()).filter(([, entry]) => entry.field?.bepType !== 'virtual');
  const requiredFields = allFields.filter(([, entry]) => entry.field.required);
  const requiredWithoutHelp = requiredFields.filter(([, entry]) => !entry.hasHelp);

  return {
    valid: requiredWithoutHelp.length === 0,
    totalRequired: requiredFields.length,
    requiredWithHelp: requiredFields.length - requiredWithoutHelp.length,
    requiredWithoutHelp: requiredWithoutHelp.map(([name, entry]) => ({
      name,
      label: entry.field.label,
      step: entry.field.step
    }))
  };
};

// === BACKWARD COMPATIBILITY ===
export const getAvailableFields = getAllBepFields;

// Default export kept for compatibility. Use async APIs above for actual content retrieval.
const HELP_CONTENT = {};

export default HELP_CONTENT;

// === DEVELOPMENT UTILITIES ===
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const registryDebugHelpers = {
    registry: HELP_CONTENT_REGISTRY,
    async stats() {
      return getHelpContentStats();
    },
    async missing() {
      return getFieldsWithoutHelp();
    },
    async validate() {
      return validateHelpContentCoverage();
    }
  };

  window.__BEP_HELP_REGISTRY__ = registryDebugHelpers;
}
