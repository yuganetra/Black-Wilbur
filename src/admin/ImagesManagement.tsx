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
  const [selectedProductImages, setSelectedProductImages] = useState<
    ProductsImage[]
  >([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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
      alert("Images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
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

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-left">Image Management</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-white text-black p-2 rounded"
      >
        Add Images
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Add Images</h2>
            <div className="mb-4">
              <select
                value={selectedProductId || ""}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="border p-2 mr-2 bg-gray-700 text-white rounded w-full"
              >
                <option value="" disabled>
                  Select Product
                </option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>

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
                className="bg-gray-600 text-white p-2 rounded mr-2"
              >
                Add
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
              <th className="py-2 px-4 border-b border-gray-700 text-left">
                #
              </th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">
                Product ID
              </th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">
                Product Name
              </th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">
                Image Count
              </th>
              <th className="py-2 px-4 border-b border-gray-700 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-2 text-center">
                  Loading images...
                </td>
              </tr>
            ) : (
              products.map((product, index) => {
                const imageCount = images.filter(
                  (image) => image.product_id === product.id
                ).length;
                return (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-800 cursor-pointer"
                  >
                    <td className="py-2 px-4 border-b border-gray-700 text-left">
                      {index + 1}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700 text-left">
                      {product.id}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700 text-left">
                      {product.name}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700 text-left">
                      {imageCount}
                    </td>
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
