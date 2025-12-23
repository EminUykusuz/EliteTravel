// src/services/api.js
import axios from 'axios';

const DEFAULT_API_URL = (typeof window !== 'undefined' && window.location?.protocol === 'https:')
  ? 'https://localhost:7069/api'
  : 'http://localhost:5067/api';

const API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

const api = axios.create({
  baseURL: API_URL,
  transformRequest: [
    function(data, headers) {
      // FormData'yı hiç dokunma - axios'un kendi işlemesine bırak
      if (data instanceof FormData) {
        return data;
      }
      // JSON data için stringify
      if (data && typeof data === 'object') {
        headers['Content-Type'] = 'application/json';
        return JSON.stringify(data);
      }
      return data;
    }
  ]
});

// Request interceptor (token eklemek için)
api.interceptors.request.use(
  (config) => {
    // Token ekle
    const token = sessionStorage.getItem('elite_travel_auth');
    if (token) {
      try {
        const auth = JSON.parse(token);
        if (auth?.token) {
          config.headers.Authorization = `Bearer ${auth.token}`;
        }
      } catch (e) {
        // Parse hatası
      }
    }
    
    // FormData için Content-Type'ı axios'a bırak
    if (!(config.data instanceof FormData)) {
      if (config.method !== 'get' && config.method !== 'delete') {
        config.headers['Content-Type'] = 'application/json';
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (hata yönetimi)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('elite_travel_auth');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;