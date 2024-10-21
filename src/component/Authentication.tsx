import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { registerUser, loginUser, fetchCartItems } from "../services/api";
import { AuthUser } from "../utiles/types";

const Authentication: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLogin = location.pathname === "/auth/login";
  const [forgotPassword, setForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [errors, setErrors] = useState({} as Record<string, string>);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");

    const newErrors = {
      firstName: formData.firstName ? "" : "First Name is required",
      lastName: formData.lastName ? "" : "Last Name is required",
      email: formData.email ? "" : "Email is required",
      username: formData.username ? "" : "Username is required",
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
          username: formData.username,
          email: formData.email,
          password: formData.password,
          password2: formData.password2,
        };
        console.log(userData);
        const response = await registerUser(userData);

        localStorage.setItem("user", JSON.stringify(response));

        setSuccessMessage("Account created successfully! Please log in.");
        setFormData({
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          password: "",
          password2: "",
        });
        navigate("/auth/login");
      } catch (error) {
        if (error instanceof Error) {
          setApiError(error.message); // Use the error message thrown from registerUser
        } else {
          setApiError("An unknown error occurred."); // Fallback for unexpected error types
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    // Constructing credentials with username or email
    const credentials: AuthUser = {
      email: formData.email, // This will hold the input (username or email)
      password: formData.password,
    };

    try {
      console.log(credentials);
      const response = await loginUser(credentials); // Ensure your backend handles this properly

      // Store user data in local storage
      localStorage.setItem("user", JSON.stringify(response));

      // Fetch the user's cart and store it in local storage
      const cartItems = fetchCartItems(); // Make sure fetchCart is defined in your API file
      localStorage.setItem("cart", JSON.stringify(cartItems));

      setSuccessMessage("Login successful!");
      // Check if the user was redirected from a specific page (like checkout)
      const previousState = location.state?.from || "/user-profile";
      navigate(previousState, {
        state: { products: location.state?.products || [] },
      });
    } catch (error) {
      setApiError(
        "Invalid credentials. Please check your email or username and password."
      );
    }
  };
  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-white font-montserrat px-4">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        {/* Display Title Dynamically */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-black">
            {isLogin ? "Customer Login" : "Create an Account"}
          </h1>
        </div>

        {/* Display any API error or success message */}
        {apiError && (
          <p className="text-red-500 text-center mb-4">{apiError}</p>
        )}
        {successMessage && (
          <p className="text-green-500 text-center mb-4">{successMessage}</p>
        )}

        {/* Conditional Forms based on Login/Signup */}
        {isLogin ? (
          forgotPassword ? (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`block w-full h-12 p-4 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:border-black`}
                placeholder="Email"
                required
              />
              <div className="text-center">
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
                <button
                  type="button"
                  onClick={() => setForgotPassword(false)}
                  className="text-black mt-4 hover:underline"
                >
                  Back to Login
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <input
                type="text"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`block w-full h-12 p-4 border ${
                  errors.Email ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:border-black`}
                placeholder="Username or Email"
                required
              />
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`block w-full h-12 p-4 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:border-black`}
                placeholder="Password"
                required
              />
              <button
                type="submit"
                className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setForgotPassword(true)}
                  className="text-black hover:underline"
                >
                  Forgot Password?
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/auth/signup")}
                  className="text-black hover:underline"
                >
                  Create an Account
                </button>
              </div>
            </form>
          )
        ) : (
          <form onSubmit={handleSignupSubmit} className="space-y-6">
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`block w-full h-12 p-4 border ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:border-black`}
              placeholder="First Name"
              required
            />
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`block w-full h-12 p-4 border ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:border-black`}
              placeholder="Last Name"
              required
            />
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`block w-full h-12 p-4 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:border-black`}
              placeholder="Email"
              required
            />
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`block w-full h-12 p-4 border ${
                errors.username ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:border-black`}
              placeholder="Username"
              required
            />
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`block w-full h-12 p-4 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:border-black`}
              placeholder="Password"
              required
            />
            <input
              type="password"
              id="password2"
              value={formData.password2}
              onChange={handleInputChange}
              className={`block w-full h-12 p-4 border ${
                errors.password2 ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:border-black`}
              placeholder="Confirm Password"
              required
            />
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/auth/login")}
              className="text-black hover:underline mt-4"
            >
              Already have an account? Log In
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Authentication;
