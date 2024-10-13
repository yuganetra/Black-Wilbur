import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tshirt from "../asset/black-tees.jpg";
import Checkout from "./Checkout";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  size: string;
  quantity: number; // Added quantity field
}

interface CartComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartComponent: React.FC<CartComponentProps> = ({ isOpen, onClose }) => {
  const [cartProducts, setCartProducts] = useState<Product[]>([]); // Initialize as an empty array
  const navigate = useNavigate();

  const handleCheckoutNow = () => {
    onClose();
    navigate("/checkout", {
      state: { products: cartProducts },
    });
  };

  useEffect(() => {
    if (isOpen && cartProducts.length === 0) {
      const fetchedCartProducts: Product[] = [
        {
          id: 1,
          name: "T-shirt",
          price: 3000,
          image: Tshirt,
          description: "Comfortable cotton t-shirt",
          size: "M",
          quantity: 1, // Initialize quantity
        },
        {
          id: 2,
          name: "T-shirt",
          price: 3000,
          image: Tshirt,
          description: "Stylish T-shirt",
          size: "L",
          quantity: 1, // Initialize quantity
        },
      ];
      setCartProducts(fetchedCartProducts);
    }
  }, [isOpen]);

  // Remove product from cart
  const handleRemove = (productId: number) => {
    setCartProducts((prev) =>
      prev.filter((product) => product.id !== productId)
    );
  };

  // Update product quantity in cart
  const handleUpdateQuantity = (productId: number, change: number) => {
    setCartProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, quantity: product.quantity + change } // Update quantity
          : product
      )
    );
  };

  // Calculate total amount and quantity
  const totalAmount =
    cartProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    ) || 0; // Calculate total based on quantity

  const totalQuantity =
    cartProducts.reduce((total, product) => total + product.quantity, 0) || 0; // Calculate total quantity

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

        {/* Product List Section */}
        {cartProducts.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="flex-grow p-4 overflow-y-auto max-h-full">
            <ul>
              {cartProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex items-start justify-between border-b py-2"
                >
                  <div className="flex">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover mr-4"
                    />
                    <div className="text-left">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-gray-600">
                        Price: ${product.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Size: {product.size}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {product.quantity}
                      </p>
                      {/* Show quantity */}
                      <div className="flex items-center mt-2 gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(product.id, -1)}
                          className="border rounded px-2 py-1 bg-gray-200"
                          disabled={product.quantity <= 1} // Prevent negative quantity
                        >
                          -
                        </button>
                        <button
                          onClick={() => handleUpdateQuantity(product.id, 1)}
                          className="border rounded px-2 py-1 bg-gray-200"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemove(product.id)}
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

        {/* Total and Checkout Section (Fixed at the bottom) */}
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
