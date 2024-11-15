/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
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
import Skeleton from "../utiles/ProductDetailsSkeleton";
import { FaTimes } from "react-icons/fa";

const Productpage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductsImage[]>([]); // New state for images
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<ProductVariation | null>(
    null
  );
  const [wishlist, setWishlist] = useState<string[]>([]); // Wishlist state
  const [exploreProducts, setExploreProducts] = useState<Product[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [ratings, setRatings] = useState<any[]>([]); // Store fetched ratings
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const showErrorMessage = (message: React.SetStateAction<string>) => {
    setErrorMessage(message);
    // Remove the error message after 3 seconds
    setTimeout(() => {
      setErrorMessage('');
    }, 4000);
  };

  const toggleCartSidebar = (): void => {
    setIsCartOpen(!isCartOpen);
  };

  const toggleSizeChart = (): void => {
    setIsSizeChartOpen(!isSizeChartOpen);
  };

  const handleRatingClick = async (rating: number) => {
    setUserRating(rating);
    if (product) {
      try {
        // Call addRating with product ID and user rating
        await addRating(product.id, rating);
        alert(`Rating: ${rating} stars submitted.`);
        fetchRatingsForProduct(); // Fetch updated ratings after submission
      } catch (error) {
        console.error("Error submitting rating:", error);
        alert("Failed to submit rating. Please try again.");
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchRatingsForProduct = async () => {
    if (product) {
      try {
        const fetchedRatings = await fetchRatings(product.id);
        setRatings(fetchedRatings);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      showErrorMessage("Please select a size before adding to the cart.");
      return;
    }
  
    if (selectedSize.quantity <= 0) {
          showErrorMessage("Selected size is out of stock.");
      return;
    }
  
    if (product) {
      const productToAdd = {
        product_id: product.id,
        product_variation_id: selectedSize.id,
        quantity: 1,
      };
  
      const user = localStorage.getItem("user");
  
      if (!user) {
        const cartString = localStorage.getItem("cart");
        let existingCart = cartString ? JSON.parse(cartString) : [];
  
        if (!Array.isArray(existingCart)) {
          existingCart = [];
        }
  
        existingCart.push(productToAdd);
        localStorage.setItem("cart", JSON.stringify(existingCart));
        setIsCartOpen(true);
      } else {
        try {
          await addToCart(
            productToAdd.product_id,
            productToAdd.product_variation_id,
            productToAdd.quantity
          );
          setIsCartOpen(true);
        } catch (error) {
          console.error("Error adding to cart:", error);
        }
      }
    }
  };
  
  const handleBuyNow = async () => {
    if (!selectedSize) {
      showErrorMessage("Please select a size before proceeding to checkout.");
      return;
    }
    
    if (selectedSize.quantity <= 0) {
      showErrorMessage("Selected size is out of stock.")

      return;
    }
  
    if (product) {
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
    }
  };
  

  const toggleWishlist = (productId: string) => {
    setWishlist((prevWishlist) => {
      const newWishlist = prevWishlist.includes(productId)
        ? prevWishlist.filter((id) => id !== productId) // Remove from wishlist
        : [...prevWishlist, productId]; // Add to wishlist

      localStorage.setItem("wishlist", JSON.stringify(newWishlist)); // Save to local storage
      return newWishlist;
    });
  };

  // Fetch Product Data
  useEffect(() => {
    const fetchProduct = async () => {
      if (id && !product) {
        try {
          const fetchedProduct = await fetchProductById(id);
          setProduct(fetchedProduct);
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }
    };
    fetchProduct();
  }, [id, product]);

  // Fetch Product Images
  useEffect(() => {
    const fetchImages = async () => {
      if (id && images.length === 0) {
        try {
          const fetchedImages = await getImageByProductId(id);
          setImages(fetchedImages);
        } catch (error) {
          console.error("Error fetching images:", error);
        }
      }
    };
    fetchImages();
  }, [id, images]);

  // Fetch Ratings
  useEffect(() => {
    const fetchProductRatings = async () => {
      if (id && ratings.length === 0) {
        try {
          const fetchedRatings = await fetchRatings(id);
          setRatings(fetchedRatings);
        } catch (error) {
          console.error("Error fetching ratings:", error);
        }
      }
    };
    fetchProductRatings();
  }, [id, ratings]);

  // Fetch Explore Products
  useEffect(() => {
    const fetchExploreProducts = async () => {
      if (exploreProducts.length === 0) {
        try {
          const fetchedExplore = await fetchExplore();
          setExploreProducts(fetchedExplore);
        } catch (error) {
          console.error("Error fetching explore products:", error);
        }
      }
    };
    fetchExploreProducts();
  }, [exploreProducts]);

  if (!product) {
    return <Skeleton />;
  }

  const combinedImages = product.image
    ? [product.image, ...images.map((image) => image.image_url)]
    : [...images.map((image) => image.image_url)];

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length
      : 0;

  return (
    <div className="bg-[#1B1B1B] text-white min-h-screen flex flex-col">
      {/* Display error message */}
      {errorMessage && (
        <div className="bg-red-500 text-white mb-4 rounded">
          {errorMessage}
        </div>
      )}
      <section className="w-full flex flex-col lg:flex-row gap-10">
        {/* Image Section */}
        <div className="md:h-[65vh] lg:h-[620px] lg:w-[43%] flex lg:flex-col flex-row overflow-x-hidden lg:overflow-y-visible overflow-y-hidden">
          <div className="w-full h-full flex lg:flex-col flex-row overflow-x-auto overflow-y-hidden lg:overflow-y-visible gap-[1px]">
            {combinedImages.map((imageUrl, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex items-center justify-center bg-[#0B0B0B] w-full h-full"
              >
                <img
                  className="lg:w-[600px] md:w-[400px] md:h-full object-contain"
                  src={imageUrl}
                  alt={`Product Image ${index + 1}`}
                />
              </div>
            ))}
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
                  } ${sizeObj.quantity <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
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
        <CartComponent isOpen={isCartOpen} onClose={toggleCartSidebar} />
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
          {exploreProducts.length > 0 ? (
            exploreProducts.map((product) => (
              <div
                key={product.id}
                className="relative bg-[#0B0B0B] overflow-hidden flex flex-col justify-between sm:min-h-[52vh] max-h-[72vh] rounded-sm sm:rounded-none"
              >
                <img
                  className="w-full h-[94%] object-contain cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105"
                  onClick={() => handleNavigate(`/Product/${product.id}`)}
                  src={
                    product.image && product.image.length > 0
                      ? product.image
                      : ""
                  }
                  alt={product.name}
                />
                <div className="flex justify-between items-center pl-2 pr-2 w-full md:h-8 sm:h-5 h-4 bg-white">
                  {" "}
                  <div className="text-[#282828] text-[10px] sm:w-3/4 md:w-3/4 w-1/2 sm:text-base md:text-base font-semibold truncate responsive-text">
                    {product.name.toUpperCase()}
                  </div>
                  <div className=" text-[#58595B] text-[10px] sm:text-sm md:text-sm font-semibold responsive-text">
                    ₹ {product.price}
                  </div>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center ${
                      wishlist.includes(product.id)
                        ? "bg-red-500"
                        : "bg-gray-500"
                    } text-white md:w-10 md:h-10 sm:w-10 sm:h-10`}
                  >
                    {wishlist.includes(product.id) ? "♥" : "♡"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              No products available
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Productpage;
