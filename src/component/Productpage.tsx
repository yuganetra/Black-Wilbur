import React, { useState } from "react";
import { IoIosStar } from "react-icons/io";
import Tshirt from "../asset/black-tees.jpg";

const productData = [
  {
    id: 1,
    name: "T-Shirt",
    price: 3000,
    image: Tshirt,
    description: "This is a sample product description.",
  },
  {
    id: 2,
    name: "T-Shirt",
    price: 3000,
    image: Tshirt,
    description: "This is a sample product description.",
  },
  {
    id: 3,
    name: "T-Shirt",
    price: 3000,
    image: Tshirt,
    description: "This is a sample product description.",
  },
  {
    id: 4,
    name: "T-Shirt",
    price: 3000,
    image: Tshirt,
    description: "This is a sample product description.",
  },
  {
    id: 5,
    name: "T-Shirt",
    price: 3000,
    image: Tshirt,
    description: "This is a sample product description.",
  },
];

const Productpage = () => {
  const product = productData[0];

  const handleAddToCart = () => {
    console.log(`Added ${product.name} to cart`);
  };

  const handleBuyNow = () => {
    console.log(`Buying ${product.name}`);
  };

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
            {[...Array(5)].map((_, index) => (
              <IoIosStar
                key={index}
                className={`w-6 h-6 ${index < 5 ? "text-yellow-500" : "text-white"}`}
              />
            ))}
          </div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              className="px-4 py-2 bg-[#1B1B1B] border border-white text-white rounded-full"
            >
              ADD TO CART
            </button>
            <button
              onClick={handleBuyNow}
              className="px-4 py-2 bg-white text-black rounded-full"
            >
              BUY NOW!
            </button>
          </div>

          <h4 className="text-lg lg:text-xl mb-2">DESCRIPTION</h4>
          <p className="text-sm mb-2">{product.description}</p>
        </div>
      </section>

      {/* "Visit More" Section */}
      <section className="mt-[80px] py-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl lg:text-5xl font-normal font-montserrat uppercase leading-tight text-white mb-8">
          VISIT MORE
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productData.map((relatedProduct) => (
            <div
              key={relatedProduct.id}
              className="relative bg-[#7A7A7A] rounded-sm overflow-hidden cursor-pointer"
            >
              <img
                className="w-full h-auto object-cover"
                src={relatedProduct.image}
                alt={`Visit More ${relatedProduct.name}`}
              />
              <div className="p-2">
                <h3 className="text-lg">{relatedProduct.name}</h3>
                <p className="text-sm">Price: ₹{relatedProduct.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Productpage;
