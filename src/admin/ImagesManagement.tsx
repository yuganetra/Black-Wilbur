import React, { useEffect, useState } from "react";
import {
  fetchProducts,
  uploadImage,
  getAllImages,
  deleteImage,
} from "../services/api";
import { ProductAdmin, ProductsImage } from "../utiles/types";
import ImagePopup from "./helper/ImagePopup";

const ImagesManagement: React.FC = () => {
  const [images, setImages] = useState<ProductsImage[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<ProductAdmin[]>([]);
  const [selectedProductImages, setSelectedProductImages] = useState<ProductsImage[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // For search in modal
  const [filteredProducts, setFilteredProducts] = useState<ProductAdmin[]>([]);
  const [globalSearchQuery, setGlobalSearchQuery] = useState(""); // For global search
  const [globalFilteredProducts, setGlobalFilteredProducts] = useState<ProductAdmin[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedProducts, fetchedImages] = await Promise.all([
        fetchProducts(),
        getAllImages(),
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
  }, []);

  useEffect(() => {
    setGlobalFilteredProducts(
      products.filter(product =>
        product.name.toLowerCase().includes(globalSearchQuery.toLowerCase())
      )
    );
  }, [globalSearchQuery, products]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
    }
  };

  const handleAddImages = async () => {
    if (!selectedProductId || selectedFiles.length === 0) {
      console.error("Please select a product and at least one image.");
      return;
    }

    setIsButtonDisabled(true); // Disable button during upload
    setLoading(true); // Show loader

    try {
      await Promise.all(
        selectedFiles.map((file) =>
          uploadImage({ product: selectedProductId, image: file })
        )
      );
      setSelectedFiles([]);
      setSelectedProductId(null);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      setIsButtonDisabled(false); // Re-enable button after upload
      setLoading(false); // Hide loader
    }
  };

  const handleDeleteImage = async (id: string) => {
    try {
      await deleteImage(id);
      setImages(images.filter((image) => image.id !== id));
      setSelectedProductImages(
        selectedProductImages.filter((image) => image.id !== id)
      );
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const openPopup = (productId: string) => {
    const productImages = images.filter(
      (image) => image.product_id === productId
    );
    setSelectedProductImages(productImages);
    setIsPopupOpen(true);
  };

  const closePopup = () => setIsPopupOpen(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilteredProducts(
      products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const handleProductSelect = (product: ProductAdmin) => {
    setSearchQuery(product.name); // Set the selected product name in the input field
    setSelectedProductId(product.id); // Set the selected product ID
    setFilteredProducts([]); // Clear the filtered products list
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-left">Image Management</h1>
      {/* Global Search Bar */}
      <div className="flex gap-12 mb-6">
        <input
          type="text"
          placeholder="Search products globally..."
          value={globalSearchQuery}
          onChange={(e) => setGlobalSearchQuery(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white w-full"
        />
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-white text-black p-2 rounded"
      >
        Add Images
      </button>

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Add Images</h2>
            <div className="mb-4">
              {/* Searchable Product Dropdown */}
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search products..."
                  className="p-2 rounded bg-gray-700 text-white w-full"
                />
                {searchQuery && filteredProducts.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 text-white rounded shadow-lg max-h-60 overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
                        onClick={() => handleProductSelect(product)} // Close dropdown and set selected product
                      >
                        {product.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* File Upload */}
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                className="border p-2 bg-gray-700 text-white rounded w-full mt-2"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddImages}
                disabled={isButtonDisabled}
                className={`bg-gray-600 text-white p-2 rounded mr-2 ${isButtonDisabled ? "cursor-not-allowed opacity-50" : ""}`}
              >
                {loading ? (
                  <span>Loading...</span>
                ) : (
                  "Add"
                )}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-600 text-white p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-gray-900 border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="py-2 px-4 border-b border-gray-700 text-left">#</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Product ID</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Product Name</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Image Count</th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-2 text-center">Loading images...</td>
              </tr>
            ) : (
              globalFilteredProducts.map((product, index) => {
                const imageCount = images.filter((image) => image.product_id === product.id).length;
                return (
                  <tr key={product.id} className="hover:bg-gray-800 cursor-pointer">
                    <td className="py-2 px-4 border-b border-gray-700 text-left">{index + 1}</td>
                    <td className="py-2 px-4 border-b border-gray-700 text-left">{product.id}</td>
                    <td className="py-2 px-4 border-b border-gray-700 text-left">{product.name}</td>
                    <td className="py-2 px-4 border-b border-gray-700 text-left">{imageCount}</td>
                    <td className="py-2 px-4 border-b border-gray-700 text-left">
                      <button
                        onClick={() => openPopup(product.id)}
                        className="text-blue-500 underline"
                      >
                        View Images
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ImagePopup
        isOpen={isPopupOpen}
        images={selectedProductImages}
        onClose={closePopup}
        onDelete={handleDeleteImage}
      />
    </div>
  );
};

export default ImagesManagement;
