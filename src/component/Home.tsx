import React, { useEffect, useRef, useState, lazy, Suspense, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import videoSrc from "../asset/homepage-vide-updated.mov";
import OffersBanner from "../utiles/Banners/OffersBanner"; 
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
      <div className="px-10 bg-[#1b1b1b]">
      <Suspense fallback={<div>Loading Explore Section...</div>}>
        <ExploreSection
          exploreProducts={exploreProducts}
          handleNavigate={handleNavigate2}
          wishlist={wishlist}
          toggleWishlist={(product) => console.log(product)}
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
      {/* Best Sellers Section */}
      <Suspense fallback={<div>Loading Bestseller Section...</div>}>
        <BestSellersSection
          bestseller={bestseller}
          handleNavigate={handleNavigate}
          toggleWishlist={(product) => console.log(product)}
          wishlist={wishlist}
        />
      </Suspense>
      
      {/*Offersection* */}
      <section className="mt-4">
      <OffersBanner />
      </section>

      {/* Why Black Section */}
      <section className="relative py-2 mb-28">
  <div className="flex h-[150px] lg:h-[450px]">
    {/* Left Section - 50% width for the Image */}
    <div className=" w-1/2 relative">
      <img
        src={blackBackground}
        alt="Black Background"
        className="w-full h-full object-cover"
      />
    </div>

    {/* Right Section - 50% width for the Text */}
    <div className="w-1/2   text-white py-2 px-4 lg:px-12  lg:py-20 lg:pr-40 text-left">
      <h4 className="font-montserrat  sm:text-[48px] lg:text-[72px] font-semibold ">
        WHY BLACK
      </h4>
      <h1 className="border w-[30%]"></h1>
      <p className="lg:text-[30px] mt-8">little about story will come here about brand</p>
    </div>
  </div>
  <div className="flex h-[150px] lg:h-[450px]">
  {/* Left Section - 50% width for the Text */}
  <div className="w-1/2 text-white py-2 px-4 lg:px-12 lg:py-20 lg:pl-40 text-right">
    <h4 className="font-montserrat sm:text-[48px] lg:text-[72px] font-semibold">
      LITTLE ABOUT
    </h4>
    <div className="border border-white w-[30%] ml-auto"></div>
    <p className="lg:text-[30px] mt-8">
      Little about story will come here about brand
    </p>
  </div>

  {/* Right Section - 50% width for the Image */}
  <div className="w-1/2 relative">
    <img
      src={blackBackground}
      alt="Black Background"
      className="w-full h-full object-cover"
    />
  </div>
</div>

</section>

            <button
              className="px-6 mb-9 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition"
              onClick={() => handleNavigate("/about-us")}
            >
              Learn More
            </button>
      </div>
    </>
  );
};

export default Home;