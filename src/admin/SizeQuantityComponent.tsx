import React, { useEffect, useState } from 'react';
import { fetchProducts, fetchProductVariations, createProductVariation, deleteProductVariation } from '../services/api';
import { ProductAdmin, ProductVariation } from '../utiles/types';

const SizeQuantityManagement: React.FC = () => {
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const [products, setProducts] = useState<ProductAdmin[]>([]);
  const [sizes, setSize] = useState<ProductVariation[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [newQuantity, setNewQuantity] = useState<number | ''>('');

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
    }, 6000);

    return () => clearInterval(intervalId);
  }, []);

  const handleAddSize = async () => {
    const productId = selectedProduct; 
    if (selectedSize && newQuantity && productId) {
      // Log the selected size, quantity, and product ID before posting  
      const newVariation = {
        product: productId,
        size: selectedSize,
        quantity: Number(newQuantity), // Ensure quantity is a number
      };
  
      try {
        console.log(newVariation);
        const createdVariation = await createProductVariation(newVariation);
        setSize((prevSizes) => [...prevSizes, createdVariation]); // Add the new variation to state
        setSelectedSize(''); // Reset selected size
        setNewQuantity(''); // Reset new quantity
      } catch (error) {
        console.error("Error adding size:", error);
      }
    }
  };
  

  const handleRemoveSize = async (id: string) => {
    try {
      await deleteProductVariation(id); // Delete the variation using its ID
      setSize(sizes.filter((variation) => variation.id !== id)); // Update state
    } catch (error) {
      console.error("Error removing size:", error);
    }
  };

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

      {/* Table of Sizes and Quantities */}
      <div className="overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Current Sizes and Quantities</h3>
        <table className="table-auto w-full border border-gray-600">
          <thead className="bg-gray-800">
            <tr>
              <th className="border border-gray-600 p-2 text-left">Product</th>
              <th className="border border-gray-600 p-2 text-left">Size</th>
              <th className="border border-gray-600 p-2 text-left">Quantity</th>
              <th className="border border-gray-600 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sizes.length > 0 ? (
              sizes.map((item) => (
                <tr key={item.id} className="hover:bg-gray-700">
                  <td className="border border-gray-600 p-2 text-left">{item.product}</td>
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
                <td colSpan={4} className="border border-gray-600 p-2 text-left text-gray-400">
                  No sizes and quantities added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SizeQuantityManagement;
