import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://focfarm.id',
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

export default instance;
