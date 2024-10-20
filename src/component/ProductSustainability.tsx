// ProductSustainability.tsx

import React from 'react';
import tshirt from '../asset/black-tees.jpg';

const sustainabilityData = [
  {
    image: tshirt,
    text: 'Our product is made from 100% recycled materials and uses environmentally-friendly processes.',
  },
  {
    image: tshirt,
    text: 'We strive to reduce carbon emissions through optimized manufacturing and transportation methods.',
  },
  {
    image: tshirt,
    text: 'We partner with responsible suppliers to ensure our products are ethically sourced.',
  },
  // Add more items as needed
];

const ProductSustainability: React.FC = () => {
  return (
    <section className="w-full pt-8 bg-white">
      <h2 className="text-5xl font-semibold text-center mb-8">Product Sustainability</h2>
      <div className="grid grid-cols-1">
        {sustainabilityData.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 items-center"
          >
            <div className={`flex justify-center items-center bg-[#7A7A7A] ${index % 2 === 1 ? 'md:order-2' : 'md:order-1'}`}>
              <img
                src={item.image}
                alt={`Sustainability ${index + 1}`}
                className="w-full h-auto md:w-2/3"
              />
            </div>

            <div className={`flex justify-center items-center p-4 bg-black text-white h-full ${index % 2 === 1 ? 'md:order-1' : 'md:order-2'}`}>
              <p className="text-lg">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSustainability;
