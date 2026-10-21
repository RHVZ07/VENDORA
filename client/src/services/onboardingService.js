import api from './api';

export const onboardingService = {
  saveStep: async (stepData) => {
    const response = await api.post('/onboarding/step', stepData);
    return response.data;
  },

  getApplications: async (params = {}) => {
    const response = await api.get('/onboarding', { params });
    return response.data;
  },

  getApplicationById: async (id) => {
    const response = await api.get(`/onboarding/${id}`);
    return response.data;
  },

  approveApplication: async (id, data = {}) => {
    const response = await api.patch(`/onboarding/${id}/approve`, data);
    return response.data;
  },

  rejectApplication: async (id, rejectionReason) => {
    const response = await api.patch(`/onboarding/${id}/reject`, { rejectionReason });
    return response.data;
  },

  requestChanges: async (id, requestedChanges) => {
    const response = await api.patch(`/onboarding/${id}/request-changes`, { requestedChanges });
    return response.data;
  },
};
