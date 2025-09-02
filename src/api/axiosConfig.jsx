import axios from 'axios';

const apiClient = axios.create({

  // baseURL: 'https://68b002483b8db1ae9c0260c6.mockapi.io',
  // baseURL: 'http://localhost:3001',
  
  // baseURL: 'http://127.0.0.1:8000/api', 
  baseURL: 'import.meta.env.VITE_API_URL',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;