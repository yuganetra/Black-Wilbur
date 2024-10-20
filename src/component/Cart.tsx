import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCartItems,
  fetchProductById,
  getCartItemsCount,
  isUserLoggedIn,
  removeFromCart,
  updateCartItem,
} from "../services/api";
import { Product, CartItem } from "../utiles/types";

interface CartComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartComponent: React.FC<CartComponentProps> = ({ isOpen, onClose }) => {
  const [cartProducts, setCartProducts] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling
      document.body.style.overflow = "hidden";
    } else {
      // Allow scrolling again
      document.body.style.overflow = "unset";
    }

    // Cleanup to reset overflow when the component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleCheckoutNavigate = async () => {
    const cartCount = getCartItemsCount();
    if ((await cartCount) === 0) {
      alert("Please add products to the cart before proceeding to checkout.");
    } else {
      if (isUserLoggedIn()) {
        onClose();
        console.log("cartProductsc", cartProducts);
        navigate("/checkout", { state: { products: cartProducts } });
      } else {
        onClose();
        navigate("/auth/login", { state: { from: "/checkout", products: cartProducts } }); // Pass cart and previous page
      }
    }
  };

  const loadCartItems = async () => {
    try {
      if (!isUserLoggedIn()) {
        console.log("User is not logged in. Fetching cart from localStorage.");
        const existingCartString = localStorage.getItem("cart");

        if (existingCartString && existingCartString !== "[]") {
          const existingCart = JSON.parse(existingCartString);

          // Ensure existingCart is an array before using .map()
          if (Array.isArray(existingCart) && existingCart.length > 0) {
            const validCart = await Promise.all(
              existingCart.map(
                async (item: {
                  product: Product | null;
                  product_id: number;
                  quantity: number;
                  product_variation_id: string;
                }) => {
                  const productId = (item.product && item.product.id) || item.product_id;
                  if (!productId) {
                    console.log("No valid product ID found");
                    return null;
                  }

                  const productDetails = await fetchProductById(productId);
                  if (productDetails) {
                    return {
                      id: productId,
                      quantity: item.quantity,
                      product: productDetails,
                      size: item.product_variation_id || "Default Size",
                    };
                  }
                  return null;
                }
              )
            );
            // Filter out null values from the result
            const filteredCart = validCart.filter((item) => item !== null) as unknown as CartItem[];
            setCartProducts(filteredCart);
            console.log("Cart loaded from localStorage:", filteredCart);
          } else {
            console.log("No valid cart found in localStorage.");
            setCartProducts([]);
          }
        }
        return;
      }

      const apiCartItems = await fetchCartItems();
      console.log("Cart Items Loaded:", apiCartItems);
      setCartProducts(apiCartItems);
    } catch (error) {
      console.error("Failed to load cart items", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCartItems();
      const intervalId = setInterval(loadCartItems, 50000);
      return () => clearInterval(intervalId);
    }
  }, [isOpen]);

  const handleRemove = (cartItemId: number, productId: number, size: string) => {
    setCartProducts((prev) => {
      const updatedCart = prev.filter(
        (item) => !(item.product.id === productId && item.size.size === size)
      );
      removeFromCart(cartItemId).catch((error) => {
        console.error("Error removing item from cart:", error);
      });

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      loadCartItems();
      return updatedCart;
    });
  };

  const handleUpdateQuantity = async (cartItemId: number, change: number) => {
    setCartProducts((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const newQuantity = Math.max(1, item.quantity + change);
          console.log(newQuantity);

          updateCartItem(cartItemId, newQuantity).catch((error) => {
            console.error("Error updating cart item:", error);
            setCartProducts((prev) =>
              prev.map((item) =>
                item.id === cartItemId ? { ...item, quantity: item.quantity } : item
              )
            );
          });

          return {
            ...item,
            quantity: newQuantity,
          };
        }
        return item;
      })
    );
  };

  const totalAmount = cartProducts.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const totalQuantity = cartProducts.reduce((total, item) => total + item.quantity, 0);
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-[60]" onClick={onClose} />}
      <div
        className={`fixed top-0 right-0 w-80 bg-white shadow-lg transition-transform transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } h-full z-[70] flex flex-col`}
      >
        {/* Cart Header */}
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black text-2xl">
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
                        item.product.product_images?.length > 0
                          ? item.product.product_images[0]?.image // Optional chaining here
                          : "fallback-image-url.jpg"
                      }
                      alt={item.product.name}
                      className="w-16 h-16 object-cover mr-4"
                    />
                    <div className="text-left">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-gray-600">
                        Price: ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">Size: {item.size.size}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      <div className="flex items-center mt-2 gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          className="border rounded px-2 py-1 bg-gray-200"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="border rounded px-2 py-1 bg-gray-200"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemove(item.id, item.product.id, item.size.size)}
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
            onClick={handleCheckoutNavigate}
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default CartComponent;
