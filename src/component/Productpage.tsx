import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosStar } from "react-icons/io";
import CartComponent from "./Cart";
import SizeChart from "../utiles/SizeChart";
import { fetchProductById, fetchExplore, addToCart } from "../services/api";
import { Product, ProductVariation } from "../utiles/types";
import Skeleton from "../utiles/Skeleton";

const Productpage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<ProductVariation | null>(null);
  const [exploreProducts, setExploreProducts] = useState<Product[]>([]);
  const [userRating, setUserRating] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleBuyNow = () => {
    if (product && selectedSize) {
      navigate("/checkout", {
        state: { products: [{ ...product, size: selectedSize.size }] },
      });
    }
  };

  const toggleCartSidebar = (): void => {
    setIsCartOpen(!isCartOpen);
  };

  const toggleSizeChart = (): void => {
    setIsSizeChartOpen(!isSizeChartOpen);
  };

  const handleRatingClick = (rating: number) => {
    setUserRating(rating);
    if (product) {
      product.rating = rating;
      alert(`Rating: ${rating} stars submitted.`);
    }
  };

  const handleAddToCart = async () => {
    if (product && selectedSize) {
      const productToAdd = {
        product_id: product.id, // Ensure this matches the ID used in your API
        product_variation_id: selectedSize.id, // Add the selected size ID here
        quantity: 1, // You can adjust this as needed
      };

      try {
        // Call the API function to add the product to the cart
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
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const fetchedProduct = await fetchProductById(Number(id));
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

  const averageRating = product.rating || 0;

  return (
    <div className="bg-[#1B1B1B] text-white min-h-screen flex flex-col">
      <section className="w-full flex flex-col lg:flex-row gap-10">
        {/* Image Section */}
        <div className="w-full md:h-[85vh] lg:h-[750px] lg:w-1/2 flex lg:flex-col flex-row bg-slate-50 overflow-x-hidden">
          <div className="flex lg:flex-col flex-row items-center w-full h-full overflow-x-scroll">
            {product.product_images.map((imageObj, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex items-center justify-center bg-[#7A7A7A] w-full h-full min-w-[300px] md:min-w-[400px]"
              >
                <img
                  className="w-full h-full object-cover md:object-contain"
                  src={imageObj.image}
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
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, index) => (
                <IoIosStar
                  key={index}
                  className={`w-6 h-6 cursor-pointer ${
                    index < userRating ? "text-yellow-500" : "text-white"
                  }`}
                  onClick={() => handleRatingClick(index + 1)}
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
        <h2 className="text-2xl lg:text-5xl text-left font-normal font-montserrat uppercase leading-tight text-white mb-8">
          VISIT MORE
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {exploreProducts.length > 0 ? (
            exploreProducts.map((product) => (
              <div
                key={product.id}
                className="relative card bg-[#7A7A7A] overflow-hidden flex items-center justify-center"
                style={{ height: "100vh" }}
              >
                <img
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-110"
                  onClick={() => handleNavigate(`/product/${product.id}`)}
                  src={product.product_images[0]?.image || "/placeholder.png"}
                  alt={product.name}
                />
                <div className="absolute bottom-4 left-4 text-[#282828] text-lg font-semibold">
                  {product.name.toUpperCase()}
                </div>
                <div className="absolute bottom-4 right-4 text-[#636363] text-lg font-semibold">
                  ₹{product.price}
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
