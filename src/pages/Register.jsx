import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/Auth.css";
import useTitle from "../hooks/useTitle";

/**
 * Register Component
 * معالجة إنشاء حساب جديد والتحقق من تطابق كلمات المرور
 */
const Register = () => {
  useTitle("إنشاء حساب جديد ✨");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false); // لحماية الزر أثناء الإرسال
  const navigate = useNavigate();

  /**
   * معالجة إرسال النموذج
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. التحقق من تطابق كلمة المرور (Client-side)
    if (formData.password !== formData.confirmPassword) {
      return toast.warn("كلمات المرور غير متطابقة ⚠️");
    }

    setLoading(true);

    try {
      // 2. إرسال البيانات للباك إند
      const { data } = await API.post("/auth/register", formData);

      if (data.success || data) {
        toast.success("تم إنشاء الحساب بنجاح! سجل دخولك الآن 🚀");
        navigate("/login");
      }
    } catch (err) {
      // معالجة الأخطاء (مثل: البريد مسجل مسبقاً)
      toast.error(
        err.response?.data?.message || "فشل إنشاء الحساب، حاول مجدداً"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-in">
        <div className="auth-header">
          <h2>إنشاء حساب جديد</h2>
          <p>انضم إلى ProManager وإبدأ إدارة مشاريعك باحترافية</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              type="text"
              required
              placeholder="الاسم الكامل"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              required
              placeholder="البريد الإلكتروني"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              required
              placeholder="كلمة المرور"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              required
              placeholder="تأكيد كلمة المرور"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
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
