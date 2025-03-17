import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { token, role } = useContext(AuthContext);

  // Nếu không có token, chuyển hướng về trang login
  if (!token || token === "") {
    return <Navigate to="/" replace />;
  }

  // Nếu có requiredRoles nhưng user không thuộc nhóm được phép, chuyển hướng về trang không có quyền
  if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;