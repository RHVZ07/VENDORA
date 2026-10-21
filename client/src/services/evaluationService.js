import api from './api';

export const evaluationService = {
  getEvaluations: async (params = {}) => {
    const response = await api.get('/evaluations', { params });
    return response.data;
  },

  getEvaluationById: async (id) => {
    const response = await api.get(`/evaluations/${id}`);
    return response.data;
  },

  createEvaluation: async (evaluationData) => {
    const response = await api.post('/evaluations', evaluationData);
    return response.data;
  },

  updateEvaluation: async (id, evaluationData) => {
    const response = await api.put(`/evaluations/${id}`, evaluationData);
    return response.data;
  },
};
