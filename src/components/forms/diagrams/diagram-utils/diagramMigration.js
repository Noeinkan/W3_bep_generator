/**
 * Migration utilities to convert between old diagram format and React Flow format
 */

/**
 * Convert old diagram data (layers/models/connections) to React Flow format (nodes/edges)
 * @param {Object} diagramData - Old format with layers, models, connections
 * @returns {Object} - { nodes, edges } in React Flow format
 */
export const convertToReactFlow = (diagramData) => {
  if (!diagramData?.layers) {
    return { nodes: [], edges: [] };
  }

  const nodes = [];
  const edges = [];

  // Convert layers to group/swimlane nodes
  diagramData.layers.forEach((layer, layerIndex) => {
    // Create a parent group node for the layer
    const layerNode = {
      id: layer.id,
      type: 'swimlane',
      position: { x: 0, y: layer.y || layerIndex * 200 },
      data: {
        label: layer.name,
        layerIndex,
      },
      style: {
        width: 1200,
        height: 150,
      },
      draggable: false,
    };
    nodes.push(layerNode);

    // Convert models to child nodes
    layer.models.forEach((model) => {
      const modelNode = {
        id: model.id,
        type: model.type || 'default',
        position: { x: model.x || 0, y: (layer.y || layerIndex * 200) + (model.y || 0) + 50 },
        data: {
          label: model.name,
          type: model.type,
          layerId: layer.id,
        },
        parentNode: undefined, // Don't use parentNode for now, use absolute positioning
        extent: undefined,
      };
      nodes.push(modelNode);
    });
  });

  // Convert connections to edges
  if (diagramData.connections) {
    diagramData.connections.forEach((conn) => {
      edges.push({
        id: conn.id,
        source: conn.from,
        target: conn.to,
        type: 'smoothstep',
        animated: false,
        markerEnd: {
          type: 'arrowclosed',
          width: 20,
          height: 20,
        },
        style: {
          strokeWidth: 2,
        },
      });
    });
  }

  return { nodes, edges };
};

/**
 * Convert React Flow format back to old diagram format
 * @param {Array} nodes - React Flow nodes
 * @param {Array} edges - React Flow edges
 * @returns {Object} - Old format with layers, models, connections
 */
export const convertFromReactFlow = (nodes, edges) => {
  const layerNodesMap = new Map();
  const modelNodes = [];

  // Separate layer nodes from model nodes
  nodes.forEach((node) => {
    if (node.type === 'swimlane') {
      layerNodesMap.set(node.id, {
        id: node.id,
        name: node.data.label,
        y: node.position.y,
        models: [],
      });
    } else {
      modelNodes.push(node);
    }
  });

  // Sort layers by Y position
  const sortedLayers = Array.from(layerNodesMap.values()).sort((a, b) => a.y - b.y);

  // Assign models to their respective layers based on Y position
  modelNodes.forEach((node) => {
    // Find which layer this model belongs to (by Y position or stored layerId)
    let targetLayer = null;

    if (node.data.layerId) {
      targetLayer = layerNodesMap.get(node.data.layerId);
    }

    if (!targetLayer) {
      // Find layer by Y position
      for (let i = 0; i < sortedLayers.length; i++) {
        const layer = sortedLayers[i];
        const nextLayer = sortedLayers[i + 1];
        const layerBottom = layer.y + 150; // Approximate layer height

        if (node.position.y >= layer.y && node.position.y < layerBottom) {
          targetLayer = layer;
          break;
        }

        if (!nextLayer && node.position.y >= layer.y) {
          targetLayer = layer;
          break;
        }
      }
    }

    if (targetLayer) {
      targetLayer.models.push({
        id: node.id,
        type: node.data.type || node.type,
        name: node.data.label,
        x: node.position.x,
        y: node.position.y - targetLayer.y - 50, // Relative to layer
      });
    }
  });

  // Convert edges back to connections
  const connections = edges.map((edge) => ({
    id: edge.id,
    from: edge.source,
    to: edge.target,
  }));

  return {
    layers: sortedLayers,
    connections,
  };
};

/**
 * Get default initial state in old format
 */
export const getDefaultDiagramStructure = () => ({
  layers: [
    {
      id: 'layer-1',
      name: 'WIP (Work in Progress)',
      y: 50,
      models: [
        { id: 'model-1', type: 'document', name: 'SharePoint', x: 100, y: 0 },
        { id: 'model-2', type: 'document', name: 'Local Files', x: 300, y: 0 }
      ]
    },
    {
      id: 'layer-2',
      name: 'SHARED (Coordination)',
      y: 250,
      models: [
        { id: 'model-3', type: 'database', name: 'BIM 360', x: 150, y: 0 },
        { id: 'model-4', type: 'database', name: 'ProjectWise', x: 350, y: 0 }
      ]
    },
    {
      id: 'layer-3',
      name: 'PUBLISHED (Approved)',
      y: 450,
      models: [
        { id: 'model-5', type: 'cylinder', name: 'Aconex', x: 200, y: 0 },
        { id: 'model-6', type: 'cylinder', name: 'Client Portal', x: 400, y: 0 }
      ]
    }
  ],
  connections: [
    { id: 'conn-1', from: 'model-1', to: 'model-3' },
    { id: 'conn-2', from: 'model-2', to: 'model-4' },
    { id: 'conn-3', from: 'model-3', to: 'model-5' },
    { id: 'conn-4', from: 'model-4', to: 'model-6' }
  ]
});
