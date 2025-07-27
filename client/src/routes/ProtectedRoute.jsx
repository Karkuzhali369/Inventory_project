
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null); // null = still checking

  useEffect(() => {
    (async () => {
      const result = await isLoggedIn(true);
      setIsAuth(result); // true or false
    })();
  }, []);

  // While checking, show nothing or a loading spinner
  if (isAuth === null) return null;

  // Not logged in → redirect to login
  if (!isAuth) return <Navigate to="/login" replace />;

  // Logged in → show protected page
  return children;
};

export default ProtectedRoute;
