import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import "../css/Home.css";
import useTitle from "../hooks/useTitle";

/**
 * Home Component
 * يتميز بشاشة ترحيب، إحصائيات حية، وأزرار توجيه سريعة.
 */
const Home = () => {
  useTitle("الرئيسية");

  const [displayTotal, setDisplayTotal] = useState(0);
  const [displayCompleted, setDisplayCompleted] = useState(0);
  const [loadingScreen, setLoadingScreen] = useState(true);

  /**
   * دالة تحريك الأرقام بشكل انسيابي
   */
  const animateCount = (target, setter) => {
    let start = 0;
    const duration = 1500;
    const increment = target / (duration / 16);

    if (target <= 0) {
      setter(0);
      return;
    }

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setter(target);
        clearInterval(timer);
      } else {
        setter(Math.floor(start));
      }
    }, 16);

    return timer; // لإرجاع المعرف وتنظيفه إذا لزم الأمر
  };

  useEffect(() => {
    let timers = [];

    const fetchStats = async () => {
      try {
        const response = await API.get("/auth/stats");
        if (response.data.success) {
          const { projects, completed } = response.data.stats;

          // تشغيل عداد الأرقام
          const t1 = animateCount(projects, setDisplayTotal);
          const t2 = animateCount(completed, setDisplayCompleted);
          timers.push(t1, t2);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();

    // إخفاء شاشة الترحيب
    const splashTimer = setTimeout(() => {
      setLoadingScreen(false);
    }, 1500);

    // تنظيف جميع الـ Timers عند مغادرة الصفحة
    return () => {
      clearTimeout(splashTimer);
      timers.forEach((t) => clearInterval(t));
    };
  }, []);

  return (
    <>
      {/* شاشة الترحيب (Splash Screen) */}
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
              {/* تأكد أن المسار يطابق MyProjects في App.js */}
              <Link to="/projects" className="outline-btn">
                عرض مشروعاتي
              </Link>
            </div>
          </div>

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
