import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

const ProtectedRoute = ({ children }) => {
  if (!isLoggedIn(true)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
