import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5001',  timeout: 5000, 
  withCredentials: true,
});

export default instance;