export function getToken() {
  return localStorage.getItem("Token");
}

export async function isLoggedIn() {
  const token = localStorage.getItem("Token");
  if (!token) return false;

  try {
    const response = await fetch("https://inventory-project-d3mr.onrender.com/api/auth/verify-token", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok; // true if token is valid
  } catch {
    return false;
  }
}
