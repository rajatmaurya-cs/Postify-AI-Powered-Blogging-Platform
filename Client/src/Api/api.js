
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;
const ACCESS_TOKEN_KEY = "postify_access_token";
const REFRESH_TOKEN_KEY = "postify_refresh_token";

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

export const tokenStore = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: ({ accessToken, refreshToken }) => {
    refreshFailed = false;
    if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

API.interceptors.request.use((config) => {
  const token = tokenStore.getAccessToken();
  if (token && !config.headers?.Authorization) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
        const refreshToken = tokenStore.getRefreshToken();
        refreshPromise = refreshClient.post(
          "/auth/refreshtoken",
          refreshToken ? { refreshToken } : {}
        );
      }
      const refreshRes = await refreshPromise;
      if (originalRequest?.headers && refreshRes.data?.accessToken) {
        originalRequest.headers.Authorization = `Bearer ${refreshRes.data.accessToken}`;
      }
      tokenStore.setTokens({
        accessToken: refreshRes.data?.accessToken,
        refreshToken: refreshRes.data?.refreshToken,
      });
      refreshPromise = null;
      refreshFailed = false;

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
