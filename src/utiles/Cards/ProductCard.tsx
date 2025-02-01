import React from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { Product, ProductCollection } from "../types";

interface ProductCardProps {
  product: Product | ProductCollection; 
  handleNavigate: (url: string) => void;
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
  handleNavigate,
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
    <div className="relative m-6 m-1 bg-black overflow-hidden">
      {/* Product image container with smaller fixed aspect ratio */}
      <div className="relative w-full h-[220px] sm:h-[260px] lg:h-[300px]">
        <img
          className="w-full h-full object-cover cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-95"
          onClick={() => handleNavigate(`${product.id}`)}
          src={product.image || "https://via.placeholder.com/300"} 
          alt={product.name} 
        />
        
        {/* Stock information banner */}
        {stockMessage && (
          <div
            className="absolute top-0 left-0 text-white text-xs font-semibold py-1 px-1"
            style={{
              zIndex: 10, 
              transformOrigin: "top left", 
              width: "40px", 
              whiteSpace: "nowrap", 
            }}
          >
            {stockMessage}
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={() => onToggleWishlist(product)}
          disabled={disableButton}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center ${
            isWishlisted ? "bg-red-500" : "bg-gray-500/75"
          } text-white`}
        >
          <AiOutlineHeart className="text-base" />
        </button>
      </div>

      {/* Product name */}
      <div className="w-full h-[32px] flex items-center px-2 bg-black">
        <div className="text-white text-xs font-semibold truncate">
          {product.name.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
