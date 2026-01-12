import { useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../css/Auth.css";
import useTitle from "../hooks/useTitle";

/**
 * AddProject Component
 * لرفع المشاريع وحفظها في مجلد uploads المحلي
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
  const [loading, setLoading] = useState(false);

  /**
   * معالجة اختيار الصورة وعرض المعاينة الفورية
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  /**
   * إرسال البيانات إلى السيرفر المحلي
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!deadline) return toast.error("برجاء تحديد موعد انتهاء للمشروع");

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("deadline", deadline);
    if (image) formData.append("image", image);

    try {
      // إرسال الطلب للسيرفر المحلي
      await API.post("/projects", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("تمت إضافة المشروع بنجاح 🚀");

      // التوجيه لصفحة المشاريع
      setTimeout(() => {
        navigate("/my-projects");
      }, 1500);
    } catch (err) {
      console.error(err.response?.data);
      toast.error(
        err.response?.data?.message || "حدث خطأ أثناء رفع البيانات، حاول مجدداً"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card project-card animate-fade-in">
        <div className="auth-header">
          <h2>إضافة مشروع جديد 📁</h2>
          <p>أدخل بيانات المشروع وصورة المعاينة</p>
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
              placeholder="اكتب وصفاً مختصراً للمشروع..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="3"
            />
          </div>

          <div className="input-group">
            <label className="date-label">تاريخ التسليم المتوقع:</label>
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
                {image ? "✅ تم اختيار الصورة" : "📸 اختر صورة للمشروع"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Preview" />
              </div>
            )}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "جاري الحفظ..." : "حفظ المشروع"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
