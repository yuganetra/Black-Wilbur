import React, { useState } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const handleDeleteUser = (userId: number) =>
    setUsers(users.filter(user => user.id !== userId));

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">User Management</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 mt-4">
          <thead>
            <tr className="bg-gray-800">
              <th className="py-2 px-4 border-b border-gray-700">Username</th>
              <th className="py-2 px-4 border-b border-gray-700">Email</th>
              <th className="py-2 px-4 border-b border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-800">
                <td className="py-2 px-4 border-b border-gray-700">{user.username}</td>
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
