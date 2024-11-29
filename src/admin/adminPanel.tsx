import React, { useState, useEffect, useRef } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { 
  HiChevronDown, 
  HiMenu, 
  HiX, 
  HiHome, 
  HiShoppingBag, 
  HiCube, 
  HiUsers, 
  HiClipboardList, 
  HiCash, 
  HiLogout 
} from 'react-icons/hi';

// Import all management components
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';
import Dashboard from './Dashboard';
import CategoriesManagement from './CategoriesManagement';
import ImagesManagement from './ImagesManagement';
import SizeQuantityManagement from './SizeQuantityComponent';
import DiscountManagement from './DiscountManagement';

// Define menu items for easier maintenance
const MENU_ITEMS = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: HiHome,
    subItems: []
  },
  {
    name: 'Product Management',
    path: '/admin/products',
    icon: HiShoppingBag,
    subItems: [
      { name: 'Categories', path: '/admin/categories' },
      { name: 'Images', path: '/admin/images' },
      { name: 'Products', path: '/admin/products' },
      { name: 'Size & Quantity', path: '/admin/size-quantity' }
    ]
  },
  {
    name: 'Order Management',
    path: '/admin/orders',
    icon: HiClipboardList,
    subItems: []
  },
  {
    name: 'User Management',
    path: '/admin/users',
    icon: HiUsers,
    subItems: []
  },
  {
    name: 'Discount Management',
    path: '/admin/discount',
    icon: HiCash,
    subItems: []
  }
];

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // State management
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine active route and menu item
  const getActiveMenuItem = () => {
    const currentPath = location.pathname;
    for (const item of MENU_ITEMS) {
      if (currentPath === item.path) return item.name;
      if (item.subItems.some(subItem => currentPath === subItem.path)) return item.name;
    }
    return '';
  };

  // Navigation handler
  const handleNavigate = (path: string) => {
    navigate(path);
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  };

  // Dropdown toggle
  const toggleDropdown = (name: string) => {
    setOpenDropdown(prev => prev === name ? null : name);
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Render menu items
  const renderMenuItem = (item: typeof MENU_ITEMS[0], isMobile = false) => {
    const isActive = getActiveMenuItem() === item.name;
    const hasSubItems = item.subItems.length > 0;
    const isDropdownOpen = openDropdown === item.name;

    const menuItemClass = `
      flex items-center w-full p-3 rounded 
      ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}
      ${isMobile ? 'text-left' : ''}
    `;

    return (
      <div key={item.name} className="relative">
        <button 
          className={menuItemClass}
          onClick={() => {
            hasSubItems ? toggleDropdown(item.name) : handleNavigate(item.path);
          }}
        >
          <item.icon className="mr-2" />
          {item.name}
          {hasSubItems && (
            <HiChevronDown 
              className={`ml-auto transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
            />
          )}
        </button>

        {hasSubItems && isDropdownOpen && (
          <div className={`${isMobile ? 'ml-4 mt-2' : 'absolute left-0 top-full z-10 bg-gray-800 w-full rounded shadow-lg'} space-y-2`}>
            {item.subItems.map(subItem => (
              <button
                key={subItem.name}
                className={`
                  w-full text-left p-2 rounded 
                  ${location.pathname === subItem.path ? 'bg-gray-600' : 'hover:bg-gray-700'}
                `}
                onClick={() => handleNavigate(subItem.path)}
              >
                {subItem.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="admin-panel flex flex-col h-screen bg-black text-white">
      {/* Mobile Menu Toggle */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 bg-gray-700 rounded-md focus:outline-none"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Navbar */}
      <header className="w-full bg-gray-800 text-white p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4 items-center" ref={dropdownRef}>
          {MENU_ITEMS.map(item => renderMenuItem(item))}
          <button
            onClick={logout}
            className="p-3 rounded hover:bg-gray-700 flex items-center"
          >
            <HiLogout className="mr-2" /> Logout
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden fixed inset-0 bg-black z-40 flex flex-col p-4 overflow-y-auto" ref={dropdownRef}>
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-2 bg-gray-700 rounded-md focus:outline-none"
                aria-label="Close menu"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col space-y-2">
              {MENU_ITEMS.map(item => renderMenuItem(item, true))}
              <button
                onClick={logout}
                className="w-full p-3 rounded hover:bg-gray-700 text-left flex items-center"
              >
                <HiLogout className="mr-2" /> Logout
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="content flex-1 p-4 md:p-8 bg-gray-900 overflow-y-auto">
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
      </main>
    </div>
  );
};

export default AdminPanel;