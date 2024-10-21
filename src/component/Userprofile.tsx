import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../services/api";
import { GetOrder } from "../utiles/types";

const Userprofile: React.FC = () => {
  const navigate = useNavigate();

  const [accountDetails, setAccountDetails] = useState<any | null>(null);
  const [orders, setOrders] = useState<GetOrder[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const fetchedOrders: GetOrder[] = await getOrders();
          console.log(fetchedOrders); // Check the structure here

          if (Array.isArray(fetchedOrders)) {
            setOrders(fetchedOrders);
          } else {
            console.error("Fetched orders is not an array:", fetchedOrders);
            setOrders([]); // Fallback to an empty array if not valid
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
          setOrders([]); // Optional: Reset orders on error
        }
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchAccountDetails = () => {
      const userInfo = localStorage.getItem("user");
      if (userInfo) {
        setAccountDetails(JSON.parse(userInfo));
      }
    };

    fetchAccountDetails();
  }, []);

  // Handle logout
  const handleLogout = () => {
    console.log("User logged out");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen px-4 md:px-8 bg-white text-black font-montserrat">
      <div className="container mx-auto py-12">
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-2xl md:text-3xl font-semibold">My Account</h1>
          <button
            className="px-2 py-1 md:px-3 md:py-2 border border-black rounded-full hover:bg-gray-200 text-xs md:text-sm"
            onClick={handleLogout}
          >
            LOG OUT
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* left side - Account Details */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              Account Details
            </h2>
            {accountDetails ? (
              <>
                <p>Name: {accountDetails.first_name}</p>
                <p>Email: {accountDetails.email}</p>
                <h3 className="font-semibold mt-4">Address:</h3>
                {accountDetails.address ? ( // Check if address exists
                  <p className="text-gray-700">
                    {accountDetails.address.address_line_1},{" "}
                    {accountDetails.address.city},{" "}
                    {accountDetails.address.state},{" "}
                    {accountDetails.address.zip_code},{" "}
                    {accountDetails.address.country}
                  </p>
                ) : (
                  <p>Address information is not available.</p> // Fallback message if address is undefined
                )}
              </>
            ) : (
              <p>Loading account details...</p>
            )}
          </div>

          {/* right side - Orders */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Orders</h2>
            {orders.length > 0 ? (
              <ul>
                {orders.map((order) => (
                  <li key={order.order_id} className="mb-4 border p-4 rounded">
                    <div className="font-bold">Order ID: {order.order_id}</div>
                    <div>Status: {order.status}</div>
                    <div>
                      Created At:{" "}
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                    <div>
                      <h3 className="font-semibold">Items:</h3>
                      <ul>
                        {Array.isArray(order.items) &&
                        order.items.length > 0 ? (
                          order.items.map((item, index) => (
                            <li
                              key={`${item.product.id}-${item.product_variation_id.id}-${index}`}
                            >
                              Product Name: {item.product.name}, Quantity:{" "}
                              {item.quantity}, Size:{" "}
                              {item.product_variation_id.size}
                            </li>
                          ))
                        ) : (
                          <li>No items in this order.</li>
                        )}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>You haven't placed any orders yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userprofile;
