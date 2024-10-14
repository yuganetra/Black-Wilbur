import React from "react";

// Skeleton component for the loading state
const Skeleton = () => {
  return (
    <div className="bg-[#1B1B1B] text-white min-h-screen flex flex-col">
      <section className="w-full flex flex-col lg:flex-row gap-10">
        {/* Skeleton for Image Section */}
        <div className="w-full md:h-[85vh] lg:h-[750px] lg:w-1/2 flex lg:flex-col flex-row bg-slate-50 overflow-x-hidden">
          <div className="flex lg:flex-col flex-row items-center w-full h-full overflow-x-scroll">
            {Array(3)
              .fill("")
              .map((_, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 flex items-center justify-center bg-[#7A7A7A] w-full h-full min-w-[300px] md:min-w-[400px] animate-pulse"
                />
              ))}
          </div>
        </div>

        {/* Skeleton for Product Details Section */}
        <div className="w-full lg:w-1/2 flex flex-col text-left p-4">
          <div className="h-8 bg-gray-700 w-3/4 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-700 w-1/4 mb-4 animate-pulse"></div>

          {/* Rating Skeleton */}
          <div className="flex items-center mb-4">
            <div className="h-6 bg-gray-700 w-1/4 mb-4 animate-pulse"></div>
            <div className="flex gap-2 ml-4">
              {Array(5)
                .fill("")
                .map((_, index) => (
                  <div key={index} className="w-6 h-6 bg-gray-700 rounded-full animate-pulse"></div>
                ))}
            </div>
          </div>

          {/* Size Selection Skeleton */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-white mb-2">Select Size:</h4>
            <div className="flex gap-2">
              {Array(3)
                .fill("")
                .map((_, index) => (
                  <div key={index} className="w-12 h-12 bg-gray-700 rounded-full animate-pulse"></div>
                ))}
            </div>
          </div>

          {/* Skeleton for Buttons */}
          <div className="flex gap-4 mb-8">
            <div className="px-4 py-2 bg-gray-700 rounded-full w-32 animate-pulse"></div>
            <div className="px-4 py-2 bg-gray-700 rounded-full w-32 animate-pulse"></div>
          </div>

          {/* Description Skeleton */}
          <div className="w-full lg:w-3/4 mb-4 mt-4">
            <div className="h-4 bg-gray-700 w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-700 w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-700 w-3/4 animate-pulse"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Skeleton;
