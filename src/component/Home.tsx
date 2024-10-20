import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import carousel1 from "../asset/chpp-carousel.jpg";
import videoSrc from "../asset/homepage-vid.MOV";
import blackBackground from "../asset/blackBackground.png";
import { fetchBestSeller, fetchExplore } from "../services/api";
import { Product } from "../utiles/types";
import GetFeatured from "./GetFeatured";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const productRef = useRef<HTMLDivElement | null>(null);
  const [bestseller, setBestSeller] = useState<Product[]>([]);
  const [exploreProducts, setExploreProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]); // Wishlist state
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

  const toggleWishlist = (productId: number) => {
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
      {/* Carousel Section */}
      <div className="relative h-screen overflow-hidden -mt-20">
        <img
          src={carousel1}
          alt="Carousel 1"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center top" }}
        />
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-10 sm:left-10 sm:right-10 text-white flex flex-col justify-between items-center md:items-start md:flex-row md:justify-between px-4 sm:px-10">
          <h1 className="font-montserrat text-xl sm:text-2xl md:text-3xl lg:text-7xl font-semibold uppercase leading-tight text-center md:text-left mb-4 md:mb-0">
            Unleash the
            <br /> Power of Black
          </h1>

          <button
            onClick={() => handleNavigate("/collection")}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-black text-white rounded-full hover:bg-white hover:text-black transition lg:mt-20"
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Best Sellers Section */}
      <section className="py-16 bg-[#1B1B1B] w-full relative overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-8">
          <h2 className="ml-8 text-4xl lg:text-5xl font-normal font-montserrat uppercase leading-tight text-white mb-8 text-start">
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
              className="flex gap-2 overflow-x-auto w-full snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {bestseller.map((bestseller) => {
                const productImages = bestseller.product_images;
                const imageSrc =
                  productImages.length > 0
                    ? productImages[0].image
                    : "default-image-url.jpg";

                return (
                  <div
                    key={bestseller.id}
                    className="min-w-[300px] sm:min-w-[350px] lg:min-w-[400px] relative card bg-[#7A7A7A] overflow-hidden flex flex-col items-center"
                    style={{ height: "auto" }}
                  >
                    <img
                      className="w-full h-auto  object-cover transition-transform duration-300 ease-in-out transform hover:scale-110"
                      onClick={() =>
                        handleNavigate(`/Product/${bestseller.id}`)
                      }
                      src={imageSrc}
                      alt={bestseller.name}
                    />
                    <div className="absolute bottom-4 left-4 text-[#282828] text-lg font-semibold">
                      {bestseller.name.toUpperCase()}
                    </div>
                    <div className="absolute bottom-4 right-4 text-[#636363] text-lg font-semibold">
                      {bestseller.price} rs
                    </div>

                    <button
                      onClick={() => toggleWishlist(bestseller.id)}
                      className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center ${
                        wishlist.includes(bestseller.id)
                          ? "bg-red-500"
                          : "bg-gray-500"
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
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="relative w-full h-[90vh] overflow-hidden">
            <video
              src={videoSrc}
              autoPlay
              loop
              muted
              className="absolute top-1/2 left-1/2 w-[100vh] h-auto max-w-none"
              style={{
                objectFit: "contain",
                transform: "translate(-50%, -50%) rotate(270deg)",
                transformOrigin: "center",
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
              <button
                onClick={togglePopup}
                className="absolute top-2 right-2 text-white text-2xl"
              >
                &times; {/* Close button */}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Small Screen Section (Visible only for screens under 1000px) */}
      <section className="py-16 bg-[#1B1B1B] relative block md:hidden">
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
                transform: "translate(-50%, -50%) rotate(270deg)",
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
              <button
                onClick={togglePopup}
                className="absolute top-2 right-2 text-white text-2xl"
              >
                &times; {/* Close button */}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Explore Our Collections Section */}
      <section className="py-16 bg-[#1b1b1b] text-white">
        <div className="container mx-auto">
          <h2 className="text-4xl px-2 lg:text-5xl lg:px-0 font-normal font-montserrat uppercase leading-tight text-white mb-8 text-start">
            Explore Our Collections
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 px-2">
            {exploreProducts.map((exploreProduct) => {
              return (
                <div
                  key={exploreProduct.id}
                  className="relative card bg-[#7A7A7A] overflow-hidden flex flex-col items-center"
                  style={{ height: "auto" }} // Keep auto for flexibility
                >
                  {/* Image Section */}
                  {exploreProduct.product_images.length > 0 ? (
                    <img
                      className="w-full h-auto max-h-[600px] object-cover transition-transform duration-300 ease-in-out transform hover:scale-110"
                      onClick={() =>
                        handleNavigate(`/Product/${exploreProduct.id}`)
                      }
                      src={exploreProduct.product_images[0]?.image}
                      alt={exploreProduct.name}
                    />
                  ) : (
                    <div
                      onClick={() =>
                        handleNavigate(`/Product/${exploreProduct.id}`)
                      }
                      className="w-full h-screen max-h-[600px] bg-gray-300 animate-pulse flex items-center justify-center"
                    >
                      {/* Skeleton loader */}
                      <span className="text-white h-auto text-lg">
                        Loading...
                      </span>
                    </div>
                  )}

                  {/* Product Name and Price */}
                  <div className="absolute bottom-4 left-4 text-[#282828] text-lg sm:text-sm font-semibold">
                    {exploreProduct.name.toUpperCase()}
                  </div>
                  <div className="absolute bottom-4 right-4 text-[#636363] text-lg sm:text-sm font-semibold">
                    {exploreProduct.price} rs
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(exploreProduct.id)}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center ${
                      wishlist.includes(exploreProduct.id)
                        ? "bg-red-500"
                        : "bg-gray-500"
                    } text-white`}
                  >
                    {wishlist.includes(exploreProduct.id) ? "♥" : "♡"}
                  </button>
                </div>
              );
            })}
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
        <div
          className="absolute inset-0"
          style={{ width: "100%", height: "706px" }}
        >
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
