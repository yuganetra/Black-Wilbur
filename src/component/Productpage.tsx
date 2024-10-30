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
} from "../services/api";
import { ProductCollection, ProductVariation,ProductImage } from "../utiles/types";
import Skeleton from "../utiles/Skeleton";

const Productpage = () => {
  const [product, setProduct] = useState<ProductCollection | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<ProductVariation | null>(null);
  const [exploreProducts, setExploreProducts] = useState<ProductCollection[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [ratings, setRatings] = useState<any[]>([]); // Store fetched ratings
  const navigate = useNavigate();
  const { id } = useParams();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleBuyNow = async () => {
    if (product && selectedSize) {
      const cartItem = {
        id: product.id,
        quantity: 1,
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          availability: true,
          product_images: product.product_images,
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

  const fetchRatingsForProduct = async () => {
    if (product) {
      try {
        const fetchedRatings = await fetchRatings(product.id);
        setRatings(fetchedRatings); // Update state with fetched ratings
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    }
  };

  const handleAddToCart = async () => {
    if (product && selectedSize) {
      const productToAdd = {
        product_id: product.id,
        product_variation_id: selectedSize.id,
        quantity: 1,
      };

      const user = localStorage.getItem("user");

      if (!user) {
        console.log("User is not logged in. Adding product to localStorage cart.");

        const cartString = localStorage.getItem("cart");
        let existingCart = cartString ? JSON.parse(cartString) : [];

        if (!Array.isArray(existingCart)) {
          console.error("Existing cart is not an array. Initializing a new cart.");
          existingCart = [];
        }

        existingCart.push(productToAdd);

        localStorage.setItem("cart", JSON.stringify(existingCart));

        setIsCartOpen(true);
        console.log("Product added to local storage cart:", productToAdd);
      } else {
        try {
          await addToCart(
            productToAdd.product_id,
            productToAdd.product_variation_id,
            productToAdd.quantity
          );
          setIsCartOpen(true);
          console.log("Product added to API cart:", productToAdd);
        } catch (error) {
          console.error("Error adding to cart:", error);
        }
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const fetchedProduct = await fetchProductById((id));
          setProduct(fetchedProduct);
          setSelectedSize(fetchedProduct.sizes[0]);
          const fetchedExplore = await fetchExplore();
          setExploreProducts(fetchedExplore);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!product) {
    return <Skeleton />;
  }

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length
      : 0;

  return (
    <div className="bg-[#1B1B1B] text-white min-h-screen flex flex-col">
      <section className="w-full flex flex-col lg:flex-row gap-10">
        {/* Image Section */}
        <div className="w-full md:h-[80vh] lg:h-[750px] lg:w-[650px] flex lg:flex-col flex-row bg-slate-50 overflow-x-hidden lg:overflow-y-visible overflow-y-hidden">
          <div className="w-full h-full flex lg:flex-col flex-row bg-slate-50 overflow-x-auto overflow-y-hidden lg:overflow-y-visible">
          {product.product_images.map((imageObj: ProductImage, index: number) => (
  <div
    key={index}
    className="flex-shrink-0 flex items-center justify-center bg-[#7A7A7A] w-full h-full"
  >
    <img
      className="lg:w-[650px] md:w-[400px] md:h-full md:overflow-y-hidden"
      src={imageObj.image_url} // Change here
      alt={`Product Image ${product.name}`}
    />
  </div>
))}

          </div>
        </div>

        {/* Product Details Section */}
        <div className="w-full lg:w-1/2 flex flex-col text-left p-4">
          <h1 className="text-2xl lg:text-4xl font-bold mb-2">{product.name}</h1>
          <p className="text-lg lg:text-xl mb-4">Price: ₹{product.price}</p>

          <div className="flex items-center mb-4">
            <span className="text-lg mr-2">Average Rating: {averageRating} / 5</span>
            {[...Array(5)].map((_, index) => (
              <IoIosStar
                key={index}
                className={`w-6 h-6 ${index < averageRating ? "text-yellow-500" : "text-white"}`}
              />
            ))}
          </div>

          {/* Size Selection */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-white mb-2">Select Size:</h4>
            <div className="flex gap-2">
              {product.sizes.map((sizeObj) => (
                <div
                  key={sizeObj.id}
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 border-black cursor-pointer ${
                    selectedSize?.id === sizeObj.id ? "bg-black text-white" : "bg-white text-black"
                  }`}
                  onClick={() => setSelectedSize(sizeObj)}
                >
                  {sizeObj.size}
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-4 mb-8">
            <button
              onClick={toggleSizeChart}
              className="px-4 py-2 bg-[#1B1B1B] border border-white text-white rounded-full"
            >
              Size Chart
            </button>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={handleAddToCart} // Use the new function
              className="px-4 py-2 bg-[#1B1B1B] border border-white text-white rounded-full"
            >
              ADD TO CART
            </button>
            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="px-4 py-2 bg-[#1B1B1B] border border-white text-white rounded-full"
            >
              BUY NOW
            </button>
          </div>

          <div className="w-full lg:w-3/4 mb-4 mt-4">
            <h4 className="text-lg lg:text-xl mb-2">DESCRIPTION</h4>
            <p className="text-sm mb-2">{product.description}</p>

            {/* User Rating Section */}
            <h4 className="font-medium text-xl text-left text-white mb-2">Rate this product:</h4>
            <div className="flex items-center mb-4">
              {[1, 2, 3, 4, 5].map((ratingValue) => (
                <IoIosStar
                  key={ratingValue}
                  className={`w-6 h-6 cursor-pointer ${
                    ratingValue <= userRating ? "text-yellow-500" : "text-white"
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
        {/* Include the SizeChart component here */}
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
                className="relative bg-white overflow-hidden flex flex-col justify-between sm:min-h-[52vh] max-h-[72vh] rounded-sm sm:rounded-none"
              >
                <img
                  className="w-full h-[93%] object-contain cursor-pointer"
                  onClick={() => handleNavigate(`/Product/${product.id}`)}
                  src={
                    product.product_images && product.product_images.length > 0
                      ? product.product_images[0]?.image_url
                      : ""
                  }
                  alt={product.name}
                />
                <div className="flex justify-between items-center p-1">
                  {" "}
                  {/* Flex container for name and price */}
                  <div className="text-[#282828] text-[8px] sm:text-base md:text-base font-semibold">
                    {product.name}
                  </div>
                  <div className="text-[#58595B] text-[8px] sm:text-sm md:text-base font-semibold">
                    ₹ {product.price}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Skeleton />
          )}
        </div>
      </section>
    </div>
  );
};

export default Productpage;
