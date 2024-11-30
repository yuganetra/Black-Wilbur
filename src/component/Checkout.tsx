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
import { createOrder, getDiscounts } from "../services/api";
import { v4 as uuidv4 } from "uuid";
import OrderSummary from "./Checkout/OrderSummary";
import BillingDetails from "./Checkout/BillingDetails";

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
  payment_status: string;
  subtotal: number; 
  discount_amount: number;
  tax_amount: number; 
  total_amount: number; 
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
  const [otpInput, setOtpInput] = useState("");
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


  const generateOrderId = (): string => {
    return uuidv4();
  };

  const onSubmit = async (data: Order) => {
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

  // Prepare props for both components
  const orderSummaryProps = {
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
    finalAmount,
    final_discount,
  };

  const billingDetailsProps = {
    register,
    handleSubmit,
    onSubmit,
    errors,
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col font-montserrat">
      <div className="flex-1 pb-16 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto p-6 bg-white text-black rounded-lg shadow-lg flex flex-col lg:flex-row">
          <OrderSummary {...orderSummaryProps} />
          <BillingDetails otpVarified={false} otpSent={false} handleGetOtp={function (): void {
            throw new Error("Function not implemented.");
          } } handleVerifyOtp={function (): void {
            throw new Error("Function not implemented.");
          } } resendEnabled={false} setOtpInput={setOtpInput} {...billingDetailsProps} />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
