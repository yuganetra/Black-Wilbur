import { useState, useEffect } from "react";
import { AiOutlineLeft, AiOutlinePlus, AiOutlineRight } from "react-icons/ai";
import { MdClose, MdFilterList } from "react-icons/md";
import img from "../asset/collection-carousel.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCollection } from "../services/api";
import { ProductCollection } from "../utiles/types";

const Collection: React.FC = () => {
  const { category = "all" } = useParams<{ category?: string }>();
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
  const [wishlist, setWishlist] = useState<string[]>([]); // Wishlist state
  const [allProducts, setAllProducts] = useState<ProductCollection[]>([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prevWishlist) => {
      const newWishlist = prevWishlist.includes(productId)
        ? prevWishlist.filter((id) => id !== productId) // Remove from wishlist
        : [...prevWishlist, productId]; // Add to wishlist

      localStorage.setItem("wishlist", JSON.stringify(newWishlist)); // Save to local storage
      return newWishlist;
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchProduct = await fetchCollection();
        // Check if fetchProduct is an array before mapping
        const formattedProducts = Array.isArray(fetchProduct)
          ? fetchProduct.map((item: any) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              category: item.category,
              image: item.image, // Default to an empty array if product_images is undefined
              description: item.description || "",
              sizes:
                item.sizes?.map((size: any) => ({
                  id: size.id,
                  size: size.size,
                })) || [], // Default to an empty array if sizes is undefined
              rating: item.rating || 0,
            }))
          : []; // Default to an empty array if fetchProduct is not an array

        setAllProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
    // Fetch wishlist from local storage
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  useEffect(() => {
    setSelectedSizes([]);
    setSelectedPrice(null);
    setSelectedCategories([]);
    setCurrentPage(1);
  }, [category]);

  // Filter products based on selected filters
  const filteredProducts = allProducts.filter((product) => {
    const trimmedProductCategory = product.category.trim().toLowerCase();
    const trimmedSelectedCategory = category?.trim().toLowerCase();

    const matchesCategory =
      trimmedSelectedCategory === "collection" || // Allow all products if category is "collection"
      (trimmedProductCategory &&
        trimmedProductCategory === trimmedSelectedCategory);

    const matchesSize = selectedSizes.length
      ? product.sizes?.some((sizeObj: { size: string }) =>
          selectedSizes.includes(sizeObj.size)
        ) ?? false
      : true;

    // Price filtering
    let matchesPrice = true;
    if (selectedPrice) {
      const priceValue = product.price;
      if (selectedPrice === "Below 1000") {
        matchesPrice = priceValue < 1000;
      } else if (selectedPrice === "1000 - 3000") {
        matchesPrice = priceValue >= 1000 && priceValue <= 3000;
      } else if (selectedPrice === "Above 3000") {
        matchesPrice = priceValue > 3000;
      }
    }
    // Category filtering
    const matchesSelectedCategories =
      selectedCategories.length === 0 ||
      selectedCategories.includes(trimmedProductCategory);

    return (
      matchesCategory &&
      matchesSize &&
      matchesPrice &&
      matchesSelectedCategories
    ); // Combine conditions
  });

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (selectedPrice === "High to Low") {
      return b.price - a.price;
    } else if (selectedPrice === "Low to High") {
      return a.price - b.price;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIdx = (currentPage - 1) * productsPerPage;
  const currentProducts =
    category === "all"
      ? allProducts // Use sortedProducts directly if category is "collection"
      : sortedProducts
          .slice(startIdx, startIdx + productsPerPage)
          .filter(Boolean);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleApplyFilters = () => {
    toggleSidebar(); // Close the sidebar after applying filters
  };

  // Function to clear all filters
  const handleRemoveAllFilters = () => {
    setSelectedSizes([]);
    setSelectedPrice(null);
    setSelectedCategories([]);
  };

  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="main-container scrollbar-thin w-full min-h-screen bg-[#1b1b1b] text-white">
      <div className="image-container w-full h-[100vh] sm:h-[90vh] ">
        <img
          className="w-full h-full object-cover"
          src={img}
          alt="carousel"
          style={{ objectPosition: "center top" }}
        />
      </div>
      <div className="content-container w-full bg-[#141414] pb-4">
        <div className="header-container w-full flex justify-between items-center p-6 border-b border-[#6C6C6C]">
          <div className="collections md:text-4xl sm:text-2xl lg:text-5xl font-normal font-montserrat uppercase leading-tight text-white mb-2 text-start">
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
          <div className="p-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-[5px] sm:gap-[2px] md:gap[3px]">
            {currentProducts.map((product) => {
              return (
                <div
                  key={product.id}
                  className="relative bg-white overflow-hidden flex flex-col justify-between sm:min-h-[52vh] max-h-[72vh] rounded-sm sm:rounded-none"
                >
                  <img
                    className="w-full h-[93%] object-contain cursor-pointer"
                    onClick={() => handleNavigate(`/Product/${product.id}`)}
                    src={
                      product.image && product.image !== ""
                        ? product.image
                        : "https://via.placeholder.com/300" // Fallback URL
                    }
                    alt={product.name}
                  />
                  <div className="flex justify-between items-center p-1">
                    <div className="text-[#282828] text-[8px] sm:text-base md:text-base font-semibold">
                      {product.name}
                    </div>
                    <div className="text-[#58595B] text-[8px] sm:text-sm md:text-base font-semibold">
                      ₹ {product.price}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center ${
                      wishlist.includes(product.id)
                        ? "bg-red-500"
                        : "bg-gray-500"
                    } text-white md:w-10 md:h-10 sm:w-10 sm:h-10`}
                  >
                    {wishlist.includes(product.id) ? "♥" : "♡"}
                  </button>
                </div>
              );
            })}
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
                  <label
                    key={size}
                    className="flex items-center cursor-pointer"
                  >
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
                  <label
                    key={sortOption}
                    className="flex items-center cursor-pointer"
                  >
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
