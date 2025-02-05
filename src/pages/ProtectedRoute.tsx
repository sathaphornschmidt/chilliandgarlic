import React from "react";
import { Navigate } from "react-router-dom";

// Define props interface
interface ProtectedRouteProps {
  isAuthenticated: boolean;
  component: React.ReactNode;
}

// TypeScript version of ProtectedRoute
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  component,
}) => {
  return isAuthenticated ? component : <Navigate to="/login" />;
};

export default ProtectedRoute;
