import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Userprofile: React.FC = () => {
  const navigate = useNavigate();

  // State to hold account details
  const [accountDetails, setAccountDetails] = useState<any | null>(null);

  // Orders remain the same
  const orders = [
    {
      id: 1,
      status: "Shipped",
      created_at: "2023-09-01",
      items: [
        { id: 1, product_id: 101, quantity: 2, size: "M" },
        { id: 2, product_id: 102, quantity: 1, size: "L" },
      ],
    },
    {
      id: 2,
      status: "Delivered",
      created_at: "2023-08-15",
      items: [
        { id: 3, product_id: 103, quantity: 1, size: "S" },
      ],
    },
  ];

  // Fetch user account details from local storage
  useEffect(() => {
    const fetchAccountDetails = () => {
      const userInfo = localStorage.getItem("user");
      if (userInfo) {
        setAccountDetails(JSON.parse(userInfo)); // Parse and set account details from local storage
      }
    };

    fetchAccountDetails();
  }, []);

  // Handle logout
  const handleLogout = () => {
    console.log("User logged out");
    localStorage.removeItem("user"); // Remove user info on logout
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
          {/* Left side - Orders */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Orders</h2>
            {orders.length > 0 ? (
              <ul>
                {orders.map((order) => (
                  <li key={order.id} className="mb-4 border p-4 rounded">
                    <div className="font-bold">Order ID: {order.id}</div>
                    <div>Status: {order.status}</div>
                    <div>Created At: {new Date(order.created_at).toLocaleDateString()}</div>
                    <div>
                      <h3 className="font-semibold">Items:</h3>
                      <ul>
                        {order.items.map((item) => (
                          <li key={item.id}>
                            Product ID: {item.product_id}, Quantity: {item.quantity}, Size: {item.size}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>You haven't placed any orders yet.</p>
            )}
          </div>

          {/* Right side - Account Details */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Account Details</h2>
            {accountDetails ? (
              <>
                <p>Name: {accountDetails.first_name}</p>
                <p>Email: {accountDetails.email}</p>
                <h3 className="font-semibold mt-4">Address:</h3>
                {accountDetails.address ? ( // Check if address exists
                  <p className="text-gray-700">
                    {accountDetails.address.address_line_1}, {accountDetails.address.city}, {accountDetails.address.state}, {accountDetails.address.zip_code}, {accountDetails.address.country}
                  </p>
                ) : (
                  <p>Address information is not available.</p> // Fallback message if address is undefined
                )}
              </>
            ) : (
              <p>Loading account details...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userprofile;
