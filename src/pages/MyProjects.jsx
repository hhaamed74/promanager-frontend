import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import "../css/Projects.css";
import useTitle from "../hooks/useTitle";

/**
 * MyProjects Component
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
        toast.error("فشل تحميل مشاريعك");
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
        toast.error("حدث خطأ أثناء الحذف");
      }
    }
  };

  /**
   * دالة معالجة الروابط المحدثة
   * تتعامل مع روابط Cloudinary مباشرة
   */
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://placehold.co/400x300?text=No+Image";

    // إذا كان الرابط يبدأ بـ http (سحابي) نستخدمه كما هو
    if (imagePath.startsWith("http")) return imagePath;

    // احتياطي للتعامل مع أي مسارات قديمة مخزنة محلياً (إن وجدت)
    return "https://placehold.co/400x300?text=Old+Path+Error";
  };

  if (loading) return <div className="loader">جاري تحميل مشاريعك...</div>;

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h2>
          مشاريعي <span>الخاصة</span>
        </h2>
        <p>هنا يمكنك إدارة وتعديل مشاريعك التي قمت برفعها</p>
      </div>

      <div className="projects-grid">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div className="project-card" key={project._id}>
              <div className="card-image">
                <img
                  src={getImageUrl(project.image)}
                  alt={project.title}
                  loading="lazy" // تحسين الأداء
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/400x300?text=Image+Error";
                  }}
                />
              </div>
              <div className="card-body">
                <h3>{project.title}</h3>
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
            <Link to="/add-project" className="main-btn">
              أضف مشروعك الأول الآن
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
