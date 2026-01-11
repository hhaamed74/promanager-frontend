import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import "../css/ProjectDetails.css";
import useTitle from "../hooks/useTitle";

/**
 * ProjectDetails Component
 * Fetches and displays full information about a specific project using its ID from the URL.
 */
const ProjectDetails = () => {
  useTitle("تفاصيل المشروع");

  const { id } = useParams(); // Retrieves the project ID from the route parameters
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches specific project data on component mount
   */
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
        navigate("/projects"); // Fallback to projects list if project not found
      }
    };
    fetchProject();
  }, [id, navigate]);

  if (loading) return <div className="loader">جاري تحميل التفاصيل...</div>;
  if (!project) return <div className="loader">المشروع غير موجود</div>;

  return (
    <div className="details-container">
      {/* Navigation: Back button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ⬅ رجوع
      </button>

      <div className="details-card">
        {/* Project Visual Branding */}
        <div className="details-image">
          <img
            src={
              project.image
                ? `http://localhost:5000/${project.image.replace(/\\/g, "/")}`
                : "https://placehold.co/800x400?text=No+Image+Available"
            }
            alt={project.title}
          />
        </div>

        <div className="details-content">
          <div className="details-header">
            <h1>{project.title}</h1>
            <span
              className={`status-badge ${
                project.status === "مكتمل" ? "completed" : "pending"
              }`}
            >
              {project.status}
            </span>
          </div>

          {/* Metadata Section */}
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

          {/* Action Footer */}
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
