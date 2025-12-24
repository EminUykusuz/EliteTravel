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
    console.log('🚀 tourService.create çağrıldı');
    console.log('📦 Gönderilen data tipi:', tourData instanceof FormData ? 'FormData' : typeof tourData);
    
    // FormData içeriğini log'la
    if (tourData instanceof FormData) {
      console.log('📋 FormData içeriği:');
      for (let [key, value] of tourData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
      }
    }
    
    try {
      console.log('🌐 POST /tours isteği gönderiliyor...');
      const response = await api.post('/tours', tourData);
      console.log('✅ Backend yanıtı:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ tourService.create hatası:', error);
      console.error('❌ Hata detayı:', error.response?.data);
      throw error;
    }
  },

  // Tur güncelle
  update: async (id, tourData) => {
    console.log('🔄 tourService.update çağrıldı, ID:', id);
    console.log('📦 Gönderilen data tipi:', tourData instanceof FormData ? 'FormData' : typeof tourData);
    
    // FormData içeriğini log'la
    if (tourData instanceof FormData) {
      console.log('📋 FormData içeriği:');
      for (let [key, value] of tourData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
      }
    }
    
    try {
      console.log(`🌐 PUT /tours/${id} isteği gönderiliyor...`);
      const response = await api.put(`/tours/${id}`, tourData);
      console.log('✅ Backend yanıtı:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ tourService.update hatası:', error);
      console.error('❌ Hata detayı:', error.response?.data);
      throw error;
    }
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