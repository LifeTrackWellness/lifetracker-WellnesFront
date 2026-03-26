import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Error inesperado";
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;
