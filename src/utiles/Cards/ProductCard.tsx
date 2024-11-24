import React from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { Product, ProductCollection } from "../types";

interface ProductCardProps {
  product: Product | ProductCollection; 
  onNavigate: (id: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: Product) => void;
}

const calculateTotalQuantity = (product: ProductCollection): number => {
  if (product.sizes && Array.isArray(product.sizes)) {
    return product.sizes.reduce((total, { quantity }) => total + (quantity || 0), 0);
  }
  else{
    // console.log(product)
  }
  return 10;
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onNavigate,
  isWishlisted,
  onToggleWishlist,
}) => {
  const totalQuantity = calculateTotalQuantity(product as ProductCollection);
  let stockMessage = "";
  let disableButton = false;
  if (totalQuantity === 0) {
    stockMessage = "Out of Stock";
    disableButton = true;
  } else if (totalQuantity <= 5) {
    stockMessage = `${totalQuantity} left`;
  }

  return (
    <div className="relative bg-[#0B0B0B] overflow-hidden flex flex-col justify-between sm:min-h-[52vh] max-h-[72vh] rounded-sm sm:rounded-none">
      {/* Product image */}
      <img
        className="w-full h-[94%] object-contain cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105"
        onClick={() => onNavigate(product.id)}
        src={product.image || "https://via.placeholder.com/300"} 
        alt={product.name} 
      />
      
      {/* Stock information banner */}
      {stockMessage && (
        <div
          className="absolute top-0 left-0 text-white text-sm font-semibold py-1 px-1"
          style={{
            zIndex: 10, 
            transformOrigin: "top left", 
            width: "50px", 
            whiteSpace: "nowrap", 
          }}
        >
          {stockMessage}
        </div>
      )}

      <div className="flex justify-between items-center pl-2 pr-2 w-full md:h-8 sm:h-5 h-4 bg-white">
        <div className="text-[#282828] text-[10px] sm:w-3/4 md:w-3/4 w-1/2 sm:text-base md:text-base font-semibold truncate">
          {product.name.toUpperCase()}
        </div>
        <div className="text-[#58595B] text-[10px] sm:text-sm md:text-sm font-semibold">
          ₹ {product.price}
        </div>
      </div>

      <button
        onClick={() => onToggleWishlist(product)}
        disabled={disableButton}
        className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center ${isWishlisted ? "bg-red-500" : "bg-gray-500"} text-white md:w-10 md:h-10 sm:w-10 sm:h-10`}
      >
        <AiOutlineHeart />
      </button>
    </div>
  );
};

export default ProductCard;
