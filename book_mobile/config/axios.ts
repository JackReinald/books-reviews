import axios from 'axios';
import { API_URL } from './constants';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 segundos en caso de lenta conexión
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default apiClient;