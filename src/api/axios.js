import axios from "axios";

const API = axios.create({
  // تأكد أن الرابط في Vercel هو: https://your-backend.vercel.app/api
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// 1. إنترسبتور الطلبات (لإرسال التوكن)
API.interceptors.request.use(
  (req) => {
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

// 2. إنترسبتور الاستجابة (لمعالجة الأخطاء الشائعة)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // إذا انتهت صلاحية التوكن أو كان غير صالح (401)
    if (error.response && error.response.status === 401) {
      localStorage.clear(); // مسح البيانات القديمة
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login"; // تحويله للدخول
      }
    }
    return Promise.reject(error);
  }
);

export default API;
