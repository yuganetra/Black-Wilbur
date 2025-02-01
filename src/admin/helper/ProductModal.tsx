import React, { useState, useEffect } from "react";
import { ProductAdmin, Category } from "../../utiles/types"; // Adjust your imports accordingly
import { fetchCategories, addProduct } from "../../services/api";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: ProductAdmin) => void; // Optional, can be removed if not used
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null); // Changed to File
  const [productCategory, setProductCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false); // To manage the loading state for the button

  useEffect(() => {
    const fetchCategoriesdata = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    if (isOpen) fetchCategoriesdata();
  }, [isOpen]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = categories.find(
      (category) => category.id === selectedCategoryId
    );

    if (selectedCategory) {
      setProductCategory(selectedCategory);
    } else {
      setProductCategory(null);
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setProductImage(files[0]); // Store only the first selected image
    }
  };

  const handleAddProduct = () => {
    if (!productCategory || !productImage) {
      alert("Please select a category and upload an image.");
      return;
    }

    const formData = new FormData();

    // Append the product details
    formData.append("name", productName);
    formData.append("price", productPrice);
    formData.append("description", productDescription);
    formData.append("category", productCategory.id.toString());
    formData.append("image", productImage); // Ensure this is the File object

    setLoading(true); // Start loading

    // Call the API to add the product
    addProduct(formData)
      .then((newProduct) => {
        onAddProduct(newProduct);
        setProductName("");
        setProductDescription("");
        setProductPrice("");
        setProductImage(null);
        setProductCategory(null);
        onClose();
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        alert("Failed to add product. Please try again.");
      })
      .finally(() => {
        setLoading(false); // Stop loading after the response
      });
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-black p-6 rounded shadow-md w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] h-auto max-h-[90vh] overflow-auto mt-16">
            <h2 className="text-xl font-bold mb-4 text-white">Add Product</h2>

            {/* Product Name Input */}
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter Product Name"
              className="border border-white text-white bg-transparent p-2 w-full mb-2"
            />

            {/* Product Description Input */}
            <input
              type="text"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Enter Product Description"
              className="border border-white text-white bg-transparent p-2 w-full mb-2"
            />

            {/* Product Price Input */}
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              placeholder="Enter Product Price"
              className="border border-white text-white bg-transparent p-2 w-full mb-2"
            />

            {/* Category Dropdown */}
            <select
              id="productCategory"
              value={productCategory?.id || ""}
              onChange={handleCategoryChange}
              className="border border-white text-white bg-transparent p-2 w-full mb-2"
            >
              <option value="" className="text-black">
                Select Category
              </option>
              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                  className="text-black"
                >
                  {category.name}
                </option>
              ))}
            </select>

            {/* Display Selected Category */}
            <div className="text-white mb-2">
              Selected Category: {productCategory?.name || "None"}
            </div>

            {/* Image Upload */}
            <div className="text-white mb-2">
              <label className="block mb-1">Upload Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-white"
              />
            </div>

            {/* Image Preview */}
            {productImage && (
              <div className="w-16 h-16 mb-4">
                <img
                  src={URL.createObjectURL(productImage)}
                  alt="Product Preview"
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            {/* Add Product Button */}
            <div className="mt-4">
              <button
                onClick={handleAddProduct}
                disabled={loading} // Disable the button while loading
                className="bg-white text-black p-2 rounded mr-2"
              >
                {loading ? (
                  <div className="animate-spin border-2 border-t-2 border-white rounded-full w-4 h-4"></div> // Show spinner while loading
                ) : (
                  "Add Product"
                )}
              </button>
              <button
                onClick={onClose}
                className="bg-red-500 text-white p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductModal;
