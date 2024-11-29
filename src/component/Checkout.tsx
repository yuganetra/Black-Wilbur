import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CartItemCheckout,
  CheckoutProductForbackend,
  Discount,
  NewOrder,
  ShippingAddress,
} from "../utiles/types";
import { createOrder, getDiscounts, sendSms } from "../services/api";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

interface Order {
  order_id: string;
  email: string;
  payment_method: string;
  status: string;
  phone_number: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  user: number;
  products: CheckoutProductForbackend[];
  payment_status: string; // Payment status (e.g., "paid", "pending")
  subtotal: number; // Subtotal of the order before discounts and taxes
  discount_amount: number; // Total discount applied to the order
  tax_amount: number; // Total tax applied to the order
  total_amount: number; // Final total amount for the order
}

const Checkout: React.FC = () => {
  const location = useLocation();
  const {
    products: initialProducts = [],
    couponDiscount: couponDiscountstate = 0,
    couponCode: couponCodestate = "",
  } = (location.state as {
    products: CartItemCheckout[];
    couponDiscount: number;
    couponCode: string;
  }) || {};
  const [products, setProducts] = useState<CartItemCheckout[]>(initialProducts);

  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [resendEnabled, setResendEnabled] = useState(false);
  const [otpVarified, setotpVarified] = useState(false);
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState<string>(couponCodestate);
  const [couponDiscount, setCouponDiscount] =
    useState<number>(couponDiscountstate);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [isRemovingCoupon, setIsRemovingCoupon] = useState<boolean>(false);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [totalQuantity, setTotalQuantity] = useState<number>(0); // totalQuantity state

  useEffect(() => {
    const newTotalQuantity = products.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setTotalQuantity(newTotalQuantity);
  }, [products]); // This will recalculate totalQuantity whenever products change

  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [final_discount, setFinalDiscount] = useState<number>(0);
  const [finalAmount, setFinalAmount] = useState<number>(0);

  useEffect(() => {
    if (loading) {
      setProducts(initialProducts); // Only set if it's the initial load
      setLoading(false);
    }
  }, [initialProducts, loading]);

  useEffect(() => {
    const calculatedTotalAmount = products.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

    const calculatedFinalDiscount =
      (calculatedTotalAmount * couponDiscount) / 100;
    const calculatedFinalAmount =
      calculatedTotalAmount - calculatedFinalDiscount;

    setTotalAmount(calculatedTotalAmount);
    setFinalDiscount(calculatedFinalDiscount);
    setFinalAmount(calculatedFinalAmount);
  }, [products, couponDiscount]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Order>();

  const handleGetOtp = async () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const numbers = [otpInput];

    try {
      const response = await sendSms(otp, numbers);
      if (response) {
        setOtpSent(true);
        setGeneratedOtp(otp);
        setTimeout(() => {
          setResendEnabled(true);
        }, 1000);
      } else {
        console.error("Error sending SMS:", response);
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
    }
  };

  const handleVerifyOtp = () => {
    const isValidOtp = otpInput === generatedOtp;
    if (isValidOtp) {
      alert("OTP verified successfully!");
      setotpVarified(true);
    } else {
      alert("Invalid OTP, please try again.");
    }
  };

  const generateOrderId = (): string => {
    return uuidv4();
  };

  const onSubmit = async (data: Order) => {
    // if (!otpVarified) {
    //   alert("Please verify your phone number.");
    //   return;
    // }

    const orderId = generateOrderId();
    const orderProducts: CheckoutProductForbackend[] = products.map((p) => {
      return {
        product_id: p.product.id,
        quantity: p.quantity,
        product_variation_id: p.size.id || p.product_variation_id,
      };
    });

    const shippingAddress: ShippingAddress = {
      address_line1: data.address_line_1,
      address_line2: data.address_line_2 || "",
      city: data.city,
      state: data.state,
      zipcode: data.zip_code,
      country: data.country,
      phone_number: data.phone_number,
    };

    const orderData: NewOrder = {
      products: orderProducts,
      shipping_address: shippingAddress,
      subtotal: finalAmount,
      discount_amount: final_discount,
      tax_amount: 0, // Adjust as necessary
      shipping_cost: 0, // Adjust as necessary
      total_amount: finalAmount,
      payment_method: data.payment_method,
      phone_number: data.phone_number,
      discount_coupon_applied: couponCode,
    };

    try {
      console.log("orderData", orderData);
      const response = await createOrder(orderData);

      if (response) {
        const { order_id, payment_url } = response;
        if (payment_url) {
          window.location.href = payment_url;
        } else {
          navigate(`/orderConfirmation/${orderId}`, {
            state: {
              orderId: order_id,
              paymentMethod: orderData.payment_method,
            },
          });
        }
      } else {
        alert("Failed to place order.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("An error occurred while placing the order.");
    }
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
      if (
        matchingCoupon.quantity_threshold &&
        totalQuantity >= matchingCoupon.quantity_threshold
      ) {
        setCouponDiscount(matchingCoupon.percent_discount);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } else if (!matchingCoupon.quantity_threshold) {
        setCouponDiscount(matchingCoupon.percent_discount);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        alert(
          `You need at least ${matchingCoupon.quantity_threshold} items to use this coupon.`
        );
      }
    } else {
      alert("Invalid coupon code.");
    }
  };

  const handleRemoveCoupon = () => {
    setIsRemovingCoupon(true);
    setTimeout(() => {
      setCouponCode("");
      setCouponDiscount(0);
      setShowConfetti(false);
      setIsRemovingCoupon(false);
    }, 500);
  };

  const handleUpdateQuantity = async (productId: string, change: number) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + change); // Ensure quantity is not less than 1
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

  return (
    <div className="bg-black text-white min-h-screen flex flex-col font-montserrat">
      {/* Main Content Wrapper */}
      <div className="flex-1 pb-16 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto p-6 bg-white text-black rounded-lg shadow-lg flex flex-col lg:flex-row">
          {/* Right side - Order Summary */}
          <div className="w-full lg:w-1/2 lg:pr-8 border-b lg:border-b-0 lg:border-r mb-6 lg:mt-0">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-16 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-16 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-16 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-16 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="flex justify-between border-t border-gray-300 pt-4">
                    <div className="h-6 bg-gray-300 rounded-lg w-1/3"></div>
                    <div className="h-6 bg-gray-300 rounded-lg w-1/3"></div>
                  </div>
                </div>
              ) : (
                <>
                  {Array.isArray(products) && products.length > 0 ? (
                    products.map((checkoutProduct) => {
                      const product = checkoutProduct.product || {};
                      const productImages =
                        checkoutProduct.product.image ||
                        checkoutProduct.product.product_images;
                      return (
                        <>
                          <div
                            key={checkoutProduct.id}
                            className="flex justify-between items-center mb-4 text-left"
                          >
                            <div className="flex items-center">
                              {productImages && (
                                <img
                                  src={productImages}
                                  alt={product.name || "Product Image"}
                                  className="w-16 h-16 object-contain rounded"
                                />
                              )}
                              <div className="ml-4">
                                <h4 className="text-lg ">
                                  {product.name || "Unnamed Product"}
                                </h4>
                                <h4 className="text-lg font-semibold">
                                  {typeof checkoutProduct.size === "string"
                                    ? checkoutProduct.size
                                    : checkoutProduct.size?.size ??
                                      "Default Size"}
                                </h4>
                              </div>
                            </div>
                            <p className="text-lg font-bold">
                              ₹
                              {(
                                Number(product.price) * checkoutProduct.quantity
                              ).toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(product.id, -1)
                              }
                              className="px-2 py-1 bg-gray-200 text-black rounded-lg mr-2"
                            >
                              -
                            </button>
                            <span className="text-lg">
                              {checkoutProduct.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(product.id, 1)
                              }
                              className="px-2 py-1 bg-gray-200 text-black rounded-lg ml-2"
                            >
                              +
                            </button>
                          </div>
                        </>
                      );
                    })
                  ) : (
                    <p>No products available.</p>
                  )}
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
                    {showConfetti && (
                    <Confetti
                      width={window.innerWidth}
                      height={window.innerHeight}
                    />
                  )}
                  </div>
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
                      <span>-₹{final_discount}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Final Amount</span>
                      <span>₹{finalAmount}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Left side - Billing Details */}
          <div className="w-full lg:w-1/2 lg:pl-8 border-b lg:border-b-0  border-gray-300">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Billing Details Form Here */}
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
                  <div className="w-full sm:w-1/2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register("email", { required: "Email is required" })}
                      className="mt-1 p-2 border border-gray-700 rounded-md w-full bg-gray-100 text-black"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label
                      htmlFor="contact"
                      className="block text-sm font-medium"
                    >
                      Contact
                    </label>
                    <input
                      id="contact"
                      type="text"
                      {...register("phone_number", {
                        required: "Phone is required",
                      })}
                      onChange={(e) => setOtpInput(e.target.value)} // Capture phone number for OTP
                      className="mt-1 p-2 border border-gray-700 rounded-md w-full bg-gray-100 text-black"
                    />
                    {errors.phone_number && (
                      <p className="text-red-500 text-sm">
                        {errors.phone_number.message}
                      </p>
                    )}
                    {otpVarified && (
                      <p className="text-green-500 text-sm">
                        Phone number verified!
                      </p>
                    )}

                    {!otpVarified && !otpSent && (
                      <button
                        type="button"
                        onClick={handleGetOtp}
                        className="mt-2 bg-black text-white px-4 py-2 rounded-md"
                      >
                        Get OTP
                      </button>
                    )}

                    {otpSent && !otpVarified && (
                      <>
                        <div className="mt-2">
                          <label
                            htmlFor="otp"
                            className="block text-sm font-medium"
                          >
                            Enter OTP
                          </label>
                          <input
                            id="otp"
                            type="text"
                            onChange={(e) => setOtpInput(e.target.value)} // Update OTP input
                            className="mt-1 p-2 border border-gray-700 rounded-md w-full bg-gray-100 text-black"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleVerifyOtp} // Handle OTP verification
                          className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md"
                        >
                          Verify OTP
                        </button>

                        {resendEnabled && (
                          <button
                            type="button"
                            onClick={handleGetOtp}
                            className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-md"
                          >
                            Resend OTP
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="address_line_1"
                    className="block text-sm font-medium"
                  >
                    Address 1
                  </label>
                  <input
                    id="address_line_1"
                    type="text"
                    {...register("address_line_1", {
                      required: "Address is required",
                    })}
                    className="mt-1 p-2 border border-gray-700 rounded-md w-full bg-gray-100 text-black"
                  />
                  {errors.address_line_1 && (
                    <p className="text-red-500 text-sm">
                      {errors.address_line_1.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="address_line_2"
                    className="block text-sm font-medium"
                  >
                    Address 2 (optional)
                  </label>
                  <input
                    id="apartment"
                    type="text"
                    {...register("address_line_2")}
                    className="mt-1 p-2 border border-gray-700 rounded-md w-full bg-gray-100 text-black"
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-evenly space-y-4 sm:space-y-0">
                  <div className="w-full sm:w-1/3">
                    <label htmlFor="city" className="block text-sm font-medium">
                      City
                    </label>
                    <input
                      id="state"
                      type="text"
                      {...register("city", { required: "City is required" })}
                      className="mt-1 p-2 border border-gray-700 rounded-md w-full bg-gray-100 text-black"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium"
                    >
                      Country
                    </label>
                    <input
                      id="country"
                      type="text"
                      {...register("country", {
                        required: "Pin code is required",
                      })}
                      className="mt-1 p-2 border border-gray-700 rounded-md w-full bg-gray-100 text-black"
                    />
                    {errors.country && (
                      <p className="text-red-500 text-sm">
                        {errors.country.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-evenly space-y-4 sm:space-y-0">
                  <div className="w-full sm:w-1/3">
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium"
                    >
                      State
                    </label>
                    <input
                      id="state"
                      type="text"
                      {...register("state", { required: "State is required" })}
                      className="mt-1 p-2 border border-gray-700 rounded-md w-full bg-gray-100 text-black"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label
                      htmlFor="zip_code"
                      className="block text-sm font-medium"
                    >
                      Zip Code
                    </label>
                    <input
                      id="zip_code"
                      type="text"
                      {...register("zip_code", {
                        required: "Pin code is required",
                      })}
                      className="mt-1 p-2 border border-gray-700 rounded-md w-full bg-gray-100 text-black"
                    />
                    {errors.zip_code && (
                      <p className="text-red-500 text-sm">
                        {errors.zip_code.message}
                      </p>
                    )}
                  </div>
                </div>
                {/* Payment Method Dropdown */}
                <div>
                  <label
                    htmlFor="paymentMethod"
                    className="block text-sm font-medium"
                  >
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    {...register("payment_method", {
                      required: "Payment method is required",
                    })}
                    className="mt-1 p-2 border border-gray-700 rounded-md w-full bg-gray-100 text-black"
                  >
                    <option value="">Select a payment method</option>
                    {/* <option value="UPI">UPI</option> */}
                    <option value="cash_on_delivery">Cash on Delivery</option>
                  </select>
                  {errors.payment_method && (
                    <p className="text-red-500 text-sm">
                      {errors.payment_method.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white px-4 py-2 rounded-md"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
