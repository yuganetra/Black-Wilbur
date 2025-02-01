import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { fetchProducts, fetchProductVariations, createProductVariation, deleteProductVariation } from '../services/api';
import { ProductAdmin, ProductVariation } from '../utiles/types';
import Popup from './helper/Popup';

interface SizeQuantityMap {
  [key: string]: number | null;
}

const SizeQuantityManagement = () => {
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const [products, setProducts] = useState<ProductAdmin[]>([]);
  const [sizes, setSizes] = useState<ProductVariation[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sizeQuantities, setSizeQuantities] = useState<SizeQuantityMap>({});
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [sizeToRemove, setSizeToRemove] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
      const fetchedSizes = await fetchProductVariations();
      setSizes(fetchedSizes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Initial data fetch only
  useEffect(() => {
    fetchData();
  }, []);

  // Initialize with existing sizes only when product is selected
  useEffect(() => {
    if (selectedProduct) {
      const existingSizes = sizes
        .filter(size => size.product === selectedProduct)
        .reduce((acc, size) => ({
          ...acc,
          [size.size]: size.quantity
        }), {} as SizeQuantityMap);

      setSizeQuantities(existingSizes);
    } else {
      setSizeQuantities({});
    }
  }, [selectedProduct, sizes]);

  const handleQuantityChange = (size: string, value: string) => {
    const quantity = value === '' ? null : parseInt(value);
    setSizeQuantities(prev => ({
      ...prev,
      [size]: quantity
    }));
  };

  const handleSubmit = async () => {
    if (!selectedProduct) return;
    setIsSubmitting(true);

    try {
      const updatePromises = Object.entries(sizeQuantities)
        .filter(([_, quantity]) => quantity !== null && quantity > 0)
        .map(([size, quantity]) => {
          return createProductVariation({
            product: selectedProduct,
            size,
            quantity: quantity as number
          });
        });

      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
        await fetchData(); // Refresh only after successful update
      }
      setSelectedProduct('');
      setSearchTerm('');
      setSizeQuantities({});
    } catch (error) {
      console.error("Error updating sizes:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-black text-white rounded shadow-lg min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Size and Quantity Management</h2>

      <div className="mb-6">
        <label className="block mb-2 text-lg font-semibold">Select Product</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 p-2 rounded bg-gray-700 text-white"
            placeholder="Search products..."
          />
        </div>
        {searchTerm && (
          <div className="mt-2 max-h-60 overflow-y-auto bg-gray-800 rounded">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  setSelectedProduct(product.id);
                  setSearchTerm(product.name);
                }}
                className="p-2 hover:bg-gray-700 cursor-pointer"
              >
                {product.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Set Quantities for All Sizes</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {availableSizes.map((size) => (
              <div key={size} className="bg-gray-800 p-4 rounded">
                <label className="block text-lg mb-2">{size}</label>
                <input
                  type="number"
                  min="0"
                  value={sizeQuantities[size] ?? ''}
                  onChange={(e) => handleQuantityChange(size, e.target.value)}
                  placeholder="Enter quantity"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || Object.values(sizeQuantities).every(v => v === null)}
            className="mt-4 bg-blue-600 p-2 px-4 rounded text-white hover:bg-blue-500 disabled:bg-gray-600"
          >
            {isSubmitting ? 'Updating...' : 'Update All Sizes'}
          </button>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">
          Current Inventory
          <button 
            onClick={fetchData}
            className="ml-4 px-3 py-1 text-sm bg-gray-700 rounded hover:bg-gray-600"
          >
            Refresh
          </button>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-2 text-left">Product</th>
                {availableSizes.map(size => (
                  <th key={size} className="p-2 text-center">{size}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const productSizes = sizes.filter(s => s.product === product.id);
                return (
                  <tr key={product.id} className="border-t border-gray-700">
                    <td className="p-2">{product.name}</td>
                    {availableSizes.map(size => {
                      const sizeData = productSizes.find(s => s.size === size);
                      return (
                        <td key={size} className="p-2 text-center">
                          {sizeData ? sizeData.quantity : '-'}
                        </td>
                      );
                    })}
                  </tr>
                )}
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Popup
        isVisible={isPopupVisible}
        title="Confirm Deletion"
        message="Are you sure you want to delete this size variation?"
        onClose={() => setPopupVisible(false)}
        onConfirm={async () => {
          if (sizeToRemove) {
            await deleteProductVariation(sizeToRemove);
            await fetchData();
            setPopupVisible(false);
          }
        }}
      />
    </div>
  );
};

export default SizeQuantityManagement;