// CPUI

import React, { useState } from "react";
import { AiOutlineLeft, AiOutlinePlus, AiOutlineRight } from "react-icons/ai";
import { MdClose, MdFilterList } from "react-icons/md";
import img from "../asset/collection-carousel.jpg";
import Tshirt from "../asset/black-tees.jpg";

// Temp Product array without T-shirts
const products = [
  { id: 5, category: "knitted", name: "Knitted", price: "300", image: Tshirt, size: "small" },
  { id: 6, category: "knitted", name: "Knitted", price: "1000", image: Tshirt, size: "medium" },
  { id: 7, category: "knitted", name: "Knitted", price: "3000", image: Tshirt, size: "large" },
  { id: 8, category: "knitted", name: "Knitted", price: "5000", image: Tshirt, size: "X-large" },
  { id: 9, category: "polo", name: "Polo", price: "300", image: Tshirt, size: "small" },
  { id: 10, category: "polo", name: "Polo", price: "1000", image: Tshirt, size: "medium" },
  { id: 11, category: "polo", name: "Polo", price: "3000", image: Tshirt, size: "large" },
  { id: 12, category: "polo", name: "Polo", price: "5000", image: Tshirt, size: "X-large" },
  {
    id: 13,
    category: "round-neck",
    name: "Round Neck",
    price: "300",
    image: Tshirt,
    size: "small",
  },
  {
    id: 14,
    category: "round-neck",
    name: "Round Neck",
    price: "1000",
    image: Tshirt,
    size: "medium",
  },
  {
    id: 15,
    category: "round-neck",
    name: "Round Neck",
    price: "3000",
    image: Tshirt,
    size: "large",
  },
  {
    id: 16,
    category: "round-neck",
    name: "Round Neck",
    price: "5000",
    image: Tshirt,
    size: "X-large",
  },
  { id: 17, category: "oversize", name: "Oversize", price: "300", image: Tshirt, size: "small" },
  { id: 18, category: "oversize", name: "Oversize", price: "1000", image: Tshirt, size: "medium" },
  { id: 19, category: "oversize", name: "Oversize", price: "3000", image: Tshirt, size: "large" },
  { id: 20, category: "oversize", name: "Oversize", price: "5000", image: Tshirt, size: "X-large" },
];

