// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:3000', 
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });


// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('logintoken'); 
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default axiosInstance; 



import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('logintoken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Correct export
export default axiosInstance;
