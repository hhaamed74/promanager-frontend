import axios from "axios";

// إنشاء نسخة Axios مع رابط متغير
const API = axios.create({
  // إذا وجد رابط في المتغيرات البيئية يستخدمه، وإلا يستخدم localhost للتطوير المحلي
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// إرسال التوكن مع كل طلب بشكل تلقائي
API.interceptors.request.use((req) => {
  // جلب التوكن من userInfo المخزن في الـ localStorage
  const userInfo = localStorage.getItem("userInfo");
  const token = userInfo ? JSON.parse(userInfo).token : null;

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
