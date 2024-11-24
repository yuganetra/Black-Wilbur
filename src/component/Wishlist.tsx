import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../utiles/types";

const Wishlist: React.FC = () => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const navigate = useNavigate(); // React Router hook for navigation

  useEffect(() => {
    // Fetch wishlist data from localStorage
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  // Navigate to product details page
  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold mb-4">Wishlist</h2>
      {wishlist.length > 0 ? (
        <ul className="space-y-4 border border-gray-200 dark:border-gray-700 ">
          {wishlist.map((item) => (
            <li
              key={item.id}
              className="flex items-center bg-black text-white p-4 rounded-md shadow-md cursor-pointer"
              onClick={() => handleProductClick(item.id)} // Navigate on click
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-contain rounded-md mr-4"
              />
              <div className="text-left">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-300">Price: ₹{item.price}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your wishlist is currently empty.</p>
      )}
    </div>
  );
};

export default Wishlist;
