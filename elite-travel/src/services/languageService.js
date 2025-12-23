// src/services/languageService.js
import api from './api';

export const languageService = {
  getAll: async () => {
    const response = await api.get('/languages');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/languages/${id}`);
    return response.data;
  },

  create: async (languageData) => {
    const response = await api.post('/languages', languageData);
    return response.data;
  },

  update: async (id, languageData) => {
    const response = await api.put(`/languages/${id}`, languageData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/languages/${id}`);
    return response.data;
  }
};