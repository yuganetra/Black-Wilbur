import React, { useRef, lazy, Suspense } from "react";

import { Product } from "../../utiles/types";

// Lazy load BestSellerProductCard
const BestSellerProductCard = lazy(() => import("../../utiles/Cards/BestSellerProductCard"));

interface BestSellersSectionProps {
  bestseller: Product[];
  handleNavigate: (path: string) => void;
  toggleWishlist: (product: Product) => void;
  wishlist: Product[];
}

const BestSellersSection: React.FC<BestSellersSectionProps> = ({
  bestseller,
  handleNavigate,
  toggleWishlist,
  wishlist,
}) => {
  const productRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    if (productRef.current) {
      productRef.current.scrollBy({ top: 0, left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (productRef.current) {
      productRef.current.scrollBy({ top: 0, left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 bg-[#1B1B1B]  w-full relative overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-8">
        <h2 className="md:ml-8 text-center font-semibold text-[20px] sm:text-4xl md:text-3xl font-normal font-montserrat uppercase leading-tight text-white mb-8 ">
          Our Bestsellers
        </h2>
        <div className="flex items-center">
          <button
            onClick={scrollLeft}
            className="hidden md:block text-white bg-black rounded-full p-2 mr-2 hover:bg-gray-800 transition"
          >
            &lt;
          </button>
          <div
            ref={productRef}
            className="flex gap-1 sm:gap-2 overflow-x-auto w-full snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {bestseller.map((product) => (
              <Suspense fallback={<div className="text-white">Loading...</div>} key={product.id}>
                <BestSellerProductCard
                  bestseller={product}
                  handleNavigate={handleNavigate}
                  toggleWishlist={toggleWishlist}
                  wishlist={wishlist}
                />
              </Suspense>
            ))}
          </div>
          <button
            onClick={scrollRight}
            className="hidden md:block text-white bg-black rounded-full p-2 ml-2 hover:bg-gray-800 transition"
          >
            &gt;
          </button>
        </div>
      </div>
    </section>
  );
};

export default BestSellersSection;
