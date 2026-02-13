const Joi = require('joi');

// Container schema
const containerSchema = Joi.object({
  id: Joi.string().optional(),
  'Information Container ID': Joi.string().required().min(1).max(50),
  'Information Container Name/Title': Joi.string().required().min(1).max(200),
  'Description': Joi.string().required().min(1).max(500),
  'Task Name': Joi.string().required().min(1).max(100),
  'Responsible Task Team/Party': Joi.string().required().min(1).max(100),
  'Author': Joi.string().required().min(1).max(100),
  'Dependencies/Predecessors': Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string().allow('')
  ).optional(),
  'Level of Information Need (LOIN)': Joi.string().valid('LOD 100', 'LOD 200', 'LOD 300', 'LOD 350', 'LOD 400', 'LOD 500', 'As-Built').required(),
  'Classification': Joi.string().allow('').optional(),
  'Estimated Production Time': Joi.string().required(),
  'Delivery Milestone': Joi.string().required(),
  'Due Date': Joi.date().iso().required(),
  'Format/Type': Joi.string().required(),
  'Purpose': Joi.string().required().min(1).max(200),
  'Acceptance Criteria': Joi.string().required().min(1).max(500),
  'Review and Authorization Process': Joi.string().valid(
    'S0 - Work in Progress',
    'S1 - Work in progress',
    'S1 - Fit for coordination',
    'S2 - Shared for coordination',
    'S2 - Fit for information',
    'S3 - Issue for comment',
    'S3 - Fit for review & comment',
    'S4 - Issue for approval',
    'S4 - Fit for stage approval',
    'S5 - Issue for construction',
    'S5 - Fit for construction',
    'S6 - Fit for PIM authorization',
    'S7 - Fit for AIM authorization'
  ).required(),
  'Status': Joi.string().valid('Planned', 'In Progress', 'Under Review', 'Approved', 'Completed', 'Delayed').required()
});

// Team member schema
const teamMemberSchema = Joi.object({
  'Name': Joi.string().required().min(1).max(100),
  'Role': Joi.string().required().min(1).max(100),
  'Responsibility': Joi.string().required().min(1).max(200),
  'Contact': Joi.string().email().optional().allow('')
});

// Predecessor/Dependency schema
const predecessorSchema = Joi.object({
  'Required Information': Joi.string().required().min(1).max(200),
  'Source Team': Joi.string().required().min(1).max(100),
  'Format': Joi.string().required(),
  'Required Date': Joi.date().iso().required()
});

// Main TIDP schema
const tidpSchema = Joi.object({
  id: Joi.string().optional(),

  // Team Information
  teamName: Joi.string().required().min(1).max(200),
  discipline: Joi.string().valid(
    'Architecture',
    'Structural Engineering',
    'MEP Engineering',
    'Quantity Surveying',
    'Civil Engineering',
    'Landscape Architecture',
    'Sustainability',
    'Fire Engineering',
    'Acoustics',
    'Security'
  ).required(),
  leader: Joi.string().required().min(1).max(100),
  company: Joi.string().required().min(1).max(200),
  responsibilities: Joi.string().required().min(10).max(2000),

  // Optional team members
  teamMembers: Joi.array().items(teamMemberSchema).optional(),

  // Information Containers
  containers: Joi.array().items(containerSchema).min(1).required(),

  // Dependencies
  predecessors: Joi.array().items(predecessorSchema).optional(),
  coordinationNeeds: Joi.string().max(1000).allow('').optional(),

  // Quality Requirements
  qualityChecks: Joi.string().min(10).max(2000).allow('').optional(),
  reviewProcess: Joi.string().min(10).max(2000).allow('').optional(),

  // Metadata
  projectId: Joi.string().optional(),
  version: Joi.string().optional(),
  status: Joi.string().valid('Draft', 'Under Review', 'Approved', 'Active', 'Completed').optional(),
  createdBy: Joi.string().optional(),
  createdDate: Joi.date().iso().optional(),
  lastModified: Joi.date().iso().optional()
});

