import React, { useState } from "react";
import Modal from "react-modal";
import img1 from "../asset/Black Size Chart's/Black Size Chart's-1.png";
import img2 from "../asset/Black Size Chart's/Black Size Chart's-2.png";
import img3 from "../asset/Black Size Chart's/Black Size Chart's-3.png";
import img4 from "../asset/Black Size Chart's/Black Size Chart's-4.png";
import img5 from "../asset/Black Size Chart's/Black Size Chart's-5.png";
import img7 from "../asset/Black Size Chart's/Black Size Chart's-7.png";
import dosAndDontsImg from "../asset/Black Size Chart's/do&don't.jpg"; // Do's and Don'ts image

Modal.setAppElement("#root");

interface SizeChartImagesProps {
  isOpen: boolean;
  onClose: () => void;
}

const SizeChartImages: React.FC<SizeChartImagesProps> = ({ isOpen, onClose }) => {
  const [showSizeChart, setShowSizeChart] = useState(true);
  const images = [img1, img2, img3, img4, img5, img7];

  return (
    <div>
      {/* Modal to display images */}
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Size Chart Images"
        className="relative mx-auto w-full max-w-3xl bg-black text-white p-4 rounded shadow-lg outline-none "
        overlayClassName="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-start pt-[80px]"
      >
        <div className="relative w-full max-w-4xl mx-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-3xl text-white hover:text-gray-400 focus:outline-none"
          >
            &times;
          </button>

          {/* Modal Title */}
          <h2 className="text-2xl font-semibold mb-4 text-center">
            {showSizeChart ? "Size Chart" : "Do's and Don'ts"}
          </h2>

          {/* Toggle Buttons */}
          <div className="flex justify-center mb-4 space-x-4">
            <button
              onClick={() => setShowSizeChart(true)}
              className={`px-4 py-2 rounded transition-colors duration-300 ${
                showSizeChart ? "bg-white text-black" : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              Size Chart
            </button>
            <button
              onClick={() => setShowSizeChart(false)}
              className={`px-4 py-2 rounded transition-colors duration-300 ${
                !showSizeChart ? "bg-white text-black" : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              Do's and Don'ts
            </button>
          </div>

          {/* Conditional Content */}
          {showSizeChart ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[70vh] px-4">
              {images.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Size Chart ${index + 1}`}
                  className="w-full h-auto object-cover rounded-lg shadow-md"
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 flex justify-center px-4">
              <img src={dosAndDontsImg} alt="Do's and Don'ts" className="w-full h-96 max-w-md  object-fill rounded-lg shadow-md" />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SizeChartImages;
