import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('vendora_token', response.data.token);
      localStorage.setItem('vendora_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('vendora_token', response.data.token);
      localStorage.setItem('vendora_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('vendora_token');
    localStorage.removeItem('vendora_user');
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    if (response.data.user) {
      localStorage.setItem('vendora_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
};