const Collection: React.FC<{ category: string }> = ({ category }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const productsPerPage = 9;

  // State for Filters
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Expandable filter sections
  const [showSize, setShowSize] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [showCategory, setShowCategory] = useState(false);

  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    if (category === "collection") return true;

    const matchesCategory = selectedCategories.length
      ? selectedCategories.includes(product.category)
      : product.category === category;

    const matchesSize = selectedSizes.length ? selectedSizes.includes(product.size) : true;

    // Price filtering
    let matchesPrice = true;
    if (selectedPrice) {
      const priceValue = parseInt(product.price, 10);
      if (selectedPrice === "Below 1000") {
        matchesPrice = priceValue < 1000;
      } else if (selectedPrice === "1000 - 3000") {
        matchesPrice = priceValue >= 1000 && priceValue <= 3000;
      } else if (selectedPrice === "Above 3000") {
        matchesPrice = priceValue > 3000;
      }
    }

    return matchesCategory && matchesSize && matchesPrice;
  });

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (selectedPrice === "High to Low") {
      return parseInt(b.price) - parseInt(a.price);
    } else if (selectedPrice === "Low to High") {
      return parseInt(a.price) - parseInt(b.price);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIdx = (currentPage - 1) * productsPerPage;
  const currentProducts = sortedProducts.slice(startIdx, startIdx + productsPerPage);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleApplyFilters = () => {
    // Apply selected filters logic here
    console.log("Selected Sizes:", selectedSizes);
    console.log("Selected Price:", selectedPrice);
    console.log("Selected Categories:", selectedCategories);
    toggleSidebar(); // Close the sidebar after applying filters
  };

  // Function to clear all filters
  const handleRemoveAllFilters = () => {
    setSelectedSizes([]);
    setSelectedPrice(null);
    setSelectedCategories([]);
  };

  return (
    <div className="main-container scrollbar-thin w-full min-h-screen bg-[#1b1b1b] text-white">
      <div className="image-container w-full h-[100vh] -mt-28">
        <img
          className="w-full h-full object-cover"
          src={img}
          alt="carousel"
          style={{ objectPosition: "center bottom" }}
        />
      </div>
      <div className="content-container w-full bg-[#141414] pb-4">
        <div className="header-container w-full flex justify-between items-center p-6 border-b border-[#6C6C6C]">
          <div className="collections text-4xl lg:text-5xl font-normal font-montserrat uppercase leading-tight text-white mb-2 text-start">
            COLLECTIONS
          </div>
          <div className="flex items-center">
            <div
              className="filters hidden md:block text-[#FFFFFF] font-medium cursor-pointer"
              style={{
                fontWeight: 200,
                fontSize: "clamp(1.5rem, 3vw, 1.75rem)",
                lineHeight: "89px",
                width: "115px",
                height: "89px",
              }}
              onClick={toggleSidebar}
            >
              FILTERS
            </div>
            <MdFilterList
              className="text-[#FFFFFF] text-2xl md:hidden cursor-pointer"
              onClick={toggleSidebar}
            />
          </div>
        </div>

        {/* Product grid */}
        <div className="product-container w-full mt-6 px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 w-full">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="relative bg-[#7A7A7A] rounded-sm overflow-hidden flex items-center justify-center"
                style={{ height: "95vh" }}
              >
                <img
                  className="w-full h-full object-cover cursor-pointer"
                  src={product.image}
                  alt={product.name}
                />
                <div className="absolute bottom-2 left-2 text-[#282828] text-sm font-semibold">
                  {product.name}
                </div>
                <div className="absolute bottom-2 right-2 text-[#636363] text-sm font-semibold">
                  {product.price} rs
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="pagination-container flex justify-center items-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="w-7 h-7 text-black rounded-full bg-white disabled:bg-gray-400 flex items-center justify-center"
          >
            <AiOutlineLeft className="text-xl" />
          </button>
          <span className="mx-2">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="w-7 h-7 text-black rounded-full bg-white disabled:bg-gray-400 flex items-center justify-center"
          >
            <AiOutlineRight className="text-xl" />
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-80 h-full bg-[#141414] text-white z-50 flex flex-col items-center transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pt-6 pb-4 border-b border-[#6C6C6C] flex justify-between items-center w-[220px]">
          <span className="text-lg font-normal">FILTERS</span>
          <MdClose className="text-xl cursor-pointer" onClick={toggleSidebar} />
        </div>
        <div className="flex-grow mt-6 w-[235px]">
          {/* SIZE Filter */}
          <div className="mb-4">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowSize(!showSize)}
            >
              <span>SIZE</span>
              <AiOutlinePlus className="text-md" />
            </div>
            {showSize && (
              <div className="mt-2 flex flex-col">
                {["small", "medium", "large", "X-large"].map((size) => (
                  <label key={size} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2"
                      value={size}
                      checked={selectedSizes.includes(size)}
                      onChange={(e) => {
                        const newSize = e.target.value;
                        setSelectedSizes((prev) =>
                          prev.includes(newSize)
                            ? prev.filter((s) => s !== newSize)
                            : [...prev, newSize]
                        );
                      }}
                    />
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* PRICE Filter */}
          <div className="mb-4">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowPrice(!showPrice)}
            >
              <span>SORT</span>
              <AiOutlinePlus className="text-md" />
            </div>
            {showPrice && (
              <div className="mt-2 flex flex-col">
                {["Low to High", "High to Low"].map((sortOption) => (
                  <label key={sortOption} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="mr-2"
                      value={sortOption}
                      checked={selectedPrice === sortOption}
                      onChange={(e) => setSelectedPrice(e.target.value)}
                    />
                    {sortOption}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* CATEGORY Filter */}
          <div className="mb-4">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowCategory(!showCategory)}
            >
              <span>CATEGORY</span>
              <AiOutlinePlus className="text-md" />
            </div>
            {showCategory && (
              <div className="mt-2 flex flex-col">
                {["knitted", "polo", "round-neck", "oversize"].map((cat) => (
                  <label key={cat} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2"
                      value={cat}
                      checked={selectedCategories.includes(cat)}
                      onChange={(e) => {
                        const newCategory = e.target.value;
                        setSelectedCategories((prev) =>
                          prev.includes(newCategory)
                            ? prev.filter((c) => c !== newCategory)
                            : [...prev, newCategory]
                        );
                      }}
                    />
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div
            className="apply-filters-button bg-white text-black cursor-pointer w-full py-2 mt-4"
            onClick={handleApplyFilters}
          >
            APPLY FILTERS
          </div>

          {/* Remove All Filters Button */}
          <div
            className="remove-filters-button bg-red-500 text-black cursor-pointer w-full py-2 mt-2"
            onClick={() => {
              handleRemoveAllFilters();
              toggleSidebar();
            }}
          >
            REMOVE ALL FILTERS
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
