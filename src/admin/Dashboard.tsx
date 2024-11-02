import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* No data cards as per your request */}
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
            {/* No sample rows as per your request */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
