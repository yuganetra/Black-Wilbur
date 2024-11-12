import React, { useEffect, useState } from 'react';
import { getOrders } from "../services/api";
import { GetOrder } from "../utiles/types";
// Define interfaces
// export interface GetOrder {
//   order_id: string;
//   created_at: string;
//   status: string;
//   items: OrderItem[];
// }

export interface OrderItem {
  order_id: string;
  product: Product;
  quantity: number;
  product_variation: ProductVariation;
  subtotal?: string;
  price: string;
  discount_amount: string;
  tax_amount: string;
  total_price: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
}

export interface ProductVariation {
  id: string;
  size: string;
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<GetOrder[]>([]);

  // Fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await getOrders();
        console.log("fetchedOrders",fetchedOrders)
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
              <th className="py-2 px-4 border-b border-gray-700">Order ID</th>
              <th className="py-2 px-4 border-b border-gray-700">Created At</th>
              <th className="py-2 px-4 border-b border-gray-700">Status</th>
              <th className="py-2 px-4 border-b border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.order_id} className="hover:bg-gray-800">
                <td className="py-2 px-4 border-b border-gray-700">{order.order_id}</td>
                <td className="py-2 px-4 border-b border-gray-700">{order.created_at}</td>
                <td className="py-2 px-4 border-b border-gray-700">{order.status}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;