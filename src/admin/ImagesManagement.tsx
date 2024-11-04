import React, { useEffect, useState } from 'react';
import { fetchProducts, uploadImage, getAllImages, deleteImage } from '../services/api';
import { ProductAdmin, Image } from '../utiles/types';

const ImagesManagement: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<ProductAdmin[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const imagesPerPage = 10; // Number of images to show per page
  const [loading, setLoading] = useState(true);

  // Fetch products and images on component mount
  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedProducts, fetchedImages] = await Promise.all([
        fetchProducts(),
        getAllImages(currentPage, imagesPerPage) // Fetch paginated images
      ]);
      setProducts(fetchedProducts);
      setImages(fetchedImages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 3600000); 
    return () => clearInterval(intervalId);
  }, [currentPage]); // Re-fetch data when currentPage changes

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
      await uploadImage({ product: selectedProductId, image: selectedFile });
      setSelectedFile(null);
      setSelectedProductId(null);
      setIsModalOpen(false);
      fetchData();
      alert("Image uploaded successfully!"); 
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
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
    const product = products.find(product => product.id === productId);
    return product ? product.name : "Unknown Product";
  };

  // Calculate total pages based on fetched images
  const totalPages = Math.ceil(images.length / imagesPerPage);

  // Handle pagination
  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPage < totalPages - 1) {
      setCurrentPage(prevPage => prevPage + 1);
    } else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(prevPage => prevPage - 1);
    }
    // Fetch images for the new page
    fetchData();
  };

  // Get current images for display
  const currentImages = images.slice(currentPage * imagesPerPage, (currentPage + 1) * imagesPerPage);

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
            {loading ? (
              <tr>
                <td colSpan={4} className="py-2 text-center">Loading images...</td>
              </tr>
            ) : (
              currentImages.map(image => (
                <tr key={image.id} className="hover:bg-gray-800">
                  <td className="py-2 px-4 border-b border-gray-700 text-left">{image.product_id}</td>
                  <td className="py-2 px-4 border-b border-gray-700 text-left">{getProductName(image.product_id)}</td>
                  <td className="py-2 px-4 border-b border-gray-700 text-left">
                    <img src={image.image_url} alt="Product" className="w-16 h-16 object-cover" loading="lazy" />
                  </td>
                  <td className="py-2 px-4 border-b border-gray-700 text-left">
                    <button onClick={() => handleDeleteImage(image.id)} className="text-red-500">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button 
          onClick={() => handlePageChange('prev')}
          disabled={currentPage === 0}
          className="bg-gray-600 text-white p-2 rounded"
        >
          Previous
        </button>
        <span className="text-white">{`Page ${currentPage + 1} of ${totalPages}`}</span>
        <button 
          onClick={() => handlePageChange('next')}
          disabled={currentPage >= totalPages - 1}
          className="bg-gray-600 text-white p-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ImagesManagement;
