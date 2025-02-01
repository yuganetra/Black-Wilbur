import React, { useEffect, useRef, useState, lazy, Suspense, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import videoSrc from "../asset/homepage-vide-updated.mov";
import blackBackground from "../asset/blackBackground.png";
import { fetchBestSeller, fetchExplore } from "../services/api";
import { Product } from "../utiles/types";
import Carousel from "../utiles/Carousel";
import FullPageLoader from "./Home/FullPageLoader"; // Import the new loader component

// Lazy-load sections
const VideoSection = lazy(() => import("./Home/VideoSection"));
const BestSellersSection = lazy(() => import("./Home/BestSellersSection"));
const ExploreSection = lazy(() => import("./Home/ExploreSection"));

const Home: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const [bestseller, setBestSeller] = useState<Product[]>([]);
  const [exploreProducts, setExploreProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Track loading state for individual sections
  const [isBestSellerLoaded, setIsBestSellerLoaded] = useState(false);
  const [isExploreLoaded, setIsExploreLoaded] = useState(false);

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
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  useEffect(() => {
    // Handle video play/mute based on visibility
    const video = videoRef.current;
    if (video) {
      if (isInView) {
        video.muted = false;
        video
          .play()
          .catch((error) => console.error("Error playing video:", error));
      } else {
        video.muted = true;
        video.pause();
      }
    }
  }, [isInView, videoRef]);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const fetchedCategories = await fetchBestSeller();
        setBestSeller(fetchedCategories);
        setIsBestSellerLoaded(true);
      } catch (error) {
        console.error("Error fetching bestsellers:", error);
      }
    };

    if (bestseller.length === 0) fetchBestSellers();
  }, [bestseller]);

  useEffect(() => {
    const fetchExploreProducts = async () => {
      try {
        const fetchedExplore = await fetchExplore();
        setExploreProducts(fetchedExplore);
        setIsExploreLoaded(true);
      } catch (error) {
        console.error("Error fetching explore products:", error);
      }
    };

    if (exploreProducts.length === 0) fetchExploreProducts();
  }, [exploreProducts]);

  // Update overall loading state
  useEffect(() => {
    setIsLoading(!isBestSellerLoaded || !isExploreLoaded);
  }, [isBestSellerLoaded, isExploreLoaded]);

  const handleNavigate = (path: string) => navigate(path);
  const handleNavigate2 = useCallback(
    (id: string) => {
      navigate(`/Product/${id}`);
    },
    [navigate]
  );
  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  // If still loading, show full-page loader
  if (isLoading) {
    return <FullPageLoader />;
  }

  return (
    <>
      <Carousel />
      
      <Suspense fallback={<div>Loading Explore Section...</div>}>
        <ExploreSection
          exploreProducts={exploreProducts}
          handleNavigate={handleNavigate2}
          wishlist={wishlist}
          toggleWishlist={(product) => console.log(product)}
        />
      </Suspense>
      {/* Best Sellers Section */}
      <Suspense fallback={<div>Loading Bestseller Section...</div>}>
        <BestSellersSection
          bestseller={bestseller}
          handleNavigate={handleNavigate}
          toggleWishlist={(product) => console.log(product)}
          wishlist={wishlist}
        />
      </Suspense>
      
      {/* Video Section */}
      <Suspense fallback={<div>Loading Video Section...</div>}>
        <VideoSection
          videoSrc={videoSrc}
          isPopupOpen={isPopupOpen}
          togglePopup={togglePopup}
        />
      </Suspense>
      
      {/* Explore Our Collections Section */}

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