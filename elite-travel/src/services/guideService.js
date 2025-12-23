// src/services/guideService.js
import api from './api';

export const guideService = {
  getAll: async () => {
    const response = await api.get('/guides');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/guides/${id}`);
    return response.data;
  },

  create: async (guideData) => {
    // Eğer zaten FormData ise olduğu gibi gönder
    if (guideData instanceof FormData) {
      const response = await api.post('/guides', guideData);
      return response.data;
    }
    
    // Değilse FormData'ya dönüştür
    const formData = new FormData();
    Object.keys(guideData).forEach(key => {
      if (guideData[key]) formData.append(key, guideData[key]);
    });
    const response = await api.post('/guides', formData);
    return response.data;
  },

  update: async (id, guideData) => {
    // Eğer FormData ise olduğu gibi gönder
    if (guideData instanceof FormData) {
      const response = await api.put(`/guides/${id}`, guideData);
      return response.data;
    }
    
    // Değilse FormData'ya dönüştür
    const formData = new FormData();
    Object.keys(guideData).forEach(key => {
      if (guideData[key]) formData.append(key, guideData[key]);
    });
    const response = await api.put(`/guides/${id}`, formData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/guides/${id}`);
    return response.data;
  }
};