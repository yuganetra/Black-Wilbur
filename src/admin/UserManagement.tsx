import React, { useState, useEffect } from 'react';
import { getUsers } from '../services/api';  // Adjust path as necessary
import { User } from '../utiles/types';    // Adjust path as necessary

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users using the imported getUsers function
  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle user deletion
  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    // Optionally, add an API call here to delete the user from the backend
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">User Management</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 mt-4">
          <thead>
            <tr className="bg-gray-800">
              <th className="py-2 px-4 border-b border-gray-700">First Name</th>
              <th className="py-2 px-4 border-b border-gray-700">Last Name</th>
              <th className="py-2 px-4 border-b border-gray-700">Phone Number</th>
              <th className="py-2 px-4 border-b border-gray-700">Email</th>
              <th className="py-2 px-4 border-b border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-800">
                <td className="py-2 px-4 border-b border-gray-700">{user.first_name}</td>
                <td className="py-2 px-4 border-b border-gray-700">{user.last_name}</td>
                <td className="py-2 px-4 border-b border-gray-700">{user.phone_number}</td>
                <td className="py-2 px-4 border-b border-gray-700">{user.email}</td>
                <td className="py-2 px-4 border-b border-gray-700">
                  <button 
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-600 text-white p-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
