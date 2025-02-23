import { useNavigate } from "react-router-dom";
import { MdFacebook } from "react-icons/md";
import { BsTwitterX } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa";
import logo from "../asset/logo.svg";
import { useEffect, useState } from "react";
import GetFeatured from "../utiles/Banners/GetFeatured";
import { Category } from "../utiles/types";
import { fetchCategories } from "../services/api";

const Footer = () => {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
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
    <div className="footer bg-[#000000] text-white w-full flex flex-col justify-center items-center p-4 cursor-pointer">
      <div className="footer-section1 flex flex-col lg:flex-row gap-12 lg:gap-24 items-center justify-center mb-8 w-full max-w-[848px] pt-[120px]">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 w-full items-center lg:items-start justify-center">
          <div className="flex flex-col space-y-4 w-full max-w-[260px] text-center lg:text-left">
            <h4
              onClick={() => handleNavigate("/collection")}
              className="font-semibold text-lg cursor-pointer"
            >
              SHOP
            </h4>
            <ul className="space-y-2 text-gray-500">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li
                    key={category.id}
                    className="hover:text-white cursor-pointer"
                    onClick={() =>
                      handleNavigate(`/collection/${category.name}`)
                    }
                  >
                    {category.name}
                  </li>
                ))
              ) : (
                <li>No categories available</li>
              )}
            </ul>
          </div>
          <div className="flex flex-col space-y-4 w-full max-w-[260px] text-center lg:text-left">
            <h4
              onClick={() => handleNavigate("/about-us")}
              className="font-semibold cursor-pointer text-lg"
            >
              ABOUT US
            </h4>
            <ul className="space-y-2 text-gray-500 cursor-pointer">
              <li
                className="hover:text-white"
                onClick={() => handleNavigate("/about-us/values")}
              >
                Our Values
              </li>
              <li
                className="hover:text-white"
                onClick={() => handleNavigate("/about-us/mission")}
              >
                Mission
              </li>
              <li
                className="hover:text-white"
                onClick={() => handleNavigate("/about-us/sustainability")}
              >
                Sustainability
              </li>
            </ul>
          </div>
          <div className="flex flex-col space-y-4 w-full max-w-[260px] text-center lg:text-left">
            <h4 className="font-semibold text-lg">CONTACT</h4>
            <ul className="space-y-2 text-gray-500">
              <li>
                <a
                  href="mailto:Blackwilburofficial@gmail.com"

                  className="hover:text-white"
                >
                  Blackwilburofficial@gmail.com
                </a>
              </li>
              {/* <li className="hover:text-white">+91 9575555383</li> */}
              <li onClick={() => togglePopup()} className="hover:text-white">
                Featured on BlackWilbur.com
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center lg:items-start space-y-2">
          <h3 className="text-lg font-semibold]">FOLLOW</h3>
          <div className="flex flex-col text-gray-500 space-y-3">
            <a

              href="https://www.facebook.com/people/Black-Wilbur/61565342369272/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 hover:text-gray-400 transition"
            >
              <MdFacebook className="text-2xl" />
              <span className="text-sm">Facebook</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 hover:text-gray-400 transition"
            >
              <BsTwitterX className="text-2xl" />
              <span className="text-sm">Twitter</span>
            </a>
            <a
              href="https://www.instagram.com/blackwilburofficial?igsh=MTlndnFkMzVidmtrdQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 hover:text-gray-400 transition"
            >
              <FaInstagram className="text-2xl" />
              <span className="text-sm">Instagram</span>
            </a>
          </div>
        </div>
          {/* Popup for GetFeatured */}
          {isPopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
              <div className="relative w-full h-screen max-w-3xl flex items-center justify-center p-6 backdrop-blur-sm text-white rounded-lg shadow-lg overflow-hidden">
                <GetFeatured />
                <button
                  onClick={togglePopup}
                  className="absolute top-2 right-2 text-white text-2xl"
                >
                  &times; {/* Close button */}
                </button>
              </div>
            </div>
          )}
        </div>
        
      </div>

      <div className="footer-section2 mt-0 md:mt-24 lg:mt-12 w-full max-w-[700px] px-4">
        <img src={logo} alt="Logo" className="w-full h-auto" />
      </div>


      <div className="footer-section3 mt-8 md:mt-12 text-center text-sm w-full max-w-[1000px] px-4">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-6">
          <div>
            <p className="mt-2 select-none text-gray-500 cursor-default">
              Copyright © {new Date().getFullYear()} BlackWilbur™. All Rights Reserved.
            </p>
          </div>
          <div className="flex gap-4 text-gray-500 sm:items-center justify-center ">
          <p
            onClick={() => handleNavigate("/terms-and-condition")}
            className="mt-2 cursor-pointer hover:text-white text-[#7d7d7d]"

          >
            Terms & Conditions
          </p>
          <p
            onClick={() => handleNavigate("/privacy-policy")}
            className="mt-2 cursor-pointer hover:text-white text-[#7d7d7d]"
          >
            Privacy Policy
          </p>
          <p
            onClick={() => handleNavigate("/return-policy")}
            className="mt-2 cursor-pointer hover:text-white text-[#7d7d7d]"
          >
            Return Policy
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
