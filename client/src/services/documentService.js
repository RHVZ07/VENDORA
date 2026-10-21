import api from './api';

export const documentService = {
  uploadDocument: async (formData) => {
    const response = await api.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getDocuments: async (params = {}) => {
    const response = await api.get('/documents', { params });
    return response.data;
  },

  verifyDocument: async (id) => {
    const response = await api.patch(`/documents/${id}/verify`);
    return response.data;
  },

  rejectDocument: async (id, rejectionReason) => {
    const response = await api.patch(`/documents/${id}/reject`, { rejectionReason });
    return response.data;
  },

  deleteDocument: async (id) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },
};
