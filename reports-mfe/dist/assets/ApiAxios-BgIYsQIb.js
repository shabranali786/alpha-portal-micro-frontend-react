import { importShared } from './__federation_fn_import-BFo6b6m_.js';

const axios = await importShared('axios');

const apiAxios = axios.create({
  baseURL: "https://tm-brands.digitechtictest.com/api/v2",
  timeout: 12e4,
  headers: {
    "Content-Type": "application/json"
  }
});
apiAxios.interceptors.request.use(
  (config) => {
    const userToken = localStorage.getItem("authToken");
    const token = userToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
apiAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("logging error from interceptor:", error);
    const isAuthError = error.response?.status === 401 && (error.response?.data?.message?.toLowerCase().includes("unauthenticated") || error.response?.data?.message?.toLowerCase().includes("token") || error.response?.data?.error === "Unauthenticated");
    const isAuthException = error.response?.status === 500 && error.response?.data?.error === "AuthenticationException";
    if (isAuthError || isAuthException) {
      const userToken = localStorage.getItem("authToken");
      if (userToken) {
        console.log("Authentication failed - logging out");
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export { apiAxios as a };
