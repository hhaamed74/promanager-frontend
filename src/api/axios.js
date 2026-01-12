import axios from "axios";

const API = axios.create({
  // تأكد أن VITE_API_URL في Vercel تنتهي بـ /api بدون علامة استفهام
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use(
  (req) => {
    // الأفضل تجيب التوكن المباشر اللي خزنته في صفحة الـ Login
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
