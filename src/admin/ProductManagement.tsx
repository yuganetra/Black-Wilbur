import React, { useEffect, useState } from 'react';
import ProductModal from './helper/ProductModal'; // Reuse ProductModal for add/edit
import { fetchProducts, deleteProduct } from '../services/api';
import { updateProduct } from '../services/api'; // Import update function
import { ProductAdmin } from '../utiles/types';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<ProductAdmin[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductAdmin | null>(null); // Track product being edited
  const [searchQuery, setSearchQuery] = useState(''); // Track search input

  const handleAddProduct = (product: ProductAdmin) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setProducts([...products, newProduct]);
  };

  const handleEditProduct = async (updatedProduct: ProductAdmin) => {
    try {
      const response = await updateProduct(updatedProduct.id, updatedProduct); // Call API
      setProducts(products.map(product =>
        product.id === updatedProduct.id ? response : product
      ));
      setEditingProduct(null); // Reset editing state
      setIsModalOpen(false); // Close modal
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const fetchData = async () => {
    try {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
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

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4 text-left">Product Management</h1>

      {/* Search Bar */}
      <div className="mb-4 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white w-1/3"
        />
      </div>

      <button
        onClick={() => {
          setIsModalOpen(true);
          setEditingProduct(null); // Ensure it's a new product, not editing
        }}
        className="bg-gray-800 text-white p-2 rounded mb-4 hover:bg-gray-700 transition duration-200"
      >
        Add Product
      </button>
      
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProduct={editingProduct ? handleEditProduct : handleAddProduct}
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
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-700">
                  <td className="border border-white p-2 text-left">{product.name}</td>
                  <td className="border border-white p-2 text-left">{product.description}</td>
                  <td className="border border-white p-2 text-left">{product.price}</td>
                  <td className="border border-white p-2 text-left">{product.category}</td>
                  <td className="border border-white p-2 text-left">
                    <button
                      onClick={() => {
                        setEditingProduct(product); // Set product for editing
                        setIsModalOpen(true); // Open modal
                      }}
                      className="text-yellow-500 hover:text-yellow-400 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="border border-white p-2 text-left">
                  No products available. <span className="text-blue-500 cursor-pointer" onClick={() => setIsModalOpen(true)}>Add Products</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
