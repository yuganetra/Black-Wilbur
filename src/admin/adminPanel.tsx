import React, { useState, useEffect, useRef } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';
import Dashboard from './Dashboard';
import CategoriesManagement from './CategoriesManagement';
import ImagesManagement from './ImagesManagement';
import SizeQuantityManagement from './SizeQuantityComponent';
import { HiChevronDown, HiMenu, HiX } from 'react-icons/hi';
import DiscountManagement from './DiscountManagement';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isProductDropdownOpen, setProductDropdownOpen] = useState(false);
  const [activeButton, setActiveButton] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (path: string, buttonName: string) => {
    setActiveButton(buttonName);
    setProductDropdownOpen(false);
    //setIsMobileMenuOpen(false);
    navigate(path);
  };

  const toggleProductDropdown = () => {
    setProductDropdownOpen((prevState) => !prevState);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProductDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  return (
    <div className="admin-panel flex flex-col h-screen bg-black text-white">
      {/* Mobile Menu Toggle */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button 
          onClick={toggleMobileMenu} 
          className="p-2 bg-gray-700 rounded-md focus:outline-none"
        >
          {isMobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Navbar */}
      <header className="w-full bg-gray-800 text-white p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4 items-center">
          <button
            className={`p-3 rounded ${activeButton === "Dashboard" ? "bg-gray-700" : "hover:bg-gray-700"}`}
            onClick={() => handleNavigate("/admin", "Dashboard")}
          >
            Dashboard
          </button>
          <div className="relative" ref={dropdownRef}>
            <button
              className={`p-3 rounded flex items-center ${isProductDropdownOpen ? "bg-gray-700" : "hover:bg-gray-700"}`}
              onClick={toggleProductDropdown}
            >
              Product Management
              <HiChevronDown className={`ml-1 transition-transform ${isProductDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isProductDropdownOpen && (
              <ul className="absolute top-full left-0 bg-gray-800 mt-2 w-48 rounded shadow-lg">
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
          </div>
          <button
            className={`p-3 rounded ${activeButton === "Order Management" ? "bg-gray-700" : "hover:bg-gray-700"}`}
            onClick={() => handleNavigate("/admin/orders", "Order Management")}
          >
            Order Management
          </button>
          <button
            className={`p-3 rounded ${activeButton === "User Management" ? "bg-gray-700" : "hover:bg-gray-700"}`}
            onClick={() => handleNavigate("/admin/users", "User Management")}
          >
            User Management
          </button>
          <button
            className={`p-3 rounded ${activeButton === "Discount Management" ? "bg-gray-700" : "hover:bg-gray-700"}`}
            onClick={() => handleNavigate("/admin/discount", "Discount Management")}
          >
            Discount Management
          </button>
          <button
            onClick={logout}
            className="p-3 rounded hover:bg-gray-700"
          >
            Logout
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden fixed inset-0 bg-black z-40 flex flex-col p-4 overflow-y-auto">
            <div className="flex justify-end mb-4">
              <button 
                onClick={toggleMobileMenu} 
                className="p-2 bg-gray-700 rounded-md focus:outline-none"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                className={`w-full p-3 text-left rounded ${activeButton === "Dashboard" ? "bg-gray-700" : "hover:bg-gray-700"}`}
                onClick={() => handleNavigate("/admin", "Dashboard")}
              >
                Dashboard
              </button>
              
              {/* Mobile Product Management Dropdown */}
              <div className="relative">
                <button
                  className={`w-full p-3 text-left rounded flex items-center justify-between ${isProductDropdownOpen ? "bg-gray-700" : "hover:bg-gray-700"}`}
                  onClick={toggleProductDropdown}
                >
                  Product Management
                  <HiChevronDown className={`ml-1 transition-transform ${isProductDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isProductDropdownOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    <button
                      className={`w-full p-3 text-left rounded ${activeButton === "Categories" ? "bg-gray-600" : "hover:bg-gray-700"}`}
                      onClick={() => handleNavigate("/admin/categories", "Categories")}
                    >
                      Categories
                    </button>
                    <button
                      className={`w-full p-3 text-left rounded ${activeButton === "Images" ? "bg-gray-600" : "hover:bg-gray-700"}`}
                      onClick={() => handleNavigate("/admin/images", "Images")}
                    >
                      Images
                    </button>
                    <button
                      className={`w-full p-3 text-left rounded ${activeButton === "Products" ? "bg-gray-600" : "hover:bg-gray-700"}`}
                      onClick={() => handleNavigate("/admin/products", "Products")}
                    >
                      Products
                    </button>
                    <button
                      className={`w-full p-3 text-left rounded ${activeButton === "SizeQuantityManagement" ? "bg-gray-600" : "hover:bg-gray-700"}`}
                      onClick={() => handleNavigate("/admin/size-quantity", "SizeQuantityManagement")}
                    >
                      Size & Quantity
                    </button>
                  </div>
                )}
              </div>

              <button
                className={`w-full p-3 text-left rounded ${activeButton === "Order Management" ? "bg-gray-700" : "hover:bg-gray-700"}`}
                onClick={() => handleNavigate("/admin/orders", "Order Management")}
              >
                Order Management
              </button>
              <button
                className={`w-full p-3 text-left rounded ${activeButton === "User Management" ? "bg-gray-700" : "hover:bg-gray-700"}`}
                onClick={() => handleNavigate("/admin/users", "User Management")}
              >
                User Management
              </button>
              <button
                className={`w-full p-3 text-left rounded ${activeButton === "Discount Management" ? "bg-gray-700" : "hover:bg-gray-700"}`}
                onClick={() => handleNavigate("/admin/discount", "Discount Management")}
              >
                Discount Management
              </button>
              <button
                onClick={logout}
                className="w-full p-3 rounded hover:bg-gray-700 text-left"
              >
                Logout
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <div className="content flex-1 p-4 md:p-8 bg-gray-900 overflow-y-auto">
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