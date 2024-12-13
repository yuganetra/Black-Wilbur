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
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="relative mt-10 w-full h-[90vh] overflow-hidden">
          <video
            ref={videoRef}
            src={videoSrc}
            loop
            muted
            playsInline
            className="absolute top-1/2 left-1/2 w-full h-full object-contain"
            style={{ transform: "translate(-50%, -50%)" }}
          />
          <button
            onClick={togglePopup}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:bg-gray-800 transition text-lg"
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
      {isDesktop && renderVideoSection(true, desktopVideoRef, "py-16 bg-[#1B1B1B] relative hidden md:block")}

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
