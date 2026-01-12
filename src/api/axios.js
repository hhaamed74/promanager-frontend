import axios from "axios";

// Create Axios instance with local development URL
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Request Interceptor to attach the token
API.interceptors.request.use(
  (req) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // Set the Authorization header
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
