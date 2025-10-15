// frontend/src/api/axiosConfig.ts

import axios from 'axios';



// Cria uma instância do axios com a URL base da nossa API
const apiClient = axios.create({
  // A URL PRECISA ser COMPLETA, incluindo http://, o host e a porta do SEU back-end
  baseURL: 'import.meta.env.VITE_API_URL' as string, // Exemplo: 'http://localhost:3001'
});

// Interceptor de requisição: será executado ANTES de cada requisição
apiClient.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      // Se o token existir, adiciona ao cabeçalho de autorização
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;