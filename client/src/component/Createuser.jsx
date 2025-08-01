// src/components/AddUserModal.jsx
import React, { useState } from "react";


function Createuser({ onClose, onUserCreated }) {
  const token = localStorage.getItem("Token");
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async () => {
    try {
      const response = await fetch("https://inventory-project-d3mr.onrender.com/api/auth/create-user", 
        {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" ,
            Authorization:`Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      

      if (response.ok) {
        alert("User created successfully");
        onUserCreated(result.data.user); // Notify parent
        onClose(); // Close modal
      }
      else {
        alert(result.message || "Failed to create user");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="w-[100dvw] h-[100dvh] bg-black/30 fixed top-0 left-0 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Add New User</h2>
        <input
          type="text"
          name="userName"
          placeholder="Name"
          className="w-full mb-2 p-2 border rounded"
          value={formData.userName}
          onChange={handleChange}
        />
        <select
          name="role"
          className="w-full mb-2 p-2 border rounded"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="">Select Role</option>
          <option value="ADMIN">ADMIN</option>
          <option value="MODERATOR">MODERATOR</option>
          <option value="USER">USER</option>
        </select>

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={formData.password}
          onChange={handleChange}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-1 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateUser}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default Createuser;
