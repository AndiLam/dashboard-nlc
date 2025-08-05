import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_URL || 'https://focfarm.id',
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

export default instance;
