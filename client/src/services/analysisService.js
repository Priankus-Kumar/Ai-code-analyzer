import api from './api.js';

export const analysisService = {
  async createAnalysis({ title, language, sourceCode, focus }) {
    const response = await api.post('/analyses', {
      title: title ? title.trim() : undefined,
      language: language ? language.trim().toLowerCase() : 'javascript',
      sourceCode,
      focus: focus || 'general'
    });
    return response.data?.data ?? response.data;
  },

  async getAnalyses(params = {}) {
    const response = await api.get('/analyses', { params });
    return response.data?.data ?? response.data;
  },

  async getAnalysisById(id) {
    if (!id) {
      throw new Error('Analysis ID is required');
    }
    const cleanId = encodeURIComponent(String(id).trim());
    const response = await api.get(`/analyses/${cleanId}`);
    return response.data?.data ?? response.data;
  },

  async deleteAnalysis(id) {
    if (!id) {
      throw new Error('Analysis ID is required');
    }
    const cleanId = encodeURIComponent(String(id).trim());
    const response = await api.delete(`/analyses/${cleanId}`);
    return response.data?.data ?? response.data;
  },

  async updateFindingStatus(id, findingId, status) {
    if (!id || !findingId) {
      throw new Error('Analysis ID and Finding ID are required');
    }
    const cleanId = encodeURIComponent(String(id).trim());
    const cleanFindingId = encodeURIComponent(String(findingId).trim());
    const response = await api.patch(`/analyses/${cleanId}/findings/${cleanFindingId}`, { status });
    return response.data?.data ?? response.data;
  }
};

export default analysisService;
