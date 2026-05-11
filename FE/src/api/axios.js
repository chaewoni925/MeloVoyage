import axios from 'axios';

const instance = axios.create({
  // .env http://localhost:5000 
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  timeout: 5000, 
});

export default instance;