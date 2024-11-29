import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Discount } from "../utiles/types";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import {
  getDiscounts,
  isUserLoggedIn,
  updateCartItem,
  fetchCartItems,
  removeFromCart,
} from "../services/api";

type CartItemCheckout = {
  id: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    product_images: string;
  };
  quantity: number;
  size: string;
  product_variation_id: string;
  selectedSize: string; // Add this explicitly
};

interface CartComponentProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItemCheckout[];
}

const CartComponent: React.FC<CartComponentProps> = ({
  isOpen,
  onClose,
  cartItems,
}) => {
  const [cartProducts, setCartProducts] =
    useState<CartItemCheckout[]>(cartItems);
  const [couponCode, setCouponCode] = useState<string>("");
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [isRemovingCoupon, setIsRemovingCoupon] = useState<boolean>(false);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const navigate = useNavigate();

  // Fetch cart items periodically (every 5 minutes)
  useEffect(() => {
    const fetchCartData = async () => {
      if (isUserLoggedIn()) {
        try {
          const cartData = await fetchCartItems(); // API call to get cart items
          const mappedCart = mapApiResponseToCart(cartData);
          setCartProducts(mappedCart);
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      } else {
        // If the user is not logged in, fetch cart from localStorage
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          setCartProducts(parsedCart);
        } else {
          setCartProducts([]); // In case there's no cart data in localStorage
        }
      }
    };

    // Initial fetch
    fetchCartData();

    // Set interval to fetch cart every 5 minutes (300000ms)
    const interval = setInterval(fetchCartData, 150000);

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [cartItems]);

  const mapApiResponseToCart = (apiResponse: any[]): CartItemCheckout[] => {
    return apiResponse.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        description: item.product.description,
        price: parseFloat(item.product.price),
        product_images: item.product.image,
      },
      size: item.size.size,
      product_variation_id: item.size.id,
      selectedSize: item.size.size, // Ensure selectedSize is set here
    }));
  };

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const discountData = await getDiscounts({});
        setDiscounts(discountData);
      } catch (error) {
        console.error("Failed to fetch discounts", error);
      }
    };
    fetchDiscounts();
  }, []);

  const handleCouponApply = () => {
    const matchingCoupon = discounts.find(
      (discount) => discount.coupon === couponCode
    );
  
    if (matchingCoupon) {
      const totalQuantity = cartProducts.reduce(
        (total, item) => total + item.quantity,
        0
      );
  
      if (
        matchingCoupon.quantity_threshold &&
        totalQuantity >= matchingCoupon.quantity_threshold
      ) {
        setCouponDiscount(matchingCoupon.percent_discount);
        setShowConfetti(true);
  
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000); 
      } else if (!matchingCoupon.quantity_threshold) {
        setCouponDiscount(matchingCoupon.percent_discount);
        setShowConfetti(true);
  
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);
      } else {
        alert(
          `You need at least ${matchingCoupon.quantity_threshold} items to use this coupon.`
        );
      }
    } else {
      alert("Invalid coupon code.");
    }
  };
  
  const handleCheckoutNavigate = async () => {
    if (cartProducts.length === 0) {
      alert("Please add products to the cart before proceeding to checkout.");
    } else {
      if (isUserLoggedIn()) {
        onClose();
        console.log(cartProducts);
        navigate("/checkout", {
          state: { products: cartProducts, couponDiscount ,couponCode},
        });
      } else {
        onClose();
        navigate("/auth/login", {
          state: {
            from: "/checkout",
            products: cartProducts,
            couponDiscount,
          },
        });
      }
    }
  };

  const handleRemove = (
    productId: string,
    selectedSize: string | undefined,
    cartItemId?: string // Optional parameter for the second case
  ) => {
    setCartProducts((prev) => {
      // Filtering the cart based on either the first or second method of removal
      const updatedCart = prev.filter(
        (item) => !(item.id === productId && item.selectedSize === selectedSize)
      );

      // Update local storage with filtered cart
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      if (cartItemId && selectedSize) {
        removeFromCart(cartItemId).catch((error) => {
          console.error("Error removing item from cart:", error);
        });
      }
      return updatedCart;
    });
  };

  const handleUpdateQuantity = async (
    productId: string,
    selectedSize: string | undefined,
    change: number
  ) => {
    setCartProducts((prev) =>
      prev.map((item) => {
        if (item.id === productId && item.selectedSize === selectedSize) {
          const newQuantity = Math.max(1, item.quantity + change);

          // If the user is logged in, update the cart item in the API
          if (isUserLoggedIn()) {
            updateCartItem(item.id, newQuantity).catch((error) => {
              console.error("Error updating cart item:", error);
            });
          } else {
            // If the user is not logged in, update the cart quantity in localStorage
            const updatedCart = JSON.parse(
              localStorage.getItem("cart") || "[]"
            );
            const updatedCartItems = updatedCart.map((cartItem: any) => {
              if (
                cartItem.id === productId &&
                cartItem.selectedSize === selectedSize
              ) {
                return { ...cartItem, quantity: newQuantity };
              }
              return cartItem;
            });
            localStorage.setItem("cart", JSON.stringify(updatedCartItems));
          }

          return {
            ...item,
            quantity: newQuantity,
          };
        }
        return item;
      })
    );

    // Reset coupon when quantities change
    setCouponDiscount(0);
  };

  const totalAmount = cartProducts.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const totalQuantity = cartProducts.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleRemoveCoupon = () => {
    setIsRemovingCoupon(true);
    setTimeout(() => {
      setCouponCode("");
      setCouponDiscount(0);
      setShowConfetti(false);
      setIsRemovingCoupon(false);
    }, 500);
  };

  const finalAmount = totalAmount - (totalAmount * couponDiscount) / 100;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[60]"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 w-80 bg-white shadow-lg transition-transform transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } h-full z-[70] flex flex-col`}
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black text-2xl"
          >
            &times;
          </button>
        </div>
        <hr className="my-2 border-gray-300" />

        {cartProducts.length === 0 ? (
          <p className="p-4">Your cart is empty.</p>
        ) : (
          <div className="flex-grow p-4 overflow-y-auto max-h-full">
            <ul>
              {cartProducts.map((item, index) => (
                <li
                  key={`${item.id}-${item.selectedSize}-${index}`}
                  className="flex items-start justify-between border-b py-2"
                >
                  <div className="flex">
                    <img
                      src={
                        item.product.product_images || "fallback-image-url.jpg"
                      }
                      alt={item.product.name}
                      className="w-20 h-20 object-contain mr-4" // Fixed width and height for image
                    />
                    <div className="text-left">
                      <h3 className="font-medium text-sm">
                        {item.product.name}
                      </h3>{" "}
                      {/* Smaller font size for name */}
                      <p className="text-gray-600">
                        Price: ₹
                        {(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Size: {item.selectedSize}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      <div className="flex items-center mt-2 gap-2">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.selectedSize, -1)
                          }
                          className="border rounded px-2 py-1 bg-gray-200"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.selectedSize, 1)
                          }
                          className="border rounded px-2 py-1 bg-gray-200"
                        >
                          +
                        </button>
                        <button
                          onClick={() =>
                            handleRemove(item.id, item.selectedSize, item.id)
                          }
                          className="text-red-500 hover:underline ml-4"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-2 border-t mt-auto">
          <div className="flex justify-between text-sm">
            <span>Total Quantity</span>
            <span>{totalQuantity}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total Amount</span>
            <span>₹{totalAmount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Coupon Discount ({couponDiscount}%)</span>
            <span>-₹{(totalAmount * couponDiscount) / 100}</span>
          </div>
          <div className="flex justify-between font-semibold text-sm">
            <span>Final Amount</span>
            <span>₹{finalAmount}</span>
          </div>

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
                className="p-1.5 border rounded w-full pr-10 text-sm"
              />
              {couponCode && (
                <button
                  onClick={handleRemoveCoupon}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 text-sm"
                >
                  &times;
                </button>
              )}
            </div>
            <button
              onClick={handleCouponApply}
              className="w-full mt-2 bg-black text-white py-1.5 rounded hover:bg-gray-600 transition-colors text-sm"
            >
              Apply Coupon
            </button>
          </motion.div>
          <button
            className="w-full mt-2 bg-black text-white py-1.5 rounded hover:bg-gray-600 transition-colors text-sm"
            onClick={handleCheckoutNavigate}
          >
            Checkout
          </button>
          {showConfetti && (
            <Confetti width={window.innerWidth} height={window.innerHeight} />
          )}
        </div>
      </div>
    </>
  );
};

export default CartComponent;
