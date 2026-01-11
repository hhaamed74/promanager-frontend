import { Link } from "react-router-dom";
import "../css/Footer.css";

const Footer = () => {
  // Get the current year dynamically for the copyright notice
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Section 1: Logo and Brief Description */}
        <div className="footer-section about">
          <div className="footer-logo">
            <Link to="/">
              Pro<span>Manager</span>
            </Link>
          </div>
          <p className="footer-desc">
            منصتك الاحترافية لإدارة ورفع المشاريع البرمجية، صُممت لتسهيل عرض
            أعمالك والتواصل مع المبدعين.
          </p>
        </div>

        {/* Section 2: Navigation / Quick Links */}
        <div className="footer-section links">
          <h4>روابط سريعة</h4>
          <ul>
            <li>
              <Link to="/">الرئيسية</Link>
            </li>
            <li>
              <Link to="/add-project">إضافة مشروع</Link>
            </li>
            <li>
              <Link to="/profile">الملف الشخصي</Link>
            </li>
          </ul>
        </div>

        {/* Section 3: Social Media and Contact Links */}
        <div className="footer-section social">
          <h4>تواصل معي</h4>
          <div className="social-icons">
            {/* GitHub Profile */}
            <a
              href="https://github.com/hhaamed74"
              target="_blank"
              rel="noreferrer"
              title="GitHub"
            >
              <i className="fab fa-github"></i>
            </a>
            {/* Personal Portfolio */}
            <a
              href="https://hamed-personal-portfolio-yuqk.vercel.app/"
              target="_blank"
              rel="noreferrer"
              title="الموقع الشخصي"
            >
              <i className="fas fa-globe"></i>
            </a>
            {/* Direct Email */}
            <a
              href="mailto:hamedabdulmohsenalsayed@gmail.com"
              title="البريد الإلكتروني"
            >
              <i className="fas fa-envelope"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom: Copyright and Developer Credit */}
      <div className="footer-bottom">
        <p>
          جميع الحقوق محفوظة &copy; {currentYear} | تم التطوير بكل ❤️ بواسطة
          <a
            href="https://hamed-personal-portfolio-yuqk.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="developer-name"
          >
            Hamed El Shahawy
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
