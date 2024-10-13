import { useNavigate } from "react-router-dom";
import { MdFacebook } from "react-icons/md";
import { BsTwitterX } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa";
import logo from "../asset/logo.svg";

const Footer = () => {
  const navigate = useNavigate()

  const handleNavigate = (path:string)=>{
    navigate(path)
  }
  return (
    <div className="footer bg-[#000000] text-white w-full flex flex-col justify-center items-center p-4">
      <div className="footer-section1 flex flex-col lg:flex-row gap-12 lg:gap-24 items-center justify-center mb-8 w-full max-w-[848px] pt-[120px]">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 w-full items-center lg:items-start justify-center">
          <div className="flex flex-col space-y-4 w-full max-w-[260px] text-center lg:text-left">
            <h4 onClick={()=>handleNavigate("/collection")} className="font-semibold text-lg cursor-pointer">SHOP</h4>
            <ul className="space-y-2 text-[#7d7d7d] cursor-pointer">
              <li>Oversize</li>
              <li>Round Neck</li>
              <li>Polo</li>
              <li>Knitted</li>
            </ul>
          </div>
          <div className="flex flex-col space-y-4 w-full max-w-[260px] text-center lg:text-left">
            <h4 onClick={()=>handleNavigate("/about-us")} className="font-semibold cursor-pointer text-lg">ABOUT US</h4>
            <ul className="space-y-2 text-[#7d7d7d] cursor-pointer">
              <li onClick={()=>handleNavigate("/about-us/values")}>Our Values</li>
              <li onClick={()=>handleNavigate("/about-us/mission")}>Mission</li>
              <li onClick={()=>handleNavigate("/about-us/sustainability")}>Sustainability</li>
            </ul>
          </div>
          <div className="flex flex-col space-y-4 w-full max-w-[260px] text-center lg:text-left">
            <h4 className="font-semibold text-lg">CONTACT</h4>
            <ul className="space-y-2 text-[#7d7d7d]">
              <li>hey@blackwilbur.com</li>
              <li>+91 0000000000</li>
            </ul>
          </div>
        </div>
        <div className="flex space-x-6 justify-center lg:justify-start">
          <MdFacebook className="text-2xl cursor-pointer hover:text-gray-400 transition" />
          <BsTwitterX className="text-2xl cursor-pointer hover:text-gray-400 transition" />
          <FaInstagram className="text-2xl cursor-pointer hover:text-gray-400 transition" />
        </div>
      </div>

      <div className="footer-section2 mt-20 md:mt-24 lg:mt-36 w-full max-w-[848px] px-4">
        <img src={logo} alt="Logo" className="w-full h-auto" />
      </div>

      <div className="footer-section3 mt-8 md:mt-12 text-center text-sm w-full max-w-[848px] px-4">
        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6">
          <p className="mt-2">Copyrights by Kiorons</p>
          <p onClick={()=>handleNavigate("/terms-and-condition")} className="mt-2 cursor-pointer text-[#7d7d7d]">Terms & Conditions</p>
          <p onClick={()=>handleNavigate("/privacy-policy")} className="mt-2 cursor-pointer text-[#7d7d7d]">Privacy Policy</p>
          <p onClick={()=>handleNavigate("/return-policy")} className="mt-2 cursor-pointer text-[#7d7d7d]">Return Policy</p>          
        </div>
      </div>
    </div>
  );
};

export default Footer;
