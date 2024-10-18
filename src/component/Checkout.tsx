import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { Product } from "../utiles/types";
import { sendSms } from "../services/api"; // Import your sendSms function from the API file

interface CheckoutProduct {
  id: number;
  quantity: number;
  product: Product;
  size: string;
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string; // Phone field for contact
  shippingMethod?: string;
  paymentMethod: string;
  saveInfo?: boolean;
  emailOffers?: boolean;
  products: CheckoutProduct[]; // Include product data in the form values
}

const Checkout: React.FC = () => {
  const location = useLocation();
  const { products: initialProducts = [] } =
    (location.state as { products: CheckoutProduct[] }) || {};
  const [products, setProducts] = useState<CheckoutProduct[]>(initialProducts);

  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(""); 
  const [resendEnabled, setResendEnabled] = useState(false); 
  const [otpVarified, setotpVarified] = useState(false); 

  useEffect(() => {
    // Simulating data fetch with a timeout
    const fetchProducts = () => {
      setTimeout(() => {
        setProducts(initialProducts);
        setLoading(false);
      }, 1000); // Simulate a 1-second loading time
    };
    fetchProducts();
  }, [initialProducts]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent) {
      // Start a timer for 2 minutes
      timer = setTimeout(() => {
        setResendEnabled(true);
      }, 1000); // 120000 ms = 2 minutes
    }
    return () => clearTimeout(timer);
  }, [otpSent]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const handleGetOtp = async () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
    const numbers = [otpInput]; 

    try {
      const response = await sendSms(otp, numbers); 
      if (response) {
        console.log("SMS sent successfully:", response.message);
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

  const onSubmit = async (data: FormValues) => {
    console.log("Submitted data:", data);
    console.log("Products from params:", products); // Log the product data
    console.log("Entered OTP:", otpInput); // Log the entered OTP

    // You might want to add OTP verification logic here

    // Final form submission logic here...
  };

  const subtotal = products.reduce((total, product) => {
    const price = Number(product.product.price);
    return total + (isNaN(price) ? 0 : price);
  }, 0);

  return (
    <div className="bg-black text-white min-h-screen flex flex-col font-montserrat">
      {/* Main Content Wrapper */}
      <div className="flex-1 pb-16 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto p-6 bg-white text-black rounded-lg shadow-lg flex flex-col lg:flex-row">
          {/* Left side - Billing Details */}
          <div className="w-full lg:w-1/2 lg:pr-8 border-b lg:border-b-0 lg:border-r border-gray-300">
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
                    <div className="mt-2 flex items-center">
                      <input
                        id="emailOffers"
                        type="checkbox"
                        {...register("emailOffers")}
                        className="mr-2"
                      />
                      <label htmlFor="emailOffers" className="text-sm">
                        Email me with news and offers
                      </label>
                    </div>
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
                      {...register("phone", { required: "Phone is required" })}
                      onChange={(e) => setOtpInput(e.target.value)} // Capture phone number for OTP
                      className="mt-1 p-2 border border-gray-700 rounded-md w-full bg-gray-100 text-black"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm">
                        {errors.phone.message}
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
                    htmlFor="address"
                    className="block text-sm font-medium"
                  >
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    {...register("address", {
                      required: "Address is required",
                    })}
                    className="mt-1 p-2 border border-gray-700 rounded-md w-full bg-gray-100 text-black"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm">
                      {errors.address.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="apartment"
                    className="block text-sm font-medium"
                  >
                    Apartment, suite, etc. (optional)
                  </label>
                  <input
                    id="apartment"
                    type="text"
                    {...register("apartment")}
                    className="mt-1 p-2 border border-gray-700 rounded-md w-full bg-gray-100 text-black"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium">
                    City
                  </label>
                  <input
                    id="city"
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
                <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
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
                      htmlFor="pinCode"
                      className="block text-sm font-medium"
                    >
                      Zip Code
                    </label>
                    <input
                      id="pinCode"
                      type="text"
                      {...register("pinCode", {
                        required: "Pin code is required",
                      })}
                      className="mt-1 p-2 border border-gray-700 rounded-md w-full bg-gray-100 text-black"
                    />
                    {errors.pinCode && (
                      <p className="text-red-500 text-sm">
                        {errors.pinCode.message}
                      </p>
                    )}
                  </div>
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

          {/* Right side - Order Summary */}
          <div className="w-full lg:w-1/2 lg:pl-8 mt-6 lg:mt-0">
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
                    products.map((checkoutProduct) => (
                      <div
                        key={checkoutProduct.id}
                        className="flex justify-between items-center mb-4"
                      >
                        <div className="flex items-center">
                          <img
                            src={
                              checkoutProduct.product.product_images?.[0]
                                ?.image || "/placeholder.png"
                            }
                            alt={checkoutProduct.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="ml-4">
                            <h4 className="text-lg font-semibold">
                              {checkoutProduct.product.name}
                            </h4>
                            <h4 className="text-lg font-semibold">
                              {checkoutProduct.size}
                            </h4>
                          </div>
                        </div>
                        <p className="text-lg font-bold">
                          $
                          {(Number(checkoutProduct.product.price) || 0).toFixed(
                            2
                          )}
                        </p>
                    </div>
                    ))
                  ) : (
                    <p>No products available.</p>
                  )}
                  <div className="flex justify-between border-t border-gray-300 pt-4">
                    <h4 className="text-lg font-semibold">Subtotal</h4>
                    <p className="text-lg font-semibold">
                      ${subtotal.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between border-t border-gray-300 pt-4">
                    <h4 className="text-lg font-semibold">Shipping</h4>
                    <p className="text-lg font-semibold">Free</p>
                  </div>
                  <div className="flex justify-between border-t border-gray-300 pt-4">
                    <h4 className="text-lg font-semibold">Total</h4>
                    <p className="text-lg font-semibold">
                      ${subtotal.toFixed(2)}
                    </p>
              </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
