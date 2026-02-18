


import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,  //Backend
  withCredentials: true,
});


API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await API.post("/auth/refreshtoken"); 
        return API(originalRequest);          
      } catch (e) {
       
        return Promise.reject(e);
      }
    }

    return Promise.reject(error); // Stop here and mark this async function as failed.
  }
);

export default API;
