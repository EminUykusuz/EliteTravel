import api from './api';

const createService = (endpoint) => ({
    getAll: async () => {
        const response = await api.get(`/${endpoint}`);
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
        // Backendimiz PUT işleminde ID'yi hem URL'de hem Body'de istiyor
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
export const contactService = createService('contacts');