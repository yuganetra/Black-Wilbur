import React from "react";
import { useNavigate } from "react-router-dom";

const GetFeatured: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="relative w-full p-4 md:p-8 bg-black bg-opacity-30 text-white rounded-lg shadow-lg overflow-hidden animate-fade-in">
      <h2 className="text-sm sm:text-3xl md:text-5xl font-bold mb-6  text-center">
        Get Featured on BlackWilbur.com!
      </h2>
      <p className="text-sm sm:text-lg md:text-xl mb-2 text-center font-semibold">
        Showcase your style with these simple steps:
      </p>
      <ol className="list-decimal list-inside text-xs sm:text-xl md:text-lg space-y-2 cursor-pointer">
        <li
          onClick={() => handleNavigate("/collection")}
          className="flex items-center transition hover:text-yellow-400 "
        >
          1. Buy our products.
        </li>
        <li className="flex items-center transition hover:text-yellow-400 ">
          2. Shoot a video with a black and gray background.
        </li>
        <li className="flex items-center transition hover:text-yellow-400 ">
          3. Send 2 photos (16:9 ratio).
        </li>
        <li className="flex items-center transition hover:text-yellow-400 ">
          4. Video duration: 25 to 30 seconds.
        </li>
        <li className="flex items-center transition hover:text-yellow-400 ">
          5. Send everything to our email.
        </li>
        <li className="flex items-center transition hover:text-yellow-400 ">
          6. If selected, we’ll reach out via email.
        </li>
        <li className="flex items-center transition hover:text-yellow-400 ">
          7. Not selected? We'll collaborate on Instagram!
        </li>
        <li className="flex items-center transition hover:text-yellow-400 ">
          8. Get featured on our website.
        </li>
        <li className="flex items-center transition hover:text-yellow-400 ">
          9. Receive gifts and special offers!
        </li>
      </ol>
      <p className="mt-6 text-base md:text-lg text-center">
        We can’t wait to see your creativity! 
      </p>
    </div>
  );
};

export default GetFeatured;
