import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="text-center p-10">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        Inventory Management System - Main Page
      </h1>
      <button
        onClick={handleLogout}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-200 font-semibold shadow-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
