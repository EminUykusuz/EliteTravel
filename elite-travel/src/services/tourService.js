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
    // AdminTourForm zaten doğru FormData gönderiyor, direkt kullan
    const response = await api.post('/tours', tourData);
    return response.data;
  },

  // Tur güncelle
  update: async (id, tourData) => {
    // Backend Update endpoint [FromBody] kullanıyor - JSON gönder
    const updateDto = {
      id: parseInt(id), // REQUIRED - backend validation için
      price: parseFloat(tourData.get('Price')),
      currency: tourData.get('Currency'),
      capacity: parseInt(tourData.get('Capacity')),
      isActive: tourData.get('IsActive') === 'true',
      guideId: tourData.get('GuideId') ? parseInt(tourData.get('GuideId')) : null
    };

    const response = await api.put(`/tours/${id}`, updateDto);
    return response.data;
  },

  // Tur sil
  delete: async (id) => {
    try {
      const response = await api.delete(`/tours/${id}`);
      // Backend return ApiResponseDto<bool> so check if success
      if (response.data?.success || response.status === 200) {
        return response.data;
      }
      throw new Error(response.data?.message || 'Delete failed');
    } catch (error) {
      console.error('Tour delete error:', error);
      throw error;
    }
  },

  // Tura kategori ekle
  addCategory: async (tourId, categoryId) => {
    const response = await api.post(`/tours/${tourId}/categories/${categoryId}`);
    return response.data;
  },

  // Turdan kategori çıkar
  removeCategory: async (tourId, categoryId) => {
    const response = await api.delete(`/tours/${tourId}/categories/${categoryId}`);
    return response.data;
  }
};