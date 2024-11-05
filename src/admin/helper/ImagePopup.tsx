// ImagePopup.tsx
import React from 'react';
import { ProductsImage } from '../../utiles/types';
import LazyImage from './LazyImage';

interface ImagePopupProps {
  isOpen: boolean;
  images: ProductsImage[];
  onClose: () => void;
  onDelete: (id: string) => void;
}

const ImagePopup: React.FC<ImagePopupProps> = ({ isOpen, images, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Product Images</h2>
          <button onClick={onClose} className="text-red-500 font-bold">X</button>
        </div>
        <div className="overflow-y-auto max-h-80">
          {images.length > 0 ? (
            images.map((image, index) => (
              <div key={image.id} className="flex items-center justify-between mb-4">
                <span className="text-white mr-4">{index + 1}.</span>
                <LazyImage
                  src={image.image_url}
                  alt="Product"
                  className="w-20 h-20 object-cover mr-4"
                />
                <button onClick={() => onDelete(image.id)} className="text-red-500">
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-white">No images for this product.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePopup;
