import api from './api.js';

export const authService = {
  async register({ name, email, password }) {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data.data;
  },

  async login({ email, password }) {
    const response = await api.post('/auth/login', { email, password });
    return response.data.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data.data;
  }
};

export default authService;