// Update schema (all fields optional except id)
const tidpUpdateSchema = Joi.object({
  teamName: Joi.string().min(1).max(200).optional(),
  discipline: Joi.string().valid(
    'Architecture',
    'Structural Engineering',
    'MEP Engineering',
    'Quantity Surveying',
    'Civil Engineering',
    'Landscape Architecture',
    'Sustainability',
    'Fire Engineering',
    'Acoustics',
    'Security'
  ).optional(),
  leader: Joi.string().min(1).max(100).optional(),
  company: Joi.string().min(1).max(200).optional(),
  responsibilities: Joi.string().min(10).max(2000).optional(),
  teamMembers: Joi.array().items(teamMemberSchema).optional(),
  containers: Joi.array().items(containerSchema).optional(),
  predecessors: Joi.array().items(predecessorSchema).optional(),
  coordinationNeeds: Joi.string().max(1000).allow('').optional(),
  qualityChecks: Joi.string().max(2000).allow('').optional(),
  reviewProcess: Joi.string().max(2000).allow('').optional(),
  projectId: Joi.string().optional(),
  status: Joi.string().valid('Draft', 'Under Review', 'Approved', 'Active', 'Completed').optional(),
  lastModified: Joi.date().iso().optional()
});

// Batch operation schemas
const tidpBatchSchema = Joi.object({
  tidps: Joi.array().items(tidpSchema).min(1).max(50).required()
});

const tidpBatchUpdateSchema = Joi.object({
  updates: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    data: tidpUpdateSchema.required()
  })).min(1).max(50).required()
});

// Middleware functions
const validateTIDP = (req, res, next) => {
  const { error, value } = tidpSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context.value
      }))
    });
  }

  req.body = value;
  next();
};

const validateTIDPUpdate = (req, res, next) => {
  const { error, value } = tidpUpdateSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context.value
      }))
    });
  }

  req.body = value;
  next();
};

const validateTIDPBatch = (req, res, next) => {
  const { error, value } = tidpBatchSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Batch validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context.value
      }))
    });
  }

  req.body = value;
  next();
};

const validateTIDPBatchUpdate = (req, res, next) => {
  const { error, value } = tidpBatchUpdateSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Batch update validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context.value
      }))
    });
  }

  req.body = value;
  next();
};

// Custom validation functions
const validateContainerDependencies = (containers, allTidps = []) => {
  const issues = [];
  const allContainerIds = new Set();

  // Collect all container IDs
  allTidps.forEach(tidp => {
    if (tidp.containers) {
      tidp.containers.forEach(container => {
        allContainerIds.add(container.id);
      });
    }
  });

  containers.forEach(container => {
    allContainerIds.add(container.id);
  });

  // Check dependencies
  containers.forEach((container, index) => {
    const dependencies = Array.isArray(container.Dependencies)
      ? container.Dependencies
      : (container.Dependencies ? [container.Dependencies] : []);

    dependencies.forEach(depId => {
      if (depId && !allContainerIds.has(depId)) {
        issues.push({
          container: container['Container Name'] || container.name,
          issue: `Dependency "${depId}" not found`,
          severity: 'warning'
        });
      }
    });

    // Check for self-dependencies
    if (dependencies.includes(container.id)) {
      issues.push({
        container: container['Container Name'] || container.name,
        issue: 'Container cannot depend on itself',
        severity: 'error'
      });
    }
  });

  return issues;
};

const validateMilestoneDates = (containers) => {
  const issues = [];
  const milestoneGroups = {};

  // Group containers by milestone
  containers.forEach(container => {
    const milestone = container.Milestone || container.deliveryMilestone;
    const dueDate = container['Due Date'] || container.dueDate;

    if (milestone && dueDate) {
      if (!milestoneGroups[milestone]) {
        milestoneGroups[milestone] = [];
      }
      milestoneGroups[milestone].push({
        name: container['Container Name'] || container.name,
        dueDate: new Date(dueDate)
      });
    }
  });

  // Check for date consistency within milestones
  Object.entries(milestoneGroups).forEach(([milestone, containers]) => {
    const dates = containers.map(c => c.dueDate.getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const daysDiff = (maxDate - minDate) / (1000 * 60 * 60 * 24);

    if (daysDiff > 14) { // More than 2 weeks difference
      issues.push({
        milestone,
        issue: `Large date spread in milestone (${Math.ceil(daysDiff)} days)`,
        severity: 'warning',
        suggestion: 'Consider reviewing milestone grouping or dates'
      });
    }
  });

  return issues;
};

module.exports = {
  validateTIDP,
  validateTIDPUpdate,
  validateTIDPBatch,
  validateTIDPBatchUpdate,
  validateContainerDependencies,
  validateMilestoneDates,
  tidpSchema,
  tidpUpdateSchema,
  containerSchema,
  teamMemberSchema,
  predecessorSchema
};