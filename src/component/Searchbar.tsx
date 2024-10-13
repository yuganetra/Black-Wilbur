import React, { useState } from "react";
import Tshirt from "../asset/black-tees.jpg";

const products = [
  { id: 1, name: "T-Shirt", price: "3000", image: Tshirt },
  { id: 2, name: "Hoodie", price: "3000", image: Tshirt },
  { id: 3, name: "Shirt", price: "3000", image: Tshirt },
  { id: 4, name: "Sweater", price: "3000", image: Tshirt },
  { id: 5, name: "Knitted", price: "3000", image: Tshirt },
  { id: 6, name: "Polo", price: "3000", image: Tshirt },
];

const Searchbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowModal(e.target.value.length > 0); // Show modal if there's a search term
  };

  const handleFocus = () => {
    setShowModal(searchTerm.length > 0); // Show modal on focus if there's input
  };

  const handleBlur = () => {
    // Delay hiding modal to allow clicks on modal items
    setTimeout(() => {
      setShowModal(false);
    }, 100);
  };

  // Filter products based on the search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="border border-gray-300 rounded-lg p-2 w-full text-black" // Full width for small screens
        placeholder="Search for products..."
      />
      {showModal && (
        <div className="absolute left-0 z-50 w-full max-w-xs bg-white shadow-lg border border-gray-300 rounded-lg mt-1 overflow-y-auto">
          {/* Adjusted size and positioning */}
          <div className="p-2">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <p
                  key={product.id}
                  className="text-black cursor-pointer hover:bg-gray-100 py-1 text-center"
                >
                  {product.name} - ${product.price}
                </p>
              ))
            ) : (
              <p className="text-black py-2 text-center">No results found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Searchbar;
