import { useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import "../css/Auth.css";
import useTitle from "../hooks/useTitle";

/**
 * AddProject Component
 * Handles the creation of new projects including title, description, deadline, and image upload.
 */
const AddProject = () => {
  useTitle("إضافة مشروع جديد ➕"); // Set dynamic page title

  // State hooks for form inputs and image management
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState(""); // Stores the project completion date
  const [image, setImage] = useState(null); // Stores the actual file object
  const [preview, setPreview] = useState(null); // Stores the local URL for image preview

  /**
   * Handle image selection and generate a preview URL
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  /**
   * Submit form data to the server using FormData (required for file uploads)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for the deadline field
    if (!deadline) return toast.error("يا فنان لازم تحدد موعد انتهاء للمشروع!");

    // Initialize FormData to handle multipart/form-data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("deadline", deadline);
    if (image) formData.append("image", image);

    try {
      // POST request to the projects endpoint
      await API.post("/projects", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("المشروع اتضاف والديدلاين اتحدد! 🚀");

      // Optional: Reset form or navigate after success
    } catch (err) {
      console.error(err.response?.data);
      toast.error(err.response?.data?.message || "مشكلة في الرفع");
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
          {/* Project Title Input */}
          <div className="input-group">
            <input
              type="text"
              placeholder="عنوان المشروع"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Project Description Input */}
          <div className="input-group">
            <textarea
              placeholder="وصف المشروع..."
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="3"
            />
          </div>

          {/* Project Deadline Date Picker */}
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
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>

          {/* Custom File Upload Section */}
          <div className="file-input-wrapper">
            <label className="file-label">
              <span>
                {image ? "✅ تم اختيار الصورة" : "📸 ارفع صورة المشروع"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </label>
            {/* Real-time Image Preview */}
            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Preview" />
              </div>
            )}
          </div>

          {/* Submission Button */}
          <button type="submit" className="auth-btn">
            نشر المشروع الآن
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
