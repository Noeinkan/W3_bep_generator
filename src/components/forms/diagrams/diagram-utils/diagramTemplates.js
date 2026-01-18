/**
 * Pre-built diagram templates for quick start
 */

export const diagramTemplates = {
  cdeWorkflow: {
    name: 'CDE Workflow (Default)',
    description: 'Common Data Environment workflow with WIP, Shared, and Published layers',
    data: {
      layers: [
        {
          id: 'layer-1',
          name: 'WIP (Work in Progress)',
          y: 50,
          models: [
            { id: 'model-1', type: 'document', name: 'SharePoint', x: 100, y: 0 },
            { id: 'model-2', type: 'document', name: 'Local Files', x: 300, y: 0 },
            { id: 'model-3', type: 'folder', name: 'Project Folder', x: 500, y: 0 },
          ],
        },
        {
          id: 'layer-2',
          name: 'SHARED (Coordination)',
          y: 250,
          models: [
            { id: 'model-4', type: 'database', name: 'BIM 360', x: 150, y: 0 },
            { id: 'model-5', type: 'database', name: 'ProjectWise', x: 350, y: 0 },
            { id: 'model-6', type: 'cloud', name: 'Autodesk Cloud', x: 550, y: 0 },
          ],
        },
        {
          id: 'layer-3',
          name: 'PUBLISHED (Approved)',
          y: 450,
          models: [
            { id: 'model-7', type: 'archive', name: 'Aconex', x: 200, y: 0 },
            { id: 'model-8', type: 'cylinder', name: 'Client Portal', x: 400, y: 0 },
          ],
        },
      ],
      connections: [
        { id: 'conn-1', from: 'model-1', to: 'model-4' },
        { id: 'conn-2', from: 'model-2', to: 'model-5' },
        { id: 'conn-3', from: 'model-3', to: 'model-6' },
        { id: 'conn-4', from: 'model-4', to: 'model-7' },
        { id: 'conn-5', from: 'model-5', to: 'model-8' },
        { id: 'conn-6', from: 'model-6', to: 'model-7' },
      ],
    },
  },

  cloudArchitecture: {
    name: 'Cloud Architecture',
    description: 'Basic cloud infrastructure diagram with servers and storage',
    data: {
      layers: [
        {
          id: 'layer-1',
          name: 'Client Layer',
          y: 50,
          models: [
            { id: 'model-1', type: 'desktop', name: 'Web Browser', x: 150, y: 0 },
            { id: 'model-2', type: 'mobile', name: 'Mobile App', x: 350, y: 0 },
          ],
        },
        {
          id: 'layer-2',
          name: 'Application Layer',
          y: 250,
          models: [
            { id: 'model-3', type: 'api', name: 'REST API', x: 100, y: 0 },
            { id: 'model-4', type: 'server', name: 'App Server', x: 300, y: 0 },
            { id: 'model-5', type: 'security', name: 'Auth Service', x: 500, y: 0 },
          ],
        },
        {
          id: 'layer-3',
          name: 'Data Layer',
          y: 450,
          models: [
            { id: 'model-6', type: 'database', name: 'PostgreSQL', x: 150, y: 0 },
            { id: 'model-7', type: 'storage', name: 'S3 Storage', x: 350, y: 0 },
            { id: 'model-8', type: 'archive', name: 'Backup', x: 550, y: 0 },
          ],
        },
      ],
      connections: [
        { id: 'conn-1', from: 'model-1', to: 'model-3' },
        { id: 'conn-2', from: 'model-2', to: 'model-3' },
        { id: 'conn-3', from: 'model-3', to: 'model-4' },
        { id: 'conn-4', from: 'model-3', to: 'model-5' },
        { id: 'conn-5', from: 'model-4', to: 'model-6' },
        { id: 'conn-6', from: 'model-4', to: 'model-7' },
        { id: 'conn-7', from: 'model-6', to: 'model-8' },
      ],
    },
  },

  dataFlow: {
    name: 'Data Flow Diagram',
    description: 'Simple data processing workflow',
    data: {
      layers: [
        {
          id: 'layer-1',
          name: 'Input Sources',
          y: 50,
          models: [
            { id: 'model-1', type: 'users', name: 'Users', x: 100, y: 0 },
            { id: 'model-2', type: 'api', name: 'External API', x: 300, y: 0 },
            { id: 'model-3', type: 'document', name: 'Files', x: 500, y: 0 },
          ],
        },
        {
          id: 'layer-2',
          name: 'Processing',
          y: 250,
          models: [
            { id: 'model-4', type: 'processor', name: 'Data Processor', x: 200, y: 0 },
            { id: 'model-5', type: 'workflow', name: 'Workflow Engine', x: 400, y: 0 },
          ],
        },
        {
          id: 'layer-3',
          name: 'Storage & Output',
          y: 450,
          models: [
            { id: 'model-6', type: 'database', name: 'Database', x: 150, y: 0 },
            { id: 'model-7', type: 'cloud', name: 'Cloud Storage', x: 350, y: 0 },
            { id: 'model-8', type: 'archive', name: 'Archive', x: 550, y: 0 },
          ],
        },
      ],
      connections: [
        { id: 'conn-1', from: 'model-1', to: 'model-4' },
        { id: 'conn-2', from: 'model-2', to: 'model-4' },
        { id: 'conn-3', from: 'model-3', to: 'model-5' },
        { id: 'conn-4', from: 'model-4', to: 'model-6' },
        { id: 'conn-5', from: 'model-5', to: 'model-7' },
        { id: 'conn-6', from: 'model-6', to: 'model-8' },
        { id: 'conn-7', from: 'model-7', to: 'model-8' },
      ],
    },
  },

  simpleWorkflow: {
    name: 'Simple Workflow',
    description: 'Basic process workflow with 3 stages',
    data: {
      layers: [
        {
          id: 'layer-1',
          name: 'Stage 1: Input',
          y: 50,
          models: [
            { id: 'model-1', type: 'document', name: 'Input Document', x: 250, y: 0 },
          ],
        },
        {
          id: 'layer-2',
          name: 'Stage 2: Processing',
          y: 250,
          models: [
            { id: 'model-2', type: 'workflow', name: 'Review Process', x: 250, y: 0 },
          ],
        },
        {
          id: 'layer-3',
          name: 'Stage 3: Output',
          y: 450,
          models: [
            { id: 'model-3', type: 'archive', name: 'Approved Document', x: 250, y: 0 },
          ],
        },
      ],
      connections: [
        { id: 'conn-1', from: 'model-1', to: 'model-2' },
        { id: 'conn-2', from: 'model-2', to: 'model-3' },
      ],
    },
  },

  microservices: {
    name: 'Microservices Architecture',
    description: 'Microservices architecture with API gateway',
    data: {
      layers: [
        {
          id: 'layer-1',
          name: 'Client Applications',
          y: 50,
          models: [
            { id: 'model-1', type: 'desktop', name: 'Web App', x: 100, y: 0 },
            { id: 'model-2', type: 'mobile', name: 'Mobile App', x: 300, y: 0 },
          ],
        },
        {
          id: 'layer-2',
          name: 'API Gateway & Services',
          y: 250,
          models: [
            { id: 'model-3', type: 'api', name: 'API Gateway', x: 200, y: 0 },
            { id: 'model-4', type: 'security', name: 'Auth Service', x: 400, y: 0 },
          ],
        },
        {
          id: 'layer-3',
          name: 'Microservices',
          y: 450,
          models: [
            { id: 'model-5', type: 'container', name: 'User Service', x: 100, y: 0 },
            { id: 'model-6', type: 'container', name: 'Order Service', x: 300, y: 0 },
            { id: 'model-7', type: 'container', name: 'Payment Service', x: 500, y: 0 },
          ],
        },
        {
          id: 'layer-4',
          name: 'Data Stores',
          y: 650,
          models: [
            { id: 'model-8', type: 'database', name: 'User DB', x: 100, y: 0 },
            { id: 'model-9', type: 'database', name: 'Order DB', x: 300, y: 0 },
            { id: 'model-10', type: 'database', name: 'Payment DB', x: 500, y: 0 },
          ],
        },
      ],
      connections: [
        { id: 'conn-1', from: 'model-1', to: 'model-3' },
        { id: 'conn-2', from: 'model-2', to: 'model-3' },
        { id: 'conn-3', from: 'model-3', to: 'model-4' },
        { id: 'conn-4', from: 'model-3', to: 'model-5' },
        { id: 'conn-5', from: 'model-3', to: 'model-6' },
        { id: 'conn-6', from: 'model-3', to: 'model-7' },
        { id: 'conn-7', from: 'model-5', to: 'model-8' },
        { id: 'conn-8', from: 'model-6', to: 'model-9' },
        { id: 'conn-9', from: 'model-7', to: 'model-10' },
      ],
    },
  },

  empty: {
    name: 'Empty Canvas',
    description: 'Start from scratch with no layers',
    data: {
      layers: [],
      connections: [],
    },
  },
};

// Get template by key
export const getTemplate = (key) => {
  return diagramTemplates[key] || diagramTemplates.cdeWorkflow;
};

// Get all template keys for dropdown
export const getTemplateKeys = () => {
  return Object.keys(diagramTemplates);
};

// Get template options for UI
export const getTemplateOptions = () => {
  return Object.entries(diagramTemplates).map(([key, template]) => ({
    value: key,
    label: template.name,
    description: template.description,
  }));
};
