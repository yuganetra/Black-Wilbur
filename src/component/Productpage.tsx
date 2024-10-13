import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosStar } from "react-icons/io";
import Tshirt from "../asset/black-tees.jpg";
import CartComponent from "./Cart"; // Import your CartComponent
import SizeChart from "../utiles/SizeChart";
const productData = [
  {
    id: 1,
    name: "T-Shirt",
    price: 3000,
    image: Tshirt,
    description: "This is a sample product description.",
    size: ["M", "L", "XL"],
    ratings: [5, 4, 3],
  },
  {
    id: 2,
    name: "T-Shirt",
    price: 3000,
    image: Tshirt,
    description: "This is a sample product description.",
    size: ["S", "M", "L"],
    ratings: [],
  },
  {
    id: 3,
    name: "T-Shirt",
    price: 3000,
    image: Tshirt,
    description: "This is a sample product description.",
    size: ["XL", "XXL"],
    ratings: [],
  },
];

const Productpage = () => {
  const product = productData[0];
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.size[0]);
  const [userRating, setUserRating] = useState(0);
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };
  const handleBuyNow = () => {
    navigate("/checkout", {
      state: { products: [{ ...product, size: selectedSize }] },
    });
  };
  const toggleCartSidebar = (): void => {
    setIsCartOpen(!isCartOpen);
  };
  const toggleSizeChart = (): void => {
    setIsSizeChartOpen(!isSizeChartOpen);
  };
  const handleRatingClick = (rating: number) => {
    setUserRating(rating);
    product.ratings.push(rating); // Update the ratings directly
    alert(`Rating: ${rating} stars submitted.`);
  };

  const averageRating =
    product.ratings.length > 0
      ? Number(
          (
            product.ratings.reduce((acc, rating) => acc + rating, 0) /
            product.ratings.length
          ).toFixed(1)
        )
      : 0;

  return (
    <div className="bg-[#1B1B1B] text-white min-h-screen flex flex-col">
      <section className="w-full flex flex-col lg:flex-row gap-10">
        {/* Image Section */}
        <div className="w-full md:h-[85vh] lg:h-[750px] lg:w-1/2 flex lg:flex-col flex-row bg-slate-50 overflow-x-hidden">
          <div className="flex lg:flex-col flex-row items-center w-full h-full overflow-x-scroll">
            {Array(3)
              .fill(product.image)
              .map((image, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 flex items-center justify-center bg-[#7A7A7A] w-full h-full min-w-[300px] md:min-w-[400px]"
                >
                  <img
                    className="w-full h-full object-cover"
                    src={image}
                    alt={`Product Image ${product.name}`}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="w-full lg:w-1/2 flex flex-col text-left p-4">
          <h1 className="text-2xl lg:text-4xl font-bold mb-2">
            {product.name}
          </h1>
          <p className="text-lg lg:text-xl mb-4">Price: ₹{product.price}</p>

          <div className="flex items-center mb-4">
            <span className="text-lg mr-2">
              Average Rating: {averageRating} / 5
            </span>
            {[...Array(5)].map((_, index) => (
              <IoIosStar
                key={index}
                className={`w-6 h-6 ${
                  index < averageRating ? "text-yellow-500" : "text-white"
                }`}
              />
            ))}
          </div>

          {/* Size Selection */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-white mb-2">
              Select Size:
            </h4>
            <div className="flex gap-2">
              {product.size.map((size) => (
                <div
                  key={size}
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 border-black cursor-pointer ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
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
              onClick={toggleCartSidebar}
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
            <h4 className="font-medium text-xl text-left text-white mb-2">
              Rate this product:
            </h4>
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
        = {/* Include the SizeChart component here */}
        <SizeChart isOpen={isSizeChartOpen} onClose={toggleSizeChart} />
      </div>
      {/* "Visit More" Section */}
      <section className="mt-[80px] py-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl lg:text-5xl text-left font-normal font-montserrat uppercase leading-tight text-white mb-8">
          VISIT MORE
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productData.map((product) => {
            const productImage = Tshirt;
            // product.images.length > 0 ? product.images[0] : null;
            return (
              <div
                key={product.id}
                className="relative card bg-[#7A7A7A] overflow-hidden flex items-center justify-center"
                style={{ height: "100vh" }}
              >
                <img
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-110"
                  onClick={() => handleNavigate(`/product/${product.id}`)}
                  src={`${productImage}` ? `${productImage}` : undefined}
                  alt={product.name}
                />
                <div className="absolute bottom-4 left-4 text-[#282828] text-lg font-semibold">
                  {product.name.toUpperCase()}
                </div>
                <div className="absolute bottom-4 right-4 text-[#636363] text-lg font-semibold">
                  {product.price} rs
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Productpage;
