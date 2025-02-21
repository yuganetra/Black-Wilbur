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
      className="relative min-w-[200px] sm:min-w-[350px] lg:min-w-[300px] bg-[#1b1b1b]"
    >
      {/* Image container with fixed aspect ratio */}
      <div className="relative w-full h-[220px] sm:h-[260px] lg:h-[300px] aspect-[3/4]">
        <img
          className="w-full h-full object-cover cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-95"
          onClick={() => handleNavigate(`/Product/${bestseller.id}`)}
          src={imageSrc}
          alt={bestseller.name}
        />
        <button
          onClick={() => toggleWishlist(bestseller)}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center ${
            wishlist.includes(bestseller) ? "bg-red-500" : "bg-gray-500/75"
          } text-white`}
        >
          {wishlist.includes(bestseller) ? "♥" : "♡"} 
        </button>
      </div>

      {/* Product info with minimal height */}
      <div className="w-full text-left bg-[#1b1b1b] py-2 px-3">
        <div className="text-white text-[10px] w-3/4 sm:text-base md:text-base font-semibold truncate">
          {bestseller.name.toUpperCase()}
        </div>
        <div className="text-[#58595B] text-[10px] sm:text-sm md:text-sm font-semibold">
          ₹ {bestseller.price}
        </div>
      </div>
    </div>
  );
};

export default BestSellerProductCard;
