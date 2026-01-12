import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import "../css/Dashboard.css";
import useTitle from "../hooks/useTitle";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import * as XLSX from "xlsx";

const AdminDashboard = () => {
  useTitle("لوحة التحكم 📊");

  const [stats, setStats] = useState({ users: 0, projects: 0, completed: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          API.get("/auth/stats"),
          API.get("/auth/users"),
        ]);
        setStats(statsRes.data.stats);
        setUsers(usersRes.data.data);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error("فشل في جلب بيانات اللوحة");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  /**
   * تعديل: دالة معالجة الصورة الشخصية
   * أصبحت ترجع الرابط كما هو لأنه رابط Cloudinary كامل
   */
  const formatAvatar = (avatarPath) => {
    if (!avatarPath) return "/default-avatar.png";
    // إذا كان الرابط يبدأ بـ http (رابط سحابي) نستخدمه مباشرة
    if (avatarPath.startsWith("http")) return avatarPath;
    // احتياطي لأي بيانات قديمة
    return "/default-avatar.png";
  };

  // بيانات الرسوم البيانية
  const barData = [
    { name: "المستخدمين", value: stats.users, color: "#3b82f6" },
    { name: "المشاريع", value: stats.projects, color: "#8b5cf6" },
    { name: "المكتملة", value: stats.completed, color: "#10b981" },
  ];

  const pieData = [
    { name: "مكتمل", value: stats.completed, color: "#10b981" },
    {
      name: "قيد التنفيذ",
      value: stats.projects - stats.completed,
      color: "#f59e0b",
    },
  ];

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(users);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "المستخدمين");
    XLSX.writeFile(wb, "قائمة_المستخدمين.xlsx");
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المستخدم نهائياً؟")) {
      try {
        await API.delete(`/auth/users/${id}`);
        setUsers(users.filter((u) => u._id !== id));
        setStats((prev) => ({ ...prev, users: prev.users - 1 }));
        toast.success("تم حذف المستخدم بنجاح");
      } catch (error) {
        toast.error(error.response?.data?.message || "فشل الحذف");
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await API.put(`/auth/users/${id}/toggle`);
      setUsers(
        users.map((u) =>
          u._id === id ? { ...u, isActive: res.data.status } : u
        )
      );
      toast.info(res.data.message);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("فشل تغيير حالة الحساب");
    }
  };

  if (loading) return <div className="loader">جاري تحميل لوحة التحكم...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>
            لوحة تحكم <span>المدير</span>
          </h2>
          <button onClick={exportToExcel} className="export-btn">
            تصدير Excel <i className="fas fa-file-excel"></i>
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <h3>إجمالي الأعضاء</h3>
              <p>{stats.users}</p>
            </div>
            <i className="fas fa-users icon"></i>
          </div>
          <div className="stat-card blue">
            <div className="stat-info">
              <h3>المشاريع المرفوعة</h3>
              <p>{stats.projects}</p>
            </div>
            <i className="fas fa-project-diagram icon"></i>
          </div>
          <div className="stat-card green">
            <div className="stat-info">
              <h3>مشاريع منجزة</h3>
              <p>{stats.completed}</p>
            </div>
            <i className="fas fa-check-circle icon"></i>
          </div>
        </div>

        <div className="charts-wrapper">
          <div className="chart-box card-glass">
            <h3>إحصائيات المنصة</h3>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#94a3b8" }}
                  axisLine={false}
                />
                <YAxis tick={{ fill: "#94a3b8" }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" radius={[5, 5, 0, 0]} barSize={50}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box card-glass">
            <h3>نسبة الإنجاز</h3>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="table-header-actions">
          <h3>إدارة المستخدمين</h3>
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="ابحث بالاسم أو البريد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>المستخدم</th>
                <th>البريد</th>
                <th>الصلاحية</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="user-cell">
                      <img
                        src={formatAvatar(u.avatar)}
                        alt="avatar"
                        onError={(e) => (e.target.src = "/default-avatar.png")}
                      />
                      {u.name}
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-badge ${u.role}`}>
                      {u.role === "admin" ? "مدير" : "عضو"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-indicator ${
                        u.isActive ? "active" : "inactive"
                      }`}
                    >
                      {u.isActive ? "نشط" : "معطل"}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        onClick={() => handleToggleStatus(u._id)}
                        className={`action-btn toggle ${
                          u.isActive ? "deactivate" : "activate"
                        }`}
                        title={u.isActive ? "تعطيل" : "تفعيل"}
                      >
                        <i
                          className={`fas fa-user-${
                            u.isActive ? "slash" : "check"
                          }`}
                        ></i>
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="action-btn delete"
                        title="حذف"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
