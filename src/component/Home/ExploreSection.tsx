import React, { lazy, Suspense } from "react";
import { Product } from "../../utiles/types";
import { useNavigate } from "react-router-dom";
const ProductCard = lazy(() => import("../../utiles/Cards/ProductCard"));

interface ExploreSectionProps {
  exploreProducts: Product[];
  wishlist: Product[];
  handleNavigate: (path: string) => void;
  toggleWishlist: (product: Product) => void;
}

const ExploreSection: React.FC<ExploreSectionProps> = ({
  exploreProducts,
  handleNavigate,
  wishlist,
  toggleWishlist,
}) => {
  const navigate = useNavigate();
  const handleNavigate2 = (path: string) => navigate(path);

  return (
    <section className="py-16 bg-[#1b1b1b] text-white">
      <div className="container mx-auto">
        <h2 className=" ml-2 text-[20px] sm:text-4xl md:text-5xl font-normal font-montserrat uppercase leading-tight text-white mb-4 text-start">
          Explore Our Collections
        </h2>
        <div className="product-container w-full mt-6 px-0">
          <div className="p-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-[5px] sm:gap-[2px] md:gap[3px]">
            {exploreProducts.map((product) => (
              <Suspense
                fallback={<div className="text-white">Loading...</div>}
                key={product.id}
              >
                <ProductCard
                  key={product.id}
                  product={product}
                  handleNavigate={handleNavigate}
                  isWishlisted={wishlist.includes(product)}
                  onToggleWishlist={toggleWishlist}
                />
              </Suspense>
            ))}
          </div>
        </div>
        <div className="mt-12 flex justify-center">
          <button
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
            onClick={() => handleNavigate2("/collection")}
          >
            Shop Collections
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;
