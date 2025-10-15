// frontend/src/api/axiosConfig.ts

import axios from 'axios';

// Cria uma instância do axios com a URL base da nossa API
const apiClient = axios.create({
  // REMOVEMOS AS ASPAS. Agora o valor da variável será lido.
  baseURL: import.meta.env.VITE_API_URL, 
});

// Interceptor de requisição: será executado ANTES de cada requisição
// (Esta parte já estava perfeita!)
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