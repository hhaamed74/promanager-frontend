import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import "../css/EditProject.css";

/**
 * EditProject Component
 * Allows users to fetch existing project data and update it, including file uploads.
 */
const EditProject = () => {
  const { id } = useParams(); // Extract project ID from the URL
  const navigate = useNavigate();

  // Loading and File Management States
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null); // Displays current or newly selected image
  const [file, setFile] = useState(null); // Stores the new file object if changed

  // Form fields state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "قيد الانتظار",
    priority: "متوسطة",
    deadline: "",
    category: "أخرى",
  });

  /**
   * Fetch project details on component mount
   */
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await API.get(`/projects/${id}`);
        if (data.success) {
          const p = data.data;
          // Pre-fill the form with existing data
          setFormData({
            title: p.title,
            description: p.description,
            status: p.status,
            priority: p.priority,
            deadline: p.deadline ? p.deadline.split("T")[0] : "", // Format date for input[type="date"]
            category: p.category,
          });
          // Set initial image preview from server
          setImagePreview(
            `http://localhost:5000/${p.image?.replace(/\\/g, "/")}`
          );
        }
        setLoading(false);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        toast.error("خطأ في جلب بيانات المشروع");
        navigate("/projects");
      }
    };
    fetchProject();
  }, [id, navigate]);

  /**
   * Handle file input change and update local preview
   */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setImagePreview(URL.createObjectURL(selectedFile));
  };

  /**
   * Handle form submission using FormData for multipart/form-data support
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Append text fields to FormData
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    // Append file only if a new one was selected
    if (file) data.append("image", file);

    try {
      await API.put(`/projects/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("تم تحديث المشروع بنجاح");
      navigate(`/project/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "فشل التحديث");
    }
  };

  if (loading) return <div className="loader">جاري تحميل البيانات...</div>;

  return (
    <div className="edit-container">
      <form onSubmit={handleSubmit} className="edit-form card-glass">
        <h2 className="form-title">
          تعديل <span>المشروع</span>
        </h2>

        {/* Image Management Section */}
        <div className="image-upload-section">
          <div className="preview-container">
            <img src={imagePreview} alt="Preview" />
          </div>
          <label htmlFor="file-input" className="file-label">
            تغيير صورة المشروع
          </label>
          <input
            id="file-input"
            type="file"
            onChange={handleFileChange}
            hidden
          />
        </div>

        <div className="form-grid">
          {/* Project Title */}
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

          {/* Category Selection */}
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

          {/* Status Selection */}
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

          {/* Priority Selection */}
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

          {/* Deadline Input */}
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

          {/* Description Textarea */}
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

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
          >
            إلغاء
          </button>
          <button type="submit" className="save-btn">
            حفظ التغييرات
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProject;
