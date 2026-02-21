import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 15000,
});

const refreshClient = axios.create({
  baseURL: "/api",
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

    if (refreshFailed || isRefresh) {
      return Promise.reject(error);
    }

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
      refreshFailed = false;

      // Retry original request (cookies now updated)
      return API(originalRequest);
    } catch (e) {
      refreshPromise = null;
      refreshFailed = true;

      // Force logout in app
      window.dispatchEvent(new Event("auth:logout"));

      return Promise.reject(e);
    }
  }
);

export default API;