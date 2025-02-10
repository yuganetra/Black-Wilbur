import React, { lazy, Suspense } from "react";
import { Product } from "../../utiles/types";
import { GiClothes } from "react-icons/gi";
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
    <section className="py-16 bg-[#1b1b1b] border-b border-gray-500 text-white">
      <div className="container mx-auto ">
        <h2 className=" lg:ml-14 font-semibold  text-[20px] sm:text-4xl md:text-3xl font-normal font-montserrat uppercase leading-tight text-white mb-4">
          The Collection which is made precisely
        </h2>
        <div className="product-container w-full mt-6 px-0">

          <div className="p-2 lg:m-7 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-[5px] sm:gap-[2px] md:gap[3px]">
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
            <button className="bg-black lg:m-7 text-xl md:text-2xl lg:text-4xl text-white p-2 m-4 lg:px-10 hover:bg-[#1b1b1b] hover:text-black hover:border-2 hover:border-black" onClick={() => handleNavigate2("/collection")}>
              <div className=" items-center justify-center flex  font-bold">
              Explore 
              </div>
              <div className="font-bold"> More </div>




            </button>
            

          </div>

        </div>
        
      </div>
    </section>
  );
};

export default ExploreSection;
