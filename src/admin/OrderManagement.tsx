import React, { useEffect, useState } from 'react';
import { getOrders } from "../services/api";
import { GetOrder } from ".././utiles/types";

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<GetOrder[]>([]);

  // Fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await getOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const handleUpdateOrderStatus = (orderId: string, status: string) => {
    setOrders(orders.map(order => order.order_id === orderId ? { ...order, status } : order));
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Order Management</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 mt-4">
          <thead>
            <tr className="bg-gray-800">
              <th className="py-2 px-4 border-b border-gray-700">Username</th>
              <th className="py-2 px-4 border-b border-gray-700">Phone Number</th>
              <th className="py-2 px-4 border-b border-gray-700">Order ID</th>
              <th className="py-2 px-4 border-b border-gray-700">Created At</th>
              <th className="py-2 px-4 border-b border-gray-700">Status</th>
              <th className="py-2 px-4 border-b border-gray-700">Payment Status</th>
              <th className="py-2 px-4 border-b border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <React.Fragment key={order.order_id}>
                <tr className="hover:bg-gray-800">
                  <td className="py-2 px-4 border-b border-gray-700">{order.user_name}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{order.phone_number}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{order.order_id}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{new Date(order.created_at).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{order.status}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{order.payment_status}</td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    <button 
                      onClick={() => handleUpdateOrderStatus(order.order_id, 'Shipped')}
                      className="bg-gray-600 text-white p-1 rounded mr-2"
                    >
                      Ship
                    </button>
                    <button 
                      onClick={() => handleUpdateOrderStatus(order.order_id, 'Delivered')}
                      className="bg-gray-600 text-white p-1 rounded"
                    >
                      Deliver
                    </button>
                  </td>
                </tr>
                {/* Render order items */}
                {order.items.length > 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4">
                      <table className="min-w-full bg-gray-800 text-sm">
                        <thead>
                          <tr>
                            <th className="py-1 px-2 border-b border-gray-700">Product Name</th>
                            <th className="py-1 px-2 border-b border-gray-700">Size</th>
                            <th className="py-1 px-2 border-b border-gray-700">Quantity</th>
                            <th className="py-1 px-2 border-b border-gray-700">Unit Price</th>
                            <th className="py-1 px-2 border-b border-gray-700">Total Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-700">
                              <td className="py-1 px-2 border-b border-gray-700">{item.product.name}</td>
                              <td className="py-1 px-2 border-b border-gray-700">{item.product_variation.size}</td>
                              <td className="py-1 px-2 border-b border-gray-700">{item.quantity}</td>
                              <td className="py-1 px-2 border-b border-gray-700">{item.price}</td>
                              <td className="py-1 px-2 border-b border-gray-700">{item.total_price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-4">No items in this order.</td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
