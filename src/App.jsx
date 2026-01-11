import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Page Components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddProject from "./pages/AddProject";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import EditProject from "./pages/EditProject";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import MyProjects from "./pages/MyProjects";

// Global Styles
import "./css/App.css";

/**
 * App Component
 * The root component that defines the application layout,
 * routing table, and global providers (like ToastContainer).
 */
function App() {
  return (
    <Router>
      <div className="app-wrapper">
        {/* Persistent Navigation Bar */}
        <Navbar />

        {/* Global Toast Notifications Configuration */}
        <ToastContainer
          position="top-center"
          autoClose={2000}
          theme="dark"
          pauseOnHover={false}
          draggable
        />

        {/* Dynamic Page Content */}
        <main className="main-content">
          <Routes>
            {/* Public Routes: Accessible by anyone */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/project/:id" element={<ProjectDetails />} />

            {/* Private User Routes: Requires Authentication */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-project"
              element={
                <ProtectedRoute>
                  <AddProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-project/:id"
              element={
                <ProtectedRoute>
                  <EditProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-projects"
              element={
                <ProtectedRoute>
                  <MyProjects />
                </ProtectedRoute>
              }
            />

            {/* Admin-Only Routes: Requires Admin Role */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {/* Persistent Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
