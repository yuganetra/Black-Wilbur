import React, { useState, useEffect, useRef, useCallback } from "react";
import OffersBanner from "../../utiles/Banners/OffersBanner";
import GetFeatured from "../../utiles/Banners/GetFeatured";

interface VideoSectionProps {
  videoSrc: string;
  isPopupOpen: boolean;
  togglePopup: () => void;
}

const VideoSection: React.FC<VideoSectionProps> = ({
  videoSrc,
  isPopupOpen,
  togglePopup,
}) => {
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth >= 768);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  // Helper function for playing a video
  const playVideo = (videoRef: React.RefObject<HTMLVideoElement>, muted: boolean) => {
    const video = videoRef.current;
    if (video) {
      video.muted = muted;
      video.play().catch((error) => {
        console.error("Video playback error:", error);
      });
    }
  };

  // Setup video playback based on screen size
  const setupVideoPlayback = useCallback(() => {
    if (isDesktop) {
      playVideo(desktopVideoRef, true);
      mobileVideoRef.current?.pause();
    } else {
      playVideo(mobileVideoRef, true);
      desktopVideoRef.current?.pause();
    }
  }, [isDesktop]);

  // Handle screen resize and initial setup
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    setupVideoPlayback();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setupVideoPlayback]);

  const renderVideoSection = (
    isDesktop: boolean,
    videoRef: React.RefObject<HTMLVideoElement>,
    sectionClass: string
  ) => (
    <section className={sectionClass}>
      <OffersBanner />
      <div className="container mx-auto px-2 py-2 md:px-6 text-center">
        <div className="relative h-screen
         flex flex-col items-center justify-center">
          <video
            ref={videoRef}
            src={videoSrc}
            loop
            muted
            playsInline
            className="absolute top-1/2 left-1/2 w-[85%] md:w-[75%] lg:w-[55%] h-auto object-contain -translate-y-[60%]"
            style={{ transform: "translate(-50%, -50%)" }}
          />
          
          <button
            onClick={togglePopup}
            className="absolute bottom-[15%] left-1/2 transform -translate-x-1/2 
                       bg-black text-white font-bold py-3 px-8 rounded-lg 
                       shadow-lg hover:bg-gray-800 transition duration-300 
                       text-base md:text-lg tracking-wide"
          >
            Featured on BlackWilbur.com
          </button>
        </div>
      </div>
    </section>
  );

  return (
    <>
      {/* Desktop Video Section */}
      {isDesktop && renderVideoSection(true, desktopVideoRef, "py-1 bg-[#1B1B1B] relative hidden md:block")}

      {/* Mobile Video Section */}
      {!isDesktop && renderVideoSection(false, mobileVideoRef, "py-16 bg-[#1B1B1B] relative block md:hidden")}

      {/* Popup for GetFeatured */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
          <div className="relative w-full h-screen max-w-3xl flex items-center justify-center p-6 backdrop-blur-sm text-white rounded-lg shadow-lg overflow-hidden">
            <GetFeatured />
            <button
              onClick={togglePopup}
              className="absolute top-2 right-2 text-white text-3xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoSection;
