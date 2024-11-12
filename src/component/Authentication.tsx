import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  registerUser,
  loginUser,
  fetchCartItems,
  sendSms,
} from "../services/api";
import { AuthUser } from "../utiles/types";

const Authentication: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/auth/login";

  // State declarations remain the same
  const [forgotPassword, setForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [resendEnabled, setResendEnabled] = useState(false);
  const [otpVarified, setotpVarified] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    password2: "",
  });
  const [errors, setErrors] = useState({} as Record<string, string>);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // All handler functions remain the same
  const handleGetOtp = async () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const numbers = [formData.phoneNumber];
    try {
      const response = await sendSms(otp, numbers);
      if (response) {
        setOtpSent(true);
        setGeneratedOtp(otp);
        setTimeout(() => setResendEnabled(true), 1000);
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
    }
  };

  const handleVerifyOtp = () => {
    if (otpInput === generatedOtp) {
      setotpVarified(true);
    } else {
      alert("Invalid OTP, please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    if (!otpVarified) {
      alert("Please verify your phone number.");
      return;
    }
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");

    const newErrors = {
      firstName: formData.firstName ? "" : "First Name is required",
      lastName: formData.lastName ? "" : "Last Name is required",
      email: formData.email ? "" : "Email is required",
      phoneNumber: formData.phoneNumber ? "" : "PhoneNumber is required",
      password: formData.password ? "" : "Password is required",
      password2:
        formData.password2 === formData.password ? "" : "Passwords must match",
    };

    setErrors(newErrors);
    if (!Object.values(newErrors).some((error) => error)) {
      setLoading(true);
      try {
        const userData: AuthUser = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phoneNumber,
          email: formData.email,
          password: formData.password,
          password2: formData.password2,
        };
        const response = await registerUser(userData);
        localStorage.setItem("user", JSON.stringify(response));
        setSuccessMessage("Account created successfully! Please log in.");
        navigate("/auth/login");
      } catch (error) {
        setApiError(
          error instanceof Error ? error.message : "An unknown error occurred."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("user", JSON.stringify(response));
      const cartItems = fetchCartItems();
      localStorage.setItem("cart", JSON.stringify(cartItems));

      const previousState = location.state?.from || "/user-profile";
      navigate(previousState, {
        state: { products: location.state?.products || [] },
      });
    } catch (error) {
      setApiError("Invalid credentials. Please check your email and password.");
    }
  };

  const inputClasses =
    "w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition duration-200 text-gray-900 text-base";
  const buttonClasses =
    "w-full py-3 px-4 rounded-lg bg-black text-white hover:bg-gray-800 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed";
  const linkClasses =
    "text-sm text-gray-600 hover:text-black transition duration-200";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-600">
            {isLogin
              ? "Please sign in to continue"
              : "Fill in your details to get started"}
          </p>
        </div>

        {/* Status Messages */}
        {(apiError || successMessage) && (
          <div
            className={`p-4 rounded-lg ${
              apiError ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
            }`}
          >
            {apiError || successMessage}
          </div>
        )}

        {/* Forms */}
        {isLogin ? (
          forgotPassword ? (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <div>
                <input
                  type="email"
                  id="email"
                  className={inputClasses}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className={buttonClasses}>
                Reset Password
              </button>
              <button
                type="button"
                onClick={() => setForgotPassword(false)}
                className={`${linkClasses} block mx-auto`}
              >
                Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <input
                  type="email"
                  id="email"
                  className={inputClasses}
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <input
                  type="password"
                  id="password"
                  className={inputClasses}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <button
                type="submit"
                className={buttonClasses}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setForgotPassword(true)}
                  className={linkClasses}
                >
                  Forgot password?
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/auth/signup")}
                  className={linkClasses}
                >
                  Create account
                </button>
              </div>
            </form>
          )
        ) : (
          <form onSubmit={handleSignupSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  id="firstName"
                  className={inputClasses}
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  id="lastName"
                  className={inputClasses}
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <input
                type="email"
                id="email"
                className={inputClasses}
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-4">
                <input
                  type="tel"
                  id="phoneNumber"
                  className={inputClasses}
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
                {/* {!otpSent && !otpVarified && (
                  <button
                    type="button"
                    onClick={handleGetOtp}
                    className="whitespace-nowrap px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition duration-200"
                  >
                    Get OTP
                  </button>
                )} */}
              </div>
              {/* {otpSent && !otpVarified && (
                <div className="mt-4 flex items-center space-x-4">
                  <input
                    type="text"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="Enter OTP"
                    className={inputClasses}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="whitespace-nowrap px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition duration-200"
                  >
                    Verify
                  </button>
                  {resendEnabled && (
                    <button
                      type="button"
                      onClick={handleGetOtp}
                      className="whitespace-nowrap px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition duration-200"
                      >
                      Resend OTP
                    </button>
                  )}
                </div>
              )}
              {otpVarified && (
                <p className="mt-2 text-sm text-green-600">
                  Phone number verified ✓
                </p>
              )} */}
            </div>

            <div>
              <input
                type="password"
                id="password"
                className={inputClasses}
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                id="password2"
                className={inputClasses}
                placeholder="Confirm Password"
                value={formData.password2}
                onChange={handleInputChange}
              />
              {errors.password2 && (
                <p className="mt-1 text-sm text-red-600">{errors.password2}</p>
              )}
            </div>

            <button type="submit" className={buttonClasses} disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/auth/login")}
                className="text-black hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Authentication;
