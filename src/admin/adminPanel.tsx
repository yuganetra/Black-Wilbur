import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';
import Dashboard from './Dashboard';
import CategoriesManagement from './CategoriesManagement';
import ImagesManagement from './ImagesManagement';
import SizeQuantityManagement from './SizeQuantityComponent'; // Import the new component
import { HiChevronDown } from 'react-icons/hi';
import DiscountManagement from './DiscountManagement';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [isProductDropdownOpen, setProductDropdownOpen] = useState(false);
  const [activeButton, setActiveButton] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleNavigate = (path: string, buttonName: string) => {
    setActiveButton(buttonName);
    navigate(path);
  };

  const toggleProductDropdown = () => {
    setProductDropdownOpen(!isProductDropdownOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const logout = () => {
    // Remove user data from localStorage
    localStorage.removeItem("user");
    // Redirect to login page
    navigate("/auth/login");
  };

  return (
    <div className="admin-panel flex h-auto m-auto bg-black text-white">
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
                onClick={toggleProductDropdown}
              >
                Product Management
                <HiChevronDown className={`transition-transform ${isProductDropdownOpen ? 'transform rotate-180' : ''}`} />
              </button>
              {isProductDropdownOpen && (
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
                  <li>
                    <button
                      className={`w-full text-left hover:bg-gray-600 p-2 rounded ${activeButton === "SizeQuantityManagement" ? "bg-gray-600" : ""}`}
                      onClick={() => handleNavigate("/admin/size-quantity", "SizeQuantityManagement")}
                    >
                      Size & Quantity
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
            <li>
              <button
                className={`w-full text-left p-3 rounded ${activeButton === "Discount Management" ? "bg-gray-700" : "hover:bg-gray-700"}`}
                onClick={() => handleNavigate("/admin/discount", "Discount Management")}
              >
                Discount Management
              </button>
            </li>
            {/* Add the logout button here */}
            <li>
              <button
                onClick={logout}
                className="w-full text-left p-3 rounded hover:bg-gray-700 mt-4"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div className={`content flex-1 p-8 bg-gray-900 transition-all duration-300 ${isSidebarOpen ? 'ml-0' : 'ml-0 lg:ml-[-80%]'}`}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="categories" element={<CategoriesManagement />} />
          <Route path="images" element={<ImagesManagement />} />
          <Route path="size-quantity" element={<SizeQuantityManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="discount" element={<DiscountManagement />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
