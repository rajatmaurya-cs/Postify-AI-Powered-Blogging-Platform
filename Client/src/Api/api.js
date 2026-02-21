// api.js
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

let refreshPromise = null;
let refreshFailed = false;

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (!error.response) return Promise.reject(error);

    const isRefresh = originalRequest?.url?.includes("/auth/refreshtoken");

    if (refreshFailed || isRefresh) return Promise.reject(error);

    if (error.response.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshClient.post("/auth/refreshtoken");
      }
      await refreshPromise;
      refreshPromise = null;

      return API(originalRequest);
    } catch (e) {
      refreshPromise = null;
      refreshFailed = true;
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(e);
    }
  }
);

export default API;