import React, { useEffect, useState } from "react";
import { getOrders } from "../services/api";
import { NewGetOrder } from "../utiles/types";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<NewGetOrder[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const fetchedOrders: NewGetOrder[] = await getOrders();
          setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="text-left">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">Orders</h2>
      {orders.length > 0 ? (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.order_id} className="mb-4 border p-4 rounded dark:bg-black">
              <h3 className="font-bold mb-2">Order ID: {order.order_id}</h3>
              <h4 className="font-semibold mt-4">Items:</h4>
              <ul className="pl-4 list-disc">
                {order.items.map((item, index) => (
                  <li key={index} className="mb-2">
                    <p>
                      <span className="font-semibold">Product Name:</span> {item.product.name}
                    </p>
                    <p>
                      <span className="font-semibold">Product Price:</span> ₹{item.product.price}
                    </p>
                    <p>
                      <span className="font-semibold">Quantity:</span> {item.quantity}
                    </p>
                    <p>
                      <span className="font-semibold">Size:</span> {item.product_variation.size}
                    </p>
                    <p>
                      <span className="font-semibold">Total Price:</span> ₹{item.price}
                    </p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default Orders;
