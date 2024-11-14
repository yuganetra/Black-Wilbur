import React from 'react';
const OffersBanner: React.FC = () => {

  return (
    <div className="relative">
      {/* Banner with centered, systematic offer cards */}
      <div className="bg-black text-white py-6 w-full cursor-pointer">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">Exclusive Offers</h2>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
            {/* Individual Offer Cards */}
            <div className="border border-gray-700 p-4 rounded-lg w-full sm:w-1/4 text-center">
              <h3 className="text-lg font-semibold">New Designs Launched</h3>
              <p className="text-gray-400">Explore our latest collection - shop now!</p>
            </div>
            <div className="border border-gray-700 p-4 rounded-lg w-full sm:w-1/4 text-center">
              <h3 className="text-lg font-semibold">Buy 2, Get 15% Off</h3>
              <p className="text-gray-400">Use code <strong>Buy2</strong> at cart.</p>
            </div>
            <div className="border border-gray-700 p-4 rounded-lg w-full sm:w-1/4 text-center">
              <h3 className="text-lg font-semibold">Limited Edition</h3>
              <p className="text-gray-400">Get exclusive items while stocks last!</p>
            </div>
            <div className="border border-gray-700 p-4 rounded-lg w-full sm:w-1/4 text-center">
              <h3 className="text-lg font-semibold">Buy 3, Get 30% Off</h3>
              <p className="text-gray-400">Use code <strong>Buy3</strong> at cart.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersBanner;
