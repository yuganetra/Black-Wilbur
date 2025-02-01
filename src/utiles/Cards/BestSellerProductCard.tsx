import React from "react";
import { Product } from "../types";

// Define the interface for bestsellers
interface BestSellerProps {
  bestseller: Product;
  handleNavigate: (url: string) => void;
  toggleWishlist: (id: Product) => void;
  wishlist: Product[]; 
}

const BestSellerProductCard: React.FC<BestSellerProps> = ({
  bestseller,
  handleNavigate,
  toggleWishlist,
  wishlist,
}) => {
  // Fallback image in case there are no images
  const imageSrc = bestseller.image.length > 0 ? bestseller.image : "default-image-url.jpg";

  return (
    <div
      key={bestseller.id}
      className="sm:min-h-[52vh] max-h-[68vh] min-w-[200px] sm:min-w-[350px] lg:min-w-[300px] relative card bg-[#0B0B0B] overflow-hidden flex flex-col items-center justify-between rounded-md"
    >
      <img
        className="w-full h-[98%] md:h-[88%] object-contain transition-transform duration-300 ease-in-out transform hover:scale-95"
        onClick={() => handleNavigate(`/Product/${bestseller.id}`)}
        src={imageSrc}
        alt={bestseller.name}
      />
      <div className=" w-full md:h-12 sm:h-5 bg-black">
        <div className="text-white pl-2 text-left text-[8px] w-3/4 sm:text-base md:text-base font-semibold truncate responsive-text">
          {bestseller.name.toUpperCase()}
        </div>
        <div className=" text-[#58595B] pl-2 pb-2 text-left text-[8px] sm:text-sm md:text-sm font-semibold responsive-text">
          ₹ {bestseller.price}
        </div>
      </div>

      <button
        onClick={() => toggleWishlist(bestseller)}
        className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center ${
          wishlist.includes(bestseller) ? "bg-red-500" : "bg-gray-500"
        } text-white`}
      >
        {wishlist.includes(bestseller) ? "♥" : "♡"} 
      </button>
    </div>
  );
};

export default BestSellerProductCard;
