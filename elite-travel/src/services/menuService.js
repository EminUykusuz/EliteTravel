import api from './api';

export const menuService = {
  getAll: async () => {
    const response = await api.get('/menuitems');
    return response.data;
  },

  getFlat: async () => {
    const response = await api.get('/menuitems/flat');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/menuitems/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/menuitems', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/menuitems/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/menuitems/${id}`);
  }
};