import React from "react";
import Carousel from "../Carousel";

const SkeletonLoader: React.FC = () => {
  return (
    <div className="main-container scrollbar-thin w-full min-h-screen bg-[#1b1b1b] text-white">
      <Carousel/>
      <div className="content-container w-full bg-[#141414] pb-4">
        {/* Header Section */}
        <div className="header-container w-full flex justify-between items-center p-6 border-b border-[#6C6C6C]">
          <div className="collections md:text-4xl sm:text-2xl lg:text-5xl font-normal font-montserrat uppercase leading-tight text-white mb-2 text-start">
            COLLECTIONS
          </div>
          {/* Search or Filter Section Skeleton */}
          <div className="w-20 h-5 bg-gray-400 rounded-sm animate-pulse"></div>
        </div>

        {/* Product Grid (Skeleton) */}
        <div className="product-container w-full mt-6 px-4 sm:px-6 md:px-10 lg:px-12">
          <div className="p-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(12)
              .fill(null)
              .map((_, idx) => (
                <div
                  key={idx}
                  className="relative bg-[#0B0B0B] overflow-hidden flex flex-col justify-between sm:min-h-[52vh] max-h-[72vh] rounded-sm animate-pulse"
                >
                  <div className="w-full h-[80%] bg-gray-500 rounded-sm"></div>
                  <div className="flex justify-between items-center pl-4 pr-4 w-full md:h-8 sm:h-5 h-4 bg-white mt-2">
                    <div className="w-3/4 h-4 bg-gray-400 rounded-sm"></div>
                    <div className="w-1/4 h-4 bg-gray-400 rounded-sm"></div>
                  </div>
                  <div className="absolute top-4 right-4 w-6 h-6 bg-gray-500 rounded-full"></div>
                </div>
              ))}
          </div>
        </div>

        {/* Pagination Controls (Skeleton) */}
        <div className="pagination-container flex justify-center items-center mt-6 mb-4">
          <button
            disabled
            className="w-8 h-8 text-black rounded-full bg-white disabled:bg-gray-400 flex items-center justify-center animate-pulse"
          ></button>
          <span className="mx-4">
            <div className="w-24 h-5 bg-gray-400 rounded-sm animate-pulse"></div>
          </span>
          <button
            disabled
            className="w-8 h-8 text-black rounded-full bg-white disabled:bg-gray-400 flex items-center justify-center animate-pulse"
          ></button>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
