import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';
import { uploadImage, getAllImages, deleteImage } from '../services/api'; // Import API functions
import { ProductAdmin,Image } from '../utiles/types';

const ImagesManagement: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<ProductAdmin[]>([]);

  // Fetch products and images on component mount
  const fetchData = async () => {
    try {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
      const fetchedImages = await getAllImages();
      setImages(fetchedImages);
      console.log(fetchedImages)

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 6000); // refresh data every 6 seconds
    return () => clearInterval(intervalId);
  }, []);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Upload image to server
  const handleAddImage = async () => {
    if (!selectedProductId || !selectedFile) {
        console.error("Please select a product and an image.");
        return;
    }

    try {
      console.log("selectedProductId",selectedProductId , "images", images)
        await uploadImage({ product: selectedProductId, image: selectedFile });
        setSelectedFile(null);
        setSelectedProductId(null);
        setIsModalOpen(false);
        fetchData();
        alert("Image uploaded successfully!"); 
    } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again."); // User feedback
    }
};

  // Delete image by ID
  const handleDeleteImage = async (id: string) => {
    try {
      await deleteImage(id);
      setImages(images.filter(image => image.id !== id));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  // Helper function to get product name by ID
  const getProductName = (productId: string) => {
    const product = products.find((product) => product.id === productId);
    return product ? product.name : "Unknown Product";
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
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="border p-2 mr-2 bg-gray-700 text-white rounded"
              >
                <option value="" disabled>Select Product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>

              <input
                type="file"
                onChange={handleFileChange}
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
              <th className="py-2 px-4 border-b border-gray-700 text-left">Product Name</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Image</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {images.map(image => (
              <tr key={image.id} className="hover:bg-gray-800">
                <td className="py-2 px-4 border-b border-gray-700 text-left">{image.product_id}</td>
                <td className="py-2 px-4 border-b border-gray-700 text-left">{getProductName(image.product_id)}</td>
                <td className="py-2 px-4 border-b border-gray-700 text-left">
                  <img src={image.image_url} alt="Product" className="w-16 h-16 object-cover" />
                </td>
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
