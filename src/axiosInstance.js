import axios from 'axios';

const api = axios.create({
  baseURL: 'https://observant-surprise-production.up.railway.app', // URL del backend
});

export default api;