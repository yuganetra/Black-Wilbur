import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

const OffersBanner: React.FC = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Function to toggle confetti
  const handleOfferClick = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000); // Hide confetti after 3 seconds
  };

  // Adjust screen width
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Dynamically adjust animation speed and duration based on screen size
  const duration = screenWidth < 640 ? 15 : 20; // Further extend duration on smaller screens
  const speed = screenWidth < 640 ? 5 : 8;   // Adjust speed for smoother scrolling on small screens

  return (
    <div className="relative">
      {showConfetti && <Confetti />}

      {/* Banner with responsive padding */}
      <div className="bg-black text-white py-4 sm:py-8 w-full overflow-hidden">
        <motion.div
          className="whitespace-nowrap text-lg sm:text-xl font-semibold cursor-pointer"
          style={{ minWidth: '400%' }} // Increased space for smooth animation
          animate={{
            x: ['100%', '-100%'], // Start from the right, end on the left
          }}
          transition={{
            x: {
              repeat: Infinity, // Infinite loop
              repeatType: 'loop',
              duration: duration, // Dynamically adjust duration based on screen size
              ease: 'linear',
            },
          }}
          onClick={handleOfferClick}
        >
          {/* Offers */}
          <span className="mr-8">Black Wilbur Launches New Designs - Shop Now!</span>
          <span className="mr-8">Buy 2 products, get 15% off!</span>
          <span className="mr-8">Limited Edition Items - Get Yours Now!</span>
          <span className="mr-8">Buy 3 or more products, get 30% off!</span>
        </motion.div>
      </div>
    </div>
  );
};

export default OffersBanner;
