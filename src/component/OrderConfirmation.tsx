import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

// Define the interface for props
interface OrderConfirmationProps {
  paymentMethod: string;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ paymentMethod }) => {
  const { orderId } = useParams(); // Get orderId from URL params
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/"); // Adjust this as needed
    }, 6000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      <Confetti numberOfPieces={100} recycle={false} gravity={0.3} />
      <motion.div
        className="text-center p-6 sm:p-8 md:p-10 lg:p-12 rounded-lg shadow-lg max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          🎉 Order Confirmed! 🎉
        </h2>
        <p className="text-base sm:text-lg lg:text-xl mb-4">
          Thank you for your order, <strong>{orderId}</strong>!
        </p>
        <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-4">
          {paymentMethod === "UPI"
            ? "Your payment was successful. We are processing your order!"
            : "We’ll collect payment on delivery. Get ready for your package!"}
        </p>
        <div className="text-sm sm:text-base lg:text-lg font-semibold mt-6">
          Redirecting you shortly...
        </div>
      </motion.div>
    </div>
  );
};

export default OrderConfirmation;
