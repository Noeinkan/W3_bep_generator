import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

/**
 * Custom hook for MIDP sub-pages that share common data-fetching patterns.
 *
 * @param {Function} fetchFunction - API service method to call (e.g., ApiService.getMIDPRiskRegister)
 * @param {string} errorMessage - Error message to display on failure
 * @returns {Object} { midpId, data, loading, reload }
 */
export const useMidpSubPage = (fetchFunction, errorMessage = 'Failed to load data') => {
  const { midpId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetchFunction(midpId);
      setData(response.data);
    } catch (error) {
      console.error(errorMessage, error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [midpId]);

  return {
    midpId,
    data,
    loading,
    reload: loadData
  };
};
