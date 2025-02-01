import React, { useEffect, useState } from "react";
import { MdMenu } from "react-icons/md";
import { FaSearch, FaShoppingCart } from "react-icons/fa";

import { FaRegCircleUser, FaCircleUser } from "react-icons/fa6";
import logo from "../asset/white-logo.svg";
import SidebarMenu from "./Sidebar-Menu";
import CartComponent from "./Cart";
import SearchSidebar from "./SearchSidebar";
import { useNavigate } from "react-router-dom";
import { fetchCategories, getCartItemsCount } from "../services/api";
import { Category } from "../utiles/types";

const Navbar: React.FC = (): JSX.Element => {
  const [sidebar, setSidebar] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [searchSidebarOpen, setSearchSidebarOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cartItemsCount, setCartItemsCount] = useState<number>(0);

  const navigate = useNavigate();

  const toggleSidebar = (): void => {
    setSidebar(!sidebar);
  };

  const toggleCartSidebar = (): void => {
    setIsCartOpen(!isCartOpen);
  };

  const toggleSearchSidebar = (): void => {
    setSearchSidebarOpen(!searchSidebarOpen);
  };

  const checkUserInfo = (): boolean => {
    const userInfo = localStorage.getItem("user");
    return userInfo !== null;
  };

  const handleUserProfileNavigate = () => {
    if (checkUserInfo()) {
      navigate("/user-profile");
    } else {
      navigate("/auth/login");
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
        const cartCount = await getCartItemsCount();
        setCartItemsCount(cartCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 6000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <nav className="navbar sticky top-0 left-0 w-full flex items-center justify-between pl-4 pr-4 pb-2 bg-black z-50">
        <div className="hidden md:flex h-24 flex-col w-full">
          {/* For Large Screens */}
          <div className="hidden h-20 md:flex items-center justify-between w-full pl-16 pr-16 text-white border-b-[1px] border-gray-200">
            <div className="flex items-center space-x-4">
              <MdMenu className="text-2xl cursor-pointer" onClick={toggleSidebar} />
              <button onClick={toggleSearchSidebar} className="text-xl">
                <FaSearch />
              </button> 
            </div>

            {/* Absolute positioning for logo */}
            <img
              src={logo}
              alt="BlackWilbur"
              className="absolute left-1/2 transform -translate-x-1/2 h-18 w-40 text-white cursor-pointer"
              style={{ filter: "invert(1)" }}
              onClick={() => handleNavigate("/")}
            />
            <div className="flex items-center space-x-4">
              <FaRegCircleUser
                onClick={handleUserProfileNavigate} // Update the onClick handler
                className="text-2xl cursor-pointer"
              />

              <div className="relative">
                <FaShoppingCart onClick={toggleCartSidebar} className="text-xl cursor-pointer" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-1.5 py-0.5">
                  {cartItemsCount || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Mini Navbar */}
          <div className="hidden h-8 md:flex items-center justify-center w-full pl-16 pr-10 space-x-4 text-white">
            <button
              onClick={() => handleNavigate("/collection")}
              className="relative text-sm font-semibold px-4 py-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-white after:transform after:scale-x-0 after:origin-right hover:after:scale-x-100 hover:after:origin-left after:transition-transform after:duration-300"
            >
              Collection
            </button>

            {/* Dynamic Category Buttons */}
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() =>
                  handleNavigate(`/collection/${category.name.toLowerCase().replace(/ /g, "-")}`)
                }
                className="relative text-sm font-semibold px-4 py-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-white after:transform after:scale-x-0 after:origin-right hover:after:scale-x-100 hover:after:origin-left after:transition-transform after:duration-300"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* For Medium and Small Screens */}
        <div className="flex md:hidden items-center justify-between w-full h-12 p-1 text-white">
          {/* Left Icons */}
          <div className="flex items-center space-x-2">
            <MdMenu className="text-2xl cursor-pointer" onClick={toggleSidebar} />
            <button onClick={toggleSearchSidebar} className="text-lg">
              <FaSearch />
            </button>
          </div>

          {/* Center Logo */}
          <img
            src={logo}
            alt="BlackWilbur"
            className="h-4 cursor-pointer"
            style={{ filter: "invert(1)" }}
            onClick={() => handleNavigate("/")}
          />

          {/* Right Icons */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <FaShoppingCart onClick={toggleCartSidebar} className="text-lg cursor-pointer" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-1.5 py-0.5">
                  {cartItemsCount}
                </span>
              )}
            </div>

            <FaCircleUser
              onClick={handleUserProfileNavigate} // Update the onClick handler
              className="text-lg cursor-pointer"
            />
          </div>
        </div>
      </nav>

      {/*Search Sidebar component */}
      <SearchSidebar isOpen={searchSidebarOpen} onClose={toggleSearchSidebar} />

      {/* Sidebar component */}
      <SidebarMenu isOpen={sidebar} onClose={() => setSidebar(false)} />

      {/* Add to Cart Sidebar */}
      <div className="text-black">
        <CartComponent isOpen={isCartOpen} onClose={toggleCartSidebar} cartItems={[]} />
      </div>
    </>
  );
};

export default Navbar;