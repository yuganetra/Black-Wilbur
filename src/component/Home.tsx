import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import videoSrc from "../asset/homepage-vide-updated.MOV";
import blackBackground from "../asset/blackBackground.png";
import { fetchBestSeller, fetchExplore } from "../services/api";
import { Product } from "../utiles/types";
import GetFeatured from "../utiles/Banners/GetFeatured";
import Carousel from "../utiles/Carousel";
import OffersBanner from "../utiles/Banners/OffersBanner";
import ProductCard from "../utiles/Cards/ProductCard"; // Import the ProductCard component
import BestSellerProductCard from "../utiles/Cards/BestSellerProductCard";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const productRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null); // Reference for the video section

  const [bestseller, setBestSeller] = useState<Product[]>([]);
  const [exploreProducts, setExploreProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]); // Wishlist state
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for managing popup visibility
  const [isInView, setIsInView] = useState(false); // State to track if video section is in view
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch wishlist from localStorage on mount
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  useEffect(() => {
    // Intersection Observer for video visibility
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { root: null, threshold: 0.5 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  useEffect(() => {
    // Handle video play/mute based on visibility
    const video = videoRef.current;
    if (video) {
      if (isInView) {
        video.muted = false;
        video.play().catch((error) => console.error('Error playing video:', error));
      } else {
        video.muted = true;
        video.pause();
      }
    }
  }, [isInView,videoRef]);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setIsLoading(true);
        const fetchedCategories = await fetchBestSeller();
        setBestSeller(fetchedCategories);
      } catch (error) {
        console.error("Error fetching bestsellers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (bestseller.length === 0) fetchBestSellers();
  }, [bestseller]);

  useEffect(() => {
    const fetchExploreProducts = async () => {
      try {
        setIsLoading(true);
        const fetchedExplore = await fetchExplore();
        setExploreProducts(fetchedExplore);
      } catch (error) {
        console.error("Error fetching explore products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (exploreProducts.length === 0) fetchExploreProducts();
  }, [exploreProducts]);


  const handleNavigate = (path: string) => navigate(path);

  const handleNavigate2 = useCallback(
    (id: string) => {
      navigate(`/Product/${id}`);
    },
    [navigate]
  );

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

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
            >{bestseller.map((bestseller) => (
              <BestSellerProductCard
                key={bestseller.id}
                bestseller={bestseller}
                handleNavigate={handleNavigate} // Ensure this function is defined
                toggleWishlist={toggleWishlist} // Ensure this function is defined
                wishlist={wishlist} // The wishlist array should be passed down
              />
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
      
      <section
      ref={sectionRef}
      className="py-16 bg-[#1B1B1B] relative hidden md:block"
    >
      <div className="mb-16"><OffersBanner /></div>

      <div className="container mx-auto md:px-6 text-center">
        <div className="relative w-full h-[90vh] overflow-hidden">
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            loop
            playsInline
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
                <ProductCard
                key={product.id}
                product={product}
                handleNavigate={handleNavigate2}
                isWishlisted={wishlist.includes(product)}
                onToggleWishlist={toggleWishlist}
              />
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
