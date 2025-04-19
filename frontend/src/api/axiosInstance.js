import axios from "axios";

const api = axios.create({
  baseURL: "https://blog-admin-panel-vgyg.onrender.com/api/v1",
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = "/login";
      localStorage.removeItem("user");
    }
    return Promise.reject(err);
  }
);

export default api;
