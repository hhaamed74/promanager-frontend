import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/Auth.css";
import useTitle from "../hooks/useTitle";

/**
 * Login Component
 * معالجة تسجيل دخول المستخدم وإدارة الجلسة (Tokens)
 */
const Login = () => {
  useTitle("تسجيل الدخول 🔑");

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false); // لحماية الزر من الضغط المتكرر
  const navigate = useNavigate();

  /**
   * إرسال البيانات للباك إند
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // إرسال طلب تسجيل الدخول
      const { data } = await API.post("/auth/login", formData);

      /**
       * تخزين البيانات في التخزين المحلي (LocalStorage)
       * ملاحظة: تأكد أن الباك إند يعيد 'token' و 'user'
       */
      localStorage.setItem("token", data.token);

      // تخزين بيانات المستخدم مع التأكد من صيغة البيانات
      const userData = data.user || data;
      localStorage.setItem("userInfo", JSON.stringify(userData));

      toast.success("أهلاً بك يا برنس! 👋");

      // التوجه للرئيسية
      navigate("/");

      // إطلاق حدث 'storage' يدوياً لتنبيه الـ Navbar بتحديث البيانات فوراً
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      toast.error(
        err.response?.data?.message || "البريد أو كلمة المرور غير صحيحة"
      );
    } finally {
      setLoading(false);
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
          <div className="input-group">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              autoComplete="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="كلمة المرور"
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "جاري الدخول..." : "دخول"}
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
