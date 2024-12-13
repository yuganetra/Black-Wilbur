import React from "react";
import { useNavigate } from "react-router-dom";

const OffersBanner: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => navigate(path);

  return (
    <div className="bg-black text-white py-12">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6">
          Special Offer
        </h2>
        <p className="text-lg sm:text-xl text-center mb-4">
          Flat 30% Off on All Products. Limited Time Only!
        </p>
        <p className="text-md sm:text-lg text-center text-gray-300 mb-8">
          Use code <span className="font-semibold">Flat30</span> at cart.
        </p>

        {/* Call-to-Action */}
        <div className="flex justify-center mb-10">
          <button
            className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition duration-300"
            onClick={() => handleNavigate("/collection")}
          >
            Shop Now
          </button>
        </div>

        {/* Offer Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="border border-white py-6 px-4 rounded-lg hover:bg-gray-800 transition duration-300">
            <h3 className="text-xl font-semibold mb-2">Flat 30% Off</h3>
            <p className="text-gray-400">On every product in our store.</p>
          </div>
          <div className="border border-white py-6 px-4 rounded-lg hover:bg-gray-800 transition duration-300">
            <h3 className="text-xl font-semibold mb-2">Exclusive Products</h3>
            <p className="text-gray-400">Limited stocks available, shop now!</p>
          </div>
          <div className="border border-white py-6 px-4 rounded-lg hover:bg-gray-800 transition duration-300">
            <h3 className="text-xl font-semibold mb-2">
              Hurry, Time is Ticking
            </h3>
            <p className="text-gray-400">
              Sale ends soon. Don’t miss out on these deals!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersBanner;
