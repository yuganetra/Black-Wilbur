import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';
import Dashboard from './Dashboard';
import CategoriesManagement from './CategoriesManagement';
import ImagesManagement from './ImagesManagement';
import { HiChevronDown } from 'react-icons/hi'; // Import an icon for the dropdown

const AdminPanel: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [isProductDropdownOpen, setProductDropdownOpen] = useState(false); // State to manage dropdown visibility
  const [activeButton, setActiveButton] = useState(""); // State to track the active button
  const [isSidebarOpen, setSidebarOpen] = useState(true); // State to manage sidebar visibility

  // Handler functions for navigation
  const handleNavigate = (path: string, buttonName: string) => {
    setActiveButton(buttonName); // Set the active button
    navigate(path);
  };

  // Toggle dropdown visibility
  const toggleProductDropdown = () => {
    setProductDropdownOpen(!isProductDropdownOpen);
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="admin-panel flex h-auto m-auto  bg-black text-white">
      {/* Sidebar */}
      <aside className={`sidebar bg-black text-white ${isSidebarOpen ? 'w-1/5' : 'w-0 overflow-hidden'} transition-all duration-300`}>
        <button 
          onClick={toggleSidebar} 
          className="p-2 text-white bg-gray-800 rounded mb-4 lg:hidden"
        >
          {isSidebarOpen ? 'Close Menu' : 'Open Menu'}
        </button>
        <h2 className="text-xl font-bold mb-6 text-center">Admin Panel</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <button
                className={`w-full text-left p-3 rounded ${activeButton === "Dashboard" ? "bg-gray-700" : "hover:bg-gray-700"}`}
                onClick={() => handleNavigate("/admin", "Dashboard")}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-3 rounded flex items-center justify-between ${activeButton === "Product Management" ? "bg-gray-700" : "hover:bg-gray-700"}`}
                onClick={toggleProductDropdown} // Toggle dropdown
              >
                Product Management
                <HiChevronDown className={`transition-transform ${isProductDropdownOpen ? 'transform rotate-180' : ''}`} />
              </button>
              {isProductDropdownOpen && ( // Render dropdown if open
                <ul className="pl-4 mt-2 space-y-2">
                                    <li>
                    <button
                      className={`w-full text-left hover:bg-gray-600 p-2 rounded ${activeButton === "Categories" ? "bg-gray-600" : ""}`}
                      onClick={() => handleNavigate("/admin/categories", "Categories")}
                    >
                      Categories
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left hover:bg-gray-600 p-2 rounded ${activeButton === "Images" ? "bg-gray-600" : ""}`}
                      onClick={() => handleNavigate("/admin/images", "Images")}
                    >
                      Images
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left hover:bg-gray-600 p-2 rounded ${activeButton === "Products" ? "bg-gray-600" : ""}`}
                      onClick={() => handleNavigate("/admin/products", "Products")}
                    >
                      Products
                    </button>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button
                className={`w-full text-left p-3 rounded ${activeButton === "Order Management" ? "bg-gray-700" : "hover:bg-gray-700"}`}
                onClick={() => handleNavigate("/admin/orders", "Order Management")}
              >
                Order Management
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-3 rounded ${activeButton === "User Management" ? "bg-gray-700" : "hover:bg-gray-700"}`}
                onClick={() => handleNavigate("/admin/users", "User Management")}
              >
                User Management
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Content Area */}
      <div className={`content flex-1 p-8 bg-gray-900 transition-all duration-300 ${isSidebarOpen ? 'ml-0' : 'ml-0 lg:ml-[-80%]'}`}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="categories" element={<CategoriesManagement />} />
          <Route path="images" element={<ImagesManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="users" element={<UserManagement />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
