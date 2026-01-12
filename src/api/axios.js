import axios from "axios";

/**
 * إعداد Axios للعمل محلياً
 * سيتم استخدام localhost:5000 كمرجع أساسي
 */
const API = axios.create({
  // في الوضع المحلي، نستخدم الرابط المباشر للسيرفر
  baseURL: "http://localhost:5000/api",
});

// Interceptor لإرسال التوكن مع كل طلب
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

// Interceptor إضافي (اختياري) للتعامل مع انتهاء صلاحية التوكن
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // إذا كان السيرفر يرد بـ 401 (غير مصرح به)، غالباً التوكن انتهى أو تالف
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      // يمكنك هنا توجيه المستخدم لصفحة تسجيل الدخول إذا أردت
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
