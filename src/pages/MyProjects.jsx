import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import "../css/Projects.css";
import useTitle from "../hooks/useTitle";

/**
 * MyProjects Component
 * عرض وإدارة المشاريع الخاصة بالمستخدم المسجل حالياً
 */
const MyProjects = () => {
  useTitle("مشاريعي الخاصة 👤");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        const { data } = await API.get("/projects/my-projects");
        if (data.success) {
          setProjects(data.data);
        }
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        toast.error("فشل تحميل مشاريعك الخاصة");
      } finally {
        setLoading(false);
      }
    };
    fetchMyProjects();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("هل تريد حذف مشروعك نهائياً؟")) {
      try {
        await API.delete(`/projects/${id}`);
        setProjects(projects.filter((p) => p._id !== id));
        toast.success("تم الحذف بنجاح");
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        toast.error("حدث خطأ أثناء محاولة الحذف");
      }
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://placehold.co/400x300?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    const fileName = imagePath.split(/[\\/]/).pop();
    return `http://localhost:5000/uploads/${fileName}`;
  };

  if (loading) return <div className="loader">جاري تحميل مشاريعك...</div>;

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h2>
          مشاريعي <span>الخاصة</span>
        </h2>
        <p>إدارة وتحرير المشاريع التي قمت بنشرها</p>
      </div>

      <div className="projects-grid">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div className="project-card animate-fade-in" key={project._id}>
              {/* قسم الصورة والحالة */}
              <div className="card-image">
                <img
                  src={getImageUrl(project.image)}
                  alt={project.title}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/400x300?text=Image+Not+Found";
                  }}
                />
                <span
                  className={`status-badge ${
                    project.status === "مكتمل" ? "completed" : "pending"
                  }`}
                >
                  {project.status || "قيد التنفيذ"}
                </span>
              </div>

              {/* محتوى الكارت */}
              <div className="card-body">
                <div className="card-meta">
                  <span className={`priority-tag ${project.priority}`}>
                    {project.priority || "متوسطة"}
                  </span>
                  <span className="category-text">{project.category}</span>
                </div>

                <h3>{project.title}</h3>
                <p className="description-text">{project.description}</p>

                {/* تاريخ الانتهاء */}
                <div className="card-footer">
                  <div className="deadline-info">
                    <i className="far fa-calendar-alt"></i>
                    <span>
                      ينتهي في:{" "}
                      {new Date(project.deadline).toLocaleDateString("ar-EG")}
                    </span>
                  </div>
                </div>

                {/* أزرار التحكم */}
                <div className="card-actions">
                  <Link
                    to={`/edit-project/${project._id}`}
                    className="view-btn"
                  >
                    تعديل
                  </Link>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="delete-btn"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-projects">
            <p>لم تقم بإضافة أي مشاريع بعد.</p>
            <Link
              to="/add-project"
              className="tag-btn active"
              style={{
                textDecoration: "none",
                marginTop: "20px",
                display: "inline-block",
              }}
            >
              أضف مشروعك الأول الآن
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
