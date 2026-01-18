/**
 * Utility functions for OrgStructureChart component
 */

/**
 * Generate a unique ID for nodes
 * Uses timestamp + random string for uniqueness without external dependencies
 * @param {string} prefix - Prefix for the ID (e.g., 'lead', 'appointed')
 * @returns {string} Unique ID
 */
export function generateUniqueId(prefix = 'node') {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  const counterPart = (Math.random() * 10000).toFixed(0);
  return `${prefix}_${timestamp}_${randomPart}_${counterPart}`;
}

/**
 * Deep equality check for objects
 * @param {*} obj1 
 * @param {*} obj2 
 * @returns {boolean}
 */
export function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false;
  }
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }
  
  return true;
}

/**
 * Truncate text with ellipsis
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export function truncateText(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Validate organization node data
 * @param {Object} node 
 * @param {string} type - 'appointing' | 'lead' | 'appointed'
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export function validateNodeData(node, type) {
  const errors = [];
  
  if (!node.name || node.name.trim() === '') {
    errors.push('Name is required');
  }
  
  if (node.name && node.name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }
  
  if (type !== 'appointing') {
    if (!node.role || node.role.trim() === '') {
      errors.push('Role is required');
    }
    
    if (node.role && node.role.length > 100) {
      errors.push('Role must be less than 100 characters');
    }
  }
  
  if (node.contact && node.contact.length > 100) {
    errors.push('Contact information must be less than 100 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Build org chart data from raw input
 * Normalizes data to a consistent tree structure
 * @param {Object} data 
 * @returns {Object|null}
 */
export function buildOrgChartData(data) {
  if (!data) return null;

  const appointingParty = data.appointingParty || 'Appointing Party';

  // Normalize leads
  let leads = [];
  if (Array.isArray(data.leadAppointedParty)) {
    leads = data.leadAppointedParty;
  } else if (typeof data.leadAppointedParty === 'string') {
    leads = [data.leadAppointedParty];
  }

  // Map appointed parties to leads
  const appointedMap = {};
  leads.forEach(lead => {
    appointedMap[lead] = [];
  });

  // Handle finalizedParties with strict mapping
  if (Array.isArray(data.finalizedParties) && data.finalizedParties.length > 0) {
    data.finalizedParties.forEach((party, index) => {
      // Only assign to a lead if explicitly specified
      const parentLead = party['Parent Lead'] || party['Lead Appointed Party'] || party['Lead'];
      if (parentLead && leads.includes(parentLead)) {
        appointedMap[parentLead].push({
          id: generateUniqueId('appointed'),
          name: party['Company Name'] || party['Role/Service'] || 'Appointed Party',
          role: party['Role/Service'] || 'Appointed Party',
          contact: party['Lead Contact'] || ''
        });
      }
      // Parties without a valid parentLead are ignored to prevent misassignment
    });
  }

  return {
    id: generateUniqueId('appointing'),
    name: appointingParty,
    role: 'Appointing Party',
    leadGroups: leads.map((lead, index) => ({
      id: generateUniqueId('lead'),
      name: lead,
      role: 'Lead Appointed Party',
      contact: '', // Information Manager field
      children: appointedMap[lead] || []
    }))
  };
}

/**
 * Color palettes for different lead columns
 */
export const COLOR_PALETTES = [
  { lead: '#2196f3', appointed: '#e3f2fd', border: '#1976d2' }, // Blue
  { lead: '#4caf50', appointed: '#e8f5e8', border: '#388e3c' }, // Green
  { lead: '#ff9800', appointed: '#fff3e0', border: '#f57c00' }, // Orange
  { lead: '#9c27b0', appointed: '#f3e5f5', border: '#7b1fa2' }, // Purple
  { lead: '#f44336', appointed: '#ffebee', border: '#d32f2f' }, // Red
  { lead: '#00bcd4', appointed: '#e0f2f1', border: '#0097a7' }, // Cyan
  { lead: '#795548', appointed: '#efebe9', border: '#5d4037' }, // Brown
  { lead: '#607d8b', appointed: '#eceff1', border: '#455a64' }  // Blue Grey
];

/**
 * Get color palette for a specific index
 * @param {number} index 
 * @returns {Object}
 */
export function getColorPalette(index) {
  return COLOR_PALETTES[index % COLOR_PALETTES.length];
}

/**
 * Convert org tree to finalized parties format for export
 * @param {Object} orgData 
 * @returns {Array}
 */
export function convertTreeToFinalizedParties(orgData) {
  if (!orgData || !orgData.leadGroups) return [];
  
  const finalizedParties = [];
  
  orgData.leadGroups.forEach(group => {
    (group.children || []).forEach(child => {
      finalizedParties.push({
        'Role/Service': child.role || 'Appointed Party',
        'Company Name': child.name,
        'Lead Contact': child.contact || '',
        'Parent Lead': group.name
      });
    });
  });
  
  return finalizedParties;
}

/**
 * Find a node in the tree by ID
 * @param {Object} orgData 
 * @param {string} nodeId 
 * @returns {Object|null} { node, path: { type, leadIndex, appointedIndex } }
 */
export function findNodeById(orgData, nodeId) {
  if (!orgData) return null;
  
  if (orgData.id === nodeId) {
    return { node: orgData, path: { type: 'appointing' } };
  }
  
  if (orgData.leadGroups) {
    for (let leadIndex = 0; leadIndex < orgData.leadGroups.length; leadIndex++) {
      const lead = orgData.leadGroups[leadIndex];
      
      if (lead.id === nodeId) {
        return { node: lead, path: { type: 'lead', leadIndex } };
      }
      
      if (lead.children) {
        for (let appointedIndex = 0; appointedIndex < lead.children.length; appointedIndex++) {
          const appointed = lead.children[appointedIndex];
          
          if (appointed.id === nodeId) {
            return { 
              node: appointed, 
              path: { type: 'appointed', leadIndex, appointedIndex } 
            };
          }
        }
      }
    }
  }
  
  return null;
}
