import React, { useEffect, useState } from 'react';
import { fetchProducts, fetchProductVariations, createProductVariation, deleteProductVariation } from '../services/api';
import { ProductAdmin, ProductVariation } from '../utiles/types';
import Popup from './helper/Popup'; // Import your Popup component

const SizeQuantityManagement: React.FC = () => {
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const [products, setProducts] = useState<ProductAdmin[]>([]);
  const [sizes, setSize] = useState<ProductVariation[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [newQuantity, setNewQuantity] = useState<number | ''>('');
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [sizeToRemove, setSizeToRemove] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
      const fetchedSizes = await fetchProductVariations();
      setSize(fetchedSizes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 12000);

    return () => clearInterval(intervalId);
  }, []);

  const handleAddSize = async () => {
    const productId = selectedProduct; 
    if (selectedSize && newQuantity && productId) {
      const newVariation = {
        product: productId,
        size: selectedSize,
        quantity: Number(newQuantity),
      };
  
      try {
        const createdVariation = await createProductVariation(newVariation);
        setSize((prevSizes) => [...prevSizes, createdVariation]);
        setSelectedSize('');
        setNewQuantity('');
      } catch (error) {
        console.error("Error adding size:", error);
      }
    }
  };

  const handleRemoveSize = async (id: string) => {
    setSizeToRemove(id);
    setPopupVisible(true); // Show popup for confirmation
  };

  const confirmRemoveSize = async () => {
    if (sizeToRemove) {
      try {
        await deleteProductVariation(sizeToRemove);
        setSize(sizes.filter((variation) => variation.id !== sizeToRemove));
        setSizeToRemove(null);
      } catch (error) {
        console.error("Error removing size:", error);
      } finally {
        setPopupVisible(false); // Hide popup after action
      }
    }
  };

  const closePopup = () => {
    setSizeToRemove(null);
    setPopupVisible(false);
  };

  // Group sizes by product
  const groupedSizes = sizes.reduce((acc, variation) => {
    if (!acc[variation.product]) {
      acc[variation.product] = [];
    }
    acc[variation.product].push(variation);
    return acc;
  }, {} as Record<string, ProductVariation[]>);

  return (
    <div className="p-6 bg-black text-white rounded shadow-lg min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Size and Quantity Management</h2>

      {/* Product Selection */}
      <div className="mb-4">
        <label className="block mb-2 text-lg font-semibold">Select Product</label>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="" disabled>Select a product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      {/* Size and Quantity Input */}
      <div className="mb-6">
        <label className="block mb-2 text-lg font-semibold">Add Size and Quantity</label>
        <div className="flex space-x-2">
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-1/2 p-2 rounded bg-gray-700 text-white"
          >
            <option value="" disabled>Select a size</option>
            {availableSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantity"
            value={newQuantity}
            onChange={(e) => setNewQuantity(Number(e.target.value))}
            className="w-1/2 p-2 rounded bg-gray-700 text-white"
          />
          <button
            onClick={handleAddSize}
            className="bg-blue-600 p-2 rounded text-white hover:bg-blue-500"
          >
            Add
          </button>
        </div>
      </div>

      {/* Display sizes grouped by product */}
      <div className="overflow-x-auto">
        {Object.keys(groupedSizes).map((productId) => (
          <div key={productId} className="mb-6">
            <h3 className="text-lg font-semibold mb-2">
              {products.find(product => product.id === productId)?.name || 'Unknown Product'}
            </h3>
            <table className="table-auto w-full border border-gray-600 mb-4">
              <thead className="bg-gray-800">
                <tr>
                  <th className="border border-gray-600 p-2 text-left">Size</th>
                  <th className="border border-gray-600 p-2 text-left">Quantity</th>
                  <th className="border border-gray-600 p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedSizes[productId].length > 0 ? (
                  groupedSizes[productId].map((item) => (
                    <tr key={item.id} className="hover:bg-gray-700">
                      <td className="border border-gray-600 p-2 text-left">{item.size}</td>
                      <td className="border border-gray-600 p-2 text-left">{item.quantity}</td>
                      <td className="border border-gray-600 p-2 text-left">
                        <button
                          onClick={() => handleRemoveSize(item.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="border border-gray-600 p-2 text-left text-gray-400">
                      No sizes and quantities added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Popup for confirmation */}
      <Popup
        isVisible={isPopupVisible}
        title="Confirm Deletion"
        message="Are you sure you want to delete this size variation?"
        onClose={closePopup}
        onConfirm={confirmRemoveSize}
      />
    </div>
  );
};

export default SizeQuantityManagement;
