import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import "../css/Profile.css";
import useTitle from "../hooks/useTitle";

const Profile = () => {
  useTitle("الملف الشخصي 👤");

  // 1. استرجاع البيانات من LocalStorage
  const storedData = JSON.parse(localStorage.getItem("userInfo"));
  const initialUser = storedData?.user || storedData;

  const [name, setName] = useState(initialUser?.name || "");
  const [email, setEmail] = useState(initialUser?.email || "");
  const [file, setFile] = useState(null);
  const [myProjectsCount, setMyProjectsCount] = useState(0);
  const [loading, setLoading] = useState(false);

  /**
   * دالة معالجة رابط الصورة الشخصية (وضع محلي)
   */
  const formatAvatarUrl = (path) => {
    if (!path) return "/default-avatar.png";

    // إذا كان الرابط خارجياً (مثل UI Avatars)
    if (path.startsWith("http") && !path.includes("localhost")) return path;

    // استخراج اسم الملف وربطه بالسيرفر المحلي
    const fileName = path.split(/[\\/]/).pop();
    return `http://localhost:5000/uploads/${fileName}`;
  };

  const [preview, setPreview] = useState(formatAvatarUrl(initialUser?.avatar));

  /**
   * جلب إحصائيات المستخدم
   */
  useEffect(() => {
    const fetchMyStats = async () => {
      try {
        const { data } = await API.get("/projects/my-projects");
        setMyProjectsCount(data.data.length);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchMyStats();
  }, []);

  /**
   * تحديث بيانات الملف الشخصي على السيرفر المحلي
   */
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (file) formData.append("avatar", file);

    try {
      const { data } = await API.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        // تحديث التخزين المحلي بالبيانات المرجعة من السيرفر المحلي
        const updatedUserInfo = {
          token: storedData?.token, // الحفاظ على التوكن القديم
          user: data.user,
        };
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

        // تحديث حالة الواجهة
        setName(data.user.name);
        setEmail(data.user.email);
        setPreview(formatAvatarUrl(data.user.avatar));

        toast.success("تم تحديث بياناتك محلياً بنجاح ✨");

        // تنبيه بقية المكونات (مثل Navbar) لتحديث الصورة والاسم فوراً
        window.dispatchEvent(new Event("storage"));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "فشل تحديث البيانات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page-container">
      <div className="profile-grid">
        {/* الكارت الجانبي: الإحصائيات */}
        <div className="profile-side-card glass-morph animate-fade-in">
          <div className="stat-box">
            <i className="fas fa-project-diagram"></i>
            <h3>{myProjectsCount}</h3>
            <p>مشاريعك المرفوعة</p>
          </div>
          <div className="stat-box">
            <i className="fas fa-award"></i>
            <h3>{initialUser?.role === "admin" ? "مدير" : "عضو"}</h3>
            <p>رتبة الحساب</p>
          </div>
          <div className="profile-tips">
            <p>
              <i className="fas fa-lightbulb"></i> نصيحة: استخدام صورة حقيقية
              يزيد من احترافية ملفك.
            </p>
          </div>
        </div>

        {/* الكارت الرئيسي: نموذج التعديل */}
        <form
          className="profile-main-card glass-morph animate-fade-in"
          onSubmit={handleUpdate}
        >
          <h2>
            إعدادات <span>الحساب</span>
          </h2>

          <div className="avatar-section">
            <div className="img-wrapper">
              <img
                src={preview}
                alt="Avatar"
                className="profile-img"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
              <label htmlFor="avatar-upload" className="upload-icon">
                <i className="fas fa-camera"></i>
              </label>
            </div>
            <input
              type="file"
              id="avatar-upload"
              hidden
              accept="image/*"
              onChange={(e) => {
                const selected = e.target.files[0];
                if (selected) {
                  setFile(selected);
                  setPreview(URL.createObjectURL(selected));
                }
              }}
            />
          </div>

          <div className="form-inputs">
            <div className="input-group">
              <label>
                <i className="fas fa-user"></i> الاسم بالكامل
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسمك الجديد"
                required
              />
            </div>

            <div className="input-group">
              <label>
                <i className="fas fa-envelope"></i> البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                required
              />
            </div>
          </div>

          <button type="submit" className="save-btn" disabled={loading}>
            <i className="fas fa-check-circle"></i>
            {loading ? " جاري الحفظ محلياً..." : " حفظ التغييرات"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
