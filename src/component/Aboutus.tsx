// AboutUs.tsx

import React from 'react';
import videoSrc from '../asset/homepage-vid.mp4';
import ProductSustainability from './ProductSustainability'; // Import the new component

const AboutUs: React.FC = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0">
        <video 
          className="w-full h-full object-cover"
          autoPlay 
          muted 
          loop
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="relative z-10 w-full h-full overflow-auto hide-scrollbar">
        <div className="flex flex-col">
          {/* About Us Section */}
          <section id='about-us' className="w-full h-screen flex items-center justify-center p-6 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-6xl text-white mb-4">About Us</h1>
              <p className=" text-2xl text-white">
                Black Wilbur, as the name suggests, is a monochrome-inspired clothing brand emphasizing urban designs that highlight the wearer’s exquisite side, considering black as the universally admired color.
              </p>
              <p className="text-2xl text-white mt-4">
                Founded in India in 2024 by Aayush Budhrani, who holds a vision of soaring to greater heights in the designer apparel industry with the newest trends and creative ideas.
              </p>
            </div>
          </section>
          
          {/* Our Mission Section */}
          <section id='our-missions' className="w-full h-screen flex items-center justify-center p-6 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-6xl text-white mb-4">Our Mission</h2>
              <p className="text-2xl text-white">
                Black Wilbur creates inimitable pieces that can be worn for years. Each piece is crafted to be more than just clothing—it's an extension of who you are. By offering one-of-a-kind designs, Black Wilbur ensures that every wearer experiences a unique connection with their attire, making it a true reflection of their identity and style.
              </p>
            </div>
          </section>

          {/* Our Values Section */}
          <section id='our-values' className="w-full h-screen flex items-center justify-center p-6 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-6xl text-white mb-4">Our Values</h2>
              <p className="text-2xl text-white">
                After sketching the designs, we send them to our factories where the samples are created. Using bespoke illustrations and photography, all our prints and graphics are designed in-house. From the cut, to the fabric, to the fit, every single detail is important.
              </p>
              <p className="text-2xl text-white">
                At Black Wilbur, we believe it's our duty to ensure that our customers not only look their best but also feel their best. This commitment means meticulously selecting materials and refining our processes to create collections that embody quality and care. Each piece is crafted with attention to detail, so you can wear it with confidence, knowing that both your style and your comfort have been thoughtfully considered.
              </p>
            </div>
          </section>

          {/* Contact Us Section */}
          <section id='aboutus' className="w-full h-screen flex items-center justify-center p-6 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-6xl text-white mb-4">Contact Us</h2>
              <p className="text-2xl text-white">
                If you have any questions or would like to know more about Black Wilbur and our products, feel free to reach out to us.
              </p>
            </div>
          </section>

          <ProductSustainability />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
