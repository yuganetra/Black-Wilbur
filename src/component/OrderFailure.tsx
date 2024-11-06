import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const OrderFailure: React.FC = () => {
  const navigate = useNavigate();

  // Redirect to the homepage or retry page after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/"); // Adjust the path as needed
    }, 6000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      <motion.div
        className="text-center p-6 sm:p-8 md:p-10 lg:p-12 rounded-lg shadow-lg max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          ❌ Order Failed
        </h2>
        <p className="text-base sm:text-lg lg:text-xl mb-4">
          Unfortunately, your order couldn’t be processed at this time.
        </p>
        <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-4">
          Please try again, or contact support if the issue persists.
        </p>
        <button
          onClick={() => navigate("/retry-order")}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Try Again
        </button>
        <div className="text-sm sm:text-base lg:text-lg font-semibold mt-6">
          Redirecting you shortly...
        </div>
      </motion.div>
    </div>
  );
};

export default OrderFailure;
