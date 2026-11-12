import { useState, useEffect, useCallback } from 'react';
import analysisService from '../services/analysisService.js';

export const useAnalyses = (initialFilters = {}) => {
  const [analyses, setAnalyses] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalyses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analysisService.getAnalyses(filters);
      setAnalyses(data.analyses || []);
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (err) {
      setError(err.message || 'Failed to load analyses.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1
    }));
  };

  const removeAnalysis = async (id) => {
    try {
      await analysisService.deleteAnalysis(id);
      setAnalyses((prev) => prev.filter((item) => item._id !== id));
      setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete analysis.');
      return false;
    }
  };

  return {
    analyses,
    pagination,
    filters,
    loading,
    error,
    updateFilters,
    removeAnalysis,
    refetch: fetchAnalyses
  };
};

export default useAnalyses;
