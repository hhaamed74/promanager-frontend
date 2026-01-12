import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import "../css/ProjectDetails.css";
import useTitle from "../hooks/useTitle";

/**
 * ProjectDetails Component
 * يعرض التفاصيل الكاملة للمشروع مع جلب الصور من السيرفر المحلي
 */
const ProjectDetails = () => {
  useTitle("تفاصيل المشروع 📄");

  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await API.get(`/projects/${id}`);
        if (response.data.success) {
          setProject(response.data.data);
        }
        setLoading(false);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        toast.error("فشل في الوصول لبيانات المشروع");
        navigate("/projects");
      }
    };
    fetchProject();
  }, [id, navigate]);

  /**
   * دالة معالجة الصورة للعرض المحلي
   */
  const getFullImageUrl = (imagePath) => {
    if (!imagePath)
      return "https://placehold.co/800x400?text=No+Image+Available";

    // إذا كان رابطاً خارجياً
    if (imagePath.startsWith("http") && !imagePath.includes("localhost"))
      return imagePath;

    // استخراج اسم الملف للربط مع مجلد الرفع المحلي
    const fileName = imagePath.split(/[\\/]/).pop();
    return `http://localhost:5000/uploads/${fileName}`;
  };

  if (loading) return <div className="loader">جاري فتح ملفات المشروع...</div>;
  if (!project)
    return <div className="loader">عذراً، لم يتم العثور على المشروع</div>;

  return (
    <div className="details-container">
      {/* زر الرجوع */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-right"></i> العودة للخلف
      </button>

      <div className="details-card animate-fade-in">
        <div className="details-image">
          <img
            src={getFullImageUrl(project.image)}
            alt={project.title}
            onError={(e) => {
              e.target.src =
                "https://placehold.co/800x400?text=Image+Not+Found";
            }}
          />
        </div>

        <div className="details-content">
          <div className="details-header">
            <h1>{project.title}</h1>
            <span
              className={`status-badge ${
                project.status === "مكتمل"
                  ? "status-completed"
                  : "status-pending"
              }`}
            >
              {project.status}
            </span>
          </div>

          <div className="details-meta">
            <div className="meta-item">
              <strong>الأولوية:</strong>
              <span className={`priority-tag ${project.priority}`}>
                {project.priority}
              </span>
            </div>
            <div className="meta-item">
              <strong>القسم:</strong>
              <span>{project.category}</span>
            </div>
            <div className="meta-item">
              <strong>تاريخ التسليم:</strong>
              <span>
                {new Date(project.deadline).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="details-description">
            <h3>وصف المشروع</h3>
            <p>{project.description}</p>
          </div>

          <div className="details-actions">
            <button
              className="edit-btn"
              onClick={() => navigate(`/edit-project/${project._id}`)}
            >
              تعديل بيانات المشروع
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
