import React, { useEffect, useState } from "react";

interface BillingDetailsProps {
  handleSubmit: any;
  onSubmit: (data: any) => void;
  register: any;
  errors: any;
  otpVarified: boolean;
  otpSent: boolean;
  setOtpInput: (value: string) => void;
  handleGetOtp: () => void;
  handleVerifyOtp: () => void;
  resendEnabled: boolean;
}

const BillingDetails: React.FC<BillingDetailsProps> = ({
  handleSubmit,
  onSubmit,
  register,
  errors,
  otpVarified,
  otpSent,
  setOtpInput,
  handleGetOtp,
  handleVerifyOtp,
  resendEnabled,
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");


  // Use useEffect to get the phone number from localStorage when the component mounts
  useEffect(() => {
    // Get the stored user object from localStorage
    const storedUser = localStorage.getItem("user");  
    if (storedUser) {
      // Parse the stored JSON string into an object
      const user = JSON.parse(storedUser);
  
      // Set the phone number and OTP input
      if (user.phone_number) {
        setPhoneNumber(user.phone_number); 
        setOtpInput(user.phone_number);         }
  
      // Set the email
      if (user.email) {
        setEmail(user.email); 
      }
    }
  }, [setOtpInput, setEmail]); 
  

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedPhoneNumber = e.target.value;
    setPhoneNumber(updatedPhoneNumber);
    localStorage.setItem("phone_number", updatedPhoneNumber); // Store in localStorage
  };

  return (
    <div className="container mx-auto p-4 max-w-xl bg-white rounded-xl shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Billing Details Section */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Billing Details</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email} // Pre-fill with phone number from state
              {...register("email", { required: "Email is required" })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="contact" className="text-sm font-medium text-gray-700">Contact</label>
            <input
              id="contact"
              type="text"
              value={phoneNumber} // Pre-fill with phone number from state
              onChange={handlePhoneNumberChange} // Update state and localStorage on change
              {...register("phone_number", { required: "Phone is required" })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="address_line_1" className="text-sm font-medium text-gray-700">Address 1</label>
          <input
            id="address_line_1"
            type="text"
            {...register("address_line_1", { required: "Address is required" })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
          />
          {errors.address_line_1 && <p className="text-xs text-red-500">{errors.address_line_1.message}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="address_line_2" className="text-sm font-medium text-gray-700">Address 2 (optional)</label>
          <input
            id="address_line_2"
            type="text"
            {...register("address_line_2")}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="city" className="text-sm font-medium text-gray-700">City</label>
            <input
              id="city"
              type="text"
              {...register("city", { required: "City is required" })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
            />
            {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
          </div>
          <div className="space-y-1">
            <label htmlFor="country" className="text-sm font-medium text-gray-700">Country</label>
            <input
              id="country"
              type="text"
              {...register("country", { required: "Country is required" })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
            />
            {errors.country && <p className="text-xs text-red-500">{errors.country.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="state" className="text-sm font-medium text-gray-700">State</label>
            <input
              id="state"
              type="text"
              {...register("state", { required: "State is required" })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
            />
            {errors.state && <p className="text-xs text-red-500">{errors.state.message}</p>}
          </div>
          <div className="space-y-1">
            <label htmlFor="zip_code" className="text-sm font-medium text-gray-700">Zip Code</label>
            <input
              id="zip_code"
              type="text"
              {...register("zip_code", { required: "Zip code is required" })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
            />
            {errors.zip_code && <p className="text-xs text-red-500">{errors.zip_code.message}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="paymentMethod" className="text-sm font-medium text-gray-700">Payment Method</label>
          <select
            id="paymentMethod"
            {...register("payment_method", { required: "Payment method is required" })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
          >
            <option value="">Select a payment method</option>
            <option value="upi">UPI</option>
            <option value="cash_on_delivery">Cash on Delivery</option>
          </select>
          {errors.payment_method && <p className="text-xs text-red-500">{errors.payment_method.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md mt-4"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default BillingDetails;
