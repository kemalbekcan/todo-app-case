import axios from "axios";
import Cookies from "js-cookie";

// Axios instance oluşturma
const instance = axios.create({
  baseURL: "http://localhost:3000", // API'nizin base URL'si
});

// Request interceptor ekleme
instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token") || localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor ekleme
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post("/user/token", null, {
          withCredentials: true,
        });
        const { accessToken } = res.data;

        Cookies.set("token", accessToken) ||
          localStorage.setItem("token", accessToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;

        return axios(originalRequest);
      } catch (err) {
        console.error("Refresh token is expired", err);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
