import React, { useEffect, useState } from "react";
import { MdMenu } from "react-icons/md";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import logo from "../asset/white-logo.svg";
import SidebarMenu from "./Sidebar-Menu";
import CartComponent from "./Cart";
import Searchbar from "./Searchbar";
import { useNavigate } from "react-router-dom";
import {
  fetchCategories,
  isUserLoggedIn,
  getCartItemsCount,
} from "../services/api"; // Add getCartItemsCount API function
import { Category } from "../utiles/types";

const Navbar: React.FC = (): JSX.Element => {
  const [sidebar, setSidebar] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [cartItemsCount, setCartItemsCount] = useState<number>(0); // To track cart count

  const navigate = useNavigate();

  const toggleSidebar = (): void => {
    setSidebar(!sidebar);
  };

  const toggleCartSidebar = (): void => {
    setIsCartOpen(!isCartOpen);
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

  const handleSearchIconClick = () => {
    setShowSearchBar(!showSearchBar);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);

        // Fetch the cart count and update state
        const cartCount = await getCartItemsCount(); 
        setCartItemsCount(cartCount);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Polling to continuously fetch cart items count every 5 seconds
    const intervalId = setInterval(() => {
      fetchData(); // Call the fetchData function to refresh categories and cart count
    }, 2000); // Adjust the interval as needed

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount

  }, []);

  return (
    <>
      <nav className="navbar sticky top-0 left-0 w-full flex items-center justify-between pl-4 pr-4 pb-2 bg-black z-50">
        <div className="hidden md:flex h-24 flex-col w-full">
          {/* For Large Screens */}
          <div className="hidden h-20 md:flex items-center justify-between w-full pl-16 pr-16 text-white border-b-2 border-white">
            <div className="flex items-center space-x-4">
              <MdMenu className="text-4xl cursor-pointer" onClick={toggleSidebar} />
              <Searchbar />
            </div>

            <img
              src={logo}
              alt="BlackWilbur"
              className="h-18 w-40 text-white cursor-pointer lg:mr-24 md:mr-14"
              style={{ filter: "invert(1)" }}
              onClick={() => handleNavigate("/")}
            />
            <div className="flex items-center space-x-4">
              <FaCircleUser
                onClick={handleUserProfileNavigate} // Update the onClick handler
                className="text-2xl cursor-pointer"
              />

              <div className="relative">
                <FaShoppingCart
                  onClick={toggleCartSidebar}
                  className="text-2xl cursor-pointer"
                />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-1.5 py-0.5">
                  {cartItemsCount || 0}
                </span>
              </div>

            </div>
          </div>

          {/* Mini Navbar */}
          <div className="hidden h-8 md:flex items-center justify-center w-full pl-16 pr-10 space-x-4 text-white">
            {/* Static Collection Button */}
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
          <img
            src={logo}
            alt="BlackWilbur"
            className="h-4 cursor-pointer"
            style={{ filter: "invert(1)" }}
            onClick={() => handleNavigate("/")}
          />
          <div className="flex items-center space-x-2">
            <button onClick={handleSearchIconClick} className="text-lg">
              <FaSearch />
            </button>

            <div className="relative">
              <FaShoppingCart
                onClick={toggleCartSidebar}
                className="text-lg cursor-pointer"
              />
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
            <MdMenu className="text-2xl cursor-pointer pr-2" onClick={toggleSidebar} />
          </div>
        </div>
        {showSearchBar && (
          <div className="absolute top-0 right-0 w-48 mt-12 mr-4 p-2 bg-black z-40">
            <Searchbar />
          </div>
        )}
      </nav>

      {/* Sidebar component */}
      <SidebarMenu isOpen={sidebar} onClose={() => setSidebar(false)} />

      {/* Add to Cart Sidebar */}
      <div className="text-black">
        <CartComponent isOpen={isCartOpen} onClose={toggleCartSidebar} />
      </div>
    </>
  );
};

export default Navbar;
