import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import "../css/ProjectDetails.css";
import useTitle from "../hooks/useTitle";

/**
 * ProjectDetails Component
 * يعرض التفاصيل الكاملة لمشروع معين باستخدام الـ ID.
 */
const ProjectDetails = () => {
  useTitle("تفاصيل المشروع");

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
        toast.error("حدث خطأ في جلب بيانات المشروع");
        navigate("/projects");
      }
    };
    fetchProject();
  }, [id, navigate]);

  // دالة ذكية للتعامل مع رابط الصورة
  const getFullImageUrl = (imagePath) => {
    if (!imagePath)
      return "https://placehold.co/800x400?text=No+Image+Available";
    if (imagePath.startsWith("http")) return imagePath; // رابط Cloudinary جاهز
    return "/default-project-image.jpg"; // احتياطي
  };

  if (loading) return <div className="loader">جاري تحميل التفاصيل...</div>;
  if (!project) return <div className="loader">المشروع غير موجود</div>;

  return (
    <div className="details-container">
      {/* زر الرجوع */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ⬅ رجوع
      </button>

      <div className="details-card animate-fade-in">
        <div className="details-image">
          <img
            src={getFullImageUrl(project.image)}
            alt={project.title}
            onError={(e) => {
              e.target.src =
                "https://placehold.co/800x400?text=Error+Loading+Image";
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
              تعديل البيانات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
