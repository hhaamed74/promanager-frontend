import { useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // أضفنا هذا للتوجيه بعد النجاح
import "../css/Auth.css";
import useTitle from "../hooks/useTitle";

/**
 * AddProject Component
 */
const AddProject = () => {
  useTitle("إضافة مشروع جديد ➕");
  const navigate = useNavigate();

  // State hooks
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false); // لحماية الزر من الضغط المتكرر

  /**
   * معالجة اختيار الصورة وعرض المعاينة
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  /**
   * إرسال البيانات
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!deadline) return toast.error("يا فنان لازم تحدد موعد انتهاء للمشروع!");

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("deadline", deadline);
    if (image) formData.append("image", image);

    try {
      // POST request
      await API.post("/projects", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("المشروع اتضاف والديدلاين اتحدد! 🚀");

      // توجيه المستخدم لصفحة مشاريعي بعد ثانية واحدة
      setTimeout(() => {
        navigate("/my-projects");
      }, 1500);
    } catch (err) {
      console.error(err.response?.data);
      toast.error(
        err.response?.data?.message || "مشكلة في الرفع، تأكد من حجم الصورة"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card project-card">
        <div className="auth-header">
          <h2>إضافة إبداع جديد 📁</h2>
          <p>املاً البيانات وحدد موعد التسليم</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="عنوان المشروع"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <textarea
              placeholder="وصف المشروع..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="3"
            />
          </div>

          <div className="input-group">
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "var(--text-muted)",
              }}
            >
              تاريخ التسليم (Deadline):
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>

          <div className="file-input-wrapper">
            <label className="file-label">
              <span>
                {image ? "✅ تم اختيار الصورة" : "📸 ارفع صورة المشروع"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required // اختياري حسب رغبتك
              />
            </label>
            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Preview" />
              </div>
            )}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "جاري الرفع لـ Cloudinary..." : "نشر المشروع الآن"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
