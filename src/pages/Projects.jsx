import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "../css/Projects.css";
import useTitle from "../hooks/useTitle";

/**
 * Projects Component
 * عرض كافة المشاريع المتاحة على السيرفر المحلي
 */
const Projects = () => {
  useTitle("المشاريع 📂");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("الكل");

  /**
   * تنسيق روابط الصور للعمل مع localhost:5000
   * @param {string} path - المسار المخزن في قاعدة البيانات
   * @param {boolean} isAvatar - هل الصورة هي أفاتار مستخدم؟
   */
  const formatImageUrl = (path, isAvatar = false) => {
    if (!path) {
      return isAvatar
        ? "/default-avatar.png"
        : "https://placehold.co/400x300?text=No+Image";
    }

    // إذا كان الرابط خارجياً (مثل UI Avatars)
    if (path.startsWith("http") && !path.includes("localhost")) return path;

    // استخراج اسم الملف للربط مع السيرفر المحلي
    const fileName = path.split(/[\\/]/).pop();
    return `http://localhost:5000/uploads/${fileName}`;
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await API.get("/projects");
        if (response.data.success) {
          setProjects(response.data.data);
        }
      } catch (err) {
        console.error("Local Server Error:", err);
        toast.error("فشل جلب المشاريع من السيرفر المحلي");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "الكل" || project.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المشروع نهائياً؟")) {
      try {
        const response = await API.delete(`/projects/${id}`);
        if (response.data.success) {
          setProjects(projects.filter((project) => project._id !== id));
          toast.success("تم الحذف بنجاح من السيرفر");
        }
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        toast.error("فشل في حذف المشروع");
      }
    }
  };

  if (loading)
    return <div className="loader">جاري الاتصال بالسيرفر المحلي...</div>;

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h2>
          معرض <span>المشاريع</span>
        </h2>
        <p>استكشف الإبداعات المخزنة محلياً على نظامك</p>
      </div>

      <div className="filter-wrapper card-glass">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="بحث..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-tags">
          {["الكل", "برمجة", "تصميم", "تسويق", "إدارة", "أخرى"].map((cat) => (
            <button
              key={cat}
              className={`tag-btn ${filterCategory === cat ? "active" : ""}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="projects-grid">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div className="project-card animate-fade-in" key={project._id}>
              <div className="card-image">
                <img
                  src={formatImageUrl(project.image)}
                  alt={project.title}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/400x300?text=Image+Error";
                  }}
                />
                <span
                  className={`status-badge ${
                    project.status === "مكتمل" ? "completed" : "pending"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <div className="card-body">
                <div className="project-user-info">
                  <img
                    src={formatImageUrl(project.user?.avatar, true)}
                    alt="avatar"
                    className="user-small-avatar"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                  <span className="user-name-text">
                    بواسطة: {project.user?.name || "مستخدم"}
                  </span>
                </div>

                <div className="card-meta">
                  <span className={`priority-tag ${project.priority}`}>
                    {project.priority}
                  </span>
                  <span className="category-text">{project.category}</span>
                </div>

                <h3>{project.title}</h3>
                <p className="description-text">{project.description}</p>

                <div className="card-footer">
                  <div className="deadline-info">
                    <i className="far fa-calendar-alt"></i>
                    <span>
                      {" "}
                      ينتهي في:{" "}
                      {new Date(project.deadline).toLocaleDateString("ar-EG")}
                    </span>
                  </div>
                </div>

                <div className="card-actions">
                  <Link to={`/project/${project._id}`} className="view-btn">
                    تفاصيل
                  </Link>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(project._id)}
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-projects">
            <p>لا توجد نتائج مطابقة لبحثك.. 🔍</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
