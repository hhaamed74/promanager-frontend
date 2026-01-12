import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import "../css/EditProject.css";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "قيد الانتظار",
    priority: "متوسطة",
    deadline: "",
    category: "أخرى",
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await API.get(`/projects/${id}`);
        if (data.success) {
          const p = data.data;
          setFormData({
            title: p.title,
            description: p.description,
            status: p.status,
            priority: p.priority,
            deadline: p.deadline ? p.deadline.split("T")[0] : "",
            category: p.category,
          });

          // تعديل محلي: معالجة رابط الصورة القادم من السيرفر المحلي
          if (p.image) {
            const fileName = p.image.split(/[\\/]/).pop();
            setImagePreview(`http://localhost:5000/uploads/${fileName}`);
          }
        }
        setLoading(false);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        toast.error("خطأ في جلب بيانات المشروع من السيرفر المحلي");
        navigate("/my-projects");
      }
    };
    fetchProject();
  }, [id, navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // إنشاء رابط معاينة مؤقت للصورة الجديدة المختارة
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    // إضافة الملف الجديد إذا تم اختياره
    if (file) data.append("image", file);

    try {
      await API.put(`/projects/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("تم التحديث محلياً بنجاح! 🚀");
      navigate(`/my-projects`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "فشل التحديث على السيرفر المحلي"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return <div className="loader">جاري تحميل بيانات المشروع...</div>;

  return (
    <div className="edit-container">
      <form onSubmit={handleSubmit} className="edit-form card-glass">
        <h2 className="form-title">
          تعديل <span>المشروع</span>
        </h2>

        <div className="image-upload-section">
          <div className="preview-container">
            <img
              src={imagePreview || "https://placehold.co/300x200?text=No+Image"}
              alt="Preview"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/300x200?text=Error+Loading";
              }}
            />
          </div>
          <label htmlFor="file-input" className="file-label">
            {file ? "✅ صورة جديدة جاهزة" : "تغيير الصورة (Local)"}
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
        </div>

        <div className="form-grid">
          <div className="input-group">
            <label>عنوان المشروع</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="input-group">
            <label>القسم</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="برمجة">برمجة</option>
              <option value="تصميم">تصميم</option>
              <option value="تسويق">تسويق</option>
              <option value="إدارة">إدارة</option>
              <option value="أخرى">أخرى</option>
            </select>
          </div>

          <div className="input-group">
            <label>الحالة</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="قيد الانتظار">قيد الانتظار</option>
              <option value="جاري العمل">جاري العمل</option>
              <option value="مكتمل">مكتمل</option>
            </select>
          </div>

          <div className="input-group">
            <label>الأولوية</label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
            >
              <option value="عالية">عالية</option>
              <option value="متوسطة">متوسطة</option>
              <option value="منخفضة">منخفضة</option>
            </select>
          </div>

          <div className="input-group full-width">
            <label>تاريخ الانتهاء</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              required
            />
          </div>

          <div className="input-group full-width">
            <label>وصف المشروع</label>
            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
          >
            تراجع
          </button>
          <button type="submit" className="save-btn" disabled={isSubmitting}>
            {isSubmitting ? "جاري الحفظ..." : "حفظ التعديلات"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProject;
