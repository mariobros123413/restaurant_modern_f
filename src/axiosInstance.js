import axios from 'axios';

const api = axios.create({
  baseURL: 'https://restaurant-modern-backend.vercel.app', // URL del backend
});

export default api;