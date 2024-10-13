import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdClose, MdFacebook } from "react-icons/md";
import { BsTwitterX } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa";

// Define SidebarProps interface here
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for popup visibility
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  //   const handleDistributorshipClick = () => {
  //     setIsPopupOpen(true); // Open popup when 'DISTRIBUTORSHIP' is clicked
  //   };

  //   const closePopup = () => {
  //     setIsPopupOpen(false); // Close popup
  //   };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={onClose}></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#141414] text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex items-center justify-start p-4">
          <MdClose className="text-2xl cursor-pointer" onClick={onClose} />
        </div>
        <div className="flex flex-col items-start justify-center gap-6 pt-20 pl-10 pb-8 font-light tracking-wide ">
          <a
            // onClick={() => handleNavigate("/Login")}
            className="text-2xl cursor-pointer"
          >
            LOGIN
          </a>
          <a
            // onClick={() => handleNavigate("/")}
            className="text-2xl cursor-pointer"
          >
            CONTACT
          </a>
          <a onClick={() => handleNavigate("/collection")} className="text-2xl cursor-pointer">
            COLLECTION
          </a>
          <a
            // onClick={() => handleNavigate("/AboutUs")}
            className="text-2xl cursor-pointer"
          >
            ABOUT US
          </a>
          <a
            // onClick={handleDistributorshipClick}
            className="text-2xl cursor-pointer"
          >
            DISTRIBUTORSHIP
          </a>
        </div>
        <div className="flex items-start justify-center space-x-4 pr-14 pt-16">
          <MdFacebook className="text-2xl" />
          <BsTwitterX className="text-2xl" />
          <FaInstagram className="text-2xl" />
        </div>
      </div>

      {/* Popup */}
      {/* {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative text-black">
            <MdClose
              className="absolute top-2 right-2 text-2xl cursor-pointer"
              //   onClick={closePopup}
            />
            <h2 className="text-xl font-semibold mb-4">Enter Your Details</h2>
            <form className="text-black">
              <div className="mb-4">
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-600 rounded bg-transparent text-white"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-600 rounded bg-transparent text-white"
                  placeholder="Enter your phone number"
                />
              </div>
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )} */}
    </>
  );
};

export default Sidebar;
