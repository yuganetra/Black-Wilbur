import React, { useState } from 'react';

interface Order {
  id: number;
  customer: string;
  status: string;
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const handleUpdateOrderStatus = (orderId: number, status: string) => {
    setOrders(orders.map(order => order.id === orderId ? { ...order, status } : order));
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Order Management</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 mt-4">
          <thead>
            <tr className="bg-gray-800">
              <th className="py-2 px-4 border-b border-gray-700">Order ID</th>
              <th className="py-2 px-4 border-b border-gray-700">Customer</th>
              <th className="py-2 px-4 border-b border-gray-700">Status</th>
              <th className="py-2 px-4 border-b border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-800">
                <td className="py-2 px-4 border-b border-gray-700">{order.id}</td>
                <td className="py-2 px-4 border-b border-gray-700">{order.customer}</td>
                <td className="py-2 px-4 border-b border-gray-700">{order.status}</td>
                <td className="py-2 px-4 border-b border-gray-700">
                  <button 
                    onClick={() => handleUpdateOrderStatus(order.id, 'Shipped')}
                    className="bg-gray-600 text-white p-1 rounded mr-2"
                  >
                    Ship
                  </button>
                  <button 
                    onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')}
                    className="bg-gray-600 text-white p-1 rounded"
                  >
                    Deliver
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

export default OrderManagement;
