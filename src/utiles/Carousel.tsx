import React, { useState, useEffect, useCallback, memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import img from "../asset/collection-carousel.jpg";
import carousel1 from "../asset/chpp-carousel.jpg";

// Types
interface CarouselImage {
  src: string;
  text: string;
}

interface NavigationDotsProps {
  images: CarouselImage[];
  currentSlide: number;
  onSlideChange: (index: number, direction: 'next' | 'prev') => void;
}

interface NavigationArrowProps {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled: boolean;
}

// Constants
const SLIDE_INTERVAL = 5000;
const SWIPE_THRESHOLD = 50;
const CAROUSEL_IMAGES: CarouselImage[] = [
  { src: carousel1, text: "Unleash the\nPower of Black" },
  { src: img, text: "Explore Our\nCollection" },
];

// Memoized Sub-components
const NavigationDots = memo(({ images, currentSlide, onSlideChange }: NavigationDotsProps) => (
  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
    {images.map((_, index) => (
      <button
        key={index}
        className={`w-2 h-2 rounded-full transition-colors duration-300 
                   ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
        onClick={() => onSlideChange(index, index > currentSlide ? 'next' : 'prev')}
      />
    ))}
  </div>
));

const NavigationArrow = memo(({ direction, onClick, disabled }: NavigationArrowProps) => (
  <button
    className={`absolute ${direction === 'left' ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 
               text-white bg-black/50 rounded-full p-2 hover:bg-black transition-colors 
               duration-300 hidden md:block z-20 disabled:opacity-50`}
    onClick={onClick}
    disabled={disabled}
  >
    {direction === 'left' ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
  </button>
));

const CarouselSlide = memo(({ image, className, onTransitionEnd, isTransitioning }: {
  image: CarouselImage;
  className: string;
  onTransitionEnd: () => void;
  isTransitioning: boolean;
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`absolute inset-0 transform transition-transform duration-500 ease-in-out ${className}`}
      style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
      onTransitionEnd={onTransitionEnd}
    >
      <img
        src={image.src}
        alt="Carousel slide"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center top", willChange: 'transform' }}
      />
      <div className={`absolute bottom-4 left-4 right-4 sm:bottom-10 sm:left-10 sm:right-10 
                      text-white flex flex-col justify-between items-center md:items-start 
                      md:flex-row md:justify-between px-4 sm:px-10 transition-opacity duration-500 
                      ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <h1 className="font-montserrat text-xl sm:text-2xl md:text-3xl lg:text-7xl font-semibold 
                      uppercase leading-tight text-center md:text-left mb-4 md:mb-0">
          {image.text.split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </h1>
        <button
          onClick={() => navigate("/collection")}
          className="px-4 py-2 sm:px-6 sm:py-3 bg-black text-white rounded-full 
                    hover:bg-white hover:text-black transition-colors duration-300 lg:mt-20"
        >
          Shop Now
        </button>
      </div>
    </div>
  );
});

const Carousel = () => {
  const [state, setState] = useState({
    currentSlide: 0,
    direction: 'next' as 'next' | 'prev',  // Update this line
    isTransitioning: false,
    touchStart: 0,
    touchEnd: 0
  });
  

  const handleTransitionEnd = useCallback(() => {
    setState(prev => ({ ...prev, isTransitioning: false }));
  }, []);

  const handleSlideChange = useCallback((newIndex: number, newDirection: 'next' | 'prev') => {
    if (!state.isTransitioning) {
      setState(prev => ({
        ...prev,
        isTransitioning: true,
        direction: newDirection,
        currentSlide: newIndex
      }));
    }
  }, [state.isTransitioning]);

  const handlePrevSlide = useCallback(() => {
    const newIndex = (state.currentSlide - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length;
    handleSlideChange(newIndex, 'prev');
  }, [state.currentSlide, handleSlideChange]);

  const handleNextSlide = useCallback(() => {
    const newIndex = (state.currentSlide + 1) % CAROUSEL_IMAGES.length;
    handleSlideChange(newIndex, 'next');
  }, [state.currentSlide, handleSlideChange]);

  const handleTouch = useCallback((type: 'start' | 'move' | 'end', x?: number) => {
    setState(prev => {
      if (type === 'start' && x !== undefined) {
        return { ...prev, touchStart: x, touchEnd: x };
      } else if (type === 'move' && x !== undefined) {
        return { ...prev, touchEnd: x };
      } else if (type === 'end') {
        if (prev.touchStart > prev.touchEnd + SWIPE_THRESHOLD) {
          handleNextSlide();
        } else if (prev.touchStart < prev.touchEnd - SWIPE_THRESHOLD) {
          handlePrevSlide();
        }
        return { ...prev, touchStart: 0, touchEnd: 0 };
      }
      return prev;
    });
  }, [handleNextSlide, handlePrevSlide]);

  const getSlideClass = useCallback((index: number) => {
    if (index === state.currentSlide) return 'translate-x-0 z-10';
    
    if (state.direction === 'next') {
      return index === (state.currentSlide + 1) % CAROUSEL_IMAGES.length 
        ? 'translate-x-full z-0' 
        : '-translate-x-full z-0';
    }
    return index === (state.currentSlide - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length 
      ? '-translate-x-full z-0' 
      : 'translate-x-full z-0';
  }, [state.currentSlide, state.direction]);

  useEffect(() => {
    const timer = setInterval(handleNextSlide, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [handleNextSlide]);

  return (
    <div className="relative h-[88vh] overflow-hidden bg-black"
      onTouchStart={e => handleTouch('start', e.touches[0].clientX)}
      onTouchMove={e => handleTouch('move', e.touches[0].clientX)}
      onTouchEnd={() => handleTouch('end')}
    >
      <div className="relative h-full w-full">
        {CAROUSEL_IMAGES.map((image, index) => (
          <CarouselSlide
            key={index}
            image={image}
            className={getSlideClass(index)}
            onTransitionEnd={handleTransitionEnd}
            isTransitioning={state.isTransitioning}
          />
        ))}
      </div>

      <NavigationDots
        images={CAROUSEL_IMAGES}
        currentSlide={state.currentSlide}
        onSlideChange={handleSlideChange}
      />
      
      <NavigationArrow
        direction="left"
        onClick={handlePrevSlide}
        disabled={state.isTransitioning}
      />
      <NavigationArrow
        direction="right"
        onClick={handleNextSlide}
        disabled={state.isTransitioning}
      />
    </div>
  );
};

export default memo(Carousel);