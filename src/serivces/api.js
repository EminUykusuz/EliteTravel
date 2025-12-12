import axios from 'axios';

// .env dosyasındaki adresi alıyoruz
const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;