import React, { useState } from 'react';

interface Image {
  id: number;
  productId: number;
  url: string;
}

const ImagesManagement: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample product data
  const products = [
    { id: 1, name: 'Product 1' },
    { id: 2, name: 'Product 2' },
    { id: 3, name: 'Product 3' },
  ];

  const handleAddImage = () => {
    if (selectedProductId && imageUrl) {
      const newImage: Image = {
        id: Date.now(), // Unique ID generation
        productId: selectedProductId,
        url: imageUrl,
      };
      setImages([...images, newImage]);
      setImageUrl('');
      setSelectedProductId(null);
      setIsModalOpen(false); // Close modal after adding image
    }
  };

  const handleDeleteImage = (id: number) => {
    setImages(images.filter(image => image.id !== id));
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-left">Image Management</h1>

      <button onClick={() => setIsModalOpen(true)} className="bg-white text-black p-2 rounded">
        Add Image
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add Image</h2>
            <div className="mb-4">
              <select
                value={selectedProductId || ''}
                onChange={(e) => setSelectedProductId(Number(e.target.value))}
                className="border p-2 mr-2 bg-gray-700 text-white rounded"
              >
                <option value="" disabled>Select Product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>

              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Image URL"
                className="border p-2 bg-gray-700 text-white rounded"
              />
            </div>
            <div className="flex justify-end">
              <button onClick={handleAddImage} className="bg-gray-600 text-white p-2 rounded mr-2">
                Add
              </button>
              <button onClick={() => setIsModalOpen(false)} className="bg-red-600 text-white p-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-gray-900">
          <thead>
            <tr className="bg-gray-800">
              <th className="py-2 px-4 border-b border-gray-700 text-left">Product ID</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Image URL</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {images.map(image => (
              <tr key={image.id} className="hover:bg-gray-800">
                <td className="py-2 px-4 border-b border-gray-700 text-left">{image.productId}</td>
                <td className="py-2 px-4 border-b border-gray-700 text-left">{image.url}</td>
                <td className="py-2 px-4 border-b border-gray-700 text-left">
                  <button onClick={() => handleDeleteImage(image.id)} className="text-red-500">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ImagesManagement;
