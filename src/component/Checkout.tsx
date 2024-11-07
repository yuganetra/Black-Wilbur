import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { CartItemCheckout } from "../utiles/types";
import { createOrder, sendSms } from "../services/api";
import { v4 as uuidv4 } from "uuid";
interface CheckoutProductForbackend {
  id: number;
  quantity: number;
  product_id: string;
  product_variation_id: string;
}

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
}

const Checkout: React.FC = () => {
  const location = useLocation();
  const {
    products: initialProducts = [],
    couponDiscount = 0,
    quantityDiscount = 0,
  } = (location.state as {
    products: CartItemCheckout[];
    couponDiscount: number;
    quantityDiscount: number;
  }) || {};
  const [products, setProducts] = useState<CartItemCheckout[]>(initialProducts);

  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [resendEnabled, setResendEnabled] = useState(false);
  const [otpVarified, setotpVarified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating data fetch with a timeout
    const fetchProducts = () => {
      setTimeout(() => {
        setProducts(initialProducts);
        console.log("products", products);
        console.log("initialProducts", initialProducts);
        setLoading(false);
      }, 1000);
    };
    fetchProducts();
  }, [initialProducts, products]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent) {
      // Start a timer for 2 minutes
      timer = setTimeout(() => {
        setResendEnabled(true);
      }, 120000); // 120000 ms = 2 minutes
    }
    return () => clearTimeout(timer);
  }, [initialProducts, otpSent]);

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

  const totalQuantity = products.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const onSubmit = async (data: Order) => {
    if (!otpVarified) {
      alert("Please verify your phone number.");
      return;
    }

    const orderId = generateOrderId();
    const user = localStorage.getItem("user");
    let userId: number | undefined;

    if (user) {
      const parsedUser = JSON.parse(user);
      userId = parsedUser.id;
    }

    // Transform products from frontend type to backend type
    const orderProducts: CheckoutProductForbackend[] = products.map((p) => {
      console.log("Product Variation ID:", p.size.id);

      return {
        id: p.id,
        quantity: p.quantity,
        product_id: p.product.id,
        product_variation_id: p.size.id || p.product_variation_id,
      };
    });

    // Log orderProducts to verify structure and data
    console.log("Order Products:", orderProducts);

    const orderData: Order = {
      order_id: orderId,
      status: "pending",
      phone_number: data.phone_number,
      address_line_1: data.address_line_1,
      address_line_2: data.address_line_2 || "",
      city: data.city,
      state: data.state,
      zip_code: data.zip_code,
      country: data.country,
      email: data.email,
      products: orderProducts,
      payment_method: data.payment_method,
      user: userId || 0,
    };

    try {
      console.log("orderData", orderData);
      const response = await createOrder(orderData);
      if (response) {
        navigate("/orderConfirmation", {
          state: { orderId, paymentMethod: data.payment_method },
        });
      } else {
        alert("Failed to place order.");
        navigate("/orderFailure");
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const totalAmount = products.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const finalAmount =
    totalAmount -
    (totalAmount * quantityDiscount) / 100 -
    (totalAmount * couponDiscount) / 100;

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
                        <div
                          key={checkoutProduct.id}
                          className="flex justify-between items-center mb-4"
                        >
                          <div className="flex items-center">
                            {productImages && (
                              <img
                                src={productImages}
                                alt={product.name || "Product Image"}
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                            <div className="ml-4">
                              <h4 className="text-lg font-semibold">
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
                            ${(Number(product.price) || 0).toFixed(2)}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p>No products available.</p>
                  )}

                  <div className="p-4 border-t">
                    <div className="flex justify-between">
                      <span>Total Quantity</span>
                      <span>{totalQuantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Amount</span>
                      <span>${totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity Discount ({quantityDiscount}%)</span>
                      <span>-${(totalAmount * quantityDiscount) / 100}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Coupon Discount ({couponDiscount}%)</span>
                      <span>-${(totalAmount * couponDiscount) / 100}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Final Amount</span>
                      <span>${finalAmount}</span>
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
                    <option value="UPI">UPI</option>
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
