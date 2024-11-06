import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

const OffersBanner: React.FC = () => {
  const [showConfetti, setShowConfetti] = useState(false);

  // Function to toggle confetti
  const handleOfferClick = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000); // Hide confetti after 3 seconds
  };

  return (
    <div className="relative">
      {showConfetti && <Confetti />}

      {/* Banner with increased height (thickness) on small screens */}
      <div className="bg-black text-white py-2 sm:py-6 w-full overflow-hidden">
        <motion.div
          className="whitespace-nowrap text-lg font-semibold cursor-pointer"
          animate={{
            x: ['100%', '-100%'], // Start from the right, end on the left
          }}
          transition={{
            x: {
              repeat: Infinity, // Infinite loop
              repeatType: 'loop',
              duration: 10, // Adjust speed here
              ease: 'linear',
            },
          }}
          onClick={handleOfferClick}
        >
          <span className="mr-8">🎉 Black Wilbur Launches New Designs - Shop Now! 🎉</span>
          {/* Offer 1 */}
          <span className="mr-8 text-xs sm:text-base">🎉 Buy 2 products, get 15% off! 🎉</span>
          
          <span className="mr-8">🛍️ Limited Edition Items - Get Yours Now! 🛍️</span>
          {/* Offer 2 */}
          <span className="mr-8 text-xs sm:text-base">🔥 Buy 3 or more products, get 30% off! 🔥</span>
        </motion.div>
      </div>
    </div>
  );
};

export default OffersBanner;
