import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'https://focfarm.id';


window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
