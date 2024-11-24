import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountDetails from "./AccountDetails";
import Wishlist from "./Wishlist";
import Orders from "./Orders";
import Refunds from "./Refunds";
import { Menu, User, Heart, Package, RefreshCcw, LogOut } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>("accountDetails");
  const [accountDetails, setAccountDetails] = useState<any | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: "accountDetails", label: "Account Details", icon: <User className="w-5 h-5" /> },
    { id: "wishlist", label: "Wishlist", icon: <Heart className="w-5 h-5" /> },
    { id: "orders", label: "Orders", icon: <Package className="w-5 h-5" /> },
    { id: "refunds", label: "Refunds", icon: <RefreshCcw className="w-5 h-5" /> },
  ];

  useEffect(() => {
    const fetchAccountDetails = () => {
      const userInfo = localStorage.getItem("user");
      if (userInfo) {
        setAccountDetails(JSON.parse(userInfo));
      }
    };
    fetchAccountDetails();
  }, []);

  const handleLogout = () => {
    ["user", "authToken", "refreshToken"].forEach((item) => 
      localStorage.removeItem(item)
    );
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">My Account</h1>
            <button 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className={`
            md:w-64 flex-shrink-0
            ${isMobileMenuOpen ? 'block' : 'hidden'} md:block
            bg-white dark:bg-black 
            border border-gray-200 dark:border-gray-700 
            rounded-lg shadow-sm
          `}>
            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`
                        w-full px-4 py-2 rounded-md
                        flex items-center gap-3 transition-colors
                        ${activeSection === item.id
                          ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 mt-4 rounded-md
                      flex items-center gap-3
                      bg-red-500 hover:bg-red-600 
                      text-white transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 bg-white dark:bg-black 
            border border-gray-200 dark:border-gray-700 
            rounded-lg shadow-sm p-6"
          >
            {activeSection === "accountDetails" && (
              <AccountDetails  />
            )}
            {activeSection === "wishlist" && <Wishlist />}
            {activeSection === "orders" && <Orders />}
            {activeSection === "refunds" && <Refunds />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;