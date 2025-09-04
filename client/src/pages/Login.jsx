import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const status = await isLoggedIn();
      if (status) navigate("/home");
    })();
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName: username, password }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        localStorage.setItem("Token", data.data.jwtToken);
        localStorage.setItem("UserId", data.data.user.userId);
        localStorage.setItem("UserName", data.data.user.userName);
        localStorage.setItem("Role", data.data.user.role);
        navigate("/home");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="flex flex-col md:flex-row items-center bg-white shadow-xl rounded-xl overflow-hidden max-w-4xl w-full animate-fadeIn">
        {/* Left Panel - Branding */}
        <div className="md:w-1/2 bg-blue-600 text-white py-12 px-8 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-2">Inventory System</h1>
          <p className="text-lg text-blue-100 mb-6 text-center">
            Securely manage your stock & operations
          </p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
            alt="Inventory Icon"
            className="w-24 h-24 animate-bounce"
          />
        </div>

        {/* Right Panel - Login Form */}
        <form
          onSubmit={handleLogin}
          className="w-full md:w-1/2 p-10 bg-white"
        >
          <h2 className="text-3xl font-semibold text-center text-blue-700 mb-6">
            Welcome Back
          </h2>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md text-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>

          <p className="text-center text-gray-400 text-xs mt-4">
            © Inventory Management System.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
