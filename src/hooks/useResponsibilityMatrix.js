import { useState, useEffect, useRef, useCallback } from 'react';
import ApiService from '../services/apiService';

/**
 * Custom hook for managing Responsibility Matrix data
 * Handles both IM Activities Matrix and Information Deliverables Matrix
 */
export const useResponsibilityMatrix = (projectId) => {
  // IM Activities (Matrix 1)
  const [imActivities, setImActivities] = useState([]);
  const [imActivitiesLoading, setImActivitiesLoading] = useState(false);

  // Information Deliverables (Matrix 2)
  const [deliverables, setDeliverables] = useState([]);
  const [deliverablesLoading, setDeliverablesLoading] = useState(false);

  // Sync status
  const [syncStatus, setSyncStatus] = useState(null);
  const [syncStatusLoading, setSyncStatusLoading] = useState(false);

  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Load data when projectId changes
  useEffect(() => {
    if (projectId) {
      setInitialLoadDone(false);
      Promise.all([loadImActivities(), loadDeliverables(), loadSyncStatus()])
        .finally(() => { if (mountedRef.current) setInitialLoadDone(true); });
    }
  }, [projectId]);

  /**
   * IM ACTIVITIES (Matrix 1) OPERATIONS
   */

  const loadImActivities = useCallback(async () => {
    if (!projectId) return;

    setImActivitiesLoading(true);
    try {
      const activities = await ApiService.getIMActivities(projectId);
      if (!mountedRef.current) return;
      setImActivities(activities || []);
    } catch (error) {
      if (mountedRef.current) {
        console.error('Failed to load IM activities:', error);
      }
    } finally {
      if (mountedRef.current) setImActivitiesLoading(false);
    }
  }, [projectId]);

  const createImActivity = async (activityData) => {
    try {
      const created = await ApiService.createIMActivity({
        ...activityData,
        projectId
      });
      await loadImActivities();
      return created;
    } catch (error) {
      console.error('Failed to create IM activity:', error);
      throw error;
    }
  };

  const updateImActivity = async (id, updates) => {
    try {
      const updated = await ApiService.updateIMActivity(id, updates);
      await loadImActivities();
      return updated;
    } catch (error) {
      console.error('Failed to update IM activity:', error);
      throw error;
    }
  };

  const deleteImActivity = async (id) => {
    try {
      await ApiService.deleteIMActivity(id);
      await loadImActivities();
    } catch (error) {
      console.error('Failed to delete IM activity:', error);
      throw error;
    }
  };

  const bulkCreateImActivities = async (activitiesArray) => {
    try {
      const result = await ApiService.bulkCreateIMActivities(activitiesArray);
      await loadImActivities();
      return result;
    } catch (error) {
      console.error('Failed to bulk create IM activities:', error);
      throw error;
    }
  };

  /**
   * INFORMATION DELIVERABLES (Matrix 2) OPERATIONS
   */

  const loadDeliverables = useCallback(async (filters = {}) => {
    if (!projectId) return;

    setDeliverablesLoading(true);
    try {
      const data = await ApiService.getDeliverables(projectId, filters);
      if (!mountedRef.current) return;
      setDeliverables(data || []);
    } catch (error) {
      if (mountedRef.current) {
        console.error('Failed to load deliverables:', error);
      }
    } finally {
      if (mountedRef.current) setDeliverablesLoading(false);
    }
  }, [projectId]);

  const createDeliverable = async (deliverableData) => {
    try {
      const created = await ApiService.createDeliverable({
        ...deliverableData,
        projectId
      });
      await loadDeliverables();
      return created;
    } catch (error) {
      console.error('Failed to create deliverable:', error);
      throw error;
    }
  };

  const updateDeliverable = async (id, updates) => {
    try {
      const updated = await ApiService.updateDeliverable(id, updates);
      await loadDeliverables();
      return updated;
    } catch (error) {
      console.error('Failed to update deliverable:', error);
      throw error;
    }
  };

  const deleteDeliverable = async (id) => {
    try {
      await ApiService.deleteDeliverable(id);
      await loadDeliverables();
    } catch (error) {
      console.error('Failed to delete deliverable:', error);
      throw error;
    }
  };

  /**
   * TIDP SYNCHRONIZATION OPERATIONS
   */

  const loadSyncStatus = useCallback(async () => {
    if (!projectId) return;

    setSyncStatusLoading(true);
    try {
      const status = await ApiService.getSyncStatus(projectId);
      if (!mountedRef.current) return;
      setSyncStatus(status);
    } catch (error) {
      if (mountedRef.current) {
        console.error('Failed to load sync status:', error);
      }
    } finally {
      if (mountedRef.current) setSyncStatusLoading(false);
    }
  }, [projectId]);

  const syncAllTIDPs = async (overwriteManual = false) => {
    try {
      const results = await ApiService.syncTIDPs(projectId, { overwriteManual });
      await loadDeliverables();
      await loadSyncStatus();
      return results;
    } catch (error) {
      console.error('Failed to sync TIDPs:', error);
      throw error;
    }
  };

  const syncSingleTIDP = async (tidpId, overwriteManual = false) => {
    try {
      const results = await ApiService.syncSingleTIDP(tidpId, projectId, { overwriteManual });
      await loadDeliverables();
      await loadSyncStatus();
      return results;
    } catch (error) {
      console.error('Failed to sync TIDP:', error);
      throw error;
    }
  };

  const unsyncTIDP = async (tidpId) => {
    try {
      const results = await ApiService.unsyncTIDP(tidpId);
      await loadDeliverables();
      await loadSyncStatus();
      return results;
    } catch (error) {
      console.error('Failed to unsync TIDP:', error);
      throw error;
    }
  };

  return {
    // IM Activities (Matrix 1)
    imActivities,
    imActivitiesLoading,
    initialLoadDone,
    loadImActivities,
    createImActivity,
    updateImActivity,
    deleteImActivity,
    bulkCreateImActivities,

    // Information Deliverables (Matrix 2)
    deliverables,
    deliverablesLoading,
    loadDeliverables,
    createDeliverable,
    updateDeliverable,
    deleteDeliverable,

    // TIDP Sync
    syncStatus,
    syncStatusLoading,
    loadSyncStatus,
    syncAllTIDPs,
    syncSingleTIDP,
    unsyncTIDP
  };
};

export default useResponsibilityMatrix;
