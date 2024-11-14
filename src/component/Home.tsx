import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import videoSrc from "../asset/homepage-vide-updated.MOV";
import blackBackground from "../asset/blackBackground.png";
import { fetchBestSeller, fetchExplore } from "../services/api";
import { Product} from "../utiles/types";
import GetFeatured from "./GetFeatured";
import Carousel from "./Carousel";
import OffersBanner from "./OffersBanner";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const productRef = useRef<HTMLDivElement | null>(null);
  const [bestseller, setBestSeller] = useState<Product[]>([]);
  const [exploreProducts, setExploreProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]); // Wishlist state
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for managing popup visibility

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

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
    const fetchData = async () => {
      try {
        const fetchedCategories = await fetchBestSeller();
        setBestSeller(fetchedCategories);
        const fetchedExplore = await fetchExplore();
        setExploreProducts(fetchedExplore);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
    // Fetch wishlist from local storage
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  return (
    <>
        <Carousel/>
      {/* Best Sellers Section */}
      <section className="py-16 bg-[#1B1B1B] w-full relative overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-8">
          <h2 className="md:ml-8 text-[25px] sm:text-4xl md:text-5xl font-normal font-montserrat uppercase leading-tight text-white mb-8 text-start">
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
              className="flex gap-1 sm:gap-2 overflow-x-auto w-full snap-x snap-mandatory "
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {bestseller.map((bestseller) => {
                const productImages = bestseller.image;
                const imageSrc = productImages.length > 0 ? productImages : "default-image-url.jpg";

                return (
                  <div
                    key={bestseller.id}
                    className="sm:min-h-[52vh] max-h-[72vh] min-w-[200px] sm:min-w-[350px] lg:min-w-[400px] relative card bg-[#0B0B0B] overflow-hidden flex flex-col items-center justify-between rounded-md"
                  >
                    <img
                      className="w-full h-[94%] object-contain transition-transform duration-300 ease-in-out transform hover:scale-105"
                      onClick={() => handleNavigate(`/Product/${bestseller.id}`)}
                      src={imageSrc}
                      alt={bestseller.name}
                    />
                    <div className="flex justify-between items-center pl-2 pr-2 w-full md:h-9 sm:h-5 bg-white">
                      {" "}
                      <div className="text-[#282828] text-[10px] w-3/4 sm:text-base md:text-base font-semibold truncate responsive-text">
                        {bestseller.name.toUpperCase()}
                      </div>
                      <div className=" text-[#58595B] text-[10px] sm:text-sm md:text-sm font-semibold responsive-text">
                        ₹ {bestseller.price}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleWishlist(bestseller.id)}
                      className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center ${
                        wishlist.includes(bestseller.id) ? "bg-red-500" : "bg-gray-500"
                      } text-white`}
                    >
                      {wishlist.includes(bestseller.id) ? "♥" : "♡"}
                    </button>
                  </div>
                );
              })}
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
      
      {/* Large Screen Section (Visible only for screens over 1000px) */}
      <section className="py-16 bg-[#1B1B1B] relative hidden md:block">
      <div className="mb-16"><OffersBanner/></div>

        <div className="container mx-auto md:px-6 text-center">
          <div className="relative w-full h-[90vh] overflow-hidden">
            <video
              src={videoSrc}
              autoPlay
              loop
              muted
              className="absolute top-1/2 left-1/2 w-full h-full object-contain"
              style={{
                transform: "translate(-50%, -50%)",
              }}
            >
              Your browser does not support the video tag.
            </video>
            {/* Button to open the popup */}
            <button
              onClick={togglePopup}
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-gray-800 transition"
            >
              Featured on BlackWilbur.com
            </button>
          </div>
        </div>

        {/* Popup for GetFeatured */}
        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
            <div className="relative w-full h-screen max-w-3xl flex items-center justify-center p-6 backdrop-blur-sm text-white rounded-lg shadow-lg overflow-hidden">
              <GetFeatured />
              <button onClick={togglePopup} className="absolute top-2 right-2 text-white text-3xl">
                &times; {/* Close button */}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Small Screen Section (Visible only for screens under 1000px) */}
      <section className="py-16 bg-[#1B1B1B] relative block md:hidden">
      <OffersBanner/>

        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="relative w-full h-[90vh] overflow-hidden">
            <video
              src={videoSrc}
              autoPlay
              loop
              muted
              className="absolute top-1/2 left-1/2 w-full h-full max-w-none"
              style={{
                objectFit: "contain",
                transform: "translate(-50%, -50%)",
                transformOrigin: "center",
              }}
            >
              Your browser does not support the video tag.
            </video>
            {/* Button to open the popup */}
            <button
              onClick={togglePopup}
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:bg-gray-800 transition text-lg md:text-xl" // Increased padding and font size
            >
              Featured on BlackWilbur.com
            </button>
          </div>
        </div>

        {/* Popup for GetFeatured */}
        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
            <div className="relative w-full h-screen max-w-3xl flex items-center justify-center p-6 backdrop-blur-sm text-white rounded-lg shadow-lg overflow-hidden">
              <GetFeatured />
              <button onClick={togglePopup} className="absolute top-2 right-2 text-white text-2xl">
                &times; {/* Close button */}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Explore Our Collections Section */}
      <section className="py-16 bg-[#1b1b1b] text-white">
        <div className="container mx-auto">
          <h2 className=" ml-2 text-[20px] sm:text-4xl md:text-5xl font-normal font-montserrat uppercase leading-tight text-white mb-4 text-start">
            Explore Our Collections
          </h2>
          <div className="product-container w-full mt-6 px-0">
            <div className="p-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-[5px] sm:gap-[2px] md:gap[3px]">
              {exploreProducts.map((product) => (
                <div
                  key={product.id}
                  className="relative bg-[#0B0B0B] overflow-hidden flex flex-col justify-between sm:min-h-[52vh] max-h-[72vh] rounded-sm sm:rounded-none"
                >
                  <img
                    className="w-full h-[94%] object-contain cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105"
                    onClick={() => handleNavigate(`/Product/${product.id}`)}
                    src={product.image && product.image.length > 0 ? product.image : ""}
                    alt={product.name}
                  />
                  <div className="flex justify-between items-center pl-2 pr-2 w-full md:h-9 sm:h-5 h-4 bg-white">
                    {" "}
                    <div className="text-[#282828] text-[10px] sm:w-3/4 md:w-3/4 w-1/2 sm:text-base md:text-base font-semibold truncate responsive-text">
                      {product.name.toUpperCase()}
                    </div>
                    <div className=" text-[#58595B] text-[10px] sm:text-sm md:text-sm font-semibold responsive-text">
                      ₹ {product.price}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center ${
                      wishlist.includes(product.id) ? "bg-red-500" : "bg-gray-500"
                    } text-white md:w-10 md:h-10 sm:w-10 sm:h-10`}
                  >
                    {wishlist.includes(product.id) ? "♥" : "♡"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <button
              className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
              onClick={() => handleNavigate("/collection")}
            >
              Shop Collections
            </button>
          </div>
        </div>
      </section>

      {/* Why Black Section */}
      <section className="relative py-16 bg-black mb-28">
        <div className="absolute inset-0 w-[100%] h-[706px]">
          <img
            src={blackBackground}
            alt="Black Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4 py-16">
          <div className="flex flex-col items-center justify-center">
            <h2
              className="font-montserrat text-[48px] lg:text-[93px] font-semibold leading-[81px] text-center mt-20 mb-24"
              style={{ width: "100%", maxWidth: "599px" }}
            >
              Why Black
            </h2>
            <button
              className="px-6 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition"
              onClick={() => handleNavigate("/about-us")}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
