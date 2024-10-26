import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import videoSrc from "../asset/homepage-vide-updated.MOV";
import ProductSustainability from "./ProductSustainability";
import GetFeatured from "./GetFeatured";

const AboutUs: React.FC = () => {
  const { section } = useParams<{ section?: string }>();
  const aboutUsRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const productSustainabilityRef = useRef<HTMLDivElement>(null);
  const getFeaturedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    switch (section) {
      case "mission":
        missionRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "values":
        valuesRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "contact":
        contactRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "sustainability":
        productSustainabilityRef.current?.scrollIntoView({
          behavior: "smooth",
        });
        break;
      case "featured":
        getFeaturedRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      default:
        aboutUsRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
    }
  }, [section]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 bg-black">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="relative w-full h-[100vh] overflow-hidden">
            <video
              src={videoSrc}
              autoPlay
              loop
              muted
              className="absolute top-1/2 left-1/2 w-[100vh] h-auto max-w-none"
              style={{
                objectFit: "contain",
                transform: "translate(-50%, -50%) rotate(270deg)",
                transformOrigin: "center",
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
      <div className="relative z-10 w-full h-full overflow-auto hide-scrollbar">
        <div className="flex flex-col">
          {/* About Us Section */}
          <section
            ref={aboutUsRef}
            className="w-full h-screen flex items-center justify-center p-6 bg-black bg-opacity-75 backdrop-blur-sm"
          >
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl text-white mb-4">About Us</h1>
              <p className="text-lg md:text-2xl text-white">
                Black Wilbur, as the name suggests, is a monochrome-inspired
                clothing brand emphasizing urban designs that highlight the
                wearer’s exquisite side, considering black as the universally
                admired color.
              </p>
              <p className="text-lg md:text-2xl text-white mt-4">
                Founded in India in 2024 by Aayush Budhrani, who holds a vision
                of soaring to greater heights in the designer apparel industry
                with the newest trends and creative ideas.
              </p>
            </div>
          </section>

          {/* Our Mission Section */}
          <section
            ref={missionRef}
            className="w-full h-screen flex items-center justify-center p-6 bg-black bg-opacity-75 backdrop-blur-sm"
          >
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl text-white mb-4">Our Mission</h2>
              <p className="text-lg md:text-2xl text-white">
                Black Wilbur creates inimitable pieces that can be worn for
                years. Each piece is crafted to be more than just clothing—it's
                an extension of who you are.
              </p>
            </div>
          </section>

          {/* Our Values Section */}
          <section
            ref={valuesRef}
            className="w-full h-screen flex items-center justify-center p-6 bg-black bg-opacity-75 backdrop-blur-sm"
          >
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl text-white mb-4">Our Values</h2>
              <p className="text-lg md:text-2xl text-white">
                After sketching the designs, we send them to our factories where
                the samples are created. Using bespoke illustrations and
                photography, all our prints and graphics are designed in-house.
              </p>
            </div>
          </section>

          {/* Contact Us Section */}
          <section
            ref={contactRef}
            className="w-full h-screen flex items-center justify-center p-6 bg-black bg-opacity-75 backdrop-blur-sm"
          >
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl text-white mb-4">Contact Us</h2>
              <p className="text-lg md:text-2xl text-white">
                If you have any questions or would like to know more about Black
                Wilbur and our products, feel free to reach out to us.
              </p>
            </div>
          </section>

          {/* Product Sustainability Section */}
          <section ref={productSustainabilityRef}>
            <ProductSustainability />
          </section>

          {/* Get Featured Section */}
          <section
            ref={getFeaturedRef}
            className="w-full h-screen flex items-center justify-center p-6 bg-black bg-opacity-75 backdrop-blur-sm"
          >
            <GetFeatured />
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
