import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import Tshirt from "../asset/black-tees.jpg";
// import { useCategories } from '../contexts/CategoryContext'; // Change this line
import { useNavigate } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "T-Shirt",
    price: "3000",
    image: Tshirt,
  },
  {
    id: 2,
    name: "T-Shirt",
    price: "3000",
    image: Tshirt,
  },
  {
    id: 3,
    name: "T-Shirt",
    price: "3000",
    image: Tshirt,
  },
  {
    id: 4,
    name: "T-Shirt",
    price: "3000",
    image: Tshirt,
  },
  {
    id: 4,
    name: "T-Shirt",
    price: "3000",
    image: Tshirt,
  },
  {
    id: 4,
    name: "T-Shirt",
    price: "3000",
    image: Tshirt,
  },
];
const SearchBar: React.FC = () => {
  const { setCategory } = useCategories(); // Use the hook instead
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const results = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchQuery, products]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsDropdownOpen(e.target.value.length > 0);
  };

  const handleProductClick = (id: number) => {
    navigate(`/Product/${id}`);
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCategory(searchQuery.trim().toLowerCase()); // Set the selected category in the context
      navigate("/collection"); // Navigate to the Collection page
    }
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearchSubmit}>
        {" "}
        {/* Wrap input in a form for submission */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search products..."
          className="p-2 rounded-full border border-gray-300 focus:outline-none focus:ring focus:ring-gray-400 text-black"
        />
      </form>
      {isDropdownOpen && filteredProducts.length > 0 && (
        <div className="absolute z-10 bg-black border border-gray-300 rounded-lg shadow-lg mt-1">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              className="p-2 hover:bg-gray-300 hover:text-black cursor-pointer"
            >
              {product.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
