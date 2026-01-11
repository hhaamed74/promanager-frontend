import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/Auth.css";
import useTitle from "../hooks/useTitle";

/**
 * Register Component
 * Handles new user account creation and initial validation.
 */
const Register = () => {
  useTitle("إنشاء حساب جديد ✨");

  // Local state for registration fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  /**
   * handleSubmit: Validates passwords and sends registration data to the server
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side password match validation
    if (formData.password !== formData.confirmPassword) {
      return toast.warn("كلمات المرور غير متطابقة ⚠️");
    }

    try {
      const { data } = await API.post("/auth/register", formData);

      if (data.success || data) {
        toast.success("تم إنشاء الحساب بنجاح! سجل دخولك الآن 🚀");
        navigate("/login");
      }
    } catch (err) {
      // Handles server-side errors (e.g., email already exists)
      toast.error(
        err.response?.data?.message || "فشل إنشاء الحساب، حاول مجدداً"
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>إنشاء حساب جديد</h2>
          <p>انضم إلى ProManager وإبدأ إدارة مشاريعك باحترافية</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Full Name Input */}
          <div className="input-group">
            <input
              type="text"
              required
              placeholder="الاسم الكامل"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          {/* Email Address Input */}
          <div className="input-group">
            <input
              type="email"
              required
              placeholder="البريد الإلكتروني"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <input
              type="password"
              required
              placeholder="كلمة المرور"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          {/* Confirm Password Input */}
          <div className="input-group">
            <input
              type="password"
              required
              placeholder="تأكيد كلمة المرور"
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
          </div>

          <button type="submit" className="auth-btn">
            إنشاء الحساب
          </button>
        </form>

        <div className="auth-footer">
          <span>لديك حساب بالفعل؟</span>
          <Link to="/login">تسجيل الدخول</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
