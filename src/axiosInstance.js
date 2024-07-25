import axios from 'axios';

const api = axios.create({
  baseURL: 'https://restaurant-ia.up.railway.app', // URL del backend
});

export default api;