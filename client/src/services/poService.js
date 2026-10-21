import api from './api';

export const poService = {
  getPurchaseOrders: async (params = {}) => {
    const response = await api.get('/purchase-orders', { params });
    return response.data;
  },

  getPOById: async (id) => {
    const response = await api.get(`/purchase-orders/${id}`);
    return response.data;
  },

  createPO: async (poData) => {
    const response = await api.post('/purchase-orders', poData);
    return response.data;
  },

  updatePO: async (id, poData) => {
    const response = await api.put(`/purchase-orders/${id}`, poData);
    return response.data;
  },

  updatePOStatus: async (id, status, remarks) => {
    const response = await api.patch(`/purchase-orders/${id}/status`, { status, remarks });
    return response.data;
  },

  deletePO: async (id) => {
    const response = await api.delete(`/purchase-orders/${id}`);
    return response.data;
  },
};
