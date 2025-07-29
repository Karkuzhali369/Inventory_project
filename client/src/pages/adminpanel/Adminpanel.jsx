import React, { useEffect, useState } from "react";
import Createuser from "../../component/Createuser.jsx";
function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const token = localStorage.getItem("Token");
  const [showModal, setShowModal] = useState(false);


  const fetchUsers = async () => {
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/get-all-users", {
        headers: {
        Authorization: `Bearer ${token}`,
      }});
      const result = await response.json();
      if (response.status === 200 && result.condition === "SUCCESS") {
        setUsers(result.data.users);
      } else {
        console.error("Failed to fetch users:", result.message);
      }
    } catch (error) {
      console.error("Network error while fetching users:", error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditUserId(user._id);
    setEditedUser({
      userId: user._id,
      userName: user.userName,
      role: user.role,
      password: "",
      showDropdown: false,
    });
  };

  const handleSaveClick = async () => {
    try {
      const payload = {
        userId: editedUser.userId,
        userName: editedUser.userName,
        role: editedUser.role,
      };

      if (editedUser.password && editedUser.password.trim() !== "") {
        payload.password = editedUser.password;
      }

      const response = await fetch("http://localhost:5000/api/auth/update-user", {
        method: "PUT",
        headers: { "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      console.log(result);//added new

      if (response.status === 200) {
        setEditUserId(null);
        setEditedUser({});
        fetchUsers();
      } else {
        console.error("Failed to update user:", result.message);
      }
    } catch (error) {
      console.error("Network error:", error.message);
    }
  };

  const handleInputChange = (e) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value,
    });
  };

  const toggleDropdown = () => {
    setEditedUser((prev) => ({ ...prev, showDropdown: !prev.showDropdown }));
  };

  const selectRole = (role) => {
    setEditedUser((prev) => ({ ...prev, role, showDropdown: false }));
  };

  const handleDelete = async (userId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this user?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:5000/api/auth/delete-user`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({userId: userId})
    });

    const result = await response.json();
    if (response.ok) {
      alert("User deleted successfully");
      // remove from local state
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } else {
      alert(result.message || "Failed to delete user");
    }
  } catch (error) {
    console.error("Delete error:", error);
    alert("An error occurred while deleting the user");
  }
};

const handleUserCreated = (newUser) => {
  newUser._id = newUser.userId;
  setUsers((prev) => [...prev, newUser]);
};



  return (
            <div className="max-w-4xl mx-auto mt-12 p-4 bg-white shadow-md rounded">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">All Users</h2>
          <table className="w-full table-auto border border-gray-300">
                <thead className="bg-blue-600">
                  <tr>
                    <th className="border px-4 py-2 text-white">Username</th>
                    <th className="border px-4 py-2 text-white">Role</th>
                    <th className="border px-4 py-2 text-white">Password</th>
                    <th className="border px-4 py-2 text-white"></th>
                    <th className="border px-4 py-2 text-white"></th>

                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const isEditing = editUserId === user._id;
                    return (
                      <tr key={user._id} className="text-center">
                        {/* Username */}
                        <td className="border px-4 py-2">
                          {isEditing ? (
                            <input
                              type="text"
                              name="userName"
                              value={editedUser.userName}
                              onChange={handleInputChange}
                              className="border px-2 py-1 w-full"
                            />
                          ) : (
                            user.userName
                          )}
                        </td>

                        {/* Custom Dropdown Role */}
                        <td className="border px-4 py-2 relative">
                          {isEditing ? (
                            <div className="relative inline-block w-full">
                              <button
                                onClick={toggleDropdown}
                                className="w-full text-left border px-2 py-1 bg-white"
                              >
                                {editedUser.role}
                              </button>
                              {editedUser.showDropdown && (
                                <ul className="absolute bg-white border mt-1 w-full z-10">
                                  {["ADMIN", "MODERATOR", "USER"].map((role) => (
                                    <li
                                      key={role}
                                      onClick={() => selectRole(role)}
                                      className="hover:bg-gray-100 px-2 py-1 cursor-pointer"
                                    >
                                      {role}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ) : (
                            user.role
                          )}
                        </td>

                        {/* Password input */}
                        <td className="border px-4 py-2">
                          {isEditing ? (
                            <input
                              type="password"
                              name="password"
                              value={editedUser.password}
                              onChange={handleInputChange}
                              className="border px-2 py-1 w-full"
                              placeholder="New password"
                            />
                          ) : (
                            "••••••"
                          )}
                        </td>

                        {/* Edit/Save button */}
                        <td className="border px-4 py-2">
                          {isEditing ? (
                            <button
                              onClick={handleSaveClick}
                              className="bg-green-500 text-white px-4 py-1 rounded"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEditClick(user)}
                              className="bg-blue-500 text-white px-4 py-1 rounded"
                            >
                              Edit
                            </button>
                          )}
                        </td>
                        <td className="border px-4 py-2">
                            <button
                             onClick={()=>handleDelete(user._id)}
                             className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                             >Delete</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <br></br>

                <button 
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                Add User
                </button>

                {/* ✅ Move modal inside the return */}
                {showModal && (
                <Createuser
                    onClose={() => setShowModal(false)}
                    onUserCreated={handleUserCreated}
                />
                )}
        </div>
);


}

export default AdminPanel;
