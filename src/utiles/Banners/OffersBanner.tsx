import React from "react";
import { useNavigate } from "react-router-dom";

const OffersBanner: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => navigate(path);

  return (
    <div className="bg-black text-white py-4">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <h2 className="text-xl sm:text-3xl font-bold text-center mb-3">
          Special Offer
        </h2>
        <p className="text-lg sm:text-lg text-center mb-3">
          Flat 30% Off on All Products. Limited Time Only!
        </p>
        <p className="text-md sm:text-md text-center text-gray-300 mb-4">
          Use code <span className="font-semibold">Flat30</span> at cart.
        </p>

        {/* Call-to-Action */}
        <div className="flex justify-center mb-6">
          <button
            className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition duration-300"
            onClick={() => handleNavigate("/collection")}
          >
            Shop Now
          </button>
        </div>

        {/* Offer Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
          <div className="border border-white py-4 px-4 rounded-lg hover:bg-gray-800 transition duration-300">
            <h3 className="text-md font-semibold mb-1">Flat 30% Off</h3>
            <p className="text-gray-400 text-sm">On every product in our store.</p>
          </div>
          <div className="border border-white py-4 px-4 rounded-lg hover:bg-gray-800 transition duration-300">
            <h3 className="text-md font-semibold mb-1">Exclusive Products</h3>
            <p className="text-gray-400 text-sm">Limited stocks available, shop now!</p>
          </div>

          <div className="border border-white py-4 px-4 rounded-lg hover:bg-gray-800 transition duration-300">
            <h3 className="text-md font-semibold mb-1">
              Hurry, Time is Ticking
            </h3>
            <p className="text-gray-400 text-sm">


              Sale ends soon. Don’t miss out on these deals!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersBanner;
