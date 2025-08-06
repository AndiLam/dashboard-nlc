import axios from '@/lib/axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_URL, // => akan dibaca dari .env
  withCredentials: true,
});

export default axiosInstance;
