import api from './api';

const createService = (endpoint) => ({
    getAll: async (params) => {
        const response = await api.get(`/${endpoint}`, params ? { params } : undefined);
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/${endpoint}/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post(`/${endpoint}`, data);
        return response.data;
    },
    update: async (id, data) => {
        // FormData ise olduğu gibi gönder
        if (data instanceof FormData) {
          data.append('id', id);
          const response = await api.put(`/${endpoint}/${id}`, data);
          return response.data;
        }
        // JSON ise ID'yi body'ye ekle
        const response = await api.put(`/${endpoint}/${id}`, { id, ...data });
        return response.data;
    },
    delete: async (id) => {
        await api.delete(`/${endpoint}/${id}`);
    }
});

// Servisleri dışarı açıyoruz
export const tourService = createService('tours');
export const bookingService = createService('bookings');
export const guideService = createService('guides');
export const userService = createService('users');
export const contactService = createService('contacts');
export const menuService = createService('menuitems');
export const categoryService = createService('categories');

// Settings için özel service (partial update destekli)
export const settingsService = {
    getAll: async () => {
        const response = await api.get('/settings');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/settings/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/settings', data);
        return response.data;
    },
    update: async (id, data) => {
        // Sadece gönderilen field'ları gönder, ID ekleme
        const response = await api.put(`/settings/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        await api.delete(`/settings/${id}`);
    }
};