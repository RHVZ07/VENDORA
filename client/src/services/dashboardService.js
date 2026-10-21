import api from './api';

export const dashboardService = {
  getAdminStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getVendorStats: async () => {
    const response = await api.get('/dashboard/vendor-stats');
    return response.data;
  },
};
