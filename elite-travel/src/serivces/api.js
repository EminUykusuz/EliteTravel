import axios from 'axios';

// .env dosyasındaki adresi alıyoruz
const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: BASE_URL
});

// transformRequest'i override et - FormData desteği için
api.defaults.transformRequest = [function(data, headers) {
  // FormData ise olduğu gibi gönder (axios boundary ekler)
  if (data instanceof FormData) {
    return data;
  }
  // JSON ise stringify et
  if (data && typeof data === 'object') {
    return JSON.stringify(data);
  }
  return data;
}];

// Request interceptor - debug ve header handling
api.interceptors.request.use((config) => {
    // FormData için Content-Type'ı kaldır (axios otomatik boundary ekler)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else if (config.method !== 'get' && config.method !== 'delete') {
      // JSON request'ler için Content-Type set et
      config.headers['Content-Type'] = 'application/json';
    }
    
        return config;
});

// Response interceptor - debug
api.interceptors.response.use(
    (response) => {
                return response;
    },
    (error) => {
                return Promise.reject(error);
    }
);

export default api;