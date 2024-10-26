import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { Product } from "../utiles/types"; // Adjust import based on your types location
import { fetchSearchResults } from "../services/api"; // Your API function to fetch search results

interface SearchSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchSidebar: React.FC<SearchSidebarProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent scrolling
    } else {
      document.body.style.overflow = "unset"; // Allow scrolling
    }

    // Cleanup to reset overflow when the component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setQuery(term);

    if (term) {
      const fetchedResults = await fetchSearchResults(term);
      if (fetchedResults) {
        setResults(fetchedResults);
      }
    } else {
      setResults([]);
    }
  };

  const handleNavigate = (productId: string) => {
    onClose();
    navigate(`/product/${productId}`); // Navigate to the product details page
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Optionally handle search submission logic
    setQuery(""); // Clear the query after submission
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[60]"
          onClick={onClose}
        ></div>
      )}

      {/* Search Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#141414] text-white transform transition-transform duration-300 ease-in-out z-[70] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <h2 className="text-lg font-bold">Search Products</h2>
          <MdClose className="text-2xl cursor-pointer" onClick={onClose} />
        </div>

        <form onSubmit={handleSearchSubmit} className="p-4">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for products..."
            className="border border-gray-300 rounded p-2 w-full mb-2 text-black"
          />
        </form>

        {/* Results List */}
        {results.length > 0 && (
          <ul className="mt-2 px-4">
            {results.map((product) => (
              <li
                key={product.id}
                className="border-b border-gray-600 py-2 cursor-pointer hover:bg-gray-700 transition"
                onClick={() => handleNavigate(`${product.id}`)}
              >
                {product.name} - ${product.price}
              </li>
            ))}
          </ul>
        )}

        {/* No results found message */}
        {results.length === 0 && query && (
          <div className="p-4 text-gray-400">
            No results found for "<strong>{query}</strong>"
          </div>
        )}
      </div>
    </>
  );
};

export default SearchSidebar;
