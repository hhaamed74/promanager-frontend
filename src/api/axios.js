import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // رابط الباك إيند بتاعك
});

// السطر ده وظيفته يبعت التوكن أوتوماتيك مع كل طلب لو موجود
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
