import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { registerUser,loginUser } from "../services/api";
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
        password2: formData.password2 === formData.password ? "" : "Passwords must match",
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

            const response = await registerUser(userData);
            
            localStorage.setItem('user', JSON.stringify(response));

            setSuccessMessage("Account created successfully! Please log in.");
            setFormData({ firstName: "", lastName: "", username: "", email: "", password: "", password2: "" });
            navigate("/auth/login");
        } catch (error) {
            setApiError("Failed to create account. Please try again.");
        } finally {
            setLoading(false);
        }
    }
};

const handleLoginSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setApiError("");

  const credentials: AuthUser = {
      email: formData.email,  
      password: formData.password,
  };

  try {
    console.log(credentials)
      const response = await loginUser(credentials);
      
      localStorage.setItem('user', JSON.stringify(response));

      setSuccessMessage("Login successful!");
      navigate('/user-profile'); 
  } catch (error) {
      setApiError("Invalid credentials. Please check your email and password.");
  }
};

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white font-montserrat">
      <div className={`w-full md:w-1/2 flex items-center justify-center text-4xl md:text-6xl font-thin text-black`}>
        <div className="text-center">
          {isLogin ? <span>Customer Login</span> : <><span>Create an</span><br /><span>Account</span></>}
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {apiError && <p className="text-red-500 text-sm text-center">{apiError}</p>}
          {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}
          {isLogin ? (
            forgotPassword ? (
              <form onSubmit={(e) => e.preventDefault()} className="text-center space-y-6">
                <div className="mb-6">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`block w-full h-12 p-4 border ${errors.email ? "border-red-500" : "border-black"} text-black placeholder-gray-500 focus:outline-none focus:border-black text-sm`}
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <button
                    type="submit"
                    className="w-44 bg-black text-white py-2 px-4 rounded-3xl hover:bg-gray-800"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotPassword(false)}
                    className="text-black hover:underline"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="mb-6">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`block w-full h-12 p-4 border ${errors.Email ? "border-red-500" : "border-black"} text-black placeholder-gray-500 focus:outline-none focus:border-black text-sm`}
                    placeholder="User Name"
                    required
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`block w-full h-12 p-4 border ${errors.password ? "border-red-500" : "border-black"} text-black placeholder-gray-500 focus:outline-none focus:border-black text-sm`}
                    placeholder="Password"
                    required
                  />
                </div>
                <div className="mb-6"> {/* Add margin-bottom for spacing */}
                  <button
                    type="submit"
                    className="w-44 bg-black text-white py-2 px-4 rounded-3xl hover:bg-gray-800"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Log In"}
                  </button>
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <button
                    type="button"
                    onClick={() => setForgotPassword(true)}
                    className="text-black hover:underline"
                  >
                    Forgot Password?
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/auth/signup")} // Navigate to signup
                    className="text-black hover:underline"
                  >
                    Create an Account
                  </button>
                </div>
              </form>
            )
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-6">
              <div className="mb-6">
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`block w-full h-12 p-4 border ${errors.firstName ? "border-red-500" : "border-black"} text-black placeholder-gray-500 focus:outline-none focus:border-black text-sm`}
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="mb-6">
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`block w-full h-12 p-4 border ${errors.lastName ? "border-red-500" : "border-black"} text-black placeholder-gray-500 focus:outline-none focus:border-black text-sm`}
                  placeholder="Last Name"
                  required
                />
              </div>
              <div className="mb-6">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full h-12 p-4 border ${errors.email ? "border-red-500" : "border-black"} text-black placeholder-gray-500 focus:outline-none focus:border-black text-sm`}
                  placeholder="Email"
                  required
                />
              </div>
              <div className="mb-6">
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`block w-full h-12 p-4 border ${errors.username ? "border-red-500" : "border-black"} text-black placeholder-gray-500 focus:outline-none focus:border-black text-sm`}
                  placeholder="Username"
                  required
                />
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full h-12 p-4 border ${errors.password ? "border-red-500" : "border-black"} text-black placeholder-gray-500 focus:outline-none focus:border-black text-sm`}
                  placeholder="Password"
                  required
                />
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  id="password2"
                  value={formData.password2}
                  onChange={handleInputChange}
                  className={`block w-full h-12 p-4 border ${errors.password2 ? "border-red-500" : "border-black"} text-black placeholder-gray-500 focus:outline-none focus:border-black text-sm`}
                  placeholder="Confirm Password"
                  required
                />
              </div>
              <div className="flex flex-col items-center space-y-4">
                <button
                  type="submit"
                  className="w-44 bg-black text-white py-2 px-4 rounded-3xl hover:bg-gray-800"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/auth/login")} 
                  className="text-black hover:underline"
                >
                  Already have an account? Log In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Authentication;
