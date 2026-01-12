import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";
import "../css/Navbar.css";

/**
 * Navbar Component
 * Handles navigation, user authentication state synchronization across tabs/components,
 * and manages admin notifications.
 */
const Navbar = () => {
  const API_BASE = import.meta.env.VITE_API_URL;
  const IMAGE_BASE = API_BASE.replace("/api", ""); // سيحولها من .../api إلى الرابط الأساسي فقط
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  /**
   * Fetch system activities for Admin users
   * Memoized with useCallback to prevent unnecessary re-renders
   */
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await API.get("/auth/activities");
      setNotifications(res.data.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  }, []);

  /**
   * Synchronize user state from LocalStorage
   * Uses useCallback to ensure the function reference remains stable,
   * satisfying React's hook dependency requirements.
   */
  const fetchUserFromStorage = useCallback(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsedData = JSON.parse(userInfo);
        // Handle both nested {user: ...} and flat user objects
        const userData = parsedData.user || parsedData;
        setUser(userData);

        // Auto-fetch notifications if user is admin
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

  /**
   * Main Side-Effect: Syncs user data on mount, route change, and storage events
   */
  useEffect(() => {
    // Sync user data when navigating between pages
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUserFromStorage();

    /**
     * Listener for custom 'storage' events
     * This ensures the Navbar updates instantly when Profile.js updates localStorage
     */
    function handleStorageChange() {
      fetchUserFromStorage();
    }

    window.addEventListener("storage", handleStorageChange);

    /**
     * Closes notification dropdown when clicking anywhere else on the screen
     */
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listeners to prevent memory leaks
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [location.pathname, fetchUserFromStorage]);

  /**
   * Logout handler: Clears LocalStorage and redirects to Login
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
        {/* Brand Logo */}
        <div className="logo">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            Pro<span>Manager</span>
          </Link>
        </div>

        {/* Mobile Hamburger Icon */}
        <div
          className={`menu-icon ${isMenuOpen ? "active" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Links Section */}
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
              {/* Notifications Dropdown (Admin Only) */}
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
                  {/* Dropdown content logic remains here */}
                </div>
              )}

              {/* Admin Dashboard Access */}
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

              {/* Profile and Avatar Section */}
              <div className="nav-profile">
                <Link
                  to="/profile"
                  className="profile-info"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <img
                    src={
                      user?.avatar
                        ? `${IMAGE_BASE}/uploads/${user.avatar
                            .split(/[\\/]/)
                            .pop()}?t=${new Date().getTime()}`
                        : `https://ui-avatars.com/api/?name=${
                            user?.name || "User"
                          }`
                    }
                    alt="avatar"
                    className="nav-avatar"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
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
            /* Login/Register Buttons for Guests */
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
