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

  // جلب الإشعارات للأدمن
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await API.get("/auth/activities");
      setNotifications(res.data.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  }, []);

  // جلب وتحديث بيانات المستخدم من التخزين المحلي
  const fetchUserFromStorage = useCallback(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsedData = JSON.parse(userInfo);
        const userData = parsedData.user || parsedData;
        setUser(userData);

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUserFromStorage();

    // التحديث عند تغيير التخزين (من صفحات أخرى)
    const handleStorageChange = () => fetchUserFromStorage();
    window.addEventListener("storage", handleStorageChange);

    // إغلاق قائمة الإشعارات عند الضغط خارجها
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
                  {/* هنا يمكن إضافة Dropdown الإشعارات إذا أردت */}
                </div>
              )}

              {user.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="admin-dashboard-btn"
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
                    src={
                      user?.avatar?.startsWith("http")
                        ? user.avatar
                        : `https://ui-avatars.com/api/?name=${
                            user?.name || "User"
                          }`
                    }
                    alt="avatar"
                    className="nav-avatar"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150";
                    }}
                  />
                  <span className="nav-username">
                    {user?.name?.split(" ")[0]}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="logout-btn-icon"
                  title="Logout"
                >
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
