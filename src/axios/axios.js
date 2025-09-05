import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.VITE_BASE_URL
});

export default axiosInstance;