// CPUI

import React, { useState } from "react";
import { MdMenu } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa"; // Import the search icon
import logo from "../asset/white-logo.svg";
import SidebarMenu from "./Sidebar-Menu";
import Searchbar from "./Searchbar";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = (): JSX.Element => {
  const [sidebar, setSidebar] = useState<boolean>(false);
  const [hideNavbar, setHideNavbar] = useState<boolean>(false);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const navigate = useNavigate();

  const toggleSidebar = (): void => {
    setSidebar(!sidebar);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleSearchIconClick = () => {
    setShowSearchBar(!showSearchBar);
  };

  return (
    <>
      <nav
        className={`navbar sticky top-0 left-0 w-full flex items-center justify-between pl-4 pr-4 pb-2 bg-black z-50 transition-opacity duration-300 ease-in-out ${
          hideNavbar ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="hidden md:flex h-24 flex-col w-full">
          {/* For Large Screens */}
          <div className=" hidden h-20 md:flex items-center justify-between w-full pl-16 pr-16 text-white border-b-2 border-white">
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
              <FaCircleUser className="text-2xl cursor-pointer" />
              <FaShoppingCart className="text-2xl cursor-pointer" />
            </div>
          </div>

          {/* Mini Navbar */}
          <div className="hidden h-8 md:flex items-center justify-center w-full pl-16 pr-10 space-x-4 text-white">
            {["Collection", "Oversize", "Round Neck", "Polo", "Knitted"].map((item) => (
              <button
                key={item}
                onClick={() => handleNavigate(`/${item.toLowerCase().replace(/ /g, "-")}`)}
                className="relative text-sm font-semibold px-4 py-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-white after:transform after:scale-x-0 after:origin-right hover:after:scale-x-100 hover:after:origin-left after:transition-transform after:duration-300"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* For Medium and Small Screens */}
        <div className="flex md:hidden items-center justify-between w-full h-12 p-2 text-white">
          <img
            src={logo}
            alt="BlackWilbur"
            className="h-6 cursor-pointer"
            style={{ filter: "invert(1)" }}
            onClick={() => handleNavigate("/")} // Added navigation to logo
          />
          <div className="flex items-center space-x-2">
            {" "}
            {/* Adjusted spacing */}
            <button onClick={handleSearchIconClick} className="text-xl">
              <FaSearch />
            </button>
            <FaShoppingCart className="text-xl cursor-pointer" />
            <FaCircleUser className="text-xl cursor-pointer" />
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
    </>
  );
};

export default Navbar;
