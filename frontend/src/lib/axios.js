import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // CORS için gerekli
});

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

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post("http://localhost:3000/user/token", null, {
          withCredentials: true,
        });
        const { accessToken } = res.data;

        Cookies.set("token", accessToken) ||
          localStorage.setItem("token", accessToken);
        instance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;

        return instance(originalRequest);
      } catch (err) {
        console.error("Refresh token is expired", err);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
