import axios from "axios";
import { toast } from "react-hot-toast";

const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
const baseUrl = apiUrl.startsWith("http") ? apiUrl : `http://${apiUrl}`;

export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the request config has showToast set to false
    const showToast = error.config?.showToast ?? true;

    const errorMessage =
      error?.response?.data?.message || error?.message || "An error occurred";

    if (showToast) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

// Helper type to extend axios request config
declare module "axios" {
  export interface AxiosRequestConfig {
    showToast?: boolean;
  }
}
