import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios"; // Import custom axios instance for API calls
import "../css/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate
  const location = useLocation(); // Hook to access current URL path
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu toggle state
  const [user, setUser] = useState(null); // Authenticated user state

  /**
   * Notification States
   */
  const [notifications, setNotifications] = useState([]); // List of admin activities
  const [showNotif, setShowNotif] = useState(false); // Toggle for notification dropdown
  const notifRef = useRef(null); // Reference to the notification container for click detection

  /**
   * Fetch system activities for Admin users
   */
  const fetchNotifications = async () => {
    try {
      const res = await API.get("/auth/activities");
      setNotifications(res.data.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    /**
     * Retrieve and validate user info from local storage
     */
    const fetchUser = () => {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        try {
          const parsedUser = JSON.parse(userInfo);
          setUser(parsedUser);

          // Only fetch activities if the logged-in user is an Admin
          if (parsedUser.role === "admin") {
            fetchNotifications();
          }
        } catch (error) {
          console.error("Error parsing user info:", error);
        }
      } else {
        setUser(null);
      }
    };

    fetchUser();

    /**
     * Event listener to close notification dropdown when clicking outside
     */
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup listener on component unmount
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [location.pathname]); // Re-run effect when navigating between pages

  /**
   * Handle user logout and clear local storage
   */
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
        {/* Branding/Logo Section */}
        <div className="logo">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            Pro<span>Manager</span>
          </Link>
        </div>

        {/* Mobile Menu Icon (Hamburger) */}
        <div
          className={`menu-icon ${isMenuOpen ? "active" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navigation Links and User Actions */}
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
              {/* Admin-Only Notifications Dropdown */}
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
                    <div className="notif-dropdown card-glass animate-fade-in">
                      <div className="notif-header">
                        <h4>آخر النشاطات</h4>
                        <span onClick={fetchNotifications} title="Refresh">
                          <i className="fas fa-sync-alt"></i>
                        </span>
                      </div>
                      <div className="notif-list">
                        {notifications.length > 0 ? (
                          notifications.map((n, index) => (
                            <div key={index} className="notif-item">
                              <div className={`notif-icon ${n.type}`}>
                                <i
                                  className={
                                    n.type === "user"
                                      ? "fas fa-user-plus"
                                      : "fas fa-file-upload"
                                  }
                                ></i>
                              </div>
                              <div className="notif-content">
                                <p>{n.text}</p>
                                <span className="notif-time">
                                  {new Date(n.date).toLocaleTimeString(
                                    "ar-EG",
                                    { hour: "2-digit", minute: "2-digit" }
                                  )}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="no-notif">
                            لا توجد تنبيهات جديدة 📭
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Conditional Button for Admin Dashboard */}
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

              {/* User Profile and Avatar Section */}
              <div className="nav-profile">
                <Link
                  to="/profile"
                  className="profile-info"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <img
                    src={
                      user?.avatar
                        ? `http://localhost:5000/uploads/${user.avatar
                            .split(/[\\/]/)
                            .pop()}?t=${new Date().getTime()}`
                        : `https://ui-avatars.com/api/?name=${
                            user?.name || "User"
                          }`
                    }
                    alt="avatar"
                    className="nav-avatar"
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
            /* Authentication Buttons for Guests */
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
