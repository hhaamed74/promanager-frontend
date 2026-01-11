import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute Component
 * A wrapper component that restricts access to authenticated users only
 * @param {Object} children - The components/pages to be rendered if authenticated
 */
const ProtectedRoute = ({ children }) => {
  // Retrieve user information from the browser's local storage
  const userInfo = localStorage.getItem("userInfo");

  /**
   * Authentication Guard Logic
   * If no user data is found, redirect the visitor to the login page.
   * The 'replace' prop is used to prevent the user from going back to the protected page.
   */
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the requested child components
  return children;
};

export default ProtectedRoute;
