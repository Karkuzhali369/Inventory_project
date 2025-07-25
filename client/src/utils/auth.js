import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

export function getToken() {
  return localStorage.getItem('token');
}

export function isLoggedIn(showToast = false) {
  const token = getToken();

  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    console.log("🔍 Decoded token:", decoded);
    console.log("⏳ Current time:", currentTime);
    console.log("📅 Token expiry:", decoded.exp);

    if (decoded.exp && decoded.exp < currentTime) {
      localStorage.removeItem("token");
      if (showToast) toast.error("Session expired.");
      return false;
    }

    return true;
  } catch (err) {
    localStorage.removeItem("token");
    if (showToast) toast.error("Invalid token.");
    return false;
  }
}
