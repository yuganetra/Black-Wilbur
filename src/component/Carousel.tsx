import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import img from "../asset/collection-carousel.jpg";
import carousel1 from "../asset/chpp-carousel.jpg";
import { useNavigate } from 'react-router-dom';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState('next');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(0);
  const navigate = useNavigate();

  const images = [
    { 
      src: carousel1,
      text: "Unleash the\nPower of Black" 
    },
    { 
      src: img,
      text: "Explore Our Collection" 
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      handleNextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
  };

  const handleSlideChange = (newIndex: number, newDirection: 'next' | 'prev') => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setDirection(newDirection);
      setCurrentSlide(newIndex);
    }
  };

  const handlePrevSlide = () => {
    const newIndex = (currentSlide - 1 + images.length) % images.length;
    handleSlideChange(newIndex, 'prev');
  };

  const handleNextSlide = () => {
    const newIndex = (currentSlide + 1) % images.length;
    handleSlideChange(newIndex, 'next');
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (startX > endX + 50) {
      handleNextSlide();
    } else if (startX < endX - 50) {
      handlePrevSlide();
    }
  };

  const getSlideClass = (index: number) => {
    if (index === currentSlide) {
      return 'translate-x-0 z-10';
    }

    if (direction === 'next') {
      return index === (currentSlide + 1) % images.length ? 'translate-x-full z-0' : '-translate-x-full z-0';
    } else {
      return index === (currentSlide - 1 + images.length) % images.length ? '-translate-x-full z-0' : 'translate-x-full z-0';
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };


  return (
    <div className="relative h-[88vh] overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div className="relative h-full w-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transform transition-transform duration-500 ease-in-out ${getSlideClass(index)}`}
            style={{
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            <img
              src={image.src}
              alt={`Carousel ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ 
                objectPosition: "center top",
                willChange: 'transform',
              }}
            />
            <div 
              className={`absolute bottom-4 left-4 right-4 sm:bottom-10 sm:left-10 sm:right-10 text-white 
                         flex flex-col justify-between items-center md:items-start md:flex-row md:justify-between 
                         px-4 sm:px-10 transition-opacity duration-500 ease-in-out
                         ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
            >
              <h1 className="font-montserrat text-xl sm:text-2xl md:text-3xl lg:text-7xl font-semibold uppercase leading-tight text-center md:text-left mb-4 md:mb-0">
                {image.text.split('\n').map((line, i) => (
                  <span key={i}>{line}<br /></span>
                ))}
              </h1>
              <button
                onClick={() => handleNavigate("/collection")}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-black text-white rounded-full 
                         hover:bg-white hover:text-black transition-colors duration-300 lg:mt-20"
              >
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 
                     ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
            onClick={() => handleSlideChange(index, index > currentSlide ? 'next' : 'prev')}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white 
                 bg-black/50 rounded-full p-2 hover:bg-black transition-colors 
                 duration-300 hidden md:block z-20"
        onClick={handlePrevSlide}
        disabled={isTransitioning}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white 
                 bg-black/50 rounded-full p-2 hover:bg-black transition-colors 
                 duration-300 hidden md:block z-20"
        onClick={handleNextSlide}
        disabled={isTransitioning}
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Carousel;
