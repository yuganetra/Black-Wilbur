import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCartItems } from "../services/api";
import { Product } from "../utiles/types";

interface CartItem {
  id: number;
  quantity: number;
  product: Product;
  size: string;
}

interface CartComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartComponent: React.FC<CartComponentProps> = ({ isOpen, onClose }) => {
  const [cartProducts, setCartProducts] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  const handleCheckoutNow = () => {
    onClose();
    navigate("/checkout", { state: { products: cartProducts } });
  };

  const loadCartItems = async () => {
    try {
      const apiCartItems = await fetchCartItems();
      console.log("Cart Items Loaded:", apiCartItems);

      apiCartItems.forEach((item: CartItem) => {
        console.log("Product Images:", item.product.product_images);
      });

      setCartProducts(apiCartItems);
    } catch (error) {
      console.error("Failed to load cart items", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCartItems();
      const intervalId = setInterval(loadCartItems, 5000);
      return () => clearInterval(intervalId);
    }
  }, [isOpen]);

  const handleRemove = (productId: number, size: string) => {
    setCartProducts((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.size === size)
      )
    );
  };

  const handleUpdateQuantity = (
    productId: number,
    size: string,
    change: number
  ) => {
    setCartProducts((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.size === size
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + change),
            }
          : item
      )
    );
  };

  const totalAmount = cartProducts.reduce(
    (total, item) => total + item.product.price * item.quantity, // Directly use price
    0
  );

  const totalQuantity = cartProducts.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 w-80 bg-white shadow-lg transition-transform transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } h-full z-50 flex flex-col`}
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
                        item.product.product_images &&
                        item.product.product_images.length > 0
                          ? item.product.product_images[0].image
                          : "fallback-image-url.jpg"
                      }
                      alt={item.product.name}
                      className="w-16 h-16 object-cover mr-4"
                    />
                    <div className="text-left">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-gray-600">
                        Price: $
                        {(item.product.price * item.quantity).toFixed(2)}{" "}
                        {/* Convert price for display */}
                      </p>

                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      <div className="flex items-center mt-2 gap-2">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.product.id, item.size, -1)
                          }
                          className="border rounded px-2 py-1 bg-gray-200"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.product.id, item.size, 1)
                          }
                          className="border rounded px-2 py-1 bg-gray-200"
                        >
                          +
                        </button>
                        <button
                          onClick={() =>
                            handleRemove(item.product.id, item.size)
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

        <div className="p-4 bg-gray-100 border-t mt-auto text-left">
          <div className="flex justify-between">
            <h3 className="font-medium">Total Quantity:</h3>
            <h3 className="font-medium">{totalQuantity}</h3>
          </div>
          <div className="flex justify-between mt-1">
            <h3 className="font-medium">Total Amount:</h3>
            <h3 className="font-medium">${totalAmount.toFixed(2)}</h3>
          </div>
          <button
            className="w-full mt-4 bg-black text-white py-2 rounded hover:bg-gray-600 transition-colors"
            onClick={handleCheckoutNow}
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default CartComponent;
