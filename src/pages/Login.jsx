import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/Auth.css";
import useTitle from "../hooks/useTitle";

/**
 * Login Component
 * Handles user authentication, token storage, and session initialization.
 */
const Login = () => {
  useTitle("تسجيل الدخول 🔑");

  // Local state for credentials
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  /**
   * handleSubmit: Manages the login request and stores authentication data
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // POST request to the authentication endpoint
      const { data } = await API.post("/auth/login", formData);

      /**
       * Auth Success Logic:
       * 1. Store the JWT token for Axios interceptors
       * 2. Store user info (profile, role, name) for UI consumption
       */
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user || data));

      toast.success("أهلاً بك يا برنس! 👋");

      // Redirect to the home page after successful login
      navigate("/");
    } catch (err) {
      // Error handling with dynamic messaging from server
      toast.error(err.response?.data?.message || "خطأ في البيانات");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>تسجيل الدخول</h2>
          <p>مرحباً بعودتك! سجل دخولك لمتابعة مشاريعك</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email Input Field */}
          <div className="input-group">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              autoComplete="email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          {/* Password Input Field */}
          <div className="input-group">
            <input
              type="password"
              placeholder="كلمة المرور"
              autoComplete="current-password"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <button type="submit" className="auth-btn">
            دخول
          </button>
        </form>

        <div className="auth-footer">
          <span>ليس لديك حساب؟</span>
          <Link to="/register">إنشاء حساب جديد</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
