/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosStar } from "react-icons/io";
import CartComponent from "./Cart";
import SizeChart from "../utiles/SizeChart";
import {
  fetchProductById,
  fetchExplore,
  addToCart,
  isUserLoggedIn,
  fetchRatings,
  addRating,
  getImageByProductId,
} from "../services/api";
import { Product, ProductVariation, ProductsImage } from "../utiles/types";
import Skeleton from "../utiles/Skeletons/ProductDetailsSkeleton";
import { FaTimes } from "react-icons/fa";
import ProductCard from "../utiles/Cards/ProductCard";

interface CartItem extends Product {
  selectedSize: string | undefined;
  quantity: number;
}

type CartItemCheckout = {
  id: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    product_images: string;
  };
  quantity: number;
  size: string;
  product_variation_id: string;
  selectedSize: string; // Add this explicitly
};

const Productpage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductsImage[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<ProductVariation | null>(
    null
  );
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  const [exploreProducts, setExploreProducts] = useState<Product[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [ratings, setRatings] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const [cartItems, setCartItems] = useState<CartItemCheckout[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleNavigate = useCallback(
    (id: string) => {
      navigate(`/Product/${id}`);
    },
    [navigate]
  );

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage("");
    }, 4000);
  };

  const toggleCartSidebar = (): void => {
    setIsCartOpen(!isCartOpen);
  };

  const toggleSizeChart = (): void => {
    setIsSizeChartOpen(!isSizeChartOpen);
  };

  const fetchRatingsForProduct = useCallback(async (productId: string) => {
    try {
      const fetchedRatings = await fetchRatings(productId);
      setRatings(fetchedRatings);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  }, []);

  const handleRatingClick = async (rating: number) => {
    if (!product) return;

    setUserRating(rating);
    try {
      await addRating(product.id, rating);
      alert(`Rating: ${rating} stars submitted.`);
      fetchRatingsForProduct(product.id);
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating. Please try again.");
    }
  };

  // Updated handleAddToCart function
  const handleAddToCart = async () => {
    if (!selectedSize) {
      showErrorMessage("Please select a size before adding to the cart.");
      return;
    }

    if (selectedSize.quantity <= 0) {
      showErrorMessage("Selected size is out of stock.");
      return;
    }

    if (!product) return;

    const productToAdd: CartItem = {
      ...product,
      selectedSize: selectedSize.size,
      quantity: 1,
    };

    const cartItem: CartItemCheckout = {
      id: product.id,
      quantity: 1,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        product_images: product.image,
      },
      size: selectedSize.size,
      selectedSize: selectedSize.size, // Include this
      product_variation_id: selectedSize.id,
    };

    setCartItems([cartItem]); // If starting a new cart array
    const user = localStorage.getItem("user");

    if (!user) {
      // Add to local cart
      const cartString = localStorage.getItem("cart");
      let existingCart: CartItemCheckout[] = cartString
        ? JSON.parse(cartString)
        : [];
      existingCart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(existingCart));
      setCartItems(existingCart); // Update state
    } else {
      // Add to server-side cart
      try {
        await addToCart(
          productToAdd.id,
          selectedSize.id,
          productToAdd.quantity
        );
        setCartItems((prevCart) => [...prevCart, cartItem]); // Update state
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }

    setIsCartOpen(true);
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      showErrorMessage("Please select a size before proceeding to checkout.");
      return;
    }

    if (selectedSize.quantity <= 0) {
      showErrorMessage("Selected size is out of stock.");
      return;
    }

    if (!product) return;

    const cartItem = {
      id: product.id,
      quantity: 1,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        availability: true,
        product_images: product.image,
      },
      size: selectedSize.size,
      product_variation_id: selectedSize.id,
    };

    if (isUserLoggedIn()) {
      navigate("/checkout", {
        state: { products: [cartItem] },
      });
    } else {
      navigate("/auth/login", {
        state: {
          from: "/checkout",
          products: [cartItem],
        },
      });
    }
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prevWishlist: Product[]) => {
      const exists = prevWishlist.find((item) => item.id === product.id);
      let newWishlist;
  
      if (exists) {
        // Remove product if it exists
        newWishlist = prevWishlist.filter((item) => item.id !== product.id);
      } else {
        // Add product if it doesn't exist
        newWishlist = [...prevWishlist, product];
      }
  
      localStorage.setItem("wishlist", JSON.stringify(newWishlist)); // Save to localStorage
      return newWishlist;
    });
  };
  
  // Combined fetch effect
  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const [fetchedProduct, fetchedImages, fetchedRatings, fetchedExplore] =
          await Promise.all([
            fetchProductById(id),
            getImageByProductId(id),
            fetchRatings(id),
            fetchExplore(),
          ]);

        setProduct(fetchedProduct);
        setImages(fetchedImages);
        setRatings(fetchedRatings);
        setExploreProducts(fetchedExplore);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [id]); // Only depends on id parameter

  if (isLoading) {
    return <Skeleton />;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const combinedImages = product.image
    ? [product.image, ...images.map((image) => image.image_url)]
    : [...images.map((image) => image.image_url)];

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length
      : 0;

  const handleThumbnailClick = (index: number) => {
    setActiveImageIndex(index);
    // Scroll to the selected image
    const imageElements = document.querySelectorAll('.product-image');
    if (imageElements[index]) {
      imageElements[index].scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#1B1B1B] text-white min-h-screen flex flex-col">
      {/* Display error message */}
      {errorMessage && (
        <div className="bg-red-500 text-white mb-4 rounded">{errorMessage}</div>
      )}
      <section className="w-full flex flex-col lg:flex-row gap-10">
        {/* Image Section */}
        <div className="h-[50vh] md:h-[65vh] lg:h-[620px] w-full lg:w-[43%] flex flex-col lg:flex-row gap-4">
          {/* Thumbnail Column - Horizontal on mobile, Vertical on desktop */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-hidden w-full lg:w-[80px] h-[80px] lg:h-auto lg:mt-10 lg:ml-2 px-2 lg:px-0">
            {combinedImages.map((imageUrl, index) => (
              <div 
                key={index}
                className={`flex-shrink-0 w-[80px] h-[80px] border cursor-pointer transition-colors
                  ${activeImageIndex === index ? 'border-black' : 'border-gray-200 hover:border-gray-400'}`}
                onClick={() => handleThumbnailClick(index)}
              >
                <img
                  src={imageUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1">
            <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px]">
              <img
                className="w-full h-full object-cover"
                src={combinedImages[activeImageIndex]}
                alt={`Product Image ${activeImageIndex + 1}`}
              />
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="w-full lg:w-[57%] flex flex-col text-left p-6 lg:p-8">
          <h1 className="text-2xl lg:text-4xl font-bold mb-4 text-gray-100">
            {product.name}
          </h1>
          <p className="text-lg lg:text-xl font-semibold mb-6 text-gray-300">
            Price: ₹{product.price}
          </p>

          {/* Average Rating */}
          <div className="flex items-center mb-6">
            <span className="text-lg text-gray-300 mr-3">
              Average Rating: {averageRating} / 5
            </span>
            {[...Array(5)].map((_, index) => (
              <IoIosStar
                key={index}
                className={`w-6 h-6 ${
                  index < averageRating ? "text-yellow-500" : "text-gray-400"
                }`}
              />
            ))}
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-200 mb-3">
              Select Size:
            </h4>
            <div className="flex gap-2">
              {product.sizes.map((sizeObj) => (
                <div
                  key={sizeObj.id}
                  className={`flex items-center justify-center w-12 h-12 rounded-full cursor-pointer transition-transform transform hover:scale-110 border ${
                    selectedSize?.id === sizeObj.id
                      ? "bg-black text-white border-transparent"
                      : "bg-white text-black border-black"
                  } ${
                    sizeObj.quantity <= 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => {
                    if (sizeObj.quantity > 0) {
                      setSelectedSize(sizeObj);
                    }
                  }}
                >
                  {sizeObj.size}
                  {sizeObj.quantity <= 0 && (
                    <div className="absolute top-0 right-0 text-red-500 text-xl">
                      <FaTimes />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Size Chart Button */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={toggleSizeChart}
              className="px-5 py-2 bg-gray-700 text-gray-100 rounded-full transition-colors duration-300 hover:bg-gray-600"
            >
              Size Chart, Do's & Don'ts
            </button>
          </div>

          {/* Add to Cart and Buy Now Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              className="px-5 py-2 bg-[#282828] text-white border border-transparent rounded-full transition duration-300 hover:bg-white hover:text-black"
            >
              ADD TO CART
            </button>
            <button
              onClick={handleBuyNow}
              className="px-5 py-2 bg-[#282828] text-white border border-transparent rounded-full transition duration-300 hover:bg-white hover:text-black"
            >
              BUY NOW
            </button>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="text-lg lg:text-3xl font-semibold text-gray-200 mb-3">
              DESCRIPTION
            </h4>
            <p className="text-sm lg:text-base text-gray-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* User Rating Section */}
          <div className="mt-8">
            <h4 className="font-semibold text-lg text-gray-200 mb-3">
              Rate this product:
            </h4>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((ratingValue) => (
                <IoIosStar
                  key={ratingValue}
                  className={`w-6 h-6 cursor-pointer ${
                    ratingValue <= userRating
                      ? "text-yellow-500"
                      : "text-gray-400"
                  }`}
                  onClick={() => handleRatingClick(ratingValue)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Add to Cart Sidebar */}
      <div className="text-black">
        <CartComponent
          isOpen={isCartOpen}
          onClose={toggleCartSidebar}
          cartItems={cartItems}
        />
      </div>
      <div className="text-black">
        <SizeChart isOpen={isSizeChartOpen} onClose={toggleSizeChart} />
      </div>

      {/* "Visit More" Section */}
      <section className="mt-[80px] py-6 px-4 sm:px-6 lg:px-8">
        <div className="ml-1 mb-4 md:text-4xl sm:text-2xl lg:text-5xl font-normal font-montserrat uppercase leading-tight text-white text-start">
          VISIT MORE
        </div>
        <div className="p-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-[5px] sm:gap-[2px] md:gap[3px]">
          {exploreProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              handleNavigate={handleNavigate}
              isWishlisted={wishlist.includes(product)}
              onToggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Productpage;
