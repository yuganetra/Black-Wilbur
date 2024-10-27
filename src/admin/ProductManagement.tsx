import React, { useEffect, useState } from 'react';
import ProductModal from './ProductModal'; // Import the modal
import { fetchProducts } from '../services/api';
import { Product } from '../utiles/types';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const handleAddProduct = (product: Product) => {
    const newProduct = { ...product, id: Date.now() }; // Assign a unique ID
    setProducts([...products, newProduct]);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const fetchData = async () => {
    try {
      const fetchedCategories = await fetchProducts();
      console.log(fetchedCategories);
      setProducts(fetchedCategories);
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

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4 text-left">Product Management</h1>
      <button
        onClick={() => setIsModalOpen(true)} // Open modal on button click
        className="bg-gray-800 text-white p-2 rounded mb-4 hover:bg-gray-700 transition duration-200"
      >
        Add Product
      </button>
      
      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      <div className="overflow-x-auto">
        <table className="table-auto w-full mt-4 border border-white">
          <thead className="bg-gray-800">
            <tr>
              <th className="border border-white p-2 text-left">Name</th>
              <th className="border border-white p-2 text-left">Description</th>
              <th className="border border-white p-2 text-left">Price</th>
              <th className="border border-white p-2 text-left">Category</th>
              <th className="border border-white p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-700">
                <td className="border border-white p-2 text-left">{product.name}</td>
                <td className="border border-white p-2 text-left">{product.description}</td>
                <td className="border border-white p-2 text-left">{product.price}</td>
                <td className="border border-white p-2 text-left">
                  {product.category ? product.category.name : 'No Category'}
                </td>
                <td className="border border-white p-2 text-left">
                  <button 
                    onClick={() => handleDeleteProduct(product.id)} 
                    className="text-red-500 hover:text-red-400"
                  >
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

export default ProductManagement;
