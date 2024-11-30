import React from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { Minus, Plus, X } from "lucide-react"; // Import the necessary icons

// Define a more specific interface for product
interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  product_images?: string;
}

interface CheckoutProduct {
  id: string;
  product: Product;
  quantity: number;
  size: string | { size: string };
}

interface OrderSummaryProps {
  loading: boolean;
  products: CheckoutProduct[];
  handleUpdateQuantity: (id: string, quantity: number) => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  handleRemoveCoupon: () => void;
  handleCouponApply: () => void;
  isRemovingCoupon: boolean;
  showConfetti: boolean;
  totalQuantity: number;
  totalAmount: number;
  couponDiscount: number;
  final_discount: number;
  finalAmount: number;
}

const ProductLoadingSkeleton: React.FC = () => (
  <div className="animate-pulse">
    {[1, 2, 3, 4].map((item) => (
      <div key={item} className="h-16 bg-gray-300 rounded-lg mb-4"></div>
    ))}
    <div className="flex justify-between border-t border-gray-300 pt-4">
      <div className="h-6 bg-gray-300 rounded-lg w-1/3"></div>
      <div className="h-6 bg-gray-300 rounded-lg w-1/3"></div>
    </div>
  </div>
);

const ProductItem: React.FC<{
  product: CheckoutProduct;
  handleUpdateQuantity: (id: string, quantity: number) => void;
}> = ({ product, handleUpdateQuantity }) => {
  const { product: productDetails, quantity, size } = product;
  const productImage = productDetails.image || productDetails.product_images;
  const productSize =
    typeof size === "string" ? size : size?.size ?? "Default Size";

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center text-left">
        <div className="flex items-center">
          {productImage && (
            <img
              src={productImage}
              alt={productDetails.name || "Product Image"}
              className="w-16 h-16 object-contain rounded"
            />
          )}
          <div className="ml-4">
            <h4 className="text-lg">
              {productDetails.name || "Unnamed Product"}
            </h4>
            <h4 className="text-lg">{productSize}</h4>
          </div>
        </div>
        <p className="text-lg">
          ₹{(Number(productDetails.price) * quantity).toFixed(2)}
        </p>
      </div>
      <div className="flex items-center mt-2">
        <QuantityControl
          productId={productDetails.id}
          quantity={quantity}
          handleUpdateQuantity={handleUpdateQuantity}
        />
      </div>
    </div>
  );
};

const QuantityControl: React.FC<{
  productId: string;
  quantity: number;
  handleUpdateQuantity: (id: string, quantity: number) => void;
}> = ({ productId, quantity, handleUpdateQuantity }) => (
  <>
    <button
      onClick={() => handleUpdateQuantity(productId, -1)}
      className="px-3 py-1 bg-gray-200 text-black rounded-lg mr-2"
    >
      <Minus size={16} /> {/* Use the Minus icon */}
    </button>
    <span className="text-lg mx-2">{quantity}</span>
    <button
      onClick={() => handleUpdateQuantity(productId, 1)}
      className="px-3 py-1 bg-gray-200 text-black rounded-lg ml-2"
    >
      <Plus size={16} /> {/* Use the Plus icon */}
    </button>
  </>
);

const CouponSection: React.FC<{
  couponCode: string;
  setCouponCode: (code: string) => void;
  handleRemoveCoupon: () => void;
  handleCouponApply: () => void;
  isRemovingCoupon: boolean;
  showConfetti: boolean;
}> = ({
  couponCode,
  setCouponCode,
  handleRemoveCoupon,
  handleCouponApply,
  isRemovingCoupon,
  showConfetti,
}) => (
  <div className="mt-6">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isRemovingCoupon ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      className="mt-2"
    >
      <div className="relative">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code"
          className="p-2 border rounded w-full pr-10 text-sm"
        />
        {couponCode && (
          <button
            onClick={handleRemoveCoupon}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 text-sm"
          >
            <X size={16} /> {/* Use the X icon for removing coupon */}
          </button>
        )}
      </div>
      <button
        onClick={handleCouponApply}
        className="w-full mt-2 bg-black text-white py-2 rounded hover:bg-gray-600 transition-colors text-sm"
      >
        Apply Coupon
      </button>
    </motion.div>
    {showConfetti && (
      <Confetti width={window.innerWidth} height={window.innerHeight} />
    )}
  </div>
);

const OrderSummary: React.FC<OrderSummaryProps> = ({
  loading,
  products,
  handleUpdateQuantity,
  couponCode,
  setCouponCode,
  handleRemoveCoupon,
  handleCouponApply,
  isRemovingCoupon,
  showConfetti,
  totalQuantity,
  totalAmount,
  couponDiscount,
  final_discount,
  finalAmount,
}) => {
  return (
    <div className="container mx-auto p-4 max-w-xl bg-white rounded-xl shadow-sm">
    <h2 className="text-xl font-semibold text-gray-700 mb-4">Order Summary</h2>

      <div className="bg-gray-100 p-4 rounded-lg">
        {loading ? (
          <ProductLoadingSkeleton />
        ) : (
          <>
            {products.length > 0 ? (
              products.map((checkoutProduct) => (
                <ProductItem
                  key={checkoutProduct.id}
                  product={checkoutProduct}
                  handleUpdateQuantity={handleUpdateQuantity}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">
                No products in your cart
              </p>
            )}

            {/* Add the line and text above the coupon section */}
            <div className="mt-4 border-t pt-2">
              <p className="text-lg font-medium text-gray-700">
                Have a coupon code?
              </p>
            </div>
            <CouponSection
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              handleRemoveCoupon={handleRemoveCoupon}
              handleCouponApply={handleCouponApply}
              isRemovingCoupon={isRemovingCoupon}
              showConfetti={showConfetti}
            />

            <div className="p-4 border-t mt-4">
              <OrderSummaryDetails
                totalQuantity={totalQuantity}
                totalAmount={totalAmount}
                couponDiscount={couponDiscount}
                final_discount={final_discount}
                finalAmount={finalAmount}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const OrderSummaryDetails: React.FC<{
  totalQuantity: number;
  totalAmount: number;
  couponDiscount: number;
  final_discount: number;
  finalAmount: number;
}> = ({
  totalQuantity,
  totalAmount,
  couponDiscount,
  final_discount,
  finalAmount,
}) => (
  <>
    <div className="flex justify-between mb-2">
      <span className="text-gray-600">Total Quantity</span>
      <span className="font-medium">{totalQuantity}</span>
    </div>
    <div className="flex justify-between mb-2">
      <span className="text-gray-600">Total Amount</span>
      <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
    </div>
    <div className="flex justify-between mb-2">
      <span className="text-gray-600">Coupon Discount ({couponDiscount}%)</span>
      <span className="text-green-600 font-medium">
        -₹{final_discount.toFixed(2)}
      </span>
    </div>
    <div className="flex justify-between text-lg border-t pt-2">
      <span>Final Amount</span>
      <span>₹{finalAmount.toFixed(2)}</span>
    </div>
  </>
);

export default OrderSummary;
