import React from "react";
import Modal from "react-modal";
import img1 from "../asset/Black Size Chart's/Black Size Chart's-1.png";
import img2 from "../asset/Black Size Chart's/Black Size Chart's-2.png";
import img3 from "../asset/Black Size Chart's/Black Size Chart's-3.png";
import img4 from "../asset/Black Size Chart's/Black Size Chart's-4.png";
import img5 from "../asset/Black Size Chart's/Black Size Chart's-5.png";
import img6 from "../asset/Black Size Chart's/Black Size Chart's-6.png";
import img7 from "../asset/Black Size Chart's/Black Size Chart's-7.png";

Modal.setAppElement('#root');

interface SizeChartImagesProps {
  isOpen: boolean;
  onClose: () => void;
}

const SizeChartImages: React.FC<SizeChartImagesProps> = ({ isOpen, onClose }) => {
  const images = [img1, img2, img3, img4, img5, img6, img7];

  return (
    <div>
      {/* Modal to display images */}
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Size Chart Images"
        className="relative mx-auto w-full md:max-w-3xl bg-white top-9 p-4 rounded shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-start pt-[80px]" // Adjusting for sticky navbar
      >
        <div className="relative w-full max-w-4xl mx-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-3xl text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            &times;
          </button>

          {/* Modal Title */}
          <h2 className="text-2xl font-semibold mb-4 text-center">Size Chart</h2>

          {/* Images displayed in the modal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[70vh] px-4">
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Size Chart ${index + 1}`}
                className="w-full h-auto object-cover"
              />
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SizeChartImages;
