import React, { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../services/api";
import { NewGetOrder } from "../utiles/types";
import OrderDetailsPopup from "./helper/OrderDetailsPopup";
import { HiEye, HiTruck, HiCheck } from 'react-icons/hi';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<NewGetOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<NewGetOrder | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await getOrders();
        console.log(fetchedOrders)
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId ? { ...order, status } : order
        )
      );
      alert(`Order ${orderId} updated to ${status}`);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const openOrderDetails = (order: NewGetOrder) => setSelectedOrder(order);
  const closeOrderDetails = () => setSelectedOrder(null);

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="p-4 md:p-6 bg-black text-white min-h-screen">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">Order Management</h1>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-gray-900">
          <thead>
            <tr className="bg-gray-800">
              <th className="py-2 px-4 border-b border-gray-700">Order ID</th>
              <th className="py-2 px-4 border-b border-gray-700">Username</th>
              <th className="py-2 px-4 border-b border-gray-700">Phone Number</th>
              <th className="py-2 px-4 border-b border-gray-700">Status</th>
              <th className="py-2 px-4 border-b border-gray-700">Date/Time</th>
              <th className="py-2 px-4 border-b border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id} className="hover:bg-gray-800">
                <td className="py-2 px-4 border-b border-gray-700">
                  {order.order_id}
                </td>
                <td className="py-2 px-4 border-b border-gray-700">
                  {order.user_name}
                </td>
                <td className="py-2 px-4 border-b border-gray-700">
                  {order.phone_number}
                </td>
                <td className="py-2 px-4 border-b border-gray-700">
                  {order.status}
                </td>
                <td className="py-2 px-4 border-b border-gray-700">
                  {new Date(order.created_at).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b border-gray-700">
                  <button
                    onClick={() => openOrderDetails(order)}
                    className="bg-gray-600 px-4 py-2 rounded text-white hover:bg-white hover:text-black mb-2 block"
                  >
                    View Details
                  </button>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() =>
                        handleStatusUpdate(order.order_id, "Shipped")
                      }
                      className="bg-gray-600 px-4 py-2 rounded text-white hover:bg-white hover:text-black mb-2 block"
                      >
                      Mark Shipped
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(order.order_id, "Delivered")
                      }
                      className="bg-gray-600 px-4 py-2 rounded text-white hover:bg-white hover:text-black mb-2 block"
                      >
                      Mark Delivered
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <div 
            key={order.order_id} 
            className="bg-gray-900 rounded-lg p-4 shadow-md"
          >
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleOrderExpand(order.order_id)}
            >
              <div>
                <p className="font-bold">Order #{order.order_id}</p>
                <p className="text-sm text-gray-400">{order.user_name}</p>
              </div>
              <span className="text-sm bg-gray-700 px-2 py-1 rounded">
                {order.status}
              </span>
            </div>

            {expandedOrderId === order.order_id && (
              <div className="mt-4 space-y-2">
                <p><strong>Phone:</strong> {order.phone_number}</p>
                <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                
                <div className="flex flex-col space-y-2 mt-4">
                  <button
                    onClick={() => openOrderDetails(order)}
                    className="bg-gray-600 px-4 py-2 rounded text-white hover:bg-gray-500 flex items-center justify-center"
                  >
                    <HiEye className="mr-2" /> View Details
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(order.order_id, "Shipped")}
                    className="bg-gray-600 px-4 py-2 rounded text-white hover:bg-gray-500 flex items-center justify-center"
                  >
                    <HiTruck className="mr-2" /> Mark Shipped
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(order.order_id, "Delivered")}
                    className="bg-gray-600 px-4 py-2 rounded text-white hover:bg-gray-500 flex items-center justify-center"
                  >
                    <HiCheck className="mr-2" /> Mark Delivered
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Popup for order details */}
      {selectedOrder && (
        <OrderDetailsPopup
          order={selectedOrder}
          onClose={closeOrderDetails}
        />
      )}
    </div>
  );
};

export default OrderManagement;