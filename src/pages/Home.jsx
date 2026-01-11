import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import "../css/Home.css";
import useTitle from "../hooks/useTitle";

/**
 * Home Component
 * The landing page of the application featuring an animated intro,
 * live statistics with counting animation, and main call-to-action buttons.
 */
const Home = () => {
  useTitle("الرئيسية");

  // State for raw data and display values (for animation)
  const [, setStats] = useState({ total: 0, completed: 0 });
  const [displayTotal, setDisplayTotal] = useState(0);
  const [displayCompleted, setDisplayCompleted] = useState(0);

  // Loading state for the splash screen (Intro Overlay)
  const [loadingScreen, setLoadingScreen] = useState(true);

  /**
   * animateCount: Smoothly increments numbers from 0 to target value
   * @param {number} target - The final number to reach
   * @param {function} setter - The state setter function for display
   */
  const animateCount = (target, setter) => {
    let start = 0;
    if (target === 0) {
      setter(0);
      return;
    }
    const duration = 1500; // Animation duration in milliseconds
    const increment = target / (duration / 16); // Calculate increment per frame (~60fps)

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setter(target);
        clearInterval(timer);
      } else {
        setter(Math.floor(start));
      }
    }, 16);
  };

  /**
   * Fetch statistics and control the entry animation sequence
   */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get("/auth/stats");

        if (response.data.success) {
          const { projects, completed } = response.data.stats;

          setStats({ total: projects, completed });

          // Start counting animation once data is received
          animateCount(projects, setDisplayTotal);
          animateCount(completed, setDisplayCompleted);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
        // Reset to 0 if request fails
        animateCount(0, setDisplayTotal);
        animateCount(0, setDisplayCompleted);
      }
    };

    fetchStats();

    // Hide splash screen after fixed delay
    const timer = setTimeout(() => {
      setLoadingScreen(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {/* Intro Splash Screen Overlay */}
      {loadingScreen && (
        <div className="intro-overlay">
          <div className="intro-logo">
            Pro<span>Manager</span>
          </div>
          <div className="intro-line"></div>
        </div>
      )}

      <div
        className={`home-container ${!loadingScreen ? "content-ready" : ""}`}
      >
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title animate-fade-in">
              أدِر مشاريعك بذكاء مع <span>ProManager</span>
            </h1>
            <p className="hero-subtitle">
              المنصة المتكاملة لتنظيم مهامك، تتبع فريقك، وتحقيق أهدافك بلمسة
              احترافية وتصميم عصري.
            </p>

            <div className="hero-btns">
              <Link to="/add-project" className="main-btn">
                إضافة مشروع جديد
              </Link>
              <Link to="/projects" className="outline-btn">
                عرض مشروعاتي
              </Link>
            </div>
          </div>

          {/* Statistics Section with Glassmorphism Effect */}
          <div className="hero-stats">
            <div className="stat-card glass-morph">
              <h3>+{displayCompleted}</h3>
              <p>مشاريع منجزة</p>
            </div>
            <div className="stat-card glass-morph">
              <h3>+{displayTotal}</h3>
              <p>إجمالي المشاريع</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
