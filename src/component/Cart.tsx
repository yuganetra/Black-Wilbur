import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCartItems,
  fetchProductById,
  getCartItemsCount,
  getDiscounts,
  isUserLoggedIn,
  removeFromCart,
  updateCartItem,
} from "../services/api";
import { Product, CartItem, Discount } from "../utiles/types";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

interface CartComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartComponent: React.FC<CartComponentProps> = ({ isOpen, onClose }) => {
  const [cartProducts, setCartProducts] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>(""); // State for the coupon code
  const [couponDiscount, setCouponDiscount] = useState<number>(0); // State for the coupon discount
  const [showConfetti, setShowConfetti] = useState<boolean>(false); // State for showing confetti
  const [isRemovingCoupon, setIsRemovingCoupon] = useState<boolean>(false); // State to track coupon removal fade
  const [discounts, setDiscounts] = useState<Discount[]>([]); // State to store discounts
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling
      document.body.style.overflow = "hidden";
    } else {
      // Allow scrolling again
      document.body.style.overflow = "unset";
    }

    // Cleanup to reset overflow when the component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (showConfetti) {
      const confettiTimer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000); // Duration in milliseconds

      return () => clearTimeout(confettiTimer); // Cleanup timeout on unmount
    }
  }, [showConfetti]);

  // Fetch all discounts when the component mounts
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

  // Handle coupon code application
  const handleCouponApply = () => {
    const matchingCoupon = discounts.find(
      (discount) =>
       discount.coupon === couponCode
    );

    if (matchingCoupon) {
      // Check if the coupon has a quantity threshold and if it is met
      if (
        matchingCoupon.quantity_threshold &&
        totalQuantity >= matchingCoupon.quantity_threshold
      ) {
        setCouponDiscount(matchingCoupon.percent_discount);
        setShowConfetti(true);
      } else if (!matchingCoupon.quantity_threshold) {
        // Apply coupon if no quantity threshold exists
        setCouponDiscount(matchingCoupon.percent_discount);
        setShowConfetti(true);
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
    const cartCount = getCartItemsCount();
    if ((await cartCount) === 0) {
      alert("Please add products to the cart before proceeding to checkout.");
    } else {
      if (isUserLoggedIn()) {
        onClose();
        navigate("/checkout", {
          state: { products: cartProducts, couponDiscount },
        });
      } else {
        onClose();
        navigate("/auth/login", {
          state: {
            from: "/checkout",
            products: cartProducts,
            couponDiscount,
          },
        }); // Pass cart and previous page
      }
    }
  };

  const loadCartItems = async () => {
    try {
      if (!isUserLoggedIn()) {
        const existingCartString = localStorage.getItem("cart");

        if (existingCartString && existingCartString !== "[]") {
          const existingCart = JSON.parse(existingCartString);

          // Ensure existingCart is an array before using .map()
          if (Array.isArray(existingCart) && existingCart.length > 0) {
            const validCart = await Promise.all(
              existingCart.map(
                async (item: {
                  product: Product | null;
                  product_id: string;
                  quantity: number;
                  product_variation_id: string;
                }) => {
                  const productId =
                    (item.product && item.product.id) || item.product_id;
                  if (!productId) {
                    return null;
                  }

                  const productDetails = await fetchProductById(productId);
                  if (productDetails) {
                    return {
                      id: productId,
                      quantity: item.quantity,
                      product: productDetails,
                      size: item.product_variation_id || "Default Size",
                    };
                  }
                  return null;
                }
              )
            );
            // Filter out null values from the result
            const filteredCart = validCart.filter(
              (item) => item !== null
            ) as unknown as CartItem[];
            setCartProducts(filteredCart);
          } else {
            setCartProducts([]);
          }
        }
        return;
      }

      const apiCartItems = await fetchCartItems();
      setCartProducts(apiCartItems);
    } catch (error) {
      console.error("Failed to load cart items", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCartItems();
      const intervalId = setInterval(loadCartItems, 50000);
      return () => clearInterval(intervalId);
    }
  }, [isOpen]);

  const handleRemove = (
    cartItemId: number,
    productId: string,
    size: string
  ) => {
    setCartProducts((prev) => {
      const updatedCart = prev.filter(
        (item) => !(item.product.id === productId && item.size.size === size)
      );
      removeFromCart(cartItemId).catch((error) => {
        console.error("Error removing item from cart:", error);
      });

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      loadCartItems();
      return updatedCart;
    });
  };

  const handleUpdateQuantity = async (cartItemId: number, change: number) => {
    setCartProducts((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const newQuantity = Math.max(1, item.quantity + change);
  
          updateCartItem(cartItemId, newQuantity).catch((error) => {
            console.error("Error updating cart item:", error);
            setCartProducts((prev) =>
              prev.map((item) =>
                item.id === cartItemId
                  ? { ...item, quantity: item.quantity }
                  : item
              )
            );
          });
  
          // Reset quantity discount whenever the quantity changes
          setCouponDiscount(0);
  
          return {
            ...item,
            quantity: newQuantity,
          };
        }
        return item;
      })
    );
  };
  
  const totalAmount = cartProducts.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const totalQuantity = cartProducts.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // // Handle coupon code application
  // const handleCouponApply = () => {
  //   if (couponCode === "DISCOUNT10") {
  //     setCouponDiscount(10); // Apply 10% discount for the coupon
  //     setShowConfetti(true); // Show confetti effect
  //   } else {
  //     alert("Invalid coupon code.");
  //   }
  // };
  const handleRemoveCoupon = () => {
    setIsRemovingCoupon(true); // Start fade-out effect
    setTimeout(() => {
      setCouponCode(""); // Clear the coupon code
      setCouponDiscount(0); // Reset the coupon discount
      setShowConfetti(false); // Remove confetti effect
      setIsRemovingCoupon(false); // End fade-out effect
    }, 500); // Match the fade-out duration
  };

  const finalAmount =
    totalAmount - (totalAmount * couponDiscount) / 100;

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
        {/* Cart Header */}
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
          <p>Your cart is empty.</p>
        ) : (
          <div className="flex-grow p-4 overflow-y-auto max-h-full">
            <ul>
              {cartProducts.map((item, index) => (
                <li
                  key={`cart-item-${item.product.id}-${item.size}-${index}`}
                  className="flex items-start justify-between border-b py-2"
                >
                  <div className="flex">
                    <img
                      src={
                        item.product.image?.length > 0
                          ? item.product.image // Optional chaining here
                          : "fallback-image-url.jpg"
                      }
                      alt={item.product.name}
                      className="w-16 h-16 object-cover mr-4"
                    />
                    <div className="text-left">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-gray-600">
                        Price: ₹
                        {(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Size: {item.size.size}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      <div className="flex items-center mt-2 gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          className="border rounded px-2 py-1 bg-gray-200"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="border rounded px-2 py-1 bg-gray-200"
                        >
                          +
                        </button>
                        <button
                          onClick={() =>
                            handleRemove(
                              item.id,
                              item.product.id,
                              item.size.size
                            )
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

        <div className="p-4 border-t">
          <div className="flex justify-between">
            <span>Total Quantity</span>
            <span>{totalQuantity}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Amount</span>
            <span>₹{totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span>Coupon Discount ({couponDiscount}%)</span>
            <span>-₹{(totalAmount * couponDiscount) / 100}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Final Amount</span>
            <span>₹{finalAmount}</span>
          </div>

          {/* Coupon Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isRemovingCoupon ? 0 : 1 }}
            transition={{ duration: 0.5 }} // Fade-out transition
            className="mt-4"
          >
            <div className="relative">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="p-2 border rounded w-full pr-10"
              />
              {couponCode && (
                <button
                  onClick={handleRemoveCoupon}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500"
                >
                  &times;
                </button>
              )}
            </div>
            <button
              onClick={handleCouponApply}
              className="w-full mt-4 bg-black text-white py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Apply Coupon
            </button>
          </motion.div>
          <button
            className="w-full mt-4 bg-black text-white py-2 rounded hover:bg-gray-600 transition-colors"
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
