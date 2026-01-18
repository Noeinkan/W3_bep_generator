/**
 * Reducer for managing organization chart state
 * Centralizes all state updates for better predictability
 */

import { generateUniqueId } from './orgChartUtils';

// Action types
export const ACTIONS = {
  SET_ORG_DATA: 'SET_ORG_DATA',
  UPDATE_NODE: 'UPDATE_NODE',
  ADD_LEAD: 'ADD_LEAD',
  DELETE_LEAD: 'DELETE_LEAD',
  ADD_APPOINTED: 'ADD_APPOINTED',
  DELETE_APPOINTED: 'DELETE_APPOINTED',
  START_EDIT: 'START_EDIT',
  CANCEL_EDIT: 'CANCEL_EDIT',
  SAVE_EDIT: 'SAVE_EDIT',
  UPDATE_EDIT_VALUES: 'UPDATE_EDIT_VALUES',
  SET_ERRORS: 'SET_ERRORS'
};

// Initial state
export const initialState = {
  orgData: null,
  editing: null, // { nodeId: string, type: string, path: { leadIndex, appointedIndex } }
  editValues: { name: '', role: '', contact: '' },
  errors: {},
  hasUnsavedChanges: false
};

/**
 * Immutably update a nested object
 */
function updateNestedObject(obj, path, updater) {
  if (!path || path.length === 0) {
    return updater(obj);
  }
  
  const [key, ...restPath] = path;
  return {
    ...obj,
    [key]: updateNestedObject(obj[key], restPath, updater)
  };
}

/**
 * Main reducer function
 */
export function orgChartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_ORG_DATA:
      return {
        ...state,
        orgData: action.payload,
        hasUnsavedChanges: false
      };

    case ACTIONS.UPDATE_NODE: {
      const { path, updates } = action.payload;
      let newOrgData;

      if (path.type === 'appointing') {
        newOrgData = { ...state.orgData, ...updates };
      } else if (path.type === 'lead') {
        newOrgData = {
          ...state.orgData,
          leadGroups: state.orgData.leadGroups.map((group, idx) =>
            idx === path.leadIndex ? { ...group, ...updates } : group
          )
        };
      } else if (path.type === 'appointed') {
        newOrgData = {
          ...state.orgData,
          leadGroups: state.orgData.leadGroups.map((group, idx) =>
            idx === path.leadIndex
              ? {
                  ...group,
                  children: group.children.map((child, childIdx) =>
                    childIdx === path.appointedIndex ? { ...child, ...updates } : child
                  )
                }
              : group
          )
        };
      }

      return {
        ...state,
        orgData: newOrgData,
        hasUnsavedChanges: true
      };
    }

    case ACTIONS.ADD_LEAD: {
      const newLead = {
        id: generateUniqueId('lead'),
        name: action.payload?.name || 'New Lead',
        role: action.payload?.role || 'Lead Appointed Party',
        contact: action.payload?.contact || '',
        children: []
      };

      return {
        ...state,
        orgData: {
          ...state.orgData,
          leadGroups: [...(state.orgData.leadGroups || []), newLead]
        },
        hasUnsavedChanges: true
      };
    }

    case ACTIONS.DELETE_LEAD: {
      const { leadIndex } = action.payload;
      return {
        ...state,
        orgData: {
          ...state.orgData,
          leadGroups: state.orgData.leadGroups.filter((_, idx) => idx !== leadIndex)
        },
        hasUnsavedChanges: true
      };
    }

    case ACTIONS.ADD_APPOINTED: {
      const { leadIndex, appointed } = action.payload;
      const newAppointed = {
        id: generateUniqueId('appointed'),
        name: appointed?.name || 'New Appointed Party',
        role: appointed?.role || 'Appointed Party',
        contact: appointed?.contact || ''
      };

      return {
        ...state,
        orgData: {
          ...state.orgData,
          leadGroups: state.orgData.leadGroups.map((group, idx) =>
            idx === leadIndex
              ? { ...group, children: [...(group.children || []), newAppointed] }
              : group
          )
        },
        hasUnsavedChanges: true
      };
    }

    case ACTIONS.DELETE_APPOINTED: {
      const { leadIndex, appointedIndex } = action.payload;
      return {
        ...state,
        orgData: {
          ...state.orgData,
          leadGroups: state.orgData.leadGroups.map((group, idx) =>
            idx === leadIndex
              ? { ...group, children: group.children.filter((_, childIdx) => childIdx !== appointedIndex) }
              : group
          )
        },
        hasUnsavedChanges: true
      };
    }

    case ACTIONS.START_EDIT: {
      const { nodeId, type, path, currentValues } = action.payload;
      return {
        ...state,
        editing: { nodeId, type, path },
        editValues: currentValues,
        errors: {}
      };
    }

    case ACTIONS.CANCEL_EDIT:
      return {
        ...state,
        editing: null,
        editValues: { name: '', role: '', contact: '' },
        errors: {}
      };

    case ACTIONS.SAVE_EDIT: {
      // This is handled by the component to trigger validation and update
      return state;
    }

    case ACTIONS.UPDATE_EDIT_VALUES:
      return {
        ...state,
        editValues: { ...state.editValues, ...action.payload }
      };

    case ACTIONS.SET_ERRORS:
      return {
        ...state,
        errors: action.payload
      };

    default:
      return state;
  }
}
