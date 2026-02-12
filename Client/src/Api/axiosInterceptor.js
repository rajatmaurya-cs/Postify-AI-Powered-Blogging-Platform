import API from "./api";

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

API.interceptors.request.use((config) => {

 

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default API;
