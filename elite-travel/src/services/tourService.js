// src/services/tourService.js
import api from './api';

export const tourService = {
  // Tüm turları getir
  getAll: async (params = {}) => {
    const response = await api.get('/tours', { params });
    // GetAll returns array directly, not ApiResponseDto
    return response.data;
  },

  // ID'ye göre tur getir
  getById: async (id) => {
    const response = await api.get(`/tours/${id}`);
    return response.data?.Data || response.data?.data;
  },

  // Slug'a göre tur getir
  getBySlug: async (slug) => {
    const response = await api.get(`/tours/slug/${slug}`);
    return response.data?.Data || response.data?.data;
  },

  // Kategoriye göre turlar
  getByCategory: async (categoryId) => {
    const response = await api.get(`/tours/by-category/${categoryId}`);
    return response.data;
  },

  // Yeni tur oluştur
  create: async (tourData) => {
    const response = await api.post('/tours', tourData);
    return response.data;
  },

  // Tur güncelle
  update: async (id, tourData) => {
    const response = await api.put(`/tours/${id}`, tourData);
    return response.data;
  },

  // Tur sil
  delete: async (id) => {
    const response = await api.delete(`/tours/${id}`);
    // Backend return ApiResponseDto<bool> so check if success
    if (response.data?.success || response.status === 200) {
      return response.data;
    }
    throw new Error(response.data?.message || 'Delete failed');
  },

  // Tura kategori ekle
  addCategory: async (tourId, categoryId) => {
    const response = await api.post(`/tours/${tourId}/categories/${categoryId}`);
    return response.data;
  },

  // Tur çevirilerini getir (language code ile: 'tr', 'en', 'de', 'nl')
  getTranslation: async (tourId, languageCode) => {
    try {
      // Önce language code'a göre language ID'yi al
      const langResponse = await api.get(`/languages/code/${languageCode}`);
      const languageId = langResponse.data?.Data?.id || langResponse.data?.data?.id;
      
      if (!languageId) {
        return null;
      }

      // Translation'ı getir
      const response = await api.get(`/tourtranslations/tour/${tourId}/language/${languageId}`);
      const translation = response.data?.Data || response.data?.data;
      
      if (!translation) {
        return null;
      }

      // JSON alanları parse et
      return {
        ...translation,
        itineraries: translation.itinerariesJson ? JSON.parse(translation.itinerariesJson) : null,
        extras: translation.extrasJson ? JSON.parse(translation.extrasJson) : null,
        highlights: translation.highlightsJson ? JSON.parse(translation.highlightsJson) : null
      };
    } catch (error) {
            return null;
    }
  },

  // Turdan kategori çıkar
  removeCategory: async (tourId, categoryId) => {
    const response = await api.delete(`/tours/${tourId}/categories/${categoryId}`);
    return response.data;
  }
};