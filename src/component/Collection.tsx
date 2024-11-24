import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCollection } from "../services/api";
import type { Product, ProductCollection } from "../utiles/types";
import SkeletonLoader from "../utiles/Skeletons/SkeletonLoader";
import Carousel from "../utiles/Carousel";
import { AiOutlineLeft, AiOutlinePlus, AiOutlineRight } from "react-icons/ai";
import { MdClose, MdFilterList } from "react-icons/md";
import ProductCard from "../utiles/Cards/ProductCard"; // Import the ProductCard component

// Constants
const PRODUCTS_PER_PAGE = 9;
const PRICE_RANGES = ["Low to High", "High to Low"] as const;
const SIZES = ["S", "M", "L", "XL","XXL"] as const;
const CATEGORIES = ["knitted", "polo", "round-neck", "oversize"] as const;

// Types
type FilterState = {
  sizes: string[];
  price: string | null;
  categories: string[];
};

const FilterSection = ({ 
  title, 
  isOpen, 
  onToggle, 
  children 
}: { 
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="mb-4">
    <div
      className="flex items-center justify-between cursor-pointer"
      onClick={onToggle}
    >
      <span>{title}</span>
      <AiOutlinePlus className="text-md" />
    </div>
    {isOpen && <div className="mt-2 flex flex-col">{children}</div>}
  </div>
);

const Collection: React.FC = () => {
  const { category = "all" } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    sizes: [],
    price: null,
    categories: [],
  });
  const [expandedSections, setExpandedSections] = useState({
    size: false,
    price: false,
    category: false,
  });
  const [wishlist, setWishlist] = useState<Product[]>(() => 
    JSON.parse(localStorage.getItem("wishlist") || "[]")
  );
  const [products, setProducts] = useState<ProductCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCollection();
        setProducts(Array.isArray(data) ? data.map(formatProduct) : []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Reset filters when category changes
  useEffect(() => {
    setFilters({ sizes: [], price: null, categories: [] });
    setCurrentPage(1);
  }, [category]);

  // Memoized filtered and sorted products
  const processedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const trimmedProductCategory = product.category.trim().toLowerCase();
      const trimmedSelectedCategory = category?.trim().toLowerCase();

      const categoryMatch = trimmedSelectedCategory === "all" || 
                          trimmedSelectedCategory === "collection" || 
                          trimmedProductCategory === trimmedSelectedCategory;

      const sizeMatch = filters.sizes.length === 0 || 
                       product.sizes?.some(({ size }) => filters.sizes.includes(size));

      const categoryFilterMatch = filters.categories.length === 0 || 
                                filters.categories.includes(trimmedProductCategory);

      return categoryMatch && sizeMatch && categoryFilterMatch;
    });

    // Sort products if price filter is applied
    if (filters.price) {
      filtered.sort((a, b) => {
        return filters.price === "High to Low" ? 
          b.price - a.price : 
          a.price - b.price;
      });
    }

    return filtered;
  }, [products, category, filters]);

  // Pagination calculations
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return processedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [processedProducts, currentPage]);

  const totalPages = Math.ceil(processedProducts.length / PRODUCTS_PER_PAGE);

  // Handlers
  const handleNavigate = useCallback((id: string) => {
    navigate(`/Product/${id}`);
  }, [navigate]);

  const toggleWishlist = (product: Product) => {
    setWishlist((prevWishlist: Product[]) => {
      const exists = prevWishlist.find((item) => item.id === product.id);
      let newWishlist;
  
      if (exists) {
        // Remove product if it exists
        newWishlist = prevWishlist.filter((item) => item.id !== product.id);
      } else {
        // Add product if it doesn't exist
        newWishlist = [...prevWishlist, product];
      }
  
      localStorage.setItem("wishlist", JSON.stringify(newWishlist)); // Save to localStorage
      return newWishlist;
    });
  };
  
  const updateFilters = useCallback((key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  if (isLoading) return <SkeletonLoader />;

  return (
    <div className="main-container scrollbar-thin w-full min-h-screen bg-[#1b1b1b] text-white">
      <Carousel />
      
      {/* Main Content */}
      <div className="content-container w-full bg-[#141414] pb-4">
        {/* Header */}
        <header className="w-full flex justify-between items-center p-6 border-b border-[#6C6C6C]">
          <h1 className="collections md:text-4xl sm:text-2xl lg:text-5xl font-normal font-montserrat uppercase">
            COLLECTIONS
          </h1>
          <div className="flex items-center">
            <button
              className="filters hidden md:block text-white font-medium cursor-pointer"
              style={{
                fontWeight: 200,
                fontSize: "clamp(1.5rem, 3vw, 1.75rem)",
                lineHeight: "89px",
                width: "115px",
                height: "89px",
              }}
              onClick={() => setSidebarOpen(true)}
            >
              FILTERS
            </button>
            <MdFilterList
              className="text-white text-2xl md:hidden cursor-pointer"
              onClick={() => setSidebarOpen(true)}
            />
          </div>
        </header>

        {/* Product Grid */}
        <div className="product-container w-full mt-6 px-0">
          <div className="p-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-[5px] sm:gap-[2px] md:gap[3px]">
            {currentProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={handleNavigate}
                isWishlisted={wishlist.includes(product)}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4">
          <button
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={currentPage === 1}
            className="w-7 h-7 text-black rounded-full bg-white disabled:bg-gray-400 flex items-center justify-center"
          >
            <AiOutlineLeft className="text-xl" />
          </button>
          <span className="mx-2">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage === totalPages}
            className="w-7 h-7 text-black rounded-full bg-white disabled:bg-gray-400 flex items-center justify-center"
          >
            <AiOutlineRight className="text-xl" />
          </button>
        </div>
      </div>

      {/* Filters Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div
        className={`fixed top-0 left-0 w-80 h-full bg-[#141414] text-white z-50 flex flex-col items-center transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pt-6 pb-4 border-b border-[#6C6C6C] flex justify-between items-center w-[220px]">
          <span className="text-lg font-normal">FILTERS</span>
          <MdClose 
            className="text-xl cursor-pointer" 
            onClick={() => setSidebarOpen(false)} 
          />
        </div>
        
        <div className="flex-grow mt-6 w-[235px]">
          {/* Size Filter */}
          <FilterSection
            title="SIZE"
            isOpen={expandedSections.size}
            onToggle={() => setExpandedSections(prev => ({ ...prev, size: !prev.size }))}
          >
            {SIZES.map((size) => (
              <label key={size} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={filters.sizes.includes(size)}
                  onChange={(e) => {
                    const newSizes = e.target.checked
                      ? [...filters.sizes, size]
                      : filters.sizes.filter(s => s !== size);
                    updateFilters("sizes", newSizes);
                  }}
                />
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </label>
            ))}
          </FilterSection>

          {/* Price Filter */}
          <FilterSection
            title="SORT"
            isOpen={expandedSections.price}
            onToggle={() => setExpandedSections(prev => ({ ...prev, price: !prev.price }))}
          >
            {PRICE_RANGES.map((option) => (
              <label key={option} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="mr-2"
                  checked={filters.price === option}
                  onChange={() => updateFilters("price", option)}
                />
                {option}
              </label>
            ))}
          </FilterSection>

          {/* Category Filter */}
          <FilterSection
            title="CATEGORY"
            isOpen={expandedSections.category}
            onToggle={() => setExpandedSections(prev => ({ ...prev, category: !prev.category }))}
          >
            {CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={filters.categories.includes(cat)}
                  onChange={(e) => {
                    const newCategories = e.target.checked
                      ? [...filters.categories, cat]
                      : filters.categories.filter(c => c !== cat);
                    updateFilters("categories", newCategories);
                  }}
                />
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </label>
            ))}
          </FilterSection>

          {/* Action Buttons */}
          <button
            className="w-full py-2 mt-4 bg-white text-black cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          >
            APPLY FILTERS
          </button>

          <button
            className="w-full py-2 mt-2 bg-red-500 text-black cursor-pointer"
            onClick={() => {
              setFilters({ sizes: [], price: null, categories: [] });
              setSidebarOpen(false);
            }}
          >
            REMOVE ALL FILTERS
          </button>
        </div>
      </div>
    </div>
  );
};

// Utility functions
const formatProduct = (item: any): ProductCollection => ({
  id: item.id,
  name: item.name,
  price: item.price,
  category: item.category,
  image: item.image,
  description: item.description || "",
  sizes: item.sizes?.map((size: any) => ({
    id: size.id,
    size: size.size,
    quantity : size.quantity
  })) || [],
  rating: item.rating || 0,
});

export default Collection;