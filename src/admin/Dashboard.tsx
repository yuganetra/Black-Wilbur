import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className=" bg-black text-white  min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Mock data cards */}
        <div className="p-4 bg-gray-800 rounded shadow">
          <h2 className="text-lg font-semibold">Total Products</h2>
          <p className="text-2xl">50</p>
        </div>
        <div className="p-4 bg-gray-800 rounded shadow">
          <h2 className="text-lg font-semibold">Total Sales</h2>
          <p className="text-2xl">$25,000</p>
        </div>
        <div className="p-4 bg-gray-800 rounded shadow">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-2xl">1,200</p>
        </div>
      </div>

      {/* Table Structure */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 text-left">
          <thead className="bg-gray-800">
            <tr>
              <th className="py-2 px-4 border-b border-gray-700">Item</th>
              <th className="py-2 px-4 border-b border-gray-700">Quantity</th>
              <th className="py-2 px-4 border-b border-gray-700">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b border-gray-700">Product A</td>
              <td className="py-2 px-4 border-b border-gray-700">20</td>
              <td className="py-2 px-4 border-b border-gray-700">$5,000</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b border-gray-700">Product B</td>
              <td className="py-2 px-4 border-b border-gray-700">30</td>
              <td className="py-2 px-4 border-b border-gray-700">$7,500</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b border-gray-700">Product C</td>
              <td className="py-2 px-4 border-b border-gray-700">10</td>
              <td className="py-2 px-4 border-b border-gray-700">$2,500</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
