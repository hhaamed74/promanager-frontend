import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";
import "../css/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  // 1. دالة جلب الإشعارات وفلترتها
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await API.get("/auth/activities");
      const allNotifs = res.data.data || [];

      // نجلب قائمة الـ IDs التي قام المستخدم بمسحها سابقاً
      const clearedIds = JSON.parse(
        localStorage.getItem("clearedNotifIds") || "[]"
      );

      // نقوم بتصفية الإشعارات: نظهر فقط التي لم يسبق مسحها
      const visibleNotifs = allNotifs.filter((n) => {
        const id = String(n._id || n.id || "");
        return !clearedIds.includes(id);
      });

      setNotifications(visibleNotifs);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  }, []);

  // 2. دالة مسح الإشعارات (إضافتها للقائمة السوداء محلياً)
  const handleClearNotifications = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // استخراج الـ IDs من الإشعارات الظاهرة حالياً فقط
    const idsToHide = notifications.map((n) => String(n._id || n.id || ""));

    const alreadyCleared = JSON.parse(
      localStorage.getItem("clearedNotifIds") || "[]"
    );

    // دمج الـ IDs الجديدة مع القديمة بدون تكرار
    const updatedCleared = [...new Set([...alreadyCleared, ...idsToHide])];

    localStorage.setItem("clearedNotifIds", JSON.stringify(updatedCleared));

    // تفريغ القائمة من الواجهة فوراً
    setNotifications([]);
  };

  // 3. دالة جلب بيانات المستخدم من التخزين
  const fetchUserFromStorage = useCallback(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsedData = JSON.parse(userInfo);
        const userData = parsedData.user || parsedData;
        setUser(userData);
        // إذا كان المستخدم أدمن، نجلب إشعاراته
        if (userData.role === "admin") {
          fetchNotifications();
        }
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
    } else {
      setUser(null);
    }
  }, [fetchNotifications]);

  // 4. مراقبة التغييرات (تغيير الصفحة، النقر خارج القائمة، التحديث)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUserFromStorage();

    // تحديث عند تغيير المسار أو التخزين
    const handleStorageChange = () => fetchUserFromStorage();
    window.addEventListener("storage", handleStorageChange);

    // إغلاق القائمة عند النقر خارجها
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [location.pathname, fetchUserFromStorage]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/login");
    setIsMenuOpen(false);
  };

  const getLocalAvatar = (avatarPath) => {
    if (!avatarPath)
      return `https://ui-avatars.com/api/?name=${user?.name || "User"}`;
    if (avatarPath.startsWith("http")) return avatarPath;
    const fileName = avatarPath.split(/[\\/]/).pop();
    return `http://localhost:5000/uploads/${fileName}`;
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            Pro<span>Manager</span>
          </Link>
        </div>

        <div
          className={`menu-icon ${isMenuOpen ? "active" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
            onClick={() => setIsMenuOpen(false)}
          >
            الرئيسية
          </Link>

          {user ? (
            <div className="user-nav-section">
              {user.role === "admin" && (
                <div className="notif-wrapper" ref={notifRef}>
                  <div
                    className="bell-icon"
                    onClick={() => setShowNotif(!showNotif)}
                  >
                    <i className="fas fa-bell"></i>
                    {notifications.length > 0 && (
                      <span className="notif-badge">
                        {notifications.length}
                      </span>
                    )}
                  </div>

                  {showNotif && (
                    <div className="notif-dropdown">
                      <div className="notif-header">
                        <span>الإشعارات ({notifications.length})</span>
                        {notifications.length > 0 && (
                          <button
                            className="clear-notif-btn"
                            onClick={handleClearNotifications}
                          >
                            مسح الكل
                          </button>
                        )}
                      </div>
                      <div className="notif-list">
                        {notifications.length > 0 ? (
                          notifications.map((n, i) => (
                            <div key={n._id || i} className="notif-item">
                              <div
                                className={`notif-icon ${
                                  n.type === "project" ? "project" : "user"
                                }`}
                              >
                                <i
                                  className={
                                    n.type === "project"
                                      ? "fas fa-tasks"
                                      : "fas fa-user"
                                  }
                                ></i>
                              </div>
                              <div className="notif-details">
                                <p className="notif-message">
                                  {n.message || "نشاط جديد في النظام"}
                                </p>
                                <span className="notif-time">
                                  {n.createdAt
                                    ? new Date(n.createdAt).toLocaleTimeString(
                                        "ar-EG",
                                        {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        }
                                      )
                                    : "منذ قليل"}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="notif-empty">
                            لا توجد إشعارات جديدة
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {user.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                >
                  لوحة التحكم
                </Link>
              )}
              <Link to="/add-project" onClick={() => setIsMenuOpen(false)}>
                إضافة مشروع
              </Link>
              <Link to="/my-projects" onClick={() => setIsMenuOpen(false)}>
                مشاريعي
              </Link>

              <div className="nav-profile">
                <Link
                  to="/profile"
                  className="profile-info"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <img
                    src={getLocalAvatar(user?.avatar)}
                    alt="avatar"
                    className="nav-avatar"
                  />
                  <span className="nav-username">
                    {user?.name?.split(" ")[0]}
                  </span>
                </Link>
                <button onClick={handleLogout} className="logout-btn-icon">
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="login-link">
                دخول
              </Link>
              <Link to="/register" className="register-btn">
                ابدأ الآن
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
